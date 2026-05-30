// frontend/src/pages/SavedJobs.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { Avatar } from '../components/ui/Avatar';
import { DropdownMenu } from '../components/ui/DropdownMenu';
import { cn } from '../lib/utils';
import { 
  Bookmark,
  User,
  Bell,
  CreditCard,
  LifeBuoy,
  LogOut,
  MapPin,
  Clock,
  Coins
} from 'lucide-react';

interface SavedJob {
  id: string;
  title: string;
  company: string;
  logoColor: string;
  logoLetter: string;
  tags: string[];
  salary: string;
  location: string;
}

export const SavedJobs: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [menuOpen, setMenuOpen] = useState(false);
  
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([
    {
      id: '1',
      title: 'Senior Product Designer',
      company: 'NeoLedger',
      logoColor: 'bg-emerald-950 text-white',
      logoLetter: 'N',
      tags: ['Figma', 'ProtoPie', 'Design Ops'],
      salary: '$160k – $210k + Equity',
      location: 'San Francisco, CA'
    },
    {
      id: '2',
      title: 'Staff UI Engineer',
      company: 'Figma',
      logoColor: 'bg-orange-100 text-orange-600',
      logoLetter: 'F',
      tags: ['React', 'TypeScript', 'WebAssembly'],
      salary: '$180k – $230k + Equity',
      location: 'San Francisco, CA'
    },
    {
      id: '3',
      title: 'Engineering Manager',
      company: 'Vercel',
      logoColor: 'bg-black text-white',
      logoLetter: 'V',
      tags: ['Next.js', 'React', 'Management'],
      salary: '$190k – $250k',
      location: 'Remote'
    },
    {
      id: '4',
      title: 'Design Systems Lead',
      company: 'Airbnb',
      logoColor: 'bg-rose-500 text-white',
      logoLetter: 'A',
      tags: ['Design Tokens', 'React', 'Figma'],
      salary: '$170k – $220k',
      location: 'Remote'
    },
    {
      id: '5',
      title: 'Principal Product Designer',
      company: 'Linear',
      logoColor: 'bg-indigo-950 text-white',
      logoLetter: 'L',
      tags: ['Figma', 'Product Strategy', 'UI/UX'],
      salary: '$200k – $260k + Equity',
      location: 'Remote'
    }
  ]);

  const handleRemove = (id: string) => {
    setSavedJobs(prev => prev.filter(job => job.id !== id));
  };

  const handleApply = (jobId: string) => {
    // Simply navigate to the applications page to let them view the setup
    navigate('/applications');
  };

  const dropdownItems = [
    { label: 'Profile', icon: User, onClick: () => navigate('/account#profile') },
    { label: 'Notifications', icon: Bell, onClick: () => navigate('/account#notifications') },
    { label: 'Billing', icon: CreditCard, onClick: () => navigate('/account#billing') },
    { label: 'Help & Support', icon: LifeBuoy, onClick: () => navigate('/account#help') },
    { label: 'Sign Out', icon: LogOut, onClick: () => navigate('/account#signout') },
  ];

  return (
    <div className="flex bg-[#FBF9F4] h-screen w-screen overflow-hidden font-dm-sans text-[#0A0A0A]">
      <Sidebar mode={mode} onModeChange={setMode} />

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <div className="px-10 py-6 border-b border-[#E4E2DD] bg-white flex justify-between items-center shrink-0">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-[#0A0A0A] tracking-tight">Saved Jobs</h1>
            <p className="text-xs text-[#7F7F7F] font-medium mt-0.5">
              12 active • 3 pending review • 2 offers
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

        {/* Saved Jobs List */}
        <div className="flex-1 overflow-y-auto p-10 bg-[#FBF9F4]">
          <div className="max-w-4xl mx-auto flex flex-col space-y-4">
            {savedJobs.length > 0 ? (
              savedJobs.map(job => (
                <div 
                  key={job.id}
                  className="bg-white border border-[#E4E2DD] rounded-2xl p-6 flex justify-between items-center hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center space-x-5">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base shrink-0", job.logoColor)}>
                      {job.logoLetter}
                    </div>
                    <div className="flex flex-col space-y-1">
                      <h3 className="font-bold text-base text-[#0A0A0A]">{job.title}</h3>
                      <p className="text-xs text-[#7F7F7F] font-semibold">{job.company} • {job.location}</p>
                      
                      {/* Tags */}
                      <div className="flex items-center space-x-2 pt-1 flex-wrap gap-y-1">
                        {job.tags.map(tag => (
                          <span key={tag} className="bg-[#F5F3EE] text-[#444444] text-[10px] font-bold px-2.5 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <span className="text-sm font-bold text-[#00AA50] shrink-0">
                      {job.salary}
                    </span>
                    
                    <div className="flex items-center space-x-3 shrink-0 select-none">
                      <button 
                        onClick={() => handleRemove(job.id)}
                        className="border border-[#E4E2DD] hover:border-red-200 text-[#7F7F7F] hover:text-red-500 rounded-full px-5 py-2 text-xs font-bold transition-all duration-150 cursor-pointer bg-white"
                      >
                        Remove
                      </button>
                      <button 
                        onClick={() => handleApply(job.id)}
                        className="bg-[#FF4D00] hover:bg-[#FF4D00]/90 text-white rounded-full px-5 py-2.5 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Apply to Job
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 flex flex-col items-center justify-center">
                <Bookmark className="w-12 h-12 text-[#B0B0B0] mb-4" />
                <h3 className="font-bold text-lg text-[#0A0A0A]">No saved jobs</h3>
                <p className="text-xs text-[#7F7F7F] mt-1">Browse opportunities and save them to apply later.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SavedJobs;
