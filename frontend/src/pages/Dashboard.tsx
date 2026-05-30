// frontend/src/pages/Dashboard.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { useAgents } from '../hooks/useAgents';
import { apiClient } from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import JobCard from '../components/jobs/JobCard';
import AgentStatusPanel from '../components/agents/AgentStatusPanel';
import { Card, CardContent } from '../components/ui/Card';
import { Job } from '../types';
import { Avatar } from '../components/ui/Avatar';
import { DropdownMenu } from '../components/ui/DropdownMenu';
import { ResumeEditor } from '../components/resume/ResumeEditor';
import { 
  Paperclip, 
  Globe, 
  Send, 
  MapPin, 
  Clock, 
  Coins, 
  TrendingUp, 
  ChevronRight,
  HelpCircle,
  User,
  Bell,
  CreditCard,
  LifeBuoy,
  LogOut,
  FileText,
  Building2,
  Briefcase,
  Plane,
  Sparkles,
  ArrowRight,
  Bot,
  Loader2,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  // Mode state: 'auto' | 'manual' controlled by Sidebar toggle
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [view, setView] = useState<'dashboard' | 'resume'>('dashboard');
  
  // Search prompt state
  const [prompt, setPrompt] = useState<string>(
    'Find me a senior product designer role at a fintech startup with a focus on high-fidelity prototyping and design systems...'
  );
  const [searching, setSearching] = useState(false);

  // Agent tracking (3.4.3)
  const currentSession = 'session-' + (user?.email || 'default');
  const { agentStates, isLoading: agentsLoading } = useAgents(currentSession);

  // Avatar dropdown menu
  const [menuOpen, setMenuOpen] = useState(false);

  // Filter chips
  const allFilters = [
    { id: 'remote', label: 'Remote', icon: MapPin },
    { id: 'full-time', label: 'Full-time', icon: Clock },
    { id: '100k+', label: '$100k+', icon: Coins },
    { id: 'series-b+', label: 'Series B+', icon: TrendingUp },
    { id: 'visa', label: 'Visa Sponsorship', icon: Globe },
    { id: 'contract', label: 'Contract', icon: FileText },
    { id: 'senior', label: 'Senior Level', icon: Briefcase },
    { id: 'startup', label: 'Startups', icon: Building2 },
    { id: 'relocation', label: 'Relocation', icon: Plane },
    { id: 'equity', label: 'Equity', icon: Coins },
  ] as const;

  const alwaysVisible = allFilters.slice(0, 4);
  const optionalFilters = allFilters.slice(4);

  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(['remote', 'full-time', '100k+', 'series-b+'])
  );
  const [moreOpen, setMoreOpen] = useState(false);
  const [popupAlignRight, setPopupAlignRight] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const toggleMore = () => {
    if (moreOpen) {
      setMoreOpen(false);
      return;
    }
    if (moreRef.current) {
      const rect = moreRef.current.getBoundingClientRect();
      setPopupAlignRight(rect.right + 360 > window.innerWidth);
    }
    setMoreOpen(true);
  };

  const toggleFilter = (id: string) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    if (!moreOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [moreOpen]);

  const visibleChips = [
    ...alwaysVisible,
    ...optionalFilters.filter(f => activeFilters.has(f.id)),
  ];

  const popupChips = optionalFilters.filter(f => !activeFilters.has(f.id));

  const dropdownItems = [
    { label: 'Profile', icon: User, onClick: () => navigate('/account#profile') },
    { label: 'Notifications', icon: Bell, onClick: () => navigate('/account#notifications') },
    { label: 'Billing', icon: CreditCard, onClick: () => navigate('/account#billing') },
    { label: 'Help & Support', icon: LifeBuoy, onClick: () => navigate('/account#help') },
    { label: 'Sign Out', icon: LogOut, onClick: () => navigate('/account#signout') },
  ];

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

  const handleSendPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setSearching(true);
    try {
      await apiClient.startJobSearch(currentSession, prompt, 'Remote');
      navigate('/auto');
    } catch {
      alert(`Search failed for: "${prompt}". Ensure the backend is running.`);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#FBF9F4] overflow-hidden">
      {/* Left Sidebar Layout */}
      <Sidebar mode={mode} onModeChange={setMode} onUpdateResume={() => setView('resume')} />

      {view === 'resume' ? (
        <ResumeEditor onBack={() => setView('dashboard')} />
      ) : (
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
            <div className="relative">
              <div
                onClick={() => setMenuOpen(v => !v)}
                className="cursor-pointer"
              >
                <Avatar seed="user@jobjockey.ai" size={40} />
              </div>
              {menuOpen && (
                <DropdownMenu
                  items={dropdownItems}
                  onClose={() => setMenuOpen(false)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Center Canvas Wrapper */}
        <div className="max-w-5xl mx-auto w-full flex flex-col space-y-8 flex-1 pb-12">
          
          {/* Welcome Header */}
          <div className="text-center pt-8">
            <h2 className="font-dm-sans text-[#7F7F7F] text-2xl font-light leading-snug">
              Welcome {user?.name ?? 'there'},
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
                disabled={searching}
                className="bg-[#FF4D00] hover:bg-[#FF4D00]/95 text-white p-3 rounded-full flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 fill-white" />}
              </button>
            </div>
          </form>

          {/* Filters Row */}
          <div className="flex items-center space-x-3.5 flex-wrap gap-y-2">
            {visibleChips.map((f) => {
              const Icon = f.icon;
              const isActive = activeFilters.has(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => toggleFilter(f.id)}
                  className={cn(
                    'rounded-full px-4 py-2 text-xs font-medium flex items-center space-x-2 transition-all duration-200',
                    isActive
                      ? 'bg-white text-[#444444] border border-[#E4E2DD] shadow-sm'
                      : 'bg-[#F5F3EE] text-[#B0B0B0]'
                  )}
                >
                  <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-[#7F7F7F]' : 'text-[#B0B0B0]')} />
                  <span>{f.label}</span>
                </button>
              );
            })}

            {popupChips.length > 0 && (
              <div className="relative ml-2" ref={moreRef}>
                <button
                  type="button"
                  onClick={toggleMore}
                  className={cn(
                    'text-xs font-semibold transition-colors cursor-pointer',
                    moreOpen ? 'text-[#FF4D00]' : 'text-[#FF4D00] hover:text-[#FF4D00]/80'
                  )}
                >
                  + More
                </button>

              {moreOpen && (
                <div className={cn("absolute top-full mt-2 z-50 bg-white border border-[#E4E2DD] rounded-xl shadow-xl p-4 min-w-[340px] animate-in fade-in slide-in-from-top-2 duration-200", popupAlignRight ? 'right-0' : 'left-0')}>
                  <div className="grid grid-cols-2 gap-2">
                    {popupChips.map((f) => {
                      const Icon = f.icon;
                      const isActive = activeFilters.has(f.id);
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => toggleFilter(f.id)}
                          className={cn(
                            'rounded-full px-3 py-2 text-xs font-medium flex items-center space-x-2 transition-all duration-200',
                            isActive
                              ? 'bg-white text-[#444444] border border-[#E4E2DD]'
                              : 'bg-[#F5F3EE] text-[#B0B0B0] hover:bg-[#EBE9E3]'
                          )}
                        >
                          <Icon className={cn('w-3 h-3', isActive ? 'text-[#7F7F7F]' : 'text-[#B0B0B0]')} />
                          <span>{f.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
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

          {/* Agent Status Section (3.4.3) */}
          <div className="pt-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#7F7F7F] flex items-center space-x-2">
                <Bot className="w-4 h-4" />
                <span>Active Agents</span>
              </h3>
              <button
                onClick={() => navigate('/auto')}
                className="text-xs font-semibold text-[#FF4D00] hover:text-[#FF4D00]/80 transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <span>View Full Console</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            {agentsLoading ? (
              <div className="flex items-center space-x-2 text-xs text-[#7F7F7F] py-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading agent states...</span>
              </div>
            ) : (
              <AgentStatusPanel agentStates={agentStates} />
            )}
          </div>

          {/* Next Steps Section (3.4.4) */}
          <div className="pt-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#7F7F7F] mb-4 flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Next Steps</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-[#E4E2DD] rounded-2xl hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/auto')}>
                <CardContent className="p-5 flex flex-col space-y-2">
                  <div className="w-9 h-9 rounded-full bg-[#FFF0EA] flex items-center justify-center">
                    <Bot className="w-4 h-4 text-[#FF4D00]" />
                  </div>
                  <h4 className="font-bold text-sm text-[#0A0A0A]">Start Auto Mode</h4>
                  <p className="text-xs text-[#7F7F7F] leading-relaxed">Let agents search, tailor, and apply on your behalf.</p>
                </CardContent>
              </Card>
              <Card className="border-[#E4E2DD] rounded-2xl hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/swipe')}>
                <CardContent className="p-5 flex flex-col space-y-2">
                  <div className="w-9 h-9 rounded-full bg-[#E2F9EE] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#15B097]" />
                  </div>
                  <h4 className="font-bold text-sm text-[#0A0A0A]">Try Swipe Mode</h4>
                  <p className="text-xs text-[#7F7F7F] leading-relaxed">Quickly curate opportunities with swipe gestures.</p>
                </CardContent>
              </Card>
              <Card className="border-[#E4E2DD] rounded-2xl hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/settings')}>
                <CardContent className="p-5 flex flex-col space-y-2">
                  <div className="w-9 h-9 rounded-full bg-[#F5F3EE] flex items-center justify-center">
                    <FileText className="w-4 h-4 text-[#444444]" />
                  </div>
                  <h4 className="font-bold text-sm text-[#0A0A0A]">Configure Settings</h4>
                  <p className="text-xs text-[#7F7F7F] leading-relaxed">Set salary targets, timezone, and search sources.</p>
                </CardContent>
              </Card>
            </div>
          </div>
          </div>
      </main>
      )}
    </div>
  );
};

export default Dashboard;
