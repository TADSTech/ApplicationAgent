// src/pages/Onboarding.tsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { Card } from '../components/ui/Card';
import { Upload, Wand2, Settings, Hand, FileText, X } from 'lucide-react';

// Step 1: Resume Drop
const Step1Resume: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: false,
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Drop in your resume</h1>
        <p className="text-muted-foreground mt-2">We will use this to help you get started</p>
      </div>
      <Card className="p-8">
        {!uploadedFile ? (
          <div {...getRootProps()} className={`border-2 border-dashed border-primary/50 rounded-lg text-center p-12 cursor-pointer transition-colors ${isDragActive ? 'bg-primary/20' : 'bg-primary/10 hover:bg-primary/20'}`}>
            <input {...getInputProps()} />
            <div className="flex justify-center mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <p className="font-semibold text-primary">Drag your resume here</p>
            <p className="text-sm text-primary/80 mt-1">or <span className="font-bold underline">browse files</span></p>
          </div>
        ) : (
          <div className="bg-green-50 border-2 border-dashed border-green-500 rounded-lg p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FileText className="w-8 h-8 text-green-700" />
              <div>
                <p className="font-semibold text-green-800">{uploadedFile.name}</p>
                <p className="text-xs text-green-600">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <button onClick={() => setUploadedFile(null)} className="p-1 rounded-full hover:bg-green-200">
              <X className="w-5 h-5 text-green-700" />
            </button>
          </div>
        )}
        <div className="mt-6 flex items-start space-x-4 bg-[#F5F3EE] p-4 rounded-lg">
          <Wand2 className="w-5 h-5 text-yellow-500 mt-1" />
          <div>
            <h4 className="font-bold text-sm">Intelligent Extraction</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Our AI will automatically parse your experience, skills, and education to build your dynamic candidate profile instantly.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Step 2: Work Mode
const Step2WorkMode: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
    const [selectedMode, setSelectedMode] = useState<'auto' | 'swipe'>('auto');

    return(
        <div className="w-full max-w-2xl mx-auto">
            <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight">Pick how you want to work</h1>
            <p className="text-muted-foreground mt-2">You can switch anytime from the nav.</p>
            </div>
            <div className="grid grid-cols-2 gap-8">
            <Card 
                className={`p-6 cursor-pointer transition-all duration-300 relative ${selectedMode === 'auto' ? 'border-primary ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}`}
                onClick={() => setSelectedMode('auto')}
            >
                {selectedMode === 'auto' && (
                <div className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full absolute top-[10px] right-[10px]">Recommended</div>
                )}
                <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-teal-100 rounded-lg"><Settings className="w-6 h-6 text-teal-600" /></div>
                <h3 className="text-xl font-bold">Auto Mode</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                Agents scan jobs, tailor your resume, and flag legal risks — you approve each step.
                </p>
            </Card>
            <Card 
                className={`p-6 cursor-pointer transition-all duration-300 ${selectedMode === 'swipe' ? 'border-primary ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}`}
                onClick={() => setSelectedMode('swipe')}
            >
                <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-red-100 rounded-lg"><Hand className="w-6 h-6 text-red-600" /></div>
                <h3 className="text-xl font-bold">Swipe Mode</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                Jobs show as swipeable cards. AI cover letter pre-drafted. You swipe to apply, save, or pass.
                </p>
            </Card>
            </div>
        </div>
    )
};

// Step 3: Agent Ready
const Step3AgentReady: React.FC = () => {
    const navigate = useNavigate();
    return(
        <div className="w-full max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Your agent is ready.</h1>
            <p className="text-muted-foreground mt-4 max-w-sm mx-auto">
            JobJockey will find, tailor, and review jobs — you just approve.
            </p>
            <Button size="xl" className="mt-8" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
            </Button>
        </div>
    )
};


export const Onboarding: React.FC = () => {
      const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const handleContinue = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1Resume onContinue={handleContinue} />;
      case 2:
        return <Step2WorkMode onContinue={handleContinue} />;
      case 3:
        return <Step3AgentReady />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#FBF9F4] font-dm-sans">
      <Header step={step} totalSteps={totalSteps} />
      
      <div className="w-full max-w-3xl mx-auto mt-24">
        <Progress value={(step / totalSteps) * 100} className="h-1 bg-[#E4E2DD]" />
      </div>

      <main className="flex-1 flex flex-col justify-center items-center p-8">
        {renderStep()}
      </main>

      {step < totalSteps && (
        <footer className="w-full border-t border-[#E4E2DD] p-6 flex justify-between items-center bg-white">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>Skip for now</Button>
            <Button size="lg" onClick={handleContinue}>
            Continue
            </Button>
        </footer>
      )}
    </div>
  );
};

export default Onboarding;
