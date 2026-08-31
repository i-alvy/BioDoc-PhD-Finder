import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  GraduationCap, 
  Building2, 
  Sparkles, 
  Plus, 
  Trash2, 
  Save, 
  BookOpen, 
  Award, 
  Globe2, 
  BrainCircuit, 
  FileUp, 
  Check,
  Tag,
  Briefcase
} from 'lucide-react';
import { UserProfile, Region, ResearchExperience, UserPublication } from '../types';

interface ProfileEditorProps {
  profile: UserProfile;
  onSaveProfile: (updatedProfile: UserProfile) => void;
  onOpenCVUpload: () => void;
  onRecalculateMatches: () => void;
  isRecalculating: boolean;
}

const COMMON_SKILLS = [
  'Python', 'PyMOL', 'GROMACS', 'AlphaFold2/3', 'RELION', 'CryoSPARC',
  'RFdiffusion', 'Rosetta', 'Nextflow', 'R/Bioconductor', 'PyTorch', 'C++',
  'BioPython', 'Docker', 'ChimeraX', 'Warp/M', 'AutoDock Vina', 'BLAST'
];

const TARGET_FIELDS = [
  'Bioinformatics',
  'Structural Biology',
  'Computational Biology',
  'Biophysics',
  'Systems Biology',
  'Genomics & Quantitative Genetics',
  'AI / ML for Drug Discovery & Protein Design'
];

const REGION_OPTIONS: { id: Region; label: string; flag: string }[] = [
  { id: 'USA', label: 'United States (USA)', flag: '🇺🇸' },
  { id: 'Europe', label: 'All Europe / EU', flag: '🇪🇺' },
  { id: 'UK', label: 'United Kingdom (UK)', flag: '🇬🇧' },
  { id: 'Germany', label: 'Germany (Max Planck / IMPRS)', flag: '🇩🇪' },
  { id: 'Switzerland', label: 'Switzerland (ETH / EPFL)', flag: '🇨🇭' },
  { id: 'Scandinavia', label: 'Sweden & Scandinavia (Karolinska / SciLifeLab)', flag: '🇸🇪' },
];

