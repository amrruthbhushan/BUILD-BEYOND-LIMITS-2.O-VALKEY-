import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ChevronUp, ChevronDown, Trash2, Shield, Circle, HelpCircle } from 'lucide-react';

export default function ValkeyConsole({ backendUrl, valkeyStatus }) {
  const [isOpen, setIsOpen] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [sseConnected, setSseConnected] = useState(false);
  const terminalEndRef = useRef(null);

  useEffect(() => {
    // Set up Server Sent Events (SSE) connection
    console.log("Connecting to Valkey telemetry stream...");
    const eventSource = new EventSource(`${backendUrl}/api/valkey/telemetry`);

    eventSource.onopen = () => {
      setSseConnected(true);
      // Append opening log
      appendLocalLog('SSE_CLIENT', ['Valkey live stream connected successfully']);
    };

    eventSource.onmessage = (event) => {
      try {
        const rawLog = JSON.parse(event.data);
        setConsoleLogs(prev => [rawLog, ...prev].slice(0, 80)); // Limit to last 80 logs
      } catch (err) {
        console.error("Failed to parse telemetry log:", err);
      }
    };

    eventSource.onerror = (e) => {
      console.warn("SSE connection error, closing or reconnecting.");
      setSseConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, [backendUrl]);

  // Scroll to bottom when new logs appear and console is open
  useEffect(() => {
    if (terminalEndRef.current && isOpen) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs, isOpen]);

  const appendLocalLog = (command, args) => {
    const localLog = {
      id: 'local-' + Math.random(),
      timestamp: new Date().toISOString(),
      command,
      args,
      status: 'SUCCESS',
      error: '',
      mode: valkeyStatus?.mode || 'VALKEY'
    };
    setConsoleLogs(prev => [localLog, ...prev].slice(0, 80));
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setConsoleLogs([]);
  };

  const formatArgs = (args) => {
    if (!args || args.length === 0) return '';
    return args.map(arg => {
      if (arg.startsWith('{') || arg.startsWith('[')) {
        // Truncate long JSON payloads for terminal readability
        return arg.length > 50 ? arg.substring(0, 50) + '...' : arg;
      }
      return `"${arg}"`;
    }).join(' ');
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 bg-[#0b0f19] border-t border-slate-200 dark:border-slate-800 transition-all duration-300 shadow-2xl flex flex-col font-mono text-xs ${
      isOpen ? 'h-72' : 'h-11'
    }`}>
      {/* Console Header (Click to toggle) */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="h-11 px-5 flex items-center justify-between cursor-pointer border-b border-slate-200 dark:border-slate-800 bg-[#0f172a] text-slate-300 select-none hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Terminal className="h-4 w-4 text-violet-500 animate-pulse" />
          <span className="font-semibold text-slate-200 text-xs">Valkey Live CLI Console</span>
          <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">
            <Circle className={`h-2.5 w-2.5 fill-current ${
              sseConnected ? 'text-emerald-500 animate-pulse' : 'text-rose-500'
            }`} />
            <span className="text-slate-400">{sseConnected ? 'Streaming' : 'Offline'}</span>
          </div>
          
          {valkeyStatus && (
            <div className="hidden sm:flex items-center space-x-1 text-[10px] text-slate-400">
              <span>Client:</span>
              <span className={`px-1 rounded ${valkeyStatus.connected ? 'text-emerald-400 bg-emerald-950/20' : 'text-amber-400 bg-amber-950/20'}`}>
                {valkeyStatus.mode}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleClear}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Clear Terminal Logs"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <div className="text-slate-400">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </div>
        </div>
      </div>

      {/* Terminal Command Output logs */}
      {isOpen && (
        <div className="flex-1 p-5 overflow-y-auto bg-[#070913] text-[#a6accd] space-y-1 scrollbar-thin scrollbar-thumb-slate-800 flex flex-col-reverse">
          {/* Scroll target */}
          <div ref={terminalEndRef} />
          
          {consoleLogs.map((log) => {
            const dateStr = new Date(log.timestamp).toLocaleTimeString();
            const isSystem = log.command === 'INFO' || log.command === 'SYSTEM_FALLBACK' || log.command === 'SSE_CLIENT';
            
            return (
              <div key={log.id} className="leading-5 hover:bg-slate-950/40 py-0.5 rounded px-1 transition-colors flex flex-col md:flex-row md:items-start select-text">
                {/* Timestamp */}
                <span className="text-slate-600 mr-3 select-none">[{dateStr}]</span>
                
                {/* Success/Failed status */}
                {log.status === 'FAILED' ? (
                  <span className="text-rose-500 font-bold mr-2 select-none">[ERR]</span>
                ) : (
                  <span className="text-emerald-500 font-bold mr-2 select-none">[OK]</span>
                )}
                
                {/* Command details */}
                {isSystem ? (
                  <span className="text-cyan-400 font-semibold">{log.args[0]}</span>
                ) : (
                  <div className="flex-1 flex flex-wrap items-baseline gap-1">
                    <span className="text-violet-400 font-bold uppercase">{log.command}</span>
                    <span className="text-white font-medium break-all">{formatArgs(log.args)}</span>
                    {log.error && <span className="text-rose-400 text-[10px] ml-2 font-mono">({log.error})</span>}
                  </div>
                )}
                
                {/* Engine Mode */}
                <span className="hidden md:inline-block text-[9px] font-mono text-slate-700 bg-slate-900 border border-slate-950 px-1 rounded ml-auto">
                  {log.mode}
                </span>
              </div>
            );
          })}

          {consoleLogs.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-600 select-none py-12">
              <Terminal className="h-8 w-8 text-slate-700 mb-2" />
              <p className="text-xs">Console is empty. Interaction logs will stream here automatically.</p>
              <p className="text-[10px] mt-1 text-slate-700">Try creating a lead, running AI scoring, or editing a record to trigger events.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
