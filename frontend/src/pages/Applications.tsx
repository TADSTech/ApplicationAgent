// frontend/src/pages/Applications.tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { Avatar } from '../components/ui/Avatar';
import { DropdownMenu } from '../components/ui/DropdownMenu';
import { cn } from '../lib/utils';
import {
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Lock,
  Sparkles,
  FileText,
  User,
  Bell,
  CreditCard,
  LifeBuoy,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Scale,
  MapPin,
  DollarSign,
  GripVertical,
} from 'lucide-react';

type Stage = 'applied' | 'reviewing' | 'interviewing' | 'offer';

interface ApplicationCard {
  id: string;
  title: string;
  company: string;
  logoColor: string;
  logoLetter: string;
  stage: Stage;
  statusText: string;
  description: string;
  salary: string;
  location: string;
}

// Column accent colours matching DESIGN.md
const COLUMN_META: Record<Stage, { label: string; accent: string; dimText: string; dropBg: string; dropBorder: string }> = {
  applied:      { label: 'Applied',      accent: '#07111E', dimText: '#7F7F7F', dropBg: 'rgba(7,17,30,0.04)',    dropBorder: '#07111E' },
  reviewing:    { label: 'Reviewing',    accent: '#FFCC00', dimText: '#A38000', dropBg: 'rgba(255,204,0,0.06)',  dropBorder: '#FFCC00' },
  interviewing: { label: 'Interviewing', accent: '#FF4D00', dimText: '#CC3D00', dropBg: 'rgba(255,77,0,0.06)',   dropBorder: '#FF4D00' },
  offer:        { label: 'Offer',        accent: '#00FF4D', dimText: '#008A2A', dropBg: 'rgba(0,255,77,0.05)',   dropBorder: '#00FF4D' },
};

const STAGES: Stage[] = ['applied', 'reviewing', 'interviewing', 'offer'];

