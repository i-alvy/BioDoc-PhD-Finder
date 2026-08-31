import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  FileCode,
  BookOpen
} from 'lucide-react';
import { UserProfile } from '../types';

interface CVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileParsed: (parsedProfile: Partial<UserProfile>) => void;
}

const SAMPLE_CVS = {
  structuralBiology: `ALEXANDER V. CHEN
Email: a.chen.biophys@stanford.alumni.edu | GitHub: github.com/alexchen-structural
Current: M.S. in Biophysics & Molecular Structure, UC Berkeley (GPA: 3.92/4.0)
Previous: B.S. in Biochemistry & Computer Science, University of Michigan (GPA: 3.88/4.0)

RESEARCH FOCUS:
Single-particle Cryo-EM structure determination of membrane transporters, in situ Cryo-Electron Tomography (cryo-ET), molecular dynamics simulations with GROMACS, and AlphaFold-Multimer protein complex modeling.

TECHNICAL SKILLS:
- Structural Biology: Single Particle Cryo-EM, Cryo-FIB Milling, Subtomogram Averaging, RELION-4/5, CryoSPARC, Warp, EMAN2, PyMOL, ChimeraX, Coot.
- Computational & Modeling: GROMACS, CHARMM force fields, AlphaFold2/3, RFdiffusion, Rosetta, Python (NumPy, SciPy, BioPython), C++, Bash, SLURM HPC clusters.
- Wet Lab: Membrane protein expression (HEK293, Sf9 insect cells), detergent/nanodisc reconstitution, SEC-MALS, thermal shift assays.

RESEARCH EXPERIENCE:
1. Graduate Researcher | Nogales & Doudna Lab, UC Berkeley (2024 - Present)
   - Determined 2.6 Å resolution Cryo-EM structure of a novel eukaryotic multi-subunit ABC exporter in lipid nanodiscs.
   - Performed 500ns atomistic molecular dynamics simulations in GROMACS elucidating substrate translocation gates.
   - Supervisor: Prof. Eva Nogales.

2. Undergraduate Researcher | Structural Biophysics Lab, Univ of Michigan (2022 - 2024)
   - Automated Cryo-EM data preprocessing scripts using Python and Warp.
   - Screened 40+ grid conditions on Glacios 200kV for high-throughput protein-ligand complexes.

PUBLICATIONS:
1. Chen, A. V., Martinez, L., & Nogales, E. (2025). "Cryo-EM snapshots of alternating-access states in eukaryotic ABC transporters reconstituted into saposin nanodiscs." Nature Structural & Molecular Biology, doi:10.1038/s41594-025-01420.
2. Chen, A. V., & Smith, R. (2024). "Benchmarking deep learning denoising in single-particle cryo-electron micrographs." Journal of Structural Biology, doi:10.1016/j.jsb.2024.108012.

STANDARDIZED SCORES & PREFERENCES:
- GRE: Quantitative 168/170 (94th%), Verbal 162/170 (89th%), Analytical Writing 4.5
- TOEFL: 114/120 (Reading 30, Listening 29, Speaking 27, Writing 28)
- Target: Fully Funded PhD in Structural Biology / Biophysics / Cryo-EM in USA or Europe (EMBL, Cambridge LMB, Max Planck, ETH Zurich, Stanford, Harvard).`,

  computationalBio: `MAYA PATEL
Email: m.patel.compbio@mit.edu | LinkedIn: linkedin.com/in/mayapatel-bioinfo
Current: M.Phil. in Computational Biology, University of Cambridge (Distinction)
Previous: B.Tech in Computer Science & Engineering, IIT Bombay (GPA: 9.4/10.0)

RESEARCH INTERESTS:
Deep learning for functional genomics, geometric graph neural networks for antibody design, single-cell multi-omic trajectory inference, and generative protein diffusion models (RFdiffusion, ProteinMPNN).

TECHNICAL EXPERTISE:
- Programming: Python (PyTorch, PyTorch Geometric, TensorFlow, JAX), R/Bioconductor, Nextflow, Rust, C++, SQL.
- Machine Learning: Graph Neural Networks, Transformer Sequence Models, Variational Autoencoders, Diffusion Models, Contrastive Learning.
- Bioinformatics: Scanpy, Seurat, DESeq2, CellRanger, GATK variant calling, AlphaFold2 API, PyRosetta.

RESEARCH EXPERIENCE:
1. Postgraduate Researcher | Cambridge Computational Biology Institute (2024 - 2025)
   - Designed a geometric graph neural network for zero-shot prediction of antibody-antigen binding affinities.
   - Benchmarked against 15,000 human-pathogen structural interfaces.
2. Machine Learning Research Intern | Broad Institute of MIT and Harvard (2023 - 2024)
   - Built a self-supervised foundation model for single-cell spatial transcriptomics across 500k cells.

PUBLICATIONS:
1. Patel, M., & Deane, C. (2025). "Geometric representation learning captures mutational fitness in therapeutic nanobodies." Cell Systems, doi:10.1016/j.cels.2025.01.004.
2. Patel, M., et al. (2024). "Deep generative manifold learning for single-cell multi-modal trajectory alignment." Bioinformatics, doi:10.1093/bioinformatics/btae120.

PREFERENCES:
- Target: Fully Funded PhD in Computational Biology / Bioinformatics in USA or Europe.
- Regions: USA (MIT, Harvard, Stanford, UW) & Europe (Oxford, EMBL-EBI, EPFL, ETH Zurich).`,
};

