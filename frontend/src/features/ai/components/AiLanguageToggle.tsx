import React from 'react';
import { AiLanguage } from '../types';

interface AiLanguageToggleProps {
  language: AiLanguage;
  onChange: (lang: AiLanguage) => void;
  className?: string;
}

export const AiLanguageToggle: React.FC<AiLanguageToggleProps> = ({ language, onChange, className = '' }) => {
  return (
    <div className={`flex items-center bg-gray-100 rounded-md p-0.5 border border-gray-200 ${className}`}>
      <button
        onClick={() => onChange('vi')}
        className={`px-2 py-0.5 text-xs font-medium rounded-sm transition-colors ${
          language === 'vi' 
            ? 'bg-white text-gray-800 shadow-sm' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
        title="Tiếng Việt"
      >
        🇻🇳 VI
      </button>
      <button
        onClick={() => onChange('en')}
        className={`px-2 py-0.5 text-xs font-medium rounded-sm transition-colors ${
          language === 'en' 
            ? 'bg-white text-gray-800 shadow-sm' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
        title="English"
      >
        🇺🇸 EN
      </button>
    </div>
  );
};
