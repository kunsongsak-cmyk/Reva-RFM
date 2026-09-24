import React, { useState } from 'react';
import { Patient, ScreenType } from '../types';
import { isDueSoon, isOverdue, needsFollowUp, initials } from '../lib/rfm';

interface TodaysQueueScreenProps {
  patients: Patient[];
  selectedPatient: Patient;
  onSelectPatient: (patient: Patient) => void;
  onNavigate: (screen: ScreenType) => void;
  onOpenLineChat: (patient: Patient) => void;
  onOpenOutcome: (patient: Patient) => void;
  onOpenBookModal: (patient: Patient) => void;
}

export const TodaysQueueScreen: React.FC<TodaysQueueScreenProps> = ({
  patients,
  selectedPatient,
  onSelectPatient,
  onNavigate,
  onOpenLineChat,
  onOpenOutcome,
  onOpenBookModal
}) => {
  type QueueTab = 'All' | 'Treatment Due' | 'At Risk' | 'New Patient' | 'Overdue';
  const [activeTab, setActiveTab] = useState<QueueTab>('All');
  const [procedureFilter, setProcedureFilter] = useState('All Procedures');
  const [doctorFilter, setDoctorFilter] = useState('All Doctors');
  const [searchQuery, setSearchQuery] = useState('');

  const tabMatchers: Record<QueueTab, (p: Patient) => boolean> = {
    'All': () => true,
    'Treatment Due': p => isOverdue(p) || isDueSoon(p),
    'At Risk': p => p.category === 'At Risk',
    'New Patient': p => p.category === 'New Patients',
    'Overdue': isOverdue
  };
  const countTab = (t: QueueTab) => patients.filter(tabMatchers[t]).length;
  const urgentCount = patients.filter(needsFollowUp).length;
  const overdueCount = patients.filter(isOverdue).length;
  const liftingOverdueCount = patients.filter(p => p.cycles.some(c => c.category === 'Lifting' && c.isOverdue)).length;

  // Filter patients based on tab and inputs
  const filteredPatients = patients.filter(p => {
    if (!tabMatchers[activeTab](p)) return false;

    if (procedureFilter !== 'All Procedures') {
      const match = p.cycles.some(c => c.category === procedureFilter && !c.isLapsed);
      if (!match) return false;
    }

    if (doctorFilter !== 'All Doctors' && p.attendingDoctor !== doctorFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.hn.toLowerCase().includes(q) || p.nickname.toLowerCase().includes(q);
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[24px] font-bold text-[#0b1c30] tracking-tight">
            สวัสดีตอนเช้า คุณ May
          </h1>
          <p className="font-sans text-[14px] text-[#45464d] mt-0.5">
            วันนี้มี <strong className="text-[#006a61]">คนไข้ที่ต้องติดตามด่วน {urgentCount} ราย</strong> ที่ถึงรอบนัดและควรติดต่อกลับ
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenBookModal(selectedPatient)}
            className="px-4 py-2 bg-white border border-[#c6c6cd]/50 hover:bg-[#eff4ff] text-[#0b1c30] text-[13px] font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px] text-[#006a61]">add_circle</span>
            <span>จองนัดด่วน</span>
          </button>
          <button
            onClick={() => onOpenOutcome(selectedPatient)}
            className="px-4 py-2 bg-black hover:bg-slate-800 text-white text-[13px] font-semibold rounded-lg flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">rate_review</span>
            <span>บันทึกผลการติดต่อ</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-xl bg-white border border-[#c6c6cd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[#45464d]">ต้องติดตามวันนี้</span>
            <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#006a61]">
              <span className="material-symbols-outlined text-[18px]">checklist</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[26px] font-bold text-[#0b1c30] tracking-tight">
                48
              </span>
              <span className="text-[11px] font-semibold text-[#006a61]">
                ติดต่อแล้ว 12 จาก 48 (25%)
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-[#eff4ff] h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-[#006a61] h-full rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl bg-white border border-[#c6c6cd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[#45464d]">เลยกำหนดนัด</span>
            <div className="w-8 h-8 rounded-lg bg-[#ffdad6] flex items-center justify-center text-[#93000a]">
              <span className="material-symbols-outlined text-[18px]">alarm_on</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[26px] font-bold text-[#ba1a1a] tracking-tight">
                {overdueCount}
              </span>
              <span className="text-[11px] font-medium text-[#ba1a1a]">
                ราย ต้องรีบติดต่อ
              </span>
            </div>
            <p className="text-[11px] text-[#45464d] mt-1.5 truncate">
              เลยรอบ Lifting {liftingOverdueCount} ราย
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl bg-white border border-[#c6c6cd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[#45464d]">จองนัดสำเร็จ</span>
            <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#006a61]">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[26px] font-bold text-[#0b1c30] tracking-tight">
                12 <span className="text-[15px] font-normal text-[#76777d]">/ 15</span>
              </span>
              <span className="text-[11px] font-semibold text-[#006a61]">
                80% ของเป้ารายวัน
              </span>
            </div>
            <p className="text-[11px] text-[#45464d] mt-1.5 truncate">
              ยอดคาดการณ์จากนัดที่จอง ฿342,000
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-xl bg-white border border-[#c6c6cd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[#45464d]">ยอดขายจาก CRM เดือนนี้</span>
            <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#006a61]">
              <span className="material-symbols-outlined text-[18px]">monetization_on</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[24px] font-bold text-[#0b1c30] tracking-tight">
                ฿428,500
              </span>
              <span className="text-[11px] font-semibold text-[#006a61]">
                +18.4% จากเดือนก่อน
              </span>
            </div>
            <p className="text-[11px] text-[#45464d] mt-1.5 truncate">
              ROI จากการติดตามคนไข้: 14.2x
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Priority Queue (Left) & Fast Dossier (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Priority Queue (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#c6c6cd]/40 shadow-xs overflow-hidden">
          {/* Tabs bar */}
          <div className="px-5 pt-4 pb-2 border-b border-[#c6c6cd]/30 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
              {([
                { label: 'ทั้งหมด', key: 'All' },
                { label: 'ถึงรอบ Treatment', key: 'Treatment Due' },
                { label: 'At Risk', key: 'At Risk' },
                { label: 'คนไข้ใหม่', key: 'New Patient' },
                { label: 'เลยกำหนด', key: 'Overdue' }
              ] as { label: string; key: QueueTab }[]).map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-colors ${
                    activeTab === t.key
                      ? 'bg-black text-white shadow-xs'
                      : 'text-[#45464d] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
                  }`}
                >
                  {t.label} ({countTab(t.key)})
                </button>
              ))}
            </div>
          </div>

          {/* Filters row */}
          <div className="px-5 py-3 bg-[#eff4ff]/40 border-b border-[#c6c6cd]/30 flex flex-wrap items-center justify-between gap-3 text-[12px]">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <span className="material-symbols-outlined text-[18px] text-[#76777d]">filter_alt</span>
              <select
                value={procedureFilter}
                onChange={e => setProcedureFilter(e.target.value)}
                className="h-8 px-2.5 rounded-lg bg-white border border-[#c6c6cd]/40 text-[#0b1c30] outline-none font-medium"
              >
                <option value="All Procedures">ทุกหัตถการ</option>
                <option value="Lifting">Lifting (Oligio X / Ulthera)</option>
                <option value="Injectables">Injectables (Botox)</option>
                <option value="Skin">Skin Booster (Rejuran / PN)</option>
                <option value="Laser">Laser (Pico / Yellow)</option>
              </select>

              <select
                value={doctorFilter}
                onChange={e => setDoctorFilter(e.target.value)}
                className="h-8 px-2.5 rounded-lg bg-white border border-[#c6c6cd]/40 text-[#0b1c30] outline-none font-medium"
              >
                <option value="All Doctors">แพทย์ทุกท่าน</option>
                <option value="Dr. Kornvipa">Dr. Kornvipa</option>
                <option value="Dr. Vorapat">Dr. Vorapat</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="ค้นหาในคิว..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-8 px-2.5 rounded-lg bg-white border border-[#c6c6cd]/40 text-[#0b1c30] placeholder:text-[#76777d] outline-none w-36 sm:w-48"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#c6c6cd]/30 bg-[#eff4ff]/60 text-[11px] font-semibold text-[#45464d] uppercase tracking-wider">
                  <th className="py-3 px-4">คนไข้ & กลุ่ม RFM</th>
                  <th className="py-3 px-3">เหตุผลที่ต้องติดตาม</th>
                  <th className="py-3 px-3">ผู้ดูแล & แพทย์</th>
                  <th className="py-3 px-3 text-center">ความเร่งด่วน</th>
                  <th className="py-3 px-4 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c6c6cd]/25 text-[13px]">
                {filteredPatients.map(p => {
                  const isSelected = selectedPatient.id === p.id;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => onSelectPatient(p)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#eff4ff] ring-1 ring-inset ring-[#006a61]/30'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Patient & RFM */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {p.avatarUrl ? (
                            <img
                              src={p.avatarUrl}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-full object-cover border border-[#c6c6cd]/40 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#dce9ff] flex items-center justify-center font-bold text-[#006a61] text-[13px] shrink-0">
                              {initials(p.name)}
                            </div>
                          )}
                          <div>
                            <div className="font-display font-semibold text-[#0b1c30] flex items-center gap-1.5 leading-snug">
                              <span>{p.name}</span>
                              <span className="text-[11px] font-normal text-[#45464d]">
                                {p.nickname && `(${p.nickname})`}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#45464d] flex items-center gap-1 mt-0.5">
                              <span className="font-mono text-[#006a61] font-medium">HN: {p.hn}</span>
                              <span>•</span>
                              <span className={`px-1.5 py-0.2 rounded text-[10px] font-medium ${
                                p.category === 'At Risk'
                                  ? 'bg-[#ffdad6] text-[#93000a]'
                                  : p.category === 'Champions'
                                  ? 'bg-[#86f2e4]/30 text-[#006a61]'
                                  : 'bg-[#e5eeff] text-[#0b1c30]'
                              }`}>
                                {p.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Recall Trigger */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#0b1c30] flex items-center gap-1">
                            {p.priorityReason}
                          </span>
                          <span className="text-[11px] text-[#76777d]">
                            มาล่าสุด: {p.lastVisitRecencyDays} วันก่อน ({p.lastVisitDate})
                          </span>
                        </div>
                      </td>

                      {/* Clinical Owner */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col text-[12px]">
                          <span className="font-medium text-[#0b1c30]">{p.salesOwner}</span>
                          <span className="text-[11px] text-[#45464d]">{p.attendingDoctor}</span>
                        </div>
                      </td>

                      {/* Priority Score */}
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className={`font-mono text-[13px] font-bold ${
                            p.priorityScore >= 90
                              ? 'text-[#ba1a1a]'
                              : p.priorityScore >= 80
                              ? 'text-[#c76c00]'
                              : 'text-[#006a61]'
                          }`}>
                            {p.priorityScore}
                          </span>
                          <span className="text-[9px] uppercase font-bold text-[#76777d]">
                            {p.priorityLevel}
                          </span>
                        </div>
                      </td>

                      {/* Immediate Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => onOpenLineChat(p)}
                            title="ส่งข้อความ LINE OA"
                            className="w-8 h-8 rounded-lg bg-[#00b900]/10 hover:bg-[#00b900]/20 text-[#00a000] flex items-center justify-center transition-colors"
                          >
                            <span className="material-symbols-outlined text-[17px]">chat</span>
                          </button>

                          <a
                            href={`tel:${p.phone}`}
                            title="โทรหาคนไข้"
                            className="w-8 h-8 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006a61] flex items-center justify-center transition-colors"
                          >
                            <span className="material-symbols-outlined text-[17px]">call</span>
                          </a>

                          <button
                            onClick={() => onOpenOutcome(p)}
                            title="บันทึกผลการติดต่อ"
                            className="w-8 h-8 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] flex items-center justify-center transition-colors"
                          >
                            <span className="material-symbols-outlined text-[17px]">rate_review</span>
                          </button>

                          <button
                            onClick={() => {
                              onSelectPatient(p);
                              onNavigate('patient-detail');
                            }}
                            title="ดูโปรไฟล์เต็ม"
                            className="px-2.5 py-1.5 rounded-lg bg-black hover:bg-slate-800 text-white text-[11px] font-semibold flex items-center gap-1 transition-transform active:scale-95 shadow-xs"
                          >
                            <span>โปรไฟล์</span>
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-[#c6c6cd]/30 bg-[#eff4ff]/40 flex items-center justify-between text-[11px] text-[#45464d]">
            <span>แสดง {filteredPatients.length} จาก {patients.length} ราย เรียงตามความเร่งด่วน</span>
            <span className="font-semibold text-[#006a61]">ซิงก์ข้อมูลครั้งถัดไป: 15:00</span>
          </div>
        </div>

        {/* Right Column: Fast Dossier Drawer (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#c6c6cd]/40 shadow-xs p-5 space-y-5 sticky top-20">
          {/* Header of Drawer */}
          <div className="flex items-center justify-between pb-3 border-b border-[#c6c6cd]/30">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#45464d]">
              ข้อมูลคนไข้โดยย่อ
            </span>
            <button
              onClick={() => onNavigate('patient-detail')}
              className="text-[12px] font-semibold text-[#006a61] hover:underline flex items-center gap-0.5"
            >
              <span>ดูโปรไฟล์เต็ม</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </button>
          </div>

          {/* Patient Card Lockup */}
          <div className="flex items-center gap-3.5">
            {selectedPatient.avatarUrl ? (
              <img
                src={selectedPatient.avatarUrl}
                alt={selectedPatient.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#dce9ff] flex items-center justify-center font-bold text-[#006a61] text-[18px] shrink-0 shadow-sm">
                {initials(selectedPatient.name)}
              </div>
            )}
            <div>
              <div className="font-display font-bold text-[17px] text-[#0b1c30] leading-tight flex items-center gap-1.5">
                <span>{selectedPatient.name}</span>
                <span className="text-[12px] font-normal text-[#45464d]">{selectedPatient.nickname && `(${selectedPatient.nickname})`}</span>
              </div>
              <div className="text-[12px] text-[#45464d] flex items-center gap-1.5 mt-0.5">
                <span className="font-mono text-[#006a61] font-semibold">HN: {selectedPatient.hn}</span>
                <span>•</span>
                <span>{selectedPatient.age ? `${selectedPatient.age} ปี` : 'ไม่ระบุอายุ'}</span>
                {selectedPatient.tier && <><span>•</span><span>{selectedPatient.tier}</span></>}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ffdad6] text-[#ba1a1a]">
                  {selectedPatient.category} (RFM {selectedPatient.rfmScore.recencyScore}-{selectedPatient.rfmScore.frequencyScore}-{selectedPatient.rfmScore.monetaryScore})
                </span>
                <span className="text-[11px] font-mono font-semibold text-[#006a61]">
                  ฿{(selectedPatient.lifetimeValue).toLocaleString()} LTV
                </span>
              </div>
            </div>
          </div>

          {/* Quick Contact bar */}
          <div className="p-2.5 rounded-lg bg-[#eff4ff] flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-1.5 text-[#0b1c30]">
              <span className="material-symbols-outlined text-[16px] text-[#006a61]">call</span>
              <span className="font-mono font-medium">{selectedPatient.phone}</span>
            </div>
            <div className="flex items-center gap-1 text-[#00a000] font-semibold">
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>{selectedPatient.lineId}</span>
            </div>
          </div>

          {/* Why Reach Out Now */}
          <div className="space-y-2">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#45464d]">
              ทำไมต้องติดต่อตอนนี้
            </span>
            <div className="p-3.5 rounded-xl bg-[#eff4ff]/60 border border-[#c6c6cd]/30 space-y-2.5 text-[12px]">
              {selectedPatient.signals.map((sig, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className={`material-symbols-outlined text-[17px] ${sig.iconColor} shrink-0 mt-0.5`}>
                    {sig.icon}
                  </span>
                  <div>
                    <strong className="text-[#0b1c30]">{sig.title}:</strong>{' '}
                    <span className="text-[#45464d]">{sig.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cycle Decay engine */}
          <div className="space-y-2">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#45464d]">
              รอบ Treatment ปัจจุบัน
            </span>
            <div className="space-y-2">
              {selectedPatient.cycles.map((cyc, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#eff4ff]/40 border border-[#c6c6cd]/30 text-[12px]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#0b1c30]">{cyc.protocolName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      cyc.overduePillType === 'error'
                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                        : 'bg-[#86f2e4]/30 text-[#006a61]'
                    }`}>
                      {cyc.overduePillText}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#45464d] flex items-center justify-between">
                    <span>ครั้งล่าสุด: {cyc.lastTreatment} ({cyc.lastDate})</span>
                    <span className="font-semibold text-[#0b1c30]">{cyc.daysDiff}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended proposal */}
          {selectedPatient.recommendedProposal.title && (
          <div className="p-3.5 rounded-xl bg-[#e5eeff] border border-[#006a61]/20 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#006a61] uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              ข้อเสนอที่แนะนำ
            </div>
            <p className="text-[12px] font-semibold text-[#0b1c30] leading-snug">
              {selectedPatient.recommendedProposal.title}
            </p>
            <p className="text-[11px] text-[#45464d]">
              {selectedPatient.recommendedProposal.subtitle}
            </p>
          </div>
          )}

          {/* Fast Action Buttons */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onOpenLineChat(selectedPatient)}
                className="py-2.5 px-3 rounded-lg bg-[#00b900] hover:bg-[#009b00] text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-xs"
              >
                <span className="material-symbols-outlined text-[17px]">chat</span>
                <span>ส่ง LINE</span>
              </button>
              <button
                onClick={() => onOpenOutcome(selectedPatient)}
                className="py-2.5 px-3 rounded-lg bg-black hover:bg-slate-800 text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-xs"
              >
                <span className="material-symbols-outlined text-[17px]">rate_review</span>
                <span>บันทึกผล</span>
              </button>
            </div>

            <button
              onClick={() => onNavigate('patient-detail')}
              className="w-full py-2.5 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006a61] text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#c6c6cd]/30"
            >
              <span>ดูโปรไฟล์และประวัติการรักษาทั้งหมด</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
