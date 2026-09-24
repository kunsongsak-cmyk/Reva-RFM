import React, { useState, useEffect, useMemo } from 'react';
import { ScreenType, Patient, PatientCategory, PatientRecord, RfmSettings } from './types';
import { INITIAL_PATIENTS } from './data/mockData';
import { DEFAULT_RFM_SETTINGS, enrichPatient } from './lib/rfm';
import { mergeRecords } from './lib/importer';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TodaysQueueScreen } from './components/TodaysQueueScreen';
import { PatientsScreen } from './components/PatientsScreen';
import { PatientDossierScreen } from './components/PatientDossierScreen';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { TreatmentCyclesScreen } from './components/TreatmentCyclesScreen';
import { SettingsScreen } from './components/SettingsScreen';

// Modals
import { LineChatModal } from './components/modals/LineChatModal';
import { BookAppointmentModal } from './components/modals/BookAppointmentModal';
import { OutcomeModal } from './components/modals/OutcomeModal';
import { NewPatientModal } from './components/modals/NewPatientModal';
import { CommandPalette } from './components/modals/CommandPalette';
import { BroadcastModal } from './components/modals/BroadcastModal';
import { WeeklyBriefModal } from './components/modals/WeeklyBriefModal';
import { ImportModal, ImportMode } from './components/modals/ImportModal';

const SETTINGS_KEY = 'reva-rfm-settings';

