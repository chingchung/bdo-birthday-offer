-- ══════════════════════════════════════════════════════════════
-- BDO Seed Data — 真實香港生日優惠
-- 在 schema.sql 跑完之後，再跑呢個檔案
-- ══════════════════════════════════════════════════════════════

-- ── 1. 插入品牌 ───────────────────────────────────────────────
insert into public.brands (id, name_tc, name_en, website_url, category_id, district_id, is_verified, is_featured) values

  -- 主題樂園 (category 2)
  ('00000000-0000-0000-0000-000000000001', '香港迪士尼樂園', 'Hong Kong Disneyland',
   'https://www.hongkongdisneyland.com/offers/birthday/', 2, 4, true, true),

  ('00000000-0000-0000-0000-000000000002', '海洋公園香港', 'Ocean Park Hong Kong',
   'https://www.oceanpark.com.hk', 2, 1, true, true),

  ('00000000-0000-0000-0000-000000000003', '杜莎夫人蠟像館', 'Madame Tussauds HK',
   'https://www.madametussauds.com/hong-kong/', 2, 1, true, false),

  -- 戲院 (category 3)
  ('00000000-0000-0000-0000-000000000004', '百老匯院線', 'Broadway Circuit',
   'https://www.cinema.com.hk', 3, null, true, false),

  ('00000000-0000-0000-0000-000000000005', '嘉禾院線', 'Golden Harvest',
   'https://www.goldenharvest.com', 3, null, true, false),

  ('00000000-0000-0000-0000-000000000006', '英皇戲院', 'Emperor Cinemas',
   'https://www.emperorcinemas.com', 3, null, true, false),

  -- 餐飲 (category 1)
  ('00000000-0000-0000-0000-000000000007', '大家樂', 'Café de Coral',
   'https://www.cafedecoral.com', 1, null, true, false),

  ('00000000-0000-0000-0000-000000000008', '大快活', 'Fairwood',
   'https://www.fairwood.com.hk', 1, null, true, false),

  ('00000000-0000-0000-0000-000000000009', '美心西餅', 'Maxim''s Cakes',
   'https://www.maximscakes.com.hk', 7, null, true, true),

  ('00000000-0000-0000-0000-000000000010', '一粒米', 'Yat Lap Mai',
   'https://www.yatlap.com', 7, null, false, false),

  -- 酒店 (category 5)
  ('00000000-0000-0000-0000-000000000011', '君悅酒店', 'Grand Hyatt Hong Kong',
   'https://www.hyatt.com/en-US/hotel/china/grand-hyatt-hong-kong', 5, 1, true, false),

  ('00000000-0000-0000-0000-000000000012', 'The Mira Hong Kong',  'The Mira Hong Kong',
   'https://www.themirahotel.com', 5, 2, true, false),

  -- 零售 (category 4)
  ('00000000-0000-0000-0000-000000000013', 'UNIQLO', 'UNIQLO',
   'https://www.uniqlo.com/hk/zh/special-feature/birthday', 4, null, true, false),

  -- Spa (category 6)
  ('00000000-0000-0000-0000-000000000014', 'I.SÆASON', 'I.SÆASON Spa',
   'https://www.isaeason.com', 6, 1, false, false),

  -- 主題樂園其他
  ('00000000-0000-0000-0000-000000000015', '昂坪360', 'Ngong Ping 360',
   'https://www.np360.com.hk', 2, 4, true, false),

  ('00000000-0000-0000-0000-000000000016', '山頂纜車', 'Peak Tram',
   'https://www.thepeak.com.hk', 2, 1, true, false)

on conflict (id) do nothing;


