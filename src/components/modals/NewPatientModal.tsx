import React, { useState } from 'react';
import { PatientRecord } from '../../types';

interface NewPatientModalProps {
  onClose: () => void;
  onPatientAdded: (patient: Partial<PatientRecord>) => void;
}

export const NewPatientModal: React.FC<NewPatientModalProps> = ({
  onClose,
  onPatientAdded
}) => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState(32);
  const [gender, setGender] = useState('Female');
  const [phone, setPhone] = useState('+66 8');
  const [lineId, setLineId] = useState('@');
  const [primaryInterest, setPrimaryInterest] = useState('Lifting & Tightening (Oligio X / Ulthera)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newHn = `RV0${Math.floor(10000 + Math.random() * 90000)}`;
    onPatientAdded({
      hn: newHn,
      name,
      nickname: nickname ? `คุณ${nickname}` : 'คุณลูกค้า',
      age: Number(age) || 30,
      gender,
      nationality: 'Thai',
      phone,
      lineId,
      lineConnected: true,
      salesOwner: 'Khun May',
      salesOwnerRole: 'Senior Consultant',
      attendingDoctor: 'Dr. Kornvipa',
      doctorSpecialty: 'Dermatology & Laser',
      branch: 'Thonglor Flagship',
      tier: 'คนไข้ใหม่',
      signals: [
        {
          title: 'คนไข้ใหม่',
          description: `สนใจ: ${primaryInterest}`,
          icon: 'spa',
          iconColor: 'text-secondary'
        }
      ],
      recommendedProposal: {
        title: `${primaryInterest} - ปรึกษาแพทย์และวิเคราะห์ผิว`,
        subtitle: 'รวมสแกนผิวด้วย VISIA',
        offerAttached: true
      },
      treatments: [],
      timeline: [
        {
          id: `ev-${Date.now()}`,
          title: 'ลงทะเบียนคนไข้ใหม่',
          timestamp: 'วันนี้ เมื่อสักครู่',
          icon: 'person_add',
          iconBg: 'bg-secondary text-white',
          description: 'สร้างโปรไฟล์โดย คุณ May ที่เคาน์เตอร์ต้อนรับ'
        }
      ]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1c30]/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#c6c6cd]/50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#c6c6cd]/30 flex items-center justify-between bg-[#eff4ff]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">person_add</span>
            </div>
            <div>
              <h3 className="font-display font-semibold text-[16px] text-[#0b1c30]">
                ลงทะเบียนคนไข้ใหม่
              </h3>
              <p className="text-[12px] text-[#45464d]">
                Reva Clinic • เคาน์เตอร์ต้อนรับ
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
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#0b1c30] mb-1">
                ชื่อ-นามสกุล *
              </label>
              <input
                type="text"
                required
                placeholder="เช่น Khun Nattaporn W."
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]/40 text-[13px] text-[#0b1c30] outline-none focus:border-[#006a61]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#0b1c30] mb-1">
                ชื่อเล่น
              </label>
              <input
                type="text"
                placeholder="เช่น แนน"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]/40 text-[13px] text-[#0b1c30] outline-none focus:border-[#006a61]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#0b1c30] mb-1">
                อายุ
              </label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]/40 text-[13px] text-[#0b1c30] outline-none focus:border-[#006a61]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#0b1c30] mb-1">
                เพศ
              </label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]/40 text-[13px] text-[#0b1c30] outline-none focus:border-[#006a61]"
              >
                <option value="Female">หญิง</option>
                <option value="Male">ชาย</option>
                <option value="Non-binary">ไม่ระบุ</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#0b1c30] mb-1">
                เบอร์โทรศัพท์
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]/40 text-[13px] text-[#0b1c30] outline-none focus:border-[#006a61]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#0b1c30] mb-1">
                LINE ID
              </label>
              <input
                type="text"
                value={lineId}
                onChange={e => setLineId(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]/40 text-[13px] text-[#0b1c30] outline-none focus:border-[#006a61]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#0b1c30] mb-1">
              ปัญหาผิว / สิ่งที่สนใจ
            </label>
            <select
              value={primaryInterest}
              onChange={e => setPrimaryInterest(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]/40 text-[13px] text-[#0b1c30] outline-none focus:border-[#006a61]"
            >
              <option value="Lifting & Tightening (Oligio X / Ulthera)">Lifting & Tightening (Oligio X / Ulthera)</option>
              <option value="Botox & Neurotoxin Jawline Slimming">Botox & Neurotoxin Jawline Slimming</option>
              <option value="Skin Booster & Cellular Repair (Rejuran / PN)">Skin Booster & Cellular Repair (Rejuran / PN)</option>
              <option value="Pigmentation & Brightening (Pico Discovery)">Pigmentation & Brightening (Pico Discovery)</option>
              <option value="Facial Rebalancing & Fillers">Facial Rebalancing & Fillers</option>
            </select>
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
              className="px-4 py-2 bg-black hover:bg-slate-900 text-white font-semibold text-[13px] rounded-lg flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>ลงทะเบียน</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
