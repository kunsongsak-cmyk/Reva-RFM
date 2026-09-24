import {
  Patient,
  PatientCategory,
  PatientRecord,
  RfmSettings,
  CycleCategory,
  TreatmentCycleStatus,
  TreatmentHistoryItem
} from '../types';
import { intervalOverride } from './courseCategories';

export const DEFAULT_RFM_SETTINGS: RfmSettings = {
  recencyDays: 90,
  monetaryThreshold: 100000
};

// Recommended days between repeat treatments, per category
export const CYCLE_INTERVAL_DAYS: Record<CycleCategory, number> = {
  Lifting: 180,
  Injectables: 100,
  Skin: 45,
  Laser: 30
};

export const CYCLE_LABELS: Record<CycleCategory, string> = {
  Lifting: 'ยกกระชับ (Lifting)',
  Injectables: 'Botox / Filler',
  Skin: 'Skin Booster',
  Laser: 'Laser'
};

// A cycle counts as "due" this many days before its target date
export const DUE_SOON_DAYS = 14;

const DAY_MS = 24 * 60 * 60 * 1000;
const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
};

/** Parses "21 Mar 2026" or "2026-03-21" into a UTC date; null if unrecognised. */
export function parseDate(value: string): Date | null {
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (iso) return new Date(Date.UTC(+iso[1], +iso[2] - 1, +iso[3]));
  const dmy = /^(\d{1,2})\s+([A-Za-z]{3})[a-z]*\s+(\d{4})$/.exec(value.trim());
  if (dmy && MONTHS[dmy[2].toLowerCase()] !== undefined) {
    return new Date(Date.UTC(+dmy[3], MONTHS[dmy[2].toLowerCase()], +dmy[1]));
  }
  return null;
}

function startOfDayUtc(d: Date): Date {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / DAY_MS);
}

