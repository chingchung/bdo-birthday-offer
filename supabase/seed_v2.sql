-- ══════════════════════════════════════════════════════════════
-- BDO Seed v2 — 分開執行，避免 rollback 問題
-- 喺 Supabase SQL Editor 逐段執行（每段獨立 Run）
-- ══════════════════════════════════════════════════════════════

-- ════════════════════════════════════════
-- STEP 1：清除舊數據（如有）先 Run 呢段
-- ════════════════════════════════════════
delete from public.offer_tags;
delete from public.offers;
delete from public.brands;

-- ════════════════════════════════════════
-- STEP 2：插入品牌 — Run 呢段
-- ════════════════════════════════════════
insert into public.brands
  (id, name_tc, name_en, website_url, category_id, district_id, is_verified, is_featured)
values
  ('00000000-0000-0000-0000-000000000001', '香港迪士尼樂園', 'Hong Kong Disneyland',   'https://www.hongkongdisneyland.com', 2, 4, true,  true),
  ('00000000-0000-0000-0000-000000000002', '海洋公園香港',   'Ocean Park Hong Kong',    'https://www.oceanpark.com.hk',       2, 1, true,  true),
  ('00000000-0000-0000-0000-000000000003', '杜莎夫人蠟像館', 'Madame Tussauds HK',      'https://www.madametussauds.com/hong-kong/', 2, 1, true, false),
  ('00000000-0000-0000-0000-000000000004', '百老匯院線',     'Broadway Circuit',        'https://www.cinema.com.hk',          3, null, true, false),
  ('00000000-0000-0000-0000-000000000005', '嘉禾院線',       'Golden Harvest',          'https://www.goldenharvest.com',       3, null, true, false),
  ('00000000-0000-0000-0000-000000000006', '英皇戲院',       'Emperor Cinemas',         'https://www.emperorcinemas.com',      3, null, true, false),
  ('00000000-0000-0000-0000-000000000007', '大家樂',         'Café de Coral',           'https://www.cafedecoral.com',         1, null, true, false),
  ('00000000-0000-0000-0000-000000000008', '大快活',         'Fairwood',                'https://www.fairwood.com.hk',         1, null, true, false),
  ('00000000-0000-0000-0000-000000000009', '美心西餅',       'Maxim''s Cakes',          'https://www.maximscakes.com.hk',      7, null, true, true),
  ('00000000-0000-0000-0000-000000000010', '山頂纜車',       'Peak Tram',               'https://www.thepeak.com.hk',          2, 1,    true, false),
  ('00000000-0000-0000-0000-000000000011', '君悅酒店',       'Grand Hyatt Hong Kong',   'https://www.hyatt.com/en-US/hotel/china/grand-hyatt-hong-kong', 5, 1, true, false),
  ('00000000-0000-0000-0000-000000000012', 'The Mira Hong Kong', 'The Mira Hong Kong',  'https://www.themirahotel.com',        5, 2,    true, false),
  ('00000000-0000-0000-0000-000000000013', 'UNIQLO',         'UNIQLO',                  'https://www.uniqlo.com/hk',           4, null, true, false),
  ('00000000-0000-0000-0000-000000000014', '昂坪360',        'Ngong Ping 360',          'https://www.np360.com.hk',            2, 4,    true, false);

-- ════════════════════════════════════════
-- STEP 3：插入優惠 — Run 呢段
-- ════════════════════════════════════════
insert into public.offers
  (id, brand_id, title_tc, short_desc_tc, description_tc,
   validity_type, requirements_tc, source_url, is_free, is_active, verified_at)
