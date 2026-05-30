// src/components/layout/Logo.tsx
import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex flex-col space-y-1">
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-primary rounded-sm"></div>
          <div className="w-3 h-3 bg-primary rounded-sm"></div>
        </div>
        <div className="w-3 h-3 bg-primary rounded-sm ml-4"></div>
      </div>
      <span className="font-space-mono text-xl font-bold tracking-tighter text-[#0A0A0A] dark:text-white">
        JobJockey
      </span>
    </div>
  );
};

export default Logo;
