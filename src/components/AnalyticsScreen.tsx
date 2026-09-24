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
REVA AESTHETIC CLINIC - รายงานการกลับมาใช้บริการและรายได้
สาขา: ${selectedBranch} | ช่วงเวลา: ${selectedMonth}
สร้างเมื่อ: ${new Date().toLocaleDateString('th-TH')}
=====================================================

EXECUTIVE SUMMARY
- รายได้เดือนนี้ ฿2.84M (+14.2% จากเดือนก่อน) คิดเป็น 88.8% ของเป้า ฿3.20M
- รายได้ 75.3% มาจากการติดตามคนไข้ผ่าน CRM (ROI 18.4x)
- อัตรากลับมาใช้บริการภายใน 180 วัน 48.6% สูงกว่าเป้า 45.0%
- กลุ่ม At Risk มี 286 ราย มูลค่า LTV รวม ฿25.1M ควรเร่งติดตามเป็นอันดับแรก

1. ตัวชี้วัดหลัก
- รายได้รวมเดือนนี้: ฿2,840,000 (+14.2% จากเดือนก่อน)
  * คนไข้เก่า: 62% (฿1,760,000)
  * คนไข้ใหม่: 38% (฿1,080,000)
- รายได้จาก CRM: ฿2,140,000 (75.3% ของรายได้รวม)
  * ROI จาก CRM: 18.4x
- อัตรากลับมาใช้บริการภายใน 180 วัน: 48.6% (เป้า 45.0%)
- คนไข้ที่ยัง Active: 1,482 ราย (ดึงกลับมาได้ 42 รายในเดือนนี้)
- อัตราการหายไป (Churn): 4.2% (ลดลงจาก 6.8% ในไตรมาสก่อน)

2. การกระจายตัวของกลุ่ม RFM
- Champions: 182 ราย (12%) | ยอดเฉลี่ย ฿185,000
- Loyal VIPs: 328 ราย (22%) | ยอดเฉลี่ย ฿94,000
- Promising Habit: 214 ราย (14%) | ยอดเฉลี่ย ฿52,000
- New Patients: 192 ราย (13%) | ยอดเฉลี่ย ฿31,000
- Need Attention: 264 ราย (18%) | ยอดเฉลี่ย ฿44,000
- At Risk: 286 ราย (19%) | ยอดเฉลี่ย ฿88,000 | LTV รวม ฿25.1M
- Lost / Inactive: 621 ราย (30%) | อยู่ระหว่างแคมเปญดึงกลับ

3. อันดับผลงานที่ปรึกษา
1. คุณ May: ฿720,000 | ติดต่อได้ 86% | จองนัด 31% | มารับบริการ 61 ราย
2. คุณ Ann: ฿650,000 | ติดต่อได้ 81% | จองนัด 28% | มารับบริการ 58 ราย
3. คุณ Joy: ฿510,000 | ติดต่อได้ 76% | จองนัด 24% | มารับบริการ 43 ราย
4. คุณ Fah: ฿260,000 | ติดต่อได้ 72% | จองนัด 20% | มารับบริการ 24 ราย

