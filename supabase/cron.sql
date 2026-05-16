-- ══════════════════════════════════════════════════════════════
-- BDO Scheduled Scraping — pg_cron setup
-- Run this in Supabase SQL Editor AFTER enabling pg_cron extension.
-- (Dashboard → Database → Extensions → pg_cron → Enable)
-- ══════════════════════════════════════════════════════════════

-- Enable pg_cron
create extension if not exists pg_cron;

-- Schedule: run scraper every day at 3:00 AM HKT (= 19:00 UTC)
select cron.schedule(
  'bdo-scrape-offers',          -- job name
  '0 19 * * *',                 -- cron expression (daily 3am HKT)
  $$
    select net.http_post(
      url    := current_setting('app.supabase_url') || '/functions/v1/scrape-offers',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || current_setting('app.service_role_key')
      ),
      body   := '{}'::jsonb
    ) as request_id;
  $$
);

-- To view scheduled jobs:
-- select * from cron.job;

-- To unschedule:
-- select cron.unschedule('bdo-scrape-offers');
