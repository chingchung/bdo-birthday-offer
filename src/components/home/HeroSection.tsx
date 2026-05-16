"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Gift, Sparkles } from "lucide-react";
import BdoCake from "@/components/mascot/BdoCake";

interface HeroSectionProps {
  offerCount: number;
  brandCount: number;
}

export default function HeroSection({ offerCount, brandCount }: HeroSectionProps) {
  return (
    <section className="bdo-hero-gradient relative overflow-hidden pt-10 pb-16">
      {/* Decorative confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { top: "10%", left: "8%",  size: 10, color: "#fda4b5", delay: 0 },
          { top: "20%", right: "6%", size: 8,  color: "#fcd34d", delay: 0.3 },
          { top: "60%", left: "4%",  size: 6,  color: "#f43f6e", delay: 0.6 },
          { top: "70%", right: "8%", size: 12, color: "#fbbf24", delay: 0.2 },
          { top: "40%", left: "15%", size: 7,  color: "#c084fc", delay: 0.5 },
          { top: "30%", right: "15%",size: 9,  color: "#6ee7b7", delay: 0.4 },
        ].map((dot, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-50"
            style={{
              top: dot.top,
              left: (dot as any).left,
              right: (dot as any).right,
              width: dot.size,
              height: dot.size,
              backgroundColor: dot.color,
            }}
            animate={{ y: [-6, 6, -6] }}
            transition={{
              duration: 3 + i * 0.4,
              repeat: Infinity,
              delay: dot.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">

        {/* Left: Text */}
        <motion.div
          className="flex-1 text-center md:text-left"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Pill badge */}
          <div className="inline-flex items-center gap-1.5 bg-brand-100 text-brand-600 text-xs font-semibold
                          px-3 py-1 rounded-full mb-4">
            <Sparkles size={12} />
            全港最齊生日著數資訊
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-4">
            你的生日，
            <br />
            <span className="bdo-gradient-text">著數多多！</span>
          </h1>

          <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
            搜羅全港餐廳、主題樂園、戲院、零售等生日優惠，
            免費蛋糕、免費門票一網打盡。
            生日無需花大錢，慳住用！
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link href="/offers" className="bdo-btn-primary inline-flex items-center justify-center gap-2">
              <Search size={16} />
              搜尋生日優惠
            </Link>
            <Link href="/offers?isFree=true" className="bdo-btn-outline inline-flex items-center justify-center gap-2">
              <Gift size={16} />
              完全免費優惠
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-10 justify-center md:justify-start">
            <div>
              <p className="text-2xl font-black bdo-gradient-text">{offerCount}+</p>
              <p className="text-xs text-gray-500 font-medium">生日優惠</p>
            </div>
            <div className="w-px bg-brand-100" />
            <div>
              <p className="text-2xl font-black bdo-gradient-text">{brandCount}+</p>
              <p className="text-xs text-gray-500 font-medium">參與品牌</p>
            </div>
            <div className="w-px bg-brand-100" />
            <div>
              <p className="text-2xl font-black bdo-gradient-text">100%</p>
              <p className="text-xs text-gray-500 font-medium">免費查閱</p>
            </div>
          </div>
        </motion.div>

        {/* Right: Mascot */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <BdoCake size={260} animate={true} />
        </motion.div>
      </div>
    </section>
  );
}
