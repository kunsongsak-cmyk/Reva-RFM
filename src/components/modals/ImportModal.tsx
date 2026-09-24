import React, { useMemo, useState } from 'react';
import { PatientRecord, TreatmentCategory } from '../../types';
import {
  Cell,
  ColumnMapping,
  IMPORT_FIELDS,
  ImportField,
  TEMPLATE_CSV,
  buildRecords,
  detectHeaderRow,
  guessMapping,
  missingRequired,
  parseCsv
} from '../../lib/importer';
import { formatBaht, formatThaiDate } from '../../lib/rfm';

export type ImportMode = 'replace' | 'merge';

interface ImportModalProps {
  onClose: () => void;
  onImport: (records: PatientRecord[], mode: ImportMode) => void;
}

const CATEGORY_LABELS: Record<TreatmentCategory, string> = {
  Lifting: 'Lifting',
  Injectables: 'Botox / Neurotoxin',
  Skin: 'Skin Booster',
  Laser: 'Laser',
  Other: 'อื่นๆ (ไม่คำนวณรอบนัด)'
};

async function readFile(file: File): Promise<Cell[][]> {
  const name = file.name.toLowerCase();
  if (name.endsWith('.xlsx')) {
    const { readSheet } = await import('read-excel-file/browser');
    return (await readSheet(file)) as Cell[][];
  }
  if (name.endsWith('.csv') || name.endsWith('.txt') || name.endsWith('.tsv')) {
    return parseCsv(await file.text());
  }
  throw new Error('รองรับเฉพาะไฟล์ .csv และ .xlsx (ถ้าเป็น .xls ให้เปิดใน Excel แล้ว Save As เป็น .xlsx)');
}

