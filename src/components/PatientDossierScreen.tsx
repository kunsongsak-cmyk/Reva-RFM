import React, { useState } from 'react';
import { Patient, TreatmentCategory, TreatmentHistoryItem, TimelineEvent } from '../types';
import { formatThaiDate, initials } from '../lib/rfm';

interface PatientDossierScreenProps {
  patient: Patient;
  onOpenLineChat: (patient: Patient) => void;
  onOpenOutcomeModal: (patient: Patient) => void;
  onOpenBookAppointment: (patient: Patient) => void;
  onUpdatePatient: (updated: Patient) => void;
  onBackToQueue: () => void;
}

export const PatientDossierScreen: React.FC<PatientDossierScreenProps> = ({
  patient,
  onOpenLineChat,
  onOpenOutcomeModal,
  onOpenBookAppointment,
  onUpdatePatient,
  onBackToQueue
}) => {
  const [treatmentCategoryFilter, setTreatmentCategoryFilter] = useState<'All' | TreatmentCategory>('All');
  const [expandChartNotes, setExpandChartNotes] = useState(true);
  const [offerAttached, setOfferAttached] = useState(patient.recommendedProposal.offerAttached || false);

  // Form states for Live Action Outcome Logger
  const [channel, setChannel] = useState<'line' | 'phone' | 'whatsapp' | 'walkin'>('line');
  const [outcomeOption, setOutcomeOption] = useState('สนใจ ทำ Treatment ต่อ');
  const [formNotes, setFormNotes] = useState('');
  const [nextDate, setNextDate] = useState('2026-09-28');
  const [nextTime, setNextTime] = useState('13:00 - 15:00 (Preferred)');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const filterTreatments = (treatments: TreatmentHistoryItem[]) => {
    if (treatmentCategoryFilter === 'All') return treatments;
    return treatments.filter(t => t.category === treatmentCategoryFilter);
  };

  const handleSaveOutcome = (e: React.FormEvent) => {
    e.preventDefault();
    const newTimelineEvent: TimelineEvent = {
      id: `ev-${Date.now()}`,
      title: `${outcomeOption} ผ่าน ${channel.toUpperCase()}`,
      timestamp: 'วันนี้ เมื่อสักครู่',
      icon: channel === 'line' ? 'chat' : channel === 'phone' ? 'call' : 'check_circle',
      iconBg: 'bg-[#006a61] text-white',
      description: formNotes,
      statusTag: 'บันทึกโดย คุณ May'
    };

    const updatedPatient: Patient = {
      ...patient,
      timeline: [newTimelineEvent, ...patient.timeline]
    };

    onUpdatePatient(updatedPatient);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Trail */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[13px] text-[#45464d]">
          <button
            onClick={onBackToQueue}
            className="hover:text-[#006a61] flex items-center gap-1 font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>งานประจำวัน</span>
          </button>
          <span>/</span>
          <span className="hover:text-[#006a61] cursor-pointer" onClick={onBackToQueue}>
            คิวติดตามวันนี้
          </span>
          <span>/</span>
          <span className="font-semibold text-[#0b1c30]">
            โปรไฟล์ • {patient.name}
          </span>
        </div>

        {saveSuccessNotice && (
          <div className="px-3 py-1.5 rounded-lg bg-[#86f2e4]/30 border border-[#006a61]/30 text-[#006a61] text-[12px] font-semibold flex items-center gap-1.5 animate-in fade-in">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>บันทึกผลการติดต่อเรียบร้อยแล้ว</span>
          </div>
        )}
      </div>

      {/* Patient Dossier Header Banner */}
      <div className="bg-white rounded-2xl border border-[#c6c6cd]/40 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Avatar & Patient Meta */}
          <div className="flex items-start sm:items-center gap-4">
            {patient.avatarUrl ? (
              <img
                src={patient.avatarUrl}
                alt={patient.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#eff4ff] shadow-sm shrink-0"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#dce9ff] flex items-center justify-center font-bold text-[#006a61] text-[24px] shrink-0 shadow-sm">
                {initials(patient.name)}
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-[22px] sm:text-[24px] font-bold text-[#0b1c30] leading-none">
                  {patient.name} <span className="text-[16px] font-normal text-[#45464d]">{patient.nickname && `(${patient.nickname})`}</span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#ffdad6] text-[#ba1a1a]">
                  {patient.category.toUpperCase()} (RFM: {patient.rfmScore.recencyScore}-{patient.rfmScore.frequencyScore}-{patient.rfmScore.monetaryScore})
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#45464d]">
                <span className="font-mono text-[#006a61] font-semibold">HN: {patient.hn}</span>
                <span>•</span>
                <span>{patient.age ? `อายุ ${patient.age} ปี` : 'ไม่ระบุอายุ'}</span>
                <span>•</span>
                {patient.nationality && <><span>{patient.nationality}</span><span>•</span></>}
                {patient.lineId && (
                <>
                <span className="text-[#00a000] font-semibold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px]">chat</span>
                  {patient.lineId}
                </span>
                <span>•</span>
                </>
                )}
                <span className="font-mono">{patient.phone}</span>
              </div>

              {/* Assignment Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                <span className="px-2.5 py-1 rounded-md bg-[#eff4ff] text-[#0b1c30] font-medium flex items-center gap-1 border border-[#c6c6cd]/30">
                  <span className="text-[#76777d]">ผู้ดูแลการขาย:</span>
                  <strong>{patient.salesOwner}</strong>{patient.salesOwnerRole && ` (${patient.salesOwnerRole})`}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#eff4ff] text-[#0b1c30] font-medium flex items-center gap-1 border border-[#c6c6cd]/30">
                  <span className="text-[#76777d]">แพทย์:</span>
                  <strong>{patient.attendingDoctor}</strong>{patient.doctorSpecialty && ` (${patient.doctorSpecialty})`}
                </span>
                {patient.branch && (
                <span className="px-2.5 py-1 rounded-md bg-[#eff4ff] text-[#0b1c30] font-medium flex items-center gap-1 border border-[#c6c6cd]/30">
                  <span className="text-[#76777d]">สาขา:</span>
                  <strong>{patient.branch}</strong>
                </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Priority Score & Primary Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4">
            <div className="text-left sm:text-right">
              <div className="flex items-center gap-2 justify-start sm:justify-end">
                <span className="text-[11px] font-semibold text-[#76777d] uppercase tracking-wider">
                  คะแนนความเร่งด่วน
                </span>
                <span className="font-mono text-[24px] font-bold text-[#ba1a1a]">
                  {patient.priorityScore} <span className="text-[14px] text-[#76777d] font-normal">/ 100</span>
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#ba1a1a] uppercase tracking-wider block">
                {patient.priorityLevel} • ควรติดต่อทันที
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onOpenLineChat(patient)}
                className="px-3.5 py-2 rounded-lg bg-[#00b900] hover:bg-[#009b00] text-white text-[12px] font-semibold flex items-center gap-1.5 transition-transform active:scale-95 shadow-xs"
              >
                <span className="material-symbols-outlined text-[17px]">chat</span>
                <span>แชท LINE OA</span>
              </button>

              <a
                href={`tel:${patient.phone}`}
                className="px-3.5 py-2 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006a61] text-[12px] font-semibold flex items-center gap-1.5 transition-colors border border-[#c6c6cd]/30"
              >
                <span className="material-symbols-outlined text-[17px]">call</span>
                <span>โทรหาคนไข้</span>
              </a>

              <button
                onClick={() => onOpenBookAppointment(patient)}
                className="px-3.5 py-2 rounded-lg bg-white hover:bg-[#eff4ff] text-[#0b1c30] text-[12px] font-semibold flex items-center gap-1.5 transition-colors border border-[#c6c6cd]/50 shadow-xs"
              >
                <span className="material-symbols-outlined text-[17px] text-[#006a61]">calendar_today</span>
                <span>จองนัด</span>
              </button>

              <button
                onClick={() => onOpenOutcomeModal(patient)}
                className="px-3.5 py-2 rounded-lg bg-black hover:bg-slate-800 text-white text-[12px] font-semibold flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
              >
                <span className="material-symbols-outlined text-[17px]">rate_review</span>
                <span>บันทึกผล</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Zone Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= ZONE 1 (Left 4 cols): Value, RFM & Why Today ================= */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Patient Financial & RFM Value */}
          <div className="bg-white rounded-xl border border-[#c6c6cd]/40 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#c6c6cd]/30">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#45464d]">
                มูลค่าคนไข้ & RFM
              </span>
              {patient.tier && (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#eff4ff] text-[#006a61] border border-[#86f2e4]/30">
                ระดับ {patient.tier}
              </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[#eff4ff]/60 border border-[#c6c6cd]/30">
                <span className="text-[11px] text-[#45464d] block">ยอดสะสม (LTV)</span>
                <span className="font-display text-[18px] font-bold text-[#0b1c30]">
                  ฿{(patient.lifetimeValue).toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#eff4ff]/60 border border-[#c6c6cd]/30">
                <span className="text-[11px] text-[#45464d] block">ยอดใช้จ่าย 12 เดือน</span>
                <span className="font-display text-[18px] font-bold text-[#0b1c30]">
                  ฿{(patient.trailing12M).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[12px] pt-1 border-t border-[#c6c6cd]/25">
              <span className="text-[#45464d]">ยอดเฉลี่ยต่อครั้ง</span>
              <span className="font-semibold text-[#0b1c30]">฿{(patient.avgTicket).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[#45464d]">จำนวนครั้งที่มารับบริการ</span>
              <span className="font-semibold text-[#0b1c30]">{patient.completedVisits} ครั้ง</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[#45464d]">มาครั้งล่าสุด</span>
              <span className="font-semibold text-[#ba1a1a]">{patient.lastVisitRecencyDays} วันก่อน ({patient.lastVisitDate})</span>
            </div>

            {/* RFM Score Detail Matrix */}
            <div className="p-3.5 rounded-xl bg-[#eff4ff]/80 border border-[#c6c6cd]/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#0b1c30] uppercase tracking-wider">
                  รายละเอียดคะแนน RFM
                </span>
                <span className="font-mono text-[11px] font-bold text-[#006a61]">
                  คะแนน: {patient.rfmScore.recencyScore} · {patient.rfmScore.frequencyScore} · {patient.rfmScore.monetaryScore}
                </span>
              </div>

              <div className="space-y-1.5 text-[11px] text-[#45464d]">
                <div className="flex items-start gap-1.5">
                  <strong className="text-[#ba1a1a] shrink-0">Recency ({patient.rfmScore.recencyScore}/5):</strong>
                  <span>{patient.rfmScore.recencyLabel}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <strong className="text-[#006a61] shrink-0">Frequency ({patient.rfmScore.frequencyScore}/5):</strong>
                  <span>{patient.rfmScore.frequencyLabel}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <strong className="text-[#0b1c30] shrink-0">Monetary ({patient.rfmScore.monetaryScore}/5):</strong>
                  <span>{patient.rfmScore.monetaryLabel}</span>
                </div>
              </div>

              <div className="p-2 rounded bg-white text-[11px] text-[#0b1c30] border border-[#c6c6cd]/30 leading-snug">
                <strong className="text-[#006a61]">สรุป:</strong> {patient.rfmScore.matrixVerdit}
              </div>
            </div>
          </div>

          {/* Card 2: Why Follow Up Today? */}
          <div className="bg-white rounded-xl border border-[#c6c6cd]/40 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#c6c6cd]/30">
              <span className="material-symbols-outlined text-[20px] text-[#ba1a1a]">warning</span>
              <span className="font-sans text-[12px] font-bold uppercase tracking-wider text-[#0b1c30]">
                ทำไมต้องติดตามวันนี้?
              </span>
            </div>

            <div className="space-y-3 text-[12px]">
              {patient.cycles.filter(c => c.isOverdue).map((cyc, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#ffdad6]/40 border border-[#ba1a1a]/20">
                  <span className="font-bold text-[#ba1a1a] block mb-0.5">
                    {cyc.protocolName} เลยรอบนัด ({cyc.daysDiff})
                  </span>
                  <p className="text-[#45464d] text-[11px] leading-snug">
                    ครั้งล่าสุด {cyc.lastTreatment} ({cyc.lastDate}) • ควรกลับมาทำภายใน {cyc.targetDate}
                  </p>
                </div>
              ))}

              {patient.signals.map((sig, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className={`material-symbols-outlined text-[18px] ${sig.iconColor} shrink-0 mt-0.5`}>
                    {sig.icon}
                  </span>
                  <div>
                    <strong className="text-[#0b1c30] block">{sig.title}</strong>
                    <span className="text-[#45464d] text-[11px] leading-snug">{sig.description}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommended Proposal */}
            {patient.recommendedProposal.title && (
            <div className="p-3.5 rounded-xl bg-[#e5eeff] border border-[#006a61]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#006a61] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  ข้อเสนอที่แนะนำ
                </span>
              </div>
              <p className="text-[12px] font-semibold text-[#0b1c30] leading-snug">
                {patient.recommendedProposal.title}
              </p>
              <p className="text-[11px] text-[#45464d]">
                {patient.recommendedProposal.subtitle}
              </p>

              <button
                onClick={() => setOfferAttached(!offerAttached)}
                className={`w-full mt-1 py-1.5 px-2.5 rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                  offerAttached
                    ? 'bg-[#006a61] text-white'
                    : 'bg-white text-[#006a61] border border-[#006a61]/30 hover:bg-[#eff4ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {offerAttached ? 'check' : 'local_offer'}
                </span>
                <span>{offerAttached ? 'แนบข้อเสนอในข้อความแล้ว' : 'แนบข้อเสนอในข้อความ'}</span>
              </button>
            </div>
            )}
          </div>
        </div>

        {/* ================= ZONE 2 (Center 5 cols): Cycles & Journey ================= */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: Treatment Cycle Status Engine */}
          <div className="bg-white rounded-xl border border-[#c6c6cd]/40 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#c6c6cd]/30">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#45464d]">
                สถานะรอบ Treatment
              </span>
              <span className="text-[11px] text-[#76777d]">คำนวณจากระยะเวลาที่ผลการรักษาคงอยู่</span>
            </div>

            <div className="space-y-3">
              {patient.cycles.map((cyc, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#eff4ff]/50 border border-[#c6c6cd]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-semibold text-[13px] text-[#0b1c30]">
                      {cyc.protocolName}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      cyc.overduePillType === 'error'
                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                        : cyc.overduePillType === 'secondary'
                        ? 'bg-[#86f2e4]/30 text-[#006a61]'
                        : 'bg-[#e5eeff] text-[#0b1c30]'
                    }`}>
                      {cyc.overduePillText}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#45464d]">
                    <div>
                      <span>ครั้งล่าสุด: </span>
                      <strong className="text-[#0b1c30]">{cyc.lastTreatment}</strong>
                      <span className="block text-[10px] text-[#76777d]">วันที่: {cyc.lastDate}</span>
                    </div>
                    <div className="text-right">
                      <span>ควรทำครั้งถัดไป: </span>
                      <strong className="text-[#0b1c30]">{cyc.targetDate}</strong>
                      <span className={`block font-semibold ${cyc.isOverdue ? 'text-[#ba1a1a]' : 'text-[#45464d]'}`}>{cyc.daysDiff}</span>
                    </div>
                  </div>

                  {/* Visual Progress bar */}
                  <div className="w-full bg-[#eff4ff] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        cyc.isOverdue ? 'bg-[#ba1a1a]' : cyc.isLapsed ? 'bg-[#c6c6cd]' : 'bg-[#006a61]'
                      }`}
                      style={{ width: `${Math.max(cyc.progressPercent, 10)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Clinical Treatment Journey */}
          <div className="bg-white rounded-xl border border-[#c6c6cd]/40 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#c6c6cd]/30">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#45464d]">
                ประวัติการรักษา ({patient.treatments.length} รายการ)
              </span>

              <button
                onClick={() => setExpandChartNotes(!expandChartNotes)}
                className="text-[11px] text-[#006a61] font-semibold hover:underline flex items-center gap-1"
              >
                <span>{expandChartNotes ? 'ซ่อนบันทึก' : 'แสดงบันทึกแพทย์'}</span>
                <span className="material-symbols-outlined text-[14px]">
                  {expandChartNotes ? 'expand_less' : 'expand_more'}
                </span>
              </button>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5">
              {(['All', 'Lifting', 'Injectables', 'Skin', 'Laser', 'Other'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setTreatmentCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                    treatmentCategoryFilter === cat
                      ? 'bg-[#131b2e] text-white'
                      : 'bg-[#eff4ff] text-[#45464d] hover:text-[#0b1c30]'
                  }`}
                >
                  {cat === 'All' ? 'ทั้งหมด' : cat === 'Other' ? 'อื่นๆ' : cat} ({cat === 'All' ? patient.treatments.length : patient.treatments.filter(t => t.category === cat).length})
                </button>
              ))}
            </div>

            {/* Procedure cards */}
            <div className="space-y-3">
              {filterTreatments(patient.treatments).map(t => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl bg-white border border-[#c6c6cd]/40 hover:border-[#006a61]/40 transition-colors shadow-2xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-display font-semibold text-[13px] text-[#0b1c30]">
                        {t.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-[#45464d] mt-0.5">
                        <span className="font-medium">{formatThaiDate(t.date)}</span>
                        <span>•</span>
                        <span>{t.doctor}</span>
                        <span>•</span>
                        <strong className="text-[#0b1c30]">฿{(t.price).toLocaleString()}</strong>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      t.statusType === 'error'
                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                        : t.statusType === 'secondary'
                        ? 'bg-[#86f2e4]/30 text-[#006a61]'
                        : 'bg-slate-100 text-[#45464d]'
                    }`}>
                      {t.statusBadge}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#45464d]">
                    {t.details}
                  </p>

                  {/* Chart Notes & Review */}
                  {expandChartNotes && (t.review || t.notes) && (
                    <div className="pt-2 border-t border-[#c6c6cd]/25 space-y-1.5 bg-[#eff4ff]/40 p-2.5 rounded-lg text-[11px]">
                      {t.review && (
                        <div className="flex items-center gap-1.5 text-[#006a61]">
                          <span className="material-symbols-outlined text-[14px]">star</span>
                          <span className="font-semibold">{t.review.stars}.0 รีวิวจากคนไข้:</span>
                          <span className="text-[#45464d] italic">"{t.review.text}"</span>
                        </div>
                      )}
                      {t.notes && (
                        <div className="text-[#0b1c30]">
                          <span className="text-[#76777d]">บันทึกแพทย์: </span>
                          {t.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= ZONE 3 (Right 3 cols): Live Action & Timeline ================= */}
        <div className="lg:col-span-3 space-y-6">
          {/* Card: Log Follow-up Outcome (Live Action) */}
          <div className="bg-white rounded-xl border border-[#c6c6cd]/40 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#c6c6cd]/30">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#45464d]">
                บันทึกผลการติดตาม
              </span>
              <span className="px-2 py-0.5 rounded bg-black text-white text-[10px] font-semibold">
                บันทึกทันที
              </span>
            </div>

            <form onSubmit={handleSaveOutcome} className="space-y-3.5">
              {/* Channel */}
              <div>
                <label className="block text-[11px] font-semibold text-[#0b1c30] mb-1">
                  ช่องทาง
                </label>
                <div className="grid grid-cols-4 gap-1 p-1 bg-[#eff4ff] rounded-lg text-center text-[11px]">
                  {(['line', 'phone', 'whatsapp', 'walkin'] as const).map(ch => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setChannel(ch)}
                      className={`py-1 rounded font-semibold transition-all uppercase ${
                        channel === ch
                          ? 'bg-white text-[#006a61] shadow-xs'
                          : 'text-[#45464d] hover:text-[#0b1c30]'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              {/* Consultation Outcome */}
              <div>
                <label className="block text-[11px] font-semibold text-[#0b1c30] mb-1">
                  ผลการติดต่อ
                </label>
                <div className="space-y-1">
                  {[
                    'สนใจ ทำ Treatment ต่อ',
                    'ให้ติดต่อกลับภายหลัง',
                    'ไม่ตอบกลับ',
                    'จองนัดแล้ว',
                    'ไม่สนใจ'
                  ].map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setOutcomeOption(opt)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors flex items-center justify-between ${
                        outcomeOption === opt
                          ? 'bg-[#131b2e] text-white font-semibold'
                          : 'bg-[#eff4ff]/60 text-[#0b1c30] hover:bg-[#eff4ff]'
                      }`}
                    >
                      <span>{opt}</span>
                      {outcomeOption === opt && (
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-semibold text-[#0b1c30] mb-1">
                  บันทึกเพิ่มเติม
                </label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  className="w-full p-2.5 text-[12px] bg-[#eff4ff] rounded-lg outline-none border border-transparent focus:border-[#006a61] text-[#0b1c30]"
                />
              </div>

              {/* Next follow-up */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-[#0b1c30]">
                  นัดติดตามครั้งถัดไป
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={nextDate}
                    onChange={e => setNextDate(e.target.value)}
                    className="h-8 px-2 rounded-lg bg-[#eff4ff] text-[11px] border border-[#c6c6cd]/40 text-[#0b1c30]"
                  />
                  <select
                    value={nextTime}
                    onChange={e => setNextTime(e.target.value)}
                    className="h-8 px-1.5 rounded-lg bg-[#eff4ff] text-[10px] border border-[#c6c6cd]/40 text-[#0b1c30]"
                  >
                    <option value="13:00 - 15:00 (Preferred)">13:00-15:00</option>
                    <option value="10:00 - 12:00">10:00-12:00</option>
                    <option value="16:00 - 18:00">16:00-18:00</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-black hover:bg-slate-800 text-white font-semibold text-[12px] flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span>บันทึกและอัปเดตสถานะ</span>
              </button>
            </form>
          </div>

          {/* Card: Unified CRM Timeline */}
          <div className="bg-white rounded-xl border border-[#c6c6cd]/40 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#c6c6cd]/30">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#45464d]">
                ไทม์ไลน์การติดต่อ
              </span>
              <span className="text-[11px] text-[#006a61] font-semibold">อัปเดตล่าสุด</span>
            </div>

            <div className="space-y-4">
              {patient.timeline.map((ev, idx) => (
                <div key={ev.id || idx} className="relative pl-6 pb-2 border-l border-[#c6c6cd]/40 last:border-l-0">
                  <div className={`absolute -left-2 top-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${ev.iconBg}`}>
                    <span className="material-symbols-outlined text-[10px]">{ev.icon}</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#0b1c30]">{ev.title}</span>
                      <span className="text-[10px] text-[#76777d]">{ev.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-[#45464d] mt-0.5 leading-snug">
                      {ev.description}
                    </p>
                    {ev.statusTag && (
                      <span className="inline-block mt-1 text-[10px] text-[#006a61] font-semibold">
                        {ev.statusTag}
                      </span>
                    )}
                    {ev.quote && (
                      <p className="mt-1 text-[11px] text-[#0b1c30] italic bg-[#eff4ff] p-2 rounded">
                        {ev.quote}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
