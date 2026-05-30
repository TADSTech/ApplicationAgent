import React, { useState, useEffect } from 'react';
import { useAgents, TerminalLog } from '../hooks/useAgents';
import TerminalConsole from '../components/agents/TerminalConsole';
import AgentStatusPanel from '../components/agents/AgentStatusPanel';
import ProgressMeter from '../components/agents/ProgressMeter';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export const AutoMode: React.FC = () => {
  const sessionId = "session-123"; // This would come from context or URL
  const { agentStates, logs, setLogs } = useAgents(sessionId);
  
  // Calculate overall progress
  const totalProgress = Object.values(agentStates).reduce((acc, curr) => acc + curr.progress, 0) / 4;

  useEffect(() => {
    // Initial system logs
    if (logs.length === 0) {
      const now = new Date().toLocaleTimeString([], { hour12: false });
      setLogs([
        { id: '1', timestamp: now, agent: 'System', message: 'JobJockey Multi-Agent Orchestrator v1.0.4 initialized.', type: 'info' },
        { id: '2', timestamp: now, agent: 'System', message: 'Establishing secure tunnel to Google Cloud Run...', type: 'info' },
        { id: '3', timestamp: now, agent: 'System', message: 'Connection established. Waiting for job seeker instructions.', type: 'success' },
      ]);
    }
  }, [logs.length, setLogs]);

  return (
    <div className="flex h-screen bg-[#FBF9F4] overflow-hidden">
      {/* Left Pane: SRE Terminal (Maximalism) */}
      <div className="w-1/2 bg-[#07111E] p-8 flex flex-col">
        <div className="mb-8">
          <h2 className="text-white font-dm-sans text-3xl font-bold leading-tight">
            Autonomous <span className="text-primary">Recruitment</span> <br />
            Loop Active
          </h2>
          <p className="text-[#7F7F7F] mt-2 font-dm-sans text-sm">
            Your agents are currently scanning, tailoring, and reaching out to global recruiters.
          </p>
        </div>
        
        <div className="flex-1 min-h-0">
          <TerminalConsole logs={logs} />
        </div>

        <div className="mt-6 flex items-center justify-between px-2">
          <div className="flex space-x-4">
            <div className="text-[10px] text-primary uppercase tracking-tighter font-bold">
              ● Live Stream
            </div>
            <div className="text-[10px] text-[#7F7F7F] uppercase tracking-tighter">
              Uptime: 00:42:15
            </div>
          </div>
          <button 
            className="text-[10px] text-destructive uppercase tracking-tighter font-bold hover:underline"
            onClick={() => window.location.reload()}
          >
            Emergency Terminate
          </button>
        </div>
      </div>

      {/* Right Pane: Sleek UI (Minimalism) */}
      <div className="w-1/2 p-12 flex flex-col bg-[#FBF9F4]">
        <div className="max-w-md mx-auto w-full flex flex-col h-full">
          <div className="mb-12">
            <ProgressMeter progress={totalProgress} label="Overall Orchestration Progress" />
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            <div className="mb-6">
              <h3 className="text-xs font-bold text-[#7F7F7F] uppercase tracking-widest mb-4">
                Active Agent Fleet
              </h3>
              <AgentStatusPanel agentStates={agentStates} />
            </div>

            <Card className="mt-12 bg-[#ECEBE4] border-[#E4E2DD]">
              <CardContent className="pt-6">
                <h4 className="text-sm font-bold text-[#0A0A0A] mb-2 font-dm-sans">Agent Intelligence Note</h4>
                <p className="text-xs text-[#444444] leading-relaxed">
                  The <span className="font-bold">JobAgent</span> is currently filtering for WAT (UTC+1) compatibility. 
                  Roles requiring US Pacific core hours will be flagged for late-night shift confirmation.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 pt-8 border-t border-[#E4E2DD]">
            <Button variant="premium" size="xl" className="w-full">
              Pause Autonomous Mode
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoMode;
