import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import Sidebar from '../components/layout/Sidebar';
import { Avatar } from '../components/ui/Avatar';
import { DropdownMenu } from '../components/ui/DropdownMenu';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Separator } from '../components/ui/Separator';
import {
  ChevronDown,
  DollarSign,
  Globe,
  Search,
  Bot,
  MapPin,
  Clock,
  Briefcase,
  Settings2,
  User,
  Bell,
  CreditCard,
  LifeBuoy,
  LogOut,
} from 'lucide-react';

const EXCHANGE_RATE = 1550;

const INDUSTRIES = [
  'Fintech',
  'HealthTech',
  'SaaS',
  'E-Commerce',
  'AI/ML',
  'EdTech',
  'Cybersecurity',
  'Cloud Infrastructure',
  'Gaming',
  'CleanTech',
] as const;

const JOB_TYPES = ['Full-time', 'Contract', 'Freelance', 'Internship'] as const;

const JOB_BOARDS = [
  'LinkedIn',
  'Indeed',
  'Glassdoor',
  'Remote OK',
  'We Work Remotely',
  'AngelList',
  'Built In',
  'HackerNews Who\'s Hiring',
] as const;

const FREQUENCIES = ['Immediate', 'Daily', 'Weekly'] as const;

const Toggle: React.FC<{ enabled: boolean; onChange: () => void }> = ({ enabled, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={cn(
      'relative w-10 h-6 rounded-full transition-colors duration-200 shrink-0',
      enabled ? 'bg-[#FF4D00]' : 'bg-[#E4E2DD]'
    )}
  >
    <span
      className={cn(
        'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200',
        enabled ? 'translate-x-4' : 'translate-x-0'
      )}
    />
  </button>
);

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 border',
      selected
        ? 'bg-[#FFF0EA] text-[#FF4D00] border-[#FF4D00]/30'
        : 'bg-[#F5F3EE] text-[#444444] border-transparent hover:bg-[#EBE9E3]'
    )}
  >
    {label}
  </button>
);

