export type Region = 'USA' | 'Europe' | 'UK' | 'Germany' | 'Switzerland' | 'Scandinavia' | 'Other';

export type RankingTier = 
  | 'Top Tier (Rank 1-15)' 
  | 'High Ranked (Rank 16-50)' 
  | 'Mid Ranked (Rank 51-100)' 
  | 'Accessible / Balanced (Rank 100+)';

export type FieldCategory = 
  | 'Bioinformatics' 
  | 'Structural Biology' 
  | 'Computational Biology' 
  | 'Biophysics' 
  | 'Systems Biology' 
  | 'Genomics & Quantitative Genetics' 
  | 'AI / ML for Drug Discovery & Protein Design';

export interface PublishedPaper {
  title: string;
  journal: string;
  year: number;
  citations?: number;
  doi?: string;
  pmid?: string;
  summary: string;
  pdfUrl?: string;
}

export interface Professor {
  id: string;
  name: string;
  title: string;
  department: string;
  university: string;
  country: string;
  region: 'USA' | 'Europe';
  email: string;
  labWebsite: string;
  googleScholarUrl?: string;
  researchFocus: string;
  keyTechniques: string[];
  recentPapers: PublishedPaper[];
  acceptingStudents?: 'Verified Opening' | 'Likely Accepting' | 'Inquire via Email';
  fitReasoning?: string;
  matchScore?: number;
}

export interface ProgramRequirements {
  applicationFee: string;
  ielts: {
    minOverall: string;
    minSubscores?: string;
    isMandatory: string;
    details?: string;
  };
  toefl?: string;
  gre: string;
  minGpa?: string;
  requiredDocuments: Array<{
    name: string;
    description: string;
    mandatory: boolean;
  }>;
  feeWaiverAvailable?: boolean;
  feeWaiverDetails?: string;
}

export interface ProgramAcceptanceRate {
  overall: string; // e.g. "4.8%"
  foreignStudents: string; // e.g. "3.9%" (clearly stated foreign student acceptance rate)
  foreignCohortShare?: string; // e.g. "35% international students in cohort"
  totalApplicantsApprox?: string; // e.g. "~1,200 applicants / ~58 admitted"
  selectivityRating?: 'Extremely Selective' | 'Highly Selective' | 'Selective' | 'Moderate / Accessible';
}

export interface PhDProgram {
  id: string;
  title: string;
  university: string;
  department: string;
  location: string;
  country: string;
  region: 'USA' | 'Europe';
  field: FieldCategory;
  usNewsRank: number; // e.g. 1, 5, 18, 52, 105
  rankingTier: RankingTier;
  usNewsSearchUrl: string;
  googleSearchUrl: string;
  funding: {
    type: 'Fully Funded' | 'Stipend + Full Tuition' | 'Marie Skłodowska-Curie / Horizon' | 'NIH T32 / NSF GRFP Eligible' | 'Doctoral Fellowship';
    amount?: string; // e.g. "$45,000/yr + Health" or "€34,000/yr + Social Sec"
    healthInsuranceIncluded: boolean;
  };
  deadline: string; // YYYY-MM-DD
  cycle: string; // e.g. "Fall 2026", "Rolling 2026/2027"
  applicationFee: string;
  greRequired: 'Not Accepted' | 'No / Optional' | 'Required';
  englishRequirements?: string;
  description: string;
  curriculumHighlights: string[];
  suggestedProfessors: Professor[];
  resemblanceFactors: string[];
  programUrl: string;
  applicationUrl: string;
  matchScore?: number;
  tags: string[];
  requirements: ProgramRequirements;
  acceptanceRate: ProgramAcceptanceRate;
}

export interface UserPublication {
  title: string;
  journal: string;
  year: string;
  role: string;
  doi?: string;
  summary?: string;
}

export interface ResearchExperience {
  lab: string;
  institution: string;
  role: string;
  period: string;
  description: string;
  supervisor?: string;
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  currentInstitution: string;
  degree: string;
  gpa: string;
  targetField: string;
  subFields: string[];
  technicalSkills: string[];
  biologicalInterests: string[];
  preferredRegions: Region[];
  publications: UserPublication[];
  researchExperience: ResearchExperience[];
  testScores: {
    gre?: string;
    toefl?: string;
    ielts?: string;
  };
  fundingRequirement: 'fully_funded' | 'scholarship_needed' | 'self_funded_or_any';
  overallSummary?: string;
  cvFileName?: string;
  cvRawText?: string;
  lastUpdated: string;
}

export type ApplicationStatus = 
  | 'Saved'
  | 'Contacted PI'
  | 'Applied'
  | 'Interview'
  | 'Accepted'
  | 'Waitlisted'
  | 'Rejected';

export interface ColdEmailDraft {
  id: string;
  professorName: string;
  professorEmail: string;
  subject: string;
  body: string;
  paperReferenced?: string;
  createdAt: string;
}

export interface ApplicationItem {
  id: string;
  programId: string;
  university: string;
  programTitle: string;
  country: string;
  region: 'USA' | 'Europe';
  field?: string;
  status: ApplicationStatus;
  deadline: string;
  portalUrl?: string;
  targetProfessors: Array<{
    name: string;
    email: string;
    labWebsite?: string;
    status: 'Not Contacted' | 'Cold Emailed' | 'Meeting Scheduled' | 'Agreed to Support';
    notes?: string;
  }>;
  coldEmailDrafts?: ColdEmailDraft[];
  notes?: string;
  checklist: Array<{
    id: string;
    label: string;
    completed: boolean;
  }>;
  feeStatus: 'Paid' | 'Unpaid' | 'Waiver Requested' | 'Free';
  fundingInfo?: string;
  submittedDate?: string;
  createdAt?: string;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'deadline' | 'profile_update' | 'match_alert' | 'recommendation' | 'security' | 'system';
  severity?: 'info' | 'warning' | 'urgent';
  timestamp: string;
  read: boolean;
  programId?: string;
  daysUntilDeadline?: number;
}

export interface SOPDraft {
  id: string;
  programId: string;
  university: string;
  department: string;
  programTitle: string;
  selectedProfessorName?: string;
  title: string;
  fullContent: string;
  sections: {
    hookAndMotivation: string;
    academicBackgroundAndSkills: string;
    researchProjectsAndMethods: string;
    labAndProfessorAlignment: string;
    futureGoalsAndConclusion: string;
  };
  wordCount: number;
  targetedFaculty: string[];
  targetedPapers: string[];
  createdAt: string;
  modelUsed?: string;
}

export interface MultiFilterOptions {
  acceptanceRateRange: 'all' | 'under5' | '5to10' | '10to20' | 'over20';
  ieltsMaxRequired: 'all' | '6.5' | '7.0' | '7.5' | '8.0';
  gpaRequirement: 'all' | '3.0' | '3.5' | '3.8';
  grePolicy: 'all' | 'not-required' | 'not-accepted' | 'required';
  applicationFee: 'all' | 'free' | 'under100' | 'waiver-available';
  fundingType: 'all' | 'fully-funded' | 'fellowship';
}

export interface EncryptionConfig {
  isEnabled: boolean;
  passphrase?: string;
  lastSyncTimestamp?: string;
}

export interface BackgroundMatchNotification {
  id: string;
  program: PhDProgram;
  matchScore: number;
  reasons: string[];
  detectedAt: string;
  isNew: boolean;
}
