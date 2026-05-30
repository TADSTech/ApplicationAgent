// src/pages/Signin.tsx
import React from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Separator } from '../components/ui/Separator';
import { Header } from '../components/layout/Header';
import { Eye } from 'lucide-react';
import { TypedLine } from '../components/ui/TypedLine';
import { useTerminalTyping } from '../hooks/useTerminalTyping';
import { TerminalLine } from '../types';

const TERMINAL_LINES: TerminalLine[] = [
  { label: '>', labelColor: 'text-[#00FFCC] font-bold', message: 'Analyzing 452 candidates for \'Staff Engineer\'', messageClassName: 'text-[#00FFCC]/90' },
  { label: '>', labelColor: 'text-[#00FFCC] font-bold', message: 'Filter applied: Human-in-the-loop validation required.', messageClassName: 'text-[#15B097]' },
  { label: '>', labelColor: 'text-[#00FFCC] font-bold', message: '3 High-intent matches found.', messageClassName: 'text-[#00FF4D]' },
  { label: '>', labelColor: 'text-[#00FFCC] font-bold', message: 'Fetching LinkedIn signal data...', messageClassName: 'text-[#00FFCC]/60' },
  { label: '>', labelColor: 'text-[#00FFCC] font-bold', message: 'Awaiting executive sign-in...', messageClassName: 'text-[#7F7F7F]' },
  { label: '>', labelColor: 'text-[#00FFCC] font-bold', message: 'Accessing predictive model \'Job-Sigma-04\'...', messageClassName: 'text-[#00FFCC]/90' },
];

export const Signin: React.FC = () => {
  const { lineIndex, charIndex, finished, fullText } = useTerminalTyping(TERMINAL_LINES, { autoLoop: false });
  return (
    <div className="flex flex-col h-screen overflow-y-scroll font-dm-sans bg-[#FBF9F4]">
      <Header />

      <div className="flex flex-1 h-full">
        {/* Left Pane: Deep Space SRE Console */}
        <div className="hidden lg:flex w-[55%] bg-[#07111E] relative overflow-hidden flex-col justify-center px-16">
          {/* Star Field Background Simulation */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <div 
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  width: Math.random() * 2 + 'px',
                  height: Math.random() * 2 + 'px',
                  top: Math.random() * 100 + '%',
                  left: Math.random() * 100 + '%',
                  opacity: Math.random()
                }}
              />
            ))}
          </div>

          <div className="relative z-10 max-w-xl">
            <h1 className="text-white text-5xl font-bold leading-tight tracking-tight mb-6">
              AI Recruiter <br />
              <span className="text-primary">On Autopilot.</span>
            </h1>
            <p className="text-[#7F7F7F] text-lg mb-12 max-w-md leading-relaxed">
              Let your dedicated agents source, screen, and schedule top-tier talent while you focus on the final decision.
            </p>

            {/* Simulated Terminal Window */}
            <div className="bg-[#030810]/80 border border-primary/30 rounded-xl p-5 font-space-mono text-xs w-[450px] shadow-2xl backdrop-blur-sm mt-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF1500]/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFEA00]/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00FF4D]/80"></div>
                </div>
                <div className="text-[10px] text-primary/40 uppercase tracking-widest font-bold">
                  JJ_AGENT_LOGS_V2.0
                </div>
              </div>
              
              <div className="space-y-2 min-h-[144px]">
                {TERMINAL_LINES.map((line, idx) => {
                  if (idx > lineIndex) return null;
                  const isCurrentLine = idx === lineIndex;
                  const chars = isCurrentLine ? charIndex : fullText(idx).length;
                  const showCursor = isCurrentLine && !finished;
                  return (
                    <TypedLine key={idx} line={line} visibleChars={chars} showCursor={showCursor} />
                  );
                })}
                {finished && (
                  <span className="inline-block w-2 h-4 bg-[#00FF88] animate-pulse mt-1" />
                )}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <footer className="absolute bottom-0 left-0 right-0 p-8 flex justify-center">
            <div className="flex space-x-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
              <span>© 2024 JobJockey AI. Human-in-the-loop executive search.</span>
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </footer>
        </div>

        {/* Right Pane: Signin Form */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center items-center px-12 bg-[#FBF9F4]">
          <Card className="w-full max-w-[480px] border border-[#E4E2DD] shadow-sm bg-white p-10 rounded-[20px]">
            <CardHeader className="space-y-1 px-0 pb-8 pt-0">
              <CardTitle className="text-3xl font-bold tracking-tight text-[#0A0A0A]">Welcome back</CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Your agents are standing by.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-0 pb-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-4">Email Address</label>
                  <Input type="email" placeholder="name@company.com" />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-4">Password</label>
                        <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">Forgot password?</a>
                    </div>
                  <div className="relative">
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                      <Eye className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              <Button variant="default" size="xl" className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg mt-2">
                Sign In
              </Button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                  <span className="bg-[#FBF9F4] px-4 text-muted-foreground">or</span>
                </div>
              </div>

              <Button variant="outline" size="xl" className="w-full bg-white border-[#E4E2DD] text-[#0A0A0A] hover:bg-gray-50 flex items-center justify-center space-x-3 rounded-[20px]">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Continue with Google</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Signin;
