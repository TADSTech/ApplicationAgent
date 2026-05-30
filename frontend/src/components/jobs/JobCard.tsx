// frontend/src/components/jobs/JobCard.tsx
import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Job } from '../../types';
import { cn } from '@/lib/utils';

interface JobCardProps {
  job: Job;
  matchScore?: number; // e.g. 98 for 98% MATCH
  mode: 'auto' | 'manual';
  onViewAnalysis?: (job: Job) => void;
  onViewDescription?: (job: Job) => void;
  onApply?: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  matchScore = 98,
  mode,
  onViewAnalysis,
  onViewDescription,
  onApply,
}) => {
  // Convert USD salary to NGN equivalent (baseline exchange rate: 1550 NGN/USD as per project conventions)
  const formatSalaryWithNgn = () => {
    if (job.salaryDisplay) {
      // If we already have a display string, we can try to extract numbers and append NGN conversion
      // For the mock jobs, we will hardcode the converted values for perfect layout alignment, 
      // or fall back to calculating them if salaryMin/salaryMax are present.
      return job.salaryDisplay;
    }

    const formatNgn = (val: number) => {
      return `₦${(val * 1550).toLocaleString(undefined, { maximumFractionDigits: 0 })} NGN`;
    };

    if (job.salaryMin && job.salaryMax) {
      return `$${(job.salaryMin / 1000).toFixed(0)}k - $${(job.salaryMax / 1000).toFixed(0)}k (~${formatNgn(job.salaryMin)} - ${formatNgn(job.salaryMax)})`;
    } else if (job.salaryMin) {
      return `$${(job.salaryMin / 1000).toFixed(0)}k+ (~${formatNgn(job.salaryMin)})`;
    }
    
    return 'Salary undisclosed';
  };

  // Get initials for the company logo placeholder
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E4E2DD] rounded-2xl p-6 flex flex-col justify-between hover:border-[#15B097]/40 transition-all duration-300 min-h-[220px]">
      <div>
        {/* Header: Initial Logo & Match Percentage */}
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-xl border border-[#E4E2DD] bg-[#F5F3EE] flex items-center justify-center font-space-mono text-lg font-bold text-[#0A0A0A]">
            {getInitials(job.company)}
          </div>
          
          <div className="bg-[#E0FDF4] text-[#15B097] text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full font-space-mono border border-[#15B097]/10 uppercase">
            {matchScore}% Match
          </div>
        </div>

        {/* Job Title & Subtitle */}
        <h3 className="font-dm-sans text-[#0A0A0A] text-lg font-semibold tracking-tight leading-snug mb-1">
          {job.title}
        </h3>
        <p className="font-dm-sans text-xs text-[#7F7F7F] mb-4">
          {job.company} • {job.location} {job.remote && '(Remote)'}
        </p>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.requirements.slice(0, 3).map((req, index) => (
            <span
              key={index}
              className="bg-[#F5F3EE] text-[#444444] text-xs font-medium px-3 py-1 rounded-full font-dm-sans"
            >
              {req}
            </span>
          ))}
        </div>
      </div>

      {/* Salary & Action Buttons */}
      <div className="mt-4 pt-4 border-t border-[#F5F3EE] flex flex-col space-y-3">
        <div className="text-xs font-medium text-[#15B097] font-space-mono">
          {formatSalaryWithNgn()}
        </div>

        {mode === 'manual' && (
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => onViewDescription?.(job)}
                className="text-[#FF4D00] hover:text-[#FF4D00]/80 text-xs font-medium font-dm-sans transition-colors cursor-pointer hover:underline"
              >
                View Description
              </button>
              <button
                onClick={() => onApply?.(job)}
                className="text-[#FF4D00] hover:text-[#FF4D00]/80 text-xs font-bold font-dm-sans flex items-center space-x-1 transition-colors cursor-pointer hover:underline"
              >
                <span>Apply to Job</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCard;
