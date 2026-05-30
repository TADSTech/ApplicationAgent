import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ParsedProfile {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedInUrl?: string;
  gitHubUrl?: string;
  timezone?: string;
}

interface Resume {
  hasResume: boolean;
  resumeName: string;
  atsScore: number;
  resumeContent?: string;
  parsedProfile?: ParsedProfile;
}

interface ResumeContextType {
  resume: Resume;
  setResume: (resume: Partial<Resume>) => void;
  uploadResume: (name: string, score: number, content?: string) => void;
  setParsedProfile: (profile: ParsedProfile) => void;
}

const DEFAULT_RESUME: Resume = {
  hasResume: false,
  resumeName: '',
  atsScore: 0,
  resumeContent: '',
  parsedProfile: undefined,
};

const ResumeContext = createContext<ResumeContextType>({
  resume: DEFAULT_RESUME,
  setResume: () => {},
  uploadResume: () => {},
  setParsedProfile: () => {},
});

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [resume, setResumeState] = useState<Resume>(DEFAULT_RESUME);

  const setResume = (partialResume: Partial<Resume>) => {
    setResumeState(prev => ({ ...prev, ...partialResume }));
  };

  const uploadResume = (name: string, score: number, content?: string) => {
    setResumeState({
      hasResume: true,
      resumeName: name,
      atsScore: score,
      resumeContent: content,
      parsedProfile: undefined,
    });
  };

  const setParsedProfile = (profile: ParsedProfile) => {
    setResumeState(prev => ({
      ...prev,
      parsedProfile: profile,
    }));
  };

  return (
    <ResumeContext.Provider value={{ resume, setResume, uploadResume, setParsedProfile }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => useContext(ResumeContext);
