import React from 'react';
import { Progress } from '../ui/Progress';

interface ProgressMeterProps {
  progress: number;
  label: string;
}

export const ProgressMeter: React.FC<ProgressMeterProps> = ({ progress, label }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-bold text-foreground font-dm-sans uppercase tracking-tight">{label}</span>
        <span className="text-2xl font-bold text-primary font-space-mono">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-4 shadow-inner" />
      <div className="mt-2 flex justify-between">
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">System Integrity: Nominal</span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Multi-Agent Latency: 42ms</span>
      </div>
    </div>
  );
};

export default ProgressMeter;
