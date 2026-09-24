import React, { useState } from 'react';

interface BroadcastModalProps {
  onClose: () => void;
  targetCohort: string;
  count: number;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({
  onClose,
  targetCohort,
  count
}) => {
  const [template, setTemplate] = useState('oligio-recall');
  const [message, setMessage] = useState(
    'Sawadee ka [CustomerName]! Dr. Kornvipa and the clinical team at Aura Prestige Thonglor have prepared your annual collagen recall privilege. Book before Sept 30 to receive complimentary Exosome Skin Infusion.'
  );
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSent(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1c30]/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#c6c6cd]/50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#c6c6cd]/30 flex items-center justify-between bg-[#eff4ff]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#006a61] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">campaign</span>
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-[16px] text-[#0b1c30]">
                Broadcast Targeted Concierge Campaign
              </h3>
              <p className="text-[12px] text-[#45464d]">
                Target: {targetCohort} ({count.toLocaleString()} VIP patients)
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

        {sent ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#006a61] flex items-center justify-center mx-auto animate-bounce">
              <span className="material-symbols-outlined text-[32px]">task_alt</span>
            </div>
            <h4 className="text-[16px] font-bold text-[#0b1c30]">Broadcast Dispatched!</h4>
            <p className="text-[13px] text-[#45464d]">
              Delivering to {count.toLocaleString()} LINE OA verified patient threads via Thonglor API gateway.
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#0b1c30] mb-1">
                Campaign Template
              </label>
              <select
                value={template}
                onChange={e => {
                  setTemplate(e.target.value);
                  if (e.target.value === 'botox') {
                    setMessage('Sawadee ka [CustomerName]! Your neurotoxin maintenance milestone is approaching. Reserve your preferred slot with Dr. Kornvipa this week to preserve peak contour definition.');
                  } else {
                    setMessage('Sawadee ka [CustomerName]! Dr. Kornvipa and the clinical team at Aura Prestige Thonglor have prepared your annual collagen recall privilege. Book before Sept 30 to receive complimentary Exosome Skin Infusion.');
                  }
                }}
                className="w-full h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]/40 text-[13px] text-[#0b1c30] outline-none focus:border-[#006a61]"
              >
                <option value="oligio-recall">Annual Lifting Maintenance (Oligio X / Ulthera Recall)</option>
                <option value="botox">Quarterly Neurotoxin (Botox / Dysport Milestone)</option>
                <option value="vip-anniversary">VIP Anniversary Platinum Invitation</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#0b1c30] mb-1">
                Personalized Message (LINE OA Official)
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#eff4ff] text-[13px] text-[#0b1c30] outline-none focus:bg-white border border-transparent focus:border-[#006a61]"
              />
            </div>

            <div className="p-3 bg-[#e5eeff] rounded-xl flex items-center justify-between text-[12px] text-[#0b1c30]">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="material-symbols-outlined text-[16px] text-[#006a61]">schedule_send</span>
                Smart Send Window: 13:00 - 15:00
              </span>
              <span className="font-semibold text-[#006a61]">Est. Open Rate ~82%</span>
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
                type="button"
                onClick={handleSend}
                className="px-4 py-2 bg-[#00b900] hover:bg-[#009b00] text-white font-semibold text-[13px] rounded-lg flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Send to {count.toLocaleString()} Patients</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
