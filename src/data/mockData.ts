import { Patient, ConsultantPerformance } from '../types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p-1',
    hn: 'RV012982',
    name: 'Khun Ananya S.',
    nickname: 'คุณ A',
    age: 39,
    gender: 'Female',
    nationality: 'Thai (TH/EN)',
    phone: '+66 81 842 9921',
    lineId: '@ananya.s',
    lineConnected: true,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANj6d4IgjtZdWwjCYIr-2Xc7JNwZvsvtRhK2qKdNyx-Jp1ELxi0tQjSSHn9xeFgztW4kJIngBA8cv1w2Rbjflh61Lj9dSm4WFQRfxPni9xog6s4JOhL-UbH0Si2zM4zAwvsYHfTcaEBVLs3GiJ24L971hl3COe0taNEa7RCRxXrUB6HJS1dPSBuTMLVxWaPkYlhfYSaQ9heAh5vLX9rFIkLGHrWYaVuG-oYUmyFVo9wRSzI0FqxMBu',
    salesOwner: 'Khun May',
    salesOwnerRole: 'Senior Consultant',
    attendingDoctor: 'Dr. Kornvipa',
    doctorSpecialty: 'Dermatology & Laser',
    branch: 'Thonglor Flagship',
    category: 'At Risk',
    tier: 'Platinum',
    priorityScore: 96,
    priorityLevel: 'Critical',
    priorityReason: 'Lifting overdue 37d',
    lifetimeValue: 186400,
    trailing12M: 92500,
    avgTicket: 26629,
    completedVisits: 7,
    lastVisitRecencyDays: 187,
    lastVisitDate: '21 Mar 2026',
    rfmScore: {
      recencyScore: 2,
      frequencyScore: 5,
      monetaryScore: 4,
      recencyLabel: '187 days since last treatment (decay threshold > 90d dropped score to 2).',
      frequencyLabel: '7 visits in trailing 12M (benchmark >= 6 visits qualifies for top 5/5).',
      monetaryLabel: '฿92.5K 12M expenditure (High spender bracket, > ฿100K elevates to 5/5).',
      matrixVerdit: 'Previously hyper-frequent champion transitioning into critical lapse window due to treatment delay.'
    },
    signals: [
      {
        title: '฿186K LTV Client',
        description: 'Currently holds 0 future appointments in CRM calendar.',
        icon: 'priority_high',
        iconColor: 'text-error'
      },
      {
        title: '84% Lapse Probability',
        description: 'AI model projects complete attrition if not re-engaged within 7 calendar days.',
        icon: 'trending_down',
        iconColor: 'text-on-tertiary-container'
      },
      {
        title: 'Optimal Window',
        description: 'Preferred contact channel is LINE OA between 13:00 - 15:00.',
        icon: 'schedule',
        iconColor: 'text-secondary'
      }
    ],
    recommendedProposal: {
      title: 'Program Oligio X Annual Recall Package (฿49,900) or Ultraformer MPT Touch-up',
      subtitle: 'Includes 1x Complimentary Skin Booster',
      offerAttached: false
    },
    cycles: [
      {
        protocolName: 'Lifting Protocol',
        category: 'Lifting',
        lastDate: '21 Mar 2026',
        lastTreatment: 'Oligio X (600 Shots)',
        targetDate: '15 Aug',
        daysDiff: '+37d',
        isOverdue: true,
        overduePillText: '40 Days Overdue',
        overduePillType: 'error',
        progressPercent: 100
      },
      {
        protocolName: 'Botox / Neurotoxin',
        category: 'Injectables',
        lastDate: '10 Jan 2026',
        lastTreatment: 'Allergan 100u (Jaw/Brow)',
        targetDate: '10 May',
        daysDiff: '+136d',
        isOverdue: true,
        overduePillText: 'Overdue (136 days)',
        overduePillType: 'error',
        progressPercent: 100
      },
      {
        protocolName: 'Skin Booster / PN',
        category: 'Skin',
        lastDate: 'No Recorded Records',
        lastTreatment: 'Rejuran Healer / Juvelook',
        targetDate: 'Open',
        daysDiff: '0d',
        isOverdue: false,
        overduePillText: 'Cross-Sell Candidate',
        overduePillType: 'neutral',
        progressPercent: 0,
        penetration: '0%',
        potentialBadge: 'High Potential'
      }
    ],
    treatments: [
      {
        id: 't-1',
        name: 'Program Oligio X (Full Face 600 Shots)',
        category: 'Lifting',
        date: '21 Mar 2026',
        price: 49900,
        doctor: 'Dr. Kornvipa',
        statusBadge: 'Recall Window Elapsed',
        statusType: 'error',
        details: 'Energy: Level 4.5 Monopolar RF • Cycle Decayed (+37 Days)',
        review: {
          stars: 5,
          text: 'Significant V-shape lift, contouring sharpness noticeable at 4 weeks.'
        },
        notes: 'Khun Ananya very pleased with jawline contour and lack of downtime.'
      },
      {
        id: 't-2',
        name: 'Botox Allergan 100u (Jawline Masseter + Forehead)',
        category: 'Injectables',
        date: '10 Jan 2026',
        price: 15900,
        doctor: 'Dr. Kornvipa',
        statusBadge: 'Completed Protocol',
        statusType: 'secondary',
        details: 'Dose: 60u Jaw / 40u Upper Face • Lot: #ALL-9982X',
        notes: 'Administered 100u total. Post-op follow-up completed at 14 days with zero asymmetry.'
      },
      {
        id: 't-3',
        name: 'Ultraformer MPT (SMAS Tightening 400 Shots)',
        category: 'Lifting',
        date: '12 Sep 2025',
        price: 35000,
        doctor: 'Dr. Vorapat',
        statusBadge: 'Historical Cycle',
        statusType: 'neutral',
        details: 'Cartridges: 4.5mm & 3.0mm Normal Mode'
      },
      {
        id: 't-4',
        name: 'Program Pico Discovery Laser (Full Face Brightening)',
        category: 'Laser',
        date: '18 May 2025',
        price: 18000,
        doctor: 'Dr. Kornvipa',
        statusBadge: 'Historical Cycle',
        statusType: 'neutral',
        details: 'Spot Size: 7mm / Fluence 1.4 J/cm²'
      },
      {
        id: 't-5',
        name: "Botox Allergan 50u (Touch-up Crow's Feet)",
        category: 'Injectables',
        date: '14 Feb 2025',
        price: 9900,
        doctor: 'Dr. Kornvipa',
        statusBadge: 'Historical Cycle',
        statusType: 'neutral',
        details: 'Lateral Canthal Lines bilaterally'
      },
      {
        id: 't-6',
        name: 'Skin Rejuvenation Dual Yellow Laser',
        category: 'Laser',
        date: '12 Nov 2024',
        price: 8900,
        doctor: 'Dr. Kornvipa',
        statusBadge: 'Historical Cycle',
        statusType: 'neutral',
        details: 'Vascular & Pigment settings for dermal tone uniformization'
      },
      {
        id: 't-7',
        name: 'Hydrafacial MD Deep Infusion & Lymphatic Drainage',
        category: 'Skin',
        date: '15 Aug 2024',
        price: 4500,
        doctor: 'Dr. Vorapat',
        statusBadge: 'Historical Cycle',
        statusType: 'neutral',
        details: 'Exfoliation, vortex extraction & antioxidant booster infusion'
      }
    ],
    timeline: [
      {
        id: 'ev-1',
        title: 'LINE Follow-up Greeting Sent',
        timestamp: 'Today, 09:15',
        icon: 'chat',
        iconBg: 'bg-secondary text-on-secondary',
        description: 'Khun May sent personalized protocol review',
        statusTag: 'Status: Read in 4 mins'
      },
      {
        id: 'ev-2',
        title: 'Automated Recall Engine',
        timestamp: '20 Sep 2026',
        icon: 'smart_toy',
        iconBg: 'bg-surface-container-highest text-on-surface-variant',
        description: 'Auto-sent WhatsApp/SMS recall reminder for Oligio maintenance',
        statusTag: 'Delivered · No interaction'
      },
      {
        id: 'ev-3',
        title: 'Procedure Completed & Review',
        timestamp: '21 Mar 2026',
        icon: 'star',
        iconBg: 'bg-secondary-container text-on-secondary-container',
        description: 'Oligio X (600 Shots) by Dr. Kornvipa',
        quote: '"Khun Ananya very pleased with jawline contour and lack of downtime."'
      },
      {
        id: 'ev-4',
        title: 'Pre-Op Consultation Confirmed',
        timestamp: '18 Mar 2026',
        icon: 'calendar_month',
        iconBg: 'bg-surface-container-highest text-on-surface-variant',
        description: 'Completed clinical intake and skin scan via LINE OA direct concierge.'
      },
      {
        id: 'ev-5',
        title: 'Botox Allergan Completed',
        timestamp: '10 Jan 2026',
        icon: 'check_circle',
        iconBg: 'bg-surface-container-highest text-on-surface-variant',
        description: 'Administered 100u total. Post-op follow-up completed at 14 days with zero asymmetry.'
      }
    ]
  },
  {
    id: 'p-2',
    hn: 'RV011420',
    name: 'Khun Ploypailin T.',
    nickname: 'คุณพลอย',
    age: 34,
    gender: 'Female',
    nationality: 'Thai (TH)',
    phone: '+66 89 231 4455',
    lineId: '@ploy.t',
    lineConnected: true,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAe6Ksjvpivzlv2ls7Jn5IZPx3-eAgdKVQqjbm37SS1jH2n4n09lD78wdw4wLWX5N7MAwE_WAOlnRTZnKr9GaPfQBRB8BAGZ4BNmdMiApDO8sQfMLbZ4snnAUZj4nUpnZacJaxuO4mG8Qu9dmh__u8fnJpEVG8ylpGaqshBkDqUuWZdkpFi4zoDy2LgHtONJvEv6ryBqdk5m6fgOrBWEd_WHe6NLvCSstMyRlMbnZdDSOKNNE5FJKNo',
    salesOwner: 'Khun Ann',
    salesOwnerRole: 'Consultant',
    attendingDoctor: 'Dr. Kornvipa',
    doctorSpecialty: 'Dermatology & Laser',
    branch: 'Thonglor Flagship',
    category: 'Loyal VIPs',
    tier: 'Prestige Gold',
    priorityScore: 93,
    priorityLevel: 'Critical',
    priorityReason: 'Botox due 22d overdue',
    lifetimeValue: 210000,
    trailing12M: 98000,
    avgTicket: 28000,
    completedVisits: 8,
    lastVisitRecencyDays: 112,
    lastVisitDate: '03 Jun 2026',
    rfmScore: {
      recencyScore: 4,
      frequencyScore: 5,
      monetaryScore: 5,
      recencyLabel: '112 days since last treatment, entering overdue neurotoxin cycle.',
      frequencyLabel: '8 visits in trailing 12M.',
      monetaryLabel: '฿98K 12M expenditure.',
      matrixVerdit: 'High adherence loyal patient nearing muscular rebound threshold.'
    },
    signals: [
      {
        title: 'Botox Overdue 22 Days',
        description: 'Jawline masseter re-hypertrophy window is opening.',
        icon: 'history_toggle_off',
        iconColor: 'text-error'
      },
      {
        title: 'High Response Rate',
        description: 'Frequently books on same day when contacted via LINE OA.',
        icon: 'verified',
        iconColor: 'text-secondary'
      }
    ],
    recommendedProposal: {
      title: 'Botox Allergan 100u Refresh + Complimentary Eye Brightening Mask',
      subtitle: 'Price locked at corporate VIP rate ฿15,900',
      offerAttached: false
    },
    cycles: [
      {
        protocolName: 'Botox / Neurotoxin',
        category: 'Injectables',
        lastDate: '03 Jun 2026',
        lastTreatment: "Jawline + Crow's Feet 50u",
        targetDate: '01 Sep',
        daysDiff: '+22d',
        isOverdue: true,
        overduePillText: '22 Days Overdue',
        overduePillType: 'error',
        progressPercent: 95
      }
    ],
    treatments: [
      {
        id: 't-201',
        name: "Botox Allergan 50u (Jawline + Crow's Feet)",
        category: 'Injectables',
        date: '03 Jun 2026',
        price: 15900,
        doctor: 'Dr. Kornvipa',
        statusBadge: 'Completed',
        statusType: 'secondary',
        details: 'Jawline and lateral canthal touch-up'
      }
    ],
    timeline: [
      {
        id: 'ev-201',
        title: 'Botox Maintenance Recall Triggered',
        timestamp: '22 Sep 2026',
        icon: 'history_toggle_off',
        iconBg: 'bg-surface-container-highest text-on-surface-variant',
        description: 'Auto reminder generated based on 90-day neurotoxin cycle.'
      }
    ]
  },
  {
    id: 'p-3',
    hn: 'RV018391',
    name: 'Khun Thanawat P.',
    nickname: 'คุณภัทร',
    age: 29,
    gender: 'Male',
    nationality: 'Thai (TH)',
    phone: '+66 82 555 1204',
    lineId: '@thanawat.p',
    lineConnected: true,
    avatarUrl: '',
    salesOwner: 'Khun May',
    salesOwnerRole: 'Senior Consultant',
    attendingDoctor: 'Dr. Kornvipa',
    doctorSpecialty: 'Dermatology & Laser',
    branch: 'Thonglor Flagship',
    category: 'New Patients',
    tier: 'Onboarding Cohort',
    priorityScore: 87,
    priorityLevel: 'High',
    priorityReason: 'No 2nd visit scheduled • 38d since 1st Pico',
    lifetimeValue: 29000,
    trailing12M: 29000,
    avgTicket: 29000,
    completedVisits: 1,
    lastVisitRecencyDays: 38,
    lastVisitDate: '17 Aug 2026',
    rfmScore: {
      recencyScore: 5,
      frequencyScore: 1,
      monetaryScore: 2,
      recencyLabel: '38 days since first visit.',
      frequencyLabel: '1 visit completed (Onboarding phase).',
      monetaryLabel: '฿29K initial package purchase.',
      matrixVerdit: 'Crucial 2nd visit conversion stage to prevent drop-off.'
    },
    signals: [
      {
        title: 'Acne Scar Subcision Follow-up',
        description: 'Optimal laser stacking window is between 4 to 6 weeks.',
        icon: 'schedule',
        iconColor: 'text-on-tertiary-container'
      }
    ],
    recommendedProposal: {
      title: 'Pico Discovery Session 2 of 3 + Post-Laser Calming Cryo',
      subtitle: 'Course continuation voucher applicable',
      offerAttached: false
    },
    cycles: [
      {
        protocolName: 'Pico Laser Protocol',
        category: 'Lifting',
        lastDate: '17 Aug 2026',
        lastTreatment: 'Pico Discovery Session 1',
        targetDate: '15 Sep',
        daysDiff: '+8d',
        isOverdue: true,
        overduePillText: '8 Days Overdue',
        overduePillType: 'neutral',
        progressPercent: 70
      }
    ],
    treatments: [
      {
        id: 't-301',
        name: 'Pico Discovery Laser (Acne Scar Protocol)',
        category: 'Laser',
        date: '17 Aug 2026',
        price: 29000,
        doctor: 'Dr. Kornvipa',
        statusBadge: 'Completed',
        statusType: 'secondary',
        details: 'Session 1 with fractional handpiece'
      }
    ],
    timeline: [
      {
        id: 'ev-301',
        title: 'Initial Procedure Completed',
        timestamp: '17 Aug 2026',
        icon: 'check_circle',
        iconBg: 'bg-secondary-container text-on-secondary-container',
        description: 'Tolerated well with minimal erythema.'
      }
    ]
  },
  {
    id: 'p-4',
    hn: 'RV009210',
    name: 'Khun Voranuch M.',
    nickname: 'คุณนุช',
    age: 46,
    gender: 'Female',
    nationality: 'Thai (TH/EN)',
    phone: '+66 84 999 8765',
    lineId: '@nuch.v',
    lineConnected: true,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCD7a9kaCm5UG0Z_D0AEMyqKAHkv4LsQ3UP6d0pznN_QRQ4Oo88xvFSHnpwjcL4NIjnBYoTu4hsQZ97HIuO6Gz0pjUVerkRudr6CVDFyE63-iNlhWJbo5VMFZErOV7PtMXPTzKaojddDgmFGC22Oh3D4dFIqRMSQQrO7ceXTFC91JtpwD2KA9yzZIb4rqpG_oGuCeFTIlV_rotqSZOxyS4mkuld0KwHPe7g5QcGDzNy_FAeV_wD0vBb',
    salesOwner: 'Khun May',
    salesOwnerRole: 'Senior Consultant',
    attendingDoctor: 'Dr. Vorapat',
    doctorSpecialty: 'Plastic Surgery & Aesthetic Medicine',
    branch: 'Thonglor Flagship',
    category: 'Champions',
    tier: 'Black Diamond Black Card',
    priorityScore: 84,
    priorityLevel: 'High',
    priorityReason: 'Ulthera 1-Year Recall • VIP Anniversary',
    lifetimeValue: 430000,
    trailing12M: 195000,
    avgTicket: 48000,
    completedVisits: 14,
    lastVisitRecencyDays: 14,
    lastVisitDate: '10 Sep 2026',
    rfmScore: {
      recencyScore: 5,
      frequencyScore: 5,
      monetaryScore: 5,
      recencyLabel: '14 days ago for facial maintenance.',
      frequencyLabel: '14 total visits.',
      monetaryLabel: '฿195K trailing 12M spend.',
      matrixVerdit: 'Premier champion client with annual Ulthera recall due this month.'
    },
    signals: [
      {
        title: 'Ulthera 1-Yr Anniversary Due',
        description: 'Annual SMAS collagen maintenance window active.',
        icon: 'update',
        iconColor: 'text-secondary'
      },
      {
        title: 'VIP Lounge Preference',
        description: 'Requires private suite booking with tea service.',
        icon: 'spa',
        iconColor: 'text-secondary'
      }
    ],
    recommendedProposal: {
      title: 'Ulthera SPT Full Face & Neck (800 Lines) + Complimentary Exosome Boost',
      subtitle: 'Black Diamond exclusive privilege (฿129,000)',
      offerAttached: false
    },
    cycles: [
      {
        protocolName: 'Ultherapy Deep SMAS',
        category: 'Lifting',
        lastDate: '24 Sep 2025',
        lastTreatment: 'Ulthera SPT 800 Lines',
        targetDate: '24 Sep',
        daysDiff: 'Due Now',
        isOverdue: false,
        overduePillText: 'Due This Week',
        overduePillType: 'secondary',
        progressPercent: 98
      }
    ],
    treatments: [
      {
        id: 't-401',
        name: 'Hydrafacial MD Platinum Care',
        category: 'Skin',
        date: '10 Sep 2026',
        price: 9500,
        doctor: 'Dr. Vorapat',
        statusBadge: 'Completed',
        statusType: 'secondary',
        details: 'Pre-lifting skin preparation'
      }
    ],
    timeline: [
      {
        id: 'ev-401',
        title: 'Anniversary Concierge Message Prepared',
        timestamp: '23 Sep 2026',
        icon: 'celebration',
        iconBg: 'bg-secondary text-on-secondary',
        description: 'VIP luxury gift box staged for collection.'
      }
    ]
  },
  {
    id: 'p-5',
    hn: 'RV010488',
    name: 'Khun Siriporn K.',
    nickname: 'คุณกานต์',
    age: 42,
    gender: 'Female',
    nationality: 'Thai (TH)',
    phone: '+66 81 777 3489',
    lineId: '@siriporn.k',
    lineConnected: true,
    avatarUrl: '',
    salesOwner: 'Khun Ann',
    salesOwnerRole: 'Consultant',
    attendingDoctor: 'Dr. Vorapat',
    doctorSpecialty: 'Aesthetic Medicine',
    branch: 'Thonglor Flagship',
    category: 'At Risk',
    tier: 'Gold Tier',
    priorityScore: 78,
    priorityLevel: 'High',
    priorityReason: 'Rejuran/PN Due (+45d)',
    lifetimeValue: 152000,
    trailing12M: 64000,
    avgTicket: 21333,
    completedVisits: 6,
    lastVisitRecencyDays: 145,
    lastVisitDate: '02 May 2026',
    rfmScore: {
      recencyScore: 2,
      frequencyScore: 4,
      monetaryScore: 4,
      recencyLabel: '145 days since last session.',
      frequencyLabel: '6 visits.',
      monetaryLabel: '฿64K 12M spend.',
      matrixVerdit: 'At-risk patient missing crucial skin booster cycle.'
    },
    signals: [
      {
        title: 'Incomplete Skin Cycle',
        description: 'Missed scheduled Rejuran session 3.',
        icon: 'priority_high',
        iconColor: 'text-error'
      }
    ],
    recommendedProposal: {
      title: 'Rejuran Healer (2cc) + Lidocaine Painless Technique',
      subtitle: 'Special re-engagement package ฿12,900',
      offerAttached: false
    },
    cycles: [
      {
        protocolName: 'Polynucleotide (PN)',
        category: 'Skin',
        lastDate: '02 May 2026',
        lastTreatment: 'Rejuran Healer Cycle 2',
        targetDate: '10 Aug',
        daysDiff: '+45d',
        isOverdue: true,
        overduePillText: '45 Days Overdue',
        overduePillType: 'error',
        progressPercent: 100
      }
    ],
    treatments: [],
    timeline: []
  },
  {
    id: 'p-6',
    hn: 'RV014382',
    name: 'Khun Kanyarat D.',
    nickname: 'คุณเดียร์',
    age: 31,
    gender: 'Female',
    nationality: 'Thai (TH)',
    phone: '+66 89 444 8832',
    lineId: '@kanya.d',
    lineConnected: true,
    avatarUrl: '',
    salesOwner: 'Khun May',
    salesOwnerRole: 'Senior Consultant',
    attendingDoctor: 'Dr. Kornvipa',
    doctorSpecialty: 'Dermatology & Laser',
    branch: 'Thonglor Flagship',
    category: 'Need Attention',
    tier: 'Silver Tier',
    priorityScore: 68,
    priorityLevel: 'Medium',
    priorityReason: 'Skin Booster cycle recommended',
    lifetimeValue: 86000,
    trailing12M: 45000,
    avgTicket: 17200,
    completedVisits: 5,
    lastVisitRecencyDays: 75,
    lastVisitDate: '11 Jul 2026',
    rfmScore: {
      recencyScore: 3,
      frequencyScore: 4,
      monetaryScore: 3,
      recencyLabel: '75 days since last visit.',
      frequencyLabel: '5 visits completed.',
      monetaryLabel: '฿45K trailing spend.',
      matrixVerdit: 'Steady patient candidate for cross-protocol skin hydration.'
    },
    signals: [
      {
        title: 'Skin Booster Recommended',
        description: 'Expressed interest in glowing skin glass complexion.',
        icon: 'flag',
        iconColor: 'text-surface-tint'
      }
    ],
    recommendedProposal: {
      title: 'Belotero Revive Hyaluronic Acid + Glycerol Glow Protocol',
      subtitle: 'Introductory 1st syringe offer ฿16,000',
      offerAttached: false
    },
    cycles: [
      {
        protocolName: 'Hyaluronic Skin Booster',
        category: 'Skin',
        lastDate: '11 Jul 2026',
        lastTreatment: 'Belotero Revive (1cc)',
        targetDate: '11 Oct',
        daysDiff: 'In 18d',
        isOverdue: false,
        overduePillText: 'Due Soon',
        overduePillType: 'neutral',
        progressPercent: 70
      }
    ],
    treatments: [],
    timeline: []
  }
];

