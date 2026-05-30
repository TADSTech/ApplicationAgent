import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, X, ArrowLeft, Save, Loader2, Upload as UploadIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useResume } from '@/context/ResumeContext';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/services/api';
import { useModal, SimpleModal } from '../ui/Modal';

interface ResumeEditorProps {
  onBack: () => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ onBack }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState(false);
  const [parsing, setParsing] = useState(false);

  // Get context
  const { user } = useAuth();
  const { resume, uploadResume, setParsedProfile } = useResume();
  const { openModal } = useModal();

  // Remove default data - start with empty fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [experience, setExperience] = useState([
    {
      id: 1,
      company: '',
      role: '',
      duration: '',
      description: '',
    },
  ]);
  const [skills, setSkills] = useState('');

  // Auto-fill from context if we have a parsed profile
  useEffect(() => {
    if (resume.parsedProfile) {
      const p = resume.parsedProfile;
      setName(p.full_name || '');
      setEmail(p.email || user?.email || '');
      setPhone(p.phone || '');
      setLocation(p.location || '');
      setTitle(p.current_title || '');
      setSkills(p.skills?.join(', ') || '');
      // For experience, we'd need more parsing - for now, we'll leave as is
    } else if (resume.hasResume) {
      // If we have a resume but not parsed, pre-fill email from user
      setEmail(user?.email || '');
    }
  }, [resume.parsedProfile, resume.hasResume, user?.email]);

  // Auto-fill from mock content if we just uploaded
  useEffect(() => {
    if (resume.hasResume && resume.resumeContent && !resume.parsedProfile) {
      handleAutoFillFromResume();
    }
  }, [resume.hasResume]);

  const handleAutoFillFromResume = async () => {
    if (!resume.resumeContent) return;
    setParsing(true);
    try {
      const parsedData = await apiClient.parseResume(
        resume.resumeContent,
        user?.email || 'demo_user'
      );
      setParsedProfile(parsedData);
      // Fill fields
      setName(parsedData.full_name || '');
      setEmail(parsedData.email || user?.email || '');
      setPhone(parsedData.phone || '');
      setLocation(parsedData.location || '');
      setTitle(parsedData.current_title || '');
      setSkills(parsedData.skills?.join(', ') || '');
    } catch (error) {
      console.error('Failed to parse resume:', error);
    } finally {
      setParsing(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.type.includes('pdf') || dropped.name.endsWith('.docx'))) {
      setFile(dropped);
      // TODO: Parse file and populate fields
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      // TODO: Parse file and populate fields
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Save to Firebase
      await new Promise(resolve => setTimeout(resolve, 1000));
      openModal(
        <SimpleModal
          title="Success!"
          message="Resume saved successfully!"
        />
      );
    } catch (error) {
      openModal(
        <SimpleModal
          title="Error"
          message="Failed to save resume. Please try again."
        />
      );
    } finally {
      setSaving(false);
    }
  };

  const addExperience = () => {
    setExperience([
      ...experience,
      {
        id: Date.now(),
        company: '',
        role: '',
        duration: '',
        description: '',
      },
    ]);
  };

  const removeExperience = (id: number) => {
    if (experience.length > 1) {
      setExperience(experience.filter(exp => exp.id !== id));
    }
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
          {/* Auto-fill button */}
          {resume.hasResume && (
            <button
              onClick={handleAutoFillFromResume}
              disabled={parsing}
              className="w-full md:w-auto flex items-center space-x-2 px-6 py-3 rounded-full border border-[#E4E2DD] text-[#0A0A0A] font-dm-sans text-sm font-semibold hover:bg-[#F5F3EE] transition-all cursor-pointer disabled:opacity-50"
            >
              {parsing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Parsing...</span>
                </>
              ) : (
                <>
                  <UploadIcon className="w-4 h-4" />
                  <span>Auto-fill from Resume</span>
                </>
              )}
            </button>
          )}
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
            {experience.map((exp, idx) => (
              <div key={exp.id} className="bg-[#F5F3EE] border border-[#E4E2DD] rounded-xl p-4 space-y-3 relative">
                {experience.length > 1 && (
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="absolute top-2 right-2 text-[#7F7F7F] hover:text-[#FF4D00] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
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
                  placeholder="Duration (e.g., 2022 - Present)"
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
            <button
              onClick={addExperience}
              className="w-full border-2 border-dashed border-[#E4E2DD] rounded-xl px-4 py-3 text-sm text-[#7F7F7F] hover:text-[#FF4D00] hover:border-[#FF4D00]/30 transition-all font-dm-sans font-medium"
            >
              + Add Experience
            </button>
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
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 rounded-full bg-[#FF4D00] text-white font-dm-sans text-sm font-bold hover:bg-[#FF4D00]/90 transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Resume</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
