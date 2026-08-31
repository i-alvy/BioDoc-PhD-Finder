import React, { useState } from 'react';
import { 
  Kanban, 
  List, 
  Plus, 
  Trash2, 
  Calendar, 
  CheckSquare, 
  Square, 
  MapPin, 
  Users, 
  Mail, 
  Send, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  PartyPopper, 
  AlertCircle,
  FileText,
  Clock,
  ArrowRight,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ApplicationItem, ApplicationStatus, ColdEmailDraft } from '../types';

interface ApplicationDashboardProps {
  applications: ApplicationItem[];
  onUpdateApplication: (app: ApplicationItem) => void;
  onDeleteApplication: (appId: string) => void;
  onOpenNewApplicationModal: () => void;
  onViewProgramDetails?: (programId: string) => void;
}

const STATUS_COLUMNS: { status: ApplicationStatus; label: string; color: string; bg: string }[] = [
  { status: 'Saved', label: 'Shortlisted / Saved', color: 'text-slate-300', bg: 'border-slate-800 bg-[#070b12]' },
  { status: 'Contacted PI', label: 'Contacted Professor', color: 'text-cyan-300', bg: 'border-cyan-500/30 bg-cyan-950/20' },
  { status: 'Applied', label: 'Formally Applied', color: 'text-blue-300', bg: 'border-blue-500/30 bg-blue-950/20' },
  { status: 'Interview', label: 'Interview Scheduled', color: 'text-amber-300', bg: 'border-amber-500/30 bg-amber-950/20' },
  { status: 'Accepted', label: 'Accepted / Offer 🎉', color: 'text-emerald-300', bg: 'border-emerald-500/30 bg-emerald-950/25' },
  { status: 'Waitlisted', label: 'Waitlisted', color: 'text-purple-300', bg: 'border-purple-500/30 bg-purple-950/20' },
  { status: 'Rejected', label: 'Decided Elsewhere', color: 'text-rose-300', bg: 'border-rose-500/20 bg-rose-950/20' },
];

