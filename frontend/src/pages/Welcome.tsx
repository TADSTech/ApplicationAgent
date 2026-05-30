import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { TypedLine } from '../components/ui/TypedLine';
import { useTerminalTyping } from '../hooks/useTerminalTyping';
import { TerminalLine } from '../types';
import { useAuth } from '../context/AuthContext';

const TERMINAL_LINES: TerminalLine[] = [
  { label: '[Orchestrator]', labelColor: 'text-primary/40', message: 'Scanning global remote roles...' },
  { label: '[Job Scout]', labelColor: 'text-blue-400/40', message: '14 compatible matches found (WAT overlap)' },
  { label: '[Resume Coach]', labelColor: 'text-purple-400/40', message: 'Resume tailored to international standards → ', highlight: { text: '96% compatibility', color: 'text-[#00FF4D]' } },
  { label: 'system:', labelColor: 'text-[#7F7F7F]', message: 'Awaiting candidate confirmation' },
];

export const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const { lineIndex, charIndex, finished, fullText } = useTerminalTyping(TERMINAL_LINES);

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-dm-sans bg-[#FBF9F4]">
      {/* Header / Logo Section */}
      <header className="p-8 absolute top-0 left-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="flex flex-col space-y-1">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-primary rounded-sm"></div>
              <div className="w-3 h-3 bg-primary rounded-sm"></div>
            </div>
            <div className="w-3 h-3 bg-primary rounded-sm ml-4"></div>
          </div>
          <span className="font-space-mono text-xl font-bold tracking-tighter text-[#0A0A0A]">
            JobJockey
          </span>
        </div>
      </header>

      <div className="flex flex-1 h-full">
        {/* Left Pane: Clean & Friendly Visual Interface */}
        <div className="hidden lg:flex w-[55%] bg-gradient-to-tr from-[#F4EFEA] via-[#EAE3DC] to-[#E2D9CF] relative overflow-hidden flex-col justify-center px-16 border-r border-[#E4E2DD]">
          {/* Subtle grid lines for a clean layout structure */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]"></div>

          <div className="relative z-10 max-w-xl">
            <span className="text-xs font-bold tracking-widest text-[#B58A63] uppercase bg-[#FAF6F0] px-3 py-1 rounded-full border border-[#E4E2DD]">Introducing JobJockey</span>
            <h1 className="text-[#1A1A1A] text-5xl font-extrabold leading-tight tracking-tight mt-6 mb-6 font-dm-sans">
              Your global career bridge on autopilot.
            </h1>
            <p className="text-[#5C5A56] text-lg mb-12 max-w-md leading-relaxed">
              Autonomous agents search remote roles, tailor your CV to global standards, and audit contracts for safety—all while keeping you in control.
            </p>

            {/* Clean, Non-Techy Floating Agent Status Cards */}
            <div className="space-y-4 max-w-md">
              <div className="bg-white/80 backdrop-blur-md border border-[#E4E2DD] p-5 rounded-[20px] shadow-sm flex items-center justify-between transform hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-[#EAE3DC] flex items-center justify-center text-[#B58A63] font-bold">1</div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1A1A1A]">Job Scout Agent</h3>
                    <p className="text-xs text-[#7F7F7F]">Scanning WAT-compatible remote opportunities</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#27AE60] bg-[#E8F8F0] px-3 py-1 rounded-full border border-[#27AE60]/20">14 matches</span>
              </div>

              <div className="bg-white/80 backdrop-blur-md border border-[#E4E2DD] p-5 rounded-[20px] shadow-sm flex items-center justify-between transform hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-[#EAE3DC] flex items-center justify-center text-[#B58A63] font-bold">2</div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1A1A1A]">Resume Tailor Agent</h3>
                    <p className="text-xs text-[#7F7F7F]">Optimizing resume for global ATS filters</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">96% score</span>
              </div>

              <div className="bg-white/80 backdrop-blur-md border border-[#E4E2DD] p-5 rounded-[20px] shadow-sm flex items-center justify-between transform hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-[#EAE3DC] flex items-center justify-center text-[#B58A63] font-bold">3</div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1A1A1A]">Contract Legal Advisor</h3>
                    <p className="text-xs text-[#7F7F7F]">Scanning relocation & tax obligations</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#B58A63] bg-[#FAF6F0] px-3 py-1 rounded-full border border-[#B58A63]/20">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: Premium Editorial Canvas */}
        <div className="w-full lg:w-[45%] flex flex-col justify-between items-center px-12 py-8 bg-[#FBF9F4] h-full">
          {/* Top spacer to balance the layout flow */}
          <div className="h-12 w-full"></div>

          <div className="max-w-sm w-full text-center my-auto animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold text-[#0A0A0A] mb-2 font-space-mono">Get started</h2>
            <p className="text-[#7F7F7F] mb-10">Your agents are standing by.</p>

            <div className="space-y-4 w-full">
              <Button
                onClick={handleGoogleSignIn}
                variant="outline"
                size="xl"
                className="w-full flex items-center justify-center space-x-3 bg-white border border-[#E4E2DD] text-[#0A0A0A] hover:bg-[#F5F3EE] transition-all duration-200 py-7 rounded-[20px] shadow-sm hover:shadow-md cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                  <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.712s.102-1.172.282-1.712V4.956H.957a8.996 8.996 0 000 8.088l3.007-2.332z" fill="#FBBC05" />
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.582C13.463.891 11.426 0 9 0 5.483 0 2.443 2.043.957 4.956L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335" />
                </svg>
                <span className="font-bold text-sm tracking-wide">Continue with Google</span>
              </Button>
            </div>
          </div>

          {/* Footer */}
          <footer className="w-full text-center pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-[10px] text-[#7F7F7F] uppercase tracking-tighter space-y-4 md:space-y-0">
              <p>© 2026 JobJockey AI. Human-in-the-loop executive search.</p>
              <div className="flex space-x-6">
                <a href="#" className="hover:text-[#0A0A0A]">Privacy Policy</a>
                <a href="#" className="hover:text-[#0A0A0A]">Terms of Service</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
