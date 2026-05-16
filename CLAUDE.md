# BDO 生日著數 — Project Guide

## 項目概覽
**BDO (Birthday Offer)** 是香港生日優惠聚合資訊網站。
- **目標**: 第一階段做資訊性網站，累積流量，擁有「香港生日優惠」搜索領域
- **語言**: 繁體中文（Traditional Chinese only）
- **市場**: 香港
- **商業模式**: Phase 1 = 免費資訊目錄；Phase 2+ = 精選/贊助品牌、聯盟連結、廣告

## Tech Stack
| 層次 | 技術 |
|------|------|
| Frontend | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS (custom BDO design tokens) |
| Animation | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Admin only, Phase 2) |
| Auto-scraping | Supabase Edge Functions + pg_cron |
| Deployment | Vercel |

## 品牌規範
- **Primary colour**: `#f43f6e` (brand-500) — 品牌粉紅
- **Gold accent**: `#f59e0b` (gold-500) — 燭火金
- **Background**: `#FFF8F0` (cream) — 暖白
- **Mascot**: "Cakey" — 生日蛋糕角色 (`src/components/mascot/BdoCake.tsx`)
- **Font**: Noto Sans TC (Google Fonts)
- **Tone**: 輕鬆、友善、慳錢導向；廣東話用語優先（著數、慳錢）

## 目錄結構
```
BDO/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout, font, metadata
│   │   ├── page.tsx            # Homepage (SSR)
│   │   └── offers/
│   │       ├── page.tsx        # Offers listing (SSR + client filters)
│   │       ├── OffersClient.tsx # Client-side filter UI
│   │       └── [id]/
│   │           └── page.tsx    # Offer detail page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   └── CategoryGrid.tsx
│   │   ├── offers/
│   │   │   └── OfferCard.tsx
│   │   └── mascot/
│   │       └── BdoCake.tsx     # SVG mascot "Cakey"
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts       # Browser Supabase client
│   │   │   └── server.ts       # Server Supabase client (RSC)
│   │   ├── queries.ts          # All DB query functions
│   │   └── utils.ts            # cn(), formatters, helpers
│   └── types/
│       └── index.ts            # TypeScript types (mirrors DB schema)
├── supabase/
│   ├── schema.sql              # Full DB schema — run in Supabase SQL Editor
│   ├── cron.sql                # pg_cron scheduler setup
│   └── functions/
│       └── scrape-offers/
│           └── index.ts        # Edge Function: auto-verify offers daily
├── .env.example                # Copy to .env.local
├── package.json
├── tailwind.config.ts
└── CLAUDE.md                   # This file
```

## Getting Started (First Time Setup)

### 1. Install Node.js
Download from https://nodejs.org (LTS version)

### 2. Install dependencies
```bash
cd BDO
npm install
```

### 3. Set up Supabase
1. Go to https://supabase.com → New Project
2. Copy your Project URL and anon key
3. Create `.env.local` from `.env.example`
4. In Supabase SQL Editor: run `supabase/schema.sql`

### 4. Run dev server
```bash
npm run dev
```
Open http://localhost:3000

### 5. Deploy Edge Function (optional)
```bash
npx supabase functions deploy scrape-offers
```

## Data Entry (Phase 1)
Manually insert offers into Supabase Table Editor or via SQL.
Priority brands to add:
- 香港迪士尼樂園 (免費門票)
- 海洋公園 (免費入場)
- 杜莎夫人蠟像館
- 百老匯院線 / 嘉禾院線
- Grand Hyatt / The Mira
- 各大連鎖餐廳生日優惠

## Phase 2 Roadmap
- [ ] Admin dashboard (Supabase Auth)
- [ ] User accounts: save favourite offers, set birthday reminder
- [ ] AI-powered offer scraper (Claude API to extract structured data)
- [ ] Offer submission form (community-sourced)
- [ ] Featured brand listings (monetization)
- [ ] SEO: sitemap.xml, structured data (JSON-LD)
- [ ] PWA / mobile app wrapper
- [ ] Social sharing with OG images generated per offer

## Key Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint check
```

## Notes for Claude
- Always use **Traditional Chinese** in all UI text (繁體中文)
- Use Cantonese-friendly terms: 著數, 慳錢, 掂, 正 etc.
- Brand colour class: `text-brand-500`, `bg-brand-500`
- Card style: use `bdo-card` utility class
- Button: `bdo-btn-primary` or `bdo-btn-outline`
- Badge: `bdo-badge` (pink) or `bdo-badge-gold` (gold)
- All data fetching via `src/lib/queries.ts` (server-side)
- Never expose SUPABASE_SERVICE_ROLE_KEY to client
