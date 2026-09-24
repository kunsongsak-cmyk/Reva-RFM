import { PatientRecord, TreatmentCategory, TreatmentHistoryItem } from '../types';
import { inferCategory } from './courseCategories';
import { parseDate } from './rfm';

// Parses clinic exports (one row per treatment/payment line) into patient records.
// Everything runs in the browser; no data leaves the machine.

export type Cell = string | number | boolean | Date | null | undefined;

export type ImportField = 'hn' | 'name' | 'date' | 'item' | 'code' | 'amount' | 'doctor' | 'phone' | 'nickname' | 'lineId';

export type ColumnMapping = Partial<Record<ImportField, number>>;

export const IMPORT_FIELDS: { field: ImportField; label: string; required?: boolean }[] = [
  { field: 'hn', label: 'HN / รหัสลูกค้า', required: true },
  { field: 'name', label: 'ชื่อลูกค้า', required: true },
  { field: 'date', label: 'วันที่', required: true },
  { field: 'amount', label: 'ยอดเงิน', required: true },
  { field: 'item', label: 'ชื่อรายการ / คอร์ส' },
  { field: 'code', label: 'รหัสสินค้า / คอร์ส' },
  { field: 'doctor', label: 'แพทย์' },
  { field: 'phone', label: 'เบอร์โทร' },
  { field: 'nickname', label: 'ชื่อเล่น' },
  { field: 'lineId', label: 'LINE ID' }
];

const SYNONYMS: Record<ImportField, string[]> = {
  hn: ['hn', 'รหัสลูกค้า', 'รหัสคนไข้', 'รหัสสมาชิก', 'เลขที่ลูกค้า', 'customer id', 'customer code', 'patient id', 'member id'],
  name: ['ชื่อลูกค้า', 'ชื่อ-นามสกุล', 'ชื่อ - นามสกุล', 'ชื่อคนไข้', 'ชื่อ', 'ลูกค้า', 'customer name', 'patient name', 'name', 'customer'],
  date: ['วันที่ชำระ', 'วันที่ขาย', 'วันที่ใช้บริการ', 'วันที่ทำรายการ', 'วันที่', 'payment date', 'transaction date', 'date'],
  item: ['ชื่อสินค้า', 'ชื่อคอร์ส', 'รายการ', 'สินค้า', 'คอร์ส', 'บริการ', 'รายละเอียด', 'course', 'treatment', 'product', 'description', 'item'],
  code: ['รหัสสินค้า', 'รหัสคอร์ส', 'course code', 'product code', 'sku', 'code'],
  amount: ['ยอดชำระ', 'ยอดสุทธิ', 'ยอดรวม', 'ยอดเงิน', 'จำนวนเงิน', 'ราคา', 'amount', 'total', 'net', 'price'],
  doctor: ['แพทย์ผู้ทำ', 'แพทย์', 'หมอ', 'doctor'],
  phone: ['เบอร์โทรศัพท์', 'เบอร์โทร', 'โทรศัพท์', 'เบอร์', 'mobile', 'phone', 'tel'],
  nickname: ['ชื่อเล่น', 'nickname'],
  lineId: ['line id', 'ไลน์', 'line']
};

const norm = (v: Cell) => String(v ?? '').replace(/\s+/g, ' ').trim().toLowerCase();

// ---------- CSV ----------

export function parseCsv(text: string): string[][] {
  const src = text.replace(/^﻿/, '');
  const firstLine = src.split(/\r?\n/, 1)[0] ?? '';
  const delimiter = [',', '\t', ';'].reduce((best, d) =>
    firstLine.split(d).length > firstLine.split(best).length ? d : best
  );

  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"' && src[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === delimiter) { row.push(field); field = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += ch;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(c => c.trim() !== ''));
}

// ---------- Column detection ----------

function matchScore(header: string, synonym: string): number {
  if (!header) return 0;
  if (header === synonym) return 100 + synonym.length;
  if (header.includes(synonym)) return synonym.length;
  return 0;
}

export function guessMapping(headers: Cell[]): ColumnMapping {
  const hs = headers.map(norm);
  const candidates: { field: ImportField; col: number; score: number }[] = [];
  for (const field of Object.keys(SYNONYMS) as ImportField[]) {
    hs.forEach((h, col) => {
      const score = Math.max(...SYNONYMS[field].map(s => matchScore(h, s)));
      if (score > 0) candidates.push({ field, col, score });
    });
  }
  candidates.sort((a, b) => b.score - a.score);
  const mapping: ColumnMapping = {};
  const usedCols = new Set<number>();
  for (const c of candidates) {
    if (mapping[c.field] !== undefined || usedCols.has(c.col)) continue;
    mapping[c.field] = c.col;
    usedCols.add(c.col);
  }
  return mapping;
}

