import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Globe, 
  BookOpen, 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Building2, 
  MapPin, 
  Loader2,
  ExternalLink,
  BrainCircuit
} from 'lucide-react';
import { Professor, PhDProgram, UserProfile } from '../types';

interface ProfessorDirectoryProps {
  programs: PhDProgram[];
  profile: UserProfile;
  onOpenColdEmail: (professor: Professor, program: PhDProgram) => void;
}

export const ProfessorDirectory: React.FC<ProfessorDirectoryProps> = ({
  programs,
  profile,
  onOpenColdEmail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedTech, setSelectedTech] = useState<string>('all');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [deepDiveData, setDeepDiveData] = useState<{ [profId: string]: any }>({});
  const [loadingDeepDive, setLoadingDeepDive] = useState<string | null>(null);

  // Flatten all professors with their parent program info
  const allProfessorsWithProgram = programs.flatMap((prog) =>
    (prog.suggestedProfessors || []).map((prof) => ({
      prof,
      program: prog,
    }))
  );

  // Extract all unique techniques
  const allTechniques = Array.from(
    new Set(allProfessorsWithProgram.flatMap((p) => p.prof.keyTechniques || []))
  ).sort();

  const filteredProfs = allProfessorsWithProgram.filter(({ prof, program }) => {
    // Region filter
    if (selectedRegion !== 'all' && program.region !== selectedRegion) return false;

    // Tech filter
    if (selectedTech !== 'all' && !prof.keyTechniques?.includes(selectedTech)) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = prof.name.toLowerCase().includes(q);
      const matchUni = program.university.toLowerCase().includes(q);
      const matchFocus = prof.researchFocus.toLowerCase().includes(q);
      const matchTech = (prof.keyTechniques || []).some((t) => t.toLowerCase().includes(q));
      const matchPapers = (prof.recentPapers || []).some(
        (paper) => paper.title.toLowerCase().includes(q) || paper.journal.toLowerCase().includes(q)
      );
      return matchName || matchUni || matchFocus || matchTech || matchPapers;
    }

    return true;
  });

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2500);
  };

  const handleDeepDive = async (prof: Professor, program: PhDProgram) => {
    if (deepDiveData[prof.id]) return;
    setLoadingDeepDive(prof.id);

    try {
      const response = await fetch('/api/gemini/professor-deepdive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professorName: prof.name,
          university: program.university,
          field: prof.researchFocus,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch AI Deep Dive');
      const result = await response.json();
      if (result.success && result.data) {
        setDeepDiveData((prev) => ({ ...prev, [prof.id]: result.data }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDeepDive(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-[#0c1016]/90 border border-slate-800/90 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">Faculty PIs & Recent Lab Publications</h1>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 font-semibold">
                {allProfessorsWithProgram.length} Verified Professors
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Explore leading principal investigators across USA and European institutions, review 2024–2026 published papers, and generate tailored cold emails.
            </p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          {/* Search bar */}
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PI name, Cryo-EM, AlphaFold, GROMACS, cancer..."
              className="w-full bg-[#070a0f] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Region selector */}
          <div className="flex items-center space-x-2 bg-[#070a0f] border border-slate-800 rounded-xl px-3 py-2 text-xs">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent text-slate-200 w-full focus:outline-none text-xs"
            >
              <option value="all">All Regions (USA & Europe)</option>
              <option value="USA">USA Only 🇺🇸</option>
              <option value="Europe">All Europe 🇪🇺</option>
              <option value="UK">United Kingdom 🇬🇧</option>
              <option value="Germany">Germany (Max Planck) 🇩🇪</option>
              <option value="Switzerland">Switzerland (ETH / EPFL) 🇨🇭</option>
              <option value="Scandinavia">Scandinavia (Karolinska) 🇸🇪</option>
            </select>
          </div>

          {/* Technique filter */}
          <div className="flex items-center space-x-2 bg-[#070a0f] border border-slate-800 rounded-xl px-3 py-2 text-xs">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="bg-transparent text-slate-200 w-full focus:outline-none text-xs"
            >
              <option value="all">All Methods & Tech ({allTechniques.length})</option>
              {allTechniques.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Professors */}
      {filteredProfs.length === 0 ? (
        <div className="bg-[#0c1016]/40 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-2">
          <Users className="h-8 w-8 mx-auto text-slate-600" />
          <p className="text-sm font-semibold text-slate-300">No professors match your current search filters.</p>
          <p className="text-xs text-slate-500">Try clearing query keywords or changing the method filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredProfs.map(({ prof, program }) => {
            const deepDive = deepDiveData[prof.id];
            const isDeepDiving = loadingDeepDive === prof.id;

            return (
              <div
                key={`${program.id}-${prof.id}`}
                className="bg-[#0c1016]/90 border border-slate-800/90 hover:border-cyan-500/50 rounded-2xl p-5 shadow-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.12)] space-y-4 flex flex-col justify-between backdrop-blur-sm"
              >
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-bold text-cyan-400 font-mono uppercase">
                          {program.university}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#070a0f] text-slate-300 border border-slate-800">
                          {program.region}
                        </span>
                      </div>
                      <h2 className="text-base font-bold text-white">{prof.name}</h2>
                      <p className="text-xs text-slate-400">{prof.title} • {prof.department}</p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onOpenColdEmail(prof, program)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 transition shadow-md shadow-cyan-500/20 cursor-pointer"
                        title="Draft tailored inquiry email referencing published work"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>AI Cold Email</span>
                      </button>
                    </div>
                  </div>

                  {/* Email and Links Bar */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => handleCopyEmail(prof.email)}
                      className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#070a0f] border border-slate-800 hover:border-slate-700 text-slate-300 font-mono text-[11px] transition cursor-pointer"
                    >
                      {copiedEmail === prof.email ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Mail className="h-3 w-3 text-slate-400" />
                      )}
                      <span>{copiedEmail === prof.email ? 'Copied Email' : prof.email}</span>
                    </button>

                    {prof.labWebsite && (
                      <a
                        href={prof.labWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#070a0f] border border-slate-800 hover:border-slate-700 text-cyan-400 text-[11px] transition"
                      >
                        <Globe className="h-3 w-3" />
                        <span>Lab Website</span>
                      </a>
                    )}

                    {prof.acceptingStudents && (
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                        {prof.acceptingStudents}
                      </span>
                    )}
                  </div>

                  {/* Research Focus */}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-slate-200">Research Focus:</strong> {prof.researchFocus}
                  </p>

                  {/* Key Methodologies / Tools */}
                  <div className="flex flex-wrap gap-1 items-center">
                    <span className="text-[10px] text-slate-400 mr-1">Methods:</span>
                    {prof.keyTechniques.map((tech) => (
                      <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#070a0f] text-cyan-300 border border-slate-800">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Recent Publications */}
                  {prof.recentPapers && prof.recentPapers.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Recent Published Papers:
                      </span>
                      <div className="space-y-1.5">
                        {prof.recentPapers.map((paper, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-[#070a0f] border border-slate-800/90 text-xs space-y-0.5">
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-semibold text-slate-200 line-clamp-1">
                                "{paper.title}"
                              </span>
                              <span className="text-[10px] font-mono font-bold text-cyan-400 shrink-0">
                                {paper.journal} ({paper.year})
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 italic line-clamp-2">{paper.summary}</p>
                            {paper.doi && (
                              <a
                                href={`https://doi.org/${paper.doi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-mono text-cyan-400/90 hover:underline flex items-center space-x-1"
                              >
                                <span>doi:{paper.doi}</span>
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gemini AI Deep Dive Analysis */}
                  {deepDive && (
                    <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs space-y-2 animate-fadeIn">
                      <div className="flex items-center space-x-1.5 text-cyan-300 font-bold">
                        <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Gemini PI Analysis & Applicant Advice:</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        <strong>Research Trajectory:</strong> {deepDive.researchSummary}
                      </p>
                      <div className="text-slate-300 text-[11px]">
                        <strong>Applicant Advice:</strong> {deepDive.recommendedApproach}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Deep Dive Button */}
                {!deepDive && (
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleDeepDive(prof, program)}
                      disabled={isDeepDiving}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1.5 cursor-pointer"
                    >
                      {isDeepDiving ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span>Analyzing PI lab grants with Gemini...</span>
                        </>
                      ) : (
                        <>
                          <BrainCircuit className="h-3.5 w-3.5" />
                          <span>AI Deep Dive on PI Research & Grants</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-slate-500 font-mono">{program.field}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
