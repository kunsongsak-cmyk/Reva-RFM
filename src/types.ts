export type ScreenType = 
  | 'todays-queue'
  | 'patients'
  | 'patient-detail'
  | 'analytics'
  | 'treatment-cycles'
  | 'settings';

export type PatientCategory = 
  | 'All'
  | 'Champions'
  | 'Loyal VIPs'
  | 'New Patients'
  | 'Need Attention'
  | 'At Risk'
  | 'Lost / Inactive';

export type TreatmentCategory = 'Lifting' | 'Injectables' | 'Laser' | 'Skin' | 'Other';
// Categories with a repeat-treatment cycle; 'Other' (IV drip, fillers, take-home…) has none
export type CycleCategory = Exclude<TreatmentCategory, 'Other'>;

export interface TreatmentHistoryItem {
  id: string;
  name: string;
  category: TreatmentCategory;
  date: string;
  price: number;
  doctor: string;
  statusBadge: string;
  statusType: 'error' | 'secondary' | 'neutral' | 'info';
  details: string;
  review?: {
    stars: number;
    text: string;
  };
  notes?: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  timestamp: string;
  icon: string;
  iconBg: string;
  description: string;
  statusTag?: string;
  quote?: string;
}

export interface TreatmentCycleStatus {
  protocolName: string;
  category: CycleCategory;
  lastDate: string;
  lastTreatment: string;
  targetDate: string;
  daysDiff: string;
  isOverdue: boolean;
  overduePillText: string;
  overduePillType: 'error' | 'secondary' | 'neutral';
  progressPercent: number;
  // Days until the next recommended treatment; negative when overdue
  dueInDays: number;
  // More than two intervals since the last treatment: no longer an active protocol
  isLapsed: boolean;
}

export interface Patient {
  id: string;
  hn: string;
  name: string;
  nickname: string;
  age: number;
  gender: string;
  nationality: string;
  phone: string;
  lineId: string;
  lineConnected: boolean;
  avatarUrl: string;
  salesOwner: string;
  salesOwnerRole: string;
  attendingDoctor: string;
  doctorSpecialty: string;
  branch: string;
  
  // RFM & Financial
  category: PatientCategory;
  rfmScore: {
    recencyScore: number;
    frequencyScore: number;
    monetaryScore: number;
    recencyLabel: string;
    frequencyLabel: string;
    monetaryLabel: string;
    matrixVerdit: string;
  };
  priorityScore: number;
  priorityLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  priorityReason: string;
  tier: string;
  lifetimeValue: number;
  trailing12M: number;
  avgTicket: number;
  completedVisits: number;
  lastVisitRecencyDays: number;
  lastVisitDate: string;
  
  // Why Follow Up Today
  signals: {
    title: string;
    description: string;
    icon: string;
    iconColor: string;
  }[];
  recommendedProposal: {
    title: string;
    subtitle: string;
    offerAttached?: boolean;
  };
  
  // Cycles
  cycles: TreatmentCycleStatus[];
  
  // Timeline and treatments
  treatments: TreatmentHistoryItem[];
  timeline: TimelineEvent[];
}

export interface ConsultantPerformance {
  id: string;
  name: string;
  role: string;
  avatarInitial: string;
  assigned: number;
  contactRatePercent: number;
  bookingRatePercent: number;
  completedCount: number;
  revenueGenerated: number;
  rank: number;
  isTop?: boolean;
}

export interface RfmSettings {
  // Days since last visit at which a patient's recency score drops to 3
  recencyDays: number;
  // Trailing 12-month spend (THB) that earns a monetary score of 5
  monetaryThreshold: number;
}

// Fields derived from treatment history by src/lib/rfm.ts
export type ComputedPatientField =
  | 'category'
  | 'rfmScore'
  | 'priorityScore'
  | 'priorityLevel'
  | 'priorityReason'
  | 'lifetimeValue'
  | 'trailing12M'
  | 'avgTicket'
  | 'completedVisits'
  | 'lastVisitRecencyDays'
  | 'lastVisitDate'
  | 'cycles';

// Patient data as stored; the computed fields are filled in at runtime
export type PatientRecord = Omit<Patient, ComputedPatientField>;
