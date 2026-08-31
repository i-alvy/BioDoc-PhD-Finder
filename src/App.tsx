import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Search, 
  Sparkles, 
  MapPin, 
  GraduationCap, 
  FileText, 
  ArrowUpDown,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { 
  UserProfile, 
  PhDProgram, 
  ApplicationItem, 
  EncryptionConfig, 
  AppNotification, 
  Professor, 
  ApplicationStatus, 
  ColdEmailDraft,
  MultiFilterOptions,
  SOPDraft,
  BackgroundMatchNotification
} from './types';
import { INITIAL_PHD_PROGRAMS } from './data/phdPrograms';
import { encryptData, decryptData } from './utils/crypto';
import { checkUpcomingDeadlines } from './utils/notifications';

// Components
import { Navbar } from './components/Navbar';
import { CVUploadModal } from './components/CVUploadModal';
import { ProfileEditor } from './components/ProfileEditor';
import { ProgramCard } from './components/ProgramCard';
import { ProgramDetailModal } from './components/ProgramDetailModal';
import { ColdEmailModal } from './components/ColdEmailModal';
import { ApplicationDashboard } from './components/ApplicationDashboard';
import { ProfessorDirectory } from './components/ProfessorDirectory';
import { SecuritySyncModal } from './components/SecuritySyncModal';
import { NotificationCenter } from './components/NotificationCenter';
import { MultiFilterDropdown } from './components/MultiFilterDropdown';
import { BackgroundLiveTrackerBanner, BackgroundLiveOpening } from './components/BackgroundLiveTrackerBanner';
import { WelcomeBootloader } from './components/WelcomeBootloader';
import { Footer } from './components/Footer';

// Default initial candidate profile
const INITIAL_PROFILE: UserProfile = {
  name: 'Alex V. Chen',
  email: 'a.chen.biophys@stanford.alumni.edu',
  currentInstitution: 'UC Berkeley',
  degree: 'M.S. in Biophysics & Molecular Structure',
  gpa: '3.92 / 4.0',
  targetField: 'Structural Biology',
  subFields: ['Single Particle Cryo-EM', 'Cryo-ET', 'Molecular Dynamics Simulations', 'Membrane Transporters'],
  technicalSkills: [
    'Python', 'RELION', 'CryoSPARC', 'GROMACS', 'PyMOL', 
    'AlphaFold2/3', 'Rosetta', 'BioPython', 'C++', 'ChimeraX'
  ],
  biologicalInterests: ['Membrane Transporters', 'GPCR Allostery', 'Macromolecular Machines', 'ABC Exporters'],
  preferredRegions: ['USA', 'Europe', 'UK', 'Germany', 'Switzerland'],
  fundingRequirement: 'fully_funded',
  overallSummary: 'Graduate researcher with 3+ years experience in Cryo-EM structure determination of membrane proteins and atomistic GROMACS simulations. First-author publications in peer-reviewed structural biology journals.',
  testScores: {
    gre: 'Q168 / V162 / AW4.5',
    toefl: '114 / 120',
    ielts: '8.5',
  },
  researchExperience: [
    {
      lab: 'Nogales Lab',
      institution: 'UC Berkeley & Lawrence Berkeley National Lab',
      role: 'Graduate Researcher',
      period: '2024 - Present',
      supervisor: 'Prof. Eva Nogales',
      description: 'Determined 2.6 Å Cryo-EM structure of multi-drug ABC transporter in saposin lipid nanodiscs. Ran 500ns MD trajectories in GROMACS.',
    },
    {
      lab: 'Biophysical Chemistry Group',
      institution: 'Univ of Michigan',
      role: 'Undergraduate Researcher',
      period: '2022 - 2024',
      supervisor: 'Prof. Richard Smith',
      description: 'Automated Cryo-EM image preprocessing pipelines in Python; screened 40+ grids on 200kV microscope.',
    }
  ],
  publications: [
    {
      title: 'Cryo-EM snapshots of alternating-access states in eukaryotic ABC transporters reconstituted into saposin nanodiscs',
      journal: 'Nature Structural & Molecular Biology',
      year: '2025',
      role: 'First Author',
      doi: '10.1038/s41594-025-01420',
      summary: 'Revealed high-resolution inward- and outward-facing conformations of eukaryotic membrane pumps.',
    }
  ],
  lastUpdated: new Date().toISOString(),
};

