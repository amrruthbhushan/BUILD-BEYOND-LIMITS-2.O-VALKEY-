import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Sparkles, 
  Edit2, 
  Trash2, 
  Flame, 
  AlertCircle, 
  Snowflake, 
  Filter 
} from 'lucide-react';

export default function LeadsList({ leads, onAddLead, onEditLead, onDeleteLead, onOpenCopilot }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [aiFilter, setAiFilter] = useState('All');

  // Filter handlers
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    const matchesAi = aiFilter === 'All' || 
      (aiFilter === 'Unscored' && !lead.aiCategory) || 
      lead.aiCategory === aiFilter;

    return matchesSearch && matchesStatus && matchesAi;
  });

  const getStatusBadge = (status) => {
    const base = "px-2.5 py-1 text-xs font-semibold rounded-full border ";
    switch (status) {
      case 'New':
        return `${base} bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700`;
      case 'Contacted':
        return `${base} bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/50`;
      case 'Nurturing':
        return `${base} bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/50`;
      case 'Qualified':
        return `${base} bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/50`;
      case 'Closed-Won':
        return `${base} bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50`;
      case 'Closed-Lost':
        return `${base} bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/50`;
      default:
        return `${base} bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700`;
    }
  };

  const getAiBadge = (category, score) => {
    const base = "inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ";
    if (!category) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 border-dashed">
          Unscored
        </span>
      );
    }

    switch (category) {
      case 'Hot':
        return (
          <span className={`${base} bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20`}>
            <Flame className="h-3 w-3 fill-rose-500" />
            <span>Hot ({score}%)</span>
          </span>
        );
      case 'Warm':
        return (
          <span className={`${base} bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20`}>
            <AlertCircle className="h-3 w-3" />
            <span>Warm ({score}%)</span>
          </span>
        );
      case 'Cold':
        return (
          <span className={`${base} bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20`}>
            <Snowflake className="h-3 w-3" />
            <span>Cold ({score}%)</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm backdrop-blur-md">
      {/* Header & Controls */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="title-font text-lg font-bold text-slate-800 dark:text-slate-100">
            Pipeline Leads
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your leads, run AI assessment scores, and compose targeted follow-ups.
          </p>
        </div>
        
        {/* Add Lead Trigger */}
        <button
          onClick={onAddLead}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-violet-600/20 hover:opacity-95 transition-all duration-300 self-start md:self-auto shrink-0 glow-btn"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search leads, companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap w-full md:w-auto items-center gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            <span className="text-xs text-slate-400 dark:text-slate-500">Filters:</span>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Nurturing">Nurturing</option>
            <option value="Qualified">Qualified</option>
            <option value="Closed-Won">Closed-Won</option>
            <option value="Closed-Lost">Closed-Lost</option>
          </select>

          {/* AI Category Filter */}
          <select
            value={aiFilter}
            onChange={(e) => setAiFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
          >
            <option value="All">All AI Grades</option>
            <option value="Hot">Hot</option>
            <option value="Warm">Warm</option>
            <option value="Cold">Cold</option>
            <option value="Unscored">Unscored</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left custom-table">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold bg-slate-50/20 dark:bg-slate-900/10">
              <th className="py-4 px-6">Prospect / Company</th>
              <th className="py-4 px-6 hidden sm:table-cell">Contact</th>
              <th className="py-4 px-6">Industry</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">AI Copilot Score</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 text-sm">
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className="hover:bg-slate-50/30 dark:hover:bg-slate-900/15 transition-colors group"
                >
                  {/* Name & Company */}
                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {lead.name}
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">
                      {lead.company}
                    </div>
                  </td>

                  {/* Email & Phone */}
                  <td className="py-4 px-6 hidden sm:table-cell">
                    <div className="text-slate-700 dark:text-slate-300">{lead.email}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">{lead.phone || 'No phone'}</div>
                  </td>

                  {/* Industry */}
                  <td className="py-4 px-6">
                    <span className="text-slate-600 dark:text-slate-400 text-xs font-medium">
                      {lead.industry}
                    </span>
                  </td>

                  {/* Pipeline Status */}
                  <td className="py-4 px-6">
                    <span className={getStatusBadge(lead.status)}>
                      {lead.status}
                    </span>
                  </td>

                  {/* AI Rating */}
                  <td className="py-4 px-6">
                    {getAiBadge(lead.aiCategory, lead.aiScore)}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {/* AI Copilot Action */}
                      <button
                        onClick={() => onOpenCopilot(lead)}
                        className="p-2 rounded-lg bg-violet-50 dark:bg-violet-950/20 hover:bg-violet-100 dark:hover:bg-violet-900/40 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900/30 transition-colors shadow-sm group/btn"
                        title="Open AI Copilot Hub"
                      >
                        <Sparkles className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                      </button>

                      {/* Edit Lead */}
                      <button
                        onClick={() => onEditLead(lead)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                        title="Edit Details"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>

                      {/* Delete Lead */}
                      <button
                        onClick={() => onDeleteLead(lead.id)}
                        className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 hover:border-rose-200 dark:hover:border-rose-800/40 border border-transparent transition-colors"
                        title="Delete Lead"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-400 dark:text-slate-500">
                  No leads found matching your active filters or search terms.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer Metrics */}
      <div className="p-4 bg-slate-50/30 dark:bg-slate-900/10 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span>Showing {filteredLeads.length} of {leads.length} leads</span>
        <span>AI Copilot Engine Active</span>
      </div>
    </div>
  );
}
