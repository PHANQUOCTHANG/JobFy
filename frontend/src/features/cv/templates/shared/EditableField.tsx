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
        <div className="absolute -top-9 left-0 z-50">
          <RichTextToolbar color={color} font={font} />
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