export const CONSULTANT_LEADERBOARD: ConsultantPerformance[] = [
  {
    id: 'c-1',
    name: 'Khun May',
    role: 'Senior Consultant',
    avatarInitial: 'M',
    assigned: 310,
    contactRatePercent: 86,
    bookingRatePercent: 31,
    completedCount: 61,
    revenueGenerated: 720000,
    rank: 1,
    isTop: true
  },
  {
    id: 'c-2',
    name: 'Khun Ann',
    role: 'Consultant',
    avatarInitial: 'A',
    assigned: 282,
    contactRatePercent: 81,
    bookingRatePercent: 28,
    completedCount: 58,
    revenueGenerated: 650000,
    rank: 2
  },
  {
    id: 'c-3',
    name: 'Khun Joy',
    role: 'Consultant',
    avatarInitial: 'J',
    assigned: 294,
    contactRatePercent: 76,
    bookingRatePercent: 24,
    completedCount: 43,
    revenueGenerated: 510000,
    rank: 3
  },
  {
    id: 'c-4',
    name: 'Khun Fah',
    role: 'Associate Consultant',
    avatarInitial: 'F',
    assigned: 270,
    contactRatePercent: 72,
    bookingRatePercent: 20,
    completedCount: 24,
    revenueGenerated: 260000,
    rank: 4
  }
];

