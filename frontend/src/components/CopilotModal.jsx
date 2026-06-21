import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Flame, 
  AlertCircle, 
  Snowflake, 
  Copy, 
  Check, 
  Mail, 
  Linkedin, 
  MessageSquare,
  Activity,
  ArrowRight
} from 'lucide-react';

export default function CopilotModal({ lead, isOpen, onClose, backendUrl }) {
  const [scoring, setScoring] = useState(false);
  const [generatingFollowups, setGeneratingFollowups] = useState(false);
  
  const [aiScore, setAiScore] = useState(null);
  const [aiFollowups, setAiFollowups] = useState(null);
  const [valkeyHistory, setValkeyHistory] = useState([]);
  
  const [activeTab, setActiveTab] = useState('email');
  const [copiedText, setCopiedText] = useState('');

  // Load cache when lead opens
  useEffect(() => {
    if (lead && isOpen) {
      // Set initial values if lead is already scored in db
      if (lead.aiCategory) {
        setAiScore({
          score: lead.aiScore,
          category: lead.aiCategory,
          probability: lead.aiProbability,
          reasoning: lead.aiReasoning || []
        });
      } else {
        setAiScore(null);
      }
      setAiFollowups(null);
      setValkeyHistory([]);
      fetchValkeyHistory();
      
      // Auto-load follow-ups if they might be cached
      checkCachedFollowups();
    }
  }, [lead, isOpen]);

  if (!isOpen || !lead) return null;

  const fetchValkeyHistory = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/leads/${lead.id}/history`);
      if (res.ok) {
        const history = await res.json();
        setValkeyHistory(history);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const checkCachedFollowups = async () => {
    // Attempt to hit the endpoint - if cached, it returns instantly
    // We only run this if lead is already scored
    if (lead.aiCategory) {
      try {
        const res = await fetch(`${backendUrl}/api/leads/${lead.id}/followups`, {
          method: 'POST', // The endpoint serves cache check too
          headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          setAiFollowups(data);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleRunScoring = async () => {
    setScoring(true);
    try {
      const res = await fetch(`${backendUrl}/api/leads/${lead.id}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setAiScore(data);
        fetchValkeyHistory();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setScoring(false);
    }
  };

  const handleGenerateFollowUps = async () => {
    setGeneratingFollowups(true);
    try {
      const res = await fetch(`${backendUrl}/api/leads/${lead.id}/followups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setAiFollowups(data);
        fetchValkeyHistory();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingFollowups(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const getScoreColor = (category) => {
    switch (category) {
      case 'Hot': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Warm': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Cold': return 'text-sky-500 bg-sky-500/10 border-sky-500/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getScoreIcon = (category) => {
    switch (category) {
      case 'Hot': return <Flame className="h-5 w-5 fill-rose-500" />;
      case 'Warm': return <AlertCircle className="h-5 w-5" />;
      case 'Cold': return <Snowflake className="h-5 w-5" />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl h-full flex flex-col transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/40">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-violet-600 rounded-xl text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="title-font text-base font-bold text-slate-800 dark:text-slate-100">
                AI Sales Copilot
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Analyzing lead: <span className="font-semibold text-slate-700 dark:text-slate-300">{lead.name}</span> @ {lead.company}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* AI SCORING BLOCK */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/20 backdrop-blur-md">
            <h4 className="title-font text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center space-x-2">
              <Activity className="h-4.5 w-4.5 text-violet-500" />
              <span>AI Lead Scoring & Analysis</span>
            </h4>

            {!aiScore && !scoring && (
              <div className="text-center py-6">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Run Gemini analysis to score this lead's likelihood of closing.
                </p>
                <button
                  onClick={handleRunScoring}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-lg hover:shadow-violet-500/10 text-white rounded-xl text-xs font-semibold transition-all duration-300 glow-btn"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Analyze & Score Lead</span>
                </button>
              </div>
            )}

            {scoring && (
              <div className="py-8 flex flex-col items-center justify-center space-y-3">
                <div className="relative h-12 w-12">
                  <div className="absolute inset-0 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
                  <Sparkles className="absolute inset-3 h-6 w-6 text-violet-500 animate-pulse" />
                </div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 animate-pulse">
                  Gemini is evaluating contract potential, notes, and profile...
                </p>
              </div>
            )}

            {aiScore && !scoring && (
              <div className="space-y-4">
                {/* Scoring Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Readiness Score</span>
                    <div className="text-3xl font-extrabold text-violet-600 dark:text-violet-400 mt-1">{aiScore.score}%</div>
                  </div>
                  <div className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center ${getScoreColor(aiScore.category)}`}>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">AI Classification</span>
                    <div className="flex items-center space-x-1 font-bold text-lg">
                      {getScoreIcon(aiScore.category)}
                      <span>{aiScore.category}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Conversion Probability</span>
                    <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{aiScore.probability}%</div>
                  </div>
                </div>

                {/* Reasoning Bullets */}
                <div>
                  <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    AI Diagnostic Reasoning
                  </h5>
                  <ul className="space-y-2">
                    {aiScore.reasoning && aiScore.reasoning.map((item, idx) => (
                      <li key={idx} className="flex items-start text-xs text-slate-600 dark:text-slate-300">
                        <ArrowRight className="h-3.5 w-3.5 text-violet-500 shrink-0 mt-0.5 mr-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* AI OUTREACH GENERATOR */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/20 backdrop-blur-md">
            <h4 className="title-font text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center space-x-2">
              <Mail className="h-4.5 w-4.5 text-violet-500" />
              <span>AI Smart Follow-up Outreach</span>
            </h4>

            {!aiScore && (
              <p className="text-xs text-center text-slate-400 dark:text-slate-500 py-4">
                Please score the lead first to enable outreach generation.
              </p>
            )}

            {aiScore && !aiFollowups && !generatingFollowups && (
              <div className="text-center py-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Generate hyper-personalized emails, LinkedIn connect drafts, and WhatsApp pitches.
                </p>
                <button
                  onClick={handleGenerateFollowUps}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-xs font-semibold transition-all duration-300 glow-btn"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Generate Followups</span>
                </button>
              </div>
            )}

            {generatingFollowups && (
              <div className="py-6 flex flex-col items-center justify-center space-y-3">
                <div className="relative h-10 w-10">
                  <div className="absolute inset-0 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 animate-pulse">
                  Drafting follow-ups across email, LinkedIn, and WhatsApp...
                </p>
              </div>
            )}

            {aiFollowups && !generatingFollowups && (
              <div className="space-y-4">
                {/* Tabs Selector */}
                <div className="flex border-b border-slate-200 dark:border-slate-800">
                  {[
                    { id: 'email', name: 'Email Draft', icon: Mail },
                    { id: 'linkedin', name: 'LinkedIn Invite', icon: Linkedin },
                    { id: 'whatsapp', name: 'WhatsApp Pitch', icon: MessageSquare }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors ${
                          active 
                            ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400' 
                            : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{tab.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Tab Output Windows */}
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 relative group/code">
                  {activeTab === 'email' && (
                    <div className="space-y-3">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Subject</div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-900 pb-2">
                          {aiFollowups.email?.subject}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Message Body</div>
                        <pre className="text-xs font-sans text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed select-text">
                          {aiFollowups.email?.body}
                        </pre>
                      </div>
                      {/* Copy Actions */}
                      <button
                        onClick={() => copyToClipboard(`${aiFollowups.email?.subject}\n\n${aiFollowups.email?.body}`, 'email')}
                        className="absolute right-3 top-3 p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg hover:text-slate-800 dark:hover:text-white transition-all opacity-0 group-hover/code:opacity-100"
                        title="Copy Entire Email"
                      >
                        {copiedText === 'email' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  )}

                  {activeTab === 'linkedin' && (
                    <div className="relative pr-6">
                      <pre className="text-xs font-sans text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed select-text">
                        {aiFollowups.linkedin}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(aiFollowups.linkedin, 'linkedin')}
                        className="absolute right-0 top-0 p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg hover:text-slate-800 dark:hover:text-white transition-all opacity-0 group-hover/code:opacity-100"
                        title="Copy LinkedIn Message"
                      >
                        {copiedText === 'linkedin' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  )}

                  {activeTab === 'whatsapp' && (
                    <div className="relative pr-6">
                      <pre className="text-xs font-sans text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed select-text">
                        {aiFollowups.whatsapp}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(aiFollowups.whatsapp, 'whatsapp')}
                        className="absolute right-0 top-0 p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg hover:text-slate-800 dark:hover:text-white transition-all opacity-0 group-hover/code:opacity-100"
                        title="Copy WhatsApp Pitch"
                      >
                        {copiedText === 'whatsapp' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* VALKEY LOGS SPECIFIC TO LEAD */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/20 backdrop-blur-md">
            <h4 className="title-font text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <span>Valkey Session Memory & Cache Log</span>
            </h4>
            
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-[10px] text-slate-400 max-h-40 overflow-y-auto space-y-1.5">
              {valkeyHistory.length > 0 ? (
                valkeyHistory.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start py-0.5 border-b border-slate-900 last:border-0">
                    <span className="text-violet-400 shrink-0 select-none mr-2">➜ LPUSH history:lead:{lead.id}</span>
                    <span className="text-slate-300 text-right select-text">{item}</span>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-600 py-2">
                  No Valkey transaction logs found for this lead.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
