import React from 'react';
import { AgentState } from '../../types';

interface AgentStatusPanelProps {
  agentStates: Record<string, AgentState>;
}

export const AgentStatusPanel: React.FC<AgentStatusPanelProps> = ({ agentStates }) => {
  const agents = [
    { key: 'job', label: 'Job Scout Agent', description: 'Scraping & WAT Filter' },
    { key: 'resume', label: 'Resume Aligner', description: 'Context Adaptation' },
    { key: 'contract', label: 'Legal Advisor', description: 'Clause Analysis' },
    { key: 'linkedin', label: 'Outreach Agent', description: 'Personalized DMs' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success';
      case 'running': return 'bg-primary animate-pulse';
      case 'failed': return 'bg-destructive';
      default: return 'bg-border';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Ready';
      case 'running': return 'Active';
      case 'failed': return 'Error';
      default: return 'Queued';
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {agents.map((agent) => {
        const state = agentStates[agent.key] || { status: 'queued', progress: 0 };
        return (
          <div 
            key={agent.key}
            className="flex items-center justify-between p-4 bg-white border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(state.status)}`}></div>
              <div>
                <h4 className="text-sm font-bold text-foreground font-dm-sans">{agent.label}</h4>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{agent.description}</p>
              </div>
            </div>
            
            <div className="text-right">
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${
                state.status === 'completed' ? 'text-success bg-success/10' :
                state.status === 'running' ? 'text-primary bg-primary/10' :
                state.status === 'failed' ? 'text-destructive bg-destructive/10' :
                'text-muted-foreground bg-background'
              }`}>
                {getStatusText(state.status)}
              </span>
              <div className="mt-2 w-24 bg-muted h-1 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${state.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AgentStatusPanel;