/** Index of the first row among the first 15 that looks like a header row. */
export function detectHeaderRow(rows: Cell[][]): number {
  let best = 0;
  let bestCount = 0;
  rows.slice(0, 15).forEach((row, i) => {
    const count = Object.keys(guessMapping(row)).length;
    if (count > bestCount) { best = i; bestCount = count; }
  });
  return best;
}

// ---------- Value parsing ----------

const THAI_MONTHS: Record<string, number> = {
  'ม.ค.': 0, 'ก.พ.': 1, 'มี.ค.': 2, 'เม.ย.': 3, 'พ.ค.': 4, 'มิ.ย.': 5,
  'ก.ค.': 6, 'ส.ค.': 7, 'ก.ย.': 8, 'ต.ค.': 9, 'พ.ย.': 10, 'ธ.ค.': 11,
  'มกราคม': 0, 'กุมภาพันธ์': 1, 'มีนาคม': 2, 'เมษายน': 3, 'พฤษภาคม': 4, 'มิถุนายน': 5,
  'กรกฎาคม': 6, 'สิงหาคม': 7, 'กันยายน': 8, 'ตุลาคม': 9, 'พฤศจิกายน': 10, 'ธันวาคม': 11
};

function toCeYear(y: number): number {
  if (y < 100) return y >= 60 ? 2500 + y - 543 : 2000 + y; // 2-digit: 60+ is Buddhist era
  return y > 2400 ? y - 543 : y;
}

function validDate(y: number, m: number, d: number): Date | null {
  const date = new Date(Date.UTC(y, m, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m && date.getUTCDate() === d ? date : null;
}

/** Returns an ISO date (YYYY-MM-DD) or null. Day-first for slashed dates, as used in Thailand. */
export function parseCellDate(cell: Cell): string | null {
  let date: Date | null = null;
  if (cell instanceof Date) {
    date = isNaN(cell.getTime()) ? null : validDate(cell.getUTCFullYear(), cell.getUTCMonth(), cell.getUTCDate());
  } else if (typeof cell === 'number') {
    // Excel serial date
    if (cell > 20000 && cell < 80000) date = new Date(Date.UTC(1899, 11, 30) + Math.floor(cell) * 86400000);
  } else if (typeof cell === 'string') {
    const s = cell.trim();
    let m: RegExpExecArray | null;
    if ((m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(s))) {
      date = validDate(toCeYear(+m[1]), +m[2] - 1, +m[3]);
    } else if ((m = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})/.exec(s))) {
      date = validDate(toCeYear(+m[3]), +m[2] - 1, +m[1]);
    } else if ((m = /^(\d{1,2})\s*([ก-๙.]+)\s*(\d{2,4})/.exec(s)) && THAI_MONTHS[m[2]] !== undefined) {
      date = validDate(toCeYear(+m[3]), THAI_MONTHS[m[2]], +m[1]);
    } else {
      const parsed = parseDate(s);
      date = parsed && validDate(toCeYear(parsed.getUTCFullYear()), parsed.getUTCMonth(), parsed.getUTCDate());
    }
  }
  return date ? date.toISOString().slice(0, 10) : null;
}

export function parseAmount(cell: Cell): number | null {
  if (typeof cell === 'number') return isFinite(cell) ? cell : null;
  if (typeof cell !== 'string') return null;
  let s = cell.trim();
  if (!s) return null;
  const negative = /^\(.*\)$/.test(s) || s.startsWith('-');
  s = s.replace(/[฿,\s()]|บาท|thb/gi, '').replace(/^-/, '');
  if (!/^\d+(\.\d+)?$/.test(s)) return null;
  const n = parseFloat(s);
  return negative ? -n : n;
}

// ---------- Build records ----------

export interface SkippedRow {
  row: number; // 1-based row number in the file
  reason: string;
}

export interface ImportResult {
  records: PatientRecord[];
  treatmentCount: number;
  skipped: SkippedRow[];
  categoryCounts: Record<TreatmentCategory, number>;
  uncategorized: { name: string; count: number }[];
  dateRange: { from: string; to: string } | null;
}

export function missingRequired(mapping: ColumnMapping): string[] {
  const missing: string[] = [];
  if (mapping.hn === undefined && mapping.name === undefined) missing.push('HN หรือ ชื่อลูกค้า');
  if (mapping.date === undefined) missing.push('วันที่');
  if (mapping.amount === undefined) missing.push('ยอดเงิน');
  if (mapping.item === undefined && mapping.code === undefined) missing.push('ชื่อรายการ หรือ รหัสสินค้า');
  return missing;
}