export const ImportModal: React.FC<ImportModalProps> = ({ onClose, onImport }) => {
  const [fileName, setFileName] = useState('');
  const [rows, setRows] = useState<Cell[][]>([]);
  const [headerRow, setHeaderRow] = useState(0);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [mode, setMode] = useState<ImportMode>('replace');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const headers = rows[headerRow] ?? [];
  const missing = rows.length ? missingRequired(mapping) : [];
  const result = useMemo(
    () => (rows.length && missing.length === 0 ? buildRecords(rows, headerRow, mapping) : null),
    [rows, headerRow, mapping, missing.length]
  );
  const totalAmount = result?.records.reduce((sum, p) => sum + p.treatments.reduce((s, t) => s + t.price, 0), 0) ?? 0;

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setLoading(true);
    try {
      const data = await readFile(file);
      if (data.length < 2) throw new Error('ไม่พบข้อมูลในไฟล์');
      const h = detectHeaderRow(data);
      setFileName(file.name);
      setRows(data);
      setHeaderRow(h);
      setMapping(guessMapping(data[h]));
    } catch (e) {
      setRows([]);
      setError(e instanceof Error ? e.message : 'อ่านไฟล์ไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const setField = (field: ImportField, value: string) => {
    setMapping(prev => {
      const next = { ...prev };
      if (value === '') delete next[field];
      else next[field] = Number(value);
      return next;
    });
  };

  const downloadTemplate = () => {
    const blob = new Blob(['﻿' + TEMPLATE_CSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Reva_Import_Template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const sample = (col: number) => {
    const v = rows[headerRow + 1]?.[col];
    return v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? '');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1c30]/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#c6c6cd]/50 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#c6c6cd]/30 flex items-center justify-between bg-[#eff4ff]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#006a61] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">upload_file</span>
            </div>
            <div>
              <h3 className="font-display font-semibold text-[16px] text-[#0b1c30]">นำเข้าข้อมูลคนไข้</h3>
              <p className="text-[12px] text-[#45464d]">
                ไฟล์ CSV หรือ Excel (.xlsx) หนึ่งแถวต่อหนึ่งรายการที่ชำระ • อ่านไฟล์ในเครื่องนี้เท่านั้น ไม่ส่งข้อมูลออกไปที่ใด
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200/60 flex items-center justify-center text-[#45464d]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Step 1: file */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="flex-1 flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-[#c6c6cd] hover:border-[#006a61] bg-[#eff4ff]/40 cursor-pointer transition-colors">
              <span className="material-symbols-outlined text-[24px] text-[#006a61]">folder_open</span>
              <span className="text-[13px] text-[#0b1c30]">
                {loading ? 'กำลังอ่านไฟล์...' : fileName ? <><strong>{fileName}</strong> • คลิกเพื่อเปลี่ยนไฟล์</> : 'คลิกเพื่อเลือกไฟล์ .csv หรือ .xlsx'}
              </span>
              <input
                type="file"
                accept=".csv,.tsv,.txt,.xlsx"
                className="hidden"
                onChange={e => handleFile(e.target.files?.[0])}
              />
            </label>
            <button
              type="button"
              onClick={downloadTemplate}
              className="px-3 py-2 rounded-lg text-[12px] font-semibold text-[#006a61] hover:bg-[#eff4ff] flex items-center gap-1 shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              ดาวน์โหลดไฟล์ตัวอย่าง
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-[#ffdad6]/60 text-[#93000a] text-[12px] font-medium">{error}</div>
          )}

          {rows.length > 0 && (
            <>
              {/* Step 2: column mapping */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-[13px] font-bold text-[#0b1c30]">จับคู่คอลัมน์</h4>
                  <label className="text-[11px] text-[#45464d] flex items-center gap-1.5">
                    แถวหัวตาราง
                    <select
                      value={headerRow}
                      onChange={e => {
                        const h = Number(e.target.value);
                        setHeaderRow(h);
                        setMapping(guessMapping(rows[h]));
                      }}
                      className="h-7 px-1.5 rounded bg-[#eff4ff] border border-[#c6c6cd]/40 text-[11px]"
                    >
                      {rows.slice(0, 15).map((_, i) => (
                        <option key={i} value={i}>แถวที่ {i + 1}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {IMPORT_FIELDS.map(({ field, label, required }) => (
                    <div key={field} className="flex items-center gap-2 text-[12px]">
                      <span className="w-36 shrink-0 text-[#0b1c30] font-medium">
                        {label}
                        {required && <span className="text-[#ba1a1a]"> *</span>}
                      </span>
                      <select
                        value={mapping[field] ?? ''}
                        onChange={e => setField(field, e.target.value)}
                        className={`flex-1 min-w-0 h-8 px-2 rounded-lg border text-[12px] outline-none ${
                          mapping[field] === undefined ? 'bg-white border-[#c6c6cd]/60 text-[#76777d]' : 'bg-[#eff4ff] border-[#006a61]/30 text-[#0b1c30]'
                        }`}
                      >
                        <option value="">— ไม่ใช้ —</option>
                        {headers.map((h, col) => (
                          <option key={col} value={col}>
                            {String(h ?? '') || `คอลัมน์ ${col + 1}`}{sample(col) ? ` (เช่น ${sample(col).slice(0, 24)})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-[#76777d]">
                  * ต้องมี HN หรือชื่อลูกค้า อย่างน้อยหนึ่งอย่าง และต้องมีชื่อรายการหรือรหัสสินค้าอย่างน้อยหนึ่งอย่าง
                </p>
              </div>

              {missing.length > 0 && (
                <div className="p-3 rounded-lg bg-[#ffdcc3]/60 text-[#6e3900] text-[12px] font-medium">
                  ยังขาดคอลัมน์: {missing.join(', ')}
                </div>
              )}

              {/* Step 3: preview */}
              {result && (
                <div className="space-y-3">
                  <h4 className="text-[13px] font-bold text-[#0b1c30]">ตรวจสอบก่อนนำเข้า</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: 'คนไข้', value: result.records.length.toLocaleString() },
                      { label: 'รายการ', value: result.treatmentCount.toLocaleString() },
                      { label: 'ยอดรวม', value: formatBaht(totalAmount) },
                      { label: 'ข้ามไป', value: result.skipped.length.toLocaleString(), warn: result.skipped.length > 0 }
                    ].map(s => (
                      <div key={s.label} className="p-3 rounded-lg bg-[#eff4ff]/70 border border-[#c6c6cd]/30">
                        <span className="text-[11px] text-[#45464d] block">{s.label}</span>
                        <span className={`font-display text-[18px] font-bold ${s.warn ? 'text-[#c76c00]' : 'text-[#0b1c30]'}`}>
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {result.dateRange && (
                    <p className="text-[12px] text-[#45464d]">
                      ช่วงวันที่: <strong className="text-[#0b1c30]">{formatThaiDate(result.dateRange.from)}</strong> ถึง{' '}
                      <strong className="text-[#0b1c30]">{formatThaiDate(result.dateRange.to)}</strong>
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
                    <div className="p-3 rounded-lg border border-[#c6c6cd]/40 space-y-1">
                      <span className="font-semibold text-[#0b1c30] block mb-1">จัดหมวด Treatment</span>
                      {(Object.keys(CATEGORY_LABELS) as TreatmentCategory[]).map(c => (
                        <div key={c} className="flex justify-between text-[#45464d]">
                          <span>{CATEGORY_LABELS[c]}</span>
                          <strong className="text-[#0b1c30]">{result.categoryCounts[c].toLocaleString()}</strong>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-lg border border-[#c6c6cd]/40 space-y-1">
                      <span className="font-semibold text-[#0b1c30] block mb-1">รายการที่จัดเป็น "อื่นๆ" (มากสุด 8 อันดับ)</span>
                      {result.uncategorized.length === 0 ? (
                        <span className="text-[#76777d]">ไม่มี</span>
                      ) : (
                        result.uncategorized.slice(0, 8).map(u => (
                          <div key={u.name} className="flex justify-between gap-2 text-[#45464d]">
                            <span className="truncate">{u.name}</span>
                            <strong className="text-[#0b1c30] shrink-0">{u.count}</strong>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {result.skipped.length > 0 && (
                    <details className="p-3 rounded-lg bg-[#ffdcc3]/30 border border-[#c76c00]/20 text-[12px]">
                      <summary className="cursor-pointer font-semibold text-[#6e3900]">
                        แถวที่ข้ามไป {result.skipped.length} แถว (คลิกเพื่อดู)
                      </summary>
                      <ul className="mt-2 space-y-0.5 text-[#45464d] max-h-32 overflow-y-auto">
                        {result.skipped.slice(0, 50).map(s => (
                          <li key={s.row}>แถวที่ {s.row}: {s.reason}</li>
                        ))}
                      </ul>
                    </details>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 text-[12px]">
                    {([
                      { value: 'replace', title: 'แทนที่ข้อมูลทั้งหมด', desc: 'ลบข้อมูลตัวอย่างออก ใช้เฉพาะไฟล์นี้' },
                      { value: 'merge', title: 'รวมกับข้อมูลเดิม', desc: 'เพิ่มคนไข้/รายการใหม่ จับคู่ด้วย HN' }
                    ] as const).map(o => (
                      <label
                        key={o.value}
                        className={`flex-1 p-3 rounded-lg border cursor-pointer flex items-start gap-2 ${
                          mode === o.value ? 'border-[#006a61] bg-[#86f2e4]/15' : 'border-[#c6c6cd]/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="import-mode"
                          checked={mode === o.value}
                          onChange={() => setMode(o.value)}
                          className="mt-0.5 accent-[#006a61]"
                        />
                        <span>
                          <strong className="text-[#0b1c30] block">{o.title}</strong>
                          <span className="text-[#45464d]">{o.desc}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#c6c6cd]/30 flex items-center justify-between gap-2 bg-slate-50">
          <span className="text-[11px] text-[#76777d]">ข้อมูลที่นำเข้าจะหายเมื่อรีเฟรชหน้า จนกว่าจะเชื่อมต่อฐานข้อมูล</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[13px] rounded-lg text-[#45464d] hover:bg-slate-100">
              ยกเลิก
            </button>
            <button
              type="button"
              disabled={!result || result.records.length === 0}
              onClick={() => result && onImport(result.records, mode)}
              className="px-4 py-2 bg-black hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold text-[13px] rounded-lg flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>นำเข้า {result ? `${result.records.length.toLocaleString()} ราย` : ''}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