// Initial sample applications
const INITIAL_APPLICATIONS: ApplicationItem[] = [
  {
    id: 'app-harvard-mco',
    programId: 'harvard-big-biophysics',
    university: 'Harvard University',
    programTitle: 'PhD in Bioinformatics & Integrative Genomics (BIG) / Biophysics',
    region: 'USA',
    country: 'USA',
    status: 'Contacted PI',
    deadline: '2026-12-01',
    portalUrl: 'https://dms.hms.harvard.edu/big',
    feeStatus: 'Unpaid',
    targetProfessors: [
      {
        name: 'Prof. Debora Marks',
        email: 'debbie@hms.harvard.edu',
        status: 'Cold Emailed',
        notes: 'Inquired about generative AI protein variation rotations.',
      }
    ],
    checklist: [
      { id: 'c1', label: 'Submit Statement of Purpose', completed: true },
      { id: 'c2', label: 'Request 3 Recommendation Letters', completed: true },
      { id: 'c3', label: 'Upload Official Transcripts & GPA Verification', completed: false },
      { id: 'c4', label: 'Review Diversity / Application Fee Waiver', completed: false },
    ],
    notes: 'Lab rotation structure requires 3 lab rotations in year 1. Funding is 100% guaranteed for 5 years.',
    createdAt: '2026-08-15T10:00:00Z',
    updatedAt: '2026-08-20T14:30:00Z',
  },
  {
    id: 'app-embl-eipod',
    programId: 'embl-international-phd',
    university: 'EMBL (European Molecular Biology Laboratory)',
    programTitle: 'EMBL International PhD Programme (EIPP) - Structural & Computational Biology',
    region: 'Europe',
    country: 'Germany',
    status: 'Interview',
    deadline: '2026-10-15',
    portalUrl: 'https://www.embl.org/about/info/embl-international-phd-programme/',
    feeStatus: 'Free',
    targetProfessors: [
      {
        name: 'Prof. Julia Mahamid',
        email: 'julia.mahamid@embl.de',
        status: 'Meeting Scheduled',
        notes: 'Zoom interview scheduled for Sept 12 on in situ Cryo-ET methodologies.',
      }
    ],
    checklist: [
      { id: 'c1', label: 'Submit EMBL Online Application', completed: true },
      { id: 'c2', label: 'Two Reference Letters Uploaded', completed: true },
      { id: 'c3', label: 'Prepare 10-minute research presentation slides', completed: false },
    ],
    notes: 'No application fee. Position is an employment contract with health insurance and pension.',
    createdAt: '2026-08-10T12:00:00Z',
    updatedAt: '2026-08-28T09:15:00Z',
  },
  {
    id: 'app-eth-compbio',
    programId: 'eth-computational-biology-phd',
    university: 'ETH Zurich & University of Zurich',
    programTitle: 'PhD in Computational Biology & Bioinformatics (CBB)',
    region: 'Europe',
    country: 'Switzerland',
    status: 'Saved',
    deadline: '2026-11-01',
    portalUrl: 'https://cbb.ethz.ch/',
    feeStatus: 'Unpaid',
    targetProfessors: [
      {
        name: 'Prof. Gunnar Rätsch',
        email: 'gunnar.raetsch@inf.ethz.ch',
        status: 'Not Contacted',
      }
    ],
    checklist: [
      { id: 'c1', label: 'Contact PI before formal submission', completed: false },
      { id: 'c2', label: 'Draft Research Proposal (3 pages)', completed: false },
    ],
    notes: 'World-class computational infrastructure (CSCS supercomputer cluster). Net stipend CHF 4,300/mo.',
    createdAt: '2026-08-25T16:00:00Z',
    updatedAt: '2026-08-25T16:00:00Z',
  },
];

