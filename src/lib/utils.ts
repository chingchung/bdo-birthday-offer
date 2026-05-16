import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { VALIDITY_LABEL, type ValidityType } from "@/types";

/** Tailwind class merge utility */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format verified date in TC */
export function formatVerifiedDate(dateStr: string | null): string {
  if (!dateStr) return "未經核實";
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日核實`;
}

/** Human-readable validity label */
export function getValidityLabel(type: ValidityType): string {
  return VALIDITY_LABEL[type] ?? type;
}

/** Truncate text with ellipsis */
export function truncate(str: string, maxLen: number): string {
  return str.length <= maxLen ? str : str.slice(0, maxLen) + "…";
}

/** Days since a date (for "last verified X days ago") */
export function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/** Validity badge color */
export function validityColor(type: ValidityType): string {
  return {
    birthday_day:  "bg-red-50 text-red-600 border-red-200",
    birthday_week: "bg-orange-50 text-orange-600 border-orange-200",
    birth_month:   "bg-purple-50 text-purple-600 border-purple-200",
    registration:  "bg-blue-50 text-blue-600 border-blue-200",
  }[type] ?? "bg-gray-50 text-gray-600";
}
