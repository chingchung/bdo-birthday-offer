"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, Gift } from "lucide-react";
import OfferCard from "@/components/offers/OfferCard";
import BdoCake from "@/components/mascot/BdoCake";
import { cn } from "@/lib/utils";
import type { Category, District, Offer, OfferFilters, ValidityType } from "@/types";

const VALIDITY_OPTIONS: { value: ValidityType; label: string }[] = [
  { value: "birthday_day",  label: "生日當天" },
  { value: "birthday_week", label: "生日前後一星期" },
  { value: "birth_month",   label: "整個生日月份" },
  { value: "registration",  label: "登記即享" },
];

interface OffersClientProps {
  initialOffers: Offer[];
  categories: Category[];
  districts: District[];
  initialFilters: OfferFilters;
}

export default function OffersClient({
  initialOffers,
  categories,
  districts,
  initialFilters,
}: OffersClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialFilters.search ?? "");
  const [activeCategory, setActiveCategory] = useState(initialFilters.category ?? "");
  const [activeDistrict, setActiveDistrict] = useState(initialFilters.district ?? "");
  const [activeValidity, setActiveValidity] = useState<ValidityType | "">(initialFilters.validity ?? "");
  const [freeOnly, setFreeOnly] = useState(initialFilters.isFree ?? false);
  const [showFilters, setShowFilters] = useState(false);

  // Client-side filter on top of server-fetched data
  const filtered = useMemo(() => {
    return initialOffers.filter((o) => {
      if (freeOnly && !o.is_free) return false;
      if (activeValidity && o.validity_type !== activeValidity) return false;
      if (activeCategory && o.brand?.category?.slug !== activeCategory) return false;
      if (activeDistrict && o.brand?.district?.slug !== activeDistrict) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          o.title_tc.toLowerCase().includes(q) ||
          o.description_tc.toLowerCase().includes(q) ||
          (o.brand?.name_tc ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [initialOffers, freeOnly, activeValidity, activeCategory, activeDistrict, search]);

  function clearFilters() {
    setSearch("");
    setActiveCategory("");
    setActiveDistrict("");
    setActiveValidity("");
    setFreeOnly(false);
    router.push("/offers");
  }

  const hasFilters = !!(search || activeCategory || activeDistrict || activeValidity || freeOnly);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* ── Sidebar filters (desktop) ───────────────────────── */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <FilterPanel
          categories={categories}
          districts={districts}
          search={search} setSearch={setSearch}
          activeCategory={activeCategory} setActiveCategory={setActiveCategory}
          activeDistrict={activeDistrict} setActiveDistrict={setActiveDistrict}
          activeValidity={activeValidity} setActiveValidity={setActiveValidity}
          freeOnly={freeOnly} setFreeOnly={setFreeOnly}
          hasFilters={hasFilters} clearFilters={clearFilters}
        />
      </aside>

      <div className="flex-1 min-w-0">
        {/* Mobile: search bar + filter toggle */}
        <div className="lg:hidden mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜尋品牌或優惠…"
              className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-brand-400"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-sm font-medium transition-colors",
              showFilters ? "bg-brand-500 text-white border-brand-500" : "border-gray-200 text-gray-600"
            )}
          >
            <SlidersHorizontal size={14} />
            篩選
          </button>
        </div>

        {/* Mobile filter panel */}
        {showFilters && (
          <div className="lg:hidden mb-4 p-4 bg-white rounded-2xl border border-brand-100">
            <FilterPanel
              categories={categories}
              districts={districts}
              search={search} setSearch={setSearch}
              activeCategory={activeCategory} setActiveCategory={setActiveCategory}
              activeDistrict={activeDistrict} setActiveDistrict={setActiveDistrict}
              activeValidity={activeValidity} setActiveValidity={setActiveValidity}
              freeOnly={freeOnly} setFreeOnly={setFreeOnly}
              hasFilters={hasFilters} clearFilters={clearFilters}
              hideSidebar
            />
          </div>
        )}

        {/* Results */}
        {filtered.length === 0 ? (
          <EmptyState onClear={clearFilters} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Filter Panel ─────────────────────────────────────────────
interface FilterPanelProps {
  categories: Category[];
  districts: District[];
  search: string; setSearch: (v: string) => void;
  activeCategory: string; setActiveCategory: (v: string) => void;
  activeDistrict: string; setActiveDistrict: (v: string) => void;
  activeValidity: ValidityType | ""; setActiveValidity: (v: ValidityType | "") => void;
  freeOnly: boolean; setFreeOnly: (v: boolean) => void;
  hasFilters: boolean; clearFilters: () => void;
  hideSidebar?: boolean;
}

function FilterPanel({
  categories, districts,
  search, setSearch,
  activeCategory, setActiveCategory,
  activeDistrict, setActiveDistrict,
  activeValidity, setActiveValidity,
  freeOnly, setFreeOnly,
  hasFilters, clearFilters,
  hideSidebar,
}: FilterPanelProps) {
  return (
    <div className="space-y-6">
      {/* Search (sidebar only) */}
      {!hideSidebar && (
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜尋品牌或優惠…"
            className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-brand-400"
          />
        </div>
      )}

      {/* Free only toggle */}
      <button
        onClick={() => setFreeOnly(!freeOnly)}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-2.5 rounded-full border-2 font-semibold text-sm transition-colors",
          freeOnly ? "bg-gold-400 border-gold-400 text-white" : "border-gold-300 text-gold-700 hover:bg-gold-50"
        )}
      >
        <Gift size={14} />
        完全免費優惠
      </button>

      {/* Category */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">分類</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("")}
            className={cn("bdo-tag", !activeCategory && "bg-brand-500 text-white border-brand-500")}
          >全部</button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(activeCategory === c.slug ? "" : c.slug)}
              className={cn("bdo-tag", activeCategory === c.slug && "bg-brand-500 text-white border-brand-500")}
            >
              {c.icon} {c.name_tc}
            </button>
          ))}
        </div>
      </div>

      {/* District */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">地區</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveDistrict("")}
            className={cn("bdo-tag", !activeDistrict && "bg-brand-500 text-white border-brand-500")}
          >全部</button>
          {districts.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDistrict(activeDistrict === d.slug ? "" : d.slug)}
              className={cn("bdo-tag", activeDistrict === d.slug && "bg-brand-500 text-white border-brand-500")}
            >
              {d.name_tc}
            </button>
          ))}
        </div>
      </div>

      {/* Validity */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">有效期</p>
        <div className="flex flex-col gap-1.5">
          {VALIDITY_OPTIONS.map((v) => (
            <button
              key={v.value}
              onClick={() => setActiveValidity(activeValidity === v.value ? "" : v.value)}
              className={cn(
                "text-left text-sm px-3 py-2 rounded-xl transition-colors",
                activeValidity === v.value
                  ? "bg-brand-500 text-white font-semibold"
                  : "bg-gray-50 text-gray-600 hover:bg-brand-50 hover:text-brand-500"
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-sm text-gray-500 hover:text-brand-500 transition-colors"
        >
          <X size={13} />
          清除所有篩選
        </button>
      )}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="text-center py-20 flex flex-col items-center gap-4">
      <BdoCake size={120} animate={false} />
      <p className="text-xl font-bold text-gray-700">找不到相關優惠</p>
      <p className="text-gray-400 text-sm">試試調整篩選條件，或直接瀏覽全部優惠</p>
      <button onClick={onClear} className="bdo-btn-outline mt-2">
        清除篩選
      </button>
    </div>
  );
}
