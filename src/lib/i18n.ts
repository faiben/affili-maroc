import type { Translations } from "@/lib/translations";

const CATEGORY_KEY_MAP: Record<string, keyof Translations> = {
  "Mode & Beauté": "categoryMode",
  "Électronique": "categoryElectronics",
  "Maison & Décoration": "categoryHome",
  "Santé & Bien-être": "categoryHealth",
  "Food & Restaurants": "categoryFood",
  "Services & SaaS": "categoryServices",
  "Voyage & Loisirs": "categoryTravel",
  "Autres": "categoryOther",
};

export function categoryLabel(
  value: string,
  t: (key: keyof Translations) => string
): string {
  const key = CATEGORY_KEY_MAP[value];
  return key ? t(key) : value;
}
