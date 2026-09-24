import React, { useState } from 'react';

interface WeeklyBriefModalProps {
  onClose: () => void;
}

export const WeeklyBriefModal: React.FC<WeeklyBriefModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('executive-board@auraprestige.clinic');
  const [day, setDay] = useState('Monday Morning 08:30');
  const [scheduled, setScheduled] = useState(false);

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduled(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1c30]/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#c6c6cd]/50 overflow-hidden flex flex-col">
        <div className="p-5 border-b border-[#c6c6cd]/30 flex items-center justify-between bg-[#eff4ff]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#006a61] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">mail</span>
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-[16px] text-[#0b1c30]">
                Schedule Executive Weekly Brief
              </h3>
              <p className="text-[12px] text-[#45464d]">
                Automated clinical retention report delivery
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

        {scheduled ? (
          <div className="p-8 text-center space-y-2">
            <span className="material-symbols-outlined text-[40px] text-[#006a61]">check_circle</span>
            <h4 className="text-[15px] font-bold text-[#0b1c30]">Schedule Confirmed</h4>
            <p className="text-[12px] text-[#45464d]">
              Executive PDF synthesis will be dispatched every {day} to {email}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSchedule} className="p-5 space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#0b1c30] mb-1">
                Recipient Email Addresses
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]/40 text-[13px] text-[#0b1c30] outline-none focus:border-[#006a61]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#0b1c30] mb-1">
                Cadence & Time
              </label>
              <select
                value={day}
                onChange={e => setDay(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]/40 text-[13px] text-[#0b1c30] outline-none focus:border-[#006a61]"
              >
                <option value="Monday Morning 08:30">Monday Morning 08:30 (Pre-Clinic Standup)</option>
                <option value="Friday Evening 18:00">Friday Evening 18:00 (Weekly Wrap-up)</option>
                <option value="Daily 09:00">Daily 09:00 AM Executive Digest</option>
              </select>
            </div>

            <div className="p-3 bg-[#e5eeff] rounded-xl text-[12px] text-[#0b1c30] flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] text-[#006a61] shrink-0 mt-0.5">summarize</span>
              <span>Includes RFM cohort migration, consultant revenue leaderboards, and at-risk lapse alerts.</span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-[13px] rounded-lg text-[#45464d] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black hover:bg-slate-800 text-white font-semibold text-[13px] rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                <span>Save Schedule</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
