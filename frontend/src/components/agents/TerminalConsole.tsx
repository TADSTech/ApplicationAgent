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
    <div className="flex flex-col h-full bg-white border border-[#E4E2DD] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#F5F3EE] border-b border-[#E4E2DD]">
        <div className="font-dm-sans text-sm font-semibold text-[#0A0A0A]">
          Activity Log
        </div>
      </div>

      {/* Logs Body */}
      <div 
        ref={scrollRef}
        className="flex-1 p-6 overflow-y-auto space-y-3"
      >
        {logs.length === 0 ? (
          <div className="text-center py-12 text-[#7F7F7F] font-dm-sans text-sm">
            No activity yet. Start a search to see updates.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start space-x-3">
              <span className="text-[#7F7F7F] font-dm-sans text-xs shrink-0 mt-0.5">
                {log.timestamp}
              </span>
              <span className="font-dm-sans text-sm font-semibold text-[#0A0A0A] shrink-0">
                {log.agent}
              </span>
              <span className={`font-dm-sans text-sm ${
                log.type === 'error' ? 'text-red-600' :
                log.type === 'warning' ? 'text-amber-600' :
                log.type === 'success' ? 'text-green-600' :
                'text-[#444444]'
              }`}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TerminalConsole;
