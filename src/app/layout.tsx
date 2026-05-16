import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-tc",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BDO 生日著數 — 香港生日優惠一站搜尋",
    template: "%s | BDO 生日著數",
  },
  description:
    "香港最全面的生日優惠資訊平台。迪士尼免費門票、免費蛋糕、餐廳生日優惠、戲院折扣等，一站搜尋你或朋友的生日著數！",
  keywords: ["香港生日優惠", "生日著數", "生日免費", "birthday offer hk", "生日禮物", "免費蛋糕"],
  openGraph: {
    title: "BDO 生日著數 — 香港生日優惠一站搜尋",
    description: "香港最全面的生日優惠資訊平台，免費蛋糕、門票、餐廳優惠一網打盡！",
    type: "website",
    locale: "zh_HK",
    siteName: "BDO 生日著數",
  },
  twitter: {
    card: "summary_large_image",
    title: "BDO 生日著數",
    description: "香港生日優惠一站搜尋",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-HK" className={notoSansTC.variable}>
      <body className="min-h-screen bg-cream antialiased">
        {children}
      </body>
    </html>
  );
}
