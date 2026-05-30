// frontend/src/hooks/useAgents.ts
import { useState, useEffect, useCallback } from 'react';
import { AgentState } from '../types';
import { apiClient } from '../services/api';

export interface TerminalLog {
  id: string;
  timestamp: string;
  agent: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export function useAgents(sessionId: string) {
  const [agentStates, setAgentStates] = useState<Record<string, AgentState>>({});
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Polls agent states for a given session
  const fetchAgentStates = useCallback(async () => {
    if (!sessionId) return;
    try {
      const states = await apiClient.getAgentStates(sessionId);
      const statesMap: Record<string, AgentState> = {};
      states.forEach(state => {
        statesMap[state.agentType] = state;
      });
      setAgentStates(statesMap);

      // In a real app, logs might come from a separate endpoint or websocket
      // For now, we derive some system logs based on state changes
      deriveLogsFromStates(statesMap);
    } catch (err) {
      console.error('Error fetching agent states', err);
    }
  }, [sessionId]);

  const deriveLogsFromStates = (states: Record<string, AgentState>) => {
    // This is a simplified log derivation for the demo
    const newLogs: TerminalLog[] = [];
    const now = new Date().toLocaleTimeString([], { hour12: false });
    
    Object.values(states).forEach(state => {
      if (state.status === 'running' && state.progress < 10) {
        newLogs.push({
          id: `${state.agentType}-start-${Date.now()}`,
          timestamp: now,
          agent: `${state.agentType.charAt(0).toUpperCase() + state.agentType.slice(1)}Agent`,
          message: `Initializing ${state.agentType} sequence...`,
          type: 'info'
        });
      }
    });
    // Deduplicate and append logic would go here
  };

  useEffect(() => {
    if (!sessionId) return;

    const interval = setInterval(() => {
      fetchAgentStates();
    }, 3000);

    return () => clearInterval(interval);
  }, [sessionId, fetchAgentStates]);

  const triggerAgent = async (agentType: string, keywords: string = 'Software Engineer') => {
    setIsLoading(true);
    try {
      await apiClient.startJobSearch(sessionId, keywords || 'Software Engineer', 'Remote');
      await fetchAgentStates();
    } catch (err) {
      console.error('Failed to trigger agent', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { agentStates, logs, setLogs, isLoading, fetchAgentStates, triggerAgent };
}
export default useAgents;
