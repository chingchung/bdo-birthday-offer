"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import BdoCake from "@/components/mascot/BdoCake";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo + Wordmark */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <BdoCake size={36} animate={false} />
          <div className="leading-tight">
            <span className="text-xl font-black bdo-gradient-text tracking-tight">BDO</span>
            <p className="text-[10px] text-gray-400 font-medium -mt-0.5">生日著數</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/offers" className="hover:text-brand-500 transition-colors">全部優惠</Link>
          <Link href="/offers?category=dining"      className="hover:text-brand-500 transition-colors">餐飲美食</Link>
          <Link href="/offers?category=attraction"  className="hover:text-brand-500 transition-colors">主題樂園</Link>
          <Link href="/offers?category=cinema"      className="hover:text-brand-500 transition-colors">戲院娛樂</Link>
          <Link href="/offers?isFree=true"          className="hover:text-brand-500 transition-colors">
            <span className="bdo-badge-gold px-2 py-0.5">完全免費</span>
          </Link>
        </nav>

        {/* Search + Mobile toggle */}
        <div className="flex items-center gap-2">
          <Link
            href="/offers"
            className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-100 hover:bg-brand-50 hover:text-brand-500
                       px-3 py-2 rounded-full transition-colors"
          >
            <Search size={15} />
            <span className="hidden sm:inline">搜尋優惠</span>
          </Link>
          <button
            className="md:hidden p-2 rounded-full hover:bg-brand-50 text-gray-600"
            onClick={() => setOpen(!open)}
            aria-label="選單"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-brand-100 bg-white px-4 py-4 flex flex-col gap-3 text-sm font-medium">
          <Link href="/offers"                     onClick={() => setOpen(false)} className="text-gray-700 hover:text-brand-500">全部優惠</Link>
          <Link href="/offers?category=dining"     onClick={() => setOpen(false)} className="text-gray-700 hover:text-brand-500">餐飲美食</Link>
          <Link href="/offers?category=attraction" onClick={() => setOpen(false)} className="text-gray-700 hover:text-brand-500">主題樂園</Link>
          <Link href="/offers?category=cinema"     onClick={() => setOpen(false)} className="text-gray-700 hover:text-brand-500">戲院娛樂</Link>
          <Link href="/offers?isFree=true"         onClick={() => setOpen(false)} className="text-brand-500 font-semibold">完全免費優惠</Link>
        </div>
      )}
    </header>
  );
}
