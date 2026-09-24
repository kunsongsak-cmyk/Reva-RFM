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

export interface TreatmentHistoryItem {
  id: string;
  name: string;
  category: 'Lifting' | 'Injectables' | 'Laser' | 'Skin';
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
  category: 'Lifting' | 'Injectables' | 'Skin';
  lastDate: string;
  lastTreatment: string;
  targetDate: string;
  daysDiff: string;
  isOverdue: boolean;
  overduePillText: string;
  overduePillType: 'error' | 'secondary' | 'neutral';
  progressPercent: number;
  penetration?: string;
  potentialBadge?: string;
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
