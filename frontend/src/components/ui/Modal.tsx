import React, { createContext, useContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalContextType {
  isOpen: boolean;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);

  const openModal = useCallback((newContent: React.ReactNode) => {
    setContent(newContent);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setContent(null);
  }, []);

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      {isOpen && content && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-[#E4E2DD]">
            {content}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface SimpleModalProps {
  title: string;
  message: string;
  onClose?: () => void;
  primaryButtonText?: string;
  onPrimaryButtonClick?: () => void;
  secondaryButtonText?: string;
  onSecondaryButtonClick?: () => void;
}

export const SimpleModal: React.FC<SimpleModalProps> = ({ 
  title, 
  message, 
  onClose,
  primaryButtonText = "Close", 
  onPrimaryButtonClick,
  secondaryButtonText,
  onSecondaryButtonClick,
}) => {
  const { closeModal } = useModal();
  
  const handleClose = () => {
    onClose?.();
    closeModal();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#0A0A0A] font-dm-sans">{title}</h3>
        <button 
          onClick={handleClose}
          className="text-[#7F7F7F] hover:text-[#0A0A0A] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <p className="text-[#444444] mb-6 font-dm-sans">{message}</p>
      <div className="flex gap-3 justify-end">
        {secondaryButtonText && onSecondaryButtonClick && (
          <button
            onClick={() => { onSecondaryButtonClick(); handleClose(); }}
            className="px-4 py-2 rounded-full text-sm font-semibold text-[#7F7F7F] hover:bg-[#F5F3EE] transition-colors"
          >
            {secondaryButtonText}
          </button>
        )}
        <button
          onClick={() => { onPrimaryButtonClick?.(); handleClose(); }}
          className="px-6 py-2 rounded-full text-sm font-bold bg-[#FF4D00] text-white hover:bg-[#FF4D00]/90 transition-colors"
        >
          {primaryButtonText}
        </button>
      </div>
    </div>
  );
};
