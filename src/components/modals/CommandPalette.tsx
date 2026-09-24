import React, { useState, useEffect } from 'react';
import { Patient, ScreenType } from '../../types';
import { initials } from '../../lib/rfm';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  patients,
  onSelectPatient,
  onNavigate
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.nickname.toLowerCase().includes(query.toLowerCase()) ||
    p.hn.toLowerCase().includes(query.toLowerCase()) ||
    p.phone.includes(query) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-[#0b1c30]/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#c6c6cd]/50 overflow-hidden flex flex-col">
        {/* Search Input */}
        <div className="p-4 border-b border-[#c6c6cd]/30 flex items-center gap-3 bg-[#eff4ff]/50">
          <span className="material-symbols-outlined text-[22px] text-[#006a61]">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="ค้นหาชื่อคนไข้, HN, เบอร์โทร หรือกลุ่ม..."
            className="flex-1 bg-transparent text-[14px] text-[#0b1c30] outline-none placeholder:text-[#76777d]"
          />
          <kbd className="px-2 py-0.5 rounded bg-white border border-[#c6c6cd] text-[11px] font-mono text-[#45464d]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {/* Quick Navigation Links */}
          {!query && (
            <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#76777d]">
              ไปที่หน้า
            </div>
          )}
          {!query && (
            <>
              <button
                onClick={() => {
                  onNavigate('todays-queue');
                  onClose();
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#eff4ff] flex items-center justify-between text-[13px] text-[#0b1c30]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-[#006a61]">view_timeline</span>
                  <span>คิวติดตามวันนี้</span>
                </div>
                <span className="text-[11px] text-[#76777d]">{patients.filter(p => p.priorityLevel === 'Critical' || p.priorityLevel === 'High').length} ราย</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('patients');
                  onClose();
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#eff4ff] flex items-center justify-between text-[13px] text-[#0b1c30]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-[#006a61]">person_search</span>
                  <span>ฐานข้อมูลคนไข้ & กลุ่ม RFM</span>
                </div>
                <span className="text-[11px] text-[#76777d]">{patients.length.toLocaleString()} ราย</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('analytics');
                  onClose();
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#eff4ff] flex items-center justify-between text-[13px] text-[#0b1c30]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-[#006a61]">insights</span>
                  <span>ภาพรวมการกลับมาใช้บริการ & รายได้</span>
                </div>
                <span className="text-[11px] text-[#76777d]">รายงานเดือนนี้</span>
              </button>
            </>
          )}

          {/* Patients Header */}
          <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#76777d]">
            รายชื่อคนไข้
          </div>

          {filteredPatients.length === 0 ? (
            <div className="p-6 text-center text-[#76777d] text-[13px]">
              ไม่พบคนไข้ที่ตรงกับ "{query}"
            </div>
          ) : (
            filteredPatients.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  onSelectPatient(p);
                  onNavigate('patient-detail');
                  onClose();
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-[#eff4ff] flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#dce9ff] flex items-center justify-center font-bold text-[12px] text-[#006a61]">
                    {initials(p.name)}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#0b1c30] group-hover:text-[#006a61] transition-colors flex items-center gap-1.5">
                      <span>{p.name}</span>
                      <span className="text-[11px] text-[#45464d] font-normal">{p.nickname && `(${p.nickname})`}</span>
                    </div>
                    <div className="text-[11px] text-[#76777d] flex items-center gap-1.5">
                      <span className="font-mono text-[#006a61] font-semibold">HN: {p.hn}</span>
                      <span>•</span>
                      <span>{p.category}</span>
                      <span>•</span>
                      <span>{p.priorityReason}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[12px] font-bold text-[#0b1c30]">
                    ฿{(p.lifetimeValue).toLocaleString()} LTV
                  </span>
                  <span className="block text-[10px] text-[#76777d]">
                    คะแนน: {p.priorityScore}/100
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
