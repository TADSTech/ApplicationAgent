import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import {
  User,
  Bell,
  CreditCard,
  LifeBuoy,
  LogOut,
  ChevronLeft,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'help', label: 'Help & Support', icon: LifeBuoy },
  { id: 'signout', label: 'Sign Out', icon: LogOut },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

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

const faqs = [
  { q: 'How does JobJockey find jobs?', a: 'Our AI scouts scan 40+ job boards and company career pages daily, filtering for remote, visa-sponsored, and relocation roles matched to your profile.' },
  { q: 'Can I customize my resume per job?', a: 'Yes. The Resume Agent tailors your resume for each application, highlighting the skills and experience most relevant to the role.' },
  { q: 'Is my data secure?', a: 'All data is encrypted at rest and in transit. We never share your resume or personal information without your explicit approval.' },
  { q: 'What happens after I apply?', a: 'Our LinkedIn Agent can draft follow-up messages, and the Contract Agent reviews any offers for legal red flags before you sign.' },
];

const ProfileSection: React.FC = () => (
  <div className="space-y-8">
    <div className="flex items-center space-x-6">
      <Avatar seed="user@jobjockey.ai" size={72} />
      <div>
        <h3 className="text-lg font-bold text-[#0A0A0A]">Your Photo</h3>
        <p className="text-sm text-[#7F7F7F] mt-0.5">This is generated from your email. Sign in with Google to use your Google photo.</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-[#7F7F7F] ml-4">Full Name</label>
        <Input defaultValue="Kendall Jones" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-[#7F7F7F] ml-4">Email Address</label>
        <Input defaultValue="kendall@jobjockey.ai" disabled />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-[#7F7F7F] ml-4">Phone</label>
        <Input defaultValue="+234 800 000 0000" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-[#7F7F7F] ml-4">Location</label>
        <Input defaultValue="Lagos, Nigeria" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-[#7F7F7F] ml-4">LinkedIn URL</label>
        <Input defaultValue="https://linkedin.com/in/kendalljones" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-[#7F7F7F] ml-4">GitHub URL</label>
        <Input defaultValue="https://github.com/kendalljones" />
      </div>
    </div>

    <div className="space-y-2 max-w-xs">
      <label className="text-[10px] font-bold uppercase tracking-widest text-[#7F7F7F] ml-4">Preferred Timezone</label>
      <select className="flex h-12 w-full rounded-[20px] border border-[#E4E2DD] bg-white px-6 py-2 text-sm font-dm-sans text-[#444444] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D00]">
        <option>West Africa Time (WAT, UTC+1)</option>
        <option>Eastern Time (ET, UTC-5)</option>
        <option>British Time (BST, UTC+1)</option>
        <option>Central European Time (CET, UTC+1)</option>
      </select>
    </div>

    <Button size="lg" className="rounded-full px-10">Save Changes</Button>
  </div>
);

const NotificationsSection: React.FC = () => {
  const [toggles, setToggles] = useState({
    email: true,
    push: true,
    digest: false,
    marketing: false,
    alertFrequency: 'immediate' as 'immediate' | 'daily' | 'weekly',
  });

  const toggle = (key: 'email' | 'push' | 'digest' | 'marketing') => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const rows: { label: string; desc: string; key: 'email' | 'push' | 'digest' | 'marketing' }[] = [
    { label: 'Email Notifications', desc: 'Receive application updates via email', key: 'email' },
    { label: 'Push Notifications', desc: 'Browser push alerts for new matches', key: 'push' },
    { label: 'Weekly Digest', desc: 'A Saturday roundup of your top matches', key: 'digest' },
    { label: 'Marketing Emails', desc: 'Product updates, tips, and offers', key: 'marketing' },
  ];

  return (
    <div className="space-y-8 max-w-lg">
      <Card className="divide-y divide-[#E4E2DD] overflow-hidden rounded-2xl">
        {rows.map((r) => (
          <div key={r.key} className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-semibold text-[#0A0A0A]">{r.label}</p>
              <p className="text-xs text-[#7F7F7F] mt-0.5">{r.desc}</p>
            </div>
            <Toggle enabled={toggles[r.key]} onChange={() => toggle(r.key)} />
          </div>
        ))}
      </Card>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-[#0A0A0A]">Job Alert Frequency</h4>
        <div className="flex space-x-4">
          {(['immediate', 'daily', 'weekly'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setToggles(prev => ({ ...prev, alertFrequency: f }))}
              className={cn(
                'px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 border',
                toggles.alertFrequency === f
                  ? 'bg-[#FF4D00] text-white border-[#FF4D00] shadow-sm'
                  : 'bg-white text-[#444444] border-[#E4E2DD] hover:border-[#FF4D00]/50'
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const BillingSection: React.FC = () => (
  <div className="space-y-6 max-w-lg">
    <Card className="p-6 rounded-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#7F7F7F]">Current Plan</p>
          <h3 className="text-xl font-bold text-[#0A0A0A] mt-1">Free</h3>
          <p className="text-sm text-[#7F7F7F] mt-1">10 job matches per month, basic tailoring</p>
        </div>
        <Button variant="outline" size="sm" className="rounded-full">Upgrade</Button>
      </div>
    </Card>

    <Card className="p-6 rounded-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#7F7F7F]">Payment Method</p>
          <p className="text-sm text-[#7F7F7F] mt-2">No payment method on file</p>
        </div>
        <Button variant="outline" size="sm" className="rounded-full">Add</Button>
      </div>
    </Card>

    <Card className="p-6 rounded-2xl">
      <p className="text-xs font-bold uppercase tracking-widest text-[#7F7F7F] mb-3">Billing History</p>
      <p className="text-sm text-[#7F7F7F]">No invoices yet.</p>
    </Card>
  </div>
);

const HelpSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-6 max-w-lg">
      <p className="text-sm text-[#7F7F7F]">Frequently asked questions about JobJockey.</p>

      <div className="divide-y divide-[#E4E2DD] bg-white border border-[#E4E2DD] rounded-2xl overflow-hidden">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex items-center justify-between w-full px-6 py-4 text-left transition-colors hover:bg-[#F5F3EE]"
              >
                <span className="text-sm font-semibold text-[#0A0A0A]">{faq.q}</span>
                <ChevronDown className={cn(
                  'w-4 h-4 text-[#7F7F7F] transition-transform duration-200',
                  isOpen && 'rotate-180'
                )} />
              </button>
              <div className={cn(
                'overflow-hidden transition-all duration-200',
                isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
              )}>
                <p className="px-6 pb-4 text-sm text-[#7F7F7F] leading-relaxed">{faq.a}</p>
              </div>
            </div>
          );
        })}
      </div>

      <Card className="p-6 rounded-2xl flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[#0A0A0A]">Still need help?</p>
          <p className="text-xs text-[#7F7F7F] mt-0.5">Our support team typically replies within 2 hours.</p>
        </div>
        <Button variant="default" size="sm" className="rounded-full">
          <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
          Contact
        </Button>
      </Card>
    </div>
  );
};

const SignOutSection: React.FC = () => (
  <div className="max-w-lg">
    <Card className="p-8 rounded-2xl border-destructive/20 text-center">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
        <LogOut className="w-6 h-6 text-destructive" />
      </div>
      <h3 className="text-lg font-bold text-[#0A0A0A]">Sign out of your account?</h3>
      <p className="text-sm text-[#7F7F7F] mt-2 max-w-xs mx-auto leading-relaxed">
        Your agents will pause. You can pick up where you left off anytime.
      </p>
      <div className="flex items-center justify-center space-x-4 mt-8">
        <Button variant="outline" className="rounded-full">Cancel</Button>
        <Button variant="destructive" size="lg" className="rounded-full">Sign Out</Button>
      </div>
    </Card>
  </div>
);

const SectionContent: Record<SectionId, React.FC> = {
  profile: ProfileSection,
  notifications: NotificationsSection,
  billing: BillingSection,
  help: HelpSection,
  signout: SignOutSection,
};

const SectionTitles: Record<SectionId, { title: string; desc: string }> = {
  profile: { title: 'Profile', desc: 'Manage your personal information and preferences.' },
  notifications: { title: 'Notifications', desc: 'Choose what updates you receive.' },
  billing: { title: 'Billing', desc: 'Manage your subscription and payment methods.' },
  help: { title: 'Help & Support', desc: 'Find answers and get in touch.' },
  signout: { title: 'Sign Out', desc: 'We will miss you.' },
};

export const Account: React.FC = () => {
  const navigate = useNavigate();

  const getSectionFromHash = (): SectionId => {
    const hash = window.location.hash.replace('#', '');
    if (SECTIONS.some(s => s.id === hash)) return hash as SectionId;
    return 'profile';
  };

  const [activeSection, setActiveSection] = useState<SectionId>(getSectionFromHash);

  useEffect(() => {
    const onHashChange = () => setActiveSection(getSectionFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const Content = SectionContent[activeSection];
  const { title, desc } = SectionTitles[activeSection];

  return (
    <div className="flex h-screen bg-[#FBF9F4] font-dm-sans">
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-[#E4E2DD] flex flex-col shrink-0">
        <div className="p-6 border-b border-[#E4E2DD]">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-xs text-[#7F7F7F] hover:text-[#0A0A0A] transition-colors font-medium"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            const isActive = activeSection === s.id;
            const isDanger = s.id === 'signout';

            return (
              <button
                key={s.id}
                onClick={() => { window.location.hash = s.id; }}
                className={cn(
                  'flex items-center space-x-3 w-full px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 text-left',
                  isActive
                    ? 'bg-[#FFF0EA] text-[#FF4D00]'
                    : isDanger
                      ? 'text-destructive hover:bg-red-50'
                      : 'text-[#444444] hover:bg-[#F5F3EE] hover:text-[#0A0A0A]'
                )}
              >
                <Icon className={cn(
                  'w-4 h-4',
                  isActive ? 'text-[#FF4D00]' : isDanger ? 'text-destructive' : 'text-[#7F7F7F]'
                )} />
                <span>{s.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#E4E2DD]">
          <p className="text-[10px] text-[#7F7F7F] text-center">JobJockey Account</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto py-12 px-10">
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-[#0A0A0A]">{title}</h1>
            <p className="text-[#7F7F7F] mt-1.5">{desc}</p>
          </div>
          <Content />
        </div>
      </main>
    </div>
  );
};

export default Account;