export const ProfileEditor: React.FC<ProfileEditorProps> = ({
  profile,
  onSaveProfile,
  onOpenCVUpload,
  onRecalculateMatches,
  isRecalculating,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [newSkill, setNewSkill] = useState('');
  const [newSubfield, setNewSubfield] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date().toISOString(),
    }));
  };

  const handleTestScoreChange = (scoreType: 'gre' | 'toefl' | 'ielts', value: string) => {
    setFormData(prev => ({
      ...prev,
      testScores: {
        ...prev.testScores,
        [scoreType]: value,
      },
      lastUpdated: new Date().toISOString(),
    }));
  };

  const handleToggleRegion = (region: Region) => {
    const current = formData.preferredRegions || [];
    const updated = current.includes(region)
      ? current.filter(r => r !== region)
      : [...current, region];
    handleInputChange('preferredRegions', updated);
  };

  // Add / Remove Tags
  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !formData.technicalSkills.includes(trimmed)) {
      handleInputChange('technicalSkills', [...formData.technicalSkills, trimmed]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    handleInputChange(
      'technicalSkills',
      formData.technicalSkills.filter(s => s !== skillToRemove)
    );
  };

  const addSubfield = () => {
    if (newSubfield.trim() && !formData.subFields.includes(newSubfield.trim())) {
      handleInputChange('subFields', [...formData.subFields, newSubfield.trim()]);
      setNewSubfield('');
    }
  };

  const removeSubfield = (subfieldToRemove: string) => {
    handleInputChange(
      'subFields',
      formData.subFields.filter(s => s !== subfieldToRemove)
    );
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.biologicalInterests.includes(newInterest.trim())) {
      handleInputChange('biologicalInterests', [...formData.biologicalInterests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const removeInterest = (interestToRemove: string) => {
    handleInputChange(
      'biologicalInterests',
      formData.biologicalInterests.filter(i => i !== interestToRemove)
    );
  };

  // Research Experience CRUD
  const addResearchExperience = () => {
    const newExp: ResearchExperience = {
      lab: 'New Research Lab',
      institution: 'University / Institute',
      role: 'Graduate / Undergraduate Researcher',
      period: '2024 - 2025',
      description: 'Conducted structural characterization / computational modeling using Python and molecular simulations.',
      supervisor: 'Prof. Name',
    };
    handleInputChange('researchExperience', [newExp, ...(formData.researchExperience || [])]);
  };

  const updateResearchExperience = (index: number, updated: Partial<ResearchExperience>) => {
    const list = [...(formData.researchExperience || [])];
    list[index] = { ...list[index], ...updated };
    handleInputChange('researchExperience', list);
  };

  const deleteResearchExperience = (index: number) => {
    const list = formData.researchExperience.filter((_, i) => i !== index);
    handleInputChange('researchExperience', list);
  };

  // Publications CRUD
  const addPublication = () => {
    const newPub: UserPublication = {
      title: 'New Publication Title',
      journal: 'Nature Structural & Molecular Biology / Bioinformatics',
      year: new Date().getFullYear().toString(),
      role: 'First Author / Co-Author',
      doi: '',
      summary: 'Investigated macromolecular structural dynamics and algorithmic pipeline performance.',
    };
    handleInputChange('publications', [newPub, ...(formData.publications || [])]);
  };

  const updatePublication = (index: number, updated: Partial<UserPublication>) => {
    const list = [...(formData.publications || [])];
    list[index] = { ...list[index], ...updated };
    handleInputChange('publications', list);
  };

  const deletePublication = (index: number) => {
    const list = formData.publications.filter((_, i) => i !== index);
    handleInputChange('publications', list);
  };

  const handleSave = () => {
    onSaveProfile(formData);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Banner & Quick Actions */}
      <div className="bg-[#0c1016]/90 border border-slate-800/90 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">Researcher Profile & CV Matchmaker</h1>
              {formData.cvFileName && (
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
                  CV: {formData.cvFileName}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Edit your academic credentials and research background to tailor PhD recommendations and professor matches.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            <button
              id="btn-profile-reupload-cv"
              onClick={onOpenCVUpload}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#121824] hover:bg-[#182132] border border-slate-700 text-slate-200 transition shadow-sm cursor-pointer"
            >
              <FileUp className="h-4 w-4 text-cyan-400" />
              <span>Upload / Re-parse CV</span>
            </button>

            <button
              id="btn-recalculate-matches"
              onClick={onRecalculateMatches}
              disabled={isRecalculating}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 transition shadow-md shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-slate-950" />
              <span>{isRecalculating ? 'Calculating Fits...' : 'Tailor AI Recommendations'}</span>
            </button>

            <button
              id="btn-save-profile"
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition shadow-sm cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {showSavedToast && (
          <div className="mt-4 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center space-x-2 animate-fadeIn">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>Profile successfully updated and synced with cloud encryption!</span>
          </div>
        )}
      </div>

      {/* Profile Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Info, Target Field & Regions */}
        <div className="space-y-6 lg:col-span-1">
          {/* Personal Information */}
          <div className="bg-[#0c1016]/90 border border-slate-800/90 rounded-2xl p-5 space-y-4 shadow-lg backdrop-blur-sm">
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <User className="h-4 w-4 text-cyan-400" />
              <span>Personal & Academic Details</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Candidate Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g. Dr. Alex Chen"
                  className="w-full bg-[#070a0f] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="alex.chen@biophys.edu"
                    className="w-full bg-[#070a0f] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Current Institution / University</label>
                <div className="relative">
                  <Building2 className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={formData.currentInstitution}
                    onChange={(e) => handleInputChange('currentInstitution', e.target.value)}
                    placeholder="e.g. UC Berkeley / Univ of Cambridge"
                    className="w-full bg-[#070a0f] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Current Degree</label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) => handleInputChange('degree', e.target.value)}
                    placeholder="M.S. in Biophysics"
                    className="w-full bg-[#070a0f] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">GPA / Scale</label>
                  <input
                    type="text"
                    value={formData.gpa}
                    onChange={(e) => handleInputChange('gpa', e.target.value)}
                    placeholder="3.92 / 4.0"
                    className="w-full bg-[#070a0f] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Standardized Test Scores */}
              <div className="pt-2 border-t border-slate-800/80">
                <span className="block text-slate-300 font-medium mb-2">Test Scores (Optional)</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-0.5">GRE</label>
                    <input
                      type="text"
                      value={formData.testScores?.gre || ''}
                      onChange={(e) => handleTestScoreChange('gre', e.target.value)}
                      placeholder="Q168 V162"
                      className="w-full bg-[#070a0f] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-0.5">TOEFL</label>
                    <input
                      type="text"
                      value={formData.testScores?.toefl || ''}
                      onChange={(e) => handleTestScoreChange('toefl', e.target.value)}
                      placeholder="114/120"
                      className="w-full bg-[#070a0f] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-0.5">IELTS</label>
                    <input
                      type="text"
                      value={formData.testScores?.ielts || ''}
                      onChange={(e) => handleTestScoreChange('ielts', e.target.value)}
                      placeholder="8.0"
                      className="w-full bg-[#070a0f] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Funding Requirement */}
              <div className="pt-2">
                <label className="block text-slate-400 mb-1">Funding Requirement</label>
                <select
                  value={formData.fundingRequirement}
                  onChange={(e) => handleInputChange('fundingRequirement', e.target.value)}
                  className="w-full bg-[#070a0f] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="fully_funded">Fully Funded Only (Full Stipend + Tuition Waiver)</option>
                  <option value="scholarship_needed">Scholarship / Fellowship Eligible</option>
                  <option value="self_funded_or_any">Open to All Funding Models</option>
                </select>
              </div>
            </div>
          </div>

          {/* Primary Field & Preferred Regions */}
          <div className="bg-[#0c1016]/90 border border-slate-800/90 rounded-2xl p-5 space-y-4 shadow-lg backdrop-blur-sm">
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <Globe2 className="h-4 w-4 text-cyan-400" />
              <span>Target Fields & Geographic Regions</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Primary PhD Discipline</label>
                <select
                  value={formData.targetField}
                  onChange={(e) => handleInputChange('targetField', e.target.value)}
                  className="w-full bg-[#070a0f] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {TARGET_FIELDS.map(field => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
              </div>

              {/* Regions Checkbox List */}
              <div>
                <label className="block text-slate-400 mb-2">Preferred Study Destinations</label>
                <div className="space-y-2">
                  {REGION_OPTIONS.map(opt => {
                    const isChecked = formData.preferredRegions?.includes(opt.id);
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => handleToggleRegion(opt.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg border text-left transition cursor-pointer ${
                          isChecked
                            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200'
                            : 'bg-[#070a0f] border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <span>{opt.flag}</span>
                          <span className="text-xs font-medium">{opt.label}</span>
                        </span>
                        <div className={`h-4 w-4 rounded flex items-center justify-center border ${
                          isChecked ? 'bg-cyan-500 border-cyan-500 text-slate-950' : 'border-slate-700'
                        }`}>
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center & Right Column: Skills, Subfields, Experiences, Publications */}
        <div className="space-y-6 lg:col-span-2">
          {/* Executive AI Profile Summary */}
          <div className="bg-[#0c1016]/90 border border-slate-800/90 rounded-2xl p-5 space-y-3 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <BrainCircuit className="h-4 w-4 text-cyan-400" />
                <span>Executive Research Edge & AI Summary</span>
              </h2>
              <span className="text-[11px] text-cyan-400/80">Used in AI cold emails & matching</span>
            </div>
            <textarea
              rows={3}
              value={formData.overallSummary || ''}
              onChange={(e) => handleInputChange('overallSummary', e.target.value)}
              placeholder="Candidate with strong quantitative and structural biophysics foundation specializing in Cryo-EM map refinement and molecular dynamics of membrane complexes..."
              className="w-full bg-[#070a0f] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Technical Skills & Biological Topics Tag Manager */}
          <div className="bg-[#0c1016]/90 border border-slate-800/90 rounded-2xl p-5 space-y-4 shadow-lg backdrop-blur-sm">
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <Tag className="h-4 w-4 text-cyan-400" />
              <span>Technical Skills & Biological Focus Areas</span>
            </h2>

            {/* Technical Skills */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Technical Skills & Software Tools</label>
              
              {/* Existing Skills Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {formData.technicalSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/25"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-cyan-400 hover:text-rose-400 transition cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Custom Skill Input */}
              <div className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(newSkill))}
                  placeholder="Add custom skill (e.g. Cryo-FIB, PyTorch, C++)..."
                  className="flex-1 bg-[#070a0f] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => addSkill(newSkill)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#121824] hover:bg-[#182132] text-slate-200 border border-slate-700 transition cursor-pointer"
                >
                  Add
                </button>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center flex-wrap gap-1">
                <span className="text-[11px] text-slate-400 mr-1">Quick add:</span>
                {COMMON_SKILLS.filter(s => !formData.technicalSkills.includes(s)).slice(0, 8).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => addSkill(s)}
                    className="text-[11px] px-2 py-0.5 rounded bg-[#070a0f] hover:bg-[#121824] text-slate-300 border border-slate-800 transition cursor-pointer"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Subfields & Biological Interests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800/80">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subfields & Methodologies</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {formData.subFields.map(sub => (
                    <span key={sub} className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs bg-[#070a0f] text-slate-300 border border-slate-800">
                      <span>{sub}</span>
                      <button onClick={() => removeSubfield(sub)} className="text-slate-400 hover:text-rose-400 cursor-pointer">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="text"
                    value={newSubfield}
                    onChange={(e) => setNewSubfield(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubfield())}
                    placeholder="e.g. Cryo-ET, Single Particle Cryo-EM"
                    className="flex-1 bg-[#070a0f] border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                  <button onClick={addSubfield} className="px-2.5 py-1 text-xs bg-[#121824] text-slate-200 rounded border border-slate-700 hover:bg-[#182132] cursor-pointer">
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Biological Questions & Systems</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {formData.biologicalInterests.map(bi => (
                    <span key={bi} className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs bg-[#070a0f] text-slate-300 border border-slate-800">
                      <span>{bi}</span>
                      <button onClick={() => removeInterest(bi)} className="text-slate-400 hover:text-rose-400 cursor-pointer">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                    placeholder="e.g. Membrane Transporters, GPCRs"
                    className="flex-1 bg-[#070a0f] border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                  <button onClick={addInterest} className="px-2.5 py-1 text-xs bg-[#121824] text-slate-200 rounded border border-slate-700 hover:bg-[#182132] cursor-pointer">
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Research Experience History */}
          <div className="bg-[#0c1016]/90 border border-slate-800/90 rounded-2xl p-5 space-y-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-cyan-400" />
                <span>Research Experience & Labs ({formData.researchExperience?.length || 0})</span>
              </h2>
              <button
                type="button"
                onClick={addResearchExperience}
                className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/25 transition cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Add Lab Experience</span>
              </button>
            </div>

            <div className="space-y-3">
              {(formData.researchExperience || []).map((exp, index) => (
                <div key={index} className="p-3.5 rounded-xl bg-[#070a0f] border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 mr-2">
                      <input
                        type="text"
                        value={exp.lab}
                        onChange={(e) => updateResearchExperience(index, { lab: e.target.value })}
                        placeholder="Lab Name"
                        className="bg-[#0c1016] border border-slate-800 rounded px-2.5 py-1 text-xs font-semibold text-slate-200"
                      />
                      <input
                        type="text"
                        value={exp.institution}
                        onChange={(e) => updateResearchExperience(index, { institution: e.target.value })}
                        placeholder="Institution / University"
                        className="bg-[#0c1016] border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-300"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteResearchExperience(index)}
                      className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => updateResearchExperience(index, { role: e.target.value })}
                      placeholder="Role (e.g. Graduate Researcher)"
                      className="bg-[#0c1016] border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-300"
                    />
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => updateResearchExperience(index, { period: e.target.value })}
                      placeholder="Period (e.g. 2024 - 2025)"
                      className="bg-[#0c1016] border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-300"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={exp.description}
                    onChange={(e) => updateResearchExperience(index, { description: e.target.value })}
                    placeholder="Key discoveries, techniques used (Cryo-EM, GROMACS, RELION, Nextflow), and scientific contributions..."
                    className="w-full bg-[#0c1016] border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Publications */}
          <div className="bg-[#0c1016]/90 border border-slate-800/90 rounded-2xl p-5 space-y-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-cyan-400" />
                <span>Publications & Preprints ({formData.publications?.length || 0})</span>
              </h2>
              <button
                type="button"
                onClick={addPublication}
                className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/25 transition cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Add Publication</span>
              </button>
            </div>

            <div className="space-y-3">
              {(formData.publications || []).map((pub, index) => (
                <div key={index} className="p-3.5 rounded-xl bg-[#070a0f] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={pub.title}
                      onChange={(e) => updatePublication(index, { title: e.target.value })}
                      placeholder="Paper Title"
                      className="w-full bg-[#0c1016] border border-slate-800 rounded px-2.5 py-1 text-xs font-semibold text-slate-200 mr-2 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={() => deletePublication(index)}
                      className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={pub.journal}
                      onChange={(e) => updatePublication(index, { journal: e.target.value })}
                      placeholder="Journal / Conference"
                      className="bg-[#0c1016] border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                    />
                    <input
                      type="text"
                      value={pub.year}
                      onChange={(e) => updatePublication(index, { year: e.target.value })}
                      placeholder="Year (e.g. 2025)"
                      className="bg-[#0c1016] border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                    />
                    <input
                      type="text"
                      value={pub.role}
                      onChange={(e) => updatePublication(index, { role: e.target.value })}
                      placeholder="Role (e.g. First Author)"
                      className="bg-[#0c1016] border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <input
                    type="text"
                    value={pub.doi || ''}
                    onChange={(e) => updatePublication(index, { doi: e.target.value })}
                    placeholder="DOI or PubMed ID (e.g. 10.1038/s41594-025-01420)"
                    className="w-full bg-[#0c1016] border border-slate-800 rounded px-2.5 py-1 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