interface SectionProps {
  title: string;
  icon: React.FC<{ className?: string }>;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon: Icon, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);

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
          open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
};

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [menuOpen, setMenuOpen] = useState(false);

  // Section 1: Job Preferences
  const [targetSalary, setTargetSalary] = useState<number>(80000);
  const [selectedIndustries, setSelectedIndustries] = useState<Set<string>>(new Set(['Fintech', 'SaaS']));
  const [selectedJobTypes, setSelectedJobTypes] = useState<Set<string>>(new Set(['Full-time']));

  const toggleIndustry = (id: string) => {
    setSelectedIndustries(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleJobType = (id: string) => {
    setSelectedJobTypes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Section 2: Location & Timezone
  const [preferredLocations, setPreferredLocations] = useState('San Francisco, New York, London, Remote');
  const [timezone, setTimezone] = useState('West Africa Time (WAT, UTC+1)');
  const [remoteOnly, setRemoteOnly] = useState(true);
  const [visaSponsorship, setVisaSponsorship] = useState(true);

  // Section 3: Search Sources
  const [selectedBoards, setSelectedBoards] = useState<Set<string>>(new Set(['LinkedIn', 'Indeed', 'Remote OK']));
  const [maxResults, setMaxResults] = useState<number>(50);
  const [keywords, setKeywords] = useState('senior product designer, design systems, fintech');

  const toggleBoard = (id: string) => {
    setSelectedBoards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Section 4: Agent Configuration
  const [resumeVersion, setResumeVersion] = useState('Resume_Final_v2.pdf');
  const [autoDigest, setAutoDigest] = useState(true);
  const [notifyNewMatches, setNotifyNewMatches] = useState(true);
  const [alertFrequency, setAlertFrequency] = useState<'Immediate' | 'Daily' | 'Weekly'>('Daily');

  const ngnEquivalent = targetSalary * EXCHANGE_RATE;

  const dropdownItems = [
    { label: 'Profile', icon: User, onClick: () => navigate('/account#profile') },
    { label: 'Notifications', icon: Bell, onClick: () => navigate('/account#notifications') },
    { label: 'Billing', icon: CreditCard, onClick: () => navigate('/account#billing') },
    { label: 'Help & Support', icon: LifeBuoy, onClick: () => navigate('/account#help') },
    { label: 'Sign Out', icon: LogOut, onClick: () => navigate('/account#signout') },
  ];

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="flex bg-[#FBF9F4] h-screen w-screen overflow-hidden font-dm-sans text-[#0A0A0A]">
      <Sidebar mode={mode} onModeChange={setMode} />

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <div className="px-10 py-6 border-b border-[#E4E2DD] bg-white flex justify-between items-center shrink-0">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-[#0A0A0A] tracking-tight">Settings</h1>
            <p className="text-xs text-[#7F7F7F] font-medium mt-0.5">
              Configure your job search preferences and agent behavior.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/guidelines')}
              className="bg-[#FF4D00] hover:bg-[#FF4D00]/90 text-white font-bold px-6 py-2.5 rounded-full text-xs transition-all duration-200 shadow-sm cursor-pointer"
            >
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-10 bg-[#FBF9F4]">
          <div className="max-w-3xl mx-auto flex flex-col space-y-6 pb-16">
            {/* Section 0: Quick Links */}
            <Section title="Quick Links" icon={Settings2} defaultOpen={true}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/account#profile')}
                  className="flex items-center space-x-3 bg-white border border-[#E4E2DD] rounded-2xl p-4 hover:border-[#FF4D00]/30 transition-colors cursor-pointer text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-[#FFF0EA] flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-[#FF4D00]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#0A0A0A]">Edit Profile</h4>
                    <p className="text-xs text-[#7F7F7F] mt-0.5">Update your personal details</p>
                  </div>
                </button>
                <button
                  onClick={() => navigate('/guidelines')}
                  className="flex items-center space-x-3 bg-white border border-[#E4E2DD] rounded-2xl p-4 hover:border-[#FF4D00]/30 transition-colors cursor-pointer text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-[#E2F9EE] flex items-center justify-center shrink-0">
                    <LifeBuoy className="w-5 h-5 text-[#15B097]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#0A0A0A]">How to Guide</h4>
                    <p className="text-xs text-[#7F7F7F] mt-0.5">Learn how to use JobJockey</p>
                  </div>
                </button>
              </div>
            </Section>

            {/* Section 1: Job Preferences */}
            <Section title="Job Preferences" icon={Briefcase} defaultOpen={true}>
              <div className="space-y-6">
                {/* Target Salary */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#7F7F7F] ml-4">
                    Target Minimum Salary (USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7F7F7F]" />
                    <input
                      type="number"
                      value={targetSalary}
                      onChange={(e) => setTargetSalary(Number(e.target.value))}
                      className="flex h-12 w-full rounded-[20px] border border-[#E4E2DD] bg-white pl-11 pr-6 py-2 text-sm font-dm-sans text-[#0A0A0A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D00]"
                    />
                  </div>
                  <p className="text-xs text-[#7F7F7F] font-medium ml-4">
                    NGN Equivalent: ~₦{ngnEquivalent.toLocaleString()} NGN <span className="text-[#B0B0B0]">(at ₦{EXCHANGE_RATE.toLocaleString()}/USD)</span>
                  </p>
                </div>

                <Separator className="bg-[#E4E2DD]" />

                {/* Industries */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#7F7F7F] ml-4 block">
                    Preferred Industries
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.map((ind) => (
                      <Chip
                        key={ind}
                        label={ind}
                        selected={selectedIndustries.has(ind)}
                        onClick={() => toggleIndustry(ind)}
                      />
                    ))}
                  </div>
                </div>

                <Separator className="bg-[#E4E2DD]" />

                {/* Job Types */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#7F7F7F] ml-4 block">
                    Job Types
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {JOB_TYPES.map((jt) => (
                      <Chip
                        key={jt}
                        label={jt}
                        selected={selectedJobTypes.has(jt)}
                        onClick={() => toggleJobType(jt)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            {/* Section 2: Location & Timezone */}
            <Section title="Location & Timezone" icon={MapPin} defaultOpen={true}>
              <div className="space-y-6">
                {/* Preferred Locations */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#7F7F7F] ml-4">
                    Preferred Locations
                  </label>
                  <Input
                    value={preferredLocations}
                    onChange={(e) => setPreferredLocations(e.target.value)}
                  />
                  <p className="text-xs text-[#7F7F7F] font-medium ml-4">
                    Comma-separated list of cities or regions.
                  </p>
                </div>

                <Separator className="bg-[#E4E2DD]" />

                {/* Timezone */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#7F7F7F] ml-4">
                    Your Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="flex h-12 w-full rounded-[20px] border border-[#E4E2DD] bg-white px-6 py-2 text-sm font-dm-sans text-[#444444] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D00]"
                  >
                    <option>West Africa Time (WAT, UTC+1)</option>
                    <option>Eastern Time (ET, UTC-5)</option>
                    <option>British Time (BST, UTC+1)</option>
                    <option>Central European Time (CET, UTC+1)</option>
                    <option>Pacific Time (PT, UTC-8)</option>
                  </select>
                  <p className="text-xs text-[#7F7F7F] font-medium ml-4">
                    Used to calculate timezone overlap for remote roles. WAT is UTC+1.
                  </p>
                </div>

                <Separator className="bg-[#E4E2DD]" />

                {/* Toggles */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#0A0A0A]">Remote Only</p>
                      <p className="text-xs text-[#7F7F7F]">Only show remote-friendly positions</p>
                    </div>
                    <Toggle enabled={remoteOnly} onChange={() => setRemoteOnly(!remoteOnly)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#0A0A0A]">Visa Sponsorship</p>
                      <p className="text-xs text-[#7F7F7F]">Only show roles offering visa sponsorship</p>
                    </div>
                    <Toggle enabled={visaSponsorship} onChange={() => setVisaSponsorship(!visaSponsorship)} />
                  </div>
                </div>
              </div>
            </Section>

            {/* Section 3: Search Sources */}
            <Section title="Search Sources" icon={Search} defaultOpen={false}>
              <div className="space-y-6">
                {/* Job Boards */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#7F7F7F] ml-4 block">
                    Job Boards
                  </label>
                  <div className="space-y-3">
                    {JOB_BOARDS.map((board) => (
                      <div key={board} className="flex items-center justify-between px-4">
                        <span className="text-sm font-medium text-[#444444]">{board}</span>
                        <Toggle
                          enabled={selectedBoards.has(board)}
                          onChange={() => toggleBoard(board)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-[#E4E2DD]" />

                {/* Max Results */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#7F7F7F] ml-4">
                    Max Results Per Search
                  </label>
                  <div className="flex items-center space-x-4 px-4">
                    <input
                      type="range"
                      min={10}
                      max={200}
                      step={10}
                      value={maxResults}
                      onChange={(e) => setMaxResults(Number(e.target.value))}
                      className="flex-1 accent-[#FF4D00]"
                    />
                    <span className="text-sm font-bold text-[#0A0A0A] min-w-[3ch] text-right tabular-nums">
                      {maxResults}
                    </span>
                  </div>
                </div>

                <Separator className="bg-[#E4E2DD]" />

                {/* Keywords */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#7F7F7F] ml-4">
                    Default Search Keywords
                  </label>
                  <Input
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                  />
                  <p className="text-xs text-[#7F7F7F] font-medium ml-4">
                    Used as the default prompt when searching for jobs.
                  </p>
                </div>
              </div>
            </Section>

            {/* Section 4: Agent Configuration */}
            <Section title="Agent Configuration" icon={Bot} defaultOpen={false}>
              <div className="space-y-6">
                {/* Resume Version */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#7F7F7F] ml-4">
                    Active Resume Version
                  </label>
                  <select
                    value={resumeVersion}
                    onChange={(e) => setResumeVersion(e.target.value)}
                    className="flex h-12 w-full rounded-[20px] border border-[#E4E2DD] bg-white px-6 py-2 text-sm font-dm-sans text-[#444444] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D00]"
                  >
                    <option>Resume_Final_v2.pdf</option>
                    <option>Resume_Final_v1.pdf</option>
                    <option>Resume_Generic.pdf</option>
                  </select>
                </div>

                <Separator className="bg-[#E4E2DD]" />

                {/* Toggles */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#0A0A0A]">Auto Mode Digest</p>
                      <p className="text-xs text-[#7F7F7F]">Receive a weekly summary of Auto Mode activity</p>
                    </div>
                    <Toggle enabled={autoDigest} onChange={() => setAutoDigest(!autoDigest)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#0A0A0A]">New Match Alerts</p>
                      <p className="text-xs text-[#7F7F7F]">Get notified when new jobs match your criteria</p>
                    </div>
                    <Toggle enabled={notifyNewMatches} onChange={() => setNotifyNewMatches(!notifyNewMatches)} />
                  </div>
                </div>

                <Separator className="bg-[#E4E2DD]" />

                {/* Alert Frequency */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#7F7F7F] ml-4 block">
                    Alert Frequency
                  </label>
                  <div className="flex space-x-3 px-4">
                    {FREQUENCIES.map((f) => (
                      <button
                        key={f}
                        onClick={() => setAlertFrequency(f)}
                        className={cn(
                          'px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 border',
                          alertFrequency === f
                            ? 'bg-[#FF4D00] text-white border-[#FF4D00] shadow-sm'
                            : 'bg-white text-[#444444] border-[#E4E2DD] hover:border-[#FF4D00]/50 cursor-pointer'
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSave}
                variant="default"
                size="xl"
                className="rounded-full bg-[#0A0A0A] hover:bg-[#222222] text-white font-bold px-12 shadow-md cursor-pointer"
              >
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
