import { TreatmentCategory } from '../types';

// Reva course-code prefixes (from the clinic's product sales report).
// Longer prefixes are checked first. Codes not listed here fall through to
// the name keywords below; fillers (C-JUV, C-RES, C-HA, C-JEL, C-SCU) are left
// out on purpose until their recall interval is decided.
export const COURSE_CODE_CATEGORIES: [prefix: string, category: TreatmentCategory][] = [
  ['C-OLIX', 'Lifting'], // Oligio
  ['C-UTR', 'Lifting'], // Ulthera
  ['C-SCP', 'Lifting'], // Sculptra
  ['C-ALG', 'Injectables'], // Allergan
  ['C-BOT', 'Injectables'],
  ['C-XEO', 'Injectables'], // Xeomin
  ['C-NEU', 'Injectables'], // Neuronox
  ['C-RED', 'Skin'], // Red Touch Pro (Skin Quality group)
  ['C-EJA', 'Skin'], // Ejal40
  ['C-BBG', 'Skin'], // BabyGLOW / Redensity
  ['C-DIO', 'Laser'] // Triplex Diode hair removal
];

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

export function inferCategory(code: string, name: string): TreatmentCategory {
  const c = code.trim().toUpperCase();
  if (c) {
    const byCode = [...COURSE_CODE_CATEGORIES]
      .sort((a, b) => b[0].length - a[0].length)
      .find(([prefix]) => c.startsWith(prefix));
    if (byCode) return byCode[1];
  }
  const n = name.toLowerCase();
  const byName = NAME_KEYWORDS.find(([kw]) => n.includes(kw));
  return byName ? byName[1] : 'Other';
}
