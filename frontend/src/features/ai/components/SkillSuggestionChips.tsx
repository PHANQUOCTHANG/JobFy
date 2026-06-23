import React from 'react';
import { Plus, X } from 'lucide-react';

interface SkillSuggestionChipsProps {
  skills: string[];
  onAdd: (skill: string) => void;
  onDismiss: () => void;
  className?: string;
}

export const SkillSuggestionChips: React.FC<SkillSuggestionChipsProps> = ({ skills, onAdd, onDismiss, className = '' }) => {
  if (!skills || skills.length === 0) return null;

  return (
    <div className={`mt-3 p-3 bg-purple-50 border border-purple-100 rounded-lg relative animate-in fade-in zoom-in duration-300 ${className}`}>
      <button 
        onClick={onDismiss}
        className="absolute top-2 right-2 text-purple-400 hover:text-purple-600 transition-colors"
        title="Đóng gợi ý"
      >
        <X size={14} />
      </button>
      
      <div className="text-[12px] font-semibold text-purple-800 mb-2 flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
        AI Gợi ý kỹ năng cho bạn:
      </div>
      
      <div className="flex flex-wrap gap-1.5 pr-4">
        {skills.map((skill, idx) => (
          <button
            key={idx}
            onClick={() => onAdd(skill)}
            className="group flex items-center gap-1 px-2.5 py-1 bg-white border border-purple-200 text-purple-700 text-[11px] font-medium rounded-full hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all shadow-sm"
          >
            {skill}
            <Plus size={10} className="text-purple-400 group-hover:text-white" />
          </button>
        ))}
      </div>
    </div>
  );
};
