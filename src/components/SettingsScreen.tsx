import React, { useState } from 'react';

export const SettingsScreen: React.FC = () => {
  const [lineConnected, setLineConnected] = useState(true);
  const [autoRecallHours, setAutoRecallHours] = useState('13:00 - 15:00');
  const [rfmRecencyDays, setRfmRecencyDays] = useState(90);
  const [rfmMonetaryThreshold, setRfmMonetaryThreshold] = useState(100000);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-[24px] font-bold text-[#0b1c30] tracking-tight">
          ตั้งค่าระบบ CRM
        </h1>
        <p className="font-sans text-[14px] text-[#45464d] mt-0.5">
          เกณฑ์คะแนน RFM และการเชื่อมต่อ LINE Official Account
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-[#86f2e4]/30 border border-[#006a61]/30 rounded-xl text-[#006a61] text-[13px] font-semibold flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>บันทึกการตั้งค่าเรียบร้อยแล้ว</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* LINE OA Webhook Card */}
        <div className="bg-white rounded-xl border border-[#c6c6cd]/40 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#c6c6cd]/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#00b900]/10 text-[#00a000] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[22px]">chat</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-[15px] text-[#0b1c30]">
                  เชื่อมต่อ LINE Official Account
                </h3>
                <span className="text-[12px] text-[#45464d]">
                  รับ-ส่งข้อความผ่าน LINE Messaging API
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#00b900]/10 text-[#00a000] text-[11px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00b900] animate-pulse"></span>
              เชื่อมต่อแล้ว
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
            <div>
              <label className="block font-semibold text-[#0b1c30] mb-1">Channel Access Token</label>
              <input
                type="password"
                defaultValue="••••••••••••••••••••••••••••••••••••••••"
                readOnly
                className="w-full h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]/40 text-[#45464d] font-mono text-[12px]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#0b1c30] mb-1">ช่วงเวลาส่งข้อความอัตโนมัติ</label>
              <select
                value={autoRecallHours}
                onChange={e => setAutoRecallHours(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]/40 text-[#0b1c30] outline-none"
              >
                <option value="13:00 - 15:00">13:00 – 15:00 (อัตราเปิดอ่านสูงสุด)</option>
                <option value="11:00 - 13:00">11:00 – 13:00 (ช่วงพักกลางวัน)</option>
                <option value="16:00 - 18:00">16:00 – 18:00 (ช่วงก่อนเลิกงาน)</option>
              </select>
            </div>
          </div>
        </div>

        {/* RFM Mathematical Thresholds */}
        <div className="bg-white rounded-xl border border-[#c6c6cd]/40 p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-[#c6c6cd]/30">
            <h3 className="font-display font-bold text-[15px] text-[#0b1c30]">
              เกณฑ์การให้คะแนน RFM
            </h3>
            <span className="text-[12px] text-[#45464d]">
              ปรับเกณฑ์ที่ใช้แบ่งกลุ่ม Champions, Loyal VIPs และ At Risk
            </span>
          </div>

          <div className="space-y-4 text-[13px]">
            <div>
              <div className="flex justify-between mb-1">
                <label className="font-semibold text-[#0b1c30]">
                  เกณฑ์ Recency ({rfmRecencyDays} วัน)
                </label>
                <span className="font-mono text-[#ba1a1a] font-bold">
                  เกิน {rfmRecencyDays} วัน = At Risk
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="180"
                step="15"
                value={rfmRecencyDays}
                onChange={e => setRfmRecencyDays(Number(e.target.value))}
                className="w-full accent-[#006a61]"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="font-semibold text-[#0b1c30]">
                  เกณฑ์ยอดใช้จ่ายสูง (฿{rfmMonetaryThreshold.toLocaleString()})
                </label>
                <span className="font-mono text-[#006a61] font-bold">
                  ได้คะแนน Monetary 5/5
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="300000"
                step="25000"
                value={rfmMonetaryThreshold}
                onChange={e => setRfmMonetaryThreshold(Number(e.target.value))}
                className="w-full accent-[#006a61]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-black hover:bg-slate-800 text-white font-semibold text-[13px] rounded-lg flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>บันทึกการตั้งค่า</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
