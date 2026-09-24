import React, { useState } from 'react';
import { Patient } from '../../types';

interface OutcomeModalProps {
  patient: Patient;
  onClose: () => void;
  onSaved: (outcome: {
    channel: string;
    outcomeText: string;
    notes: string;
    nextDate: string;
    nextTime: string;
  }) => void;
}

export const OutcomeModal: React.FC<OutcomeModalProps> = ({
  patient,
  onClose,
  onSaved
}) => {
  const [channel, setChannel] = useState<'line' | 'phone' | 'whatsapp' | 'walkin'>('line');
  const [outcomeText, setOutcomeText] = useState('สนใจ ทำ Treatment ต่อ');
  const [notes, setNotes] = useState('');
  const [nextDate, setNextDate] = useState('2026-09-28');
  const [nextTime, setNextTime] = useState('13:00 - 15:00 (Preferred)');

  const outcomeOptions = [
    'สนใจ ทำ Treatment ต่อ',
    'ให้ติดต่อกลับภายหลัง',
    'ไม่ตอบกลับ',
    'จองนัดแล้ว',
    'ไม่สนใจ'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaved({
      channel,
      outcomeText,
      notes,
      nextDate,
      nextTime
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1c30]/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#c6c6cd]/50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#c6c6cd]/30 flex items-center justify-between bg-[#eff4ff]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#131b2e] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">rate_review</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-[16px] text-[#0b1c30]">
                  บันทึกผลการติดตาม
                </h3>
                <span className="px-2 py-0.5 rounded bg-black text-white text-[10px] font-semibold">
                  บันทึกทันที
                </span>
              </div>
              <p className="text-[12px] text-[#45464d]">
                คนไข้: {patient.name} {patient.nickname && `(${patient.nickname})`} • HN: {patient.hn}
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

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Channel */}
          <div>
            <label className="block text-[12px] font-semibold text-[#0b1c30] mb-1.5">
              ช่องทางที่ติดต่อ
            </label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-[#eff4ff] rounded-lg text-center text-[12px]">
              <button
                type="button"
                onClick={() => setChannel('line')}
                className={`py-1.5 rounded transition-all flex items-center justify-center gap-1 font-semibold ${
                  channel === 'line'
                    ? 'bg-white text-[#006a61] shadow-xs'
                    : 'text-[#45464d] hover:text-[#0b1c30]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">chat</span>
                LINE OA
              </button>

              <button
                type="button"
                onClick={() => setChannel('phone')}
                className={`py-1.5 rounded transition-all flex items-center justify-center gap-1 font-semibold ${
                  channel === 'phone'
                    ? 'bg-white text-[#006a61] shadow-xs'
                    : 'text-[#45464d] hover:text-[#0b1c30]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">call</span>
                โทรศัพท์
              </button>

              <button
                type="button"
                onClick={() => setChannel('whatsapp')}
                className={`py-1.5 rounded transition-all flex items-center justify-center gap-1 font-semibold ${
                  channel === 'whatsapp'
                    ? 'bg-white text-[#006a61] shadow-xs'
                    : 'text-[#45464d] hover:text-[#0b1c30]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">sms</span>
                WhatsApp
              </button>

              <button
                type="button"
                onClick={() => setChannel('walkin')}
                className={`py-1.5 rounded transition-all flex items-center justify-center gap-1 font-semibold ${
                  channel === 'walkin'
                    ? 'bg-white text-[#006a61] shadow-xs'
                    : 'text-[#45464d] hover:text-[#0b1c30]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">storefront</span>
                Walk-in
              </button>
            </div>
          </div>

          {/* Outcome Pills */}
          <div>
            <label className="block text-[12px] font-semibold text-[#0b1c30] mb-1.5">
              ผลการติดต่อ
            </label>
            <div className="flex flex-wrap gap-2">
              {outcomeOptions.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setOutcomeText(opt)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all flex items-center gap-1 ${
                    outcomeText === opt
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30]'
                  }`}
                >
                  {outcomeText === opt && (
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  )}
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Smart Notice */}
          <div className="p-3 rounded-lg bg-[#eff4ff] flex items-start gap-2 text-[12px]">
            <span className="material-symbols-outlined text-[#006a61] text-[18px] shrink-0 mt-0.5">psychology</span>
            <p className="text-[#45464d] leading-relaxed">
              <strong className="text-[#0b1c30]">คำแนะนำ:</strong> ถ้าคนไข้ <span className="font-semibold text-[#006a61]">"สนใจ"</span> ให้จองนัดต่อได้ทันที ถ้าเลือก <span className="font-semibold text-[#0b1c30]">"ให้ติดต่อกลับภายหลัง"</span> อย่าลืมกำหนดวันติดตามครั้งถัดไป
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[12px] font-semibold text-[#0b1c30] mb-1">
              บันทึกเพิ่มเติม
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full rounded-lg bg-[#eff4ff] p-3 text-[13px] text-[#0b1c30] placeholder:text-[#76777d] outline-none focus:bg-white focus:ring-1 focus:ring-[#006a61] border border-transparent focus:border-[#006a61] transition-all"
              placeholder="บันทึกสิ่งที่คุยกัน ข้อกังวล หรือความต้องการของคนไข้..."
            />
          </div>

          {/* Next milestone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[#45464d] mb-1">
                วันติดตามครั้งถัดไป
              </label>
              <input
                type="date"
                value={nextDate}
                onChange={e => setNextDate(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]/40 text-[13px] text-[#0b1c30] outline-none focus:border-[#006a61]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#45464d] mb-1">
                ช่วงเวลา
              </label>
              <select
                value={nextTime}
                onChange={e => setNextTime(e.target.value)}
                className="w-full h-10 px-2 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]/40 text-[12px] text-[#0b1c30] outline-none focus:border-[#006a61]"
              >
                <option value="13:00 - 15:00 (Preferred)">13:00 - 15:00 (แนะนำ)</option>
                <option value="10:00 - 12:00 (Morning)">10:00 - 12:00 (ช่วงเช้า)</option>
                <option value="16:00 - 18:00 (Evening)">16:00 - 18:00 (ช่วงเย็น)</option>
              </select>
            </div>
          </div>

          {/* Action */}
          <button
            type="submit"
            className="w-full h-11 rounded-lg bg-black hover:bg-slate-900 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-transform active:scale-[0.99] shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>บันทึกและอัปเดตสถานะ</span>
          </button>
        </form>
      </div>
    </div>
  );
};
