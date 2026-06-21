import React from 'react';
import { Sparkles, Sun, Moon, Database, LogOut, User } from 'lucide-react';

export default function Navbar({ user, onLogout, darkMode, toggleDarkMode, onResetDb, valkeyStatus }) {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/75 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-gradient-to-tr from-violet-600 to-indigo-500 rounded-xl text-white shadow-md shadow-violet-500/20">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold font-sans tracking-tight bg-gradient-to-r from-violet-600 to-indigo-500 dark:from-violet-400 dark:to-indigo-300 bg-clip-text text-transparent">
                Sales Copilot
              </span>
              <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                SaaS v1.0
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Valkey Status Badge */}
            {valkeyStatus && (
              <div 
                className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                  valkeyStatus.connected 
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                }`}
                title={`Valkey mode: ${valkeyStatus.mode} at ${valkeyStatus.url}`}
              >
                <div className={`h-2 w-2 rounded-full ${valkeyStatus.connected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
                <span className="capitalize">{valkeyStatus.mode} Mode</span>
              </div>
            )}

            {/* Reset Database Button */}
            <button
              onClick={onResetDb}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              title="Reset DB to 20 Demo Leads & Flush Cache"
            >
              <Database className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset Demo Leads</span>
            </button>

            {/* Dark Mode Switcher */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* User Profile */}
            {user && (
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div className="hidden lg:block text-right">
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {user.username.split('@')[0]}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">
                    {user.role}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <User className="h-4 w-4" />
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
