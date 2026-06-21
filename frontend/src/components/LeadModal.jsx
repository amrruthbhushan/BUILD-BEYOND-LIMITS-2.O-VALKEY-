import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

export default function LeadModal({ lead, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    industry: '',
    status: 'New',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        company: lead.company || '',
        email: lead.email || '',
        phone: lead.phone || '',
        industry: lead.industry || '',
        status: lead.status || 'New',
        notes: lead.notes || ''
      });
    } else {
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        industry: '',
        status: 'New',
        notes: ''
      });
    }
    setErrors({});
  }, [lead, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear field error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.industry.trim()) newErrors.industry = 'Industry vertical is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  const industries = [
    'Software & SaaS',
    'Financial Services',
    'Healthcare & Biotech',
    'E-Commerce & Retail',
    'Manufacturing',
    'Logistics & Supply Chain',
    'Telecommunications',
    'Energy & Utilities',
    'Education',
    'Professional Services',
    'Real Estate',
    'Agriculture & Food'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transform scale-100 transition-transform duration-300 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/40">
          <h3 className="title-font text-base font-bold text-slate-800 dark:text-slate-100">
            {lead ? 'Modify Lead Information' : 'Register New Lead'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lead Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Contact Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border ${
                  errors.name ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200 dark:border-slate-800 focus:border-violet-500'
                } text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all`}
                placeholder="e.g. John Doe"
              />
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            {/* Lead Company */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Company *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border ${
                  errors.company ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800 focus:border-violet-500'
                } text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all`}
                placeholder="e.g. Acme Tech"
              />
              {errors.company && <p className="text-[11px] text-rose-500 mt-1">{errors.company}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border ${
                  errors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800 focus:border-violet-500'
                } text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all`}
                placeholder="prospect@company.com"
              />
              {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 focus:border-violet-500 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                placeholder="+1-555-0199"
              />
            </div>

            {/* Industry Verticals */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Industry Vertical *
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border ${
                  errors.industry ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800 focus:border-violet-500'
                } text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer`}
              >
                <option value="">Select Vertical...</option>
                {industries.map((ind, i) => (
                  <option key={i} value={ind}>{ind}</option>
                ))}
              </select>
              {errors.industry && <p className="text-[11px] text-rose-500 mt-1">{errors.industry}</p>}
            </div>

            {/* Pipeline Stage */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Pipeline Stage *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 focus:border-violet-500 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Nurturing">Nurturing</option>
                <option value="Qualified">Qualified</option>
                <option value="Closed-Won">Closed-Won</option>
                <option value="Closed-Lost">Closed-Lost</option>
              </select>
            </div>
          </div>

          {/* Notes & History */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Sales Engagement Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 focus:border-violet-500 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all resize-none"
              placeholder="e.g. Attended conference, requested pricing sheets, budget approved for Q4."
            />
          </div>
        </form>

        {/* Modal Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-xs font-semibold hover:shadow-lg hover:shadow-violet-600/10 hover:opacity-95 transition-all duration-300"
          >
            <Check className="h-4 w-4" />
            <span>Save Lead</span>
          </button>
        </div>
      </div>
    </div>
  );
}
