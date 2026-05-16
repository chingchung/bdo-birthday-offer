-- ══════════════════════════════════════════════════════════════════
-- BDO (Birthday Offer HK) — Supabase Database Schema
-- Run this in the Supabase SQL Editor to initialise your project DB.
-- ══════════════════════════════════════════════════════════════════

-- ── Extensions ────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";  -- for full-text fuzzy search

-- ── 1. Categories ─────────────────────────────────────────────────
create table public.categories (
  id          serial primary key,
  slug        text not null unique,           -- e.g. "dining", "attraction"
  name_tc     text not null,                  -- 餐飲
  icon        text not null default '🎁',    -- emoji icon
  sort_order  int  not null default 0
);

insert into public.categories (slug, name_tc, icon, sort_order) values
  ('dining',      '餐飲美食',   '🍽️', 1),
  ('attraction',  '主題樂園',   '🎡', 2),
  ('cinema',      '戲院娛樂',   '🎬', 3),
  ('retail',      '零售購物',   '🛍️', 4),
  ('hotel',       '酒店住宿',   '🏨', 5),
  ('spa',         '美容水療',   '💆', 6),
  ('cafe',        '咖啡甜品',   '☕', 7),
  ('other',       '其他優惠',   '🎁', 8);

-- ── 2. Districts ──────────────────────────────────────────────────
create table public.districts (
  id      serial primary key,
  slug    text not null unique,
  name_tc text not null
);

insert into public.districts (slug, name_tc) values
  ('hk-island',   '香港島'),
  ('kowloon',     '九龍'),
  ('new-territories', '新界'),
  ('lantau',      '大嶼山'),
  ('online',      '網上 / 全港');

-- ── 3. Brands ─────────────────────────────────────────────────────
create table public.brands (
  id           uuid primary key default uuid_generate_v4(),
  name_tc      text not null,
  name_en      text,
  logo_url     text,
  website_url  text,
  category_id  int references public.categories(id) on delete set null,
  district_id  int references public.districts(id) on delete set null,
  is_verified  boolean not null default false,  -- verified partner badge
  is_featured  boolean not null default false,  -- paid featured listing
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ── 4. Offers ─────────────────────────────────────────────────────
create type validity_type as enum (
  'birthday_day',      -- 生日當天
  'birthday_week',     -- 生日前後一星期
  'birth_month',       -- 整個生日月份
  'registration'       -- 會員登記即享
);

create table public.offers (
  id               uuid primary key default uuid_generate_v4(),
  brand_id         uuid references public.brands(id) on delete cascade,
  title_tc         text not null,           -- 免費生日蛋糕一個
  description_tc   text not null,           -- 詳細說明
  short_desc_tc    text,                    -- 短版 for cards (≤60 chars)
  validity_type    validity_type not null,
  requirements_tc  text,                    -- 需要出示生日日期之身份證明文件
  source_url       text not null,           -- official promotion page URL
  is_free          boolean not null default false,  -- completely free offer flag
  is_active        boolean not null default true,
  verified_at      timestamptz,             -- last time we confirmed it's still live
  expires_at       timestamptz,             -- null = no fixed expiry
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ── 5. Tags ───────────────────────────────────────────────────────
create table public.tags (
  id      serial primary key,
  name_tc text not null unique,   -- e.g. 免費, 蛋糕, 門票, 折扣
  slug    text not null unique
);

insert into public.tags (name_tc, slug) values
  ('完全免費', 'free'),
  ('免費蛋糕', 'free-cake'),
  ('免費門票', 'free-entry'),
  ('免費禮品', 'free-gift'),
  ('折扣優惠', 'discount'),
  ('會員專屬', 'members-only'),
  ('需要預約', 'reservation-required'),
  ('生日當天', 'birthday-day-only'),
  ('全月有效', 'full-month');

create table public.offer_tags (
  offer_id  uuid references public.offers(id) on delete cascade,
  tag_id    int  references public.tags(id) on delete cascade,
  primary key (offer_id, tag_id)
);

-- ── 6. Scrape Log (auto-fetch audit trail) ────────────────────────
create table public.scrape_logs (
  id          uuid primary key default uuid_generate_v4(),
  brand_id    uuid references public.brands(id) on delete set null,
  source_url  text not null,
  status      text not null,   -- 'success' | 'failed' | 'unchanged'
  notes       text,
  scraped_at  timestamptz not null default now()
);

-- ── 7. Full-text search index ─────────────────────────────────────
create index offers_title_search_idx  on public.offers using gin (title_tc gin_trgm_ops);
create index brands_name_search_idx   on public.brands using gin (name_tc gin_trgm_ops);

-- ── 8. Updated_at auto-trigger ────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger brands_updated_at before update on public.brands
  for each row execute function public.set_updated_at();

create trigger offers_updated_at before update on public.offers
  for each row execute function public.set_updated_at();

-- ── 9. Row Level Security (public read, admin write) ─────────────
alter table public.categories   enable row level security;
alter table public.districts    enable row level security;
alter table public.brands       enable row level security;
alter table public.offers       enable row level security;
alter table public.tags         enable row level security;
alter table public.offer_tags   enable row level security;
alter table public.scrape_logs  enable row level security;

-- Public read
create policy "public read categories"  on public.categories  for select using (true);
create policy "public read districts"   on public.districts   for select using (true);
create policy "public read brands"      on public.brands      for select using (true);
create policy "public read offers"      on public.offers      for select using (is_active = true);
create policy "public read tags"        on public.tags        for select using (true);
create policy "public read offer_tags"  on public.offer_tags  for select using (true);

-- ── 10. Seed: Real HK Birthday Offers ────────────────────────────
-- (Sample data — update with real verified offers before launch)

with brand_insert as (
  insert into public.brands (name_tc, name_en, website_url, category_id, district_id, is_verified)
  values
    ('香港迪士尼樂園', 'Hong Kong Disneyland',
     'https://www.hongkongdisneyland.com', 2, 4, true),
    ('海洋公園',       'Ocean Park',
     'https://www.oceanpark.com.hk', 2, 1, true),
    ('杜莎夫人蠟像館', 'Madame Tussauds',
     'https://www.madametussauds.com/hong-kong', 2, 1, true),
    ('百老匯院線',     'Broadway Circuit',
     'https://www.cinema.com.hk', 3, null, true),
    ('嘉禾院線',       'Golden Harvest',
     'https://www.goldenharvest.com', 3, null, true),
    ('UNIQLO',         'UNIQLO',
     'https://www.uniqlo.com/hk', 4, null, false)
  returning id, name_tc
)
select * from brand_insert;
