import { cn, getValidityLabel } from "@/lib/utils";
import type { Offer } from "@/types";

interface OfferCardProps {
  offer: Offer;
  onClick: (offer: Offer) => void;
  className?: string;
}

export default function OfferCard({ offer, onClick, className }: OfferCardProps) {
  const brand = offer.brand;

  return (
    <button
      onClick={() => onClick(offer)}
      className={cn(
        "group flex flex-col bg-white rounded-2xl overflow-hidden text-left w-full",
        "border border-[#ECEAE6]",
        "shadow-sm hover:shadow-md hover:-translate-y-0.5",
        "transition-all duration-200",
        className
      )}
    >
      {/* ── Brand tile — white bg ────────────────────────── */}
      <div className="relative bg-white h-28 flex flex-col items-center justify-center gap-2 px-3
                      border-b border-[#F0EDE8]">

        {/* Free pill */}
        {offer.is_free && (
          <div className="absolute top-2 left-2 bg-[#1A1714] text-white
                          text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide">
            FREE
          </div>
        )}

        {/* Category emoji in a soft circle */}
        <div className="w-12 h-12 rounded-full bg-[#F5F2EE]
                        flex items-center justify-center text-2xl">
          {brand?.category?.icon ?? "🎁"}
        </div>

        <p className="text-[#333] font-bold text-[11px] text-center leading-tight px-1 line-clamp-1">
          {brand?.name_tc}
        </p>
      </div>

      {/* ── Details ─────────────────────────────────────── */}
      <div className="p-3 flex flex-col gap-2 flex-1">

        {/* Validity */}
        <span className="self-start text-[9px] font-semibold px-2 py-0.5 rounded-full
                         bg-[#F2F0EC] text-[#999] border border-[#E8E5E0]">
          {getValidityLabel(offer.validity_type)}
        </span>

        {/* Offer title */}
        <p className="text-[12px] font-bold text-[#1A1714] leading-snug
                      group-hover:text-[#555] transition-colors line-clamp-2 flex-1">
          {offer.title_tc}
        </p>

        {/* Short desc */}
        <p className="text-[10px] text-[#BBB] leading-relaxed line-clamp-2">
          {offer.short_desc_tc ?? offer.description_tc}
        </p>
      </div>
    </button>
  );
}
