import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgents, TerminalLog } from '../hooks/useAgents';
import { apiClient } from '../services/api';
import TerminalConsole from '../components/agents/TerminalConsole';
import AgentStatusPanel from '../components/agents/AgentStatusPanel';
import ProgressMeter from '../components/agents/ProgressMeter';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Send, Loader2, ArrowLeft } from 'lucide-react';

export const AutoMode: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('Senior Product Designer fintech remote');
  const [sessionId, setSessionId] = useState<string>('session-' + Date.now());
  const [started, setStarted] = useState(false);
  const [starting, setStarting] = useState(false);

  const { agentStates, logs, setLogs, isLoading } = useAgents(started ? sessionId : '');

  const totalProgress = Object.values(agentStates).reduce((acc, curr) => acc + curr.progress, 0) / 4;

  useEffect(() => {
    if (logs.length === 0 && started) {
      const now = new Date().toLocaleTimeString([], { hour12: false });
      setLogs([
        { id: '1', timestamp: now, agent: 'System', message: `JobJockey Multi-Agent Orchestrator v1.0.4 initialized. Session: ${sessionId.slice(0, 20)}...`, type: 'info' },
        { id: '2', timestamp: now, agent: 'System', message: 'Establishing secure tunnel to Google Cloud Run...', type: 'info' },
        { id: '3', timestamp: now, agent: 'System', message: `Search initiated: "${searchQuery}"`, type: 'success' },
        { id: '4', timestamp: now, agent: 'System', message: 'JobAgent deployed. Scraping job boards...', type: 'info' },
      ]);
    }
  }, [started, logs.length, setLogs, sessionId, searchQuery]);

  const handleStart = async () => {
    if (!searchQuery.trim()) return;
    setStarting(true);
    const sid = 'session-' + Date.now();
    setSessionId(sid);

    try {
      await apiClient.startJobSearch(sid, searchQuery, 'Remote');
      setStarted(true);
    } catch {
      const now = new Date().toLocaleTimeString([], { hour12: false });
      setLogs([
        { id: '1', timestamp: now, agent: 'System', message: 'Failed to connect to backend. Using demo mode.', type: 'warning' },
        { id: '2', timestamp: now, agent: 'System', message: 'Running local simulation with mock agents...', type: 'info' },
      ]);
      setStarted(true);
    } finally {
      setStarting(false);
    }
  };

  const handleTerminate = () => {
    window.location.reload();
  };

  if (!started) {
    return (
      <div className="flex h-screen bg-[#FBF9F4] overflow-hidden font-dm-sans">
        {/* Left Pane: SRE Terminal (idle) */}
        <div className="w-1/2 bg-[#07111E] p-8 flex flex-col">
          <div className="mb-8">
            <h2 className="text-white font-dm-sans text-3xl font-bold leading-tight">
              Autonomous <span className="text-primary">Recruitment</span> <br />
              Loop
            </h2>
            <p className="text-[#7F7F7F] mt-2 font-dm-sans text-sm">
              Configure your search below and deploy the agent fleet.
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center mb-6">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              </div>
              <p className="text-[#00FFCC]/60 font-mono text-sm">
                Awaiting deployment command...
              </p>
            </div>
          </div>
        </div>

        {/* Right Pane: Launch Configuration */}
        <div className="w-1/2 p-12 flex flex-col bg-[#FBF9F4]">
          <div className="max-w-md mx-auto w-full flex flex-col h-full">
            <div className="mb-8">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 text-xs font-semibold text-[#7F7F7F] hover:text-[#0A0A0A] transition-colors mb-6 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Dashboard</span>
              </button>
              <h3 className="text-xl font-bold text-[#0A0A0A]">Launch Agent Fleet</h3>
              <p className="text-sm text-[#7F7F7F] mt-1">
                Describe the role you're looking for and let the agents handle the rest.
              </p>
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#7F7F7F] ml-4">
                  Job Search Query
                </label>
                <textarea
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Senior Product Designer at a fintech startup..."
                  rows={4}
                  className="w-full bg-white border border-[#E4E2DD] rounded-[20px] px-6 py-4 text-sm font-dm-sans text-[#0A0A0A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D00] resize-none"
                />
              </div>

              <Card className="border-[#E4E2DD] bg-[#FFF0EA]/30 rounded-2xl">
                <CardContent className="p-5 space-y-2">
                  <h4 className="text-xs font-bold text-[#FF4D00] uppercase tracking-wider">What happens next</h4>
                  <ul className="text-xs text-[#444444] space-y-1.5 font-medium">
                    <li>1. <span className="font-bold">JobAgent</span> scans 40+ boards for matching roles</li>
                    <li>2. <span className="font-bold">ResumeAgent</span> tailors your resume per job</li>
                    <li>3. <span className="font-bold">ContractAgent</span> reviews legal terms</li>
                    <li>4. <span className="font-bold">LinkedInAgent</span> drafts outreach messages</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="pt-8">
              <Button
                onClick={handleStart}
                disabled={starting || !searchQuery.trim()}
                variant="default"
                size="xl"
                className="w-full rounded-full bg-[#FF4D00] hover:bg-[#FF4D00]/90 text-white font-bold shadow-md cursor-pointer disabled:opacity-50"
              >
                {starting ? (
                  <span className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deploying Agents...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Deploy Agent Fleet</span>
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FBF9F4] overflow-hidden">
      {/* Left Pane: SRE Terminal */}
      <div className="w-1/2 bg-[#07111E] p-8 flex flex-col">
        <div className="mb-8">
          <h2 className="text-white font-dm-sans text-3xl font-bold leading-tight">
            Autonomous <span className="text-primary">Recruitment</span> <br />
            Loop Active
          </h2>
          <p className="text-[#7F7F7F] mt-2 font-dm-sans text-sm">
            Agents scanning for: <span className="text-white font-semibold">{searchQuery}</span>
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
              Session: {sessionId.slice(-8)}
            </div>
          </div>
          <button
            onClick={handleTerminate}
            className="text-[10px] text-destructive uppercase tracking-tighter font-bold hover:underline cursor-pointer"
          >
            Emergency Terminate
          </button>
        </div>
      </div>

      {/* Right Pane: Agent Status Dashboard */}
      <div className="w-1/2 p-12 flex flex-col bg-[#FBF9F4]">
        <div className="max-w-md mx-auto w-full flex flex-col h-full">
          <div className="mb-12">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#7F7F7F]">Overall Progress</span>
              <span className="text-xs font-medium text-[#7F7F7F]">{Math.round(totalProgress)}%</span>
            </div>
            <ProgressMeter progress={totalProgress} label="Orchestration Progress" />
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
                  The <span className="font-bold">JobAgent</span> is filtering for WAT (UTC+1) compatibility.
                  Roles requiring US Pacific core hours will be flagged for late-night shift confirmation.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 pt-8 border-t border-[#E4E2DD]">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="premium"
              size="xl"
              className="w-full rounded-full cursor-pointer"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoMode;
