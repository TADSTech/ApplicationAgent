import React from 'react';
import { useLocation, Link } from 'react-router-dom';

interface HeaderProps {
  step?: number;
  totalSteps?: number;
}

export const Header: React.FC<HeaderProps> = ({ step, totalSteps }) => {
  const location = useLocation();
  const isSigninPage = location.pathname === '/signin';

  return (
    <header className="p-8 absolute top-0 left-0 right-0 z-20 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className="flex flex-col space-y-1">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-primary rounded-sm"></div>
            <div className="w-3 h-3 bg-primary rounded-sm"></div>
          </div>
          <div className="w-3 h-3 bg-primary rounded-sm ml-4"></div>
        </div>
        <span className="font-space-mono text-xl font-bold tracking-tighter text-white mix-blend-difference">
          JobJockey
        </span>
      </div>
      
      {step && totalSteps ? (
        <div className="text-sm p-4 text-muted-foreground font-medium">
          Step {step} of {totalSteps}
        </div>
      ) : (
        <div className="text-sm p-4 text-muted-foreground font-medium">
          {isSigninPage ? "Don't have an account?" : "Already have an account?"}
          <Link to={isSigninPage ? "/signup" : "/signin"} className="font-bold text-primary ml-2 hover:underline">
            {isSigninPage ? "Sign up" : "Sign in"}
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;