-- ── 2. 插入優惠 ───────────────────────────────────────────────
insert into public.offers (
  id, brand_id, title_tc, description_tc, short_desc_tc,
  validity_type, requirements_tc, source_url, is_free, is_active, verified_at
) values

  -- 迪士尼
  ('10000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000001',
   '生日免費入場一天（配合酒店套票）',
   '凡於生日當月訂購迪士尼樂園酒店套票，壽星可享免費樂園一日票一張。需出示有效身份證明文件核實生日日期。優惠須提前預訂，名額有限。',
   '訂酒店套票壽星免費入樂園一天',
   'birth_month',
   '需出示有效身份證明文件（身份證或護照）核實生日月份。需配合酒店套票使用，不可單獨換領。',
   'https://www.hongkongdisneyland.com/offers/birthday/',
   true, true, now() - interval '3 days'),

  -- 海洋公園
  ('10000000-0000-0000-0000-000000000002',
   '00000000-0000-0000-0000-000000000002',
   '生日免費入場海洋公園',
   '壽星於生日當天可免費入場海洋公園一次，需出示載有出生日期之有效身份證明文件。每位壽星只限換領一次，不可轉讓。',
   '生日當天憑身份證免費入場',
   'birthday_day',
   '需出示香港身份證或護照核實生日日期。壽星本人使用，不可轉讓。每人每年只限一次。',
   'https://www.oceanpark.com.hk',
   true, true, now() - interval '5 days'),

  -- 杜莎夫人蠟像館
  ('10000000-0000-0000-0000-000000000003',
   '00000000-0000-0000-0000-000000000003',
   '生日特價門票 HK$160',
   '壽星於生日月份內到訪杜莎夫人蠟像館，可享特價門票 HK$160（原價 HK$290），慳番 HK$130！',
   '生日月份特價門票 HK$160（原價 $290）',
   'birth_month',
   '需出示有效身份證明文件核實生日月份。特價門票需於官網預先購買或現場出示證件換領。',
   'https://www.madametussauds.com/hong-kong/',
   false, true, now() - interval '7 days'),

  -- 百老匯院線
  ('10000000-0000-0000-0000-000000000004',
   '00000000-0000-0000-0000-000000000004',
   '生日免費戲票一張',
   '百老匯電影會會員於生日當月可免費換領電影票一張，適用於全線百老匯院線（百老匯電影中心、The Cinematheque 等）。',
   '會員生日月份免費換領戲票一張',
   'birth_month',
   '需為百老匯電影會會員。登入會員帳戶後可於生日月份換領免費戲票，座位視乎場次供應。',
   'https://www.cinema.com.hk',
   true, true, now() - interval '10 days'),

  -- 嘉禾院線
  ('10000000-0000-0000-0000-000000000005',
   '00000000-0000-0000-0000-000000000005',
   '生日月份半價戲票',
   '嘉禾會員於生日月份可享半價電影票優惠，適用於全線嘉禾院線。每月可換領一次，不適用於特別場次及 IMAX 場。',
   '會員生日月份半價戲票',
   'birth_month',
   '需為嘉禾院線會員。不適用於特別場次、IMAX、4DX 及首映禮等。每月限換領一次。',
   'https://www.goldenharvest.com',
   false, true, now() - interval '8 days'),

  -- 英皇戲院
  ('10000000-0000-0000-0000-000000000006',
   '00000000-0000-0000-0000-000000000006',
   '生日免費戲票一張',
   '英皇戲院 Club E 會員於生日當天可免費換領電影票一張，適用於全線英皇戲院。',
   'Club E 會員生日當天免費戲票',
   'birthday_day',
   '需為英皇戲院 Club E 會員。於生日當天到戲院服務台出示會員證及身份證換領。',
   'https://www.emperorcinemas.com',
   true, true, now() - interval '6 days'),

  -- 大家樂
  ('10000000-0000-0000-0000-000000000007',
   '00000000-0000-0000-0000-000000000007',
   '大家樂 App 生日禮遇',
   '大家樂 App 會員於生日當月可獲專屬生日優惠券，包括指定套餐折扣或免費飲品，透過 App 自動發放。',
   'App 會員生日月份專屬優惠券',
   'birth_month',
   '需下載大家樂 App 並登記為會員，完善個人資料（包括生日日期）。優惠券將於生日月份自動發放至帳戶。',
   'https://www.cafedecoral.com',
   false, true, now() - interval '14 days'),

  -- 大快活
  ('10000000-0000-0000-0000-000000000008',
   '00000000-0000-0000-0000-000000000008',
   '大快活 App 生日優惠',
   '大快活 App 會員於生日當天可享指定套餐折扣優惠，透過 App 出示優惠碼使用。',
   'App 會員生日當天套餐折扣',
   'birthday_day',
   '需下載大快活 App 並登記完整個人資料。於生日當天於 App 換領並出示優惠碼。',
   'https://www.fairwood.com.hk',
   false, true, now() - interval '12 days'),

  -- 美心西餅
  ('10000000-0000-0000-0000-000000000009',
   '00000000-0000-0000-0000-000000000009',
   '美心西餅生日蛋糕優惠',
   '美心西餅電子會員於生日月份購買生日蛋糕可享 9 折優惠，部分款式更有免費刻字服務。',
   '電子會員生日月份蛋糕9折',
   'birth_month',
   '需為美心西餅電子會員。於生日月份到門市購買蛋糕時出示會員二維碼使用，不可與其他優惠同用。',
   'https://www.maximscakes.com.hk',
   false, true, now() - interval '4 days'),

  -- UNIQLO
  ('10000000-0000-0000-0000-000000000010',
   '00000000-0000-0000-0000-000000000013',
   'UNIQLO 會員生日優惠券',
   'UNIQLO 會員完善個人資料（包括生日）後，可於生日月份獲得專屬生日優惠券，享購物折扣。',
   '完善資料後生日月份獲購物優惠券',
   'birth_month',
   '需為 UNIQLO 會員並完善個人資料（包括出生日期）。優惠券將於生日月份前發送至登記電郵。',
   'https://www.uniqlo.com/hk/zh/special-feature/birthday',
   false, true, now() - interval '20 days'),

  -- 昂坪360
  ('10000000-0000-0000-0000-000000000011',
   '00000000-0000-0000-0000-000000000015',
   '昂坪360生日優惠票價',
   '壽星於生日月份購買昂坪360纜車票可享特別優惠票價，欣賞大嶼山美景同時慶祝生日。',
   '生日月份昂坪360特別票價',
   'birth_month',
   '需出示載有出生日期之有效身份證明文件。優惠票價於官網或現場購票時適用。',
   'https://www.np360.com.hk',
   false, true, now() - interval '15 days'),

  -- 山頂纜車
  ('10000000-0000-0000-0000-000000000012',
   '00000000-0000-0000-0000-000000000016',
   '山頂纜車生日免費乘搭',
   '壽星於生日當天可免費乘搭山頂纜車往返一次，並享 The Peak Tower 觀景台免費入場。需出示身份證明文件。',
   '生日當天免費纜車+觀景台',
   'birthday_day',
   '需出示載有出生日期之有效身份證明文件（香港身份證或護照）。每人每年只限使用一次。',
   'https://www.thepeak.com.hk',
   true, true, now() - interval '9 days'),

  -- 君悅酒店
  ('10000000-0000-0000-0000-000000000013',
   '00000000-0000-0000-0000-000000000011',
   '君悅酒店生日 Staycation 優惠',
   '壽星於生日月份預訂君悅酒店住宿，可享客房升級、免費蛋糕及餐廳用餐優惠等生日禮遇，部分套票更包含 Spa 體驗。',
   '生日月份住宿升級+免費蛋糕禮遇',
   'birth_month',
   '需提前聯絡酒店預訂並告知為生日住宿。需出示有效身份證明文件核實生日月份。優惠視乎房間供應。',
   'https://www.hyatt.com/en-US/hotel/china/grand-hyatt-hong-kong',
   false, true, now() - interval '18 days'),

  -- The Mira
  ('10000000-0000-0000-0000-000000000014',
   '00000000-0000-0000-0000-000000000012',
   'The Mira 生日住宿禮遇',
   '壽星於生日當月入住 The Mira Hong Kong，可享免費客房升級（視乎供應）、生日蛋糕及 Mira Spa 優惠價等驚喜。',
   '生日住宿免費升級+蛋糕驚喜',
   'birth_month',
   '需提前告知酒店為生日住宿，並出示身份證明文件核實。升級視乎房間供應，不作保證。',
   'https://www.themirahotel.com',
   false, true, now() - interval '22 days')

