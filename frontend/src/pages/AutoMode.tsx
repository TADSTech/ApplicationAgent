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
        { id: '1', timestamp: now, agent: 'System', message: `Starting search: ${searchQuery}`, type: 'info' },
        { id: '2', timestamp: now, agent: 'System', message: 'Job Scout is looking for matching roles...', type: 'info' },
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
        { id: '1', timestamp: now, agent: 'System', message: 'Using demo mode', type: 'info' },
        { id: '2', timestamp: now, agent: 'System', message: 'Running local simulation...', type: 'info' },
      ]);
      setStarted(true);
    } finally {
      setStarting(false);
    }
  };

  const handleReset = () => {
    setStarted(false);
    setSearchQuery('Senior Product Designer fintech remote');
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] py-12 px-6 font-dm-sans">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-sm font-semibold text-[#7F7F7F] hover:text-[#0A0A0A] transition-colors mb-8 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-[#0A0A0A]">Start Auto Search</h1>
              <p className="text-[#7F7F7F] mt-2">
                Let our assistants find and prepare applications for you.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#7F7F7F] uppercase tracking-wider">
                  What are you looking for?
                </label>
                <textarea
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Senior Product Designer at a fintech startup..."
                  rows={4}
                  className="w-full bg-white border border-[#E4E2DD] rounded-2xl px-5 py-4 text-sm font-dm-sans text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-[#FF4D00]/30 resize-none"
                />
              </div>

              <Card className="border-[#E4E2DD] bg-white rounded-2xl">
                <CardContent className="p-6 space-y-3">
                  <h4 className="text-sm font-semibold text-[#0A0A0A]">What we'll do</h4>
                  <ul className="text-sm text-[#444444] space-y-2">
                    <li>• Job Scout will search for matching roles</li>
                    <li>• Resume Tailor will adapt your resume</li>
                    <li>• Contract Reviewer will check terms</li>
                    <li>• Outreach Assistant will draft messages</li>
                  </ul>
                </CardContent>
              </Card>

              <Button
                onClick={handleStart}
                disabled={starting || !searchQuery.trim()}
                variant="default"
                size="xl"
                className="w-full rounded-full bg-[#FF4D00] hover:bg-[#FF4D00]/90 text-white font-bold cursor-pointer disabled:opacity-50"
              >
                {starting ? (
                  <span className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Starting...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Start Search</span>
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
    <div className="min-h-screen bg-[#FBF9F4] py-12 px-6 font-dm-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#0A0A0A]">Auto Search in Progress</h1>
            <p className="text-[#7F7F7F] mt-1">
              Searching for: <span className="text-[#0A0A0A] font-semibold">{searchQuery}</span>
            </p>
          </div>
          <Button
            onClick={handleReset}
            variant="ghost"
            className="text-[#7F7F7F] hover:text-[#0A0A0A]"
          >
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Activity Log */}
          <div className="h-[600px]">
            <TerminalConsole logs={logs} />
          </div>

          {/* Right Column: Agent Status */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-[#7F7F7F] uppercase tracking-wider">Overall Progress</span>
                <span className="text-xs font-medium text-[#7F7F7F]">{Math.round(totalProgress)}%</span>
              </div>
              <ProgressMeter progress={totalProgress} label="Orchestration Progress" />
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-[#7F7F7F] uppercase tracking-wider">
                Assistants
              </h3>
              <AgentStatusPanel agentStates={agentStates} />
            </div>

            <Card className="border-[#E4E2DD] bg-white rounded-2xl mt-8">
              <CardContent className="p-6">
                <h4 className="text-sm font-semibold text-[#0A0A0A] mb-2">Note</h4>
                <p className="text-sm text-[#444444]">
                  Roles requiring unusual time zone overlap will be flagged for your confirmation.
                </p>
              </CardContent>
            </Card>

            <Button
              onClick={() => navigate('/dashboard')}
              variant="premium"
              size="xl"
              className="w-full rounded-full cursor-pointer mt-4"
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
