import React from 'react';
import { Progress } from '../ui/Progress';

interface ProgressMeterProps {
  progress: number;
  label: string;
}

export const ProgressMeter: React.FC<ProgressMeterProps> = ({ progress, label }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-3">
        <span className="text-sm font-semibold text-[#0A0A0A] font-dm-sans">{label}</span>
        <span className="text-2xl font-bold text-[#FF4D00] font-dm-sans">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-3 bg-[#E4E2DD]" />
    </div>
  );
};

export default ProgressMeter;
