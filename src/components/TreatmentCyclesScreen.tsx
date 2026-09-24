import React, { useState } from 'react';
import { Patient, ScreenType, CycleCategory } from '../types';
import { CYCLE_INTERVAL_DAYS, formatBaht } from '../lib/rfm';

interface TreatmentCyclesScreenProps {
  patients: Patient[];
  onNavigate: (screen: ScreenType) => void;
  onOpenBroadcast: (cohort: string, count: number) => void;
}

export const TreatmentCyclesScreen: React.FC<TreatmentCyclesScreenProps> = ({
  patients,
  onNavigate,
  onOpenBroadcast
}) => {
  const [selectedModality, setSelectedModality] = useState('All');

  const modalities = [
    {
      id: 'lifting',
      category: 'Lifting' as CycleCategory,
      name: 'Monopolar RF & High-Intensity Ultrasound (Lifting)',
      protocols: ['Program Oligio X (600 Shots)', 'Ulthera SPT (800 Lines)', 'Ultraformer MPT (400 Shots)'],
      halfLifeMonths: '6 – 12 เดือน',
      decayDescription: 'การสร้างคอลลาเจนใหม่สูงสุดที่ 90 วัน และผิวเริ่มกลับมาหย่อนคล้อยทีละน้อยหลัง 180 วัน',
      optimalWindow: 'เดือนที่ 6 – 8',
    },
    {
      id: 'neurotoxin',
      category: 'Injectables' as CycleCategory,
      name: 'Neurotoxin / Neuromodulator (Botox)',
      protocols: ['Botox Allergan 100u / 50u', 'Dysport Precision Aesthetic'],
      halfLifeMonths: '3 – 4 เดือน',
      decayDescription: 'ปลายประสาทแตกแขนงใหม่ (axonal sprouting) ทำให้การสั่งงานกล้ามเนื้อกลับมาเป็นปกติภายในประมาณ 120 วัน',
      optimalWindow: 'วันที่ 90 – 110',
    },
    {
      id: 'skin-booster',
      category: 'Skin' as CycleCategory,
      name: 'Polynucleotide (PN) & Hyaluronic Acid Skin Boosters',
      protocols: ['Rejuran Healer (2cc)', 'Belotero Revive Hydration', 'Juvelook Collagen Stimulator'],
      halfLifeMonths: '1 – 3 เดือน',
      decayDescription: 'การกระตุ้น fibroblast และ ECM ต้องทำต่อเนื่องเป็นระยะเพื่อคงผลลัพธ์',
      optimalWindow: 'วันที่ 28 – 45 (ช่วงเริ่มต้น) / วันที่ 90 (ช่วงคงผล)',
    },
    {
      id: 'picosecond-laser',
      category: 'Laser' as CycleCategory,
      name: 'Picosecond Laser & Photothermal Brightening',
      protocols: ['Program Pico Discovery (Melasma & Tone)', 'Dual Yellow Vascular Tone'],
      halfLifeMonths: '4 – 6 สัปดาห์',
      decayDescription: 'ผิวชั้นนอกผลัดเซลล์ทุก 28 วัน จึงต้องทำต่อเนื่องหลายครั้งเพื่อสลายเม็ดสีสะสม',
      optimalWindow: 'วันที่ 28 – 35',
    }
  ].map(m => {
    const withCycle = patients
      .map(p => ({ p, cycle: p.cycles.find(c => c.category === m.category && !c.isLapsed) }))
      .filter(x => x.cycle);
    const overdue = withCycle.filter(x => x.cycle!.isOverdue);
    return {
      ...m,
      activePatients: withCycle.length,
      dueThisMonth: withCycle.filter(x => !x.cycle!.isOverdue && x.cycle!.dueInDays <= 30).length,
      overdueCount: overdue.length,
      atRiskRevenue: formatBaht(overdue.reduce((sum, x) => sum + x.p.lifetimeValue, 0))
    };
  });
  const urgentCount = patients.filter(p => p.priorityLevel === 'Critical' || p.priorityLevel === 'High').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[24px] font-bold text-[#0b1c30] tracking-tight">
            รอบ Treatment
          </h1>
          <p className="font-sans text-[14px] text-[#45464d] mt-0.5">
            คำนวณรอบนัดจากระยะเวลาที่ผลการรักษาแต่ละประเภทคงอยู่
          </p>
        </div>

        <button
          onClick={() => onNavigate('todays-queue')}
          className="px-4 py-2 bg-black hover:bg-slate-800 text-white text-[13px] font-semibold rounded-lg flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">view_timeline</span>
          <span>ดูคิวติดตามวันนี้ ({urgentCount})</span>
        </button>
      </div>

      {/* Grid of Modalities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modalities.map(m => (
          <div
            key={m.id}
            className="bg-white rounded-xl border border-[#c6c6cd]/40 p-6 shadow-xs space-y-4 hover:border-[#006a61]/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#c6c6cd]/30">
              <div>
                <h3 className="font-display font-bold text-[16px] text-[#0b1c30]">
                  {m.name}
                </h3>
                <span className="text-[12px] font-semibold text-[#006a61]">
                  ผลการรักษาคงอยู่: {m.halfLifeMonths} • ระบบนัดทุก {CYCLE_INTERVAL_DAYS[m.category]} วัน
                </span>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#eff4ff] text-[#0b1c30] text-[11px] font-bold shrink-0">
                Active {m.activePatients} ราย
              </span>
            </div>

            <p className="text-[12px] text-[#45464d] leading-relaxed">
              {m.decayDescription}
            </p>

            <div className="p-3 rounded-lg bg-[#eff4ff]/60 border border-[#c6c6cd]/30 space-y-1.5 text-[12px]">
              <div className="flex justify-between">
                <span className="text-[#45464d]">ช่วงเวลาที่ควรทำซ้ำ:</span>
                <strong className="text-[#0b1c30]">{m.optimalWindow}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#45464d]">ถึงรอบภายใน 30 วัน:</span>
                <strong className="text-[#006a61]">{m.dueThisMonth} ราย</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#45464d]">เลยรอบแล้ว:</span>
                <strong className="text-[#ba1a1a]">{m.overdueCount} ราย (LTV {m.atRiskRevenue})</strong>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <span className="text-[11px] text-[#76777d]">
                จำนวนโปรแกรม: {m.protocols.length}
              </span>
              <button
                onClick={() => onOpenBroadcast(`ติดตามรอบ ${m.name}`, m.overdueCount)}
                className="px-3 py-1.5 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006a61] text-[12px] font-semibold flex items-center gap-1 transition-colors border border-[#86f2e4]/40"
              >
                <span className="material-symbols-outlined text-[16px]">campaign</span>
                <span>ส่งข้อความติดตาม ({m.overdueCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
