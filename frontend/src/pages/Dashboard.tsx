// frontend/src/pages/Dashboard.tsx
import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import JobCard from '../components/jobs/JobCard';
import { Job } from '../types';
import { 
  Paperclip, 
  Globe, 
  Send, 
  MapPin, 
  Clock, 
  Coins, 
  TrendingUp, 
  ChevronRight,
  HelpCircle 
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  // Mode state: 'auto' | 'manual' controlled by Sidebar toggle
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  
  // Search prompt state
  const [prompt, setPrompt] = useState<string>(
    'Find me a senior product designer role at a fintech startup with a focus on high-fidelity prototyping and design systems...'
  );

  // Mock jobs matching the design screenshots exactly
  const mockJobs: Job[] = [
    {
      id: 'job-1',
      title: 'Senior Product Designer',
      company: 'NeoLedger',
      location: 'San Francisco',
      remote: true,
      salaryMin: 160000,
      salaryMax: 210000,
      salaryDisplay: '$160k - $210k + Equity',
      description: 'Senior Product Designer role at NeoLedger focusing on financial dashboards and Web3 transactions.',
      requirements: ['Figma', 'ProtoPie', 'Design Ops'],
      url: 'https://example.com/neoledger',
      postedAt: new Date().toISOString(),
      timeZone: 'EST',
      visaSponsorship: true,
      source: 'Firecrawl',
    },
    {
      id: 'job-2',
      title: 'Lead UX Architect',
      company: 'Axiom Data',
      location: 'New York (Hybrid)',
      remote: false,
      salaryMin: 185000,
      salaryMax: 230000,
      salaryDisplay: '$185k - $230k',
      description: 'Lead UX Architect at Axiom Data design system scaling and enterprise AI tools UX.',
      requirements: ['UX Research', 'AI tools', 'Design Systems'],
      url: 'https://example.com/axiom',
      postedAt: new Date().toISOString(),
      timeZone: 'EST',
      visaSponsorship: false,
      source: 'Firecrawl',
    },
    {
      id: 'job-3',
      title: 'Product Design Manager',
      company: 'Silvera',
      location: 'London',
      remote: true,
      salaryMin: 140000,
      salaryMax: 190000,
      salaryDisplay: '$140k - $190k',
      description: 'Product Design Manager at Silvera managing remote designers and product roadmap strategy.',
      requirements: ['Leadership', 'Strategy', 'Design Process'],
      url: 'https://example.com/silvera',
      postedAt: new Date().toISOString(),
      timeZone: 'GMT',
      visaSponsorship: true,
      source: 'Firecrawl',
    },
    {
      id: 'job-4',
      title: 'Interface Developer',
      company: 'Quantix',
      location: 'Austin (On-site)',
      remote: false,
      salaryMin: 130000,
      salaryMax: 175000,
      salaryDisplay: '$130k - $175k',
      description: 'Interface Developer at Quantix focusing on React, Three.js 3D web visualizations, and CSS/WebGL performance.',
      requirements: ['React', 'Three.js', 'WebGL'],
      url: 'https://example.com/quantix',
      postedAt: new Date().toISOString(),
      timeZone: 'CST',
      visaSponsorship: true,
      source: 'Firecrawl',
    },
  ];

  // Callback handlers for job card actions
  const handleViewAnalysis = (job: Job) => {
    alert(`[Auto Mode] Launching agent analysis for ${job.title} at ${job.company}.\nRetrieving ATS score alignment, skills-gap analysis, and WAT timezone compatibility report...`);
  };

  const handleViewDescription = (job: Job) => {
    alert(`[Manual Mode] Displaying job description for ${job.title} at ${job.company}:\n\n${job.description}`);
  };

  const handleApply = (job: Job) => {
    alert(`[Manual Mode] Redirecting to external application form for ${job.title} at ${job.company}:\n${job.url}`);
  };

  const handleSendPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Searching roles for: "${prompt}"`);
  };

  return (
    <div className="flex h-screen bg-[#FBF9F4] overflow-hidden">
      {/* Left Sidebar Layout */}
      <Sidebar mode={mode} onModeChange={setMode} />

      {/* Main Content Pane (Premium Editorial Canvas) */}
      <main className="flex-1 overflow-y-auto px-12 py-8 flex flex-col space-y-8">
        
        {/* Top Header Row */}
        <div className="flex justify-between items-center w-full">
          <h1 className="font-dm-sans text-3xl font-bold tracking-tight text-[#0A0A0A]">
            Dashboard
          </h1>
          
          <div className="flex items-center space-x-5">
            <button className="bg-[#FF4D00] hover:bg-[#FF4D00]/90 text-white font-bold px-6 py-2.5 rounded-full text-xs transition-all duration-200 shadow-sm cursor-pointer font-dm-sans">
              How to Guide
            </button>
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop" 
              alt="Profile Avatar"
              className="w-10 h-10 rounded-full object-cover border border-[#E4E2DD] shadow-sm"
            />
          </div>
        </div>

        {/* Center Canvas Wrapper */}
        <div className="max-w-5xl mx-auto w-full flex flex-col space-y-8 flex-1 pb-12">
          
          {/* Welcome Header */}
          <div className="text-center pt-8">
            <h2 className="font-dm-sans text-[#7F7F7F] text-2xl font-light leading-snug">
              Welcome,
            </h2>
            <h3 className="font-dm-sans text-[#0A0A0A] text-4xl font-semibold tracking-tight mt-1.5">
              What job would you like to find today?
            </h3>
          </div>

          {/* Interactive Search Prompt Box */}
          <form 
            onSubmit={handleSendPrompt}
            className="bg-[#FFFFFF] border border-[#E4E2DD] rounded-[24px] p-6 shadow-sm flex flex-col space-y-4 hover:border-[#15B097]/30 transition-all duration-300 w-full"
          >
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full resize-none bg-transparent border-0 focus:ring-0 focus:outline-none text-sm text-[#0A0A0A] font-dm-sans leading-relaxed min-h-[80px] placeholder:text-[#7F7F7F]"
              placeholder="Find me a role..."
            />
            
            <div className="flex justify-between items-center pt-2">
              {/* Attachment/Globe tools */}
              <div className="flex items-center space-x-4 text-[#7F7F7F]">
                <button 
                  type="button" 
                  className="hover:text-[#0A0A0A] transition-colors p-1.5 rounded-full hover:bg-[#F5F3EE] cursor-pointer"
                  title="Attach file"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <button 
                  type="button" 
                  className="hover:text-[#0A0A0A] transition-colors p-1.5 rounded-full hover:bg-[#F5F3EE] cursor-pointer"
                  title="Search globally"
                >
                  <Globe className="w-5 h-5" />
                </button>
              </div>

              {/* Submit / Send action */}
              <button 
                type="submit"
                className="bg-[#FF4D00] hover:bg-[#FF4D00]/95 text-white p-3 rounded-full flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95"
              >
                <Send className="w-4 h-4 fill-white" />
              </button>
            </div>
          </form>

          {/* Filters Row */}
          <div className="flex items-center space-x-3.5 flex-wrap gap-y-2">
            <button type="button" className="bg-[#FFFFFF] border border-[#E4E2DD] rounded-full px-4 py-2 text-xs font-medium text-[#444444] flex items-center space-x-2 shadow-sm hover:bg-[#F5F3EE] cursor-pointer transition-colors">
              <MapPin className="w-3.5 h-3.5 text-[#7F7F7F]" />
              <span>Remote</span>
            </button>
            <button type="button" className="bg-[#FFFFFF] border border-[#E4E2DD] rounded-full px-4 py-2 text-xs font-medium text-[#444444] flex items-center space-x-2 shadow-sm hover:bg-[#F5F3EE] cursor-pointer transition-colors">
              <Clock className="w-3.5 h-3.5 text-[#7F7F7F]" />
              <span>Full-time</span>
            </button>
            <button type="button" className="bg-[#FFFFFF] border border-[#E4E2DD] rounded-full px-4 py-2 text-xs font-medium text-[#444444] flex items-center space-x-2 shadow-sm hover:bg-[#F5F3EE] cursor-pointer transition-colors">
              <Coins className="w-3.5 h-3.5 text-[#7F7F7F]" />
              <span>$100k+</span>
            </button>
            <button type="button" className="bg-[#FFFFFF] border border-[#E4E2DD] rounded-full px-4 py-2 text-xs font-medium text-[#444444] flex items-center space-x-2 shadow-sm hover:bg-[#F5F3EE] cursor-pointer transition-colors">
              <TrendingUp className="w-3.5 h-3.5 text-[#7F7F7F]" />
              <span>Series B+</span>
            </button>
            
            <button 
              type="button" 
              className="text-[#FF4D00] hover:text-[#FF4D00]/80 text-xs font-semibold hover:underline cursor-pointer ml-2 transition-colors"
            >
              + More
            </button>
          </div>

          {/* Job Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {mockJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                mode={mode}
                matchScore={98}
                onViewAnalysis={handleViewAnalysis}
                onViewDescription={handleViewDescription}
                onApply={handleApply}
              />
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
