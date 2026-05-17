"use client";

import { useEffect } from "react";
import { X, ExternalLink, AlertCircle, CheckCircle2, MapPin } from "lucide-react";
import { cn, getValidityLabel, validityColor, formatVerifiedDate, daysSince } from "@/lib/utils";
import type { Offer } from "@/types";

interface OfferModalProps {
  offer: Offer;
  onClose: () => void;
}

export default function OfferModal({ offer, onClose }: OfferModalProps) {
  const brand = offer.brand;
  const days  = daysSince(offer.verified_at);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Dim — click to close */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className={cn(
        "relative bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl",
        "shadow-2xl overflow-hidden max-h-[80vh] sm:max-h-[90vh] flex flex-col"
      )}>

        {/* Header strip — brand colour replaced with neutral */}
        <div className="bg-[#F2F0EC] px-6 pt-6 pb-5 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm
                              flex items-center justify-center text-2xl flex-shrink-0">
                {brand?.category?.icon ?? "🎁"}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-[#1A1714]">{brand?.name_tc}</p>
                  {brand?.is_verified && (
                    <CheckCircle2 size={13} className="text-emerald-500" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#AAA] mt-0.5">
                  {brand?.category?.name_tc && <span>{brand.category.name_tc}</span>}
                  {brand?.district?.name_tc && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin size={9} />{brand.district.name_tc}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center
                         text-[#888] hover:text-[#333] hover:bg-white transition-colors flex-shrink-0"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

          {/* Free badge */}
          {offer.is_free && (
            <div className="inline-flex items-center gap-1.5 bg-[#1A1714] text-white
                            text-xs font-bold px-3 py-1 rounded-full">
              🎁 完全免費
            </div>
          )}

          {/* Title */}
          <h2 className="text-xl font-black text-[#1A1714] leading-snug">
            {offer.title_tc}
          </h2>

          {/* Validity */}
          <span className={cn(
            "inline-flex text-xs font-semibold px-3 py-1 rounded-full border",
            validityColor(offer.validity_type)
          )}>
            {getValidityLabel(offer.validity_type)}
          </span>

          {/* Description */}
          <div className="bg-[#F7F5F2] rounded-2xl p-4">
            <p className="text-sm text-[#444] leading-relaxed whitespace-pre-line">
              {offer.description_tc}
            </p>
          </div>

          {/* Requirements */}
          {offer.requirements_tc && (
            <div className="flex gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-700 mb-1">使用條件</p>
                <p className="text-xs text-amber-600 leading-relaxed">
                  {offer.requirements_tc}
                </p>
              </div>
            </div>
          )}

          {/* Tags */}
          {offer.tags && offer.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {offer.tags.map((tag) => (
                <span key={tag.id}
                  className="text-xs px-2.5 py-1 rounded-full bg-[#F0EDE8] text-[#777]">
                  {tag.name_tc}
                </span>
              ))}
            </div>
          )}

          {/* Verified */}
          <p className="text-[10px] text-[#BBB]">
            {offer.verified_at
              ? `${formatVerifiedDate(offer.verified_at)}（${days} 日前）`
              : "尚未人工核實，請以商戶官方公布為準"}
          </p>
        </div>

        {/* CTA */}
        <div className="px-6 py-4 border-t border-[#F0EDE8] flex-shrink-0">
          <a
            href={offer.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full
                       bg-[#1A1714] text-white font-bold text-sm
                       py-3.5 rounded-2xl hover:bg-[#333] transition-colors"
          >
            前往商戶官方頁面
            <ExternalLink size={14} />
          </a>
          <p className="text-center text-[10px] text-[#CCC] mt-2">
            所有優惠以商戶官方公布為準
          </p>
        </div>
      </div>
    </div>
  );
}
