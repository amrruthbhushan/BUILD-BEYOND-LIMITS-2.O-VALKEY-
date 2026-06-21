import React, { useState, useEffect } from 'react';
import { Sparkles, Mail, Lock, LogIn, Database } from 'lucide-react';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import AnalyticsCharts from './components/AnalyticsCharts';
import LeadsList from './components/LeadsList';
import LeadModal from './components/LeadModal';
import CopilotModal from './components/CopilotModal';
import ValkeyConsole from './components/ValkeyConsole';

const BACKEND_URL = 'http://localhost:5000';

export default function App() {
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const [valkeyStatus, setValkeyStatus] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Modals state
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null); // for editing
  
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotLead, setCopilotLead] = useState(null); // for AI Copilot sidebar

  // Initialize Theme and check cache status
  useEffect(() => {
    // Check dark mode preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Attempt to load mock session if previously logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch leads and diagnostics when authenticated
  useEffect(() => {
    if (user) {
      fetchLeads();
      fetchValkeyStatus();
    }
  }, [user]);

  const fetchLeads = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/leads`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.error("Failed to load leads from backend:", err);
    }
  };

  const fetchValkeyStatus = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/valkey/status`);
      if (res.ok) {
        const status = await res.json();
        setValkeyStatus(status);
      }
    } catch (err) {
      console.error("Valkey status fetch failed:", err);
    }
  };

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (email === 'admin@copilot.ai' && password === 'password') {
      // Fetch session from backend to prove Valkey integration logic
      try {
        const res = await fetch(`${BACKEND_URL}/api/session`);
        if (res.ok) {
          const sessionUser = await res.json();
          setUser(sessionUser);
          localStorage.setItem('user', JSON.stringify(sessionUser));
        } else {
          // Fallback if backend offline
          const mockUser = { username: email, role: 'Sales Manager' };
          setUser(mockUser);
          localStorage.setItem('user', JSON.stringify(mockUser));
        }
      } catch (err) {
        // Fallback offline login
        const mockUser = { username: email, role: 'Sales Manager' };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
      }
    } else {
      setAuthError('Invalid credentials. Use admin@copilot.ai / password');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // CRUD Operations
  const handleSaveLead = async (formData) => {
    try {
      let response;
      if (selectedLead) {
        // Edit Mode
        response = await fetch(`${BACKEND_URL}/api/leads/${selectedLead.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        // Add Mode
        response = await fetch(`${BACKEND_URL}/api/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      if (response.ok) {
        setIsLeadModalOpen(false);
        setSelectedLead(null);
        fetchLeads();
      }
    } catch (err) {
      console.error("Save lead operation failed:", err);
    }
  };

  const handleDeleteLead = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead? This will also purge its cached AI scores and history.")) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/leads/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          fetchLeads();
          // If deleted lead was open in Copilot, close it
          if (copilotLead && copilotLead.id === id) {
            setIsCopilotOpen(false);
            setCopilotLead(null);
          }
        }
      } catch (err) {
        console.error("Failed to delete lead:", err);
      }
    }
  };

  const handleResetDb = async () => {
    if (window.confirm("This will reset the database back to the 20 pre-populated sales leads and clear all Valkey caches. Proceed?")) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/db/reset`, { method: 'POST' });
        if (res.ok) {
          alert('Database successfully re-seeded!');
          fetchLeads();
          setIsCopilotOpen(false);
          setCopilotLead(null);
        }
      } catch (err) {
        console.error("Database reset failed:", err);
      }
    }
  };

  const handleOpenCopilot = (lead) => {
    setCopilotLead(lead);
    setIsCopilotOpen(true);
  };

  // Re-fetch lead statistics dynamically if details change in Copilot sidebar (like scoring)
  useEffect(() => {
    if (isCopilotOpen && copilotLead) {
      const timer = setInterval(async () => {
        // Sync the state of the active copilot lead to table updates
        try {
          const res = await fetch(`${BACKEND_URL}/api/leads/${copilotLead.id}`);
          if (res.ok) {
            const updated = await res.json();
            // If the lead got graded, sync to state list and update local copy
            if (updated.aiScore !== copilotLead.aiScore) {
              setLeads(prev => prev.map(l => l.id === updated.id ? updated : l));
            }
          }
        } catch (e) {}
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [isCopilotOpen, copilotLead]);

  // LOGIN SCREEN
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 p-4 transition-colors duration-300">
        <div className="w-full max-w-md">
          {/* Logo brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="p-3 bg-gradient-to-tr from-violet-600 to-indigo-500 rounded-2xl text-white shadow-xl shadow-violet-500/10 mb-3 animate-pulse">
              <Sparkles className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-extrabold font-sans text-white tracking-tight">
              Sales Copilot
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              AI-Powered Lead Insights & Outreach SaaS
            </p>
          </div>

          {/* Login Card */}
          <div className="p-8 rounded-2xl border border-slate-800 bg-[#0f172a]/70 backdrop-blur-xl shadow-2xl">
            <h2 className="title-font text-xl font-bold text-white mb-6">
              Welcome back
            </h2>
            
            {authError && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-violet-600/15 hover:opacity-95 transition-all duration-300"
              >
                <LogIn className="h-4.5 w-4.5" />
                <span>Enter Workspace</span>
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800/80 text-center text-xs text-slate-500">
              <p>Demo Login Credentials:</p>
              <div className="mt-1.5 font-mono text-[11px] text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-950 inline-block">
                User: <span className="text-violet-400">admin@copilot.ai</span> | Pass: <span className="text-violet-400">password</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED WORKSPACE
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070913] text-slate-800 dark:text-slate-100 transition-colors duration-300 flex flex-col pb-16">
      {/* Background Decorators */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/5 dark:bg-violet-500/5 rounded-full filter blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-600/5 dark:bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none animate-pulse-slow" />

      {/* Navigation */}
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        onResetDb={handleResetDb}
        valkeyStatus={valkeyStatus}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Statistics Metric Panels */}
        <DashboardStats leads={leads} />

        {/* Charts & Graphs */}
        <AnalyticsCharts leads={leads} />

        {/* Lead Data Grid Table */}
        <LeadsList 
          leads={leads}
          onAddLead={() => { setSelectedLead(null); setIsLeadModalOpen(true); }}
          onEditLead={(lead) => { setSelectedLead(lead); setIsLeadModalOpen(true); }}
          onDeleteLead={handleDeleteLead}
          onOpenCopilot={handleOpenCopilot}
        />
      </main>

      {/* Lead Create/Edit Modal Form */}
      <LeadModal
        lead={selectedLead}
        isOpen={isLeadModalOpen}
        onClose={() => { setIsLeadModalOpen(false); setSelectedLead(null); }}
        onSave={handleSaveLead}
      />

      {/* AI Copilot Side Drawer panel */}
      <CopilotModal
        lead={copilotLead}
        isOpen={isCopilotOpen}
        onClose={() => { setIsCopilotOpen(false); setCopilotLead(null); }}
        backendUrl={BACKEND_URL}
      />

      {/* Valkey Telemetry Terminal Console */}
      <ValkeyConsole 
        backendUrl={BACKEND_URL}
        valkeyStatus={valkeyStatus}
      />
    </div>
  );
}
