import React from 'react';
import { Mic, Activity, Settings } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-lg text-white">
              <Mic size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-none">SalesIQ</h1>
              <span className="text-xs text-primary-600 font-medium">AI Coaching Platform</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="hidden sm:flex items-center gap-1">
              <Activity size={16} />
              <span>Powered by Gemini 2.5 Flash</span>
            </div>
            <button 
              onClick={onOpenSettings}
              className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"
              title="Custom Playbook Settings"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};