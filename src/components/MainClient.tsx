"use client";

import { useState, useMemo } from "react";
import { Search, X, Gift } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Offer } from "@/types";
import OfferCard from "@/components/offers/OfferCard";
import OfferModal from "@/components/offers/OfferModal";

const MASCOT_URL =
  "https://framerusercontent.com/images/Fkp29ZULMXxjJhDGpH2LaloSs.png";

const TABS = [
  { key: "all",      label: "全部" },
  { key: "dining",   label: "餐飲" },
  { key: "shopping", label: "購物" },
  { key: "activity", label: "活動" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const TAB_SLUGS: Record<TabKey, string[]> = {
  all:      [],
  dining:   ["dining", "cafe"],
  shopping: ["retail"],
  activity: ["attraction", "cinema", "hotel", "spa", "other"],
};

export default function MainClient({ offers }: { offers: Offer[] }) {
  const [tab, setTab]           = useState<TabKey>("all");
  const [birthMonth, setBirthMonth] = useState(false);
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState<Offer | null>(null);

  const filtered = useMemo(() => {
    return offers.filter((o) => {
      if (tab !== "all" && !TAB_SLUGS[tab].includes(o.brand?.category?.slug ?? ""))
        return false;
      if (birthMonth && o.validity_type !== "birth_month") return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          o.title_tc.toLowerCase().includes(q) ||
          (o.brand?.name_tc ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [offers, tab, birthMonth, search]);

  const hasFilter = tab !== "all" || birthMonth || !!search;

  return (
    <div className="min-h-screen bg-[#F0EDE8]">

      {/* ══ TOP BAR ══════════════════════════════════════════ */}
      <header className="px-4 md:px-6 pt-5 pb-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <h1 className="text-xl font-black text-[#1A1714] tracking-tight">Birthday Offer</h1>
          <div className="flex-1" />
          {/* Search */}
          <div className="relative w-44 sm:w-60">
            <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#BBB]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜尋…"
              className="w-full pl-8 pr-8 py-2 rounded-full bg-white border border-[#E0DCD6]
                         text-sm text-[#333] placeholder:text-[#CCC]
                         focus:outline-none focus:border-[#999] transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BBB] hover:text-[#555]">
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ══ BODY ═════════════════════════════════════════════ */}
      {/* Extra bottom padding on mobile for sticky filter bar */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-28 md:pb-16 flex gap-6 items-start">

        {/* ── LEFT SIDEBAR — desktop only ───────────────────── */}
        <aside className="hidden md:block w-40 flex-shrink-0 sticky top-6">
          {/* Mascot sitting on top */}
          <div className="flex justify-center -mb-5 relative z-10 pointer-events-none select-none">
            <Image
              src={MASCOT_URL}
              alt="BDO 吉祥物"
              width={100}
              height={100}
              className="drop-shadow-lg"
              priority
            />
          </div>

          {/* Filter card */}
          <div className="bg-[#E6E2DC] rounded-3xl pt-7 pb-3 px-2.5 flex flex-col gap-0.5">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "w-full px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all text-left",
                  tab === t.key
                    ? "bg-white text-[#1A1714] shadow-sm"
                    : "text-[#999] hover:text-[#555] hover:bg-[#DAD6D0]"
                )}
              >
                {t.label}
              </button>
            ))}

            <div className="my-1.5 border-t border-[#D4D0CA]" />

            <button
              onClick={() => setBirthMonth(!birthMonth)}
              className={cn(
                "w-full px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all text-left",
                birthMonth
                  ? "bg-[#1A1714] text-white shadow-sm"
                  : "text-[#999] hover:text-[#555] hover:bg-[#DAD6D0]"
              )}
            >
              生日月份
            </button>

            {hasFilter && (
              <button
                onClick={() => { setTab("all"); setBirthMonth(false); setSearch(""); }}
                className="w-full text-center text-[10px] text-[#AAA] hover:text-[#666] pt-2 pb-1 transition-colors"
              >
                清除篩選
              </button>
            )}
          </div>
        </aside>

        {/* ── Offer grid ────────────────────────────────────── */}
        <div className="flex-1 min-w-0 pt-2">
          <p className="text-xs text-[#AAA] mb-4">
            <span className="font-bold text-[#333] text-sm">{filtered.length}</span> 個優惠
            {filtered.filter((o) => o.is_free).length > 0 && (
              <span className="ml-2 text-[#888]">
                · {filtered.filter((o) => o.is_free).length} 個免費
              </span>
            )}
          </p>

          {filtered.length === 0 ? (
            <EmptyState onClear={() => { setTab("all"); setBirthMonth(false); setSearch(""); }} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map((offer) => (
                <OfferCard key={offer.id} offer={offer} onClick={setSelected} />
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="text-center pb-8 text-[11px] text-[#BBB]">
        © {new Date().getFullYear()} Birthday Offer HK · 所有優惠以商戶官方公布為準
      </footer>

      {/* ══ MOBILE STICKY BOTTOM FILTER ══════════════════════ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40
                      bg-[#E6E2DC]/95 backdrop-blur-md
                      border-t border-[#D4D0CA]
                      px-4 pt-3 pb-safe">

        {/* Mascot peek — sits on top edge of bar */}
        <div className="absolute -top-10 left-4 pointer-events-none select-none">
          <Image
            src={MASCOT_URL}
            alt=""
            width={44}
            height={44}
            className="drop-shadow-md"
          />
        </div>

        <div className="flex items-center gap-2 pb-3">
          {/* Category pills */}
          <div className="flex gap-1.5 flex-1 overflow-x-auto no-scrollbar">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all",
                  tab === t.key
                    ? "bg-[#1A1714] text-white"
                    : "bg-white text-[#888] border border-[#D8D4CE]"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Birth month toggle pill */}
          <button
            onClick={() => setBirthMonth(!birthMonth)}
            className={cn(
              "flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full",
              "text-sm font-semibold transition-all border",
              birthMonth
                ? "bg-[#1A1714] text-white border-[#1A1714]"
                : "bg-white text-[#888] border-[#D8D4CE]"
            )}
          >
            <Gift size={13} />
            月份
          </button>
        </div>
      </div>

      {/* ══ MODAL ════════════════════════════════════════════ */}
      {selected && (
        <OfferModal offer={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <Image src={MASCOT_URL} alt="" width={72} height={72} className="opacity-30 grayscale" />
      <p className="text-sm font-bold text-[#888]">找不到相關優惠</p>
      <button
        onClick={onClear}
        className="text-xs px-4 py-2 rounded-full border border-[#CCC] text-[#666] hover:border-[#999]"
      >
        顯示全部
      </button>
    </div>
  );
}
