"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Category } from "@/types";

const CATEGORY_COLORS: Record<string, string> = {
  dining:     "from-orange-50 to-red-50   border-orange-200 hover:border-orange-400",
  attraction: "from-purple-50 to-pink-50  border-purple-200 hover:border-purple-400",
  cinema:     "from-blue-50 to-indigo-50  border-blue-200   hover:border-blue-400",
  retail:     "from-green-50 to-teal-50   border-green-200  hover:border-green-400",
  hotel:      "from-yellow-50 to-amber-50 border-yellow-200 hover:border-yellow-400",
  spa:        "from-pink-50 to-rose-50    border-pink-200   hover:border-pink-400",
  cafe:       "from-amber-50 to-orange-50 border-amber-200  hover:border-amber-400",
  other:      "from-gray-50 to-slate-50   border-gray-200   hover:border-gray-400",
};

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="bdo-section-title mb-1">優惠分類</h2>
        <p className="text-gray-500 text-sm mb-6">按類別揀選你想要的生日著數</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/offers?category=${cat.slug}`}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl
                            bg-gradient-to-br border-2 transition-all duration-200
                            hover:-translate-y-0.5 hover:shadow-md
                            ${CATEGORY_COLORS[cat.slug] ?? CATEGORY_COLORS.other}`}
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm font-semibold text-gray-700">{cat.name_tc}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