export const Applications: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [menuOpen, setMenuOpen] = useState(false);

  const [selectedApp, setSelectedApp] = useState<ApplicationCard | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);

  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@gmail.com',
    portfolio: 'https://johndoe.com',
    essay: 'At AlphaStream, I was tasked with leading the migration of a legacy design system to a modern utility-first framework under a tight two-week deadline. I organized daily syncs, established clear component ownership, and set up automated validation tests to ensure zero visual regressions. We delivered on schedule with 100% compliance across teams.'
  });

  const [applications, setApplications] = useState<ApplicationCard[]>([
    {
      id: '1', title: 'Senior Product Designer', company: 'NeoLedger',
      logoColor: 'bg-emerald-950 text-white', logoLetter: 'N', stage: 'applied',
      statusText: 'Applied 2d ago', salary: '$180k – $240k',
      location: 'San Francisco, CA (Remote Friendly)',
      description: 'NeoLedger is redefining how institutional capital interacts with decentralized finance. We are looking for a Senior Product Designer to join our core team in San Francisco.'
    },
    {
      id: '2', title: 'Staff UI Engineer', company: 'Figma',
      logoColor: 'bg-orange-100 text-orange-600', logoLetter: 'F', stage: 'applied',
      statusText: 'Applied 3d ago', salary: '$160k – $210k + Equity',
      location: 'San Francisco, CA (Hybrid)',
      description: 'Join the Editor team to build the core design systems, high performance canvas renderers, and collaboration features used by millions of designers.'
    },
    {
      id: '3', title: 'Engineering Manager', company: 'Vercel',
      logoColor: 'bg-black text-white', logoLetter: 'V', stage: 'reviewing',
      statusText: 'Updated 4h ago', salary: '$190k – $250k',
      location: 'Remote (Global)',
      description: 'Vercel is looking for an Engineering Manager to scale the Next.js developer workflow ecosystem, guiding high performance infrastructure teams.'
    },
    {
      id: '4', title: 'Design Systems Lead', company: 'Airbnb',
      logoColor: 'bg-rose-500 text-white', logoLetter: 'A', stage: 'interviewing',
      statusText: 'Round 2 · Tomorrow', salary: '$175k – $220k',
      location: 'Remote (US/Canada)',
      description: 'Guide the design strategy of our global marketplace systems. Collaborate across platform Engineering to deliver cohesive UI architecture.'
    },
    {
      id: '5', title: 'Principal Product Designer', company: 'Linear',
      logoColor: 'bg-indigo-950 text-white', logoLetter: 'L', stage: 'offer',
      statusText: 'Expires in 3 days', salary: '$200k – $260k + Equity',
      location: 'Remote (UTC-5 to UTC+3)',
      description: 'Linear is looking for a Principal Designer to design the future of project management software. Help craft the finest interface details.'
    }
  ]);

  // ─── Custom pointer-based drag state ───────────────────────────────────────
  const [draggingId, setDraggingId]   = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<Stage | null>(null);
  const [droppedId, setDroppedId]     = useState<string | null>(null); // triggers spring animation
  // Ghost position (absolute in viewport)
  const ghostPos = useRef({ x: 0, y: 0 });
  const ghostRef = useRef<HTMLDivElement | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragSrcStage = useRef<Stage | null>(null);
  const dragColRefs = useRef<Record<Stage, HTMLDivElement | null>>({} as Record<Stage, HTMLDivElement | null>);

  const getDraggingApp = () => applications.find(a => a.id === draggingId);

  const handlePointerDown = useCallback((e: React.PointerEvent, app: ApplicationCard) => {
    // Middle/right click pass-through
    if (e.button !== 0) return;
    e.preventDefault();

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    dragSrcStage.current = app.stage;

    setDraggingId(app.id);

    // Position ghost immediately
    ghostPos.current = { x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y };
    if (ghostRef.current) {
      ghostRef.current.style.left = `${ghostPos.current.x}px`;
      ghostRef.current.style.top  = `${ghostPos.current.y}px`;
    }
  }, [applications]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!draggingId) return;
    const x = e.clientX - dragOffset.current.x;
    const y = e.clientY - dragOffset.current.y;
    ghostPos.current = { x, y };
    if (ghostRef.current) {
      ghostRef.current.style.left = `${x}px`;
      ghostRef.current.style.top  = `${y}px`;
    }

    // Detect which column we're over
    let over: Stage | null = null;
    for (const stage of STAGES) {
      const el = dragColRefs.current[stage];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        over = stage;
        break;
      }
    }
    setDragOverCol(over);
  }, [draggingId]);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    if (!draggingId) return;

    if (dragOverCol && dragOverCol !== dragSrcStage.current) {
      const targetStage = dragOverCol;
      setApplications(prev =>
        prev.map(app => app.id === draggingId ? { ...app, stage: targetStage } : app)
      );
      setDroppedId(draggingId);
      setTimeout(() => setDroppedId(null), 600);
    }

    setDraggingId(null);
    setDragOverCol(null);
    dragSrcStage.current = null;
  }, [draggingId, dragOverCol]);

  // Attach global pointer listeners while dragging
  useEffect(() => {
    if (!draggingId) return;
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggingId, handlePointerMove, handlePointerUp]);
  // ───────────────────────────────────────────────────────────────────────────

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  const handleCardClick = (app: ApplicationCard) => {
    if (draggingId) return; // suppress click when releasing drag
    setSelectedApp(app);
    setActiveStep(1);
  };

  const dropdownItems = [
    { label: 'Profile',        icon: User,       onClick: () => navigate('/account#profile')       },
    { label: 'Notifications',  icon: Bell,       onClick: () => navigate('/account#notifications') },
    { label: 'Billing',        icon: CreditCard, onClick: () => navigate('/account#billing')       },
    { label: 'Help & Support', icon: LifeBuoy,   onClick: () => navigate('/account#help')          },
    { label: 'Sign Out',       icon: LogOut,     onClick: () => navigate('/account#signout')       },
  ];

  const totalActive    = applications.length;
  const pendingReview  = applications.filter(a => a.stage === 'reviewing').length;
  const offersCount    = applications.filter(a => a.stage === 'offer').length;
  const draggingApp    = getDraggingApp();

  return (
    <div className="flex bg-[#FBF9F4] h-screen w-screen overflow-hidden font-dm-sans text-[#0A0A0A]">
      <Sidebar mode={mode} onModeChange={setMode} />

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <div className="px-10 py-6 border-b border-[#E4E2DD] bg-white flex justify-between items-center shrink-0">
          <div className="flex flex-col">
            {selectedApp ? (
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#7F7F7F] uppercase tracking-wider mb-1 select-none">
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="hover:text-[#FF4D00] flex items-center transition-colors cursor-pointer"
                >
                  My Applications
                </button>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-[#0A0A0A]">{selectedApp.title} – {selectedApp.company}</span>
              </div>
            ) : (
              <h1 className="text-2xl font-bold text-[#0A0A0A] tracking-tight">My Applications</h1>
            )}
            <p className="text-xs text-[#7F7F7F] font-medium mt-0.5">
              {selectedApp 
                ? `Currently processing your application sequence for ${selectedApp.company}`
                : `${totalActive} active • ${pendingReview} pending review • ${offersCount} offers`
              }
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button className="bg-[#FF4D00] hover:bg-[#FF4D00]/90 text-white font-bold px-6 py-2.5 rounded-full text-xs transition-all duration-200 shadow-sm cursor-pointer">
              How to Guide
            </button>
            <div className="relative">
              <div onClick={() => setMenuOpen(v => !v)} className="cursor-pointer">
                <Avatar seed="user@jobjockey.ai" size={40} />
              </div>
              {menuOpen && (
                <DropdownMenu items={dropdownItems} onClose={() => setMenuOpen(false)} />
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Content Panel */}
        <div className="flex-1 overflow-y-auto p-10 bg-[#FBF9F4]">
          {/* ── Floating drag ghost (portal-style, pointer: none to not interfere) ── */}
          {draggingId && draggingApp && (
            <div
              ref={ghostRef}
              style={{
                position: 'fixed',
                top: ghostPos.current.y,
                left: ghostPos.current.x,
                width: 248,
                zIndex: 9999,
                pointerEvents: 'none',
                transform: 'rotate(4deg) scale(1.04)',
                filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.18))',
                willChange: 'transform',
              }}
            >
              <div className="bg-white border border-[#E4E2DD] rounded-[14px] p-4 select-none">
                <div className="flex items-center space-x-2.5 mb-2">
                  <div className={cn('w-8 h-8 rounded-[10px] flex items-center justify-center font-bold text-sm shrink-0', draggingApp.logoColor)}>
                    {draggingApp.logoLetter}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#0A0A0A] leading-snug">{draggingApp.title}</p>
                    <p className="text-[11px] text-[#7F7F7F] font-semibold">{draggingApp.company}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-[11px] text-[#7F7F7F] font-medium">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{draggingApp.location}</span>
                </div>
              </div>
            </div>
          )}

          {!selectedApp ? (
            /* ==================== KANBAN BOARD VIEW ==================== */
            <div
              className="grid gap-5 h-full items-start"
              style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}
            >
              {STAGES.map(stage => {
                const meta   = COLUMN_META[stage];
                const cards  = applications.filter(a => a.stage === stage);
                const isOver = dragOverCol === stage && draggingId !== null;

                return (
                  <div
                    key={stage}
                    ref={el => { dragColRefs.current[stage] = el; }}
                    className="flex flex-col min-h-[500px] rounded-2xl transition-all duration-200"
                    style={{
                      background:  isOver ? meta.dropBg   : 'transparent',
                      outline:     isOver ? `2px dashed ${meta.dropBorder}` : '2px solid transparent',
                      outlineOffset: '2px',
                    }}
                  >
                    {/* Column header */}
                    <div
                      className="flex justify-between items-center bg-white rounded-[14px] px-4 py-3 mb-3 border border-[#E4E2DD] select-none"
                      style={{ borderTop: `3px solid ${meta.accent}` }}
                    >
                      <span className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: meta.dimText }}>
                        {meta.label}
                      </span>
                      <span className="bg-[#F5F3EE] text-[#444444] text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums">
                        {cards.length}
                      </span>
                    </div>

                    {/* Cards */}
                    <div className="flex flex-col gap-3 flex-1">
                      {cards.map(app => {
                        const isDragging = draggingId === app.id;
                        const justDropped = droppedId === app.id;
                        return (
                          <div
                            key={app.id}
                            onPointerDown={e => handlePointerDown(e, app)}
                            onClick={() => handleCardClick(app)}
                            style={{
                              opacity:    isDragging ? 0.35 : 1,
                              transform:  isDragging ? 'scale(0.97)' : 'scale(1)',
                              transition: isDragging
                                ? 'opacity 0.15s ease, transform 0.15s ease'
                                : 'opacity 0.2s ease, transform 0.25s ease',
                              animation:  justDropped ? 'cardDrop 0.5s cubic-bezier(0.34,1.56,0.64,1) both' : 'none',
                              cursor: isDragging ? 'grabbing' : 'grab',
                              userSelect: 'none',
                              touchAction: 'none',
                            }}
                            className={cn(
                              'group bg-white border border-[#E4E2DD] rounded-[14px] p-4 flex flex-col gap-3',
                              !isDragging && 'hover:border-[#D0CEC8] hover:bg-[#FDFCF9]',
                            )}
                          >
                            {/* Card top: logo + title + drag handle */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className={cn('w-9 h-9 rounded-[10px] flex items-center justify-center font-bold text-sm shrink-0', app.logoColor)}>
                                  {app.logoLetter}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-bold text-[13px] text-[#0A0A0A] leading-snug truncate group-hover:text-[#0A0A0A] transition-colors">
                                    {app.title}
                                  </h4>
                                  <p className="text-[11px] text-[#7F7F7F] font-semibold mt-0.5">{app.company}</p>
                                </div>
                              </div>
                              <GripVertical className="w-4 h-4 text-[#C8C5BF] shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {/* Meta row */}
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1 text-[11px] text-[#7F7F7F] font-medium">
                                <MapPin className="w-3 h-3 shrink-0" />
                                <span className="truncate">{app.location}</span>
                              </div>
                              <div className="flex items-center gap-1 text-[11px] font-bold" style={{ color: meta.dimText }}>
                                <DollarSign className="w-3 h-3 shrink-0" />
                                <span>{app.salary}</span>
                              </div>
                            </div>

                            {/* Footer: status badge + remove */}
                            <div className="flex items-center justify-between pt-1 border-t border-[#F0EDE7]">
                              <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                style={{ background: meta.dropBg, color: meta.dimText, border: `1px solid ${meta.accent}22` }}
                              >
                                {app.statusText}
                              </span>
                              <button
                                onPointerDown={e => e.stopPropagation()}
                                onClick={e => handleRemove(e, app.id)}
                                className="text-[11px] font-semibold text-[#B0ADA8] hover:text-[#0A0A0A] transition-colors cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Empty column drop hint */}
                      {cards.length === 0 && (
                        <div
                          className="flex-1 flex items-center justify-center rounded-[14px] border border-dashed border-[#E4E2DD] min-h-[100px] text-[11px] font-semibold"
                          style={{ color: meta.dimText, opacity: isOver ? 1 : 0.5 }}
                        >
                          Drop here
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ==================== 4-STEP DETAIL FLOW ==================== */
            <div className="max-w-6xl mx-auto flex flex-col space-y-8">
              {/* Back link & Title header */}
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="border border-[#E4E2DD] hover:border-[#0A0A0A] bg-white rounded-full p-2.5 cursor-pointer hover:bg-[#F5F3EE] transition-all"
                >
                  <ArrowLeft className="w-4 h-4 text-[#444444]" />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-[#0A0A0A]">{selectedApp.title}</h2>
                  <p className="text-xs text-[#7F7F7F] font-semibold">{selectedApp.company} • {selectedApp.location}</p>
                </div>
              </div>

              {/* Stepper bar */}
              <div className="bg-transparent border border-[#E4E2DD] rounded-full px-10 py-4 flex justify-between items-center max-w-4xl mx-auto w-full select-none">
                {/* STEP 1 */}
                <div className="flex items-center space-x-3">
                  {activeStep > 1 ? (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#E2F9EE] border border-[#A3F0C9] text-[#15B097] text-xs font-bold">
                      ✓
                    </div>
                  ) : activeStep === 1 ? (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center border-2 border-[#FF4D00] bg-white">
                      <div className="w-2 h-2 rounded-full bg-[#FF4D00]" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center border border-[#E4E2DD] bg-white text-[#B0B0B0] text-xs font-bold">
                      1
                    </div>
                  )}
                  <span className={cn("text-xs font-bold tracking-wider", activeStep === 1 ? "text-[#0A0A0A]" : activeStep > 1 ? "text-[#444444]" : "text-[#B0B0B0]")}>JOB INFO</span>
                </div>
                
                <div className="h-[1px] bg-[#E4E2DD] flex-1 mx-4 max-w-[50px]"></div>

                {/* STEP 2 */}
                <div className="flex items-center space-x-3">
                  {activeStep > 2 ? (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#E2F9EE] border border-[#A3F0C9] text-[#15B097] text-xs font-bold">
                      ✓
                    </div>
                  ) : activeStep === 2 ? (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center border-2 border-[#FF4D00] bg-white">
                      <div className="w-2 h-2 rounded-full bg-[#FF4D00]" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center border border-[#E4E2DD] bg-white text-[#B0B0B0] text-xs font-bold">
                      2
                    </div>
                  )}
                  <span className={cn("text-xs font-bold tracking-wider", activeStep === 2 ? "text-[#0A0A0A]" : activeStep > 2 ? "text-[#444444]" : "text-[#B0B0B0]")}>TAILOR</span>
                </div>

                <div className="h-[1px] bg-[#E4E2DD] flex-1 mx-4 max-w-[50px]"></div>

                {/* STEP 3 */}
                <div className="flex items-center space-x-3">
                  {activeStep > 3 ? (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#E2F9EE] border border-[#A3F0C9] text-[#15B097] text-xs font-bold">
                      ✓
                    </div>
                  ) : activeStep === 3 ? (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center border-2 border-[#FF4D00] bg-white">
                      <div className="w-2 h-2 rounded-full bg-[#FF4D00]" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center border border-[#E4E2DD] bg-white text-[#B0B0B0] text-xs font-bold">
                      3
                    </div>
                  )}
                  <span className={cn("text-xs font-bold tracking-wider", activeStep === 3 ? "text-[#0A0A0A]" : activeStep > 3 ? "text-[#444444]" : "text-[#B0B0B0]")}>LEGAL</span>
                </div>

                <div className="h-[1px] bg-[#E4E2DD] flex-1 mx-4 max-w-[50px]"></div>

                {/* STEP 4 */}
                <div className="flex items-center space-x-3">
                  {activeStep === 4 ? (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center border-2 border-[#FF4D00] bg-white">
                      <div className="w-2 h-2 rounded-full bg-[#FF4D00]" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center border border-[#E4E2DD] bg-white text-[#B0B0B0] text-xs font-bold">
                      4
                    </div>
                  )}
                  <span className={cn("text-xs font-bold tracking-wider", activeStep === 4 ? "text-[#0A0A0A]" : "text-[#B0B0B0]")}>YOUR APPLICATION</span>
                </div>
              </div>

              {/* Step Contents */}
              <div className="w-full">
                {activeStep === 1 && (
                  /* ============= STEP 1: JOB INFO ============= */
                  <div className="bg-white border border-[#E4E2DD] rounded-3xl p-8 flex flex-col space-y-8 animate-in fade-in duration-200">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-5">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg", selectedApp.logoColor)}>
                          {selectedApp.logoLetter}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="bg-[#FFF0EA] text-[#FF4D00] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">New Posting</span>
                            <span className="text-xs text-[#7F7F7F] font-semibold">• Posted 4h ago</span>
                          </div>
                          <h3 className="text-2xl font-bold text-[#0A0A0A] mt-1">{selectedApp.title}</h3>
                          <p className="text-sm font-semibold text-[#7F7F7F] mt-0.5">{selectedApp.company}</p>
                          <div className="flex items-center space-x-4 text-xs text-[#7F7F7F] font-semibold mt-2">
                            <span>{selectedApp.location}</span>
                            <span>•</span>
                            <span className="text-emerald-600 font-bold">{selectedApp.salary}</span>
                          </div>
                        </div>
                      </div>

                      <a 
                        href="https://linkedin.com" 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-[#F5F3EE] hover:bg-[#EBE9E3] border border-[#E4E2DD] text-xs font-bold px-5 py-2.5 rounded-full flex items-center space-x-2 transition-colors cursor-pointer"
                      >
                        <span>View Job Post</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="border-t border-[#E4E2DD] pt-6 flex flex-col space-y-4">
                      <h4 className="font-bold text-base text-[#0A0A0A]">About the Role</h4>
                      <p className="text-sm text-[#444444] leading-relaxed font-medium">
                        {selectedApp.description} NeoLedger is building high throughput trading APIs and decentralized vault systems. You will lead UI engineering initiatives and coordinate directly with developers to create an incredibly simple, robust capital management dashboard.
                      </p>
                    </div>

                    <div className="border-t border-[#E4E2DD] pt-6 flex flex-col space-y-4">
                      <h4 className="font-bold text-base text-[#0A0A0A]">Job Description & Requirements</h4>
                      <ul className="list-disc pl-5 text-sm text-[#444444] space-y-3 font-medium leading-relaxed">
                        <li>You will partner with Product Management and UX Research to identify and ideate on design solutions to meet customer expectations and business requirements.</li>
                        <li>Translate design solutions into navigation flows, wireframes, visual designs, and interactive prototypes. Continuously iterate over designs to improve the user experience.</li>
                        <li>You will partner with Engineers closely to evaluate design alternatives, ensure that solutions are technically feasible and reuse established interaction patterns and UI components when appropriate.</li>
                        <li>You will plan and conduct user research, including: usability testing, contextual interviews, task analysis and surveys. Share findings from research in a presentation setting.</li>
                        <li>You will improve upon the design system, making recommendations for new patterns and standardized practice.</li>
                        <li>You will stay at the forefront of advances in tools and processes in the design community and recommend improvements to Fastly processes.</li>
                        <li>You will provide mentorship and design guidance for other product design team members.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  /* ============= STEP 2: TAILOR ============= */
                  <div className="grid grid-cols-2 gap-8 animate-in fade-in duration-200">
                    {/* Left: Original Version */}
                    <div className="bg-white border border-[#E4E2DD] rounded-3xl p-8 shadow-sm flex flex-col">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#7F7F7F]">Original_Version_01</span>
                        <Lock className="w-4 h-4 text-[#B0B0B0]" />
                      </div>
                      
                      <div className="space-y-6 opacity-45 pointer-events-none select-none font-dm-sans">
                        <div>
                          <span className="text-[10px] font-bold text-[#7F7F7F] uppercase tracking-wider">Experience</span>
                          <h5 className="font-bold text-sm mt-1 text-[#0A0A0A]">Product Designer @ AlphaStream</h5>
                          <span className="text-[10px] text-[#7F7F7F] font-bold">Jan 2021 — Present</span>
                          <ul className="list-disc pl-4 text-xs mt-3 space-y-1.5 font-semibold text-[#444444]">
                            <li>Designed user interfaces for web and mobile applications.</li>
                            <li>Collaborated with product managers to define requirements.</li>
                            <li>Maintained and updated our internal design component library.</li>
                            <li>Conducted user research sessions to improve product usability.</li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-bold text-sm text-[#0A0A0A]">UX Designer @ FinCorp</h5>
                          <span className="text-[10px] text-[#7F7F7F] font-bold">2018 — 2020</span>
                          <ul className="list-disc pl-4 text-xs mt-3 space-y-1.5 font-semibold text-[#444444]">
                            <li>Worked on financial dashboards for institutional clients.</li>
                            <li>Created wireframes and interactive prototypes.</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Right: AI-Tailored Version */}
                    <div className="bg-white border-2 border-[#FF4D00] rounded-3xl p-8 shadow-md flex flex-col relative">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-[#FF4D00]" />
                          <span className="text-xs font-bold uppercase tracking-widest text-[#FF4D00]">AI-Tailored_Optimized</span>
                        </div>
                        <span className="bg-[#FF4D00] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Latest</span>
                      </div>

                      <div className="space-y-6 font-dm-sans">
                        <div>
                          <span className="text-[10px] font-bold text-[#7F7F7F] uppercase tracking-wider">Experience</span>
                          <h5 className="font-bold text-sm mt-1 text-[#0A0A0A]">Product Designer @ AlphaStream</h5>
                          <span className="text-[10px] text-[#7F7F7F] font-bold">Jan 2021 — Present</span>
                          <ul className="list-disc pl-4 text-xs mt-3 space-y-2 font-semibold text-[#444444]">
                            <li>
                              Architected and scaled complex <span className="bg-[#E2F9EE] text-[#006633] px-1.5 py-0.5 rounded font-bold">Design Systems</span> serving 1M+ users, ensuring 100% component consistency across web/mobile.
                            </li>
                            <li>
                              Transformed <span className="bg-[#E2F9EE] text-[#006633] px-1.5 py-0.5 rounded font-bold">Fintech</span> workflow requirements into high-fidelity <span className="bg-[#E2F9EE] text-[#006633] px-1.5 py-0.5 rounded font-bold">Prototyping</span> solutions, reducing development cycles by 15%.
                            </li>
                            <li>
                              Spearheaded cross-functional alignment between engineering and product to implement accessibility-first UI patterns.
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-bold text-sm text-[#0A0A0A]">UX Designer @ FinCorp</h5>
                          <span className="text-[10px] text-[#7F7F7F] font-bold">2018 — 2020</span>
                          <ul className="list-disc pl-4 text-xs mt-3 space-y-2 font-semibold text-[#444444]">
                            <li>
                              Engineered data-heavy <span className="bg-[#E2F9EE] text-[#006633] px-1.5 py-0.5 rounded font-bold">Fintech</span> dashboards, increasing institutional client engagement by 22% via intuitive visualization.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 3 && (
                  /* ============= STEP 3: LEGAL ============= */
                  <div className="bg-white border border-[#E4E2DD] rounded-3xl p-8 shadow-sm flex flex-col space-y-8 animate-in fade-in duration-200">
                    <div className="flex items-center space-x-3.5 border-b border-[#E4E2DD] pb-5">
                      <Scale className="w-6 h-6 text-[#FF4D00]" />
                      <h4 className="font-bold text-lg text-[#0A0A0A]">Employment Contract Legal Scan</h4>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div className="border border-amber-200 bg-amber-50/50 rounded-2xl p-5 flex flex-col">
                        <div className="flex items-center space-x-2 text-amber-800 mb-3">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">Non-Compete Clause</span>
                        </div>
                        <p className="text-xs font-semibold text-amber-900 leading-relaxed">
                          12-month post-employment restriction across North American markets. Flagged due to potential limitations on your future career agility.
                        </p>
                      </div>

                      <div className="border border-emerald-100 bg-emerald-50/45 rounded-2xl p-5 flex flex-col">
                        <div className="flex items-center space-x-2 text-emerald-800 mb-3">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">Intellectual Property</span>
                        </div>
                        <p className="text-xs font-semibold text-emerald-900 leading-relaxed">
                          Standard IP assignment limited strictly to works created within business hours and using company assets. Personal side projects are safe.
                        </p>
                      </div>

                      <div className="border border-blue-200 bg-blue-50/50 rounded-2xl p-5 flex flex-col">
                        <div className="flex items-center space-x-2 text-blue-800 mb-3">
                          <Scale className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">Timezone Alignment</span>
                        </div>
                        <p className="text-xs font-semibold text-blue-900 leading-relaxed">
                          Core hours require 4 hours overlap with EST (UTC-5). Calculated as 2 PM to 6 PM WAT (Nigeria Standard Time). Rated as highly compatible.
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-[#E4E2DD] pt-6 space-y-4">
                      <h5 className="font-bold text-sm text-[#0A0A0A]">Contract Analysis Summary</h5>
                      <p className="text-xs text-[#7F7F7F] font-medium leading-relaxed">
                        Our AI multi-agent legal engine analyzed the draft agreement template. The primary considerations are standard for California B2B contract terms, with specific exemptions negotiated for remote international contractors. Overall Risk Assessment: <span className="text-emerald-600 font-bold">LOW RISK</span>.
                      </p>
                    </div>
                  </div>
                )}

                {activeStep === 4 && (
                  /* ============= STEP 4: YOUR APPLICATION ============= */
                  <div className="grid grid-cols-12 gap-8 animate-in fade-in duration-200">
                    {/* Left Column: Form Details */}
                    <div className="col-span-7 bg-white border border-[#E4E2DD] rounded-3xl p-8 shadow-sm flex flex-col space-y-6">
                      <h4 className="font-bold text-base text-[#0A0A0A]">Application Details</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-[#7F7F7F]">First name</label>
                          <input 
                            type="text" 
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            className="bg-[#FBF9F4] border border-[#E4E2DD] rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#FF4D00]"
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-[#7F7F7F]">Last name</label>
                          <input 
                            type="text" 
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            className="bg-[#FBF9F4] border border-[#E4E2DD] rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#FF4D00]"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#7F7F7F]">Email address</label>
                        <input 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="bg-[#FBF9F4] border border-[#E4E2DD] rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#FF4D00] w-full"
                        />
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#7F7F7F]">Portfolio URL</label>
                        <input 
                          type="text" 
                          value={formData.portfolio}
                          onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                          className="bg-[#FBF9F4] border border-[#E4E2DD] rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#FF4D00] w-full"
                        />
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#7F7F7F]">Describe a time you handled a difficult situation at work</label>
                        <textarea 
                          rows={6}
                          value={formData.essay}
                          onChange={(e) => setFormData({...formData, essay: e.target.value})}
                          className="bg-[#FBF9F4] border border-[#E4E2DD] rounded-xl px-4 py-3 text-xs font-semibold leading-relaxed focus:outline-none focus:border-[#FF4D00] w-full resize-none"
                        />
                      </div>
                    </div>

                    {/* Right Column: Tailored Resume Preview */}
                    <div className="col-span-5 bg-white border border-[#E4E2DD] rounded-3xl p-8 shadow-sm flex flex-col">
                      <div className="flex items-center space-x-2 border-b border-[#E4E2DD] pb-4 mb-5">
                        <FileText className="w-5 h-5 text-[#FF4D00]" />
                        <h4 className="font-bold text-sm text-[#0A0A0A]">Attached Resume</h4>
                      </div>

                      <div className="space-y-4 font-dm-sans text-xs">
                        <div className="border-b border-[#F5F3EE] pb-4">
                          <h5 className="font-bold text-[#0A0A0A]">John Doe</h5>
                          <p className="text-[10px] text-[#7F7F7F] font-semibold mt-0.5">johndoe@gmail.com • SF, CA</p>
                        </div>

                        <div>
                          <span className="text-[9px] font-bold text-[#FF4D00] uppercase tracking-widest block mb-2">Experience</span>
                          <div className="space-y-3">
                            <div>
                              <h6 className="font-bold text-[#0A0A0A]">Product Designer @ AlphaStream</h6>
                              <span className="text-[9px] text-[#7F7F7F] font-bold">Jan 2021 — Present</span>
                              <p className="text-[#444444] font-medium leading-relaxed mt-1">
                                Architected design systems serving 1M+ users, ensuring 100% component consistency across web/mobile.
                              </p>
                            </div>
                            <div>
                              <h6 className="font-bold text-[#0A0A0A]">UX Designer @ FinCorp</h6>
                              <span className="text-[9px] text-[#7F7F7F] font-bold">2018 — 2020</span>
                              <p className="text-[#444444] font-medium leading-relaxed mt-1">
                                Engineered data-heavy Fintech dashboards, increasing institutional client engagement by 22% via intuitive visualization.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Actions */}
              <div className="flex justify-between items-center max-w-4xl mx-auto w-full pt-4">
                <button
                  onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                  disabled={activeStep === 1}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-xs font-bold border transition-colors cursor-pointer select-none",
                    activeStep === 1
                      ? "border-[#E4E2DD] text-[#B0B0B0] bg-transparent cursor-not-allowed"
                      : "border-[#E4E2DD] text-[#444444] hover:bg-[#F5F3EE] hover:text-[#0A0A0A] bg-white"
                  )}
                >
                  Back
                </button>

                {activeStep < 4 ? (
                  <button
                    onClick={() => setActiveStep(prev => Math.min(4, prev + 1))}
                    className="bg-[#0A0A0A] hover:bg-[#222222] text-white px-6 py-2.5 rounded-full text-xs font-bold cursor-pointer transition-colors select-none"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      alert('Application submitted successfully!');
                      setSelectedApp(null);
                    }}
                    className="bg-[#FF4D00] hover:bg-[#FF4D00]/90 text-white px-7 py-3 rounded-full text-xs font-bold cursor-pointer transition-colors shadow-sm select-none"
                  >
                    Submit Application
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Applications;
