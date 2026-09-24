import { TreatmentCategory } from '../types';

// Reva course-code prefixes (from the clinic's product sales report).
// Longer prefixes are checked first. Codes not listed here fall through to
// the name keywords below.
export const COURSE_CODE_CATEGORIES: [prefix: string, category: TreatmentCategory][] = [
  ['C-OLIX', 'Lifting'], // Oligio
  ['C-UTR', 'Lifting'], // Ulthera
  ['C-SCP', 'Lifting'], // Sculptra
  ['C-ALG', 'Injectables'], // Allergan
  ['C-BOT', 'Injectables'],
  ['C-XEO', 'Injectables'], // Xeomin
  ['C-NEU', 'Injectables'], // Neuronox
  ['C-JUV', 'Injectables'], // Filler
  ['C-RES', 'Injectables'], // Filler
  ['C-HA', 'Injectables'], // Filler
  ['C-JEL', 'Injectables'], // Filler
  ['C-SCU', 'Injectables'], // Filler
  ['C-RED', 'Skin'], // Red Touch Pro (Skin Quality group)
  ['C-EJA', 'Skin'], // Ejal40
  ['C-BBG', 'Skin'], // BabyGLOW / Redensity
  ['C-DIO', 'Laser'] // Triplex Diode hair removal
];

// Checked before NAME_KEYWORDS: names that would otherwise match a category
// but are not a treatment to recall (e.g. dissolving filler)
export const NAME_EXCLUSIONS = ['สลายฟิลเลอร์', 'hyaluronidase'];

// Matched against the lower-cased treatment name when the code gives no answer
export const NAME_KEYWORDS: [keyword: string, category: TreatmentCategory][] = [
  ['oligio', 'Lifting'],
  ['ulthera', 'Lifting'],
  ['thermage', 'Lifting'],
  ['ultraformer', 'Lifting'],
  ['hifu', 'Lifting'],
  ['sculptra', 'Lifting'],
  ['ยกกระชับ', 'Lifting'],
  ['botox', 'Injectables'],
  ['allergan', 'Injectables'],
  ['xeomin', 'Injectables'],
  ['nabota', 'Injectables'],
  ['dysport', 'Injectables'],
  ['neuronox', 'Injectables'],
  ['โบท็อก', 'Injectables'],
  ['filler', 'Injectables'],
  ['ฟิลเลอร์', 'Injectables'],
  ['juvederm', 'Injectables'],
  ['restylane', 'Injectables'],
  ['rejuran', 'Skin'],
  ['juvelook', 'Skin'],
  ['profhilo', 'Skin'],
  ['ejal', 'Skin'],
  ['redensity', 'Skin'],
  ['babyglow', 'Skin'],
  ['belotero revive', 'Skin'],
  ['skin booster', 'Skin'],
  ['skinbooster', 'Skin'],
  ['red touch', 'Skin'],
  ['pico', 'Laser'],
  ['laser', 'Laser'],
  ['เลเซอร์', 'Laser'],
  ['diode', 'Laser'],
  ['ipl', 'Laser'],
  ['yellow', 'Laser']
];

// Recall intervals that differ from their category default (CYCLE_INTERVAL_DAYS).
// Matched by course-code prefix, or by keyword in the name when there is no code.
export const COURSE_INTERVAL_OVERRIDES: { prefix: string; keyword: string; label: string; days: number }[] = [
  { prefix: 'C-RED', keyword: 'red touch', label: 'Red Touch Pro', days: 30 }
];

export function intervalOverride(code: string | undefined, name: string): number | undefined {
  const c = (code ?? '').trim().toUpperCase();
  const n = name.toLowerCase();
  const match = COURSE_INTERVAL_OVERRIDES.find(o => (c ? c.startsWith(o.prefix) : n.includes(o.keyword)));
  return match?.days;
}

export function inferCategory(code: string, name: string): TreatmentCategory {
  const c = code.trim().toUpperCase();
  if (c) {
    const byCode = [...COURSE_CODE_CATEGORIES]
      .sort((a, b) => b[0].length - a[0].length)
      .find(([prefix]) => c.startsWith(prefix));
    if (byCode) return byCode[1];
  }
  const n = name.toLowerCase();
  if (NAME_EXCLUSIONS.some(kw => n.includes(kw))) return 'Other';
  const byName = NAME_KEYWORDS.find(([kw]) => n.includes(kw));
  return byName ? byName[1] : 'Other';
}