/** Formats a date in short Thai form, e.g. "21 มี.ค. 2569". */
export function formatThaiDate(value: Date | string): string {
  const d = typeof value === 'string' ? parseDate(value) : value;
  if (!d) return typeof value === 'string' ? value : '';
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

/** Two-letter avatar initials, ignoring the "Khun"/"คุณ" honorific. */
export function initials(name: string): string {
  return name.replace(/^(khun\s+|คุณ\s*)/i, '').trim().slice(0, 2) || '?';
}

export function formatBaht(n: number): string {
  return `฿${Math.round(n).toLocaleString('en-US')}`;
}

// ---------- Scores ----------

export function recencyScore(days: number, s: RfmSettings): number {
  const t = s.recencyDays;
  if (days <= t / 3) return 5;
  if (days <= (2 * t) / 3) return 4;
  if (days <= t) return 3;
  if (days <= 2 * t) return 2;
  return 1;
}

/** Frequency uses lifetime visits: aesthetic treatments repeat over months, not weeks. */
export function frequencyScore(visits: number): number {
  if (visits >= 10) return 5;
  if (visits >= 6) return 4;
  if (visits >= 4) return 3;
  if (visits >= 2) return 2;
  return 1;
}

export function monetaryScore(spend12m: number, s: RfmSettings): number {
  const x = s.monetaryThreshold;
  if (spend12m >= x) return 5;
  if (spend12m >= 0.6 * x) return 4;
  if (spend12m >= 0.3 * x) return 3;
  if (spend12m >= 0.1 * x) return 2;
  return 1;
}

export function segmentFor(r: number, f: number, m: number, visits: number): Exclude<PatientCategory, 'All'> {
  if (visits <= 1 && r >= 3) return 'New Patients';
  if (r >= 4 && f >= 4 && m >= 4) return 'Champions';
  if (r >= 3 && f >= 3) return 'Loyal VIPs';
  if (r <= 2 && (f >= 3 || m >= 4)) return 'At Risk';
  if (r === 1) return 'Lost / Inactive';
  return 'Need Attention';
}

const SEGMENT_VERDICT: Record<Exclude<PatientCategory, 'All'>, string> = {
  'Champions': 'ลูกค้าคนสำคัญ มาบ่อยและใช้จ่ายสูง ควรรักษาความสัมพันธ์และนัดรอบถัดไปให้ต่อเนื่อง',
  'Loyal VIPs': 'กลับมาใช้บริการสม่ำเสมอ มีโอกาสเสนอ Treatment เพิ่มเติม',
  'New Patients': 'คนไข้ใหม่ ควรติดตามผลและชวนกลับมาครั้งที่ 2',
  'Need Attention': 'เริ่มห่างหาย ควรติดต่อก่อนกลายเป็นกลุ่ม At Risk',
  'At Risk': 'เคยเป็นลูกค้ามูลค่าสูงแต่ไม่ได้กลับมานาน ต้องติดตามด่วน',
  'Lost / Inactive': 'ไม่ได้มานานมาก ใช้แคมเปญดึงกลับ'
};

// ---------- Treatment cycles ----------

export function computeCycles(treatments: TreatmentHistoryItem[], today: Date): TreatmentCycleStatus[] {
  const latest = new Map<CycleCategory, { t: TreatmentHistoryItem; date: Date }>();
  for (const t of treatments) {
    if (t.category === 'Other') continue;
    const date = parseDate(t.date);
    if (!date) continue;
    const category = t.category;
    const cur = latest.get(category);
    if (!cur || date > cur.date) latest.set(category, { t, date });
  }

  const cycles: TreatmentCycleStatus[] = [];
  for (const [category, { t, date }] of latest) {
    const interval = intervalOverride(t.code, t.name) ?? CYCLE_INTERVAL_DAYS[category];
    const target = new Date(date.getTime() + interval * DAY_MS);
    const dueInDays = daysBetween(today, target);
    const elapsed = daysBetween(date, today);
    const isLapsed = elapsed > 2 * interval;
    const isOverdue = !isLapsed && dueInDays < 0;
    const dueSoon = !isLapsed && !isOverdue && dueInDays <= DUE_SOON_DAYS;

    cycles.push({
      protocolName: CYCLE_LABELS[category],
      category,
      lastDate: formatThaiDate(date),
      lastTreatment: t.name,
      targetDate: formatThaiDate(target),
      daysDiff: isLapsed ? 'ไม่ได้ทำต่อเนื่อง' : dueInDays < 0 ? `เลย ${-dueInDays} วัน` : `อีก ${dueInDays} วัน`,
      isOverdue,
      overduePillText: isLapsed
        ? `ห่างหาย ${elapsed} วัน`
        : isOverdue
        ? `เลยรอบ ${-dueInDays} วัน`
        : dueSoon
        ? `ถึงรอบใน ${dueInDays} วัน`
        : 'อยู่ในรอบ',
      overduePillType: isOverdue ? 'error' : dueSoon ? 'secondary' : 'neutral',
      progressPercent: Math.max(0, Math.min(100, Math.round((elapsed / interval) * 100))),
      dueInDays,
      isLapsed
    });
  }
  // Active protocols first, most urgent first
  return cycles.sort((a, b) => Number(a.isLapsed) - Number(b.isLapsed) || a.dueInDays - b.dueInDays);
}

// ---------- Priority ----------

interface PriorityInput {
  r: number;
  f: number;
  m: number;
  visits: number;
  recencyDays: number;
  segment: Exclude<PatientCategory, 'All'>;
  cycles: TreatmentCycleStatus[];
}

export function computePriority(p: PriorityInput): Pick<Patient, 'priorityScore' | 'priorityLevel' | 'priorityReason'> {
  if (p.visits === 0) {
    return { priorityScore: 75, priorityLevel: 'High', priorityReason: 'คนไข้ใหม่ รอนัดปรึกษา' };
  }

  const mostUrgent = p.cycles.find(c => !c.isLapsed);
  const overdueDays = mostUrgent?.isOverdue ? -mostUrgent.dueInDays : 0;
  const dueSoon = !!mostUrgent && !mostUrgent.isOverdue && mostUrgent.dueInDays <= DUE_SOON_DAYS;
  const awaitingSecondVisit = p.visits === 1 && p.recencyDays >= 21;

  // Patient value: up to 40 points
  const value = ((p.f + p.m) / 10) * 40;
  // Urgency: up to 60 points
  let urgency = 0;
  if (overdueDays > 0) urgency += 20 + Math.min(overdueDays / 60, 1) * 20;
  else if (dueSoon) urgency += 15;
  if (p.r <= 2) urgency += 30;
  else if (p.r === 3) urgency += 10;
  if (awaitingSecondVisit) urgency += 40;
  const priorityScore = Math.min(100, Math.round(value + Math.min(urgency, 60)));

  const priorityLevel: Patient['priorityLevel'] =
    priorityScore >= 85 ? 'Critical' : priorityScore >= 70 ? 'High' : priorityScore >= 50 ? 'Medium' : 'Low';

  let priorityReason: string;
  if (mostUrgent && overdueDays > 0) priorityReason = `${mostUrgent.protocolName} เลยรอบ ${overdueDays} วัน`;
  else if (mostUrgent && dueSoon) priorityReason = `${mostUrgent.protocolName} ถึงรอบใน ${mostUrgent.dueInDays} วัน`;
  else if (awaitingSecondVisit) priorityReason = `ยังไม่กลับมาครั้งที่ 2 (${p.recencyDays} วัน)`;
  else if (p.segment === 'At Risk' || p.segment === 'Lost / Inactive') priorityReason = `ไม่ได้มา ${p.recencyDays} วัน`;
  else priorityReason = 'ติดตามตามรอบปกติ';

  return { priorityScore, priorityLevel, priorityReason };
}

// ---------- Patient enrichment ----------

export function enrichPatient(record: PatientRecord, settings: RfmSettings, now: Date = new Date()): Patient {
  const today = startOfDayUtc(now);
  const dated = record.treatments
    .map(t => ({ t, date: parseDate(t.date) }))
    .filter((x): x is { t: TreatmentHistoryItem; date: Date } => x.date !== null)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  // One bill can hold several items, so a visit is a distinct treatment date
  const visits = new Set(dated.map(x => x.date.getTime())).size;
  const lifetimeValue = dated.reduce((sum, x) => sum + x.t.price, 0);
  const trailing12M = dated
    .filter(x => daysBetween(x.date, today) <= 365)
    .reduce((sum, x) => sum + x.t.price, 0);
  const lastDate = dated[0]?.date;
  const recencyDays = lastDate ? daysBetween(lastDate, today) : 0;

  const r = visits ? recencyScore(recencyDays, settings) : 5;
  const f = frequencyScore(visits);
  const m = monetaryScore(trailing12M, settings);
  const segment = visits ? segmentFor(r, f, m, visits) : 'New Patients';
  const cycles = computeCycles(record.treatments, today);

  return {
    ...record,
    category: segment,
    lifetimeValue,
    trailing12M,
    avgTicket: visits ? Math.round(lifetimeValue / visits) : 0,
    completedVisits: visits,
    lastVisitRecencyDays: recencyDays,
    lastVisitDate: lastDate ? formatThaiDate(lastDate) : 'ยังไม่เคยมารับบริการ',
    rfmScore: {
      recencyScore: r,
      frequencyScore: f,
      monetaryScore: m,
      recencyLabel: lastDate
        ? `มาครั้งล่าสุด ${recencyDays} วันก่อน (เกณฑ์: เกิน ${settings.recencyDays} วันคะแนนเริ่มลดลง)`
        : 'ยังไม่เคยมารับบริการ',
      frequencyLabel: `มารับบริการทั้งหมด ${visits} ครั้ง (10 ครั้งขึ้นไปได้ 5/5)`,
      monetaryLabel: `ยอดใช้จ่าย 12 เดือน ${formatBaht(trailing12M)} (${formatBaht(settings.monetaryThreshold)} ขึ้นไปได้ 5/5)`,
      matrixVerdit: SEGMENT_VERDICT[segment]
    },
    cycles,
    ...computePriority({ r, f, m, visits, recencyDays, segment, cycles })
  };
}

// ---------- Aggregates ----------

export const SEGMENTS: Exclude<PatientCategory, 'All'>[] = [
  'Champions',
  'Loyal VIPs',
  'New Patients',
  'Need Attention',
  'At Risk',
  'Lost / Inactive'
];

export interface SegmentSummary {
  segment: Exclude<PatientCategory, 'All'>;
  count: number;
  percent: number;
  avgLifetimeValue: number;
  totalLifetimeValue: number;
}

export function summarizeSegments(patients: Patient[]): SegmentSummary[] {
  return SEGMENTS.map(segment => {
    const group = patients.filter(p => p.category === segment);
    const total = group.reduce((sum, p) => sum + p.lifetimeValue, 0);
    return {
      segment,
      count: group.length,
      percent: patients.length ? Math.round((group.length / patients.length) * 100) : 0,
      avgLifetimeValue: group.length ? Math.round(total / group.length) : 0,
      totalLifetimeValue: total
    };
  });
}

export const isOverdue = (p: Patient) => p.cycles.some(c => c.isOverdue);
export const isDueSoon = (p: Patient, days = DUE_SOON_DAYS) =>
  p.cycles.some(c => !c.isLapsed && !c.isOverdue && c.dueInDays <= days);
export const needsFollowUp = (p: Patient) => p.priorityLevel === 'Critical' || p.priorityLevel === 'High';
