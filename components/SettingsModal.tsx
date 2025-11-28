import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles, BookOpen, Briefcase, Tags } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: { instructions: string; industryName: string; industryExamples: string }) => void;
  currentInstructions: string;
  currentIndustryName: string;
  currentIndustryExamples: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  currentInstructions,
  currentIndustryName,
  currentIndustryExamples
}) => {
  const [instructions, setInstructions] = useState(currentInstructions);
  const [industryName, setIndustryName] = useState(currentIndustryName);
  const [industryExamples, setIndustryExamples] = useState(currentIndustryExamples);

  // Sync state when prop changes or modal opens
  useEffect(() => {
    setInstructions(currentInstructions);
    setIndustryName(currentIndustryName);
    setIndustryExamples(currentIndustryExamples);
  }, [currentInstructions, currentIndustryName, currentIndustryExamples, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
          <div className="flex items-center gap-2 text-primary-700">
            <BookOpen size={24} />
            <h2 className="text-xl font-bold text-gray-900">Analysis Settings</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          
          {/* Section 1: Industry Context */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-800 font-semibold border-b border-gray-100 pb-2">
                <Briefcase size={18} className="text-primary-600"/>
                <h3>Industry Context</h3>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry Name
                </label>
                <input
                    type="text"
                    value={industryName}
                    onChange={(e) => setIndustryName(e.target.value)}
                    placeholder="e.g. SaaS, Construction, Retail, Real Estate"
                    className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Tags size={14} />
                    Specific Terminology / Examples
                </label>
                <textarea
                    value={industryExamples}
                    onChange={(e) => setIndustryExamples(e.target.value)}
                    placeholder="e.g. churn, MRR, seat-license, waterproofing, PSI strength..."
                    className="w-full h-20 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Helping the AI understand your jargon improves transcript accuracy.</p>
            </div>
          </div>

          {/* Section 2: Playbook */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-gray-800 font-semibold border-b border-gray-100 pb-2">
                <Sparkles size={18} className="text-purple-600"/>
                <h3>Coaching Playbook</h3>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom AI Instructions
                </label>
                <div className="relative">
                    <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Tell the AI what to focus on. E.g., 'Check if the rep asked for a referral.'"
                    className="w-full h-32 p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none text-sm leading-relaxed"
                    />
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
                <button 
                    onClick={() => setInstructions(t => t + (t ? " " : "") + "Check for MEDDIC compliance.")}
                    className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors whitespace-nowrap border border-indigo-100"
                >
                    + MEDDIC
                </button>
                <button 
                    onClick={() => setInstructions(t => t + (t ? " " : "") + "Did they mention pricing too early?")}
                    className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors whitespace-nowrap border border-indigo-100"
                >
                    + Pricing Check
                </button>
                <button 
                    onClick={() => setInstructions(t => t + (t ? " " : "") + "Focus on empathy.")}
                    className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors whitespace-nowrap border border-indigo-100"
                >
                    + Empathy
                </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-gray-50 bg-gray-50/30 flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
                onSave({ instructions, industryName, industryExamples });
                onClose();
            }}
            className="px-5 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30 flex items-center gap-2 transition-all"
          >
            <Save size={16} />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};