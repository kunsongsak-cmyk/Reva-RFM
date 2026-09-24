import React, { useState } from 'react';
import { Patient } from '../../types';

interface LineChatModalProps {
  patient: Patient;
  onClose: () => void;
  onSentMessage: (msg: string) => void;
}

export const LineChatModal: React.FC<LineChatModalProps> = ({
  patient,
  onClose,
  onSentMessage
}) => {
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'concierge',
      text: `สวัสดีค่ะ คุณ${patient.name.split(' ')[1] || 'ลูกค้า'} May จาก Reva Aesthetic Clinic นะคะ ผิวเป็นอย่างไรบ้างคะ`,
      time: '09:15'
    },
    {
      id: 'm2',
      sender: 'patient',
      text: 'สวัสดีค่ะคุณ May ผิวโอเคดีค่ะ แต่ช่วงนี้รู้สึกกรอบหน้าเริ่มไม่ค่อยกระชับ',
      time: '09:18'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const quickTemplates = [
    'ถึงรอบ Oligio X แล้วค่ะ ตอนนี้มีแพ็กเกจ ฿49,900 สนใจนัดวันไหนดีคะ',
    'คุณหมอว่างให้คำปรึกษาวันพฤหัสนี้ 14:00 น. สะดวกไหมคะ',
    'เชิญมาตรวจติดตามผลและสแกนผิวฟรีค่ะ'
  ];

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'concierge',
      text: inputText.trim(),
      time: 'เมื่อสักครู่'
    };
    setMessages(prev => [...prev, newMsg]);
    onSentMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1c30]/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#c6c6cd]/50 overflow-hidden flex flex-col max-h-[85vh]">
        {/* LINE OA Header */}
        <div className="bg-[#00b900] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">chat</span>
            </div>
            <div>
              <div className="font-display font-semibold text-[15px] flex items-center gap-1.5 leading-tight">
                {patient.name}
                <span className="text-[11px] font-normal opacity-90">{patient.nickname && `(${patient.nickname})`}</span>
              </div>
              <div className="text-[11px] opacity-90 flex items-center gap-1">
                <span>LINE Official Account</span>
                <span>•</span>
                <span className="text-emerald-100 font-mono">{patient.lineId}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Chat Thread */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-[#849ebf]/10 min-h-[280px]">
          <div className="text-center">
            <span className="text-[10px] text-[#45464d] bg-white/70 px-2 py-0.5 rounded-full">
              ห้องแชทคลินิก
            </span>
          </div>

          {messages.map(m => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'concierge' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-xs ${
                  m.sender === 'concierge'
                    ? 'bg-[#00b900] text-white rounded-tr-xs'
                    : 'bg-white text-[#0b1c30] rounded-tl-xs border border-slate-200/60'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-[#76777d] mt-1 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Quick Medical Templates */}
        <div className="px-4 py-2 border-t border-[#c6c6cd]/30 bg-slate-50">
          <div className="text-[11px] font-semibold text-[#45464d] mb-1.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#006a61]">auto_awesome</span>
            ข้อความสำเร็จรูป
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickTemplates.map((tmpl, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(tmpl)}
                className="text-[11px] text-[#006a61] bg-[#eff4ff] hover:bg-[#dce9ff] px-2.5 py-1 rounded-full whitespace-nowrap border border-[#86f2e4]/40 font-medium transition-colors"
              >
                {tmpl.slice(0, 32)}...
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Box */}
        <div className="p-3 bg-white border-t border-[#c6c6cd]/30 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="พิมพ์ข้อความ..."
            className="flex-1 px-3.5 py-2 text-[13px] bg-[#eff4ff] rounded-xl outline-none border border-transparent focus:border-[#006a61] focus:bg-white transition-all text-[#0b1c30] placeholder:text-[#76777d]"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-[#00b900] hover:bg-[#00a000] text-white text-[13px] font-semibold rounded-xl flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
          >
            <span>ส่ง</span>
            <span className="material-symbols-outlined text-[16px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
