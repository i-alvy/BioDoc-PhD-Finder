import React, { useState, useEffect } from 'react';
import { 
  Dna, 
  Sparkles, 
  Terminal, 
  ShieldCheck, 
  Cpu, 
  Database, 
  ArrowRight, 
  CheckCircle2, 
  Radio,
  GraduationCap
} from 'lucide-react';

interface WelcomeBootloaderProps {
  onComplete: () => void;
}

export const WelcomeBootloader: React.FC<WelcomeBootloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isFading, setIsFading] = useState(false);

  const bootStages = [
    { text: 'Initializing BioDoc Neural Core & Gemini 3.7 Engine...', icon: Cpu },
    { text: 'Mounting US News Top 150+ Doctoral Program Repositories...', icon: Database },
    { text: 'Indexing Cryo-EM, Biophysics & Structural Biology Laboratories...', icon: Dna },
    { text: 'Calibrating Autonomous Profile-Match Radar & Faculty Literature...', icon: Radio },
    { text: 'Pre-warming Academic SOP & Cold Email AI Synthesis Pipeline...', icon: Sparkles },
  ];

  useEffect(() => {
    // Progress increment timer
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Accelerate smoothly
        const next = prev + Math.floor(Math.random() * 8) + 4;
        return next > 100 ? 100 : next;
      });
    }, 90);

    return () => clearInterval(interval);
  }, []);

  // Update stage based on progress
  useEffect(() => {
    const nextStage = Math.min(
      Math.floor((progress / 100) * bootStages.length),
      bootStages.length - 1
    );
    if (nextStage !== stageIndex) {
      setStageIndex(nextStage);
      setLogs((prev) => [
        `[OK] ${bootStages[nextStage].text}`,
        ...prev.slice(0, 4)
      ]);
    }
  }, [progress, stageIndex]);

  // Handle completion fade-out
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setIsFading(true);
        setTimeout(() => {
          onComplete();
        }, 500);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  const handleSkip = () => {
    setIsFading(true);
    setTimeout(() => {
      onComplete();
    }, 200);
  };

  const CurrentIcon = bootStages[stageIndex].icon;

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#04070c] text-white p-6 transition-opacity duration-500 selection:bg-cyan-500 selection:text-black ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/10 via-blue-600/10 to-indigo-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-cyan-500/5 rounded-full blur-2xl" />
      </div>

      {/* Top Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between z-10">
        <div className="flex items-center space-x-2.5">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
            BIO-PHD INTELLIGENCE RADAR v3.2
          </span>
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="text-xs text-slate-400 hover:text-cyan-300 font-mono flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer"
        >
          <span>Skip Bootloader</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Main Center Console */}
      <div className="w-full max-w-lg flex flex-col items-center text-center space-y-6 z-10 my-auto">
        {/* Animated Molecular Hub Icon */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-cyan-500/20 blur-xl animate-pulse" />
          <div className="relative p-5 rounded-2xl bg-[#090e17] border border-cyan-500/40 text-cyan-300 shadow-2xl shadow-cyan-500/20">
            <CurrentIcon className="h-10 w-10 animate-bounce" />
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400">
            BioDoc Matchmaker
          </h1>
          <p className="text-xs text-slate-400 font-mono tracking-wide">
            Autonomous Structural Biology & Biophysics PhD Discovery Engine
          </p>
        </div>

        {/* Progress Display */}
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-300 font-semibold flex items-center space-x-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>{bootStages[stageIndex].text}</span>
            </span>
            <span className="text-cyan-400 font-bold">{progress}%</span>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full h-2 rounded-full bg-[#0a111c] border border-cyan-900/50 p-0.5 overflow-hidden shadow-inner">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-400 to-cyan-300 transition-all duration-150 ease-out shadow-[0_0_12px_rgba(6,182,212,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Live Terminal Log Feeder */}
        <div className="w-full p-3.5 rounded-xl bg-[#06090e]/90 border border-slate-800/90 text-left font-mono text-[11px] space-y-1.5 shadow-2xl">
          <div className="flex items-center space-x-2 text-slate-500 border-b border-slate-800/80 pb-1.5 mb-1">
            <Terminal className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-[10px] uppercase tracking-wider">System Execution Stream</span>
          </div>
          {logs.map((log, lIdx) => (
            <div key={lIdx} className="text-slate-300 flex items-center space-x-2 truncate">
              <span className="text-cyan-400">❯</span>
              <span className={lIdx === 0 ? 'text-cyan-200 font-semibold' : 'text-slate-400'}>
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Branding Signature */}
      <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 border-t border-slate-900/80 pt-4 z-10 gap-2">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-4 w-4 text-cyan-400" />
          <span>Fall 2026 / 2027 Admissions Intelligence</span>
        </div>

        <div className="text-xs font-medium text-slate-300">
          Designed and Made By <strong className="text-white">Raghib Ishraq Alvy</strong> with ❤️
        </div>
      </div>
    </div>
  );
};