function loadSettings(): RfmSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) return { ...DEFAULT_RFM_SETTINGS, ...JSON.parse(saved) };
  } catch {
    // Storage unavailable or corrupt: fall back to defaults
  }
  return DEFAULT_RFM_SETTINGS;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('todays-queue');
  const [records, setRecords] = useState<PatientRecord[]>(INITIAL_PATIENTS);
  const [rfmSettings, setRfmSettings] = useState<RfmSettings>(loadSettings);
  const patients = useMemo(
    () => records.map(r => enrichPatient(r, rfmSettings)).sort((a, b) => b.priorityScore - a.priorityScore),
    [records, rfmSettings]
  );
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0].id);
  const selectedPatient = patients.find(p => p.id === selectedPatientId) ?? patients[0];
  const setSelectedPatient = (p: Patient) => setSelectedPatientId(p.id);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<PatientCategory | undefined>(undefined);
  const [branch, setBranch] = useState('Thonglor Flagship');

  // Modal States
  const [lineChatPatient, setLineChatPatient] = useState<Patient | null>(null);
  const [bookAppointmentPatient, setBookAppointmentPatient] = useState<Patient | null>(null);
  const [outcomePatient, setOutcomePatient] = useState<Patient | null>(null);
  const [isNewPatientOpen, setIsNewPatientOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isWeeklyBriefOpen, setIsWeeklyBriefOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [broadcastConfig, setBroadcastConfig] = useState<{ isOpen: boolean; cohort: string; count: number }>({
    isOpen: false,
    cohort: '',
    count: 0
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Keyboard shortcut for ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (screen: ScreenType, category?: PatientCategory) => {
    setCurrentScreen(screen);
    setSelectedCategoryFilter(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdatePatient = (updated: PatientRecord) => {
    setRecords(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  };

  const handleImport = (imported: PatientRecord[], mode: ImportMode) => {
    const next = mode === 'replace' ? imported : mergeRecords(records, imported);
    setRecords(next);
    if (mode === 'replace') setSelectedPatientId(next[0].id);
    setIsImportOpen(false);
    showToast(`นำเข้าข้อมูลคนไข้ ${imported.length.toLocaleString()} รายเรียบร้อย`);
    handleNavigate('patients');
  };

  const handleSaveSettings = (next: RfmSettings) => {
    setRfmSettings(next);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch {
      // Settings still apply for this session
    }
    showToast('บันทึกเกณฑ์ RFM แล้ว คำนวณคะแนนใหม่ทั้งหมดเรียบร้อย');
  };

  const handlePatientAdded = (newP: Partial<PatientRecord>) => {
    const fullPatient: PatientRecord = {
      id: `p-${Date.now()}`,
      hn: newP.hn || 'RV099999',
      name: newP.name || 'Khun Customer',
      nickname: newP.nickname || 'คุณลูกค้า',
      age: newP.age || 30,
      gender: newP.gender || 'Female',
      nationality: 'Thai',
      phone: newP.phone || '+66 8',
      lineId: newP.lineId || '@customer',
      lineConnected: true,
      avatarUrl: '',
      salesOwner: 'Khun May',
      salesOwnerRole: 'Senior Consultant',
      attendingDoctor: 'Dr. Kornvipa',
      doctorSpecialty: 'Dermatology & Laser',
      branch: 'Thonglor Flagship',
      tier: newP.tier || 'คนไข้ใหม่',
      signals: newP.signals || [],
      recommendedProposal: newP.recommendedProposal || { title: 'ปรึกษาแพทย์และวิเคราะห์ผิว', subtitle: '' },
      treatments: [],
      timeline: newP.timeline || []
    };

    setRecords(prev => [fullPatient, ...prev]);
    setSelectedPatientId(fullPatient.id);
    setIsNewPatientOpen(false);
    showToast(`ลงทะเบียนคนไข้ใหม่ ${fullPatient.name} (HN: ${fullPatient.hn}) แล้ว`);
    handleNavigate('patient-detail');
  };

  const handleBookConfirmed = (details: { procedure: string; doctor: string; date: string; time: string }) => {
    if (!bookAppointmentPatient) return;
    const newEvent = {
      id: `ev-${Date.now()}`,
      title: `ยืนยันนัด: ${details.procedure.split(' - ')[0]}`,
      timestamp: 'วันนี้ เมื่อสักครู่',
      icon: 'event_available',
      iconBg: 'bg-[#006a61] text-white',
      description: `นัดวันที่ ${details.date} เวลา ${details.time} กับ ${details.doctor}`,
      statusTag: 'จองห้องหัตถการแล้ว'
    };

    const updated = {
      ...bookAppointmentPatient,
      timeline: [newEvent, ...bookAppointmentPatient.timeline]
    };

    handleUpdatePatient(updated);
    setBookAppointmentPatient(null);
    showToast(`จองนัดให้ ${bookAppointmentPatient.name} วันที่ ${details.date} แล้ว`);
  };

  const handleOutcomeSaved = (outcome: {
    channel: string;
    outcomeText: string;
    notes: string;
    nextDate: string;
    nextTime: string;
  }) => {
    if (!outcomePatient) return;
    const newEvent = {
      id: `ev-${Date.now()}`,
      title: `${outcome.outcomeText} ผ่าน ${outcome.channel.toUpperCase()}`,
      timestamp: 'วันนี้ เมื่อสักครู่',
      icon: outcome.channel === 'line' ? 'chat' : outcome.channel === 'phone' ? 'call' : 'check_circle',
      iconBg: 'bg-[#006a61] text-white',
      description: outcome.notes,
      statusTag: `ติดตามครั้งถัดไป: ${outcome.nextDate}`
    };

    const updated = {
      ...outcomePatient,
      timeline: [newEvent, ...outcomePatient.timeline]
    };

    handleUpdatePatient(updated);
    setOutcomePatient(null);
    showToast(`บันทึกผลการติดต่อ ${outcomePatient.name} แล้ว`);
  };

  const handleLineMessageSent = (msg: string) => {
    if (!lineChatPatient) return;
    const newEvent = {
      id: `ev-${Date.now()}`,
      title: 'ส่งข้อความ LINE แล้ว',
      timestamp: 'วันนี้ เมื่อสักครู่',
      icon: 'chat',
      iconBg: 'bg-[#00b900] text-white',
      description: `คุณ May ส่ง: "${msg}"`,
      statusTag: 'ส่งผ่าน LINE OA'
    };

    const updated = {
      ...lineChatPatient,
      timeline: [newEvent, ...lineChatPatient.timeline]
    };

    handleUpdatePatient(updated);
    showToast(`ส่งข้อความถึง ${lineChatPatient.name} ทาง LINE OA แล้ว`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#131b2e] text-white px-4 py-3 rounded-xl shadow-2xl border border-white/10 flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
          <span className="material-symbols-outlined text-[20px] text-[#86f2e4]">check_circle</span>
          <span className="text-[13px] font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Global Fixed Sidebar */}
      <Sidebar
        patients={patients}
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        selectedCategory={selectedCategoryFilter}
      />

      {/* Top Header */}
      <Header
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        branch={branch}
        onBranchChange={b => {
          setBranch(b);
          showToast(`เปลี่ยนสาขาเป็น ${b}`);
        }}
      />

      {/* Main Viewport Content */}
      <main className="ml-72 mt-16 p-8 flex-1 max-w-[1600px] w-full">
        {currentScreen === 'todays-queue' && (
          <TodaysQueueScreen
            patients={patients}
            selectedPatient={selectedPatient}
            onSelectPatient={setSelectedPatient}
            onNavigate={handleNavigate}
            onOpenLineChat={p => setLineChatPatient(p)}
            onOpenOutcome={p => setOutcomePatient(p)}
            onOpenBookModal={p => setBookAppointmentPatient(p)}
          />
        )}

        {currentScreen === 'patients' && (
          <PatientsScreen
            patients={patients}
            selectedCategory={selectedCategoryFilter}
            onSelectPatient={p => setSelectedPatient(p)}
            onNavigate={handleNavigate}
            onOpenNewPatientModal={() => setIsNewPatientOpen(true)}
            onOpenImportModal={() => setIsImportOpen(true)}
            onOpenBroadcastModal={(cohort, count) => setBroadcastConfig({ isOpen: true, cohort, count })}
            onOpenLineChat={p => setLineChatPatient(p)}
          />
        )}

        {currentScreen === 'patient-detail' && (
          <PatientDossierScreen
            patient={selectedPatient}
            onOpenLineChat={p => setLineChatPatient(p)}
            onOpenOutcomeModal={p => setOutcomePatient(p)}
            onOpenBookAppointment={p => setBookAppointmentPatient(p)}
            onUpdatePatient={handleUpdatePatient}
            onBackToQueue={() => handleNavigate('todays-queue')}
          />
        )}

        {currentScreen === 'analytics' && (
          <AnalyticsScreen
            patients={patients}
            onNavigate={handleNavigate}
            onOpenWeeklyBrief={() => setIsWeeklyBriefOpen(true)}
            branch={branch}
          />
        )}

        {currentScreen === 'treatment-cycles' && (
          <TreatmentCyclesScreen
            patients={patients}
            onNavigate={handleNavigate}
            onOpenBroadcast={(cohort, count) => setBroadcastConfig({ isOpen: true, cohort, count })}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen settings={rfmSettings} onSave={handleSaveSettings} />
        )}
      </main>

      {/* Interactive Modals */}
      {lineChatPatient && (
        <LineChatModal
          patient={lineChatPatient}
          onClose={() => setLineChatPatient(null)}
          onSentMessage={handleLineMessageSent}
        />
      )}

      {bookAppointmentPatient && (
        <BookAppointmentModal
          patient={bookAppointmentPatient}
          onClose={() => setBookAppointmentPatient(null)}
          onBookConfirmed={handleBookConfirmed}
        />
      )}

      {outcomePatient && (
        <OutcomeModal
          patient={outcomePatient}
          onClose={() => setOutcomePatient(null)}
          onSaved={handleOutcomeSaved}
        />
      )}

      {isNewPatientOpen && (
        <NewPatientModal
          onClose={() => setIsNewPatientOpen(false)}
          onPatientAdded={handlePatientAdded}
        />
      )}

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        patients={patients}
        onSelectPatient={p => setSelectedPatient(p)}
        onNavigate={handleNavigate}
      />

      {broadcastConfig.isOpen && (
        <BroadcastModal
          onClose={() => setBroadcastConfig({ isOpen: false, cohort: '', count: 0 })}
          targetCohort={broadcastConfig.cohort}
          count={broadcastConfig.count}
        />
      )}

      {isImportOpen && (
        <ImportModal onClose={() => setIsImportOpen(false)} onImport={handleImport} />
      )}

      {isWeeklyBriefOpen && (
        <WeeklyBriefModal
          onClose={() => setIsWeeklyBriefOpen(false)}
        />
      )}
    </div>
  );
}
