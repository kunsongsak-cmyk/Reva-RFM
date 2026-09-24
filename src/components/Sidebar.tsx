import React from 'react';
import { ScreenType, PatientCategory, Patient } from '../types';
import { isDueSoon, isOverdue, needsFollowUp } from '../lib/rfm';
import revaLogo from '../assets/reva-logo.png';

interface SidebarProps {
  patients: Patient[];
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType, categoryFilter?: PatientCategory) => void;
  selectedCategory?: PatientCategory;
}

export const Sidebar: React.FC<SidebarProps> = ({
  patients,
  currentScreen,
  onNavigate,
  selectedCategory
}) => {
  const countOf = (c: PatientCategory) => patients.filter(p => p.category === c).length;
  const queueCount = patients.filter(needsFollowUp).length;
  const overdueCount = patients.filter(isOverdue).length;
  const upcomingCount = patients.filter(p => !isOverdue(p) && isDueSoon(p, 30)).length;

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-white border-r border-[#c6c6cd]/40 z-50 flex flex-col justify-between select-none">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div 
          onClick={() => onNavigate('todays-queue')}
          className="h-16 px-6 flex items-center gap-3 border-b border-[#c6c6cd]/30 cursor-pointer hover:bg-slate-50/60 transition-colors"
        >
          <img src={revaLogo} alt="Reva Aesthetic Clinic" className="h-10 w-auto" />
          <span className="ml-auto px-2 py-0.5 rounded-md bg-[#124e91]/10 text-[#124e91] font-sans text-[11px] font-bold tracking-widest">
            CRM
          </span>
        </div>

        {/* Navigation Sections */}
        <div className="px-4 py-3">
          {/* Section 1: Clinical Operations */}
          <div className="px-2 py-1 font-sans text-[11px] font-medium text-[#45464d] uppercase tracking-wider">
            งานประจำวัน
          </div>
          <nav className="space-y-1 mt-1">
            {/* Today's Queue */}
            <button
              onClick={() => onNavigate('todays-queue')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left ${
                currentScreen === 'todays-queue'
                  ? 'bg-[#131b2e] text-white font-semibold shadow-xs'
                  : 'text-[#45464d] hover:bg-[#e5eeff]/60 hover:text-[#0b1c30]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">view_timeline</span>
                <span className="text-[14px]">คิวติดตามวันนี้</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                currentScreen === 'todays-queue'
                  ? 'bg-[#006a61] text-white'
                  : 'bg-[#006a61] text-white'
              }`}>
                {queueCount}
              </span>
            </button>

            {/* Patients Master View */}
            <button
              onClick={() => onNavigate('patients')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left ${
                currentScreen === 'patients' && !selectedCategory
                  ? 'bg-[#131b2e] text-white font-semibold shadow-xs'
                  : 'text-[#45464d] hover:bg-[#e5eeff]/60 hover:text-[#0b1c30]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">person_search</span>
                <span className="text-[14px]">คนไข้ทั้งหมด</span>
              </div>
            </button>

            {/* Sub-cohorts */}
            <div className="pl-7 pr-1 py-1 space-y-0.5">
              <button
                onClick={() => onNavigate('patients', 'Champions')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-[13px] transition-colors ${
                  currentScreen === 'patients' && selectedCategory === 'Champions'
                    ? 'bg-[#dce9ff] text-[#0b1c30] font-semibold'
                    : 'text-[#45464d] hover:bg-[#e5eeff]/60 hover:text-[#0b1c30]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006a61]"></span>
                  Champions
                </span>
                <span className="text-[11px] font-medium text-[#45464d]">{countOf('Champions')}</span>
              </button>

              <button
                onClick={() => onNavigate('patients', 'Loyal VIPs')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-[13px] transition-colors ${
                  currentScreen === 'patients' && selectedCategory === 'Loyal VIPs'
                    ? 'bg-[#dce9ff] text-[#0b1c30] font-semibold'
                    : 'text-[#45464d] hover:bg-[#e5eeff]/60 hover:text-[#0b1c30]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#565e74]"></span>
                  Loyal VIPs
                </span>
                <span className="text-[11px] font-medium text-[#45464d]">{countOf('Loyal VIPs')}</span>
              </button>

              <button
                onClick={() => onNavigate('patients', 'At Risk')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-[13px] transition-colors ${
                  currentScreen === 'patients' && selectedCategory === 'At Risk'
                    ? 'bg-[#ffdad6] text-[#93000a] font-semibold'
                    : 'text-[#45464d] hover:bg-[#e5eeff]/60 hover:text-[#0b1c30]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c76c00]"></span>
                  At Risk
                </span>
                <span className="text-[11px] font-semibold text-[#ba1a1a]">{countOf('At Risk')}</span>
              </button>

              <button
                onClick={() => onNavigate('patients', 'Lost / Inactive')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-[13px] transition-colors ${
                  currentScreen === 'patients' && selectedCategory === 'Lost / Inactive'
                    ? 'bg-[#dce9ff] text-[#0b1c30] font-semibold'
                    : 'text-[#45464d] hover:bg-[#e5eeff]/60 hover:text-[#0b1c30]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#76777d]"></span>
                  Lost / Inactive
                </span>
                <span className="text-[11px] font-medium text-[#45464d]">{countOf('Lost / Inactive')}</span>
              </button>
            </div>

            {/* Follow-up Section */}
            <div className="pt-1">
              <button
                onClick={() => onNavigate('todays-queue')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left ${
                  currentScreen === 'todays-queue'
                    ? 'text-[#0b1c30] font-medium'
                    : 'text-[#45464d] hover:bg-[#e5eeff]/60 hover:text-[#0b1c30]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">event_repeat</span>
                  <span className="text-[14px]">ติดตามคนไข้</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[11px] font-semibold">
                  {overdueCount}
                </span>
              </button>

              <div className="pl-7 pr-1 py-1 space-y-0.5">
                <button
                  onClick={() => onNavigate('todays-queue')}
                  className="w-full flex items-center justify-between px-2.5 py-1 rounded text-[13px] text-[#45464d] hover:bg-[#e5eeff]/60 hover:text-[#0b1c30]"
                >
                  <span>ต้องติดตามด่วน</span>
                  <span className="text-[11px] font-semibold text-[#006a61]">{queueCount}</span>
                </button>
                <button
                  onClick={() => onNavigate('todays-queue')}
                  className="w-full flex items-center justify-between px-2.5 py-1 rounded text-[13px] text-[#45464d] hover:bg-[#e5eeff]/60 hover:text-[#0b1c30]"
                >
                  <span>เลยกำหนดนัด</span>
                  <span className="text-[11px] font-semibold text-[#ba1a1a]">{overdueCount}</span>
                </button>
                <button
                  onClick={() => onNavigate('todays-queue')}
                  className="w-full flex items-center justify-between px-2.5 py-1 rounded text-[13px] text-[#45464d] hover:bg-[#e5eeff]/60 hover:text-[#0b1c30]"
                >
                  <span>ใกล้ถึงรอบ</span>
                  <span className="text-[11px] text-[#45464d]">{upcomingCount}</span>
                </button>
              </div>
            </div>

            {/* Treatment Cycles Engine */}
            <button
              onClick={() => onNavigate('treatment-cycles')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left ${
                currentScreen === 'treatment-cycles'
                  ? 'bg-[#131b2e] text-white font-semibold shadow-xs'
                  : 'text-[#45464d] hover:bg-[#e5eeff]/60 hover:text-[#0b1c30]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">vital_signs</span>
                <span className="text-[14px]">รอบ Treatment</span>
              </div>
            </button>
          </nav>

          {/* Section 2: Retention Intelligence */}
          <div className="mt-4 pt-3 border-t border-[#c6c6cd]/30">
            <div className="px-2 py-1 font-sans text-[11px] font-medium text-[#45464d] uppercase tracking-wider">
              วิเคราะห์การกลับมาใช้บริการ
            </div>
            <nav className="space-y-1 mt-1">
              <button
                onClick={() => onNavigate('analytics')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left ${
                  currentScreen === 'analytics'
                    ? 'bg-[#131b2e] text-white font-semibold shadow-xs'
                    : 'text-[#45464d] hover:bg-[#e5eeff]/60 hover:text-[#0b1c30]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">insights</span>
                  <span className="text-[14px]">รายงานวิเคราะห์</span>
                </div>
              </button>

              <div className="pl-7 pr-1 py-1 space-y-0.5">
                <button
                  onClick={() => onNavigate('analytics')}
                  className="w-full text-left px-2.5 py-1 rounded text-[13px] text-[#45464d] hover:bg-[#e5eeff]/60 hover:text-[#0b1c30]"
                >
                  RFM & Retention
                </button>
                <button
                  onClick={() => onNavigate('analytics')}
                  className="w-full text-left px-2.5 py-1 rounded text-[13px] text-[#45464d] hover:bg-[#e5eeff]/60 hover:text-[#0b1c30]"
                >
                  ผลงานทีมขาย
                </button>
              </div>

              {/* Settings */}
              <button
                onClick={() => onNavigate('settings')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left ${
                  currentScreen === 'settings'
                    ? 'bg-[#131b2e] text-white font-semibold shadow-xs'
                    : 'text-[#45464d] hover:bg-[#e5eeff]/60 hover:text-[#0b1c30]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                  <span className="text-[14px]">ตั้งค่า</span>
                </div>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Status Card */}
      <div className="p-4 border-t border-[#c6c6cd]/30 bg-[#eff4ff]">
        <div className="p-2.5 rounded-lg bg-white border border-[#c6c6cd]/40 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#006a61] animate-pulse"></span>
            <span className="font-sans text-[11px] font-semibold text-[#0b1c30]">
              ระบบ CRM ทำงานอยู่
            </span>
          </div>
          <span className="font-sans text-[11px] text-[#45464d] font-mono">
            v4.8
          </span>
        </div>
      </div>
    </aside>
  );
};