export const RFM_COHORTS_SUMMARY = [
  {
    name: 'Champions',
    count: 182,
    percent: 12,
    avgSpend: '฿185,000',
    color: 'bg-secondary',
    textColor: 'text-on-surface'
  },
  {
    name: 'Loyal VIPs',
    count: 328,
    percent: 22,
    avgSpend: '฿94,000',
    color: 'bg-surface-tint',
    textColor: 'text-on-surface'
  },
  {
    name: 'Promising Habit',
    count: 214,
    percent: 14,
    avgSpend: '฿52,000',
    color: 'bg-secondary-fixed-dim',
    textColor: 'text-on-surface'
  },
  {
    name: 'New Patients',
    count: 192,
    percent: 13,
    avgSpend: '฿31,000',
    color: 'bg-primary-fixed-dim',
    textColor: 'text-on-surface'
  },
  {
    name: 'Need Attention',
    count: 264,
    percent: 18,
    avgSpend: '฿44,000',
    color: 'bg-on-tertiary-container',
    textColor: 'text-on-surface'
  },
  {
    name: 'At Risk (In Danger)',
    count: 286,
    percent: 19,
    avgSpend: '฿88,000',
    color: 'bg-error',
    textColor: 'text-on-error-container',
    highlightBadge: 'LTV รวม ฿25.1M',
    isDanger: true
  },
  {
    name: 'Lost / Inactive',
    count: 621,
    percent: 30,
    avgSpend: 'อยู่ระหว่างแคมเปญดึงกลับ',
    color: 'bg-outline-variant',
    textColor: 'text-on-surface-variant'
  }
];

export const RETENTION_FUNNEL_STAGES = [
  {
    step: 1,
    name: 'ได้รับมอบหมายให้ติดตาม',
    patients: '1,420 ราย',
    rate: '100%',
    widthPercent: 100,
    color: 'bg-primary'
  },
  {
    step: 2,
    name: 'ติดต่อได้',
    patients: '1,083 ราย',
    rate: 'ติดต่อได้ 76.3%',
    widthPercent: 76.3,
    color: 'bg-primary'
  },
  {
    step: 3,
    name: 'ปรึกษาแล้วสนใจ',
    patients: '326 ราย',
    rate: 'สนใจ 30.1%',
    widthPercent: 30.1,
    color: 'bg-primary'
  },
  {
    step: 4,
    name: 'จองนัดแล้ว',
    patients: '241 นัด',
    rate: 'จองนัด 73.9%',
    widthPercent: 22.2,
    color: 'bg-secondary'
  },
  {
    step: 5,
    name: 'มารับบริการแล้ว',
    patients: '186 ครั้ง',
    rate: 'มาตามนัด 77.2%',
    widthPercent: 17.2,
    color: 'bg-secondary',
    isFinal: true
  }
];
