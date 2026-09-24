import React, { useState } from 'react';
import { Patient, PatientCategory, ScreenType } from '../types';

interface PatientsScreenProps {
  patients: Patient[];
  selectedCategory?: PatientCategory;
  onSelectPatient: (patient: Patient) => void;
  onNavigate: (screen: ScreenType) => void;
  onOpenNewPatientModal: () => void;
  onOpenBroadcastModal: (cohort: string, count: number) => void;
  onOpenLineChat: (patient: Patient) => void;
}

export const PatientsScreen: React.FC<PatientsScreenProps> = ({
  patients,
  selectedCategory,
  onSelectPatient,
  onNavigate,
  onOpenNewPatientModal,
  onOpenBroadcastModal,
  onOpenLineChat
}) => {
  const [activeSegment, setActiveSegment] = useState<PatientCategory>(selectedCategory || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [doctorFilter, setDoctorFilter] = useState('All');
  const [minSpend, setMinSpend] = useState(0);

  const segments: { label: PatientCategory; count: number; color?: string }[] = [
    { label: 'All', count: 1482 },
    { label: 'Champions', count: 182, color: 'text-[#006a61]' },
    { label: 'Loyal VIPs', count: 328, color: 'text-[#565e74]' },
    { label: 'New Patients', count: 192, color: 'text-[#0b1c30]' },
    { label: 'Need Attention', count: 264, color: 'text-[#c76c00]' },
    { label: 'At Risk', count: 286, color: 'text-[#ba1a1a]' },
    { label: 'Lost / Inactive', count: 230, color: 'text-[#76777d]' }
  ];

  const filteredPatients = patients.filter(p => {
    if (activeSegment !== 'All' && p.category !== activeSegment) return false;
    if (doctorFilter !== 'All' && p.attendingDoctor !== doctorFilter) return false;
    if (minSpend > 0 && p.lifetimeValue < minSpend) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.nickname.toLowerCase().includes(q) ||
        p.hn.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.attendingDoctor.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredPatients.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleExportCSV = () => {
    const csvHeader = 'HN,Name,Nickname,Age,Gender,Phone,Category,LTV,LastVisit,Doctor\n';
    const csvRows = filteredPatients
      .map(p => `"${p.hn}","${p.name}","${p.nickname}",${p.age},"${p.gender}","${p.phone}","${p.category}",${p.lifetimeValue},"${p.lastVisitDate}","${p.attendingDoctor}"`)
      .join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Aura_Patients_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Screen Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[24px] font-bold text-[#0b1c30] tracking-tight">
            Patient Database & Segment Intelligence
          </h1>
          <p className="font-['Inter'] text-[14px] text-[#45464d] mt-0.5">
            1,482 Registered VIP Dossiers • Segmented by Clinical RFM Efficacy & Lifetime Value
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onOpenBroadcastModal(activeSegment, filteredPatients.length)}
            className="px-3.5 py-2 bg-white border border-[#c6c6cd]/50 hover:bg-[#eff4ff] text-[#006a61] text-[13px] font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">campaign</span>
            <span>Broadcast Cohort</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white border border-[#c6c6cd]/50 hover:bg-[#eff4ff] text-[#0b1c30] text-[13px] font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenNewPatientModal}
            className="px-4 py-2 bg-black hover:bg-slate-800 text-white text-[13px] font-semibold rounded-lg flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New Patient Intake</span>
          </button>
        </div>
      </div>

      {/* Segment Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#c6c6cd]/30 scrollbar-none">
        {segments.map(seg => (
          <button
            key={seg.label}
            onClick={() => setActiveSegment(seg.label)}
            className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeSegment === seg.label
                ? 'bg-[#131b2e] text-white shadow-xs'
                : 'text-[#45464d] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
            }`}
          >
            <span>{seg.label === 'All' ? 'All Patients' : seg.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[11px] ${
              activeSegment === seg.label
                ? 'bg-white/20 text-white'
                : 'bg-[#eff4ff] text-[#45464d]'
            }`}>
              {seg.count.toLocaleString()}
            </span>
          </button>
        ))}
      </div>

      {/* Search, Filter bar & Batch Action */}
      <div className="bg-white rounded-xl border border-[#c6c6cd]/40 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#76777d]">
              search
            </span>
            <input
              type="text"
              placeholder="Search by Name, HN, Nickname, Phone, Doctor, or Tag..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#eff4ff] border border-transparent focus:border-[#006a61] focus:bg-white text-[13px] text-[#0b1c30] placeholder:text-[#76777d] outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-3 py-2 rounded-lg border text-[13px] font-semibold flex items-center gap-1.5 transition-colors ${
                showAdvancedFilters
                  ? 'bg-[#dce9ff] border-[#006a61] text-[#006a61]'
                  : 'bg-white border-[#c6c6cd]/50 text-[#0b1c30] hover:bg-[#eff4ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>Filter Matrix</span>
            </button>

            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 animate-in fade-in">
                <span className="text-[12px] font-semibold text-[#006a61] bg-[#86f2e4]/30 px-2.5 py-1 rounded-lg">
                  {selectedIds.length} Selected
                </span>
                <button
                  onClick={() => onOpenBroadcastModal(`${selectedIds.length} Selected Patients`, selectedIds.length)}
                  className="px-3 py-1.5 rounded-lg bg-[#00b900] text-white text-[12px] font-semibold hover:bg-[#00a000] flex items-center gap-1 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>Batch LINE</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Collapsible Advanced Filters Drawer */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-[#c6c6cd]/30 grid grid-cols-1 sm:grid-cols-3 gap-4 text-[12px] animate-in slide-in-from-top-2 duration-150">
            <div>
              <label className="block font-semibold text-[#0b1c30] mb-1">Attending Specialist Doctor</label>
              <select
                value={doctorFilter}
                onChange={e => setDoctorFilter(e.target.value)}
                className="w-full h-9 px-2 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]/40 text-[#0b1c30] outline-none"
              >
                <option value="All">All Specialist Doctors</option>
                <option value="Dr. Kornvipa">Dr. Kornvipa (Dermatology & Laser)</option>
                <option value="Dr. Vorapat">Dr. Vorapat (Plastic Surgery)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#0b1c30] mb-1">
                Minimum LTV (฿{minSpend.toLocaleString()})
              </label>
              <input
                type="range"
                min="0"
                max="250000"
                step="25000"
                value={minSpend}
                onChange={e => setMinSpend(Number(e.target.value))}
                className="w-full accent-[#006a61]"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setDoctorFilter('All');
                  setMinSpend(0);
                  setSearchQuery('');
                }}
                className="text-[12px] text-[#ba1a1a] hover:underline font-semibold"
              >
                Reset All Filter Parameters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Patients Table */}
      <div className="bg-white rounded-xl border border-[#c6c6cd]/40 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#c6c6cd]/30 bg-[#eff4ff]/60 text-[11px] font-semibold text-[#45464d] uppercase tracking-wider">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredPatients.length && filteredPatients.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-[#c6c6cd] text-[#006a61] focus:ring-0"
                  />
                </th>
                <th className="py-3 px-4">Patient & Identifier</th>
                <th className="py-3 px-3">RFM Segment & Score</th>
                <th className="py-3 px-3">Lifetime Value (LTV)</th>
                <th className="py-3 px-3">Last Visit & Recency</th>
                <th className="py-3 px-3">Active Protocol & Decay</th>
                <th className="py-3 px-3">Preferred Channel</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c6c6cd]/25 text-[13px]">
              {filteredPatients.map(p => {
                const isChecked = selectedIds.includes(p.id);
                return (
                  <tr
                    key={p.id}
                    onClick={() => {
                      onSelectPatient(p);
                      onNavigate('patient-detail');
                    }}
                    className={`cursor-pointer transition-colors ${
                      isChecked ? 'bg-[#eff4ff]' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleSelectOne(p.id)}
                        className="rounded border-[#c6c6cd] text-[#006a61] focus:ring-0"
                      />
                    </td>

                    {/* Patient & Identifier */}
                    <td className="py-3.5 px-4">
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
                            {p.name.slice(5, 7) || 'VIP'}
                          </div>
                        )}
                        <div>
                          <div className="font-['Plus_Jakarta_Sans'] font-semibold text-[#0b1c30] flex items-center gap-1.5 leading-snug">
                            <span>{p.name}</span>
                            <span className="text-[11px] font-normal text-[#45464d]">
                              ({p.nickname})
                            </span>
                          </div>
                          <div className="text-[11px] text-[#45464d] flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-[#006a61] font-semibold">HN: {p.hn}</span>
                            <span>•</span>
                            <span>{p.age}y</span>
                            <span>•</span>
                            <span>{p.gender}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* RFM Segment */}
                    <td className="py-3.5 px-3">
                      <div>
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          p.category === 'At Risk'
                            ? 'bg-[#ffdad6] text-[#ba1a1a]'
                            : p.category === 'Champions'
                            ? 'bg-[#86f2e4]/40 text-[#006a61]'
                            : p.category === 'Loyal VIPs'
                            ? 'bg-[#e5eeff] text-[#0b1c30]'
                            : 'bg-slate-100 text-[#45464d]'
                        }`}>
                          {p.category}
                        </span>
                        <div className="text-[10px] text-[#76777d] mt-1 font-mono">
                          RFM: {p.rfmScore.recencyScore}-{p.rfmScore.frequencyScore}-{p.rfmScore.monetaryScore}
                        </div>
                      </div>
                    </td>

                    {/* LTV */}
                    <td className="py-3.5 px-3">
                      <div>
                        <span className="font-['Plus_Jakarta_Sans'] font-bold text-[#0b1c30]">
                          ฿{(p.lifetimeValue).toLocaleString()}
                        </span>
                        <div className="text-[11px] text-[#45464d]">
                          12M: ฿{(p.trailing12M).toLocaleString()}
                        </div>
                      </div>
                    </td>

                    {/* Last Visit */}
                    <td className="py-3.5 px-3">
                      <div>
                        <span className="font-medium text-[#0b1c30]">{p.lastVisitDate}</span>
                        <div className="text-[11px] text-[#ba1a1a] font-medium">
                          {p.lastVisitRecencyDays}d ago
                        </div>
                      </div>
                    </td>

                    {/* Active Protocol */}
                    <td className="py-3.5 px-3">
                      <div>
                        <span className="font-semibold text-[#0b1c30] text-[12px] flex items-center gap-1">
                          {p.priorityReason}
                        </span>
                        <span className="text-[11px] text-[#45464d]">
                          Doctor: {p.attendingDoctor.replace('Dr. ', '')}
                        </span>
                      </div>
                    </td>

                    {/* Preferred Channel */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1 text-[12px] text-[#00b900] font-semibold">
                        <span className="material-symbols-outlined text-[16px]">chat</span>
                        <span>{p.lineId}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenLineChat(p)}
                          title="LINE OA Message"
                          className="w-8 h-8 rounded-lg bg-[#00b900]/10 hover:bg-[#00b900]/20 text-[#00a000] flex items-center justify-center transition-colors"
                        >
                          <span className="material-symbols-outlined text-[17px]">chat</span>
                        </button>

                        <button
                          onClick={() => {
                            onSelectPatient(p);
                            onNavigate('patient-detail');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-[#131b2e] hover:bg-black text-white text-[11px] font-semibold flex items-center gap-1 transition-transform active:scale-95 shadow-xs"
                        >
                          <span>Dossier</span>
                          <span className="material-symbols-outlined text-[14px]">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table footer pagination */}
        <div className="p-4 border-t border-[#c6c6cd]/30 bg-[#eff4ff]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#45464d]">
          <span>Showing 1–{filteredPatients.length} of 1,482 Patients</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded border border-[#c6c6cd]/40 bg-white hover:bg-slate-50 text-[#0b1c30] font-medium disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 rounded bg-[#131b2e] text-white font-semibold">
              1
            </button>
            <button className="px-3 py-1 rounded border border-[#c6c6cd]/40 bg-white hover:bg-slate-50 text-[#0b1c30]">
              2
            </button>
            <button className="px-3 py-1 rounded border border-[#c6c6cd]/40 bg-white hover:bg-slate-50 text-[#0b1c30]">
              3
            </button>
            <span className="px-1 text-[#76777d]">...</span>
            <button className="px-3 py-1 rounded border border-[#c6c6cd]/40 bg-white hover:bg-slate-50 text-[#0b1c30]">
              149
            </button>
            <button className="px-2.5 py-1 rounded border border-[#c6c6cd]/40 bg-white hover:bg-slate-50 text-[#0b1c30] font-medium">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
