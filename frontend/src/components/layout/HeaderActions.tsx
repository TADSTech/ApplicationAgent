// src/components/layout/HeaderActions.tsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

interface HeaderActionsProps {
  step?: number;
  totalSteps?: number;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({ step, totalSteps }) => {
  const location = useLocation();
  const isSigninPage = location.pathname === '/signin';

  return (
    <>
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
    </>
  );
};

export default HeaderActions;
