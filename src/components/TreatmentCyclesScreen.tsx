import React, { useState } from 'react';
import { ScreenType } from '../types';

interface TreatmentCyclesScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenBroadcast: (cohort: string, count: number) => void;
}

export const TreatmentCyclesScreen: React.FC<TreatmentCyclesScreenProps> = ({
  onNavigate,
  onOpenBroadcast
}) => {
  const [selectedModality, setSelectedModality] = useState('All');

  const modalities = [
    {
      id: 'lifting',
      name: 'Monopolar RF & High-Intensity Ultrasound (Lifting)',
      protocols: ['Program Oligio X (600 Shots)', 'Ulthera SPT (800 Lines)', 'Ultraformer MPT (400 Shots)'],
      halfLifeMonths: '6 – 12 Months',
      decayDescription: 'Collagen remodeling peaks at 90 days; gradual elastin relaxation begins at 180 days.',
      optimalWindow: 'Month 6 – Month 8',
      activePatients: 412,
      dueThisMonth: 38,
      overdueCount: 19,
      atRiskRevenue: '฿1,890,000'
    },
    {
      id: 'neurotoxin',
      name: 'Neurotoxin / Neuromodulator (Botox)',
      protocols: ['Botox Allergan 100u / 50u', 'Dysport Precision Aesthetic'],
      halfLifeMonths: '3 – 4 Months',
      decayDescription: 'Synaptic terminal axonal sprouting restores neuromuscular junction transmission by 120 days.',
      optimalWindow: 'Day 90 – Day 110',
      activePatients: 624,
      dueThisMonth: 84,
      overdueCount: 42,
      atRiskRevenue: '฿1,260,000'
    },
    {
      id: 'skin-booster',
      name: 'Polynucleotide (PN) & Hyaluronic Acid Skin Boosters',
      protocols: ['Rejuran Healer (2cc)', 'Belotero Revive Hydration', 'Juvelook Collagen Stimulator'],
      halfLifeMonths: '1 – 3 Months',
      decayDescription: 'ECM extracellular fibroblast activation requires periodic micro-depot replenishment.',
      optimalWindow: 'Day 28 – Day 45 (Induction) / Day 90 (Maintenance)',
      activePatients: 380,
      dueThisMonth: 61,
      overdueCount: 28,
      atRiskRevenue: '฿940,000'
    },
    {
      id: 'picosecond-laser',
      name: 'Picosecond Laser & Photothermal Brightening',
      protocols: ['Program Pico Discovery (Melasma & Tone)', 'Dual Yellow Vascular Tone'],
      halfLifeMonths: '4 – 6 Weeks',
      decayDescription: 'Epidermal turnover cycle of 28 days necessitates cumulative pigment shatter passes.',
      optimalWindow: 'Day 28 – Day 35',
      activePatients: 290,
      dueThisMonth: 45,
      overdueCount: 14,
      atRiskRevenue: '฿810,000'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[24px] font-bold text-[#0b1c30] tracking-tight">
            Clinical Treatment Cycles Engine
          </h1>
          <p className="font-['Inter'] text-[14px] text-[#45464d] mt-0.5">
            Predictive Tissue Remodeling & Efficacy Half-Life Recall Algorithms
          </p>
        </div>

        <button
          onClick={() => onNavigate('todays-queue')}
          className="px-4 py-2 bg-black hover:bg-slate-800 text-white text-[13px] font-semibold rounded-lg flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">view_timeline</span>
          <span>View Active Priority Queue (18)</span>
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
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[16px] text-[#0b1c30]">
                  {m.name}
                </h3>
                <span className="text-[12px] font-semibold text-[#006a61]">
                  Clinical Recall Half-Life: {m.halfLifeMonths}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#eff4ff] text-[#0b1c30] text-[11px] font-bold shrink-0">
                {m.activePatients} Active
              </span>
            </div>

            <p className="text-[12px] text-[#45464d] leading-relaxed">
              {m.decayDescription}
            </p>

            <div className="p-3 rounded-lg bg-[#eff4ff]/60 border border-[#c6c6cd]/30 space-y-1.5 text-[12px]">
              <div className="flex justify-between">
                <span className="text-[#45464d]">Target Maintenance Window:</span>
                <strong className="text-[#0b1c30]">{m.optimalWindow}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#45464d]">Due This Calendar Month:</span>
                <strong className="text-[#006a61]">{m.dueThisMonth} Patients</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#45464d]">Overdue Beyond Physiological Window:</span>
                <strong className="text-[#ba1a1a]">{m.overdueCount} Patients ({m.atRiskRevenue} LTV)</strong>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <span className="text-[11px] text-[#76777d]">
                Supported protocols: {m.protocols.length}
              </span>
              <button
                onClick={() => onOpenBroadcast(`${m.name} Recall`, m.overdueCount)}
                className="px-3 py-1.5 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006a61] text-[12px] font-semibold flex items-center gap-1 transition-colors border border-[#86f2e4]/40"
              >
                <span className="material-symbols-outlined text-[16px]">campaign</span>
                <span>Dispatch Cycle Recall ({m.overdueCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
