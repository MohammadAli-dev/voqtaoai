import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles, BookOpen } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (instructions: string) => void;
  currentInstructions: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentInstructions }) => {
  const [text, setText] = useState(currentInstructions);

  // Sync state when prop changes or modal opens
  useEffect(() => {
    setText(currentInstructions);
  }, [currentInstructions, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2 text-primary-700">
            <BookOpen size={24} />
            <h2 className="text-xl font-bold text-gray-900">Custom Playbook</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-4">
            Tell the AI exactly what to look for in your calls. These instructions will guide the coaching feedback and scoring.
          </p>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            AI Instructions
          </label>
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., Focus on whether the rep used the MEDDIC framework. Did they identify the Economic Buyer? Check if they mentioned our new security features."
              className="w-full h-40 p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none text-sm leading-relaxed"
            />
            <div className="absolute bottom-3 right-3 text-gray-300">
                <Sparkles size={16} />
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            <button 
                onClick={() => setText(t => t + (t ? " " : "") + "Check for MEDDIC framework compliance.")}
                className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors whitespace-nowrap border border-indigo-100"
            >
                + MEDDIC
            </button>
            <button 
                onClick={() => setText(t => t + (t ? " " : "") + "Did they mention pricing too early?")}
                className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors whitespace-nowrap border border-indigo-100"
            >
                + Pricing Check
            </button>
             <button 
                onClick={() => setText(t => t + (t ? " " : "") + "Focus on empathy and active listening.")}
                className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors whitespace-nowrap border border-indigo-100"
            >
                + Empathy
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-2 border-t border-gray-50 bg-gray-50/30 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
                onSave(text);
                onClose();
            }}
            className="px-5 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30 flex items-center gap-2 transition-all"
          >
            <Save size={16} />
            Save Playbook
          </button>
        </div>
      </div>
    </div>
  );
};