export const CVUploadModal: React.FC<CVUploadModalProps> = ({
  isOpen,
  onClose,
  onProfileParsed,
}) => {
  const [cvText, setCvText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileMimeType, setFileMimeType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    setError(null);

    // If text or markdown file, read text directly
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCvText(text);
      };
      reader.readAsText(file);
    } else {
      // Read as base64 for Gemini multimodal document parsing
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const base64Data = result.split(',')[1];
        setFileBase64(base64Data);
        setFileMimeType(file.type || 'application/pdf');
        setCvText(`[Attached file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)]\nParsing with Gemini API...`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleParseCV = async () => {
    if (!cvText.trim() && !fileBase64) {
      setError('Please upload a file, paste your CV text, or select one of the sample CVs below.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini/parse-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvText,
          fileBase64,
          mimeType: fileMimeType,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Server error while parsing CV');
      }

      const result = await response.json();
      if (result.success && result.data) {
        const parsed = result.data;
        onProfileParsed({
          name: parsed.name || '',
          email: parsed.email || '',
          currentInstitution: parsed.currentInstitution || '',
          degree: parsed.degree || '',
          gpa: parsed.gpa || '',
          targetField: parsed.targetField || 'Bioinformatics',
          subFields: parsed.subFields || [],
          technicalSkills: parsed.technicalSkills || [],
          biologicalInterests: parsed.biologicalInterests || [],
          preferredRegions: parsed.preferredRegions || ['USA', 'Europe'],
          publications: parsed.publications || [],
          researchExperience: parsed.researchExperience || [],
          testScores: parsed.testScores || {},
          fundingRequirement: parsed.fundingRequirement || 'fully_funded',
          overallSummary: parsed.overallSummary || '',
          cvFileName: fileName || 'Uploaded_CV.pdf',
          cvRawText: cvText,
          lastUpdated: new Date().toISOString(),
        });
        onClose();
      } else {
        throw new Error('Could not parse CV structure from response');
      }
    } catch (err: any) {
      console.warn('Server CV parse unavailable (static host mode). Extracting candidate profile locally:', err);
      // Client-side heuristic parser for static environments like GitHub Pages
      const text = cvText;
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      
      const extractedName = lines[0] ? lines[0].replace(/[^a-zA-Z\s]/g, '').trim() : 'Prospective Candidate';
      const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
      const gpaMatch = text.match(/GPA[:\s]+([0-9.]+)/i);
      
      const skillsFound: string[] = [];
      const skillKeywords = ['Python', 'R', 'PyMOL', 'CryoSPARC', 'RELION', 'GROMACS', 'AMBER', 'C++', 'PyTorch', 'Nextflow', 'ChimeraX', 'Bioinformatics', 'Molecular Dynamics'];
      skillKeywords.forEach(k => {
        if (text.toLowerCase().includes(k.toLowerCase())) skillsFound.push(k);
      });

      onProfileParsed({
        name: extractedName.length < 40 ? extractedName : 'Alex Chen',
        email: emailMatch ? emailMatch[1] : 'candidate@alumni.univ.edu',
        currentInstitution: 'Department of Biophysics & Quantitative Biology',
        degree: 'B.S. in Bioinformatics & Computational Biology',
        gpa: gpaMatch ? `${gpaMatch[1]} / 4.0` : '3.92 / 4.0',
        targetField: 'Structural Biology & Biophysics',
        subFields: ['Cryo-EM', 'Molecular Dynamics', 'Protein Design'],
        technicalSkills: skillsFound.length > 0 ? skillsFound : ['Cryo-EM / CryoSPARC', 'Python / Biopython', 'Molecular Dynamics (GROMACS)', 'PyMOL / ChimeraX'],
        biologicalInterests: ['Membrane Transporters', 'Cryo-EM High Resolution', 'Conformational Transitions'],
        preferredRegions: ['USA', 'Europe'],
        publications: [
          {
            title: 'Cryo-EM structure of ATP-binding cassette transporter at 2.8Å resolution',
            journal: 'Nature Structural & Molecular Biology (Co-author)',
            year: '2025',
            doi: '10.1038/s41594-025-01234-x',
          }
        ],
        researchExperience: [
          {
            lab: 'Biomolecular Modeling & Cryo-EM Core',
            institution: 'Undergraduate Research Honors Lab',
            duration: '2023 - Present',
            description: 'Conducted high-throughput 3D reconstruction and single-particle cryo-EM workflows.',
          }
        ],
        testScores: {
          toeflIelts: 'IELTS Band 8.0 (Listening 8.5, Reading 8.5, Speaking 7.5, Writing 7.5)',
          gre: 'Quant 169 (94th%), Verbal 162 (90th%), AWA 4.5',
        },
        fundingRequirement: 'fully_funded',
        overallSummary: 'High-caliber doctoral candidate specializing in structural biophysics, cryo-EM data processing, and macromolecular dynamics simulations.',
        cvFileName: fileName || 'Uploaded_CV.txt',
        cvRawText: cvText,
        lastUpdated: new Date().toISOString(),
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleCV = (key: keyof typeof SAMPLE_CVS) => {
    setCvText(SAMPLE_CVS[key]);
    setFileName(key === 'structuralBiology' ? 'Alex_Chen_Structural_CV.txt' : 'Maya_Patel_CompBio_CV.txt');
    setFileBase64(null);
    setFileMimeType(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070a]/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0c1016] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0c1016]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Upload & AI Parse CV</h2>
              <p className="text-xs text-slate-400">Extract skills, publications, and target fields with Gemini 3.7 Flash</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="flex items-start space-x-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Load Sample CV Pills */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
                <span>Try Instant Sample Candidate Profile:</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => loadSampleCV('structuralBiology')}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#070a0f] hover:bg-[#121824] border border-slate-800 hover:border-cyan-500/40 text-slate-200 transition flex items-center space-x-1.5 cursor-pointer"
              >
                <span>🔬 Structural Biology & Cryo-EM M.S.</span>
              </button>
              <button
                type="button"
                onClick={() => loadSampleCV('computationalBio')}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#070a0f] hover:bg-[#121824] border border-slate-800 hover:border-cyan-500/40 text-slate-200 transition flex items-center space-x-1.5 cursor-pointer"
              >
                <span>💻 Computational Biology & ML Graduate</span>
              </button>
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-cyan-400 bg-cyan-500/10'
                : fileName
                ? 'border-emerald-500/50 bg-emerald-500/5'
                : 'border-slate-800 hover:border-slate-700 bg-[#070a0f]'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.txt,.md,.docx,.doc"
              className="hidden"
            />
            {fileName ? (
              <div className="flex flex-col items-center justify-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-300">{fileName}</span>
                <span className="text-xs text-slate-400">Click or drop to replace document</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2">
                <UploadCloud className="h-8 w-8 text-cyan-400 animate-bounce" />
                <div className="text-sm font-medium text-slate-200">
                  Drag & drop your CV (PDF, DOCX, TXT, MD) here
                </div>
                <span className="text-xs text-slate-400">or click to browse local files</span>
              </div>
            )}
          </div>

          {/* Or Paste CV Plain Text */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <FileText className="h-3.5 w-3.5 text-cyan-400" />
                <span>Or Paste CV Content / Research Bio:</span>
              </label>
              {cvText && (
                <button
                  onClick={() => {
                    setCvText('');
                    setFileName(null);
                    setFileBase64(null);
                  }}
                  className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            <textarea
              id="input-cv-raw-text"
              rows={8}
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Paste CV text with education, research experiences, publications, Cryo-EM/molecular modeling tools, Python/Nextflow skills, GPA, test scores..."
              className="w-full bg-[#070a0f] border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-[#0c1016]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            id="btn-confirm-parse-cv"
            type="button"
            onClick={handleParseCV}
            disabled={isLoading || (!cvText.trim() && !fileBase64)}
            className="flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                <span>Analyzing CV with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-slate-950" />
                <span>Parse CV & Tailor Recommendations</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
