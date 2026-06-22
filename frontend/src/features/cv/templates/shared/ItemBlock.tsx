import React, { useState } from 'react';
import { Plus, ArrowDown } from 'lucide-react';

export interface ItemBlockProps {
  children: React.ReactNode;
  mode: 'editor' | 'preview';
  onDelete?: () => void;
  onMoveDown?: () => void;
  onAdd?: () => void;
  canMoveDown?: boolean;
}

export function ItemBlock({ children, mode, onDelete, onMoveDown, onAdd, canMoveDown }: ItemBlockProps) {
  const [hovered, setHovered] = useState(false);

  if (mode === 'preview') {
    return <div className="mb-4">{children}</div>;
  }

  return (
    <div
      className="relative mb-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div className="absolute -right-1 -top-7 flex items-center gap-0.5 z-40">
          {onMoveDown && (
            <button onClick={onMoveDown} disabled={!canMoveDown} className={`px-1.5 py-0.5 bg-gray-600 text-white text-[10px] rounded ${!canMoveDown ? 'opacity-40' : 'hover:bg-gray-700'}`}>
              <ArrowDown size={10} />
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="px-2 py-0.5 bg-red-500 text-white text-[10px] rounded hover:bg-red-600 font-medium">Xóa</button>
          )}
          {onAdd && (
            <button onClick={onAdd} className="px-2 py-0.5 bg-[#00B14F] text-white text-[10px] rounded hover:bg-[#009643] font-medium flex items-center gap-0.5">
              <Plus size={10} /> Thêm
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
