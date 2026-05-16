import Link from "next/link";
import BdoCake from "@/components/mascot/BdoCake";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-brand-100 mt-24">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <BdoCake size={40} animate={false} />
            <div>
              <p className="text-lg font-black bdo-gradient-text">BDO 生日著數</p>
              <p className="text-xs text-gray-400">香港生日優惠一站搜尋</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            搜羅全港最新、最齊的生日優惠資訊，免費禮品、蛋糕、門票等，
            幫你慳盡每一個生日！
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <p className="font-semibold text-gray-800 mb-3">優惠分類</p>
          <ul className="space-y-2 text-sm text-gray-500">
            {[
              ["餐飲美食", "/offers?category=dining"],
              ["主題樂園", "/offers?category=attraction"],
              ["戲院娛樂", "/offers?category=cinema"],
              ["零售購物", "/offers?category=retail"],
              ["酒店住宿", "/offers?category=hotel"],
              ["完全免費", "/offers?isFree=true"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-brand-500 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* About */}
        <div>
          <p className="font-semibold text-gray-800 mb-3">關於 BDO</p>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link href="/about" className="hover:text-brand-500 transition-colors">關於我們</Link></li>
            <li><Link href="/submit" className="hover:text-brand-500 transition-colors">提交優惠</Link></li>
            <li><Link href="/advertise" className="hover:text-brand-500 transition-colors">品牌合作</Link></li>
          </ul>
          <div className="mt-4 p-3 bg-brand-50 rounded-xl text-xs text-brand-600">
            所有優惠資訊以各商戶官方公布為準。BDO 定期核實，但不保證即時性。
          </div>
        </div>
      </div>

      <div className="border-t border-brand-100 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} BDO 生日著數. 版權所有.
      </div>
    </footer>
  );
}
