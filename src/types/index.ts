// ══════════════════════════════════════════════════════════════
// BDO — TypeScript types (mirrors Supabase schema)
// ══════════════════════════════════════════════════════════════

export type ValidityType =
  | "birthday_day"
  | "birthday_week"
  | "birth_month"
  | "registration";

export const VALIDITY_LABEL: Record<ValidityType, string> = {
  birthday_day:  "生日當天",
  birthday_week: "生日前後一星期",
  birth_month:   "整個生日月份",
  registration:  "登記即享",
};

// ── DB Row Types ─────────────────────────────────────────────
export interface Category {
  id: number;
  slug: string;
  name_tc: string;
  icon: string;
  sort_order: number;
}

export interface District {
  id: number;
  slug: string;
  name_tc: string;
}

export interface Brand {
  id: string;
  name_tc: string;
  name_en: string | null;
  logo_url: string | null;
  website_url: string | null;
  category_id: number | null;
  district_id: number | null;
  is_verified: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  // joined
  category?: Category;
  district?: District;
}

export interface Tag {
  id: number;
  name_tc: string;
  slug: string;
}

export interface Offer {
  id: string;
  brand_id: string;
  title_tc: string;
  description_tc: string;
  short_desc_tc: string | null;
  validity_type: ValidityType;
  requirements_tc: string | null;
  source_url: string;
  is_free: boolean;
  is_active: boolean;
  verified_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  // joined
  brand?: Brand;
  tags?: Tag[];
}

// ── UI / Filter State ────────────────────────────────────────
export interface OfferFilters {
  category?: string;   // category slug
  district?: string;   // district slug
  validity?: ValidityType;
  isFree?: boolean;
  search?: string;
}

// ── Scrape Log ───────────────────────────────────────────────
export interface ScrapeLog {
  id: string;
  brand_id: string | null;
  source_url: string;
  status: "success" | "failed" | "unchanged";
  notes: string | null;
  scraped_at: string;
}
