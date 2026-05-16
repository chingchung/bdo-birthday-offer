/**
 * BDO Data Queries
 * USE_MOCK=true  → 用本地 dummy data，唔需要 Supabase（UI 開發模式）
 * USE_MOCK=false → 連接真實 Supabase DB（生產模式）
 */

import type { Brand, Category, District, Offer, OfferFilters, Tag } from "@/types";
import {
  MOCK_CATEGORIES,
  MOCK_DISTRICTS,
  MOCK_OFFERS,
} from "@/lib/mock-data";

// ── 切換開關：true = mock，false = 真實 DB ──────────────────
const USE_MOCK = true;

// ── Mock helpers ─────────────────────────────────────────────
function filterOffers(offers: Offer[], filters: OfferFilters): Offer[] {
  return offers.filter((o) => {
    if (filters.isFree && !o.is_free) return false;
    if (filters.validity && o.validity_type !== filters.validity) return false;
    if (filters.category && o.brand?.category?.slug !== filters.category) return false;
    if (filters.district && o.brand?.district?.slug !== filters.district) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      return (
        o.title_tc.toLowerCase().includes(q) ||
        o.description_tc.toLowerCase().includes(q) ||
        (o.brand?.name_tc ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });
}

// ── Public API ────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  if (USE_MOCK) return MOCK_CATEGORIES;
  const { createClient } = await import("@/lib/supabase/server");
  const sb = await createClient();
  const { data } = await sb.from("categories").select("*").order("sort_order");
  return (data ?? []) as Category[];
}

export async function getDistricts(): Promise<District[]> {
  if (USE_MOCK) return MOCK_DISTRICTS;
  const { createClient } = await import("@/lib/supabase/server");
  const sb = await createClient();
  const { data } = await sb.from("districts").select("*").order("id");
  return (data ?? []) as District[];
}

export async function getOffers(filters: OfferFilters = {}): Promise<Offer[]> {
  if (USE_MOCK) return filterOffers(MOCK_OFFERS, filters);
  const { createClient } = await import("@/lib/supabase/server");
  const sb = await createClient();
  let query = sb
    .from("offers")
    .select(`
      id, brand_id, title_tc, short_desc_tc, description_tc,
      validity_type, is_free, is_active, verified_at, source_url,
      brand:brands (
        id, name_tc, logo_url, is_verified, is_featured,
        category:categories (id, slug, name_tc, icon),
        district:districts (id, slug, name_tc)
      ),
      tags:offer_tags ( tag:tags (id, name_tc, slug) )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(100);

  if (filters.validity) query = query.eq("validity_type", filters.validity);
  if (filters.isFree)   query = query.eq("is_free", true);
  if (filters.search)   query = query.or(`title_tc.ilike.%${filters.search}%,description_tc.ilike.%${filters.search}%`);

  const { data, error } = await query;
  if (error) { console.error("getOffers:", error); return []; }

  let results = (data as any[]).map((o) => ({
    ...o,
    tags: (o.tags ?? []).map((t: any) => t.tag).filter(Boolean),
  })) as Offer[];

  if (filters.category) results = results.filter((o) => o.brand?.category?.slug === filters.category);
  if (filters.district) results = results.filter((o) => o.brand?.district?.slug === filters.district);
  return results;
}

export async function getOfferById(id: string): Promise<Offer | null> {
  if (USE_MOCK) return MOCK_OFFERS.find((o) => o.id === id) ?? null;
  const { createClient } = await import("@/lib/supabase/server");
  const sb = await createClient();
  const { data, error } = await sb
    .from("offers")
    .select(`*, brand:brands (*, category:categories (*), district:districts (*)), tags:offer_tags ( tag:tags (*) )`)
    .eq("id", id).eq("is_active", true).single();
  if (error) return null;
  return { ...data, tags: (data.tags ?? []).map((t: any) => t.tag).filter(Boolean) } as Offer;
}

export async function getFeaturedOffers(limit = 6): Promise<Offer[]> {
  if (USE_MOCK) return MOCK_OFFERS.filter((o) => o.brand?.is_featured).slice(0, limit);
  const { createClient } = await import("@/lib/supabase/server");
  const sb = await createClient();
  const { data } = await sb
    .from("offers")
    .select(`*, brand:brands (*, category:categories (*), district:districts (*)), tags:offer_tags ( tag:tags (*) )`)
    .eq("is_active", true).limit(limit);
  return (data ?? []).map((o: any) => ({ ...o, tags: (o.tags ?? []).map((t: any) => t.tag).filter(Boolean) })) as Offer[];
}

export async function getStats(): Promise<{ offerCount: number; brandCount: number }> {
  if (USE_MOCK) return { offerCount: MOCK_OFFERS.length, brandCount: 14 };
  const { createClient } = await import("@/lib/supabase/server");
  const sb = await createClient();
  const [o, b] = await Promise.all([
    sb.from("offers").select("id", { count: "exact", head: true }).eq("is_active", true),
    sb.from("brands").select("id", { count: "exact", head: true }),
  ]);
  return { offerCount: o.count ?? 0, brandCount: b.count ?? 0 };
}
