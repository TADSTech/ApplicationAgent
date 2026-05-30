import React, { useEffect, useRef } from 'react';

interface TerminalLog {
  id: string;
  timestamp: string;
  agent: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

interface TerminalConsoleProps {
  logs: TerminalLog[];
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-[#07111E] border border-primary/30 rounded-lg overflow-hidden shadow-2xl">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#030810] border-b border-primary/20">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-destructive"></div>
          <div className="w-3 h-3 rounded-full bg-warning"></div>
          <div className="w-3 h-3 rounded-full bg-success"></div>
        </div>
        <div className="text-[10px] text-primary/60 font-mono uppercase tracking-widest">
          SRE Live Orchestrator Console
        </div>
        <div className="w-12"></div>
      </div>

      {/* Terminal Body */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 font-mono text-xs overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
      >
        <div className="space-y-1">
          {logs.length === 0 ? (
            <div className="text-[#00FFCC]/40 animate-pulse">
              [SYSTEM] Awaiting agent initialization...
              <span className="inline-block w-2 h-4 ml-1 bg-[#00FF88] animate-blink"></span>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex space-x-2 leading-relaxed">
                <span className="text-primary/40 shrink-0">[{log.timestamp}]</span>
                <span className={`shrink-0 font-bold ${
                  log.agent === 'JobAgent' ? 'text-blue-400' :
                  log.agent === 'ResumeAgent' ? 'text-purple-400' :
                  log.agent === 'ContractAgent' ? 'text-orange-400' :
                  log.agent === 'LinkedInAgent' ? 'text-pink-400' :
                  'text-[#00FFCC]'
                }`}>
                  [{log.agent}]
                </span>
                <span className={`${
                  log.type === 'error' ? 'text-destructive' :
                  log.type === 'warning' ? 'text-warning' :
                  log.type === 'success' ? 'text-success' :
                  'text-[#00FFCC]/90'
                }`}>
                  {log.message}
                </span>
              </div>
            ))
          )}
          {logs.length > 0 && (
            <div className="pt-2">
              <span className="inline-block w-2 h-4 bg-success animate-blink"></span>
            </div>
          ) }
        </div>
      </div>
    </div>
  );
};

export default TerminalConsole;
