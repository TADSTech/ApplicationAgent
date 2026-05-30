import React, { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

interface DropdownItem {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface DropdownMenuProps {
  items: DropdownItem[];
  onClose: () => void;
  className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ items, onClose, className }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className={cn(
        'absolute right-0 top-full mt-2 z-50 min-w-[200px] bg-white border border-[#E4E2DD] rounded-xl shadow-xl overflow-hidden',
        'animate-in fade-in slide-in-from-top-2 duration-200',
        className
      )}
    >
      <div className="py-1.5">
        {items.map((item, i) => {
          const Icon = item.icon;
          const isDanger = item.variant === 'danger';

          return (
            <button
              key={i}
              onClick={() => {
                item.onClick();
                onClose();
              }}
              className={cn(
                'flex items-center space-x-3 w-full px-4 py-2.5 text-sm font-medium transition-colors font-dm-sans',
                isDanger
                  ? 'text-destructive hover:bg-red-50'
                  : 'text-[#444444] hover:bg-[#F5F3EE] hover:text-[#0A0A0A]'
              )}
            >
              <Icon className={cn(
                'w-4 h-4',
                isDanger ? 'text-destructive' : 'text-[#7F7F7F]'
              )} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DropdownMenu;
