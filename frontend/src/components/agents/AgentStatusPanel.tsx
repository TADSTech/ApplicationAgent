import React from 'react';
import { AgentState } from '../../types';

interface AgentStatusPanelProps {
  agentStates: Record<string, AgentState>;
}

export const AgentStatusPanel: React.FC<AgentStatusPanelProps> = ({ agentStates }) => {
  const agents = [
    { key: 'job', label: 'Job Scout', description: 'Finds matching roles' },
    { key: 'resume', label: 'Resume Tailor', description: 'Adapts your resume' },
    { key: 'contract', label: 'Contract Reviewer', description: 'Checks legal terms' },
    { key: 'linkedin', label: 'Outreach Assistant', description: 'Drafts messages' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'running': return 'bg-[#FF4D00]';
      case 'failed': return 'bg-red-500';
      default: return 'bg-[#E4E2DD]';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Done';
      case 'running': return 'Active';
      case 'failed': return 'Error';
      default: return 'Pending';
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {agents.map((agent) => {
        const state = agentStates[agent.key] || { status: 'queued', progress: 0 };
        return (
          <div 
            key={agent.key}
            className="flex items-center justify-between p-5 bg-white border border-[#E4E2DD] rounded-2xl"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(state.status)}`}></div>
              <div>
                <h4 className="text-sm font-semibold text-[#0A0A0A] font-dm-sans">{agent.label}</h4>
                <p className="text-xs text-[#7F7F7F]">{agent.description}</p>
              </div>
            </div>
            
            <div className="text-right">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                state.status === 'completed' ? 'text-green-700 bg-green-50' :
                state.status === 'running' ? 'text-[#FF4D00] bg-[#FFF0EA]' :
                state.status === 'failed' ? 'text-red-700 bg-red-50' :
                'text-[#7F7F7F] bg-[#F5F3EE]'
              }`}>
                {getStatusText(state.status)}
              </span>
              <div className="mt-3 w-32 bg-[#E4E2DD] h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#FF4D00] transition-all duration-500" 
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
