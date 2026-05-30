import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { Search, FileText, ShieldCheck } from 'lucide-react';

export const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] flex flex-col items-center justify-center px-6 font-dm-sans">
      {/* Logo Section */}
      <div className="flex items-center space-x-3 mb-12">
        <div className="flex flex-col space-y-1">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-[#FF4D00] rounded-sm"></div>
            <div className="w-3 h-3 bg-[#FF4D00] rounded-sm"></div>
          </div>
          <div className="w-3 h-3 bg-[#FF4D00] rounded-sm ml-4"></div>
        </div>
        <span className="text-2xl font-bold text-[#0A0A0A]">JobJockey</span>
      </div>

      {/* Main Content */}
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-bold text-[#0A0A0A] mb-4">
          Your global career, simplified
        </h1>
        <p className="text-[#7F7F7F] mb-10">
          AI-powered tools to help you find, apply, and succeed in remote roles worldwide.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white border border-[#E4E2DD] rounded-2xl p-5 text-left">
            <Search className="w-6 h-6 text-[#FF4D00] mb-3" />
            <h3 className="font-bold text-[#0A0A0A] text-sm mb-1">Job Scout</h3>
            <p className="text-xs text-[#7F7F7F]">Find matching remote roles</p>
          </div>

          <div className="bg-white border border-[#E4E2DD] rounded-2xl p-5 text-left">
            <FileText className="w-6 h-6 text-[#FF4D00] mb-3" />
            <h3 className="font-bold text-[#0A0A0A] text-sm mb-1">Resume Tailor</h3>
            <p className="text-xs text-[#7F7F7F]">Optimize for global standards</p>
          </div>

          <div className="bg-white border border-[#E4E2DD] rounded-2xl p-5 text-left">
            <ShieldCheck className="w-6 h-6 text-[#FF4D00] mb-3" />
            <h3 className="font-bold text-[#0A0A0A] text-sm mb-1">Contract Review</h3>
            <p className="text-xs text-[#7F7F7F]">Safe, smart contract checks</p>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleGoogleSignIn}
          variant="default"
          size="xl"
          className="w-full max-w-xs flex items-center justify-center space-x-3 bg-[#0A0A0A] hover:bg-[#333] text-white py-5 rounded-full shadow-md cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 18 18">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
            <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.712s.102-1.172.282-1.712V4.956H.957a8.996 8.996 0 000 8.088l3.007-2.332z" fill="#FBBC05" />
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.582C13.463.891 11.426 0 9 0 5.483 0 2.443 2.043.957 4.956L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335" />
          </svg>
          <span className="font-bold text-sm">Continue with Google</span>
        </Button>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-xs text-[#7F7F7F]">
        <p>© 2026 JobJockey</p>
      </footer>
    </div>
  );
};

export default Welcome;
