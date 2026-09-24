import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PatientRecord, TreatmentHistoryItem } from '../types';
import {
  DEFAULT_RFM_SETTINGS,
  computeCycles,
  enrichPatient,
  frequencyScore,
  monetaryScore,
  parseDate,
  recencyScore,
  segmentFor,
  summarizeSegments
} from './rfm';

const TODAY = new Date(2026, 8, 24); // 24 Sep 2026, local time

function treatment(date: string, price: number, category: TreatmentHistoryItem['category'] = 'Injectables'): TreatmentHistoryItem {
  return {
    id: `${category}-${date}`,
    name: `${category} treatment`,
    category,
    date,
    price,
    doctor: 'Dr. Test',
    statusBadge: '',
    statusType: 'neutral',
    details: ''
  };
}

function record(treatments: TreatmentHistoryItem[]): PatientRecord {
  return {
    id: 'p-test',
    hn: 'RV000001',
    name: 'Khun Test',
    nickname: 'คุณเทส',
    age: 30,
    gender: 'Female',
    nationality: 'Thai',
    phone: '',
    lineId: '',
    lineConnected: true,
    avatarUrl: '',
    salesOwner: '',
    salesOwnerRole: '',
    attendingDoctor: '',
    doctorSpecialty: '',
    branch: '',
    tier: '',
    signals: [],
    recommendedProposal: { title: '', subtitle: '' },
    treatments,
    timeline: []
  };
}

test('parseDate reads clinic and ISO formats', () => {
  assert.equal(parseDate('21 Mar 2026')?.toISOString(), '2026-03-21T00:00:00.000Z');
  assert.equal(parseDate('2026-03-21')?.toISOString(), '2026-03-21T00:00:00.000Z');
  assert.equal(parseDate('No Recorded Records'), null);
});

test('recency score follows the configured threshold', () => {
  const s = DEFAULT_RFM_SETTINGS; // 90 days
  assert.equal(recencyScore(30, s), 5);
  assert.equal(recencyScore(60, s), 4);
  assert.equal(recencyScore(90, s), 3);
  assert.equal(recencyScore(180, s), 2);
  assert.equal(recencyScore(181, s), 1);
  assert.equal(recencyScore(90, { ...s, recencyDays: 60 }), 2);
});

test('frequency and monetary score bands', () => {
  assert.deepEqual([1, 2, 4, 6, 10].map(frequencyScore), [1, 2, 3, 4, 5]);
  const s = DEFAULT_RFM_SETTINGS; // ฿100,000
  assert.deepEqual([5000, 10000, 30000, 60000, 100000].map(v => monetaryScore(v, s)), [1, 2, 3, 4, 5]);
});

test('segment mapping', () => {
  assert.equal(segmentFor(4, 1, 2, 1), 'New Patients');
  assert.equal(segmentFor(5, 5, 5, 14), 'Champions');
  assert.equal(segmentFor(3, 3, 3, 5), 'Loyal VIPs');
  assert.equal(segmentFor(1, 4, 4, 7), 'At Risk');
  assert.equal(segmentFor(1, 2, 1, 2), 'Lost / Inactive');
  assert.equal(segmentFor(2, 2, 2, 2), 'Need Attention');
});

test('cycles: overdue, due soon, and lapsed', () => {
  const cycles = computeCycles(
    [
      treatment('10 Jun 2026', 15900, 'Injectables'), // 100-day interval → due 18 Sep, 6 days overdue
      treatment('14 Aug 2026', 12900, 'Skin'), // 45-day interval → due 28 Sep, in 4 days
      treatment('01 Jan 2025', 49900, 'Lifting') // far beyond 2 intervals → lapsed
    ],
    new Date(Date.UTC(2026, 8, 24))
  );
  const byCat = Object.fromEntries(cycles.map(c => [c.category, c]));
  assert.equal(byCat.Injectables.dueInDays, -6);
  assert.equal(byCat.Injectables.isOverdue, true);
  assert.equal(byCat.Skin.dueInDays, 4);
  assert.equal(byCat.Skin.overduePillType, 'secondary');
  assert.equal(byCat.Lifting.isLapsed, true);
  assert.equal(byCat.Lifting.isOverdue, false);
  assert.equal(cycles[cycles.length - 1].category, 'Lifting', 'lapsed cycles sort last');
});

test('enrichPatient derives value, RFM and segment from treatments', () => {
  const p = enrichPatient(
    record([
      treatment('21 Mar 2026', 49900, 'Lifting'),
      treatment('10 Jan 2026', 15900),
      treatment('12 Sep 2025', 35000, 'Lifting') // outside trailing 12 months
    ]),
    DEFAULT_RFM_SETTINGS,
    TODAY
  );
  assert.equal(p.lifetimeValue, 100800);
  assert.equal(p.trailing12M, 65800);
  assert.equal(p.completedVisits, 3);
  assert.equal(p.avgTicket, 33600);
  assert.equal(p.lastVisitRecencyDays, 187);
  assert.deepEqual([p.rfmScore.recencyScore, p.rfmScore.frequencyScore, p.rfmScore.monetaryScore], [1, 2, 4]);
  assert.equal(p.category, 'At Risk');
  assert.match(p.priorityReason, /Lifting.*เลยรอบ 7 วัน/);
});

test('patient with no treatments is a new patient awaiting consultation', () => {
  const p = enrichPatient(record([]), DEFAULT_RFM_SETTINGS, TODAY);
  assert.equal(p.category, 'New Patients');
  assert.equal(p.completedVisits, 0);
  assert.equal(p.priorityLevel, 'High');
});

test('changing settings changes the result', () => {
  const r = record([treatment('01 Jul 2026', 70000), treatment('01 Mar 2026', 5000), treatment('01 Jan 2026', 5000), treatment('01 Nov 2025', 5000)]);
  const strict = enrichPatient(r, { recencyDays: 60, monetaryThreshold: 200000 }, TODAY);
  const loose = enrichPatient(r, { recencyDays: 120, monetaryThreshold: 80000 }, TODAY);
  assert.ok(strict.rfmScore.recencyScore < loose.rfmScore.recencyScore);
  assert.ok(strict.rfmScore.monetaryScore < loose.rfmScore.monetaryScore);
});

test('summarizeSegments counts every segment', () => {
  const patients = [
    enrichPatient(record([]), DEFAULT_RFM_SETTINGS, TODAY),
    enrichPatient(record([treatment('10 Sep 2026', 20000)]), DEFAULT_RFM_SETTINGS, TODAY)
  ];
  const summary = summarizeSegments(patients);
  const newPatients = summary.find(s => s.segment === 'New Patients')!;
  assert.equal(newPatients.count, 2);
  assert.equal(newPatients.percent, 100);
  assert.equal(newPatients.avgLifetimeValue, 10000);
  assert.equal(summary.reduce((n, s) => n + s.count, 0), 2);
});
