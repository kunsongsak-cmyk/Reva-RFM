import React, { useState, useEffect } from 'react';
import { ScreenType, Patient, PatientCategory } from './types';
import { INITIAL_PATIENTS } from './data/mockData';
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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('todays-queue');
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<Patient>(INITIAL_PATIENTS[0]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<PatientCategory | undefined>(undefined);
  const [branch, setBranch] = useState('Thonglor Flagship');

  // Modal States
  const [lineChatPatient, setLineChatPatient] = useState<Patient | null>(null);
  const [bookAppointmentPatient, setBookAppointmentPatient] = useState<Patient | null>(null);
  const [outcomePatient, setOutcomePatient] = useState<Patient | null>(null);
  const [isNewPatientOpen, setIsNewPatientOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isWeeklyBriefOpen, setIsWeeklyBriefOpen] = useState(false);
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

  const handleUpdatePatient = (updated: Patient) => {
    setPatients(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    if (selectedPatient.id === updated.id) {
      setSelectedPatient(updated);
    }
  };

  const handlePatientAdded = (newP: Partial<Patient>) => {
    const fullPatient: Patient = {
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
      category: 'New Patients',
      tier: 'Onboarding Cohort',
      priorityScore: 75,
      priorityLevel: 'High',
      priorityReason: 'New Patient Intake Scheduled',
      lifetimeValue: 0,
      trailing12M: 0,
      avgTicket: 0,
      completedVisits: 0,
      lastVisitRecencyDays: 0,
      lastVisitDate: 'Today (Intake)',
      rfmScore: {
        recencyScore: 5,
        frequencyScore: 1,
        monetaryScore: 1,
        recencyLabel: 'Brand new onboarding patient profile.',
        frequencyLabel: '0 completed procedures.',
        monetaryLabel: '฿0 initial spend.',
        matrixVerdit: 'Newly registered VIP prospect requiring concierge welcome.'
      },
      signals: [
        {
          title: 'Initial Intake Protocol',
          description: 'Ready for Visia complexion scan and consultation.',
          icon: 'spa',
          iconColor: 'text-[#006a61]'
        }
      ],
      recommendedProposal: {
        title: 'Initial Diagnostic Complexion Scan & Specialist Consultation',
        subtitle: 'Complimentary welcome package privilege',
        offerAttached: true
      },
      cycles: [],
      treatments: [],
      timeline: [
        {
          id: `ev-${Date.now()}`,
          title: 'Patient Intake Registered',
          timestamp: 'Today, Just now',
          icon: 'person_add',
          iconBg: 'bg-[#006a61] text-white',
          description: 'Profile created by Khun May via VIP reception desk.'
        }
      ]
    };

    setPatients(prev => [fullPatient, ...prev]);
    setSelectedPatient(fullPatient);
    setIsNewPatientOpen(false);
    showToast(`Registered new patient ${fullPatient.name} (HN: ${fullPatient.hn})`);
    handleNavigate('patient-detail');
  };

  const handleBookConfirmed = (details: { procedure: string; doctor: string; date: string; time: string }) => {
    if (!bookAppointmentPatient) return;
    const newEvent = {
      id: `ev-${Date.now()}`,
      title: `Appointment Confirmed: ${details.procedure.split(' - ')[0]}`,
      timestamp: 'Today, Just now',
      icon: 'event_available',
      iconBg: 'bg-[#006a61] text-white',
      description: `Reserved on ${details.date} at ${details.time} with ${details.doctor}.`,
      statusTag: 'Locked in Thonglor Suite 2'
    };

    const updated = {
      ...bookAppointmentPatient,
      timeline: [newEvent, ...bookAppointmentPatient.timeline]
    };

    handleUpdatePatient(updated);
    setBookAppointmentPatient(null);
    showToast(`Appointment booked for ${bookAppointmentPatient.name} on ${details.date}`);
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
      title: `${outcome.outcomeText} via ${outcome.channel.toUpperCase()}`,
      timestamp: 'Today, Just now',
      icon: outcome.channel === 'line' ? 'chat' : outcome.channel === 'phone' ? 'call' : 'check_circle',
      iconBg: 'bg-[#006a61] text-white',
      description: outcome.notes,
      statusTag: `Next Follow-up: ${outcome.nextDate}`
    };

    const updated = {
      ...outcomePatient,
      timeline: [newEvent, ...outcomePatient.timeline]
    };

    handleUpdatePatient(updated);
    setOutcomePatient(null);
    showToast(`Logged outcome for ${outcomePatient.name}`);
  };

  const handleLineMessageSent = (msg: string) => {
    if (!lineChatPatient) return;
    const newEvent = {
      id: `ev-${Date.now()}`,
      title: 'LINE Concierge Message Sent',
      timestamp: 'Today, Just now',
      icon: 'chat',
      iconBg: 'bg-[#00b900] text-white',
      description: `Khun May sent: "${msg}"`,
      statusTag: 'Delivered via LINE OA'
    };

    const updated = {
      ...lineChatPatient,
      timeline: [newEvent, ...lineChatPatient.timeline]
    };

    handleUpdatePatient(updated);
    showToast(`Message sent to ${lineChatPatient.name} via LINE OA`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-['Inter']">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#131b2e] text-white px-4 py-3 rounded-xl shadow-2xl border border-white/10 flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
          <span className="material-symbols-outlined text-[20px] text-[#86f2e4]">check_circle</span>
          <span className="text-[13px] font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Global Fixed Sidebar */}
      <Sidebar
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
          showToast(`Switched active branch to ${b}`);
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
            onNavigate={handleNavigate}
            onOpenWeeklyBrief={() => setIsWeeklyBriefOpen(true)}
            branch={branch}
          />
        )}

        {currentScreen === 'treatment-cycles' && (
          <TreatmentCyclesScreen
            onNavigate={handleNavigate}
            onOpenBroadcast={(cohort, count) => setBroadcastConfig({ isOpen: true, cohort, count })}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen />
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

      {isWeeklyBriefOpen && (
        <WeeklyBriefModal
          onClose={() => setIsWeeklyBriefOpen(false)}
        />
      )}
    </div>
  );
}
