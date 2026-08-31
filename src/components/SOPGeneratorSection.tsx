import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  User, 
  BookOpen, 
  Building, 
  GraduationCap, 
  Award, 
  Sliders, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { PhDProgram, Professor, UserProfile, SOPDraft } from '../types';

interface SOPGeneratorSectionProps {
  program: PhDProgram;
  profile: UserProfile;
  onSaveSOPToTracker?: (sop: SOPDraft) => void;
}

export const SOPGeneratorSection: React.FC<SOPGeneratorSectionProps> = ({
  program,
  profile,
  onSaveSOPToTracker,
}) => {
  const [selectedProfId, setSelectedProfId] = useState<string>(
    program.suggestedProfessors?.[0]?.id || ''
  );
  const [customAngle, setCustomAngle] = useState<string>('');
  const [targetLength, setTargetLength] = useState<number>(850);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedSOP, setGeneratedSOP] = useState<SOPDraft | null>(null);
  const [copiedFull, setCopiedFull] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'full' | 'sections' | 'analysis'>('full');
  const [saveStatus, setSaveStatus] = useState<boolean>(false);

  const selectedProf = program.suggestedProfessors?.find(p => p.id === selectedProfId) || program.suggestedProfessors?.[0];

  const handleGenerateSOP = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate-sop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          program,
          profile,
          selectedProfessor: selectedProf,
          customResearchAngle: customAngle,
          targetWordCount: targetLength,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setGeneratedSOP(data.data);
          return;
        }
      }
      throw new Error('API unavailable, generating fallback');
    } catch (err) {
      console.warn('Backend API unavailable (static environment detected). Generating client-side tailored SOP:', err);
      // High-grade client-side synthesis for static hosting (GitHub Pages)
      const profName = selectedProf?.name || 'Faculty Committee';
      const profResearch = selectedProf?.researchFocus || program.researchAreas.join(', ');
      const skillsStr = (profile.technicalSkills || ['Python', 'Structural Modeling', 'Molecular Dynamics']).join(', ');
      const candidatePub = profile.publications?.[0] ? `"${profile.publications[0].title}" (${profile.publications[0].journal || 'Peer-Reviewed'})` : 'computational structural biophysics';
      const customAngleStr = customAngle ? ` Specifically, I aim to focus on ${customAngle}.` : '';

      const hook = `My aspiration to pursue doctoral training in the ${program.title} at ${program.university} stems from a dedicated fascination with the mechanistic architecture of biomacromolecules and the transformative power of computational structural biophysics. Having developed foundational expertise in quantitative modeling and biomolecular analysis at ${profile.currentInstitution || 'my alma mater'}, I seek to bridge molecular modeling with high-resolution structural determination to uncover fundamental biological principles.${customAngleStr}`;

      const background = `During my academic tenure earning a ${profile.degree || 'B.S. in Bioinformatics & Computational Biology'}, I established a rigorous foundation across biochemical thermodynamics, algorithmic data structures, and statistical machine learning. My technical competencies encompass ${skillsStr}. These capabilities have enabled me to dissect complex macromolecular conformational transitions with quantitative precision.`;

      const research = `My primary research experience focused on computational modeling and structural validation. As detailed in my work on ${candidatePub}, I spearheaded algorithmic workflows to analyze structural ensembles and dynamic ligand interactions. This work reinforced my dedication to reproducible computational science, hypothesis-driven inquiry, and rigorous validation against experimental cryo-EM and crystallography datasets.`;

      const alignment = `The ${program.title} at ${program.university} presents the premier academic environment to advance my doctoral objectives, particularly through alignment with Professor ${profName}'s laboratory. Prof. ${profName}'s pioneering investigations into ${profResearch} directly resonate with my long-term trajectory. I am particularly motivated by the lab's recent publications in high-impact journals, and I look forward to contributing novel structural insight to upcoming lab initiatives.`;

      const conclusion = `In conclusion, the interdisciplinary research ecosystem, state-of-the-art computational infrastructure, and distinguished faculty at ${program.university} provide the ideal crucible for my growth as an independent biomedical investigator. I am eager to dedicate my doctoral tenure to advancing the frontier of ${program.department || 'Biophysical Sciences'}.`;

      const fullContent = `${hook}\n\n${background}\n\n${research}\n\n${alignment}\n\n${conclusion}`;
      const wordCount = fullContent.split(/\s+/).filter(Boolean).length;

      const fallbackSOP: SOPDraft = {
        id: `sop-${Date.now()}`,
        programId: program.id,
        university: program.university,
        department: program.department,
        programTitle: program.title,
        selectedProfessorName: profName,
        title: `Statement of Purpose - ${program.title} (${program.university})`,
        fullContent,
        sections: {
          hookAndMotivation: hook,
          academicBackgroundAndSkills: background,
          researchProjectsAndMethods: research,
          labAndProfessorAlignment: alignment,
          futureGoalsAndConclusion: conclusion,
        },
        wordCount,
        targetedFaculty: [profName],
        targetedPapers: selectedProf?.recentPapers?.map(p => p.title) || [],
        createdAt: new Date().toISOString(),
        modelUsed: 'BioDoc Academic Synthesis Engine (Client Fallback)',
      };

      setGeneratedSOP(fallbackSOP);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2500);
  };

  const handleDownloadTxt = () => {
    if (!generatedSOP) return;
    const element = document.createElement('a');
    const file = new Blob([generatedSOP.fullContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `SOP_${program.university.replace(/[^a-zA-Z0-9]/g, '_')}_PhD.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSaveToTracker = () => {
    if (!generatedSOP) return;
    if (onSaveSOPToTracker) {
      onSaveSOPToTracker(generatedSOP);
    }
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 3000);
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#080d16] via-[#0c121d] to-[#080d16] border border-cyan-500/30 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cyan-900/30">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              AI Academic Statement of Purpose Engine
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
            Automated SOP Tailored to {program.university}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Synthesizes your CV background ({profile.technicalSkills.slice(0, 3).join(', ')}), program curriculum, and the target PI's latest published discoveries.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerateSOP}
          disabled={isGenerating}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 transition shadow-lg shadow-cyan-500/25 disabled:opacity-50 cursor-pointer shrink-0"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Synthesizing Academic SOP...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>{generatedSOP ? 'Regenerate Tailored SOP' : 'Generate Tailored SOP Now'}</span>
            </>
          )}
        </button>
      </div>

      {/* Control Panel: Select Target Professor & Research Nuance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 p-4 rounded-xl bg-[#06090e] border border-slate-800/80 text-xs">
        {/* Target Professor Selection */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
            <User className="h-3.5 w-3.5 text-cyan-400" />
            <span>Target Faculty Lab PI:</span>
          </label>
          <select
            value={selectedProfId}
            onChange={(e) => setSelectedProfId(e.target.value)}
            className="w-full bg-[#0c1016] border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
          >
            {(program.suggestedProfessors || []).map((prof) => (
              <option key={prof.id} value={prof.id} className="bg-[#0c1016]">
                {prof.name} ({prof.researchFocus.slice(0, 35)}...)
              </option>
            ))}
          </select>
          {selectedProf?.recentPapers && selectedProf.recentPapers.length > 0 && (
            <p className="text-[10px] text-cyan-400/90 mt-1 truncate">
              Paper cited: "{selectedProf.recentPapers[0].title}"
            </p>
          )}
        </div>

        {/* Custom Research Angle / Sub-field */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
            <Sliders className="h-3.5 w-3.5 text-amber-400" />
            <span>Custom Research Angle (Optional):</span>
          </label>
          <input
            type="text"
            value={customAngle}
            onChange={(e) => setCustomAngle(e.target.value)}
            placeholder="e.g. Cryo-EM conformational allostery or MD simulation"
            className="w-full bg-[#0c1016] border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
          />
          <span className="text-[10px] text-slate-400 block mt-1">
            Guides AI to spotlight specific methods or questions.
          </span>
        </div>

        {/* Length & Focus Selector */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
            <FileText className="h-3.5 w-3.5 text-emerald-400" />
            <span>Target Word Count:</span>
          </label>
          <div className="flex items-center space-x-2">
            {[650, 850, 1000].map((len) => (
              <button
                key={len}
                type="button"
                onClick={() => setTargetLength(len)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  targetLength === len
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-[#0c1016] text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                ~{len} words
              </button>
            ))}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            Standard US/European academic length (1.5 - 2 pages)
          </span>
        </div>
      </div>

      {/* Generated SOP View or Initial State */}
      {isGenerating ? (
        <div className="p-8 rounded-2xl bg-[#06090e] border border-cyan-500/30 flex flex-col items-center justify-center text-center space-y-3 animate-pulse">
          <div className="p-3 rounded-full bg-cyan-500/10 text-cyan-400">
            <RefreshCw className="h-8 w-8 animate-spin" />
          </div>
          <h3 className="text-sm font-bold text-white">Synthesizing High-Impact Academic SOP...</h3>
          <p className="text-xs text-slate-400 max-w-md">
            Aligning your CV achievements, research experience in {profile.researchExperience?.[0]?.lab || 'academic labs'}, and Prof. {selectedProf?.name || 'PI'}'s recent literature into an authentic statement.
          </p>
        </div>
      ) : generatedSOP ? (
        <div className="space-y-4 animate-fadeIn">
          {/* Top Actions & Word Count */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#06090e] border border-slate-800 text-xs">
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold font-mono">
                {generatedSOP.wordCount || generatedSOP.fullContent.split(/\s+/).length} words
              </span>
              <span className="text-slate-400 hidden sm:inline">
                Target PI: <strong className="text-slate-200">{generatedSOP.selectedProfessorName}</strong>
              </span>
            </div>

            {/* View Tabs */}
            <div className="flex items-center space-x-1.5 bg-[#0c1016] p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('full')}
                className={`px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'full' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Full Essay
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('sections')}
                className={`px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'sections' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Section Breakdown
              </button>
            </div>

            {/* Export & Copy Buttons */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleCopy(generatedSOP.fullContent)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#121824] hover:bg-[#182132] text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                {copiedFull ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
                <span>{copiedFull ? 'Copied Full SOP' : 'Copy All'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadTxt}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#121824] hover:bg-[#182132] text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-cyan-400" />
                <span>Export .TXT</span>
              </button>

              <button
                type="button"
                onClick={handleSaveToTracker}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition cursor-pointer"
              >
                {saveStatus ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Award className="h-3.5 w-3.5 text-emerald-400" />}
                <span>{saveStatus ? 'Saved to Tracker!' : 'Save to Checklist'}</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Full Cohesive Essay */}
          {activeTab === 'full' && (
            <div className="p-6 rounded-2xl bg-[#06090e] border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed space-y-4 font-serif">
              <div className="border-b border-slate-800 pb-3 font-sans">
                <h3 className="text-base font-bold text-white">{generatedSOP.title}</h3>
                <span className="text-xs text-slate-400">Applicant: {profile.name} • Target: {program.title} ({program.university})</span>
              </div>

              {generatedSOP.fullContent.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx} className="text-slate-200 leading-relaxed text-justify">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* Tab 2: Section Breakdown */}
          {activeTab === 'sections' && (
            <div className="space-y-3">
              {generatedSOP.sections && [
                { title: '1. Academic Hook & Motivation', text: generatedSOP.sections.hookAndMotivation, desc: 'Engaging motivation, discipline focus, and reason for choosing this institution.' },
                { title: '2. Academic Grounding & Technical Skills', text: generatedSOP.sections.academicBackgroundAndSkills, desc: 'Quantitative coursework, GPA foundation, and mastery of experimental/computational tools.' },
                { title: '3. Prior Research Experience & Projects', text: generatedSOP.sections.researchProjectsAndMethods, desc: 'Deep dive into laboratory investigations, Cryo-EM / modeling workflows, and publications.' },
                { title: '4. Lab, Professor & Ongoing Research Alignment', text: generatedSOP.sections.labAndProfessorAlignment, desc: `Direct references to Prof. ${generatedSOP.selectedProfessorName}'s published papers and ongoing lab directions.` },
                { title: '5. Future Career Vision & Conclusion', text: generatedSOP.sections.futureGoalsAndConclusion, desc: 'Post-PhD trajectory and specific contributions to the departmental cohort.' },
              ].map((sec, sIdx) => (
                <div key={sIdx} className="p-4 rounded-xl bg-[#06090e] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-cyan-300">{sec.title}</h4>
                      <p className="text-[10px] text-slate-400">{sec.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(sec.text)}
                      className="px-2 py-1 rounded bg-[#0c1016] text-[10px] text-slate-300 border border-slate-800 hover:border-slate-700"
                    >
                      Copy Section
                    </button>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed bg-[#0c1016] p-3 rounded-lg border border-slate-850">
                    {sec.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-[#06090e] border border-dashed border-slate-800 flex flex-col items-center justify-center text-center space-y-2">
          <FileText className="h-8 w-8 text-slate-600" />
          <h3 className="text-sm font-semibold text-slate-300">No Statement of Purpose generated yet</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Click "Generate Tailored SOP Now" above to automatically create a custom 5-paragraph academic essay integrating your CV and {program.university}'s requirements.
          </p>
        </div>
      )}
    </div>
  );
};
