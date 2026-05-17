"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, X, LayoutGrid, UtensilsCrossed, ShoppingBag, Sparkles, Gift } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Offer } from "@/types";
import OfferCard from "@/components/offers/OfferCard";
import OfferModal from "@/components/offers/OfferModal";
import MobileMapView from "@/components/MobileMapView";

const MASCOT_URL =
  "https://framerusercontent.com/images/Fkp29ZULMXxjJhDGpH2LaloSs.png";

const TABS = [
  { key: "all",      label: "全部",  icon: LayoutGrid },
  { key: "dining",   label: "餐飲",  icon: UtensilsCrossed },
  { key: "shopping", label: "購物",  icon: ShoppingBag },
  { key: "activity", label: "活動",  icon: Sparkles },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const TAB_SLUGS: Record<TabKey, string[]> = {
  all:      [],
  dining:   ["dining", "cafe"],
  shopping: ["retail"],
  activity: ["attraction", "cinema", "hotel", "spa", "other"],
};

function formatDate() {
  const now = new Date();
  const dayNames = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
  return `${dayNames[now.getDay()]}，${now.getMonth() + 1}月${now.getDate()}日`;
}

export default function MainClient({ offers }: { offers: Offer[] }) {
  const [tab, setTab]               = useState<TabKey>("all");
  const [birthMonth, setBirthMonth] = useState(false);
  const [search, setSearch]         = useState("");
  const [selected, setSelected]     = useState<Offer | null>(null);
  const [searchActive, setSearchActive] = useState(false);
  const [dateVisible, setDateVisible]   = useState(true);
  const [isMobile, setIsMobile]         = useState(false);

  useEffect(() => {
    const handleScroll = () => setDateVisible(window.scrollY < 40);
    const checkMobile  = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

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
    <div className="min-h-screen bg-[#F0EDE8] md:bg-[#F0EDE8]">

      {/* ══════════════════════════════════════════════════════
          MOBILE — Map + bottom sheet (Luma-style)
      ══════════════════════════════════════════════════════ */}

      {/* Floating mobile header — overlays map, covered when sheet expands */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-10
                         bg-gradient-to-b from-white/85 to-white/0 backdrop-blur-[2px]
                         pointer-events-none">
        <div className="pointer-events-auto px-4 pt-3 pb-4">
          <div className="text-[13px] font-bold text-[#1A1714] tracking-tight mb-1">
            {formatDate()}
          </div>
          <div className="flex items-center gap-2">
            <Image
              src={MASCOT_URL}
              alt="BDO"
              width={28}
              height={28}
              className="drop-shadow-sm"
              priority
            />
            <span className="text-[15px] font-black text-[#1A1714] tracking-tight leading-none">
              生日著數
            </span>
            <div className="flex-1" />
            <button
              onClick={() => setBirthMonth((v) => !v)}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all shadow-sm",
                birthMonth
                  ? "bg-[#1A1714] text-white border-[#1A1714]"
                  : "bg-white/95 text-[#666] border-white"
              )}
            >
              <Gift size={12} />
              生日月份
            </button>
          </div>

          {/* Mobile search bar */}
          <div className={cn(
            "overflow-hidden transition-all duration-200 ease-in-out",
            searchActive ? "max-h-16 opacity-100 mt-2" : "max-h-0 opacity-0"
          )}>
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#BBB]" />
              <input
                autoFocus={searchActive}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜尋優惠或品牌…"
                className="w-full pl-9 pr-9 py-2.5 rounded-full bg-white border border-[#E0DCD6]
                           text-sm text-[#333] placeholder:text-[#CCC] shadow-sm
                           focus:outline-none focus:border-[#999]"
              />
              {search && (
                <button onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BBB]">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {isMobile && <MobileMapView offers={filtered} onSelect={setSelected} />}

      {/* ══════════════════════════════════════════════════════
          DESKTOP — original list layout
      ══════════════════════════════════════════════════════ */}

      <header className="hidden md:block sticky top-0 z-30 bg-[#F0EDE8]">
        <div className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          dateVisible ? "max-h-12 opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="px-4 pt-3 pb-0.5">
            <span className="text-[15px] font-bold text-[#1A1714] tracking-tight">
              {formatDate()}
            </span>
          </div>
        </div>

        <div className="px-4 md:px-6 py-2.5">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <span className="text-xl font-black text-[#1A1714] tracking-tight leading-none">
              Birthday Offer
            </span>

            <div className="flex-1" />

            <div className="relative w-60">
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
        </div>
      </header>

      <div className="hidden md:flex max-w-6xl mx-auto px-4 md:px-6 pb-16 gap-6 items-start">
        <aside className="w-40 flex-shrink-0 sticky top-20">
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
            <div className="flex flex-col items-center gap-4 py-24 text-center">
              <Image src={MASCOT_URL} alt="" width={72} height={72} className="opacity-30 grayscale" />
              <p className="text-sm font-bold text-[#888]">找不到相關優惠</p>
              <button
                onClick={() => { setTab("all"); setBirthMonth(false); setSearch(""); }}
                className="text-xs px-4 py-2 rounded-full border border-[#CCC] text-[#666] hover:border-[#999]"
              >
                顯示全部
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map((offer) => (
                <OfferCard key={offer.id} offer={offer} onClick={setSelected} />
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="hidden md:block text-center pb-8 text-[11px] text-[#BBB]">
        © {new Date().getFullYear()} Birthday Offer HK · 所有優惠以商戶官方公布為準
      </footer>

      {/* ══ MOBILE BOTTOM NAV ════════════════════════════════ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30
                      bg-white/95 backdrop-blur-md border-t border-[#E8E4DF] pb-safe
                      shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-stretch justify-around px-1 pt-2 pb-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.key && !searchActive;
            return (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setSearchActive(false); }}
                className="flex flex-col items-center gap-0.5 flex-1 min-w-0"
              >
                <div className={cn(
                  "px-5 py-1 rounded-full transition-all duration-200",
                  isActive ? "bg-[#EDE9E3]" : ""
                )}>
                  <Icon
                    size={22}
                    className={cn("transition-colors", isActive ? "text-[#1A1714]" : "text-[#B0AAA4]")}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                </div>
                <span className={cn(
                  "text-[10px] font-semibold transition-colors leading-tight",
                  isActive ? "text-[#1A1714]" : "text-[#B0AAA4]"
                )}>
                  {t.label}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setSearchActive((v) => !v)}
            className="flex flex-col items-center gap-0.5 flex-1 min-w-0"
          >
            <div className={cn(
              "px-5 py-1 rounded-full transition-all duration-200",
              searchActive ? "bg-[#EDE9E3]" : ""
            )}>
              <Search
                size={22}
                className={cn("transition-colors", searchActive ? "text-[#1A1714]" : "text-[#B0AAA4]")}
                strokeWidth={searchActive ? 2.2 : 1.8}
              />
            </div>
            <span className={cn(
              "text-[10px] font-semibold transition-colors leading-tight",
              searchActive ? "text-[#1A1714]" : "text-[#B0AAA4]"
            )}>
              搜尋
            </span>
          </button>
        </div>
      </nav>

      {/* ══ MODAL ════════════════════════════════════════════ */}
      {selected && (
        <OfferModal offer={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
