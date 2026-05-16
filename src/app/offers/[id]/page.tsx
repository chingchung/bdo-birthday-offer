import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, ExternalLink, CheckCircle2, Clock,
  MapPin, Tag, AlertCircle, Share2
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OfferCard from "@/components/offers/OfferCard";
import { getOfferById, getOffers } from "@/lib/queries";
import { formatVerifiedDate, getValidityLabel, validityColor, daysSince } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const offer = await getOfferById(id);
  if (!offer) return { title: "優惠不存在" };
  return {
    title: `${offer.brand?.name_tc} — ${offer.title_tc}`,
    description: offer.short_desc_tc ?? offer.description_tc,
  };
}

export const revalidate = 3600;

export default async function OfferDetailPage({ params }: PageProps) {
  const { id } = await params;
  const offer = await getOfferById(id);
  if (!offer) notFound();

  const brand = offer.brand!;
  const days = daysSince(offer.verified_at);
  const isStale = days !== null && days > 60;

  // Related: same category, different offer
  const related = (await getOffers({ category: brand.category?.slug }))
    .filter((o) => o.id !== offer.id)
    .slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <Link href="/offers" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-500 mb-6 transition-colors">
          <ArrowLeft size={14} />
          返回全部優惠
        </Link>

        <div className="bdo-card p-6 md:p-8 mb-6">
          {/* Brand header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-brand-50 border border-brand-100 flex-shrink-0">
              {brand.logo_url ? (
                <Image src={brand.logo_url} alt={brand.name_tc} width={64} height={64} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">
                  {brand.category?.icon ?? "🎁"}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-gray-900">{brand.name_tc}</h2>
                {brand.is_verified && (
                  <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                    <CheckCircle2 size={11} /> 已核實品牌
                  </span>
                )}
                {brand.is_featured && (
                  <span className="bdo-badge-gold text-xs">精選夥伴</span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                {brand.category && <span>{brand.category.icon} {brand.category.name_tc}</span>}
                {brand.district && (
                  <span className="flex items-center gap-0.5">
                    <MapPin size={10} /> {brand.district.name_tc}
                  </span>
                )}
              </div>
            </div>
            {offer.is_free && (
              <div className="bdo-badge text-sm px-3 py-1">🎁 完全免費</div>
            )}
          </div>

          {/* Offer title */}
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-4">
            {offer.title_tc}
          </h1>

          {/* Validity badge */}
          <div className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-semibold text-sm mb-6", validityColor(offer.validity_type))}>
            <Clock size={13} />
            {getValidityLabel(offer.validity_type)}
          </div>

          {/* Description */}
          <div className="bg-brand-50 rounded-2xl p-5 mb-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{offer.description_tc}</p>
          </div>

          {/* Requirements */}
          {offer.requirements_tc && (
            <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
              <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800 mb-1">使用條件</p>
                <p className="text-sm text-amber-700 leading-relaxed">{offer.requirements_tc}</p>
              </div>
            </div>
          )}

          {/* Tags */}
          {offer.tags && offer.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-6">
              <Tag size={13} className="text-gray-400" />
              {offer.tags.map((tag) => (
                <span key={tag.id} className="bdo-tag">{tag.name_tc}</span>
              ))}
            </div>
          )}

          {/* Verified status */}
          <div className={cn(
            "flex items-center gap-2 text-xs rounded-xl px-3 py-2 mb-6",
            isStale ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
          )}>
            {isStale ? <Clock size={12} /> : <span className="pulse-dot" />}
            <span>
              {offer.verified_at
                ? `${formatVerifiedDate(offer.verified_at)}（${days} 日前）`
                : "此優惠尚未經人工核實，請以商戶官方公布為準"}
            </span>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={offer.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bdo-btn-primary inline-flex items-center justify-center gap-2 flex-1"
            >
              前往商戶官方頁面
              <ExternalLink size={14} />
            </a>
            <button className="bdo-btn-outline inline-flex items-center justify-center gap-2">
              <Share2 size={14} />
              分享優惠
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-400 mt-4 text-center">
            所有優惠以商戶官方公布為準，BDO 不對優惠內容負責。建議前往前致電或查詢確認。
          </p>
        </div>

        {/* Related offers */}
        {related.length > 0 && (
          <section>
            <h3 className="bdo-section-title mb-4">同類優惠</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((o) => (
                <OfferCard key={o.id} offer={o} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
