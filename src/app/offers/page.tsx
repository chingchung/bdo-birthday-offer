import { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OffersClient from "./OffersClient";
import { getCategories, getDistricts, getOffers } from "@/lib/queries";
import type { OfferFilters } from "@/types";

export const metadata: Metadata = {
  title: "全部生日優惠",
  description: "瀏覽全港所有生日優惠，包括免費蛋糕、門票、餐廳折扣等，按分類、地區篩選。",
};


interface PageProps {
  searchParams: Promise<{
    category?: string;
    district?: string;
    validity?: string;
    isFree?: string;
    q?: string;
  }>;
}

export default async function OffersPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const filters: OfferFilters = {
    category: params.category,
    district: params.district,
    validity: params.validity as OfferFilters["validity"],
    isFree: params.isFree === "true" ? true : undefined,
    search: params.q,
  };

  const [categories, districts, offers] = await Promise.all([
    getCategories(),
    getDistricts(),
    getOffers(filters),
  ]);

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-1">
            {params.isFree === "true" ? "🎁 完全免費生日優惠" :
             params.category ? `${categories.find(c => c.slug === params.category)?.icon ?? ""} ${categories.find(c => c.slug === params.category)?.name_tc ?? ""} 優惠` :
             "全部生日優惠"}
          </h1>
          <p className="text-gray-500 text-sm">共找到 <span className="font-semibold text-brand-500">{offers.length}</span> 個優惠</p>
        </div>

        <Suspense fallback={<div className="text-center py-20 text-gray-400">載入中…</div>}>
          <OffersClient
            initialOffers={offers}
            categories={categories}
            districts={districts}
            initialFilters={filters}
          />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
