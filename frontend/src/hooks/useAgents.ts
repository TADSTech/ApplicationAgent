// frontend/src/hooks/useAgents.ts
import { useState, useEffect } from 'react';
import { AgentState } from '../types';

export function useAgents(sessionId: string) {
  const [agentStates, setAgentStates] = useState<Record<string, AgentState>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Polls agent states for a given session
  const fetchAgentStates = async () => {
    if (!sessionId) return;
    try {
      // In a real implementation, this would fetch from Firestore or API
      // Mock progress incrementing for scaffolding representation
      setAgentStates(prev => {
        const nextStates = { ...prev };
        ['job', 'resume', 'contract', 'linkedin'].forEach(type => {
          if (!nextStates[type]) {
            nextStates[type] = {
              sessionId,
              agentType: type as any,
              status: 'queued',
              progress: 0,
            };
          } else if (nextStates[type].status === 'running') {
            const nextProgress = Math.min(nextStates[type].progress + 25, 100);
            nextStates[type] = {
              ...nextStates[type],
              progress: nextProgress,
              status: nextProgress === 100 ? 'completed' : 'running',
            };
          }
        });
        return nextStates;
      });
    } catch (err) {
      console.error('Error fetching agent states', err);
    }
  };

  const triggerAgent = (agentType: string) => {
    setAgentStates(prev => ({
      ...prev,
      [agentType]: {
        sessionId,
        agentType: agentType as any,
        status: 'running',
        progress: 0,
      }
    }));
  };

  return { agentStates, isLoading, fetchAgentStates, triggerAgent };
}
export default useAgents;
