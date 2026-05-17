"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { VALIDITY_LABEL, type Offer } from "@/types";

const MobileMap = dynamic(() => import("./MobileMap"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#E8E4DD]" />,
});

type Snap = "top" | "mid" | "bottom";

export default function MobileMapView({
  offers,
  onSelect,
}: {
  offers: Offer[];
  onSelect: (o: Offer) => void;
}) {
  const [vh, setVh] = useState(800);
  const [snap, setSnap] = useState<Snap>("mid");
  const y = useMotionValue(0);
  const controls = useAnimation();

  useEffect(() => {
    const set = () => setVh(window.innerHeight);
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  // Snap positions (y offset from top of viewport)
  const positions = useMemo(
    () => ({
      top: 60,                          // fully expanded — full list
      mid: Math.round(vh * 0.5),        // half map / half list
      bottom: vh - 150,                 // small peek above bottom nav (~70px nav + 80px peek)
    }),
    [vh]
  );

  // Animate to current snap whenever it changes
  useEffect(() => {
    controls.start({
      y: positions[snap],
      transition: { type: "spring", damping: 28, stiffness: 220 },
    });
  }, [snap, positions, controls]);

  const handleDragEnd = (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
    const current = y.get();
    const projected = current + info.velocity.y * 0.15;
    // Find nearest snap point to the projected y
    const entries: [Snap, number][] = [
      ["top", positions.top],
      ["mid", positions.mid],
      ["bottom", positions.bottom],
    ];
    let nearest: Snap = "mid";
    let best = Infinity;
    for (const [name, val] of entries) {
      const d = Math.abs(projected - val);
      if (d < best) { best = d; nearest = name; }
    }
    setSnap(nearest);
  };

  return (
    <div className="md:hidden fixed inset-0 z-10">
      {/* MAP */}
      <div className="absolute inset-0">
        <MobileMap offers={offers} onSelect={onSelect} />
      </div>

      {/* BOTTOM SHEET */}
      <motion.div
        drag="y"
        dragConstraints={{ top: positions.top, bottom: positions.bottom }}
        dragElastic={0.05}
        onDragEnd={handleDragEnd}
        animate={controls}
        initial={{ y: positions.mid }}
        style={{ y, height: vh }}
        className="absolute left-0 right-0 top-0 z-20 bg-white rounded-t-3xl
                   shadow-[0_-8px_30px_rgba(0,0,0,0.12)] flex flex-col"
      >
        {/* Drag handle */}
        <div className="pt-2 pb-1 flex justify-center cursor-grab active:cursor-grabbing">
          <div className="w-10 h-1 rounded-full bg-[#D8D4CE]" />
        </div>

        {/* Header */}
        <div className="px-4 pt-1 pb-3 flex items-center justify-center relative">
          <h2 className="text-base font-bold text-[#1A1714]">
            {offers.length} 個著數
          </h2>
          <button
            onClick={() => setSnap("bottom")}
            aria-label="收起"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full
                       bg-[#F2EFEA] flex items-center justify-center text-[#888]
                       hover:bg-[#E8E4DD] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* List */}
        <div
          className="flex-1 overflow-y-auto px-4 pb-32"
          style={{ touchAction: snap === "top" ? "auto" : "none" }}
        >
          {offers.length === 0 ? (
            <p className="text-center text-sm text-[#999] py-12">未有相符的著數</p>
          ) : (
            <ul className="divide-y divide-[#F0EDE8]">
              {offers.map((o) => (
                <OfferRow key={o.id} offer={o} onClick={() => onSelect(o)} />
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function OfferRow({ offer, onClick }: { offer: Offer; onClick: () => void }) {
  const thumb = offer.brand?.logo_url;
  const brand = offer.brand?.name_tc ?? "—";
  const validity = VALIDITY_LABEL[offer.validity_type];

  return (
    <li>
      <button
        onClick={onClick}
        className="w-full flex items-stretch gap-3 py-3 text-left active:bg-[#FAFAF8] transition-colors"
      >
        {/* Thumb */}
        <div className="flex-shrink-0 w-[68px] h-[68px] rounded-xl overflow-hidden
                        bg-gradient-to-br from-brand-100 to-gold-100 flex items-center justify-center">
          {thumb ? (
            <Image
              src={thumb}
              alt={brand}
              width={68}
              height={68}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <span className="text-2xl font-black text-brand-500">{brand.slice(0, 1)}</span>
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
          <p className="text-[12px] font-semibold text-[#888] truncate">{brand}</p>
          <p className="text-[14px] font-bold text-[#1A1714] leading-snug line-clamp-2">
            {offer.title_tc}
          </p>
          <p className="flex items-center gap-1 text-[12px] text-[#999]">
            <Clock size={11} />
            {validity}
          </p>
        </div>

        {/* Free / Price */}
        {offer.is_free && (
          <div className="flex-shrink-0 self-start pt-1">
            <span className="text-[11px] font-bold text-emerald-600">免費</span>
          </div>
        )}
      </button>
    </li>
  );
}

// Export OfferRow + snap controller in case parent needs them later
export { OfferRow };
