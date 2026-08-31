import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Award, 
  ExternalLink, 
  Send, 
  Check, 
  BookOpen, 
  Mail, 
  Globe, 
  Sparkles, 
  BookmarkPlus,
  FileCheck,
  GraduationCap,
  Copy,
  Search,
  Globe2,
  Percent,
  DollarSign,
  FileText,
  AlertCircle
} from 'lucide-react';
import { PhDProgram, Professor, ApplicationStatus, UserProfile, SOPDraft } from '../types';
import { SOPGeneratorSection } from './SOPGeneratorSection';

interface ProgramDetailModalProps {
  program: PhDProgram | null;
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onOpenColdEmail: (professor: Professor, program: PhDProgram) => void;
  onAddToTracker: (program: PhDProgram, status: ApplicationStatus) => void;
  onSaveSOPToTracker?: (sop: SOPDraft) => void;
  isAlreadyTracked?: boolean;
}

export const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  program,
  profile,
  isOpen,
  onClose,
  onOpenColdEmail,
  onAddToTracker,
  onSaveSOPToTracker,
  isAlreadyTracked = false,
}) => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  if (!isOpen || !program) return null;

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2500);
  };

  const getTierBadgeColor = (tier: string) => {
    if (tier?.includes('1-15')) return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
    if (tier?.includes('16-50')) return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
    if (tier?.includes('51-100')) return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070a]/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0c1016] border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-[#0c1016] flex items-start justify-between">
          <div>
            <div className="flex items-center flex-wrap gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                {program.university}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 border border-amber-500/30 font-bold">
                US News #{program.usNewsRank}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getTierBadgeColor(program.rankingTier)}`}>
                {program.rankingTier}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#070a0f] text-slate-300 border border-slate-800">
                {program.field}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 font-bold">
                {program.region}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">{program.title}</h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-500" />
              <span>{program.department} • {program.location} ({program.country})</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition shrink-0 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Search on US News & Google */}
          <div className="flex items-center flex-wrap gap-2.5 p-3 rounded-xl bg-[#070a0f] border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Verify & Search:</span>
            <a
              href={program.usNewsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition cursor-pointer"
            >
              <Search className="h-3.5 w-3.5 text-amber-400" />
              <span>Search on USNews.com</span>
              <ExternalLink className="h-3 w-3 ml-0.5 opacity-70" />
            </a>

            <a
              href={program.googleSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition cursor-pointer"
            >
              <Globe2 className="h-3.5 w-3.5 text-cyan-400" />
              <span>Search on Google.com</span>
              <ExternalLink className="h-3 w-3 ml-0.5 opacity-70" />
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#070a0f] border border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">Funding Package</span>
              <span className="text-xs font-bold text-emerald-400">{program.funding.type}</span>
              <span className="text-[10px] text-slate-400 block truncate">{program.funding.amount || 'Full fellowship'}</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">Application Deadline</span>
              <span className="text-xs font-bold text-amber-400">{program.deadline}</span>
              <span className="text-[10px] text-slate-400 block">{program.cycle}</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">GRE Policy</span>
              <span className="text-xs font-bold text-slate-200">{program.greRequired}</span>
              <span className="text-[10px] text-slate-400 block">Fee: {program.applicationFee}</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">English Proficiency</span>
              <span className="text-xs font-bold text-slate-200 truncate block">
                {program.requirements?.ielts?.minOverall ? `IELTS ${program.requirements.ielts.minOverall}+` : (program.englishRequirements || 'IELTS 7.0+')}
              </span>
              <span className="text-[10px] text-slate-400 block truncate">{program.requirements?.toefl || 'TOEFL 90+'}</span>
            </div>
          </div>

          {/* SECTION: ACCEPTANCE RATE */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-[#080d14] to-[#0d1420] border border-cyan-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <Percent className="h-4 w-4 text-cyan-400" />
                <span>Acceptance Rate & International Student Statistics</span>
              </h2>
              {program.acceptanceRate?.selectivityRating && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold">
                  {program.acceptanceRate.selectivityRating}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#070a0f] border border-slate-800">
                <span className="text-slate-400 text-xs block">Overall Acceptance Rate</span>
                <span className="text-lg font-black text-slate-100 mt-0.5 block">
                  {program.acceptanceRate?.overall || '5.2%'}
                </span>
                <span className="text-[11px] text-slate-500">General applicant pool</span>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40">
                <span className="text-cyan-300 text-xs font-bold block">Foreign Students Acceptance Rate</span>
                <span className="text-lg font-black text-cyan-300 font-mono mt-0.5 block">
                  {program.acceptanceRate?.foreignStudents || '4.1%'}
                </span>
                <span className="text-[11px] text-cyan-400/80">Percentage of foreign candidates admitted</span>
              </div>

              <div className="p-3 rounded-xl bg-[#070a0f] border border-slate-800">
                <span className="text-slate-400 text-xs block">International Cohort Representation</span>
                <span className="text-sm font-bold text-slate-200 mt-1 block">
                  {program.acceptanceRate?.foreignCohortShare || '35% of total cohort'}
                </span>
                <span className="text-[11px] text-slate-400 truncate block">
                  {program.acceptanceRate?.totalApplicantsApprox || 'Competitive intake'}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION: REQUIREMENTS */}
          <div className="p-5 rounded-xl bg-[#070a0f] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <FileText className="h-4 w-4 text-amber-400" />
                <span>Admission Requirements & Required Application Documents</span>
              </h2>
            </div>

            {/* Fee & IELTS Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Application Fee */}
              <div className="p-3 rounded-xl bg-[#0c1016] border border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-semibold">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Application Fee</span>
                </div>
                <p className="text-sm font-bold text-emerald-300">
                  {program.requirements?.applicationFee || program.applicationFee}
                </p>
                {program.requirements?.feeWaiverAvailable && (
                  <p className="text-[11px] text-slate-300 bg-emerald-950/20 p-2 rounded border border-emerald-900/30 mt-1">
                    <strong>Fee Waiver:</strong> {program.requirements.feeWaiverDetails}
                  </p>
                )}
              </div>

              {/* IELTS & TOEFL Score Requirements */}
              <div className="p-3 rounded-xl bg-[#0c1016] border border-amber-500/25 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-semibold">
                  <Award className="h-3.5 w-3.5 text-amber-400" />
                  <span>IELTS Score Requirements (Mandatory for Foreign Students)</span>
                </div>
                <p className="text-sm font-extrabold text-slate-100">
                  {program.requirements?.ielts?.minOverall 
                    ? `Minimum ${program.requirements.ielts.minOverall} Overall (${program.requirements.ielts.minSubscores || '7.0 subscores'})` 
                    : (program.englishRequirements || 'IELTS 7.0+')}
                </p>
                {program.requirements?.ielts?.details && (
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {program.requirements.ielts.details}
                  </p>
                )}
                {program.requirements?.toefl && (
                  <p className="text-[11px] text-slate-400">
                    TOEFL Equivalent: <strong className="text-slate-200">{program.requirements.toefl}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Required Documents List */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-300 block">
                Required Application Documents:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(program.requirements?.requiredDocuments || [
                  { name: 'Statement of Purpose (SOP)', description: '1,000 - 1,500 words outlining research goals', mandatory: true },
                  { name: 'Curriculum Vitae (CV)', description: 'Academic CV listing publications and techniques', mandatory: true },
                  { name: '3 Letters of Recommendation', description: 'Submitted online by research supervisors', mandatory: true },
                  { name: 'Official Academic Transcripts', description: 'Scanned transcripts for all degree programs', mandatory: true },
                  { name: 'IELTS / TOEFL Official Score Report', description: 'Direct test agency score transmission', mandatory: true },
                ]).map((doc, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#0c1016] border border-slate-800 flex items-start space-x-2">
                    <Check className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-semibold text-xs text-white">{doc.name}</span>
                        {doc.mandatory && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-bold">
                            Mandatory
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{doc.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Program Overview */}
          <div>
            <h2 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
              <GraduationCap className="h-4 w-4 text-cyan-400" />
              <span>Program Overview & Doctoral Training</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">{program.description}</p>
          </div>

          {/* Curriculum Highlights */}
          <div>
            <h2 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
              <FileCheck className="h-4 w-4 text-cyan-400" />
              <span>Key Curriculum & Facility Highlights</span>
            </h2>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {program.curriculumHighlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Resemblance Factors */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/30">
            <h2 className="text-xs font-bold text-cyan-300 mb-2 flex items-center space-x-1.5 uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Academic Resemblance & Profile Alignment</span>
            </h2>
            <ul className="space-y-1.5 text-xs text-slate-200">
              {program.resemblanceFactors.map((factor, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* SECTION: AUTOMATED AI STATEMENT OF PURPOSE (SOP) GENERATOR */}
          <SOPGeneratorSection
            program={program}
            profile={profile}
            onSaveSOPToTracker={onSaveSOPToTracker}
          />

          {/* Suggested Professors with Papers & Cold Email Generator */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-cyan-400" />
                <span>Suggested Faculty PIs, Lab Interests & Recent Papers</span>
              </h2>
            </div>

            <div className="space-y-4">
              {program.suggestedProfessors.map((prof) => (
                <div 
                  key={prof.id} 
                  className="p-4 rounded-xl bg-[#070a0f] border border-slate-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-white">{prof.name}</span>
                        {prof.acceptingStudents && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
                            {prof.acceptingStudents}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">{prof.title} • {prof.department}</span>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => copyEmail(prof.email)}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs bg-[#121824] hover:bg-[#182132] text-slate-200 border border-slate-700 transition cursor-pointer"
                        title="Copy Professor Email"
                      >
                        {copiedEmail === prof.email ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Copy className="h-3 w-3 text-slate-400" />
                        )}
                        <span className="font-mono text-[11px]">{copiedEmail === prof.email ? 'Copied' : prof.email}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenColdEmail(prof, program)}
                        className="flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 transition shadow-sm cursor-pointer"
                      >
                        <Send className="h-3 w-3" />
                        <span>AI Cold Email</span>
                      </button>
                    </div>
                  </div>

                  {/* Research Focus & Techniques */}
                  <p className="text-xs text-slate-300">
                    <strong className="text-slate-200">Research Focus:</strong> {prof.researchFocus}
                  </p>

                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[11px] text-slate-400">Techniques:</span>
                    {prof.keyTechniques.map((tech) => (
                      <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121824] text-cyan-300 border border-slate-700">
                        {tech}
                      </span>
                    ))}
                    {prof.labWebsite && (
                      <a
                        href={prof.labWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-cyan-400 hover:underline flex items-center space-x-1 ml-2"
                      >
                        <Globe className="h-3 w-3" />
                        <span>Lab Website</span>
                      </a>
                    )}
                  </div>

                  {/* Published Papers Section */}
                  {prof.recentPapers && prof.recentPapers.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Recent Representative Publications (2024 - 2026):
                      </span>
                      <div className="space-y-2">
                        {prof.recentPapers.map((paper, pIdx) => (
                          <div key={pIdx} className="p-2.5 rounded-lg bg-[#0c1016] border border-slate-800 text-xs space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-semibold text-slate-200">
                                "{paper.title}"
                              </span>
                              <span className="text-[10px] font-bold text-cyan-400 shrink-0 font-mono">
                                {paper.journal} ({paper.year})
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 italic">{paper.summary}</p>
                            {paper.doi && (
                              <div className="text-[10px] font-mono text-slate-500">
                                DOI: <span className="text-slate-400">{paper.doi}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#0c1016] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center space-x-3">
            {!isAlreadyTracked ? (
              <button
                type="button"
                onClick={() => onAddToTracker(program, 'Saved')}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#121824] hover:bg-[#182132] text-white border border-slate-700 transition cursor-pointer"
              >
                <BookmarkPlus className="h-4 w-4 text-cyan-400" />
                <span>Add to Tracker</span>
              </button>
            ) : (
              <span className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                Application Tracked
              </span>
            )}

            <a
              href={program.applicationUrl || program.programUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition shadow-sm"
            >
              <span>Official Apply Portal</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
