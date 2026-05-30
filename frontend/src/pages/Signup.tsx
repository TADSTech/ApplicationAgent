import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Header } from '../components/layout/Header';
import { TypedLine } from '../components/ui/TypedLine';
import { useTerminalTyping } from '../hooks/useTerminalTyping';
import { TerminalLine } from '../types';
import { useAuth } from '../context/AuthContext';

const TERMINAL_LINES: TerminalLine[] = [
  { label: '>', labelColor: 'text-[#00FFCC] font-bold', message: 'Searching global remote opportunities...', messageClassName: 'text-[#00FFCC]/90' },
  { label: '>', labelColor: 'text-[#00FFCC] font-bold', message: 'Applying West African Time (WAT) compatibility filter...', messageClassName: 'text-[#15B097]' },
  { label: '>', labelColor: 'text-[#00FFCC] font-bold', message: 'Matches found for Business Operations, Sales & Tech.', messageClassName: 'text-[#00FF4D]' },
  { label: '>', labelColor: 'text-[#00FFCC] font-bold', message: 'Preparing resume adaptations...', messageClassName: 'text-[#00FFCC]/60' },
  { label: '>', labelColor: 'text-[#00FFCC] font-bold', message: 'Awaiting account creation...', messageClassName: 'text-[#7F7F7F]' },
  { label: '>', labelColor: 'text-[#00FFCC] font-bold', message: 'Initializing agent pipeline...', messageClassName: 'text-[#00FFCC]/90' },
];

export const Signup: React.FC = () => {
  const { loginWithGoogle, error } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { lineIndex, charIndex, finished, fullText } = useTerminalTyping(TERMINAL_LINES, { autoLoop: false });

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/onboarding');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-scroll font-dm-sans bg-[#FBF9F4]">
      <Header />

      <div className="flex flex-1 h-full">
        {/* Left Pane: Clean & Friendly Visual Interface */}
        <div className="hidden lg:flex w-[55%] bg-gradient-to-tr from-[#F4EFEA] via-[#EAE3DC] to-[#E2D9CF] relative overflow-hidden flex-col justify-center px-16 border-r border-[#E4E2DD]">
          {/* Subtle grid lines for a clean layout structure */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]"></div>

          <div className="relative z-10 max-w-xl">
            <span className="text-xs font-bold tracking-widest text-[#B58A63] uppercase bg-[#FAF6F0] px-3 py-1 rounded-full border border-[#E4E2DD]">Introducing JobJockey</span>
            <h1 className="text-[#1A1A1A] text-5xl font-extrabold leading-tight tracking-tight mt-6 mb-6 font-dm-sans">
              Global Careers <br />
              <span className="text-[#FF4D00]">On Autopilot.</span>
            </h1>
            <p className="text-[#5C5A56] text-lg mb-12 max-w-md leading-relaxed">
              Let your dedicated agents find remote work, optimize your CV, and secure your contracts while you focus on landing the offer.
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

        {/* Right Pane: Google Sign-up Card */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center items-center px-12 bg-background animate-in fade-in duration-500">
          <Card className="w-full max-w-[480px] border border-border shadow-sm bg-card p-10 rounded-[20px] transition-all duration-300">
            <CardHeader className="space-y-2 px-0 pb-8 pt-0 text-center">
              <CardTitle className="text-3xl font-bold tracking-tight text-foreground font-space-mono">Create your account</CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Let's get your agent ready.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-0 pb-0 flex flex-col items-center">
              <Button 
                onClick={handleGoogleSignUp}
                disabled={loading}
                variant="outline" 
                size="xl" 
                className="w-full bg-card border-border text-foreground hover:bg-muted flex items-center justify-center space-x-3 rounded-[20px] py-7 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
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
                <span className="font-bold text-sm tracking-wide">Continue with Google</span>
              </Button>
              
              {error && (
                <p className="text-destructive text-xs font-semibold text-center mt-2 animate-pulse">{error}</p>
              )}

              <div className="text-center pt-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-relaxed">
                  By signing up you agree to our <a href="#" className="text-primary hover:underline">Terms</a> & <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Signup;
