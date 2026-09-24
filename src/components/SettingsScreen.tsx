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
        <h1 className="font-['Plus_Jakarta_Sans'] text-[24px] font-bold text-[#0b1c30] tracking-tight">
          Clinical CRM Engine Settings
        </h1>
        <p className="font-['Inter'] text-[14px] text-[#45464d] mt-0.5">
          RFM Scoring Weights, Physiological Efficacy Decay Thresholds, & LINE Official Webhooks
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-[#86f2e4]/30 border border-[#006a61]/30 rounded-xl text-[#006a61] text-[13px] font-semibold flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Engine parameters updated successfully. Algorithms re-calibrated.</span>
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
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[15px] text-[#0b1c30]">
                  LINE Official Account Concierge API Gateway
                </h3>
                <span className="text-[12px] text-[#45464d]">
                  Direct bidirectional sync with Thailand LINE Messaging API
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#00b900]/10 text-[#00a000] text-[11px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00b900] animate-pulse"></span>
              Connected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
            <div>
              <label className="block font-semibold text-[#0b1c30] mb-1">Clinic Channel Access Token</label>
              <input
                type="password"
                defaultValue="••••••••••••••••••••••••••••••••••••••••"
                readOnly
                className="w-full h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]/40 text-[#45464d] font-mono text-[12px]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#0b1c30] mb-1">Autonomous Outreach Time Window</label>
              <select
                value={autoRecallHours}
                onChange={e => setAutoRecallHours(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]/40 text-[#0b1c30] outline-none"
              >
                <option value="13:00 - 15:00">13:00 – 15:00 (Peak Open Rate in Bangkok)</option>
                <option value="11:00 - 13:00">11:00 – 13:00 (Lunch Concierge Hour)</option>
                <option value="16:00 - 18:00">16:00 – 18:00 (Evening Pre-commute)</option>
              </select>
            </div>
          </div>
        </div>

        {/* RFM Mathematical Thresholds */}
        <div className="bg-white rounded-xl border border-[#c6c6cd]/40 p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-[#c6c6cd]/30">
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[15px] text-[#0b1c30]">
              RFM Scoring Engine Parameters
            </h3>
            <span className="text-[12px] text-[#45464d]">
              Adjust algorithmic cutoffs that define Champions, Loyal VIPs, and At-Risk states
            </span>
          </div>

          <div className="space-y-4 text-[13px]">
            <div>
              <div className="flex justify-between mb-1">
                <label className="font-semibold text-[#0b1c30]">
                  Recency Warning Decay Threshold ({rfmRecencyDays} Days)
                </label>
                <span className="font-mono text-[#ba1a1a] font-bold">
                  &gt;{rfmRecencyDays}d triggers At-Risk status
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
                  High Spender Tier Cutoff (฿{rfmMonetaryThreshold.toLocaleString()})
                </label>
                <span className="font-mono text-[#006a61] font-bold">
                  Monetary Score 5/5 Qualifier
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
              <span>Save Configuration</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
