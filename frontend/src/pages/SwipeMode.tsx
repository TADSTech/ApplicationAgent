import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/Sidebar';
import { Avatar } from '../components/ui/Avatar';
import { DropdownMenu } from '../components/ui/DropdownMenu';
import { Job } from '../types';
import {
  X,
  Heart,
  Sparkles,
  Undo2,
  Briefcase,
  MapPin,
  Clock,
  Globe,
  Coins,
  User,
  Bell,
  CreditCard,
  LifeBuoy,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const MOCK_JOBS: (Job & { logoColor: string })[] = [
  {
    id: '1', title: 'Senior Product Designer', company: 'NeoLedger',
    location: 'San Francisco, CA', remote: true,
    salaryMin: 160000, salaryMax: 210000,
    salaryDisplay: '$160k – $210k + Equity',
    description: 'Senior Product Designer role at NeoLedger focusing on financial dashboards and Web3 transactions. You will lead design system initiatives and collaborate with a world-class engineering team.',
    requirements: ['Figma', 'ProtoPie', 'Design Ops', 'Web3'],
    url: '', postedAt: new Date().toISOString(),
    timeZone: 'EST', visaSponsorship: true, source: 'Firecrawl',
    logoColor: 'bg-emerald-950 text-white',
  },
  {
    id: '2', title: 'Lead UX Architect', company: 'Axiom Data',
    location: 'New York, NY (Hybrid)', remote: false,
    salaryMin: 185000, salaryMax: 230000,
    salaryDisplay: '$185k – $230k',
    description: 'Lead UX Architect at Axiom Data — scale design systems and enterprise AI tools. You will define the UX vision for a suite of data products used by Fortune 500 companies.',
    requirements: ['UX Research', 'AI/ML', 'Design Systems', 'Leadership'],
    url: '', postedAt: new Date().toISOString(),
    timeZone: 'EST', visaSponsorship: false, source: 'Firecrawl',
    logoColor: 'bg-blue-600 text-white',
  },
  {
    id: '3', title: 'Product Design Manager', company: 'Silvera',
    location: 'London, UK', remote: true,
    salaryMin: 140000, salaryMax: 190000,
    salaryDisplay: '$140k – $190k',
    description: 'Product Design Manager at Silvera — manage a distributed team of 8 designers. Drive product strategy and design process improvements across the organization.',
    requirements: ['Leadership', 'Strategy', 'Design Process', 'Figma'],
    url: '', postedAt: new Date().toISOString(),
    timeZone: 'GMT', visaSponsorship: true, source: 'Firecrawl',
    logoColor: 'bg-purple-700 text-white',
  },
  {
    id: '4', title: 'Interface Developer', company: 'Quantix',
    location: 'Austin, TX (On-site)', remote: false,
    salaryMin: 130000, salaryMax: 175000,
    salaryDisplay: '$130k – $175k',
    description: 'Interface Developer at Quantix — build high-performance 3D financial visualizations using React, Three.js, and WebGL. Push the boundaries of browser-based rendering.',
    requirements: ['React', 'Three.js', 'WebGL', 'D3.js'],
    url: '', postedAt: new Date().toISOString(),
    timeZone: 'CST', visaSponsorship: true, source: 'Firecrawl',
    logoColor: 'bg-cyan-700 text-white',
  },
  {
    id: '5', title: 'Staff Design Engineer', company: 'Linear',
    location: 'Remote (Global)', remote: true,
    salaryMin: 200000, salaryMax: 260000,
    salaryDisplay: '$200k – $260k + Equity',
    description: 'Linear is looking for a Staff Design Engineer to bridge design and engineering. You will build the design system, component library, and prototyping tools used by the entire product team.',
    requirements: ['React', 'TypeScript', 'Design Tokens', 'Animation'],
    url: '', postedAt: new Date().toISOString(),
    timeZone: 'UTC-5', visaSponsorship: false, source: 'Firecrawl',
    logoColor: 'bg-indigo-950 text-white',
  },
];

type SwipeDir = 'left' | 'right' | null;

export const SwipeMode: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<'auto' | 'manual'>('manual');
  const [menuOpen, setMenuOpen] = useState(false);

  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [lastAction, setLastAction] = useState<{ job: Job; dir: 'left' | 'right' } | null>(null);
  const [swipedHistory, setSwipedHistory] = useState<{ left: number; right: number }>({ left: 0, right: 0 });
  const [detailJob, setDetailJob] = useState<(Job & { logoColor: string }) | null>(null);

  // Drag state
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    dir: SwipeDir;
  }>({
    active: false, startX: 0, startY: 0,
    currentX: 0, currentY: 0, dir: null,
  });

  // For animating card out
  const [exitDir, setExitDir] = useState<SwipeDir>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (detailJob) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      dir: null,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [detailJob]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    dragRef.current.currentX = e.clientX;
    dragRef.current.currentY = e.clientY;
    const dx = e.clientX - dragRef.current.startX;
    dragRef.current.dir = dx < -30 ? 'left' : dx > 30 ? 'right' : null;
  }, []);

  const swipeCard = (dir: 'left' | 'right') => {
    const job = jobs[currentIdx];
    if (!job) return;
    setExitDir(dir);
    setTimeout(() => {
      setExitDir(null);
      setCurrentIdx(prev => prev + 1);
      setSwipedHistory(prev => ({
        left: prev.left + (dir === 'left' ? 1 : 0),
        right: prev.right + (dir === 'right' ? 1 : 0),
      }));
      setLastAction({ job, dir });
    }, 400);
  };

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const absDx = Math.abs(dx);
    dragRef.current.active = false;

    if (absDx > 80) {
      swipeCard(dx < 0 ? 'left' : 'right');
    } else {
      // Snap back
    }
  }, [currentIdx, jobs]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (detailJob) {
        if (e.key === 'Escape') setDetailJob(null);
        return;
      }
      if (e.key === 'ArrowLeft') swipeCard('left');
      if (e.key === 'ArrowRight') swipeCard('right');
      if (e.key === 'ArrowUp' && jobs[currentIdx]) setDetailJob(jobs[currentIdx]);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIdx, jobs, detailJob]);

  const handleUndo = () => {
    if (!lastAction) return;
    setJobs(prev => {
      const idx = prev.findIndex(j => j.id === lastAction.job.id);
      if (idx >= 0 && idx < currentIdx) return prev;
      return prev;
    });
    setCurrentIdx(prev => Math.max(0, prev - 1));
    setSwipedHistory(prev => ({
      left: prev.left - (lastAction.dir === 'left' ? 1 : 0),
      right: prev.right - (lastAction.dir === 'right' ? 1 : 0),
    }));
    setLastAction(null);
  };

  const currentJob = jobs[currentIdx];
  const hasMore = currentIdx < jobs.length;

  // Drag offset for visual feedback
  const drag = dragRef.current;
  const dragOffsetX = drag.active ? drag.currentX - drag.startX : 0;
  const dragOffsetY = drag.active ? drag.currentY - drag.startY : 0;
  const dragRotation = dragOffsetX * 0.08;
  const dragOpacity = Math.max(0.85, 1 - Math.abs(dragOffsetX) / 600);
  const isSwipingLeft = drag.dir === 'left' && drag.active;
  const isSwipingRight = drag.dir === 'right' && drag.active;

  const formatNgn = (val: number) =>
    `₦${(val * 1550).toLocaleString(undefined, { maximumFractionDigits: 0 })} NGN`;

  const dropdownItems = [
    { label: 'Profile', icon: User, onClick: () => navigate('/account#profile') },
    { label: 'Notifications', icon: Bell, onClick: () => navigate('/account#notifications') },
    { label: 'Billing', icon: CreditCard, onClick: () => navigate('/account#billing') },
    { label: 'Help & Support', icon: LifeBuoy, onClick: () => navigate('/account#help') },
    { label: 'Sign Out', icon: LogOut, onClick: () => navigate('/account#signout') },
  ];

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  const timezoneOverlap = (tz: string): { label: string; color: string } => {
    const mapping: Record<string, { label: string; color: string }> = {
      'EST': { label: 'WAT: +6h (Favorable)', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
      'GMT': { label: 'WAT: +1h (Ideal)', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
      'CST': { label: 'WAT: +7h (Manageable)', color: 'text-amber-600 bg-amber-50 border-amber-200' },
      'PST': { label: 'WAT: +9h (Late Night)', color: 'text-red-600 bg-red-50 border-red-200' },
    };
    return mapping[tz] || { label: `WAT: Check Compatibility`, color: 'text-gray-600 bg-gray-50 border-gray-200' };
  };

  return (
    <div className="flex bg-[#FBF9F4] h-screen w-screen overflow-hidden font-dm-sans text-[#0A0A0A]">
      <Sidebar mode={mode} onModeChange={setMode} />

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* ── Header ── */}
        <div className="px-10 py-6 border-b border-[#E4E2DD] bg-white flex justify-between items-center shrink-0">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-[#0A0A0A] tracking-tight">Swipe Mode</h1>
            <p className="text-xs text-[#7F7F7F] font-medium mt-0.5">
              Swipe right to shortlist, left to skip. <span className="text-[#B0B0B0]">Use ← → keys</span>
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-[#FF4D00] hover:bg-[#FF4D00]/90 text-white font-bold px-6 py-2.5 rounded-full text-xs transition-all shadow-sm cursor-pointer">
              How to Guide
            </button>
            <div className="relative">
              <div onClick={() => setMenuOpen(v => !v)} className="cursor-pointer">
                <Avatar seed={user?.email || 'user@jobjockey.ai'} size={40} />
              </div>
              {menuOpen && <DropdownMenu items={dropdownItems} onClose={() => setMenuOpen(false)} />}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Swipe Area */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-[#FBF9F4]">
            {detailJob ? (
              /* ── Detail View ── */
              <div className="w-full max-w-2xl mx-auto px-10 py-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <button
                  onClick={() => setDetailJob(null)}
                  className="flex items-center space-x-2 text-xs font-semibold text-[#7F7F7F] hover:text-[#0A0A0A] transition-colors mb-6 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back to cards</span>
                </button>

                <div className="bg-white border border-[#E4E2DD] rounded-3xl p-8 shadow-sm space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg', detailJob.logoColor)}>
                        {getInitials(detailJob.company)}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-[#0A0A0A]">{detailJob.title}</h2>
                        <p className="text-sm text-[#7F7F7F] font-semibold mt-0.5">{detailJob.company} • {detailJob.location}</p>
                      </div>
                    </div>
                    <div className="bg-[#E0FDF4] text-[#15B097] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                      Open
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {detailJob.requirements.map((r, i) => (
                      <span key={i} className="bg-[#F5F3EE] text-[#444444] text-[10px] font-bold px-3 py-1.5 rounded-full">
                        {r}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#FBF9F4] rounded-xl p-4 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7F7F7F]">Salary</span>
                      <p className="font-bold text-[#0A0A0A] text-sm">{detailJob.salaryDisplay}</p>
                      <p className="text-[10px] text-[#7F7F7F]">
                        {detailJob.salaryMin ? `~${formatNgn(detailJob.salaryMin)}` : ''}
                      </p>
                    </div>
                    <div className="bg-[#FBF9F4] rounded-xl p-4 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7F7F7F]">Visa</span>
                      <p className={cn('font-bold text-sm', detailJob.visaSponsorship ? 'text-emerald-600' : 'text-amber-600')}>
                        {detailJob.visaSponsorship ? 'Sponsored' : 'Not Offered'}
                      </p>
                    </div>
                    <div className="bg-[#FBF9F4] rounded-xl p-4 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7F7F7F]">Remote</span>
                      <p className="font-bold text-sm text-[#0A0A0A]">{detailJob.remote ? 'Fully Remote' : 'On-site'}</p>
                    </div>
                    <div className="bg-[#FBF9F4] rounded-xl p-4 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7F7F7F]">Timezone</span>
                      <p className={cn('font-bold text-sm', timezoneOverlap(detailJob.timeZone).color.split(' ')[0])}>
                        {detailJob.timeZone}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-[#444444] leading-relaxed font-medium">{detailJob.description}</p>

                  <div className={cn(
                    'inline-flex items-center space-x-2 text-[11px] font-bold px-4 py-2 rounded-full border',
                    timezoneOverlap(detailJob.timeZone).color,
                  )}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{timezoneOverlap(detailJob.timeZone).label}</span>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-[#E4E2DD]">
                    <button
                      onClick={() => { setDetailJob(null); swipeCard('left'); }}
                      className="border border-[#E4E2DD] hover:border-red-200 text-[#7F7F7F] hover:text-red-500 rounded-full px-8 py-3 text-xs font-bold transition-all cursor-pointer"
                    >
                      Skip
                    </button>
                    <button
                      onClick={() => { setDetailJob(null); swipeCard('right'); }}
                      className="bg-[#FF4D00] hover:bg-[#FF4D00]/90 text-white rounded-full px-8 py-3 text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* ── Card Stack ── */
              <div className="flex flex-col items-center">
                {/* Stats bar */}
                <div className="flex items-center space-x-6 mb-8 text-xs font-semibold text-[#7F7F7F]">
                  <span>Skipped: <span className="text-[#0A0A0A]">{swipedHistory.left}</span></span>
                  <span className="w-1 h-1 rounded-full bg-[#E4E2DD]" />
                  <span>Shortlisted: <span className="text-[#FF4D00] font-bold">{swipedHistory.right}</span></span>
                  <span className="w-1 h-1 rounded-full bg-[#E4E2DD]" />
                  <span>Remaining: <span className="text-[#0A0A0A]">{jobs.length - currentIdx}</span></span>
                  {lastAction && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-[#E4E2DD]" />
                      <button
                        onClick={handleUndo}
                        className="flex items-center space-x-1 text-[#FF4D00] hover:text-[#FF4D00]/80 transition-colors cursor-pointer"
                      >
                        <Undo2 className="w-3 h-3" />
                        <span>Undo</span>
                      </button>
                    </>
                  )}
                </div>

                {/* Card stack */}
                <div className="relative w-[400px] h-[520px]" style={{ touchAction: 'none' }}>
                  {/* Stack background cards */}
                  {hasMore && currentIdx + 1 < jobs.length && (
                    <div
                      className="absolute inset-0 rounded-3xl border border-[#E4E2DD] bg-white opacity-40 scale-[0.96] translate-y-2 pointer-events-none"
                    />
                  )}
                  {hasMore && currentIdx + 2 < jobs.length && (
                    <div
                      className="absolute inset-0 rounded-3xl border border-[#E4E2DD] bg-white opacity-20 scale-[0.92] translate-y-4 pointer-events-none"
                    />
                  )}

                  {/* Current card */}
                  {hasMore ? (
                    <div
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      className={cn(
                        'absolute inset-0 rounded-3xl border border-[#E4E2DD] bg-white shadow-lg cursor-grab active:cursor-grabbing select-none transition-shadow duration-200 hover:shadow-xl',
                        exitDir === 'left' && 'animate-out slide-out-to-left-40 duration-400',
                        exitDir === 'right' && 'animate-out slide-out-to-right-40 duration-400',
                      )}
                      style={{
                        transform: exitDir
                          ? undefined
                          : `translateX(${dragOffsetX}px) translateY(${dragOffsetY * 0.3}px) rotate(${dragRotation}deg) scale(${dragOpacity})`,
                        opacity: exitDir ? 0 : dragOpacity,
                        transition: drag.active ? 'none' : 'transform 0.3s ease, opacity 0.3s ease',
                      }}
                    >
                      {/* Swipe hints */}
                      {isSwipingLeft && (
                        <div className="absolute top-8 right-8 z-10 border-4 border-red-500 text-red-500 text-2xl font-black px-4 py-2 rounded-2xl -rotate-12 uppercase tracking-wider">
                          Skip
                        </div>
                      )}
                      {isSwipingRight && (
                        <div className="absolute top-8 left-8 z-10 border-4 border-emerald-500 text-emerald-500 text-2xl font-black px-4 py-2 rounded-2xl rotate-12 uppercase tracking-wider">
                          Apply
                        </div>
                      )}

                      {/* Card content */}
                      <div className="p-8 flex flex-col h-full">
                        {/* Company logo and match */}
                        <div className="flex justify-between items-start mb-5">
                          <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg', currentJob.logoColor)}>
                            {getInitials(currentJob.company)}
                          </div>
                          <div className="flex space-x-2">
                            {currentJob.visaSponsorship && (
                              <span className="bg-[#FFF0EA] text-[#FF4D00] text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider border border-[#FF4D00]/20">
                                Visa
                              </span>
                            )}
                            {currentJob.remote && (
                              <span className="bg-[#E2F9EE] text-[#15B097] text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                Remote
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title and company */}
                        <h2 className="text-2xl font-bold text-[#0A0A0A] tracking-tight leading-snug mb-1">
                          {currentJob.title}
                        </h2>
                        <p className="text-sm text-[#7F7F7F] font-semibold mb-5">
                          {currentJob.company}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-5">
                          {currentJob.requirements.slice(0, 3).map((r, i) => (
                            <span key={i} className="bg-[#F5F3EE] text-[#444444] text-[11px] font-medium px-3 py-1.5 rounded-full">
                              {r}
                            </span>
                          ))}
                        </div>

                        {/* Description */}
                        <p className="text-xs text-[#444444] leading-relaxed font-medium line-clamp-3 mb-5">
                          {currentJob.description}
                        </p>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Bottom details */}
                        <div className="border-t border-[#F5F3EE] pt-4 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2 text-[#15B097] font-bold">
                              <Coins className="w-3.5 h-3.5" />
                              <span>{currentJob.salaryDisplay}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-[#7F7F7F] font-medium">
                              <MapPin className="w-3 h-3" />
                              <span>{currentJob.location}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-[#7F7F7F] font-medium">
                            <div className="flex items-center space-x-1">
                              <Globe className="w-3 h-3" />
                              <span>{currentJob.source}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span className={timezoneOverlap(currentJob.timeZone).color.split(' ')[0]}>
                                {currentJob.timeZone} · {timezoneOverlap(currentJob.timeZone).label}
                              </span>
                            </div>
                          </div>
                          <div className="text-[10px] text-[#7F7F7F] font-medium">
                            {currentJob.salaryMin && formatNgn(currentJob.salaryMin)} – {currentJob.salaryMax && formatNgn(currentJob.salaryMax)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Empty state */
                    <div className="absolute inset-0 rounded-3xl border-2 border-dashed border-[#E4E2DD] bg-[#FBF9F4] flex flex-col items-center justify-center text-center p-8">
                      <Sparkles className="w-12 h-12 text-[#FF4D00] mb-4" />
                      <h3 className="text-xl font-bold text-[#0A0A0A] mb-2">All caught up!</h3>
                      <p className="text-sm text-[#7F7F7F] max-w-xs leading-relaxed">
                        You've reviewed all available opportunities. Check back soon for new matches.
                      </p>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                {hasMore && (
                  <div className="flex items-center justify-center space-x-6 mt-8">
                    <button
                      onClick={() => swipeCard('left')}
                      className="w-14 h-14 rounded-full bg-white border border-[#E4E2DD] flex items-center justify-center shadow-sm hover:shadow-md hover:border-red-200 hover:text-red-500 text-[#7F7F7F] transition-all cursor-pointer"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setDetailJob(currentJob!)}
                      className="w-14 h-14 rounded-full bg-[#FF4D00] border-2 border-[#FF4D00] flex items-center justify-center shadow-md hover:shadow-lg text-white transition-all cursor-pointer"
                    >
                      <Briefcase className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => swipeCard('right')}
                      className="w-14 h-14 rounded-full bg-white border border-[#E4E2DD] flex items-center justify-center shadow-sm hover:shadow-md hover:border-emerald-200 hover:text-emerald-500 text-[#7F7F7F] transition-all cursor-pointer"
                    >
                      <Heart className="w-6 h-6" />
                    </button>
                  </div>
                )}

                {!hasMore && (
                  <div className="mt-8">
                    <button
                      onClick={() => navigate('/applications')}
                      className="bg-[#0A0A0A] hover:bg-[#222] text-white font-bold px-8 py-3 rounded-full text-sm transition-all shadow-md cursor-pointer"
                    >
                      View Applications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Right Sidebar: Stats + Tips ── */}
          <aside className="w-72 border-l border-[#E4E2DD] bg-white p-6 flex flex-col space-y-6 shrink-0 hidden lg:flex">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#7F7F7F]">Session Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#444444] font-medium">Shortlisted</span>
                  <span className="text-sm font-bold text-emerald-600">{swipedHistory.right}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#444444] font-medium">Skipped</span>
                  <span className="text-sm font-bold text-red-500">{swipedHistory.left}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#E4E2DD]">
                  <span className="text-xs text-[#444444] font-medium">Conversion</span>
                  <span className="text-sm font-bold text-[#0A0A0A]">
                    {swipedHistory.left + swipedHistory.right > 0
                      ? `${Math.round((swipedHistory.right / (swipedHistory.left + swipedHistory.right)) * 100)}%`
                      : '—'}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#E4E2DD]" />

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#7F7F7F">Tips</h3>
              <div className="space-y-3">
                <div className="bg-[#FFF0EA] rounded-xl p-3">
                  <p className="text-[10px] font-bold text-[#FF4D00] uppercase tracking-wider mb-1">WAT Compatibility</p>
                  <p className="text-[11px] text-[#444444] leading-relaxed">EST roles mean a 6 PM start for Lagos. PST is a 9-hour difference — flagged as late-night.</p>
                </div>
                <div className="bg-[#E2F9EE] rounded-xl p-3">
                  <p className="text-[10px] font-bold text-[#15B097] uppercase tracking-wider mb-1">Salary in NGN</p>
                  <p className="text-[11px] text-[#444444] leading-relaxed">USD salaries are converted at ₦1,550/USD. Displayed below each card.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default SwipeMode;
