import React, { useState } from 'react';

interface HeaderProps {
  onOpenCommandPalette: () => void;
  branch: string;
  onBranchChange: (b: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCommandPalette,
  branch,
  onBranchChange
}) => {
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const branches = [
    'Thonglor Flagship',
    'Phrom Phong Clinic',
    'Ekkamai Central Suite'
  ];

  const notifications = [
    {
      id: '1',
      title: 'เลยรอบ Lifting',
      desc: 'Khun Ananya S. เลยรอบนัด Oligio X มา 37 วัน',
      time: '10 นาทีที่แล้ว',
      urgent: true
    },
    {
      id: '2',
      title: 'อ่านข้อความ LINE OA แล้ว',
      desc: 'Khun Ploypailin T. อ่านข้อความติดตามผลแล้ว',
      time: '34 นาทีที่แล้ว',
      urgent: false
    },
    {
      id: '3',
      title: 'ยอดจองใกล้ถึงเป้า',
      desc: 'ยอดจองวันนี้ถึง 80% ของเป้า (12 / 15 นัด)',
      time: '1 ชม.ที่แล้ว',
      urgent: false
    }
  ];

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-[#c6c6cd]/40 z-40 px-6 flex items-center justify-between">
      {/* Left: Branch selector & Date */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <button
            onClick={() => setShowBranchMenu(!showBranchMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]/30 text-[#0b1c30] hover:bg-[#dce9ff]/50 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-[#006a61]">
              domain
            </span>
            <span className="font-sans text-[13px] font-semibold">
              {branch}
            </span>
            <span className="material-symbols-outlined text-[16px] text-[#45464d]">
              unfold_more
            </span>
          </button>

          {showBranchMenu && (
            <div className="absolute top-full left-0 mt-1.5 w-52 bg-white rounded-xl shadow-lg border border-[#c6c6cd]/40 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              {branches.map(b => (
                <button
                  key={b}
                  onClick={() => {
                    onBranchChange(b);
                    setShowBranchMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors flex items-center justify-between ${
                    branch === b
                      ? 'bg-[#eff4ff] text-[#006a61] font-semibold'
                      : 'text-[#0b1c30] hover:bg-slate-50'
                  }`}
                >
                  <span>{b}</span>
                  {branch === b && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden xl:flex items-center gap-2 text-[#45464d] font-sans text-[13px]">
          <span className="material-symbols-outlined text-[16px]">calendar_today</span>
          <span>{new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Quick Search Field / ⌘K trigger */}
        <div className="relative flex items-center">
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center justify-between w-72 h-9 px-3 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]/40 text-[#45464d] hover:border-[#006a61] hover:bg-[#eff4ff]/80 transition-all text-left"
          >
            <div className="flex items-center gap-2 text-[13px] truncate">
              <span className="material-symbols-outlined text-[18px]">search</span>
              <span className="text-[#76777d]">ค้นหาชื่อคนไข้, HN, เบอร์โทร...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-[#d3e4fe] border border-[#c6c6cd] text-[10px] font-semibold text-[#45464d] shrink-0 font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        <div className="h-5 w-px bg-[#c6c6cd]/40"></div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-[#45464d] hover:bg-[#e5eeff] hover:text-[#0b1c30] transition-colors"
            title="การแจ้งเตือน"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-white animate-pulse"></span>
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#c6c6cd]/40 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 border-b border-[#c6c6cd]/30 mb-2">
                <span className="text-[13px] font-semibold text-[#0b1c30]">การแจ้งเตือน</span>
                <span className="text-[11px] text-[#006a61] font-semibold cursor-pointer hover:underline">อ่านทั้งหมดแล้ว</span>
              </div>
              <div className="space-y-2">
                {notifications.map(n => (
                  <div key={n.id} className="p-2 rounded-lg bg-[#eff4ff]/60 hover:bg-[#eff4ff] transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className={`text-[12px] font-semibold ${n.urgent ? 'text-[#ba1a1a]' : 'text-[#0b1c30]'}`}>
                        {n.title}
                      </span>
                      <span className="text-[10px] text-[#76777d]">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#45464d] mt-0.5 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Chip */}
        <div className="flex items-center gap-3 pl-1">
          <div className="text-right hidden sm:block">
            <div className="font-sans text-[13px] font-semibold text-[#0b1c30] leading-snug">
              May
            </div>
            <div className="font-sans text-[11px] text-[#45464d] leading-none">
              ที่ปรึกษาอาวุโส
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-semibold text-[13px] shadow-xs">
            <span className="material-symbols-outlined text-white text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};
