import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inferCategory } from './courseCategories';
import {
  TEMPLATE_CSV,
  buildRecords,
  detectHeaderRow,
  guessMapping,
  mergeRecords,
  missingRequired,
  parseAmount,
  parseCellDate,
  parseCsv
} from './importer';
import { DEFAULT_RFM_SETTINGS, enrichPatient } from './rfm';

test('parseCsv handles BOM, quotes, CRLF and tabs', () => {
  assert.deepEqual(parseCsv('﻿a,b\r\n"x, y","say ""hi"""\r\n'), [['a', 'b'], ['x, y', 'say "hi"']]);
  assert.deepEqual(parseCsv('a\tb\n1\t2\n'), [['a', 'b'], ['1', '2']]);
});

test('parseCellDate reads Thai and international formats', () => {
  assert.equal(parseCellDate('15/08/2569'), '2026-08-15'); // Buddhist era, day first
  assert.equal(parseCellDate('15/08/2026'), '2026-08-15');
  assert.equal(parseCellDate('5-1-69'), '2026-01-05'); // 2-digit BE year
  assert.equal(parseCellDate('2026-08-15 14:30'), '2026-08-15');
  assert.equal(parseCellDate('15 ส.ค. 2569'), '2026-08-15');
  assert.equal(parseCellDate('3 มีนาคม 2569'), '2026-03-03');
  assert.equal(parseCellDate('21 Mar 2026'), '2026-03-21');
  assert.equal(parseCellDate(46249), '2026-08-15'); // Excel serial
  assert.equal(parseCellDate(new Date(Date.UTC(2026, 7, 15))), '2026-08-15');
  assert.equal(parseCellDate('31/02/2026'), null);
  assert.equal(parseCellDate('ไม่ระบุ'), null);
});

test('parseAmount strips currency and commas', () => {
  assert.equal(parseAmount('฿49,900.00'), 49900);
  assert.equal(parseAmount('1,500 บาท'), 1500);
  assert.equal(parseAmount('(2,000)'), -2000);
  assert.equal(parseAmount(0), 0);
  assert.equal(parseAmount('abc'), null);
});

test('guessMapping matches Thai and English headers without double-using columns', () => {
  const m = guessMapping(['HN', 'ชื่อลูกค้า', 'ชื่อเล่น', 'วันที่ชำระ', 'รหัสสินค้า', 'ชื่อสินค้า', 'ยอดชำระ', 'แพทย์']);
  assert.deepEqual(m, { hn: 0, name: 1, nickname: 2, date: 3, code: 4, item: 5, amount: 6, doctor: 7 });
  const en = guessMapping(['Customer ID', 'Customer Name', 'Date', 'Product', 'Amount']);
  assert.deepEqual(en, { hn: 0, name: 1, date: 2, item: 3, amount: 4 });
  assert.deepEqual(missingRequired({ hn: 0 }), ['วันที่', 'ยอดเงิน', 'ชื่อรายการ หรือ รหัสสินค้า']);
});

test('detectHeaderRow skips report title lines', () => {
  const rows = [['รายงานการชำระเงิน'], ['สาขา: สำนักงานใหญ่'], ['HN', 'ชื่อลูกค้า', 'วันที่', 'ยอดชำระ'], ['1', 'a', '1/1/2026', '1']];
  assert.equal(detectHeaderRow(rows), 2);
});

test('inferCategory uses course codes first, then names', () => {
  assert.equal(inferCategory('C-OLIX1', ''), 'Lifting');
  assert.equal(inferCategory('C-ALG2', 'anything'), 'Injectables');
  assert.equal(inferCategory('C-DIO3', ''), 'Laser');
  for (const code of ['C-JUV1', 'C-RES2', 'C-HA1', 'C-JEL1', 'C-SCU1']) {
    assert.equal(inferCategory(code, ''), 'Injectables', code);
  }
  assert.equal(inferCategory('C-SCP1', 'Sculptra'), 'Lifting');
  assert.equal(inferCategory('', 'Juvederm Volift 1cc'), 'Injectables');
  assert.equal(inferCategory('', 'สลายฟิลเลอร์'), 'Other');
  assert.equal(inferCategory('', 'Rejuran Healer 2cc'), 'Skin');
  assert.equal(inferCategory('', 'Pico Laser full face'), 'Laser');
  assert.equal(inferCategory('C-IV1', 'IV Drip Vitamin C'), 'Other');
});

test('buildRecords groups rows by HN and reports skipped rows', () => {
  const csv = TEMPLATE_CSV + 'RV000456,คุณวิภา,,,ไม่รู้,,Botox,1000,\nRV000456,คุณวิภา,,,01/09/2569,,Refund,-500,\n';
  const rows = parseCsv(csv);
  const header = detectHeaderRow(rows);
  const result = buildRecords(rows, header, guessMapping(rows[header]));
  assert.equal(result.records.length, 2);
  assert.equal(result.treatmentCount, 3);
  assert.deepEqual(result.skipped.map(s => s.row), [5, 6]);
  assert.match(result.skipped[0].reason, /วันที่/);
  assert.deepEqual(result.dateRange, { from: '2026-08-15', to: '2026-09-02' });
  assert.equal(result.categoryCounts.Lifting, 1);
  assert.equal(result.categoryCounts.Injectables, 1);
  assert.equal(result.categoryCounts.Skin, 1);

  const somsri = result.records.find(r => r.hn === 'RV000123')!;
  assert.equal(somsri.name, 'คุณสมศรี ใจดี');
  assert.equal(somsri.attendingDoctor, 'Dr. A');
  // Two items on one bill count as one visit
  const enriched = enrichPatient(somsri, DEFAULT_RFM_SETTINGS, new Date(2026, 8, 24));
  assert.equal(enriched.completedVisits, 1);
  assert.equal(enriched.lifetimeValue, 59800);
});

test('mergeRecords adds new patients and only new treatments', () => {
  const rows = parseCsv(TEMPLATE_CSV);
  const first = buildRecords(rows, 0, guessMapping(rows[0])).records;
  const again = buildRecords(rows, 0, guessMapping(rows[0])).records;
  const merged = mergeRecords(first, again);
  assert.equal(merged.length, 2);
  assert.equal(merged.reduce((n, p) => n + p.treatments.length, 0), 3);
});
