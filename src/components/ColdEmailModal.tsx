import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  Mail, 
  BookOpen, 
  Loader2, 
  AlertCircle,
  ExternalLink,
  Save
} from 'lucide-react';
import { Professor, PhDProgram, UserProfile, ColdEmailDraft } from '../types';

interface ColdEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  professor: Professor | null;
  program: PhDProgram | null;
  profile: UserProfile;
  onSaveDraftToTracker: (draft: ColdEmailDraft, programId: string) => void;
}

export const ColdEmailModal: React.FC<ColdEmailModalProps> = ({
  isOpen,
  onClose,
  professor,
  program,
  profile,
  onSaveDraftToTracker,
}) => {
  const [selectedPaper, setSelectedPaper] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [keyStrengths, setKeyStrengths] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedToTracker, setSavedToTracker] = useState(false);

  useEffect(() => {
    if (isOpen && professor && program) {
      const defaultPaper = professor.recentPapers?.[0]?.title || '';
      setSelectedPaper(defaultPaper);
      generateDraft(defaultPaper);
    }
  }, [isOpen, professor, program]);

  if (!isOpen || !professor || !program) return null;

  const generateDraft = async (paperTitle: string) => {
    setIsLoading(true);
    setError(null);
    setSavedToTracker(false);

    try {
      const response = await fetch('/api/gemini/generate-cold-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professor,
          program,
          profile,
          paperTitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate cold email draft from server');
      }

      const result = await response.json();
      if (result.success && result.data) {
        setSubject(result.data.subject || `Prospective PhD Student Inquiry - ${program.title} (${program.cycle})`);
        setBody(result.data.body || '');
        setKeyStrengths(result.data.keyStrengthsHighlighted || []);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error generating email. Falling back to template.');
      // Fallback robust template
      setSubject(`Prospective PhD Applicant (${program.cycle}) - Inquiry regarding ${professor.name}'s lab`);
      setBody(`Dear Professor ${professor.name},

I hope this email finds you well. My name is ${profile.name || 'a prospective applicant'}, currently completing my ${profile.degree || 'studies'} at ${profile.currentInstitution || 'university'}. I am writing to express my strong interest in joining your research group for my PhD in ${program.title} at ${program.university} for ${program.cycle}.

I have been following your lab's outstanding work in ${professor.researchFocus}, particularly your recent paper "${paperTitle || (professor.recentPapers?.[0]?.title || 'structural biology research')}". 

My research background centers on ${(profile.technicalSkills || ['molecular dynamics', 'structural modeling']).slice(0, 5).join(', ')}. I would be thrilled to contribute to your ongoing questions regarding macromolecular structure and computational biophysics.

Are you considering taking on new PhD students for the upcoming cycle? I would welcome the opportunity to briefly speak with you over Zoom if your schedule permits. I have attached my CV for your review.

Thank you very much for your time and consideration.

Sincerely,
${profile.name || 'Candidate Name'}
${profile.email || ''}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    const fullText = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveDraft = () => {
    const draft: ColdEmailDraft = {
      id: `draft-${Date.now()}`,
      professorName: professor.name,
      professorEmail: professor.email,
      subject,
      body,
      paperReferenced: selectedPaper,
      createdAt: new Date().toISOString(),
    };
    onSaveDraftToTracker(draft, program.id);
    setSavedToTracker(true);
    setTimeout(() => setSavedToTracker(false), 3000);
  };

  const mailtoUrl = `mailto:${professor.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070a]/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0c1016] border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#0c1016] flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white">AI Cold Email Generator</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono">
                  Gemini 3.7 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tailored for {professor.name} ({professor.email}) at {program.university}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Reference Paper Selector */}
          {professor.recentPapers && professor.recentPapers.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
                <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
                <span>Select Professor's Paper to Reference in Email:</span>
              </label>
              <select
                value={selectedPaper}
                onChange={(e) => {
                  setSelectedPaper(e.target.value);
                  generateDraft(e.target.value);
                }}
                className="w-full bg-[#070a0f] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {professor.recentPapers.map((paper, idx) => (
                  <option key={idx} value={paper.title}>
                    "{paper.title}" - {paper.journal} ({paper.year})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Subject Line */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Email Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-[#070a0f] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Email Body */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-400">Email Body (Polite, scholarly & under 250 words)</label>
              <button
                type="button"
                onClick={() => generateDraft(selectedPaper)}
                disabled={isLoading}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
              >
                <Sparkles className="h-3 w-3" />
                <span>Regenerate with Gemini</span>
              </button>
            </div>
            <div className="relative">
              {isLoading ? (
                <div className="h-64 flex flex-col items-center justify-center space-y-2 bg-[#070a0f] rounded-xl border border-slate-800">
                  <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
                  <span className="text-xs text-slate-400">Crafting personalized inquiry referencing papers and candidate CV...</span>
                </div>
              ) : (
                <textarea
                  rows={11}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full bg-[#070a0f] border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 font-sans leading-relaxed focus:outline-none focus:border-cyan-500"
                />
              )}
            </div>
          </div>

          {/* Key Strengths Highlighted */}
          {keyStrengths.length > 0 && (
            <div className="p-3 rounded-xl bg-[#070a0f] border border-slate-800">
              <span className="text-[11px] font-semibold text-cyan-300/80 uppercase tracking-wider block mb-1">
                Candidate Skills Targeted in Email:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {keyStrengths.map((str, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {str}
                  </span>
                ))}
              </div>
            </div>
          )}

          {savedToTracker && (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center space-x-2 animate-fadeIn">
              <Check className="h-4 w-4 text-emerald-400" />
              <span>Draft saved to Application Tracker for this program!</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#0c1016] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#121824] hover:bg-[#182132] text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy All'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#121824] hover:bg-[#182132] text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              <Save className="h-3.5 w-3.5 text-cyan-400" />
              <span>Save to Application</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
            >
              Close
            </button>

            <a
              href={mailtoUrl}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 transition shadow-md shadow-cyan-500/20"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Open in Mail App</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