values
  (
    '10000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    '生日免費入場一天（配合酒店套票）',
    '訂酒店套票壽星免費入樂園一天',
    '凡於生日當月訂購迪士尼樂園酒店套票，壽星可享免費樂園一日票一張。需出示有效身份證明文件核實生日日期。優惠須提前預訂，名額有限。',
    'birth_month', '需出示有效身份證明文件核實生日月份。需配合酒店套票使用，不可單獨換領。',
    'https://www.hongkongdisneyland.com/offers/birthday/', true, true, now()
  ),
  (
    '10000000-0000-0000-0000-000000000002'::uuid,
    '00000000-0000-0000-0000-000000000002'::uuid,
    '生日免費入場海洋公園',
    '生日當天憑身份證免費入場',
    '壽星於生日當天可免費入場海洋公園一次，需出示載有出生日期之有效身份證明文件。每位壽星只限換領一次，不可轉讓。',
    'birthday_day', '需出示香港身份證或護照。壽星本人使用，每年只限一次。',
    'https://www.oceanpark.com.hk', true, true, now()
  ),
  (
    '10000000-0000-0000-0000-000000000003'::uuid,
    '00000000-0000-0000-0000-000000000003'::uuid,
    '生日特價門票 HK$160',
    '生日月份特價門票 HK$160（原價 $290）',
    '壽星於生日月份內到訪杜莎夫人蠟像館，可享特價門票 HK$160（原價 HK$290），慳番 HK$130！',
    'birth_month', '需出示有效身份證明文件核實生日月份。',
    'https://www.madametussauds.com/hong-kong/', false, true, now()
  ),
  (
    '10000000-0000-0000-0000-000000000004'::uuid,
    '00000000-0000-0000-0000-000000000004'::uuid,
    '生日免費戲票一張',
    '會員生日月份免費換領戲票一張',
    '百老匯電影會會員於生日當月可免費換領電影票一張，適用於全線百老匯院線。',
    'birth_month', '需為百老匯電影會會員。登入後於生日月份換領，座位視乎場次供應。',
    'https://www.cinema.com.hk', true, true, now()
  ),
  (
    '10000000-0000-0000-0000-000000000005'::uuid,
    '00000000-0000-0000-0000-000000000005'::uuid,
    '生日月份半價戲票',
    '會員生日月份半價戲票',
    '嘉禾會員於生日月份可享半價電影票優惠，適用於全線嘉禾院線。',
    'birth_month', '需為嘉禾院線會員。不適用於特別場次、IMAX、4DX。每月限換領一次。',
    'https://www.goldenharvest.com', false, true, now()
  ),
  (
    '10000000-0000-0000-0000-000000000006'::uuid,
    '00000000-0000-0000-0000-000000000006'::uuid,
    '英皇戲院生日免費戲票',
    'Club E 會員生日當天免費戲票',
    '英皇戲院 Club E 會員於生日當天可免費換領電影票一張，適用於全線英皇戲院。',
    'birthday_day', '需為英皇戲院 Club E 會員。於生日當天到戲院服務台出示會員證及身份證換領。',
    'https://www.emperorcinemas.com', true, true, now()
  ),
  (
    '10000000-0000-0000-0000-000000000007'::uuid,
    '00000000-0000-0000-0000-000000000007'::uuid,
    '大家樂 App 生日專屬優惠券',
    'App 會員生日月份獲折扣或免費飲品券',
    '大家樂 App 會員於生日當月可獲專屬生日優惠券，包括指定套餐折扣或免費飲品，透過 App 自動發放。',
    'birth_month', '需下載大家樂 App 並登記會員，完善個人資料（包括生日日期）。',
    'https://www.cafedecoral.com', false, true, now()
  ),
  (
    '10000000-0000-0000-0000-000000000008'::uuid,
    '00000000-0000-0000-0000-000000000008'::uuid,
    '大快活 App 生日套餐折扣',
    'App 會員生日當天套餐折扣',
    '大快活 App 會員於生日當天可享指定套餐折扣優惠，透過 App 出示優惠碼使用。',
    'birthday_day', '需下載大快活 App 並登記完整個人資料。於生日當天於 App 換領並出示優惠碼。',
    'https://www.fairwood.com.hk', false, true, now()
  ),
  (
    '10000000-0000-0000-0000-000000000009'::uuid,
    '00000000-0000-0000-0000-000000000009'::uuid,
    '美心西餅生日蛋糕 9 折',
    '電子會員生日月份蛋糕9折',
    '美心西餅電子會員於生日月份購買生日蛋糕可享 9 折優惠，部分款式更有免費刻字服務。',
    'birth_month', '需為美心西餅電子會員。於門市出示會員二維碼使用，不可與其他優惠同用。',
    'https://www.maximscakes.com.hk', false, true, now()
  ),
  (
    '10000000-0000-0000-0000-000000000010'::uuid,
    '00000000-0000-0000-0000-000000000010'::uuid,
    '山頂纜車生日免費乘搭 + 觀景台',
    '生日當天免費纜車往返 + 觀景台入場',
    '壽星於生日當天可免費乘搭山頂纜車往返一次，並享 The Peak Tower 觀景台免費入場。',
    'birthday_day', '需出示載有出生日期之有效身份證明文件。每人每年只限使用一次。',
    'https://www.thepeak.com.hk', true, true, now()
  ),
  (
    '10000000-0000-0000-0000-000000000011'::uuid,
    '00000000-0000-0000-0000-000000000011'::uuid,
    '君悅酒店生日住宿禮遇',
    '生日月份住宿升級 + 免費蛋糕',
    '壽星於生日月份預訂君悅酒店住宿，可享客房升級、免費生日蛋糕及餐廳優惠等生日禮遇。',
    'birth_month', '需提前聯絡酒店預訂並告知為生日住宿。需出示有效身份證明文件。優惠視乎房間供應。',
    'https://www.hyatt.com/en-US/hotel/china/grand-hyatt-hong-kong', false, true, now()
  ),
  (
    '10000000-0000-0000-0000-000000000012'::uuid,
    '00000000-0000-0000-0000-000000000012'::uuid,
    'The Mira 生日住宿免費升級',
    '生日住宿免費升級 + 蛋糕驚喜',
    '壽星於生日當月入住 The Mira Hong Kong，可享免費客房升級、生日蛋糕及 Mira Spa 優惠。',
    'birth_month', '需提前告知酒店為生日住宿，並出示身份證明文件核實。升級視乎房間供應。',
    'https://www.themirahotel.com', false, true, now()
  ),
  (
    '10000000-0000-0000-0000-000000000013'::uuid,
    '00000000-0000-0000-0000-000000000013'::uuid,
    'UNIQLO 會員生日優惠券',
    '完善資料後生日月份獲購物優惠券',
    'UNIQLO 會員完善個人資料（包括生日）後，可於生日月份獲得專屬生日優惠券，享購物折扣。',
    'birth_month', '需為 UNIQLO 會員並完善個人資料。優惠券將於生日月份前發送至登記電郵。',
    'https://www.uniqlo.com/hk', false, true, now()
  ),
  (
    '10000000-0000-0000-0000-000000000014'::uuid,
    '00000000-0000-0000-0000-000000000014'::uuid,
    '昂坪360生日優惠票價',
    '生日月份昂坪360特別票價',
    '壽星於生日月份購買昂坪360纜車票可享特別優惠票價，欣賞大嶼山美景同時慶祝生日。',
    'birth_month', '需出示載有出生日期之有效身份證明文件。',
    'https://www.np360.com.hk', false, true, now()
  );

-- ════════════════════════════════════════
-- STEP 4：加 Tags — Run 呢段
-- ════════════════════════════════════════
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
select '10000000-0000-0000-0000-000000000010'::uuid, id from public.tags where slug in ('free', 'free-entry', 'birthday-day-only')
union all
select '10000000-0000-0000-0000-000000000011'::uuid, id from public.tags where slug in ('free-cake', 'discount', 'reservation-required', 'full-month')
union all
select '10000000-0000-0000-0000-000000000012'::uuid, id from public.tags where slug in ('free-cake', 'discount', 'full-month')
union all
select '10000000-0000-0000-0000-000000000013'::uuid, id from public.tags where slug in ('discount', 'members-only', 'full-month')
union all
select '10000000-0000-0000-0000-000000000014'::uuid, id from public.tags where slug in ('discount', 'full-month')
on conflict do nothing;

-- ════════════════════════════════════════
-- 確認數據：Run 呢段 check 結果
-- ════════════════════════════════════════
select 'brands' as table_name, count(*) as rows from public.brands
union all
select 'offers', count(*) from public.offers
union all
select 'offer_tags', count(*) from public.offer_tags;
