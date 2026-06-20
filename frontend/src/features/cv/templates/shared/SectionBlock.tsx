import React, { useState } from 'react';
import { ArrowUp, ArrowDown, GripVertical } from 'lucide-react';

export interface SectionBlockProps {
  title: string;
  color: string;
  mode: 'editor' | 'preview';
  variant?: 'line' | 'underline' | 'bold-line' | 'background' | 'none';
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  style?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
}

export function SectionBlock({
  title,
  color,
  mode,
  variant = 'line',
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
  style,
  titleStyle
}: SectionBlockProps) {
  const [hovered, setHovered] = useState(false);

  const renderDivider = () => {
    switch (variant) {
      case 'line':
        return <div style={{ height: 2, background: color, width: '100%' }} />;
      case 'underline':
        return <div style={{ height: 1, borderBottom: `2px dashed ${color}60`, width: '100%' }} />;
      case 'bold-line':
        return <div style={{ height: 3, background: '#222', width: '100%' }} />;
      case 'background':
        return null; // Title handles background
      case 'none':
      default:
        return null;
    }
  };

  const isBgVariant = variant === 'background';

  return (
    <div
      className="relative mb-2"
      style={style}
      onMouseEnter={() => mode === 'editor' && setHovered(true)}
      onMouseLeave={() => mode === 'editor' && setHovered(false)}
    >
      {/* Section controls - top left */}
      {hovered && mode === 'editor' && (
        <div className="absolute -left-1 -top-7 flex items-center gap-0.5 z-40">
          <button className="px-1.5 py-0.5 bg-gray-600 text-white text-[10px] rounded cursor-grab active:cursor-grabbing" title="Kéo để sắp xếp">
            <GripVertical size={10} />
          </button>
          <button onClick={onMoveUp} disabled={!canMoveUp} className={`px-1.5 py-0.5 bg-gray-600 text-white text-[10px] rounded ${!canMoveUp ? 'opacity-40' : 'hover:bg-gray-700'}`}>
            <ArrowUp size={10} />
          </button>
          <button onClick={onMoveDown} disabled={!canMoveDown} className={`px-1.5 py-0.5 bg-gray-600 text-white text-[10px] rounded ${!canMoveDown ? 'opacity-40' : 'hover:bg-gray-700'}`}>
            <ArrowDown size={10} />
          </button>
          {onDelete && (
            <button onClick={onDelete} className="px-2 py-0.5 bg-red-500 text-white text-[10px] rounded hover:bg-red-600 font-medium">Xóa</button>
          )}
        </div>
      )}
      <div style={{
        fontWeight: 700,
        fontSize: 13,
        color: isBgVariant ? '#fff' : color,
        textTransform: 'uppercase',
        marginBottom: 4,
        background: isBgVariant ? color : 'transparent',
        padding: isBgVariant ? '4px 8px' : 0,
        borderRadius: isBgVariant ? 4 : 0,
        ...titleStyle
      }}>
        {title}
      </div>
      {renderDivider()}
    </div>
  );
}
