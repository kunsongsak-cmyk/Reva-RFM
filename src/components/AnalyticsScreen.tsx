import React, { useState } from 'react';
import { ScreenType, PatientCategory } from '../types';
import { RFM_COHORTS_SUMMARY, RETENTION_FUNNEL_STAGES, CONSULTANT_LEADERBOARD } from '../data/mockData';

interface AnalyticsScreenProps {
  onNavigate: (screen: ScreenType, category?: PatientCategory) => void;
  onOpenWeeklyBrief: () => void;
  branch: string;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  onNavigate,
  onOpenWeeklyBrief,
  branch
}) => {
  const [selectedMonth, setSelectedMonth] = useState('September 2026');
  const [selectedBranch, setSelectedBranch] = useState(branch);

  const handleDownloadBoardReport = () => {
    const reportText = `=====================================================
AURA PRESTIGE CLINIC - EXECUTIVE RETENTION & REVENUE REPORT
Branch: ${selectedBranch} | Period: ${selectedMonth}
Generated: ${new Date().toLocaleDateString()}
=====================================================

1. EXECUTIVE KPI SUMMARY
- Total Patient Revenue MTD: ฿2,840,000 (+14.2% MoM)
  * Returning Patients: 62% (฿1,760,000)
  * New Patients: 38% (฿1,080,000)
- CRM Attributable Revenue: ฿2,140,000 (75.3% Total Revenue)
  * Verified CRM Attribution ROI: 18.4x
- 180-Day Repeat Patient Rate: 48.6% (Benchmark: 45.0%)
- Active Clinical Pool: 1,482 Patients (42 Recovered MTD)
- Churn Rate: 4.2% (down from 6.8% prior quarter)

2. RFM COHORT DISTRIBUTION
- Champions: 182 Patients (12%) | Avg Spend: ฿185,000
- Loyal VIPs: 328 Patients (22%) | Avg Spend: ฿94,000
- Promising Habit: 214 Patients (14%) | Avg Spend: ฿52,000
- New Patients: 192 Patients (13%) | Avg Spend: ฿31,000
- Need Attention: 264 Patients (18%) | Avg Spend: ฿44,000
- At Risk: 286 Patients (19%) | Avg Spend: ฿88,000 | Total At-Risk LTV: ฿25.1M
- Lost / Inactive: 621 Patients (30%) | Win-Back Protocol Active

3. SALES CONSULTANT RETENTION LEADERBOARD
1. Khun May: ฿720,000 Revenue | 86% Contact Rate | 31% Booking Rate | 61 Completed
2. Khun Ann: ฿650,000 Revenue | 81% Contact Rate | 28% Booking Rate | 58 Completed
3. Khun Joy: ฿510,000 Revenue | 76% Contact Rate | 24% Booking Rate | 43 Completed
4. Khun Fah: ฿260,000 Revenue | 72% Contact Rate | 20% Booking Rate | 24 Completed

=====================================================
End of Confidential Executive Summary
`;
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Aura_Executive_Board_Report_${selectedMonth.replace(' ', '_')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[24px] font-bold text-[#0b1c30] tracking-tight">
            Executive Retention & Revenue Attribution Dashboard
          </h1>
          <p className="font-['Inter'] text-[14px] text-[#45464d] mt-0.5">
            MTD Performance ({selectedMonth}) vs Target • {selectedBranch}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="h-10 px-3 rounded-lg bg-white border border-[#c6c6cd]/50 text-[13px] font-semibold text-[#0b1c30] outline-none shadow-xs"
          >
            <option value="September 2026">September 2026</option>
            <option value="August 2026">August 2026</option>
            <option value="July 2026">July 2026</option>
          </select>

          <button
            onClick={onOpenWeeklyBrief}
            className="px-3.5 py-2 bg-white border border-[#c6c6cd]/50 hover:bg-[#eff4ff] text-[#006a61] text-[13px] font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">schedule</span>
            <span>Schedule Weekly Brief</span>
          </button>

          <button
            onClick={handleDownloadBoardReport}
            className="px-4 py-2 bg-black hover:bg-slate-800 text-white text-[13px] font-semibold rounded-lg flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Download Board Report</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Revenue & Retention Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Patient Revenue MTD */}
        <div className="p-5 rounded-xl bg-white border border-[#c6c6cd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#45464d] uppercase tracking-wider">
              Total Patient Revenue MTD
            </span>
            <span className="text-[12px] font-bold text-[#006a61] bg-[#86f2e4]/30 px-2 py-0.5 rounded">
              +14.2% MoM
            </span>
          </div>

          <div className="mt-3">
            <div className="font-['Plus_Jakarta_Sans'] text-[28px] font-bold text-[#0b1c30] tracking-tight">
              ฿2,840,000
            </div>
            <div className="text-[11px] text-[#76777d] mt-0.5">
              Target: ฿3.20M (88.8% to goal)
            </div>

            {/* Split bar */}
            <div className="mt-3">
              <div className="w-full h-2 rounded-full bg-[#eff4ff] flex overflow-hidden">
                <div className="bg-[#006a61] h-full" style={{ width: '62%' }} title="Returning: 62%"></div>
                <div className="bg-[#131b2e] h-full" style={{ width: '38%' }} title="New: 38%"></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#45464d] mt-1.5 font-medium">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#006a61]"></span>
                  Returning 62% (฿1.76M)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#131b2e]"></span>
                  New 38% (฿1.08M)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI 2: CRM Attributable Revenue */}
        <div className="p-5 rounded-xl bg-white border border-[#c6c6cd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#45464d] uppercase tracking-wider">
              CRM Attributable Revenue
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#006a61]">
              <span className="material-symbols-outlined text-[17px]">hub</span>
            </div>
          </div>

          <div className="mt-3">
            <div className="font-['Plus_Jakarta_Sans'] text-[28px] font-bold text-[#0b1c30] tracking-tight">
              ฿2,140,000
            </div>
            <div className="text-[11px] font-semibold text-[#006a61] mt-0.5">
              75.3% of Total Clinic Revenue
            </div>

            <div className="mt-3 p-2.5 rounded-lg bg-[#eff4ff] flex items-center justify-between text-[11px]">
              <span className="text-[#45464d]">Return on CRM Investment:</span>
              <strong className="text-[#006a61] font-bold">18.4x ROI</strong>
            </div>
          </div>
        </div>

        {/* KPI 3: 180-Day Repeat Rate */}
        <div className="p-5 rounded-xl bg-white border border-[#c6c6cd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#45464d] uppercase tracking-wider">
              180-Day Repeat Rate
            </span>
            <span className="text-[12px] font-bold text-[#006a61] bg-[#86f2e4]/30 px-2 py-0.5 rounded">
              +3.6% vs Target
            </span>
          </div>

          <div className="mt-3">
            <div className="font-['Plus_Jakarta_Sans'] text-[28px] font-bold text-[#0b1c30] tracking-tight">
              48.6%
            </div>
            <div className="text-[11px] text-[#76777d] mt-0.5">
              Clinical target benchmark: 45.0%
            </div>

            <div className="w-full bg-[#eff4ff] h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#006a61] h-full rounded-full" style={{ width: '48.6%' }}></div>
            </div>

            <p className="text-[11px] text-[#45464d] mt-2 leading-tight">
              Top quartile aesthetic dermatology performance benchmark across Bangkok.
            </p>
          </div>
        </div>

        {/* KPI 4: Active Clinical Pool */}
        <div className="p-5 rounded-xl bg-white border border-[#c6c6cd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#45464d] uppercase tracking-wider">
              Active Clinical Pool
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#006a61]">
              <span className="material-symbols-outlined text-[17px]">group</span>
            </div>
          </div>

          <div className="mt-3">
            <div className="font-['Plus_Jakarta_Sans'] text-[28px] font-bold text-[#0b1c30] tracking-tight">
              1,482
            </div>
            <div className="text-[11px] font-semibold text-[#006a61] mt-0.5">
              42 Recovered MTD from At-Risk
            </div>

            <div className="mt-3 p-2.5 rounded-lg bg-[#eff4ff] flex items-center justify-between text-[11px]">
              <span className="text-[#45464d]">Lapse Churn Rate:</span>
              <strong className="text-[#ba1a1a] font-bold">4.2% (Down from 6.8%)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid: RFM Cohorts & Movement Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (6 cols): RFM Cohort Distribution */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#c6c6cd]/40 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#c6c6cd]/30">
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[15px] text-[#0b1c30]">
                Patient RFM Cohort Distribution & Segment Health
              </h3>
              <p className="text-[12px] text-[#45464d]">
                Click any cohort to view filtered patient list
              </p>
            </div>
            <button
              onClick={() => onNavigate('patients')}
              className="text-[12px] font-semibold text-[#006a61] hover:underline"
            >
              View Full Database →
            </button>
          </div>

          <div className="space-y-2.5">
            {RFM_COHORTS_SUMMARY.map((cohort, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (cohort.name.includes('At Risk')) onNavigate('patients', 'At Risk');
                  else if (cohort.name.includes('Champions')) onNavigate('patients', 'Champions');
                  else if (cohort.name.includes('Loyal')) onNavigate('patients', 'Loyal VIPs');
                  else if (cohort.name.includes('New')) onNavigate('patients', 'New Patients');
                  else if (cohort.name.includes('Lost')) onNavigate('patients', 'Lost / Inactive');
                  else onNavigate('patients');
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  cohort.isDanger
                    ? 'bg-[#ffdad6]/20 border-[#ba1a1a]/30 hover:bg-[#ffdad6]/35'
                    : 'bg-[#eff4ff]/40 border-[#c6c6cd]/30 hover:bg-[#eff4ff]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${cohort.color}`}></span>
                    <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[13px] text-[#0b1c30]">
                      {cohort.name}
                    </span>
                    {cohort.highlightBadge && (
                      <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-[#ba1a1a] text-white">
                        {cohort.highlightBadge}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[13px] font-bold text-[#0b1c30]">
                      {cohort.count.toLocaleString()} Patients
                    </span>
                    <span className="text-[11px] text-[#76777d] ml-1.5">
                      ({cohort.percent}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#45464d] mt-1">
                  <span>Average Spend: <strong className="text-[#0b1c30]">{cohort.avgSpend}</strong></span>
                  <span className="text-[#006a61] font-semibold hover:underline">Drilldown cohort →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right (6 cols): Net Patient Movement Matrix */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#c6c6cd]/40 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#c6c6cd]/30">
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[15px] text-[#0b1c30]">
                Net Patient Movement Matrix
              </h3>
              <p className="text-[12px] text-[#45464d]">
                Cohort Flow Dynamics (Month-to-Date Net Shifts)
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#86f2e4]/30 text-[#006a61] text-[11px] font-bold">
              Net Growth +79
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-[#eff4ff]/60 border border-[#c6c6cd]/30 flex items-center justify-between">
              <div>
                <span className="font-semibold text-[13px] text-[#0b1c30] block">
                  New Intake to Promising Habit
                </span>
                <span className="text-[11px] text-[#45464d]">
                  Onboarding completion & 2nd treatment conversion rate: 68%
                </span>
              </div>
              <span className="font-['JetBrains_Mono'] text-[15px] font-bold text-[#006a61]">
                +42 Patients
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#ffdad6]/30 border border-[#ba1a1a]/20 flex items-center justify-between">
              <div>
                <span className="font-semibold text-[13px] text-[#ba1a1a] block">
                  Champions Lapsing into At-Risk Window
                </span>
                <span className="text-[11px] text-[#45464d]">
                  Triggered by &gt;120d interval elapsed without neurotoxin/lifting recall
                </span>
              </div>
              <span className="font-['JetBrains_Mono'] text-[15px] font-bold text-[#ba1a1a]">
                -67 Patients
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#eff4ff]/60 border border-[#c6c6cd]/30 flex items-center justify-between">
              <div>
                <span className="font-semibold text-[13px] text-[#0b1c30] block">
                  At-Risk Recovered via Precision Recall
                </span>
                <span className="text-[11px] text-[#45464d]">
                  Re-booked into active cycle within 14 days of warning signal
                </span>
              </div>
              <span className="font-['JetBrains_Mono'] text-[15px] font-bold text-[#006a61]">
                +18 Patients
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#eff4ff]/60 border border-[#c6c6cd]/30 flex items-center justify-between">
              <div>
                <span className="font-semibold text-[13px] text-[#0b1c30] block">
                  Inactive Win-Backs (Lapsed &gt;180 Days)
                </span>
                <span className="text-[11px] text-[#45464d]">
                  Re-activated via personalized VIP concierge LINE campaign
                </span>
              </div>
              <span className="font-['JetBrains_Mono'] text-[15px] font-bold text-[#006a61]">
                +86 Patients
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#131b2e] text-white flex items-center justify-between shadow-xs">
              <div>
                <span className="font-bold text-[14px] block">
                  Net Active Patient Expansion Rate
                </span>
                <span className="text-[11px] text-[#bec6e0]">
                  Thonglor Flagship Active Retained Capacity
                </span>
              </div>
              <div className="text-right">
                <span className="font-['JetBrains_Mono'] text-[18px] font-bold text-[#86f2e4]">
                  +5.6% MoM
                </span>
                <span className="block text-[11px] text-[#bec6e0]">+79 Net Patients</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Retention Sales Funnel & Consultant Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (6 cols): End-to-End Retention Sales Funnel */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#c6c6cd]/40 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#c6c6cd]/30">
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[15px] text-[#0b1c30]">
                End-to-End Retention Sales Funnel
              </h3>
              <p className="text-[12px] text-[#45464d]">
                From Clinical Recall Trigger to Completed Cash Inflow
              </p>
            </div>
            <span className="text-[12px] font-mono font-bold text-[#006a61]">
              ฿2.14M Completed
            </span>
          </div>

          <div className="space-y-3.5">
            {RETENTION_FUNNEL_STAGES.map(stage => (
              <div key={stage.step} className="space-y-1">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-semibold text-[#0b1c30] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#131b2e] text-white text-[10px] font-bold flex items-center justify-center">
                      {stage.step}
                    </span>
                    {stage.name}
                  </span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-[#0b1c30] mr-2">
                      {stage.patients}
                    </span>
                    <span className={`text-[11px] font-semibold ${
                      stage.isFinal ? 'text-[#006a61]' : 'text-[#45464d]'
                    }`}>
                      ({stage.rate})
                    </span>
                  </div>
                </div>

                <div className="w-full bg-[#eff4ff] h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      stage.isFinal ? 'bg-[#006a61]' : 'bg-[#131b2e]'
                    }`}
                    style={{ width: `${stage.widthPercent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-[#eff4ff] text-[11px] text-[#45464d] flex items-center justify-between mt-2">
            <span>Overall Recall Conversion Efficiency:</span>
            <strong className="text-[#006a61] text-[12px]">13.1% (1,420 → 186 Visits)</strong>
          </div>
        </div>

        {/* Right (6 cols): Sales Consultant Retention Leaderboard */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#c6c6cd]/40 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#c6c6cd]/30">
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[15px] text-[#0b1c30]">
                Sales Consultant Retention Leaderboard
              </h3>
              <p className="text-[12px] text-[#45464d]">
                Ranked by CRM Recall Attributed Revenue (MTD)
              </p>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#006a61] text-[11px] font-bold">
              4 Active Consultants
            </span>
          </div>

          <div className="space-y-2.5">
            {CONSULTANT_LEADERBOARD.map(c => (
              <div
                key={c.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  c.isTop
                    ? 'bg-[#86f2e4]/15 border-[#006a61]/30 ring-1 ring-[#006a61]/20'
                    : 'bg-[#eff4ff]/30 border-[#c6c6cd]/30 hover:bg-[#eff4ff]/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px] ${
                      c.isTop ? 'bg-[#006a61] text-white shadow-xs' : 'bg-[#dce9ff] text-[#0b1c30]'
                    }`}>
                      #{c.rank}
                    </div>
                    <div>
                      <div className="font-['Plus_Jakarta_Sans'] font-semibold text-[13px] text-[#0b1c30] flex items-center gap-1.5 leading-snug">
                        <span>{c.name}</span>
                        <span className="text-[11px] font-normal text-[#45464d]">({c.role})</span>
                        {c.isTop && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#006a61] text-white">
                            TOP PERFORMER
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#45464d] mt-0.5">
                        {c.assigned} Assigned · Contact Rate: {c.contactRatePercent}% · Booking: {c.bookingRatePercent}%
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-['Plus_Jakarta_Sans'] font-bold text-[14px] text-[#0b1c30] block">
                      ฿{(c.revenueGenerated).toLocaleString()}
                    </span>
                    <span className="text-[11px] text-[#006a61] font-semibold">
                      {c.completedCount} Completed Visits
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-1 text-center">
            <button
              onClick={() => onNavigate('todays-queue')}
              className="text-[12px] font-semibold text-[#006a61] hover:underline"
            >
              Open Consultant Outreach Queue →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
