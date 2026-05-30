import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { Avatar } from '../components/ui/Avatar';
import { DropdownMenu } from '../components/ui/DropdownMenu';
import { Card, CardContent } from '../components/ui/Card';
import {
  ChevronDown,
  User,
  Bell,
  CreditCard,
  LifeBuoy,
  LogOut,
  Bot,
  FileText,
  Search,
  Hand,
  Briefcase,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../lib/utils';

const GuideSection: React.FC<{
  title: string;
  icon: React.FC<{ className?: string }>;
  children: React.ReactNode;
}> = ({ title, icon: Icon, children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white border border-[#E4E2DD] rounded-2xl overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-6 py-5 text-left transition-colors hover:bg-[#F5F3EE] cursor-pointer"
      >
        <div className="flex items-center space-x-3">
          <Icon className="w-5 h-5 text-[#FF4D00]" />
          <h3 className="font-bold text-base text-[#0A0A0A]">{title}</h3>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-[#7F7F7F] transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          open ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
};

export const Guidelines: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [menuOpen, setMenuOpen] = useState(false);

  const dropdownItems = [
    { label: 'Profile', icon: User, onClick: () => navigate('/account#profile') },
    { label: 'Notifications', icon: Bell, onClick: () => navigate('/account#notifications') },
    { label: 'Billing', icon: CreditCard, onClick: () => navigate('/account#billing') },
    { label: 'Help & Support', icon: LifeBuoy, onClick: () => navigate('/account#help') },
    { label: 'Sign Out', icon: LogOut, onClick: () => navigate('/account#signout') },
  ];

  return (
    <div className="flex bg-[#FBF9F4] h-screen w-screen overflow-hidden font-dm-sans text-[#0A0A0A]">
      <Sidebar
        mode={mode}
        onModeChange={setMode}
        onUpdateResume={() => navigate('/account#profile')}
      />

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <div className="px-10 py-6 border-b border-[#E4E2DD] bg-white flex justify-between items-center shrink-0">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-[#0A0A0A] tracking-tight">How to Guide</h1>
            <p className="text-xs text-[#7F7F7F] font-medium mt-0.5">
              Everything you need to know about using JobJockey.
            </p>
          </div>

          <div className="flex items-center space-x-4">
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-10 bg-[#FBF9F4]">
          <div className="max-w-3xl mx-auto flex flex-col space-y-6 pb-16">
            {/* Welcome Card */}
            <Card className="border-[#E4E2DD] rounded-2xl overflow-hidden bg-gradient-to-r from-[#FFF0EA] to-[#FFFDFB]">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-[#FF4D00]/10 flex items-center justify-center shrink-0">
                    <Bot className="w-6 h-6 text-[#FF4D00]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#0A0A0A]">Welcome to JobJockey!</h2>
                    <p className="text-sm text-[#7F7F7F] mt-1 leading-relaxed">
                      JobJockey connects Nigerian professionals with global opportunities. Our AI agents handle everything from job searching to contract review.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Getting Started */}
            <GuideSection title="Getting Started" icon={Search}>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#FF4D00] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#0A0A0A]">Complete your Profile</h4>
                    <p className="text-xs text-[#7F7F7F] mt-0.5 leading-relaxed">
                      Go to <span className="text-[#FF4D00] font-medium cursor-pointer" onClick={() => navigate('/account#profile')}>Account &gt; Profile</span> to add your details, LinkedIn, and GitHub.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#FF4D00] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#0A0A0A]">Upload your Resume</h4>
                    <p className="text-xs text-[#7F7F7F] mt-0.5 leading-relaxed">
                      Click "Update Resume" in the sidebar. Our Resume Agent will analyze your resume and calculate an ATS score.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#FF4D00] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#0A0A0A]">Set your Preferences</h4>
                    <p className="text-xs text-[#7F7F7F] mt-0.5 leading-relaxed">
                      Go to <span className="text-[#FF4D00] font-medium cursor-pointer" onClick={() => navigate('/settings')}>Settings</span> to configure target salary, industries, location, and more.
                    </p>
                  </div>
                </div>
              </div>
            </GuideSection>

            {/* Using Manual Mode */}
            <GuideSection title="Using Manual Mode" icon={Hand}>
              <div className="space-y-4">
                <p className="text-sm text-[#7F7F7F] leading-relaxed">
                  Manual Mode is for hands-on job searching. You control which jobs to apply to.
                </p>
                <div className="bg-[#F5F3EE] rounded-xl p-4">
                  <ol className="list-decimal list-inside space-y-2 text-sm text-[#444444]">
                    <li>Type your job search query (e.g., "Senior Product Designer, Fintech")</li>
                    <li>Use the filter chips to refine results</li>
                    <li>Browse job cards and click "View Description" for details</li>
                    <li>Click "Apply" to go to the external application page</li>
                    <li>Or click "View Analysis" to see AI-powered insights</li>
                  </ol>
                </div>
              </div>
            </GuideSection>

            {/* Using Auto Mode */}
            <GuideSection title="Using Auto Mode" icon={Bot}>
              <div className="space-y-4">
                <p className="text-sm text-[#7F7F7F] leading-relaxed">
                  Auto Mode lets our AI agents handle the entire process for you.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-[#E4E2DD] rounded-2xl">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Search className="w-4 h-4 text-[#FF4D00]" />
                        <h4 className="text-sm font-semibold text-[#0A0A0A]">Job Agent</h4>
                      </div>
                      <p className="text-xs text-[#7F7F7F] leading-relaxed">
                        Scours job boards, filters for remote/visa roles, converts salaries to NGN, and checks timezone overlap (WAT).
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-[#E4E2DD] rounded-2xl">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="w-4 h-4 text-[#FF4D00]" />
                        <h4 className="text-sm font-semibold text-[#0A0A0A]">Resume Agent</h4>
                      </div>
                      <p className="text-xs text-[#7F7F7F] leading-relaxed">
                        Tailors your resume per job, adapts local terminology to global standards, and highlights relevant skills.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-[#E4E2DD] rounded-2xl">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="w-4 h-4 text-[#FF4D00]" />
                        <h4 className="text-sm font-semibold text-[#0A0A0A]">Contract Agent</h4>
                      </div>
                      <p className="text-xs text-[#7F7F7F] leading-relaxed">
                        Analyzes contracts for IP clauses, non-competes, visa lock-in periods, and calculates net pay in NGN.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-[#E4E2DD] rounded-2xl">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Briefcase className="w-4 h-4 text-[#FF4D00]" />
                        <h4 className="text-sm font-semibold text-[#0A0A0A]">LinkedIn Agent</h4>
                      </div>
                      <p className="text-xs text-[#7F7F7F] leading-relaxed">
                        Crafts personalized outreach messages and suggests ideal times to connect based on timezones.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </GuideSection>

            {/* Nigeria-Specific Tips */}
            <GuideSection title="Nigeria-Specific Tips" icon={Briefcase}>
              <div className="space-y-3">
                <div className="bg-[#FFF0EA] border border-[#FF4D00]/20 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-[#FF4D00] mb-1">Resume Adaptation</h4>
                  <p className="text-xs text-[#7F7F7F] leading-relaxed">
                    Our Resume Agent automatically removes local-specific details (like state of origin) and translates NYSC experience to "National Service / Civil Service Program" for global employers.
                  </p>
                </div>
                <div className="bg-[#E2F9EE] border border-[#15B097]/20 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-[#15B097] mb-1">Timezone Considerations</h4>
                  <p className="text-xs text-[#444444] leading-relaxed">
                    WAT is UTC+1. US East Coast is UTC-5 (6hr difference), West Coast is UTC-8 (9hr difference). The Job Agent flags roles requiring you to work overnight hours.
                  </p>
                </div>
                <div className="bg-white border border-[#E4E2DD] rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-[#0A0A0A] mb-1">Currency Display</h4>
                  <p className="text-xs text-[#7F7F7F] leading-relaxed">
                    All salaries show both USD and NGN equivalents using live exchange rates (with fallback if API fails).
                  </p>
                </div>
              </div>
            </GuideSection>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center justify-between bg-white border border-[#E4E2DD] rounded-2xl p-4 hover:border-[#FF4D00]/30 transition-colors cursor-pointer group"
              >
                <div className="text-left">
                  <h4 className="text-sm font-semibold text-[#0A0A0A]">Go to Dashboard</h4>
                  <p className="text-xs text-[#7F7F7F] mt-0.5">Start searching for jobs</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#7F7F7F] group-hover:text-[#FF4D00] transition-colors" />
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="flex items-center justify-between bg-white border border-[#E4E2DD] rounded-2xl p-4 hover:border-[#FF4D00]/30 transition-colors cursor-pointer group"
              >
                <div className="text-left">
                  <h4 className="text-sm font-semibold text-[#0A0A0A]">Open Settings</h4>
                  <p className="text-xs text-[#7F7F7F] mt-0.5">Configure preferences</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#7F7F7F] group-hover:text-[#FF4D00] transition-colors" />
              </button>
              <button
                onClick={() => navigate('/account#help')}
                className="flex items-center justify-between bg-white border border-[#E4E2DD] rounded-2xl p-4 hover:border-[#FF4D00]/30 transition-colors cursor-pointer group"
              >
                <div className="text-left">
                  <h4 className="text-sm font-semibold text-[#0A0A0A]">Get Support</h4>
                  <p className="text-xs text-[#7F7F7F] mt-0.5">Contact our team</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#7F7F7F] group-hover:text-[#FF4D00] transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Guidelines;
