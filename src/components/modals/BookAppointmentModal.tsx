import React, { useState } from 'react';
import { Patient } from '../../types';

interface BookAppointmentModalProps {
  patient: Patient;
  onClose: () => void;
  onBookConfirmed: (details: { procedure: string; doctor: string; date: string; time: string }) => void;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  patient,
  onClose,
  onBookConfirmed
}) => {
  const [selectedProcedure, setSelectedProcedure] = useState('Program Oligio X (600 Shots) - ฿49,900');
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Kornvipa (Dermatology & Laser)');
  const [selectedDate, setSelectedDate] = useState('2026-09-28');
  const [selectedTime, setSelectedTime] = useState('14:00 - 15:30');

  const procedures = [
    'Program Oligio X (600 Shots) - ฿49,900',
    'Ultraformer MPT (SMAS Tightening 400 Shots) - ฿35,000',
    'Botox Allergan 100u (Jawline + Forehead) - ฿15,900',
    'Rejuran Healer PN Skin Rejuvenation - ฿14,900',
    'Program Pico Discovery Laser (Full Face) - ฿18,000'
  ];

  const doctors = [
    'Dr. Kornvipa (Dermatology & Laser)',
    'Dr. Vorapat (Plastic Surgery & Aesthetic Medicine)'
  ];

  const times = [
    '10:30 - 12:00',
    '13:00 - 14:30',
    '14:00 - 15:30',
    '16:00 - 17:30',
    '18:00 - 19:30'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBookConfirmed({
      procedure: selectedProcedure,
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1c30]/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#c6c6cd]/50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#c6c6cd]/30 flex items-center justify-between bg-[#eff4ff]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#006a61] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">event_available</span>
            </div>
            <div>
              <h3 className="font-display font-semibold text-[16px] text-[#0b1c30]">
                จองนัดหัตถการ
              </h3>
              <p className="text-[12px] text-[#45464d]">
                คนไข้: {patient.name} ({patient.nickname}) • HN: {patient.hn}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-[#0b1c30] mb-1">
              หัตถการ / แพ็กเกจ
            </label>
            <select
              value={selectedProcedure}
              onChange={e => setSelectedProcedure(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]/40 text-[13px] text-[#0b1c30] outline-none focus:border-[#006a61]"
            >
              {procedures.map((p, idx) => (
                <option key={idx} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#0b1c30] mb-1">
              แพทย์ผู้ทำหัตถการ
            </label>
            <select
              value={selectedDoctor}
              onChange={e => setSelectedDoctor(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]/40 text-[13px] text-[#0b1c30] outline-none focus:border-[#006a61]"
            >
              {doctors.map((d, idx) => (
                <option key={idx} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#0b1c30] mb-1">
                วันที่นัด
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]/40 text-[13px] text-[#0b1c30] outline-none focus:border-[#006a61]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#0b1c30] mb-1">
                ช่วงเวลา
              </label>
              <select
                value={selectedTime}
                onChange={e => setSelectedTime(e.target.value)}
                className="w-full h-10 px-2 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]/40 text-[12px] text-[#0b1c30] outline-none focus:border-[#006a61]"
              >
                {times.map((t, idx) => (
                  <option key={idx} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#e5eeff] text-[#0b1c30] text-[12px] flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#006a61] shrink-0 mt-0.5">verified_user</span>
            <span>
              การจองจะล็อกห้องหัตถการและเครื่องมือในช่วงเวลาที่เลือก
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[13px] rounded-lg text-[#45464d] hover:bg-slate-100"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black hover:bg-slate-800 text-white font-semibold text-[13px] rounded-lg flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>ยืนยันการจอง</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