export const ApplicationDashboard: React.FC<ApplicationDashboardProps> = ({
  applications,
  onUpdateApplication,
  onDeleteApplication,
  onOpenNewApplicationModal,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [filterRegion, setFilterRegion] = useState<'all' | 'USA' | 'Europe'>('all');
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);
  const [newChecklistText, setNewChecklistText] = useState('');

  const filteredApps = applications.filter((app) => {
    if (filterRegion !== 'all' && app.region !== filterRegion) return false;
    return true;
  });

  const handleStatusChange = (app: ApplicationItem, newStatus: ApplicationStatus) => {
    const updated = {
      ...app,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    if (newStatus === 'Accepted') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'],
      });
    }

    onUpdateApplication(updated);
    if (selectedApp?.id === app.id) {
      setSelectedApp(updated);
    }
  };

  const handleToggleChecklist = (app: ApplicationItem, checkId: string) => {
    const updatedList = (app.checklist || []).map((item) =>
      item.id === checkId ? { ...item, completed: !item.completed } : item
    );
    const updated = { ...app, checklist: updatedList, updatedAt: new Date().toISOString() };
    onUpdateApplication(updated);
    if (selectedApp?.id === app.id) setSelectedApp(updated);
  };

  const handleAddChecklistItem = (app: ApplicationItem) => {
    if (!newChecklistText.trim()) return;
    const newItem = {
      id: `check-${Date.now()}`,
      label: newChecklistText.trim(),
      completed: false,
    };
    const updated = {
      ...app,
      checklist: [...(app.checklist || []), newItem],
      updatedAt: new Date().toISOString(),
    };
    onUpdateApplication(updated);
    if (selectedApp?.id === app.id) setSelectedApp(updated);
    setNewChecklistText('');
  };

  const handleProfessorStatusChange = (
    app: ApplicationItem,
    profIndex: number,
    status: 'Not Contacted' | 'Cold Emailed' | 'Meeting Scheduled' | 'Agreed to Support'
  ) => {
    const profs = [...(app.targetProfessors || [])];
    profs[profIndex] = { ...profs[profIndex], status };
    const updated = { ...app, targetProfessors: profs, updatedAt: new Date().toISOString() };
    onUpdateApplication(updated);
    if (selectedApp?.id === app.id) setSelectedApp(updated);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="bg-[#0c1016]/90 border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">PhD Application Status Tracker</h1>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 font-semibold">
                {applications.length} Active Tracks
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Monitor candidate pipeline milestones, deadlines, faculty contacts, and materials.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-[#070a0f] p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'kanban' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Kanban className="h-3.5 w-3.5" />
                <span>Kanban Board</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'list' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <List className="h-3.5 w-3.5" />
                <span>Table / List</span>
              </button>
            </div>

            {/* Region Filter */}
            <div className="flex items-center bg-[#070a0f] px-2 py-1.5 rounded-xl border border-slate-800 text-xs">
              <Filter className="h-3.5 w-3.5 text-slate-500 mr-1.5" />
              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value as any)}
                className="bg-transparent text-slate-200 focus:outline-none text-xs"
              >
                <option value="all">All Regions (USA & Europe)</option>
                <option value="USA">USA Only 🇺🇸</option>
                <option value="Europe">Europe Only 🇪🇺</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tracker Body */}
      {applications.length === 0 ? (
        <div className="bg-[#0c1016]/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Kanban className="h-10 w-10 text-slate-600 mx-auto" />
          <h2 className="text-base font-bold text-slate-300">No PhD applications tracked yet</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Browse the PhD Openings catalog and click "Add to Tracker" or save recommended programs to organize your admissions journey.
          </p>
        </div>
      ) : viewMode === 'kanban' ? (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 overflow-x-auto pb-4">
          {STATUS_COLUMNS.map((col) => {
            const columnApps = filteredApps.filter((a) => a.status === col.status);
            return (
              <div
                key={col.status}
                className={`rounded-2xl border ${col.bg} p-3 flex flex-col min-h-[500px] shadow-sm`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-800/80">
                  <span className={`text-xs font-bold ${col.color}`}>{col.label}</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#070a0f] text-slate-400 border border-slate-800">
                    {columnApps.length}
                  </span>
                </div>

                {/* Cards in Column */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {columnApps.map((app) => {
                    const completedTasks = (app.checklist || []).filter((c) => c.completed).length;
                    const totalTasks = (app.checklist || []).length;
                    return (
                      <div
                        key={app.id}
                        onClick={() => setSelectedApp(app)}
                        className="p-3.5 rounded-xl bg-[#0c1016] border border-slate-800/80 hover:border-cyan-500/50 cursor-pointer transition shadow-md group space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition line-clamp-1">
                            {app.university}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#070a0f] text-slate-400 border border-slate-800">
                            {app.region}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-300 line-clamp-2 leading-tight">
                          {app.programTitle}
                        </p>

                        {/* Deadline */}
                        {app.deadline && (
                          <div className="flex items-center space-x-1 text-[10px] text-amber-300 font-mono">
                            <Calendar className="h-3 w-3 text-amber-400" />
                            <span>Deadline: {app.deadline}</span>
                          </div>
                        )}

                        {/* Checklist progress */}
                        {totalTasks > 0 && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span>Materials</span>
                              <span>{completedTasks}/{totalTasks}</span>
                            </div>
                            <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-cyan-400 rounded-full transition-all"
                                style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Contacted Professor count */}
                        {app.targetProfessors && app.targetProfessors.length > 0 && (
                          <div className="flex items-center space-x-1 text-[10px] text-cyan-300 truncate">
                            <Users className="h-3 w-3 shrink-0" />
                            <span className="truncate">PI: {app.targetProfessors[0].name} ({app.targetProfessors[0].status})</span>
                          </div>
                        )}

                        {/* Quick Move Dropdown */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                          <span className="text-slate-500">Move to:</span>
                          <select
                            value={app.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleStatusChange(app, e.target.value as ApplicationStatus)}
                            className="bg-[#070a0f] text-cyan-300 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] focus:outline-none"
                          >
                            {STATUS_COLUMNS.map((c) => (
                              <option key={c.status} value={c.status}>{c.status}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List / Table View */
        <div className="bg-[#0c1016]/90 border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#070a0f] text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">University & Program</th>
                  <th className="py-3.5 px-4">Region</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Deadline</th>
                  <th className="py-3.5 px-4">Target Professor</th>
                  <th className="py-3.5 px-4">Checklist</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredApps.map((app) => {
                  const completedTasks = (app.checklist || []).filter((c) => c.completed).length;
                  const totalTasks = (app.checklist || []).length;
                  return (
                    <tr key={app.id} className="hover:bg-[#0f1522] transition">
                      <td className="py-3.5 px-4 cursor-pointer" onClick={() => setSelectedApp(app)}>
                        <span className="font-bold text-white block">{app.university}</span>
                        <span className="text-[11px] text-slate-400 line-clamp-1">{app.programTitle}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">{app.country} ({app.region})</td>
                      <td className="py-3.5 px-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app, e.target.value as ApplicationStatus)}
                          className="bg-[#070a0f] border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-cyan-300 font-semibold focus:outline-none"
                        >
                          {STATUS_COLUMNS.map((c) => (
                            <option key={c.status} value={c.status}>{c.status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-amber-300">{app.deadline}</td>
                      <td className="py-3.5 px-4">
                        {app.targetProfessors && app.targetProfessors.length > 0 ? (
                          <div>
                            <span className="text-slate-200 font-medium block">{app.targetProfessors[0].name}</span>
                            <span className="text-[10px] text-cyan-400">{app.targetProfessors[0].status}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">None logged</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {totalTasks > 0 ? `${completedTasks}/${totalTasks} done` : '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedApp(app)}
                          className="text-xs text-cyan-400 hover:underline mr-3 cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteApplication(app.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Application Detail Drawer / Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0c1016] border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-[#070a0f] flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-bold text-cyan-400 uppercase font-mono">{selectedApp.university}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#121824] text-slate-300 border border-slate-800">{selectedApp.region}</span>
                </div>
                <h2 className="text-lg font-bold text-white">{selectedApp.programTitle}</h2>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Status and Deadline Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#070a0f] border border-slate-800">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Application Stage</label>
                  <select
                    value={selectedApp.status}
                    onChange={(e) => handleStatusChange(selectedApp, e.target.value as ApplicationStatus)}
                    className="w-full bg-[#121824] border border-slate-700 rounded-lg px-3 py-2 text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
                  >
                    {STATUS_COLUMNS.map((c) => (
                      <option key={c.status} value={c.status}>{c.status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Application Deadline</label>
                  <input
                    type="date"
                    value={selectedApp.deadline || ''}
                    onChange={(e) => {
                      const updated = { ...selectedApp, deadline: e.target.value, updatedAt: new Date().toISOString() };
                      onUpdateApplication(updated);
                      setSelectedApp(updated);
                    }}
                    className="w-full bg-[#121824] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Faculty Contact Logs */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                  <Users className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Target Professors & Contact Status</span>
                </h3>

                <div className="space-y-2">
                  {(selectedApp.targetProfessors || []).map((prof, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-[#070a0f] border border-slate-800 gap-2">
                      <div>
                        <span className="font-bold text-white block">{prof.name}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{prof.email}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <select
                          value={prof.status}
                          onChange={(e) => handleProfessorStatusChange(selectedApp, idx, e.target.value as any)}
                          className="bg-[#121824] border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-cyan-300 focus:outline-none"
                        >
                          <option value="Not Contacted">Not Contacted</option>
                          <option value="Cold Emailed">Cold Emailed</option>
                          <option value="Meeting Scheduled">Meeting Scheduled</option>
                          <option value="Agreed to Support">Agreed to Sponsor</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application Materials Checklist */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckSquare className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Application Materials & Tasks Checklist</span>
                </h3>

                <div className="space-y-1.5">
                  {(selectedApp.checklist || []).map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => handleToggleChecklist(selectedApp, item.id)}
                      className="w-full flex items-center space-x-2.5 p-2.5 rounded-lg bg-[#070a0f] border border-slate-800 text-left hover:border-slate-700 transition"
                    >
                      {item.completed ? (
                        <CheckSquare className="h-4 w-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-500 shrink-0" />
                      )}
                      <span className={`${item.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Add new task input */}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newChecklistText}
                    onChange={(e) => setNewChecklistText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddChecklistItem(selectedApp))}
                    placeholder="Add checklist item (e.g. Request recommendation letter from Prof. X)..."
                    className="flex-1 bg-[#070a0f] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddChecklistItem(selectedApp)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#121824] hover:bg-[#182132] text-slate-200 border border-slate-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Saved Cold Email Drafts */}
              {selectedApp.coldEmailDrafts && selectedApp.coldEmailDrafts.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                    <Mail className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Saved Cold Email Drafts ({selectedApp.coldEmailDrafts.length})</span>
                  </h3>
                  <div className="space-y-2">
                    {selectedApp.coldEmailDrafts.map((draft) => (
                      <div key={draft.id} className="p-3 rounded-xl bg-[#070a0f] border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-cyan-300">To: {draft.professorName}</span>
                          <span className="text-[10px] text-slate-500">{draft.createdAt?.split('T')[0]}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-semibold">{draft.subject}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-3 whitespace-pre-line">{draft.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Custom Notes & Interview Feedback</label>
                <textarea
                  rows={4}
                  value={selectedApp.notes || ''}
                  onChange={(e) => {
                    const updated = { ...selectedApp, notes: e.target.value, updatedAt: new Date().toISOString() };
                    onUpdateApplication(updated);
                    setSelectedApp(updated);
                  }}
                  placeholder="Record Zoom discussion points, lab rotation options, funding stipulations, and PI feedback..."
                  className="w-full bg-[#070a0f] border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-800 bg-[#070a0f] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  onDeleteApplication(selectedApp.id);
                  setSelectedApp(null);
                }}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove Application</span>
              </button>

              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 transition cursor-pointer shadow-md shadow-cyan-500/20"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