export function buildRecords(rows: Cell[][], headerRow: number, mapping: ColumnMapping): ImportResult {
  const get = (row: Cell[], f: ImportField) => (mapping[f] === undefined ? '' : String(row[mapping[f]!] ?? '').trim());
  const patients = new Map<string, PatientRecord>();
  const skipped: SkippedRow[] = [];
  const categoryCounts: Record<TreatmentCategory, number> = { Lifting: 0, Injectables: 0, Skin: 0, Laser: 0, Other: 0 };
  const other = new Map<string, number>();
  let treatmentCount = 0;
  let from = '';
  let to = '';

  rows.slice(headerRow + 1).forEach((row, i) => {
    const rowNo = headerRow + i + 2;
    if (!row.some(c => String(c ?? '').trim() !== '')) return;

    const hn = get(row, 'hn');
    const name = get(row, 'name');
    const key = hn || name;
    if (!key) return void skipped.push({ row: rowNo, reason: 'ไม่มี HN และชื่อลูกค้า' });

    const date = parseCellDate(mapping.date === undefined ? null : row[mapping.date]);
    if (!date) return void skipped.push({ row: rowNo, reason: `อ่านวันที่ไม่ได้ ("${get(row, 'date')}")` });

    const amount = parseAmount(mapping.amount === undefined ? null : row[mapping.amount]);
    if (amount === null) return void skipped.push({ row: rowNo, reason: `อ่านยอดเงินไม่ได้ ("${get(row, 'amount')}")` });
    if (amount < 0) return void skipped.push({ row: rowNo, reason: 'ยอดติดลบ (คืนเงิน/ยกเลิก)' });

    const code = get(row, 'code');
    const item = get(row, 'item') || code;
    if (!item) return void skipped.push({ row: rowNo, reason: 'ไม่มีชื่อรายการหรือรหัสสินค้า' });

    const category = inferCategory(code, item);
    categoryCounts[category]++;
    if (category === 'Other') other.set(item, (other.get(item) ?? 0) + 1);

    let p = patients.get(key);
    if (!p) {
      p = {
        id: `imp-${key}`,
        hn: hn || '-',
        name: name || hn,
        nickname: get(row, 'nickname'),
        age: 0,
        gender: '',
        nationality: '',
        phone: get(row, 'phone'),
        lineId: get(row, 'lineId'),
        lineConnected: !!get(row, 'lineId'),
        avatarUrl: '',
        salesOwner: '-',
        salesOwnerRole: '',
        attendingDoctor: '-',
        doctorSpecialty: '',
        branch: '',
        tier: '',
        signals: [],
        recommendedProposal: { title: '', subtitle: '' },
        treatments: [],
        timeline: []
      };
      patients.set(key, p);
    }
    const doctor = get(row, 'doctor');
    p.treatments.push({
      id: `imp-${key}-${rowNo}`,
      name: item,
      category,
      date,
      price: amount,
      doctor: doctor || '-',
      statusBadge: code || 'นำเข้า',
      statusType: 'neutral',
      details: code ? `รหัส ${code}` : ''
    } satisfies TreatmentHistoryItem);
    treatmentCount++;
    if (!from || date < from) from = date;
    if (!to || date > to) to = date;
  });

  for (const p of patients.values()) {
    p.treatments.sort((a, b) => b.date.localeCompare(a.date));
    const lastDoctor = p.treatments.find(t => t.doctor !== '-')?.doctor;
    if (lastDoctor) p.attendingDoctor = lastDoctor;
  }

  return {
    records: [...patients.values()],
    treatmentCount,
    skipped,
    categoryCounts,
    uncategorized: [...other.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    dateRange: from ? { from, to } : null
  };
}

/** Merge imported records into existing ones by HN (or name), skipping treatments already present. */
export function mergeRecords(existing: PatientRecord[], incoming: PatientRecord[]): PatientRecord[] {
  const keyOf = (p: PatientRecord) => (p.hn && p.hn !== '-' ? p.hn : p.name);
  const byKey = new Map(existing.map(p => [keyOf(p), p]));
  const result = [...existing];
  for (const inc of incoming) {
    const cur = byKey.get(keyOf(inc));
    if (!cur) { result.push(inc); continue; }
    const seen = new Set(cur.treatments.map(t => `${t.date}|${t.name}|${t.price}`));
    const added = inc.treatments.filter(t => !seen.has(`${t.date}|${t.name}|${t.price}`));
    const merged = { ...cur, treatments: [...cur.treatments, ...added] };
    result[result.indexOf(cur)] = merged;
  }
  return result;
}

export const TEMPLATE_CSV =
  'HN,ชื่อลูกค้า,ชื่อเล่น,เบอร์โทร,วันที่,รหัสสินค้า,ชื่อสินค้า,ยอดชำระ,แพทย์\n' +
  'RV000123,คุณสมศรี ใจดี,ศรี,081-234-5678,15/08/2569,C-OLIX1,Oligio X 600 shots,49900,Dr. A\n' +
  'RV000123,คุณสมศรี ใจดี,ศรี,081-234-5678,15/08/2569,C-ALG2,Botox Allergan 50u,9900,Dr. A\n' +
  'RV000456,คุณวิภา สวยงาม,วิ,089-876-5432,02/09/2569,,Rejuran Healer 2cc,14900,Dr. B\n';