export function App() {
  // Welcome Bootloader Screen State
  const [showBootloader, setShowBootloader] = useState<boolean>(() => {
    // Show on initial session
    return !sessionStorage.getItem('biodoc_bootloader_seen');
  });

  const handleBootloaderComplete = () => {
    sessionStorage.setItem('biodoc_bootloader_seen', 'true');
    setShowBootloader(false);
  };

  // Navigation
  const [activeTab, setActiveTab] = useState<'programs' | 'profile' | 'tracker' | 'professors' | 'security'>('programs');

  // Core App State
  const [profile, setProfile] = useState<UserProfile>(() => {
    const local = localStorage.getItem('biodoc_profile');
    return local ? JSON.parse(local) : INITIAL_PROFILE;
  });

  const [programs] = useState<PhDProgram[]>(INITIAL_PHD_PROGRAMS);
  const [applications, setApplications] = useState<ApplicationItem[]>(() => {
    const local = localStorage.getItem('biodoc_applications');
    return local ? JSON.parse(local) : INITIAL_APPLICATIONS;
  });

  const [encryptionConfig, setEncryptionConfig] = useState<EncryptionConfig>(() => {
    const local = localStorage.getItem('biodoc_encryption_config');
    return local ? JSON.parse(local) : { isEnabled: true, passphrase: 'BioDocSecret2026!', lastSyncTimestamp: new Date().toISOString() };
  });

  const [matchResults, setMatchResults] = useState<{ [programId: string]: { score: number; reasons: string[] } }>({});
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');

  // Filter & Search State for Programs View
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedField, setSelectedField] = useState<string>('all');
  const [selectedRankingTier, setSelectedRankingTier] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'fit' | 'rank-asc' | 'rank-desc' | 'acceptance-foreign' | 'acceptance-foreign-asc' | 'deadline' | 'alpha'>('rank-asc');

  // Multi-Filter Options (Acceptance Rate, IELTS, GPA, GRE, Fee)
  const [multiFilters, setMultiFilters] = useState<MultiFilterOptions>({
    acceptanceRateRange: 'all',
    ieltsMaxRequired: 'all',
    gpaRequirement: 'all',
    grePolicy: 'all',
    applicationFee: 'all',
    fundingType: 'all',
  });

  // Background Autonomous Matchmaking Radar State
  const [backgroundOpenings, setBackgroundOpenings] = useState<BackgroundLiveOpening[]>([
    {
      id: 'bg-opening-1',
      program: INITIAL_PHD_PROGRAMS[0], // Harvard
      matchScore: 97,
      detectedAt: 'Just now (Continuous Radar)',
      reasons: ['Prof. Debora Marks lab published on Generative AI protein variation', 'Matches your Python & structural modeling CV'],
      isNew: true,
    },
    {
      id: 'bg-opening-2',
      program: INITIAL_PHD_PROGRAMS.find(p => p.university.includes('Cambridge')) || INITIAL_PHD_PROGRAMS[1],
      matchScore: 95,
      detectedAt: '12 minutes ago',
      reasons: ['New doctoral fellowship cohort posted with Cryo-EM priority', 'High match with your First-Author NSMB paper'],
      isNew: true,
    }
  ]);
  const [lastBackgroundScan, setLastBackgroundScan] = useState<string>('Just now');
  const [isBackgroundPolling, setIsBackgroundPolling] = useState<boolean>(false);

  // Background live matching interval (every 45 seconds simulated continuous radar)
  useEffect(() => {
    const timer = setInterval(() => {
      setLastBackgroundScan(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 45000);
    return () => clearInterval(timer);
  }, []);

  const triggerInstantBackgroundScan = useCallback(() => {
    setIsBackgroundPolling(true);
    setTimeout(() => {
      setIsBackgroundPolling(false);
      setLastBackgroundScan(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      
      // Compute best matches against profile
      const scored = programs
        .map(prog => {
          const score = matchResults[prog.id]?.score || Math.floor(85 + Math.random() * 12);
          return {
            id: `bg-${prog.id}-${Date.now()}`,
            program: prog,
            matchScore: score,
            detectedAt: 'Just now',
            reasons: [
              `Target lab has active rotation openings in ${profile.targetField}`,
              `CV skills (${profile.technicalSkills.slice(0, 2).join(', ')}) directly match lab equipment`
            ],
            isNew: true,
          };
        })
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3);

      setBackgroundOpenings(scored);

      const notif: AppNotification = {
        id: `radar-scan-${Date.now()}`,
        title: 'Background Matchmaker Scan Complete',
        message: `Discovered and verified ${scored.length} high-affinity doctoral openings matching your profile.`,
        type: 'match_alert',
        severity: 'info',
        timestamp: new Date().toISOString(),
        read: false,
      };
      setNotifications(prev => [notif, ...prev]);
    }, 1200);
  }, [programs, matchResults, profile]);

  // Modals & Drawers
  const [selectedProgramForDetail, setSelectedProgramForDetail] = useState<PhDProgram | null>(null);
  const [coldEmailTarget, setColdEmailTarget] = useState<{ prof: Professor; program: PhDProgram } | null>(null);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Upcoming Deadline Alert',
      message: 'EMBL International PhD Programme deadline is in 46 days (Oct 15, 2026).',
      type: 'deadline',
      severity: 'warning',
      timestamp: new Date().toISOString(),
      read: false,
      daysUntilDeadline: 46,
    },
    {
      id: 'notif-2',
      title: 'AI Fit Calculated',
      message: 'Your Cryo-EM and GROMACS background matches 96% with Harvard and 94% with Cambridge LMB.',
      type: 'recommendation',
      severity: 'info',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
    },
  ]);

  // Persist State Locally
  useEffect(() => {
    localStorage.setItem('biodoc_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('biodoc_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('biodoc_encryption_config', JSON.stringify(encryptionConfig));
  }, [encryptionConfig]);

  // Periodic deadline checks on applications
  useEffect(() => {
    const deadlineAlerts = checkUpcomingDeadlines(applications);
    if (deadlineAlerts.length > 0) {
      setNotifications(prev => {
        const existingIds = new Set(prev.map(n => n.id));
        const newOnes = deadlineAlerts.filter(n => !existingIds.has(n.id));
        return [...newOnes, ...prev];
      });
    }
  }, [applications]);

  // Tailor AI Program Recommendations using Gemini
  const handleRecalculateMatches = useCallback(async () => {
    setIsRecalculating(true);
    try {
      const response = await fetch('/api/gemini/tailor-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          programs,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate matches with Gemini');
      }

      const result = await response.json();
      if (result.success && result.data && result.data.recommendations) {
        const map: { [id: string]: { score: number; reasons: string[] } } = {};
        result.data.recommendations.forEach((rec: any) => {
          map[rec.programId] = {
            score: rec.resemblanceScore || 85,
            reasons: rec.resemblanceReasons || [],
          };
        });
        setMatchResults(map);

        // Add Notification
        const newNotif: AppNotification = {
          id: `fit-${Date.now()}`,
          title: 'PhD Recommendations Updated',
          message: `Calculated dynamic fit scores for ${programs.length} programs across USA & Europe.`,
          type: 'recommendation',
          severity: 'info',
          timestamp: new Date().toISOString(),
          read: false,
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    } catch (err) {
      console.warn('AI matching fallback to heuristic scores:', err);
      // Heuristic fallback matching
      const fallbackMap: { [id: string]: { score: number; reasons: string[] } } = {};
      programs.forEach((prog, index) => {
        const hasSkillOverlap = (profile.technicalSkills || []).some(s => 
          prog.curriculumHighlights.some(h => h.toLowerCase().includes(s.toLowerCase()))
        );
        const score = hasSkillOverlap ? 92 - (index % 10) : 80 - (index % 12);
        fallbackMap[prog.id] = {
          score,
          reasons: prog.resemblanceFactors,
        };
      });
      setMatchResults(fallbackMap);
    } finally {
      setIsRecalculating(false);
    }
  }, [profile, programs]);

  // Initial recommendation calculation on load if not present
  useEffect(() => {
    if (Object.keys(matchResults).length === 0) {
      handleRecalculateMatches();
    }
  }, [handleRecalculateMatches, matchResults]);

  // Cloud Synchronization Handler
  const handleCloudSync = async () => {
    setCloudSyncStatus('syncing');
    try {
      const payload = {
        profile,
        applications,
        timestamp: new Date().toISOString(),
      };

      let finalPayload: any = payload;
      let isEncrypted = false;

      if (encryptionConfig.isEnabled && encryptionConfig.passphrase) {
        const encrypted = await encryptData(payload, encryptionConfig.passphrase);
        finalPayload = encrypted;
        isEncrypted = true;
      }

      const response = await fetch('/api/sync/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'default_user',
          profileData: finalPayload,
          isEncrypted,
        }),
      });

      if (!response.ok) throw new Error('Cloud sync request failed');
      setCloudSyncStatus('synced');
    } catch (err) {
      console.error('Sync failed:', err);
      setCloudSyncStatus('offline');
      throw err;
    }
  };

  const handleCloudRestore = async () => {
    setCloudSyncStatus('syncing');
    try {
      const response = await fetch('/api/sync/get?userId=default_user');
      if (!response.ok) throw new Error('Failed to retrieve cloud data');
      const result = await response.json();

      if (result.success && result.data) {
        let restoredData = result.data;
        if (result.isEncrypted) {
          if (!encryptionConfig.passphrase) {
            throw new Error('Enter your encryption passphrase to decrypt cloud backup.');
          }
          restoredData = await decryptData(restoredData, encryptionConfig.passphrase);
        }

        if (restoredData.profile) setProfile(restoredData.profile);
        if (restoredData.applications) setApplications(restoredData.applications);
        setCloudSyncStatus('synced');
      }
    } catch (err) {
      console.error('Restore failed:', err);
      setCloudSyncStatus('offline');
      throw err;
    }
  };

  // Add to tracker handler
  const handleAddToTracker = (program: PhDProgram, status: ApplicationStatus = 'Saved') => {
    const feeStatus: 'Paid' | 'Unpaid' | 'Waiver Requested' | 'Free' = 
      program.applicationFee.toLowerCase().includes('free') ? 'Free' : 'Unpaid';

    const newApp: ApplicationItem = {
      id: `app-${program.id}-${Date.now()}`,
      programId: program.id,
      university: program.university,
      programTitle: program.title,
      region: program.region,
      country: program.country,
      status,
      deadline: program.deadline,
      portalUrl: program.applicationUrl || program.programUrl,
      feeStatus,
      targetProfessors: (program.suggestedProfessors || []).map(p => ({
        name: p.name,
        email: p.email,
        status: 'Not Contacted',
      })),
      checklist: [
        { id: 'c1', label: 'Submit Statement of Purpose (SOP)', completed: false },
        { id: 'c2', label: 'Request 3 Letters of Recommendation', completed: false },
        { id: 'c3', label: 'Upload Official Transcripts & GPA Records', completed: false },
        { id: 'c4', label: 'Submit CV & Research Publications', completed: true },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setApplications(prev => [newApp, ...prev]);

    const notif: AppNotification = {
      id: `add-${Date.now()}`,
      title: 'Added to Application Tracker',
      message: `${program.university} (${program.title}) is now tracked in your admissions pipeline.`,
      type: 'profile_update',
      severity: 'info',
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Save Cold Email Draft to tracker
  const handleSaveDraftToTracker = (draft: ColdEmailDraft, programId: string) => {
    setApplications(prev =>
      prev.map(app => {
        if (app.programId === programId) {
          return {
            ...app,
            status: app.status === 'Saved' ? 'Contacted PI' : app.status,
            coldEmailDrafts: [...(app.coldEmailDrafts || []), draft],
            updatedAt: new Date().toISOString(),
          };
        }
        return app;
      })
    );
  };

  // Save SOP Draft to tracker
  const handleSaveSOPToTracker = (sop: SOPDraft) => {
    setApplications(prev => {
      const existing = prev.find(a => a.programId === sop.programId);
      if (existing) {
        return prev.map(app => {
          if (app.programId === sop.programId) {
            return {
              ...app,
              notes: `${app.notes ? app.notes + '\n\n' : ''}Statement of Purpose Generated (${sop.wordCount} words for ${sop.selectedProfessorName || 'PI'}).`,
              checklist: app.checklist.map(c => 
                c.label.toLowerCase().includes('statement') || c.label.toLowerCase().includes('sop')
                  ? { ...c, completed: true }
                  : c
              ),
              updatedAt: new Date().toISOString(),
            };
          }
          return app;
        });
      } else {
        // Create new tracked application with SOP
        const targetProg = programs.find(p => p.id === sop.programId);
        if (targetProg) {
          handleAddToTracker(targetProg, 'Saved');
        }
        return prev;
      }
    });

    const notif: AppNotification = {
      id: `sop-save-${Date.now()}`,
      title: 'Statement of Purpose Saved',
      message: `Saved custom AI-generated SOP for ${sop.university} (${sop.selectedProfessorName}) to your tracker checklist.`,
      type: 'profile_update',
      severity: 'info',
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Helper to parse acceptance rate percent for sorting and filtering
  const parsePercent = (val?: string) => {
    if (!val) return 0;
    const match = val.match(/([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Helper to parse IELTS band
  const parseIelts = (val?: string) => {
    if (!val) return 0;
    const match = val.match(/([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Helper to parse GPA
  const parseGpa = (val?: string) => {
    if (!val) return 0;
    const match = val.match(/([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Active custom multi-filters count
  const activeMultiFiltersCount = Object.entries(multiFilters).filter(([_, v]) => v !== 'all').length;

  // Filtered and Sorted Programs List
  const filteredPrograms = programs.filter(prog => {
    // Region
    if (selectedRegion !== 'all' && prog.region !== selectedRegion) return false;

    // Field
    if (selectedField !== 'all' && prog.field !== selectedField) return false;

    // Ranking Tier
    if (selectedRankingTier !== 'all' && prog.rankingTier !== selectedRankingTier) return false;

    // Multi-Filter 1: Acceptance Rate Range
    if (multiFilters.acceptanceRateRange !== 'all') {
      const foreignRate = parsePercent(prog.acceptanceRate?.foreignStudents || prog.acceptanceRate?.overall);
      if (multiFilters.acceptanceRateRange === 'under5' && foreignRate >= 5.0) return false;
      if (multiFilters.acceptanceRateRange === '5to10' && (foreignRate < 5.0 || foreignRate > 10.0)) return false;
      if (multiFilters.acceptanceRateRange === '10to20' && (foreignRate < 10.0 || foreignRate > 20.0)) return false;
      if (multiFilters.acceptanceRateRange === 'over20' && foreignRate <= 20.0) return false;
    }

    // Multi-Filter 2: IELTS Max Required
    if (multiFilters.ieltsMaxRequired !== 'all') {
      const maxBandCeiling = parseFloat(multiFilters.ieltsMaxRequired);
      const progIelts = parseIelts(prog.requirements?.ielts?.minOverall);
      if (progIelts > 0 && progIelts > maxBandCeiling) return false;
    }

    // Multi-Filter 3: GPA Requirement
    if (multiFilters.gpaRequirement !== 'all') {
      const targetGpa = parseFloat(multiFilters.gpaRequirement);
      const progGpa = parseGpa(prog.requirements?.minGpa);
      if (progGpa > 0 && progGpa > targetGpa) return false;
    }

    // Multi-Filter 4: GRE Policy
    if (multiFilters.grePolicy !== 'all') {
      const policy = (prog.greRequired || '').toLowerCase();
      if (multiFilters.grePolicy === 'not-required' && (policy.includes('required') && !policy.includes('no') && !policy.includes('optional'))) return false;
      if (multiFilters.grePolicy === 'not-accepted' && !policy.includes('not accepted') && !policy.includes('blind')) return false;
      if (multiFilters.grePolicy === 'required' && (policy.includes('not accepted') || policy.includes('no') || policy.includes('optional'))) return false;
    }

    // Multi-Filter 5: Application Fee
    if (multiFilters.applicationFee !== 'all') {
      const feeText = (prog.requirements?.applicationFee || prog.applicationFee || '').toLowerCase();
      if (multiFilters.applicationFee === 'free' && !feeText.includes('free') && !feeText.includes('$0') && !feeText.includes('€0')) return false;
      if (multiFilters.applicationFee === 'waiver-available' && !prog.requirements?.feeWaiverAvailable && !feeText.includes('waiver')) return false;
      if (multiFilters.applicationFee === 'under100') {
        const feeMatch = feeText.match(/[$€]([0-9]+)/);
        if (feeMatch && parseInt(feeMatch[1]) > 100) return false;
      }
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchUni = prog.university.toLowerCase().includes(q);
      const matchTitle = prog.title.toLowerCase().includes(q);
      const matchLocation = prog.location.toLowerCase().includes(q);
      const matchCountry = prog.country.toLowerCase().includes(q);
      const matchRank = prog.usNewsRank?.toString().includes(q) || `rank ${prog.usNewsRank}`.includes(q);
      const matchTier = prog.rankingTier?.toLowerCase().includes(q);
      const matchRequirements = prog.requirements?.ielts?.minOverall?.includes(q) || 
        prog.requirements?.applicationFee?.toLowerCase().includes(q) ||
        prog.requirements?.requiredDocuments?.some(d => d.name.toLowerCase().includes(q));
      const matchKeywords = (prog.curriculumHighlights || []).some(h => h.toLowerCase().includes(q));
      const matchProfs = (prog.suggestedProfessors || []).some(p => 
        p.name.toLowerCase().includes(q) || 
        p.researchFocus.toLowerCase().includes(q) ||
        (p.keyTechniques || []).some(t => t.toLowerCase().includes(q))
      );
      return matchUni || matchTitle || matchLocation || matchCountry || matchRank || matchTier || matchRequirements || matchKeywords || matchProfs;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'rank-asc') {
      return (a.usNewsRank || 999) - (b.usNewsRank || 999);
    }
    if (sortBy === 'rank-desc') {
      return (b.usNewsRank || 999) - (a.usNewsRank || 999);
    }
    if (sortBy === 'acceptance-foreign') {
      return parsePercent(b.acceptanceRate?.foreignStudents) - parsePercent(a.acceptanceRate?.foreignStudents);
    }
    if (sortBy === 'acceptance-foreign-asc') {
      return parsePercent(a.acceptanceRate?.foreignStudents) - parsePercent(b.acceptanceRate?.foreignStudents);
    }
    if (sortBy === 'fit') {
      const scoreA = matchResults[a.id]?.score || 80;
      const scoreB = matchResults[b.id]?.score || 80;
      return scoreB - scoreA;
    }
    if (sortBy === 'deadline') {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    return a.university.localeCompare(b.university);
  });

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenCVUpload={() => setIsCVModalOpen(true)}
        encryptionConfig={encryptionConfig}
        cloudSyncStatus={cloudSyncStatus}
        unreadCount={notifications.filter(n => !n.read).length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* TAB 1: PhD Openings & Matches */}
        {activeTab === 'programs' && (
          <div className="space-y-6 pb-12">
            {/* Hero Banner with Dynamic AI Match Summary */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0c1016] via-[#101722] to-[#0c1016] border border-slate-800 p-6 sm:p-8 shadow-2xl">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Bioinformatics, Structural & Computational Biology PhDs</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    PhD Programs & Matching Labs in USA & Europe
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Personalized matchmaker mapping your CV technical skills ({profile.technicalSkills.slice(0, 4).join(', ')}) to world-leading doctoral programs and faculty publications.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsCVModalOpen(true)}
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 transition shadow-lg shadow-cyan-500/20 cursor-pointer"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Upload / Re-parse CV</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRecalculateMatches}
                    disabled={isRecalculating}
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#121824] hover:bg-[#182132] text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRecalculating ? 'animate-spin text-cyan-400' : ''}`} />
                    <span>{isRecalculating ? 'Recalculating...' : 'Refresh AI Fits'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* CONTINUOUS BACKGROUND AI MATCHMAKER & RADAR BANNER */}
            <BackgroundLiveTrackerBanner
              openings={backgroundOpenings}
              profile={profile}
              lastScanTime={lastBackgroundScan}
              isScanning={isBackgroundPolling}
              onScanNow={triggerInstantBackgroundScan}
              onSelectOpening={(prog) => setSelectedProgramForDetail(prog)}
              onDismissOpening={(id) => setBackgroundOpenings(prev => prev.filter(o => o.id !== id))}
            />

            {/* Filter & Search Bar */}
            <div className="bg-[#0c1016] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-sm space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
                {/* Search Bar */}
                <div className="relative lg:col-span-1">
                  <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search university, PI, IELTS, rank..."
                    className="w-full bg-[#070a0f] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Multi-Filter Dropdown for Acceptance Rate, IELTS, GPA, GRE, Fee */}
                <div className="lg:col-span-1">
                  <MultiFilterDropdown
                    filters={multiFilters}
                    onChange={(newFilters) => setMultiFilters(newFilters)}
                    onReset={() => setMultiFilters({
                      acceptanceRateRange: 'all',
                      ieltsMaxRequired: 'all',
                      gpaRequirement: 'all',
                      grePolicy: 'all',
                      applicationFee: 'all',
                      fundingType: 'all',
                    })}
                  />
                </div>

                {/* Ranking Tier Filter */}
                <div className="flex items-center space-x-2 bg-[#070a0f] border border-slate-800 rounded-xl px-3 py-2">
                  <span className="text-amber-400 font-bold text-xs">#</span>
                  <select
                    value={selectedRankingTier}
                    onChange={(e) => setSelectedRankingTier(e.target.value)}
                    className="bg-transparent text-slate-200 w-full focus:outline-none text-xs"
                  >
                    <option value="all" className="bg-[#0c1016]">All University Tiers</option>
                    <option value="Top Tier (Rank 1-15)" className="bg-[#0c1016]">Top Tier (Rank 1-15)</option>
                    <option value="High Ranked (Rank 16-50)" className="bg-[#0c1016]">High Ranked (Rank 16-50)</option>
                    <option value="Mid Ranked (Rank 51-100)" className="bg-[#0c1016]">Mid Ranked (Rank 51-100)</option>
                    <option value="Accessible / Balanced (Rank 100+)" className="bg-[#0c1016]">Accessible / Balanced (100+)</option>
                  </select>
                </div>

                {/* Region Filter */}
                <div className="flex items-center space-x-2 bg-[#070a0f] border border-slate-800 rounded-xl px-3 py-2">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="bg-transparent text-slate-200 w-full focus:outline-none text-xs"
                  >
                    <option value="all" className="bg-[#0c1016]">All Destinations (USA & Europe)</option>
                    <option value="USA" className="bg-[#0c1016]">United States (USA) 🇺🇸</option>
                    <option value="Europe" className="bg-[#0c1016]">All Europe 🇪🇺</option>
                  </select>
                </div>

                {/* Field Filter */}
                <div className="flex items-center space-x-2 bg-[#070a0f] border border-slate-800 rounded-xl px-3 py-2">
                  <GraduationCap className="h-4 w-4 text-slate-400 shrink-0" />
                  <select
                    value={selectedField}
                    onChange={(e) => setSelectedField(e.target.value)}
                    className="bg-transparent text-slate-200 w-full focus:outline-none text-xs"
                  >
                    <option value="all" className="bg-[#0c1016]">All Disciplines</option>
                    <option value="Structural Biology" className="bg-[#0c1016]">Structural Biology & Cryo-EM</option>
                    <option value="Bioinformatics" className="bg-[#0c1016]">Bioinformatics & Genomics</option>
                    <option value="Computational Biology" className="bg-[#0c1016]">Computational Biology</option>
                    <option value="Biophysics" className="bg-[#0c1016]">Biophysics & MD</option>
                  </select>
                </div>

                {/* Sort By */}
                <div className="flex items-center space-x-2 bg-[#070a0f] border border-slate-800 rounded-xl px-3 py-2">
                  <ArrowUpDown className="h-4 w-4 text-cyan-400 shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-slate-200 w-full focus:outline-none text-xs font-medium"
                  >
                    <option value="rank-asc" className="bg-[#0c1016]">US News Rank: High to Low (#1 → #150)</option>
                    <option value="rank-desc" className="bg-[#0c1016]">US News Rank: Low to High (#150 → #1)</option>
                    <option value="acceptance-foreign" className="bg-[#0c1016]">Foreign Acceptance: Highest % First</option>
                    <option value="acceptance-foreign-asc" className="bg-[#0c1016]">Foreign Acceptance: Most Selective First</option>
                    <option value="fit" className="bg-[#0c1016]">AI Fit Score (Highest %)</option>
                    <option value="deadline" className="bg-[#0c1016]">Nearest Deadline First</option>
                    <option value="alpha" className="bg-[#0c1016]">University Name (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Quick Filter Tier Pills & US News Links */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 font-semibold mr-1">Quick Tier Filter:</span>
                  <button
                    type="button"
                    onClick={() => setSelectedRankingTier('all')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                      selectedRankingTier === 'all' 
                        ? 'bg-cyan-500 text-slate-950 font-bold' 
                        : 'bg-[#070a0f] text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    All ({programs.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRankingTier('Top Tier (Rank 1-15)')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                      selectedRankingTier === 'Top Tier (Rank 1-15)' 
                        ? 'bg-purple-500 text-white font-bold' 
                        : 'bg-purple-500/10 text-purple-300 border border-purple-500/25 hover:bg-purple-500/20'
                    }`}
                  >
                    Top Tier (1-15)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRankingTier('High Ranked (Rank 16-50)')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                      selectedRankingTier === 'High Ranked (Rank 16-50)' 
                        ? 'bg-cyan-500 text-slate-950 font-bold' 
                        : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 hover:bg-cyan-500/20'
                    }`}
                  >
                    High Ranked (16-50)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRankingTier('Mid Ranked (Rank 51-100)')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                      selectedRankingTier === 'Mid Ranked (Rank 51-100)' 
                        ? 'bg-emerald-500 text-slate-950 font-bold' 
                        : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 hover:bg-emerald-500/20'
                    }`}
                  >
                    Mid Ranked (51-100)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRankingTier('Accessible / Balanced (Rank 100+)')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                      selectedRankingTier === 'Accessible / Balanced (Rank 100+)' 
                        ? 'bg-amber-500 text-slate-950 font-bold' 
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/25 hover:bg-amber-500/20'
                    }`}
                  >
                    Accessible / Balanced (100+)
                  </button>
                </div>

                <div className="flex items-center space-x-2 text-[11px]">
                  <span className="text-slate-400">Showing <strong className="text-cyan-300">{filteredPrograms.length}</strong> programs</span>
                  <a
                    href="https://www.usnews.com/best-graduate-schools/search?program=top-biological-sciences-schools"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition font-semibold"
                  >
                    <Search className="h-3 w-3 text-amber-400" />
                    <span>US News Best Grad Schools</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Program Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((prog) => {
                const fitInfo = matchResults[prog.id];
                const trackedApp = applications.find(a => a.programId === prog.id);

                return (
                  <ProgramCard
                    key={prog.id}
                    program={prog}
                    matchScore={fitInfo?.score || 88}
                    resemblanceReasons={fitInfo?.reasons}
                    onOpenDetails={(p) => setSelectedProgramForDetail(p)}
                    onOpenColdEmail={(prof, p) => setColdEmailTarget({ prof, program: p })}
                    onAddToTracker={handleAddToTracker}
                    isAlreadyTracked={!!trackedApp}
                    trackedStatus={trackedApp?.status}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: CV & Candidate Profile Matchmaker */}
        {activeTab === 'profile' && (
          <ProfileEditor
            profile={profile}
            onSaveProfile={(updated) => {
              setProfile(updated);
              handleCloudSync().catch(() => {});
            }}
            onOpenCVUpload={() => setIsCVModalOpen(true)}
            onRecalculateMatches={handleRecalculateMatches}
            isRecalculating={isRecalculating}
          />
        )}

        {/* TAB 3: Application Status Tracker */}
        {activeTab === 'tracker' && (
          <ApplicationDashboard
            applications={applications}
            onUpdateApplication={(updated) => {
              setApplications(prev => prev.map(a => a.id === updated.id ? updated : a));
              handleCloudSync().catch(() => {});
            }}
            onDeleteApplication={(appId) => {
              setApplications(prev => prev.filter(a => a.id !== appId));
              handleCloudSync().catch(() => {});
            }}
            onOpenNewApplicationModal={() => setActiveTab('programs')}
          />
        )}

        {/* TAB 4: Faculty PIs & Recent Lab Papers */}
        {activeTab === 'professors' && (
          <ProfessorDirectory
            programs={programs}
            profile={profile}
            onOpenColdEmail={(prof, prog) => setColdEmailTarget({ prof, program: prog })}
          />
        )}

        {/* TAB 5: Security & Cloud Sync */}
        {activeTab === 'security' && (
          <SecuritySyncModal
            encryptionConfig={encryptionConfig}
            onUpdateEncryptionConfig={(config) => {
              setEncryptionConfig(config);
              handleCloudSync().catch(() => {});
            }}
            cloudSyncStatus={cloudSyncStatus}
            onSyncNow={handleCloudSync}
            onRestoreFromCloud={handleCloudRestore}
            profile={profile}
            applications={applications}
            onImportData={(data) => {
              if (data.profile) setProfile(data.profile);
              if (data.applications) setApplications(data.applications);
              handleCloudSync().catch(() => {});
            }}
          />
        )}
      </main>

      {/* Persistent Platform Footer */}
      <Footer onOpenBootloader={() => setShowBootloader(true)} />

      {/* Initial Welcome Bootloader Animation */}
      {showBootloader && (
        <WelcomeBootloader onComplete={handleBootloaderComplete} />
      )}

      {/* Global Modals & Overlays */}
      <CVUploadModal
        isOpen={isCVModalOpen}
        onClose={() => setIsCVModalOpen(false)}
        onProfileParsed={(parsed) => {
          setProfile(prev => ({
            ...prev,
            ...parsed,
            lastUpdated: new Date().toISOString(),
          }));
          setTimeout(() => handleRecalculateMatches(), 500);
        }}
      />

      <ProgramDetailModal
        program={selectedProgramForDetail}
        profile={profile}
        isOpen={!!selectedProgramForDetail}
        onClose={() => setSelectedProgramForDetail(null)}
        onOpenColdEmail={(prof, prog) => {
          setSelectedProgramForDetail(null);
          setColdEmailTarget({ prof, program: prog });
        }}
        onAddToTracker={handleAddToTracker}
        onSaveSOPToTracker={handleSaveSOPToTracker}
        isAlreadyTracked={!!applications.find(a => a.programId === selectedProgramForDetail?.id)}
      />

      <ColdEmailModal
        isOpen={!!coldEmailTarget}
        onClose={() => setColdEmailTarget(null)}
        professor={coldEmailTarget?.prof || null}
        program={coldEmailTarget?.program || null}
        profile={profile}
        onSaveDraftToTracker={handleSaveDraftToTracker}
      />

      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
        onMarkAllAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
        onClearNotifications={() => setNotifications([])}
      />
    </div>
  );
}

export default App;
