import React, { useState, useRef, useEffect } from 'react';
import { 
  Filter, 
  ChevronDown, 
  Check, 
  RotateCcw, 
  Percent, 
  Award, 
  DollarSign, 
  GraduationCap, 
  BookOpen,
  HelpCircle,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { MultiFilterOptions } from '../types';

interface MultiFilterDropdownProps {
  filters: MultiFilterOptions;
  onChange: (newFilters: MultiFilterOptions) => void;
  onReset: () => void;
  activeCount: number;
}

export const MultiFilterDropdown: React.FC<MultiFilterDropdownProps> = ({
  filters,
  onChange,
  onReset,
  activeCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateField = <K extends keyof MultiFilterOptions>(key: K, value: MultiFilterOptions[K]) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
          activeCount > 0
            ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20'
            : 'bg-[#070a0f] text-slate-300 border-slate-800 hover:border-slate-700'
        }`}
      >
        <SlidersHorizontal className="h-4 w-4 text-cyan-400 shrink-0" />
        <span>Admission Multi-Filters</span>
        {activeCount > 0 && (
          <span className="px-1.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-bold text-[10px] font-mono">
            {activeCount}
          </span>
        )}
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Multi-Filter Dropdown Overlay Menu */}
      {isOpen && (
        <div className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0a0e14] border border-cyan-500/30 p-5 shadow-2xl z-40 space-y-4 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Admissions & Criteria Filter
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={onReset}
                  className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-cyan-300 transition cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset All</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {/* 1. Foreign Student Acceptance Rate Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 flex items-center space-x-1.5">
                <Percent className="h-3.5 w-3.5 text-cyan-400" />
                <span>Foreign Student Acceptance Rate:</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[
                  { id: 'all', label: 'All Rates' },
                  { id: 'under5', label: '< 5% (Ultra-Selective)' },
                  { id: '5to10', label: '5% - 10% (Selective)' },
                  { id: '10to20', label: '10% - 20% (Moderate)' },
                  { id: 'over20', label: '> 20% (Accessible)' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => updateField('acceptanceRateRange', opt.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-left text-[11px] font-medium border transition cursor-pointer flex items-center justify-between ${
                      filters.acceptanceRateRange === opt.id
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                        : 'bg-[#06090e] text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {filters.acceptanceRateRange === opt.id && <Check className="h-3 w-3 text-cyan-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Minimum IELTS Score Requirement */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 flex items-center space-x-1.5">
                <Award className="h-3.5 w-3.5 text-emerald-400" />
                <span>Max Minimum IELTS Required:</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[
                  { id: 'all', label: 'Any Score' },
                  { id: '6.5', label: '≤ 6.5 Band' },
                  { id: '7.0', label: '≤ 7.0 Band' },
                  { id: '7.5', label: '≤ 7.5 Band' },
                  { id: '8.0', label: 'All (incl. 8.0)' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => updateField('ieltsMaxRequired', opt.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-center text-[11px] font-medium border transition cursor-pointer ${
                      filters.ieltsMaxRequired === opt.id
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-[#06090e] text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. GPA Requirement Ceiling */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 flex items-center space-x-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-purple-400" />
                <span>Minimum GPA Requirement:</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[
                  { id: 'all', label: 'No Minimum / Any' },
                  { id: '3.0', label: 'Min 3.0 / 4.0' },
                  { id: '3.5', label: 'Min 3.5 / 4.0' },
                  { id: '3.8', label: 'Min 3.8 / 4.0' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => updateField('gpaRequirement', opt.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-left text-[11px] font-medium border transition cursor-pointer flex items-center justify-between ${
                      filters.gpaRequirement === opt.id
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                        : 'bg-[#06090e] text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {filters.gpaRequirement === opt.id && <Check className="h-3 w-3 text-purple-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. GRE Requirement Policy */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 flex items-center space-x-1.5">
                <BookOpen className="h-3.5 w-3.5 text-amber-400" />
                <span>GRE Requirement:</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[
                  { id: 'all', label: 'All Policies' },
                  { id: 'not-required', label: 'No / Optional GRE' },
                  { id: 'not-accepted', label: 'Not Accepted / Blind' },
                  { id: 'required', label: 'GRE Required' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => updateField('grePolicy', opt.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-left text-[11px] font-medium border transition cursor-pointer flex items-center justify-between ${
                      filters.grePolicy === opt.id
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-[#06090e] text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {filters.grePolicy === opt.id && <Check className="h-3 w-3 text-amber-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Application Fee / Waivers */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 flex items-center space-x-1.5">
                <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                <span>Application Fee / Waiver:</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[
                  { id: 'all', label: 'Any Fee' },
                  { id: 'free', label: '$0 / Free to Apply' },
                  { id: 'waiver-available', label: 'Fee Waiver Available' },
                  { id: 'under100', label: 'Under $100 / €100' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => updateField('applicationFee', opt.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-left text-[11px] font-medium border transition cursor-pointer flex items-center justify-between ${
                      filters.applicationFee === opt.id
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-[#06090e] text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {filters.applicationFee === opt.id && <Check className="h-3 w-3 text-emerald-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              {activeCount === 0 ? 'No extra filters active' : `${activeCount} custom filters active`}
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
