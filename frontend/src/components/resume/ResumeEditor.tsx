import React, { useState, useRef } from 'react';
import { Upload, FileText, X, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResumeEditorProps {
  onBack: () => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ onBack }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const [name, setName] = useState('Kehinde Sholadoye');
  const [email, setEmail] = useState('k@sholadoye.com');
  const [phone, setPhone] = useState('+234 800 000 0000');
  const [location, setLocation] = useState('Lagos, Nigeria');
  const [title, setTitle] = useState('Senior Product Designer');

  const [summary, setSummary] = useState(
    'Product designer with 6+ years of experience crafting user-centered digital products for fintech and SaaS startups. Skilled in end-to-end design, design systems, and cross-functional collaboration.'
  );

  const [experience, setExperience] = useState([
    {
      id: 1,
      company: 'Tech Company',
      role: 'Senior Product Designer',
      duration: '2022 — Present',
      description: 'Leading design for the core product team. Built and maintained the company design system serving 4 product lines.',
    },
  ]);

  const [skills, setSkills] = useState('Figma, Prototyping, Design Systems, User Research, Framer, Tailwind CSS');

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.type.includes('pdf') || dropped.name.endsWith('.docx'))) {
      setFile(dropped);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  return (
    <div className="flex-1 overflow-y-auto px-12 py-8 flex flex-col space-y-8">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-[#7F7F7F] hover:text-[#0A0A0A] transition-colors text-sm font-dm-sans cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      <div className="max-w-4xl mx-auto w-full flex flex-col space-y-8">
        <h1 className="font-dm-sans text-3xl font-bold tracking-tight text-[#0A0A0A]">Update Resume</h1>

        {/* Upload Area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200',
            dragOver
              ? 'border-[#FF4D00] bg-[#FF4D00]/5'
              : file
                ? 'border-[#15B097] bg-[#E0FDF4]/30'
                : 'border-[#E4E2DD] hover:border-[#7F7F7F]'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={handleFileSelect}
          />
          {file ? (
            <div className="flex items-center justify-center space-x-3">
              <FileText className="w-8 h-8 text-[#15B097]" />
              <div className="text-left">
                <p className="font-dm-sans text-sm font-semibold text-[#0A0A0A]">{file.name}</p>
                <p className="font-dm-sans text-xs text-[#7F7F7F]">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="ml-4 text-[#7F7F7F] hover:text-[#FF4D00] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <Upload className="w-10 h-10 text-[#7F7F7F]" />
              <p className="font-dm-sans text-sm text-[#7F7F7F]">
                Drag your resume here or <span className="text-[#FF4D00] font-semibold">browse</span>
              </p>
              <p className="font-dm-sans text-xs text-[#B0B0B0]">Supports .pdf and .docx</p>
            </div>
          )}
        </div>

        {/* Editable Fields */}
        <div className="bg-white border border-[#E4E2DD] rounded-2xl p-8 space-y-6">
          <h2 className="font-dm-sans text-lg font-semibold text-[#0A0A0A]">Personal Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-dm-sans text-xs font-medium text-[#7F7F7F]">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F5F3EE] border border-[#E4E2DD] rounded-xl px-4 py-3 font-dm-sans text-sm text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-[#FF4D00]/30 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-dm-sans text-xs font-medium text-[#7F7F7F]">Professional Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#F5F3EE] border border-[#E4E2DD] rounded-xl px-4 py-3 font-dm-sans text-sm text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-[#FF4D00]/30 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-dm-sans text-xs font-medium text-[#7F7F7F]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F5F3EE] border border-[#E4E2DD] rounded-xl px-4 py-3 font-dm-sans text-sm text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-[#FF4D00]/30 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-dm-sans text-xs font-medium text-[#7F7F7F]">Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#F5F3EE] border border-[#E4E2DD] rounded-xl px-4 py-3 font-dm-sans text-sm text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-[#FF4D00]/30 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-dm-sans text-xs font-medium text-[#7F7F7F]">Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#F5F3EE] border border-[#E4E2DD] rounded-xl px-4 py-3 font-dm-sans text-sm text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-[#FF4D00]/30 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-dm-sans text-xs font-medium text-[#7F7F7F]">Professional Summary</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
              className="w-full bg-[#F5F3EE] border border-[#E4E2DD] rounded-xl px-4 py-3 font-dm-sans text-sm text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-[#FF4D00]/30 transition-all resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-dm-sans text-xs font-medium text-[#7F7F7F]">Experience</label>
            {experience.map((exp) => (
              <div key={exp.id} className="bg-[#F5F3EE] border border-[#E4E2DD] rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={exp.company}
                    onChange={(e) => setExperience(prev => prev.map(x => x.id === exp.id ? { ...x, company: e.target.value } : x))}
                    className="bg-white border border-[#E4E2DD] rounded-xl px-4 py-2.5 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4D00]/30 transition-all"
                    placeholder="Company"
                  />
                  <input
                    value={exp.role}
                    onChange={(e) => setExperience(prev => prev.map(x => x.id === exp.id ? { ...x, role: e.target.value } : x))}
                    className="bg-white border border-[#E4E2DD] rounded-xl px-4 py-2.5 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4D00]/30 transition-all"
                    placeholder="Role"
                  />
                </div>
                <input
                  value={exp.duration}
                  onChange={(e) => setExperience(prev => prev.map(x => x.id === exp.id ? { ...x, duration: e.target.value } : x))}
                  className="w-full bg-white border border-[#E4E2DD] rounded-xl px-4 py-2.5 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4D00]/30 transition-all"
                  placeholder="Duration"
                />
                <textarea
                  value={exp.description}
                  onChange={(e) => setExperience(prev => prev.map(x => x.id === exp.id ? { ...x, description: e.target.value } : x))}
                  rows={3}
                  className="w-full bg-white border border-[#E4E2DD] rounded-xl px-4 py-2.5 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4D00]/30 transition-all resize-none"
                  placeholder="Describe your role and achievements"
                />
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="font-dm-sans text-xs font-medium text-[#7F7F7F]">Skills</label>
            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              rows={2}
              className="w-full bg-[#F5F3EE] border border-[#E4E2DD] rounded-xl px-4 py-3 font-dm-sans text-sm text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-[#FF4D00]/30 transition-all resize-none"
              placeholder="Comma-separated skills"
            />
            <p className="font-dm-sans text-xs text-[#B0B0B0]">Separate skills with commas</p>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pb-12">
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-full border border-[#E4E2DD] text-[#7F7F7F] font-dm-sans text-sm font-semibold hover:bg-[#F5F3EE] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button className="px-8 py-3 rounded-full bg-[#FF4D00] text-white font-dm-sans text-sm font-bold hover:bg-[#FF4D00]/90 transition-all shadow-sm cursor-pointer">
            Save Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
