import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  ExternalLink, 
  Users, 
  Sparkles, 
  Send, 
  BookmarkPlus,
  ArrowRight,
  BookOpen,
  Award,
  Search,
  FileText,
  Globe2,
  Percent,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  DollarSign
} from 'lucide-react';
import { PhDProgram, Professor, ApplicationStatus } from '../types';

interface ProgramCardProps {
  program: PhDProgram;
  matchScore?: number;
  resemblanceReasons?: string[];
  onOpenDetails: (program: PhDProgram) => void;
  onOpenColdEmail: (professor: Professor, program: PhDProgram) => void;
  onAddToTracker: (program: PhDProgram, status: ApplicationStatus) => void;
  isAlreadyTracked?: boolean;
  trackedStatus?: ApplicationStatus;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  matchScore = 88,
  resemblanceReasons,
  onOpenDetails,
  onOpenColdEmail,
  onAddToTracker,
  isAlreadyTracked = false,
  trackedStatus,
}) => {
  const [showFullReqs, setShowFullReqs] = useState(false);

  // Calculate days remaining to deadline
  const today = new Date();
  const deadlineDate = new Date(program.deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-cyan-300 border-cyan-500/40 bg-cyan-500/15 shadow-[0_0_12px_rgba(6,182,212,0.2)]';
    if (score >= 75) return 'text-teal-300 border-teal-500/30 bg-teal-500/10';
    return 'text-amber-300 border-amber-500/30 bg-amber-500/10';
  };

  const getCountryFlag = (country: string) => {
    if (country.includes('USA')) return '🇺🇸';
    if (country.includes('UK') || country.includes('United Kingdom')) return '🇬🇧';
    if (country.includes('Germany')) return '🇩🇪';
    if (country.includes('Switzerland')) return '🇨🇭';
    if (country.includes('Sweden')) return '🇸🇪';
    if (country.includes('Denmark')) return '🇩🇰';
    if (country.includes('France')) return '🇫🇷';
    return '🇪🇺';
  };

  const getTierBadgeColor = (tier: string) => {
    if (tier.includes('1-15')) return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
    if (tier.includes('16-50')) return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
    if (tier.includes('51-100')) return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
  };

  return (
    <div className="bg-[#0c1016]/95 border border-slate-800/90 hover:border-cyan-500/50 rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-xl hover:shadow-[0_0_25px_rgba(6,182,212,0.12)] flex flex-col justify-between group backdrop-blur-sm">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            {/* University & Tier Tags */}
            <div className="flex items-center flex-wrap gap-1.5 mb-1.5">
              <span className="text-sm">{getCountryFlag(program.country)}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono">
                {program.university}
              </span>
              
              {/* US News Rank Badge */}
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 border border-amber-500/30 font-bold flex items-center space-x-1">
                <span>US News #{program.usNewsRank}</span>
              </span>

              {/* Ranking Tier */}
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getTierBadgeColor(program.rankingTier)}`}>
                {program.rankingTier}
              </span>
            </div>

            <h2 
              onClick={() => onOpenDetails(program)}
              className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition cursor-pointer line-clamp-2"
            >
              {program.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
              <MapPin className="h-3.5 w-3.5 text-slate-500" />
              <span>{program.location} ({program.country})</span>
            </p>
          </div>

          {/* AI Fit Match Badge */}
          <div className="shrink-0 flex flex-col items-end">
            <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl border font-bold text-xs ${getScoreColor(matchScore)}`}>
              <Sparkles className="h-3.5 w-3.5" />
              <span>{matchScore}% Fit</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 font-mono">{program.region}</span>
          </div>
        </div>

        {/* Live Search & US News Verification Links */}
        <div className="flex items-center flex-wrap gap-2 my-2.5">
          <a
            href={program.usNewsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/25 transition cursor-pointer"
            title="Search university on US News Best Graduate Schools"
          >
            <Search className="h-3 w-3 text-amber-400" />
            <span>Search on USNews.com</span>
            <ExternalLink className="h-2.5 w-2.5 ml-0.5 opacity-70" />
          </a>

          <a
            href={program.googleSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/25 transition cursor-pointer"
            title="Search university on Google for admissions, acceptance rate, and requirements"
          >
            <Globe2 className="h-3 w-3 text-cyan-400" />
            <span>Search on Google.com</span>
            <ExternalLink className="h-2.5 w-2.5 ml-0.5 opacity-70" />
          </a>
        </div>

        {/* SECTION: ACCEPTANCE RATE */}
        <div className="my-3 p-3 rounded-xl bg-gradient-to-br from-[#080d14] to-[#0c121c] border border-cyan-900/30 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 font-bold text-slate-200">
              <Percent className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-cyan-300 uppercase tracking-wider text-[11px]">Acceptance Rate & Selectivity</span>
            </div>
            {program.acceptanceRate?.selectivityRating && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 font-semibold">
                {program.acceptanceRate.selectivityRating}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-[#070a0f] border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Overall Acceptance</span>
              <span className="text-xs font-extrabold text-slate-100">
                {program.acceptanceRate?.overall || '5.2%'}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-cyan-950/30 border border-cyan-500/30">
              <span className="text-cyan-300 text-[10px] font-semibold block">Foreign Students Acceptance</span>
              <span className="text-xs font-black text-cyan-300 font-mono">
                {program.acceptanceRate?.foreignStudents || '4.1%'}
              </span>
            </div>
          </div>

          {program.acceptanceRate?.foreignCohortShare && (
            <p className="text-[11px] text-slate-400 italic">
              International Representation: <span className="text-slate-300 font-semibold">{program.acceptanceRate.foreignCohortShare}</span> ({program.acceptanceRate.totalApplicantsApprox || 'Competitive pool'})
            </p>
          )}
        </div>

        {/* SECTION: REQUIREMENTS */}
        <div className="my-3 p-3 rounded-xl bg-[#070a0f] border border-slate-800/90 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 font-bold text-slate-200">
              <FileText className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-amber-300 uppercase tracking-wider text-[11px]">Requirements & Application Docs</span>
            </div>
            <button
              type="button"
              onClick={() => setShowFullReqs(!showFullReqs)}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center space-x-0.5 cursor-pointer"
            >
              <span>{showFullReqs ? 'Collapse' : 'Full checklist'}</span>
              {showFullReqs ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* Application Fee */}
            <div className="p-2 rounded-lg bg-[#0c1016] border border-slate-800 flex items-start space-x-2">
              <DollarSign className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 text-[10px] block">Application Fee</span>
                <span className="font-semibold text-emerald-300 text-[11px]">
                  {program.requirements?.applicationFee || program.applicationFee}
                </span>
              </div>
            </div>

            {/* IELTS Score Requirement */}
            <div className="p-2 rounded-lg bg-[#0c1016] border border-amber-500/20 flex items-start space-x-2">
              <Award className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-amber-400 text-[10px] font-semibold block">IELTS Score Requirement</span>
                <span className="font-bold text-slate-100 text-[11px]">
                  {program.requirements?.ielts?.minOverall ? `Min ${program.requirements.ielts.minOverall} Overall (${program.requirements.ielts.minSubscores || '6.5+ subscores'})` : (program.englishRequirements || 'IELTS 7.0+ / TOEFL 90+')}
                </span>
              </div>
            </div>
          </div>

          {/* Collapsible Documents Checklist */}
          {showFullReqs ? (
            <div className="pt-2 border-t border-slate-800 space-y-1.5 animate-fadeIn">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Required Documents Checklist:
              </span>
              <ul className="space-y-1 text-[11px] text-slate-300">
                {(program.requirements?.requiredDocuments || [
                  { name: 'Statement of Purpose (SOP)', description: 'Research trajectory and lab alignment', mandatory: true },
                  { name: 'Curriculum Vitae (CV)', description: 'Academic resume with technical skills', mandatory: true },
                  { name: '3 Letters of Recommendation', description: 'From academic research mentors', mandatory: true },
                  { name: 'Official/Unofficial Transcripts', description: 'Undergraduate and Master transcripts', mandatory: true },
                  { name: 'IELTS / English Score Card', description: 'Standard language verification', mandatory: true }
                ]).map((doc, dIdx) => (
                  <li key={dIdx} className="flex items-start space-x-1.5 bg-[#0c1016] p-1.5 rounded border border-slate-800/80">
                    <Check className="h-3 w-3 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-200">{doc.name}</span>
                      <span className="text-slate-400 text-[10px] block">{doc.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
              {program.requirements?.feeWaiverAvailable && (
                <p className="text-[10px] text-emerald-400 bg-emerald-950/20 p-1.5 rounded border border-emerald-900/30">
                  ✓ Fee Waiver: {program.requirements.feeWaiverDetails || 'Available for eligible international applicants.'}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1 pt-1">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0c1016] text-slate-400 border border-slate-800">SOP / Personal Statement</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0c1016] text-slate-400 border border-slate-800">Academic CV</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0c1016] text-slate-400 border border-slate-800">3 Letters of Rec</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0c1016] text-slate-400 border border-slate-800">Transcripts</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">IELTS Score</span>
            </div>
          )}
        </div>

        {/* Funding & Key Dates Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2.5 p-2.5 rounded-xl bg-[#070a0f] border border-slate-800/80 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <Award className="h-4 w-4 text-cyan-400 shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 text-[10px] block">Funding</span>
              <span className="font-semibold text-cyan-300 truncate">{program.funding.type}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-slate-300">
            <Calendar className="h-4 w-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-slate-400 text-[10px] block">Deadline ({program.cycle})</span>
              <span className="font-semibold text-slate-200">
                {program.deadline}
                {diffDays >= 0 && (
                  <span className={`ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    diffDays <= 7 ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-cyan-300'
                  }`}>
                    {diffDays === 0 ? 'Today' : `${diffDays}d left`}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Resemblance Highlights */}
        <div className="mb-3">
          <span className="text-[11px] font-semibold text-cyan-300/90 uppercase tracking-wider block mb-1">
            Why this program matches your profile:
          </span>
          <ul className="space-y-1 text-xs text-slate-300">
            {(resemblanceReasons || program.resemblanceFactors).slice(0, 2).map((reason, idx) => (
              <li key={idx} className="flex items-start space-x-1.5">
                <span className="text-cyan-400 font-bold">›</span>
                <span className="line-clamp-2">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suggested Professors Preview */}
        <div className="space-y-2 mb-4 pt-2.5 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Users className="h-3.5 w-3.5 text-cyan-400" />
              <span>Matching Professors ({program.suggestedProfessors?.length || 0})</span>
            </span>
          </div>

          <div className="space-y-2">
            {(program.suggestedProfessors || []).slice(0, 2).map((prof) => (
              <div 
                key={prof.id} 
                className="p-2.5 rounded-xl bg-[#070a0f] border border-slate-800/90 hover:border-slate-700 transition space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-white block">{prof.name}</span>
                    <span className="text-[11px] text-slate-400 truncate block max-w-[240px] sm:max-w-xs">
                      {prof.title}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenColdEmail(prof, program);
                    }}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/25 transition shrink-0 cursor-pointer"
                    title="Draft custom cold email based on professor's latest paper"
                  >
                    <Send className="h-3 w-3" />
                    <span>Cold Email</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-300 line-clamp-1 italic">
                  Research: {prof.researchFocus}
                </p>

                {/* Latest Paper preview */}
                {prof.recentPapers && prof.recentPapers.length > 0 && (
                  <div className="flex items-center space-x-1 text-[11px] text-cyan-300/80 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-900/40 truncate">
                    <BookOpen className="h-3 w-3 shrink-0 text-cyan-400" />
                    <span className="truncate">Recent: "{prof.recentPapers[0].title}" ({prof.recentPapers[0].journal} {prof.recentPapers[0].year})</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => onOpenDetails(program)}
          className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 flex items-center space-x-1.5 py-1 cursor-pointer bg-cyan-500/10 hover:bg-cyan-500/20 px-3 rounded-lg border border-cyan-500/25 transition"
        >
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Generate SOP & View Details</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-center space-x-2">
          {isAlreadyTracked ? (
            <span className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center space-x-1 font-semibold">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>{trackedStatus || 'Tracked'}</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onAddToTracker(program, 'Saved')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#121824] hover:bg-[#182132] text-slate-200 border border-slate-700/80 hover:border-cyan-500/40 transition shadow-sm cursor-pointer"
            >
              <BookmarkPlus className="h-3.5 w-3.5 text-cyan-400" />
              <span>Add to Tracker</span>
            </button>
          )}

          <a
            href={program.programUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-[#070a0f] border border-slate-800 hover:border-slate-700 transition"
            title="Open official university portal"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
