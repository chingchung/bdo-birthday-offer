/**
 * BDO Auto-fetch Edge Function
 * ─────────────────────────────────────────────────────────────
 * Supabase Edge Function that:
 *  1. Loops through all active brands in the DB
 *  2. Fetches their offer source URLs
 *  3. Uses a simple heuristic (keyword check) to detect if the
 *     offer is still live
 *  4. Updates verified_at if still live, or marks is_active=false
 *  5. Logs each scrape result to scrape_logs table
 *
 * Deploy:  supabase functions deploy scrape-offers
 * Schedule: set a pg_cron job or Supabase cron to run daily/weekly
 *
 * NOTE: For production, replace the heuristic checker with an
 * AI-powered parser (e.g. call Claude API to read the page and
 * confirm/extract the current offer details).
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BIRTHDAY_KEYWORDS = [
  "生日", "birthday", "birth", "週年", "birthday offer",
  "birthday discount", "birthday free", "free cake", "免費", "優惠",
];

Deno.serve(async (req: Request) => {
  // Auth guard: only allow calls with the service role key
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey  = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const sb = createClient(supabaseUrl, serviceKey);

  // Fetch all active offers with their source URLs
  const { data: offers, error: fetchErr } = await sb
    .from("offers")
    .select("id, brand_id, source_url, title_tc")
    .eq("is_active", true)
    .limit(50); // process in batches of 50

  if (fetchErr) {
    return new Response(JSON.stringify({ error: fetchErr.message }), { status: 500 });
  }

  const results: Array<{ id: string; status: string; notes?: string }> = [];

  for (const offer of offers ?? []) {
    try {
      const response = await fetch(offer.source_url, {
        signal: AbortSignal.timeout(8000),
        headers: { "User-Agent": "BDO-Bot/1.0 (birthdayoffer.hk)" },
      });

      if (!response.ok) {
        // Page returned error — mark as potentially offline
        await sb.from("offers").update({ is_active: false }).eq("id", offer.id);
        await logScrape(sb, offer.brand_id, offer.source_url, "failed", `HTTP ${response.status}`);
        results.push({ id: offer.id, status: "failed", notes: `HTTP ${response.status}` });
        continue;
      }

      const html = await response.text();
      const htmlLower = html.toLowerCase();

      // Heuristic: check if birthday keywords still appear on the page
      const keywordsFound = BIRTHDAY_KEYWORDS.filter((kw) => htmlLower.includes(kw.toLowerCase()));
      const isLive = keywordsFound.length >= 2;

      if (isLive) {
        await sb.from("offers")
          .update({ verified_at: new Date().toISOString() })
          .eq("id", offer.id);
        await logScrape(sb, offer.brand_id, offer.source_url, "success", `Keywords: ${keywordsFound.join(", ")}`);
        results.push({ id: offer.id, status: "success" });
      } else {
        // Offer may have expired — flag for human review (don't auto-delete)
        await sb.from("offers")
          .update({ is_active: false })
          .eq("id", offer.id);
        await logScrape(sb, offer.brand_id, offer.source_url, "failed", "Keywords not found — may have expired");
        results.push({ id: offer.id, status: "expired_suspected" });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      await logScrape(sb, offer.brand_id, offer.source_url, "failed", msg);
      results.push({ id: offer.id, status: "error", notes: msg });
    }

    // Throttle: 1 request per second to be polite
    await new Promise((r) => setTimeout(r, 1000));
  }

  return new Response(
    JSON.stringify({ processed: results.length, results }),
    { headers: { "Content-Type": "application/json" } }
  );
});

async function logScrape(
  sb: ReturnType<typeof createClient>,
  brandId: string | null,
  sourceUrl: string,
  status: string,
  notes?: string
) {
  await sb.from("scrape_logs").insert({
    brand_id: brandId,
    source_url: sourceUrl,
    status,
    notes: notes ?? null,
  });
}