on conflict (id) do nothing;


-- ── 3. 加 Tags 到優惠 ────────────────────────────────────────
insert into public.offer_tags (offer_id, tag_id)
select '10000000-0000-0000-0000-000000000001'::uuid, id from public.tags where slug in ('free', 'free-entry', 'reservation-required')
union all
select '10000000-0000-0000-0000-000000000002'::uuid, id from public.tags where slug in ('free', 'free-entry', 'birthday-day-only')
union all
select '10000000-0000-0000-0000-000000000003'::uuid, id from public.tags where slug in ('discount', 'full-month')
union all
select '10000000-0000-0000-0000-000000000004'::uuid, id from public.tags where slug in ('free', 'members-only', 'full-month')
union all
select '10000000-0000-0000-0000-000000000005'::uuid, id from public.tags where slug in ('discount', 'members-only', 'full-month')
union all
select '10000000-0000-0000-0000-000000000006'::uuid, id from public.tags where slug in ('free', 'free-entry', 'members-only', 'birthday-day-only')
union all
select '10000000-0000-0000-0000-000000000007'::uuid, id from public.tags where slug in ('discount', 'members-only', 'full-month')
union all
select '10000000-0000-0000-0000-000000000008'::uuid, id from public.tags where slug in ('discount', 'members-only', 'birthday-day-only')
union all
select '10000000-0000-0000-0000-000000000009'::uuid, id from public.tags where slug in ('free-cake', 'discount', 'members-only', 'full-month')
union all
select '10000000-0000-0000-0000-000000000010'::uuid, id from public.tags where slug in ('discount', 'members-only', 'full-month')
union all
select '10000000-0000-0000-0000-000000000011'::uuid, id from public.tags where slug in ('discount', 'full-month')
union all
select '10000000-0000-0000-0000-000000000012'::uuid, id from public.tags where slug in ('free', 'free-entry', 'birthday-day-only')
union all
select '10000000-0000-0000-0000-000000000013'::uuid, id from public.tags where slug in ('discount', 'free-cake', 'reservation-required', 'full-month')
union all
select '10000000-0000-0000-0000-000000000014'::uuid, id from public.tags where slug in ('discount', 'free-cake', 'full-month')
on conflict do nothing;