=====================================================
เอกสารภายใน - ห้ามเผยแพร่
`;
    const blob = new Blob(['\uFEFF' + reportText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Reva_Executive_Report_${selectedMonth.replace(' ', '_')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[24px] font-bold text-[#0b1c30] tracking-tight">
            ภาพรวมการกลับมาใช้บริการ & รายได้
          </h1>
          <p className="font-sans text-[14px] text-[#45464d] mt-0.5">
            ผลงานเดือนนี้ ({selectedMonth}) เทียบเป้า • {selectedBranch}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="h-10 px-3 rounded-lg bg-white border border-[#c6c6cd]/50 text-[13px] font-semibold text-[#0b1c30] outline-none shadow-xs"
          >
            <option value="September 2026">กันยายน 2569</option>
            <option value="August 2026">สิงหาคม 2569</option>
            <option value="July 2026">กรกฎาคม 2569</option>
          </select>

          <button
            onClick={onOpenWeeklyBrief}
            className="px-3.5 py-2 bg-white border border-[#c6c6cd]/50 hover:bg-[#eff4ff] text-[#006a61] text-[13px] font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">schedule</span>
            <span>ตั้งเวลาสรุปรายสัปดาห์</span>
          </button>

          <button
            onClick={handleDownloadBoardReport}
            className="px-4 py-2 bg-black hover:bg-slate-800 text-white text-[13px] font-semibold rounded-lg flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>ดาวน์โหลดรายงาน</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Revenue & Retention Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Patient Revenue MTD */}
        <div className="p-5 rounded-xl bg-white border border-[#c6c6cd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#45464d] uppercase tracking-wider">
              รายได้รวมเดือนนี้
            </span>
            <span className="text-[12px] font-bold text-[#006a61] bg-[#86f2e4]/30 px-2 py-0.5 rounded">
              +14.2% จากเดือนก่อน
            </span>
          </div>

          <div className="mt-3">
            <div className="font-display text-[28px] font-bold text-[#0b1c30] tracking-tight">
              ฿2,840,000
            </div>
            <div className="text-[11px] text-[#76777d] mt-0.5">
              เป้า: ฿3.20M (ถึงเป้า 88.8%)
            </div>

            {/* Split bar */}
            <div className="mt-3">
              <div className="w-full h-2 rounded-full bg-[#eff4ff] flex overflow-hidden">
                <div className="bg-[#006a61] h-full" style={{ width: '62%' }} title="คนไข้เก่า: 62%"></div>
                <div className="bg-[#131b2e] h-full" style={{ width: '38%' }} title="คนไข้ใหม่: 38%"></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#45464d] mt-1.5 font-medium">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#006a61]"></span>
                  คนไข้เก่า 62% (฿1.76M)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#131b2e]"></span>
                  คนไข้ใหม่ 38% (฿1.08M)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI 2: CRM Attributable Revenue */}
        <div className="p-5 rounded-xl bg-white border border-[#c6c6cd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#45464d] uppercase tracking-wider">
              รายได้จาก CRM
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#006a61]">
              <span className="material-symbols-outlined text-[17px]">hub</span>
            </div>
          </div>

          <div className="mt-3">
            <div className="font-display text-[28px] font-bold text-[#0b1c30] tracking-tight">
              ฿2,140,000
            </div>
            <div className="text-[11px] font-semibold text-[#006a61] mt-0.5">
              75.3% ของรายได้ทั้งคลินิก
            </div>

            <div className="mt-3 p-2.5 rounded-lg bg-[#eff4ff] flex items-center justify-between text-[11px]">
              <span className="text-[#45464d]">ผลตอบแทนจาก CRM:</span>
              <strong className="text-[#006a61] font-bold">18.4x ROI</strong>
            </div>
          </div>
        </div>

        {/* KPI 3: 180-Day Repeat Rate */}
        <div className="p-5 rounded-xl bg-white border border-[#c6c6cd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#45464d] uppercase tracking-wider">
              กลับมาใช้บริการใน 180 วัน
            </span>
            <span className="text-[12px] font-bold text-[#006a61] bg-[#86f2e4]/30 px-2 py-0.5 rounded">
              สูงกว่าเป้า 3.6%
            </span>
          </div>

          <div className="mt-3">
            <div className="font-display text-[28px] font-bold text-[#0b1c30] tracking-tight">
              48.6%
            </div>
            <div className="text-[11px] text-[#76777d] mt-0.5">
              เป้าหมาย: 45.0%
            </div>

            <div className="w-full bg-[#eff4ff] h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#006a61] h-full rounded-full" style={{ width: '48.6%' }}></div>
            </div>

            <p className="text-[11px] text-[#45464d] mt-2 leading-tight">
              อยู่ในกลุ่มผลงานดีที่สุด 25% ของคลินิกความงามในกรุงเทพฯ
            </p>
          </div>
        </div>

        {/* KPI 4: Active Clinical Pool */}
        <div className="p-5 rounded-xl bg-white border border-[#c6c6cd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#45464d] uppercase tracking-wider">
              คนไข้ที่ยัง Active
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#006a61]">
              <span className="material-symbols-outlined text-[17px]">group</span>
            </div>
          </div>

          <div className="mt-3">
            <div className="font-display text-[28px] font-bold text-[#0b1c30] tracking-tight">
              1,482
            </div>
            <div className="text-[11px] font-semibold text-[#006a61] mt-0.5">
              ดึงกลับจาก At Risk ได้ 42 รายในเดือนนี้
            </div>

            <div className="mt-3 p-2.5 rounded-lg bg-[#eff4ff] flex items-center justify-between text-[11px]">
              <span className="text-[#45464d]">อัตราการหายไป (Churn):</span>
              <strong className="text-[#ba1a1a] font-bold">4.2% (ลดลงจาก 6.8%)</strong>
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
              <h3 className="font-display font-bold text-[15px] text-[#0b1c30]">
                การกระจายตัวของกลุ่ม RFM
              </h3>
              <p className="text-[12px] text-[#45464d]">
                คลิกที่กลุ่มเพื่อดูรายชื่อคนไข้
              </p>
            </div>
            <button
              onClick={() => onNavigate('patients')}
              className="text-[12px] font-semibold text-[#006a61] hover:underline"
            >
              ดูฐานข้อมูลทั้งหมด →
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
                    <span className="font-display font-semibold text-[13px] text-[#0b1c30]">
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
                      {cohort.count.toLocaleString()} ราย
                    </span>
                    <span className="text-[11px] text-[#76777d] ml-1.5">
                      ({cohort.percent}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#45464d] mt-1">
                  <span>ยอดเฉลี่ย: <strong className="text-[#0b1c30]">{cohort.avgSpend}</strong></span>
                  <span className="text-[#006a61] font-semibold hover:underline">ดูรายชื่อ →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right (6 cols): Net Patient Movement Matrix */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#c6c6cd]/40 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#c6c6cd]/30">
            <div>
              <h3 className="font-display font-bold text-[15px] text-[#0b1c30]">
                การย้ายกลุ่มของคนไข้
              </h3>
              <p className="text-[12px] text-[#45464d]">
                การเปลี่ยนแปลงสุทธิในเดือนนี้
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#86f2e4]/30 text-[#006a61] text-[11px] font-bold">
              เพิ่มขึ้นสุทธิ +79
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-[#eff4ff]/60 border border-[#c6c6cd]/30 flex items-center justify-between">
              <div>
                <span className="font-semibold text-[13px] text-[#0b1c30] block">
                  คนไข้ใหม่ → เริ่มกลับมาซ้ำ
                </span>
                <span className="text-[11px] text-[#45464d]">
                  อัตรากลับมาทำ Treatment ครั้งที่ 2: 68%
                </span>
              </div>
              <span className="font-mono text-[15px] font-bold text-[#006a61]">
                +42 ราย
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#ffdad6]/30 border border-[#ba1a1a]/20 flex items-center justify-between">
              <div>
                <span className="font-semibold text-[13px] text-[#ba1a1a] block">
                  Champions → At Risk
                </span>
                <span className="text-[11px] text-[#45464d]">
                  ไม่ได้กลับมาทำ Botox/Lifting เกิน 120 วัน
                </span>
              </div>
              <span className="font-mono text-[15px] font-bold text-[#ba1a1a]">
                -67 ราย
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#eff4ff]/60 border border-[#c6c6cd]/30 flex items-center justify-between">
              <div>
                <span className="font-semibold text-[13px] text-[#0b1c30] block">
                  At Risk → ดึงกลับมาได้
                </span>
                <span className="text-[11px] text-[#45464d]">
                  จองนัดใหม่ภายใน 14 วันหลังได้รับการแจ้งเตือน
                </span>
              </div>
              <span className="font-mono text-[15px] font-bold text-[#006a61]">
                +18 ราย
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#eff4ff]/60 border border-[#c6c6cd]/30 flex items-center justify-between">
              <div>
                <span className="font-semibold text-[13px] text-[#0b1c30] block">
                  ดึงกลับคนไข้ที่หายไปเกิน 180 วัน
                </span>
                <span className="text-[11px] text-[#45464d]">
                  กลับมาจากแคมเปญ LINE เฉพาะบุคคล
                </span>
              </div>
              <span className="font-mono text-[15px] font-bold text-[#006a61]">
                +86 ราย
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#131b2e] text-white flex items-center justify-between shadow-xs">
              <div>
                <span className="font-bold text-[14px] block">
                  อัตราการเติบโตของคนไข้ Active สุทธิ
                </span>
                <span className="text-[11px] text-[#bec6e0]">
                  {selectedBranch}
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono text-[18px] font-bold text-[#86f2e4]">
                  +5.6% จากเดือนก่อน
                </span>
                <span className="block text-[11px] text-[#bec6e0]">สุทธิ +79 ราย</span>
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
              <h3 className="font-display font-bold text-[15px] text-[#0b1c30]">
                Funnel การติดตามคนไข้
              </h3>
              <p className="text-[12px] text-[#45464d]">
                ตั้งแต่ถึงรอบนัด จนถึงมารับบริการและชำระเงิน
              </p>
            </div>
            <span className="text-[12px] font-mono font-bold text-[#006a61]">
              ปิดการขาย ฿2.14M
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
            <span>อัตราแปลงผลรวม:</span>
            <strong className="text-[#006a61] text-[12px]">13.1% (1,420 → 186 ครั้ง)</strong>
          </div>
        </div>

        {/* Right (6 cols): Sales Consultant Retention Leaderboard */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#c6c6cd]/40 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#c6c6cd]/30">
            <div>
              <h3 className="font-display font-bold text-[15px] text-[#0b1c30]">
                อันดับผลงานที่ปรึกษา
              </h3>
              <p className="text-[12px] text-[#45464d]">
                เรียงตามรายได้จากการติดตามคนไข้ (เดือนนี้)
              </p>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#006a61] text-[11px] font-bold">
              ที่ปรึกษา 4 คน
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
                      <div className="font-display font-semibold text-[13px] text-[#0b1c30] flex items-center gap-1.5 leading-snug">
                        <span>{c.name}</span>
                        <span className="text-[11px] font-normal text-[#45464d]">({c.role})</span>
                        {c.isTop && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#006a61] text-white">
                            อันดับ 1
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#45464d] mt-0.5">
                        ดูแล {c.assigned} ราย · ติดต่อได้ {c.contactRatePercent}% · จองนัด {c.bookingRatePercent}%
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-display font-bold text-[14px] text-[#0b1c30] block">
                      ฿{(c.revenueGenerated).toLocaleString()}
                    </span>
                    <span className="text-[11px] text-[#006a61] font-semibold">
                      มารับบริการ {c.completedCount} ราย
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
              เปิดคิวติดตามคนไข้ →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
