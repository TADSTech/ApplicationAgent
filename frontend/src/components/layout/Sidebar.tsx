// frontend/src/components/layout/Sidebar.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  FileText, 
  Bookmark, 
  Settings as SettingsIcon, 
  UploadCloud, 
  HelpCircle, 
  Moon, 
  Bell, 
  MoreHorizontal,
  Columns
} from 'lucide-react';
import { cn } from '../../lib/utils';
import Logo from './Logo';

interface SidebarProps {
  mode: 'auto' | 'manual';
  onModeChange: (mode: 'auto' | 'manual') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mode, onModeChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Navigation items mapping
  const menuItems = [
    { name: 'Find Jobs', path: '/dashboard', icon: Search },
    { name: 'My Applications', path: '/applications', icon: FileText },
    { name: 'Saved Jobs', path: '/saved', icon: Bookmark },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  // Circle properties for ATS Score SVG (expanded state)
  const radius = 24;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const score = 92;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Circle properties for ATS Score SVG (collapsed state)
  const radiusCollapsed = 18;
  const strokeWidthCollapsed = 3;
  const circumferenceCollapsed = 2 * Math.PI * radiusCollapsed;
  const strokeDashoffsetCollapsed = circumferenceCollapsed - (score / 100) * circumferenceCollapsed;

  return (
    <aside 
      className={cn(
        "border-r border-[#E4E2DD] bg-[#FFFFFF] h-screen flex flex-col justify-between transition-all duration-300 shrink-0 z-10",
        isCollapsed ? "w-20 px-3 py-6 items-center" : "w-80 p-6"
      )}
    >
      <div className="flex flex-col space-y-6 w-full items-center">
        {/* Header: Logo and Column Toggle */}
        {!isCollapsed ? (
          <div className="flex justify-between items-center w-full">
            <Logo />
            <button 
              onClick={() => setIsCollapsed(true)}
              className="text-[#7F7F7F] hover:text-[#0A0A0A] transition-colors p-1.5 rounded-md hover:bg-[#F5F3EE] cursor-pointer"
            >
              <Columns className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col space-y-4 items-center w-full">
            {/* Collapsed Logo: only show the squares */}
            <div className="flex flex-col space-y-1">
              <div className="flex space-x-1">
                <div className="w-2.5 h-2.5 bg-[#FF4D00] rounded-sm"></div>
                <div className="w-2.5 h-2.5 bg-[#FF4D00] rounded-sm"></div>
              </div>
              <div className="w-2.5 h-2.5 bg-[#FF4D00] rounded-sm ml-3.5"></div>
            </div>
            
            <button 
              onClick={() => setIsCollapsed(false)}
              className="text-[#7F7F7F] hover:text-[#0A0A0A] transition-colors p-1.5 rounded-md hover:bg-[#F5F3EE] cursor-pointer"
            >
              <Columns className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Mode Toggle Switcher */}
        {!isCollapsed ? (
          <div className="bg-[#F5F3EE] p-1 rounded-full flex relative w-full border border-[#E4E2DD]">
            <button
              onClick={() => onModeChange('auto')}
              className={cn(
                "flex-1 py-2 text-xs font-bold rounded-full transition-all duration-300 cursor-pointer z-10",
                mode === 'auto' 
                  ? "bg-[#FF4D00] text-white shadow-sm" 
                  : "text-[#7F7F7F] hover:text-[#0A0A0A]"
              )}
            >
              Auto Mode
            </button>
            <button
              onClick={() => onModeChange('manual')}
              className={cn(
                "flex-1 py-2 text-xs font-bold rounded-full transition-all duration-300 cursor-pointer z-10",
                mode === 'manual' 
                  ? "bg-[#FF4D00] text-white shadow-sm" 
                  : "text-[#7F7F7F] hover:text-[#0A0A0A]"
              )}
            >
              Manual Mode
            </button>
          </div>
        ) : (
          <div className="bg-[#F5F3EE] p-0.5 rounded-full flex flex-col items-center border border-[#E4E2DD] w-8">
            <button
              onClick={() => onModeChange('auto')}
              className={cn(
                "w-7 h-7 flex items-center justify-center text-[10px] font-bold rounded-full transition-all duration-300 cursor-pointer",
                mode === 'auto' 
                  ? "bg-[#FF4D00] text-white shadow-sm" 
                  : "text-[#7F7F7F] hover:text-[#0A0A0A]"
              )}
              title="Auto Mode"
            >
              A
            </button>
            <button
              onClick={() => onModeChange('manual')}
              className={cn(
                "w-7 h-7 flex items-center justify-center text-[10px] font-bold rounded-full transition-all duration-300 cursor-pointer",
                mode === 'manual' 
                  ? "bg-[#FF4D00] text-white shadow-sm" 
                  : "text-[#7F7F7F] hover:text-[#0A0A0A]"
              )}
              title="Manual Mode"
            >
              M
            </button>
          </div>
        )}

        {/* ATS Score Card */}
        {!isCollapsed ? (
          <div className="border border-[#E4E2DD] bg-[#FFFFFF] rounded-2xl p-5 flex flex-col items-center text-center shadow-sm w-full">
            {/* Circular Progress Bar */}
            <div className="relative flex items-center justify-center mb-3">
              <svg className="w-16 h-16 transform -rotate-90">
                {/* Background Track */}
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  className="stroke-[#F5F3EE]"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                {/* Foreground Track */}
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  className="stroke-[#FF4D00]"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute font-space-mono text-lg font-bold text-[#0A0A0A]">
                {score}
              </span>
            </div>

            <h4 className="font-dm-sans text-sm font-semibold text-[#0A0A0A] mb-0.5">
              ATS Score
            </h4>
            <span className="font-dm-sans text-[11px] text-[#7F7F7F] truncate w-full px-2">
              Resume_Final_v2.pdf
            </span>
          </div>
        ) : (
          <div 
            className="relative flex items-center justify-center py-2" 
            title="ATS Score: 92% (Resume_Final_v2.pdf)"
          >
            <svg className="w-12 h-12 transform -rotate-90">
              {/* Background Track */}
              <circle
                cx="24"
                cy="24"
                r={radiusCollapsed}
                className="stroke-[#F5F3EE]"
                strokeWidth={strokeWidthCollapsed}
                fill="transparent"
              />
              {/* Foreground Track */}
              <circle
                cx="24"
                cy="24"
                r={radiusCollapsed}
                className="stroke-[#FF4D00]"
                strokeWidth={strokeWidthCollapsed}
                strokeDasharray={circumferenceCollapsed}
                strokeDashoffset={strokeDashoffsetCollapsed}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute font-space-mono text-xs font-bold text-[#0A0A0A]">
              {score}
            </span>
          </div>
        )}

        {/* Navigation Menu */}
        {!isCollapsed ? (
          <nav className="flex flex-col space-y-1.5 pt-2 w-full">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
              const Icon = item.icon;
              
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex items-center space-x-3.5 px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer w-full text-left font-dm-sans",
                    isActive
                      ? "bg-[#FFF0EA] text-[#FF4D00]"
                      : "text-[#444444] hover:bg-[#F5F3EE] hover:text-[#0A0A0A]"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-[#FF4D00]" : "text-[#7F7F7F]")} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        ) : (
          <nav className="flex flex-col space-y-2.5 pt-2 items-center w-full">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
              const Icon = item.icon;
              
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-[#FFF0EA] text-[#FF4D00]"
                      : "text-[#444444] hover:bg-[#F5F3EE] hover:text-[#0A0A0A]"
                  )}
                  title={item.name}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-[#FF4D00]" : "text-[#7F7F7F]")} />
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {/* Footer Area: Update Resume & Tool Bar */}
      <div className="flex flex-col space-y-5 w-full items-center">
        {/* Update Resume Action */}
        {!isCollapsed ? (
          <button className="bg-[#0A0A0A] hover:bg-[#222222] text-white py-4 px-6 rounded-[20px] text-sm font-bold flex items-center justify-center space-x-2 transition-all duration-200 shadow-md cursor-pointer w-full font-dm-sans">
            <UploadCloud className="w-5 h-5" />
            <span>Update Resume</span>
          </button>
        ) : (
          <button 
            className="bg-[#0A0A0A] hover:bg-[#222222] text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer"
            title="Update Resume"
          >
            <UploadCloud className="w-5 h-5" />
          </button>
        )}

        {/* Tool Bar */}
        {!isCollapsed ? (
          <div className="flex justify-between items-center px-2 text-[#7F7F7F] w-full">
            <button className="hover:text-[#0A0A0A] transition-colors cursor-pointer p-1 rounded hover:bg-[#F5F3EE]">
              <HelpCircle className="w-5 h-5" />
            </button>
            <button className="hover:text-[#0A0A0A] transition-colors cursor-pointer p-1 rounded hover:bg-[#F5F3EE]">
              <Moon className="w-5 h-5" />
            </button>
            <button className="hover:text-[#0A0A0A] transition-colors cursor-pointer p-1 rounded hover:bg-[#F5F3EE]">
              <Bell className="w-5 h-5" />
            </button>
            <button className="hover:text-[#0A0A0A] transition-colors cursor-pointer p-1 rounded hover:bg-[#F5F3EE]">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col space-y-3.5 items-center text-[#7F7F7F] w-full">
            <button className="hover:text-[#0A0A0A] transition-colors cursor-pointer p-1 rounded hover:bg-[#F5F3EE]" title="Help">
              <HelpCircle className="w-5 h-5" />
            </button>
            <button className="hover:text-[#0A0A0A] transition-colors cursor-pointer p-1 rounded hover:bg-[#F5F3EE]" title="Toggle Theme">
              <Moon className="w-5 h-5" />
            </button>
            <button className="hover:text-[#0A0A0A] transition-colors cursor-pointer p-1 rounded hover:bg-[#F5F3EE]" title="Notifications">
              <Bell className="w-5 h-5" />
            </button>
            <button className="hover:text-[#0A0A0A] transition-colors cursor-pointer p-1 rounded hover:bg-[#F5F3EE]" title="More">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
