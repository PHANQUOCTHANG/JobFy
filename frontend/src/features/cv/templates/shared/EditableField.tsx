import React, { useRef, useState, useEffect } from 'react';
import { RichTextToolbar } from './RichTextToolbar';

export interface EditableFieldProps {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  className?: string;
  color: string;
  font: string;
  multiline?: boolean;
  mode: 'editor' | 'preview';
  
  // AI Feature
  showAiButton?: boolean;
  onAiClick?: () => void;
  isAiLoading?: boolean;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onChange,
  placeholder,
  style,
  className,
  color,
  font,
  multiline = false,
  mode,
  showAiButton = false,
  onAiClick,
  isAiLoading = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  // Sync value to DOM only when not focused (to avoid cursor jumping)
  useEffect(() => {
    if (mode === 'editor' && !focused && ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || '';
    }
  }, [value, focused, mode]);

  // Set initial content
  useEffect(() => {
    if (mode === 'editor' && ref.current && !ref.current.innerHTML) {
      ref.current.innerHTML = value || '';
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  if (mode === 'preview') {
    return (
      <div
        className={`${className || ''}`}
        style={{
          ...style,
          minHeight: multiline ? 20 : 'auto',
          whiteSpace: multiline ? 'pre-wrap' : 'normal',
        }}
        dangerouslySetInnerHTML={{ __html: value || '' }}
      />
    );
  }

  // mode === 'editor'
  return (
    <div className={`relative group/editable ${className || ''}`}>
      {focused && (
        <div className="absolute -top-9 left-0 z-50 flex items-center gap-2">
          <RichTextToolbar color={color} font={font} />
          {showAiButton && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onAiClick) onAiClick();
              }}
              disabled={isAiLoading}
              className={`flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded shadow text-[12px] font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all ${isAiLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isAiLoading ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              )}
              AI Viết giúp
            </button>
          )}
        </div>
      )}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          if (onChange) {
            onChange(ref.current?.innerHTML || '');
          }
        }}
        className="outline-none"
        style={{
          ...style,
          border: focused ? `1.5px solid ${color}` : '1.5px solid transparent',
          borderRadius: 3,
          padding: '2px 4px',
          margin: '-2px -4px', // compensate for padding to keep alignment
          minHeight: multiline ? 36 : 'auto',
          cursor: 'text',
          transition: 'border-color 0.15s',
          whiteSpace: multiline ? 'pre-wrap' : 'normal',
          wordBreak: 'break-word'
        }}
        data-placeholder={placeholder}
      />
      {!focused && !value && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ ...style, color: '#bbb', padding: '0', fontStyle: 'italic', margin: 0, border: 'none' }}
        >
          {placeholder}
        </div>
      )}
    </div>
  );
};
