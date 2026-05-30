import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Separator } from '../components/ui/Separator';

export const Welcome: React.FC = () => {
  const navigate = useNavigate();

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
              Your AI recruiter, legal advisor, and career coach.
            </h1>
            <p className="text-[#7F7F7F] text-lg mb-12 max-w-md leading-relaxed">
              Autonomous agents find jobs, tailor your resume, and flag legal red flags — you just approve.
            </p>

            {/* Simulated Terminal Window */}
            <div className="bg-[#030810]/80 border border-primary/30 rounded-xl p-5 font-space-mono text-xs w-[400px] shadow-2xl backdrop-blur-sm mt-8">
              <div className="flex space-x-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#FF1500]"></div>
                <div className="w-2 h-2 rounded-full bg-[#FFEA00]"></div>
                <div className="w-2 h-2 rounded-full bg-[#00FF4D]"></div>
              </div>
              <div className="space-y-1">
                <div className="flex space-x-2">
                  <span className="text-primary/40">[Orchestrator]</span>
                  <span className="text-[#00FFCC]">Scanning 240 roles...</span>
                </div>
                <div className="flex space-x-2">
                  <span className="text-blue-400/40">[Scout]</span>
                  <span className="text-[#00FFCC]">12 matches found</span>
                </div>
                <div className="flex space-x-2">
                  <span className="text-purple-400/40">[Tailor]</span>
                  <span className="text-[#00FFCC]">Resume adapted for Stripe → <span className="text-[#00FF4D]">94% ATS score</span></span>
                </div>
                <div className="flex space-x-2 pt-1">
                  <span className="text-[#7F7F7F]">system:</span>
                  <span className="text-[#00FFCC]">Awaiting user confirmation</span>
                  <span className="inline-block w-2 h-4 bg-[#00FF88] animate-pulse"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: Premium Editorial Canvas */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center items-center px-12 bg-[#FBF9F4]">
          <div className="max-w-sm w-full text-center">
            <h2 className="text-3xl font-bold text-[#0A0A0A] mb-2">Get started free</h2>
            <p className="text-[#7F7F7F] mb-10">No credit card required.</p>

            <div className="space-y-4 w-full">
              {/* Based on the image layout but using DESIGN.md gradient for primary action */}
              <Button size="xl" className="w-full shadow-xl" onClick={() => navigate('/signup')}>
                Create Account
              </Button>

              <div className="flex items-center my-8">
                <Separator className="flex-1" />
                <span className="px-4 text-[10px] text-[#7F7F7F] font-bold uppercase tracking-widest">OR</span>
                <Separator className="flex-1" />
              </div>

              <Button 
                variant="outline" 
                size="xl" 
                className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-[#F5F3EE] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                  <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.712s.102-1.172.282-1.712V4.956H.957a8.996 8.996 0 000 8.088l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.582C13.463.891 11.426 0 9 0 5.483 0 2.443 2.043.957 4.956L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
              </Button>
            </div>

            <p className="mt-8 text-sm text-[#7F7F7F]">
              Already have an account? <a href="#" className="text-[#FF4F00] font-bold hover:underline">Sign in</a>
            </p>
          </div>

          {/* Footer */}
          <footer className="absolute bottom-8 w-full text-center px-12">
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
