import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, SlidersHorizontal } from 'lucide-react';

export interface FilterType {
  id: string;
  label: string;
}

export interface QuickFilterOption {
  label: string;
  value: string | number;
}

interface SectionFilterBarProps {
  filterTypes: FilterType[];
  activeFilterType: string;
  onFilterTypeChange: (typeId: string) => void;
  quickOptions: QuickFilterOption[];
  activeQuickValue: string | number;
  onQuickOptionSelect: (value: string | number) => void;
  accentColor?: string; // e.g. '#4F46E5' or '#10b981'
}

export const SectionFilterBar: React.FC<SectionFilterBarProps> = ({
  filterTypes,
  activeFilterType,
  onFilterTypeChange,
  quickOptions,
  activeQuickValue,
  onQuickOptionSelect,
  accentColor = '#4F46E5',
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const activeLabel = filterTypes.find(t => t.id === activeFilterType)?.label ?? '';

  return (
    <div className="flex items-center gap-3 w-full min-w-0">
      {/* Filter Type Dropdown */}
      <div ref={dropdownRef} className="relative flex-shrink-0 z-1000">
        <div
          onClick={() => setShowDropdown(prev => !prev)}
          className="flex items-center gap-2 border border-[#e8e8e8] rounded-lg px-3 py-1.5 cursor-pointer hover:border-[#4F46E5] transition-colors bg-white select-none"
          style={{ minWidth: 160 }}
        >
          <SlidersHorizontal size={13} className="text-[#6f7882]" />
          <span className="text-[#6f7882] text-[13px]">Lọc theo:</span>
          <span className="font-semibold text-[#212f3f] text-[13px] truncate flex-1">{activeLabel}</span>
          <ChevronDown
            size={14}
            className={`text-[#6f7882] transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
          />
        </div>

        {showDropdown && (
          <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-[#e8e8e8] rounded-lg shadow-xl z-50 py-1.5 overflow-hidden">
            {filterTypes.map(type => (
              <div
                key={type.id}
                onClick={() => {
                  onFilterTypeChange(type.id);
                  setShowDropdown(false);
                }}
                className={`px-4 py-2.5 text-[14px] cursor-pointer flex items-center justify-between transition-colors ${
                  activeFilterType === type.id
                    ? 'text-[#4F46E5] font-semibold bg-indigo-50'
                    : 'text-[#212f3f] hover:bg-[#f5f5f5]'
                }`}
              >
                {type.label}
                {activeFilterType === type.id && (
                  <span className="text-[#4F46E5] text-[16px] font-bold">✓</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scroll Left */}
      <button
        onClick={scrollLeft}
        className="w-8 h-8 rounded-full border border-[#e8e8e8] flex items-center justify-center flex-shrink-0 hover:border-[#4F46E5] hover:text-[#4F46E5] text-[#9ea5af] transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Quick Filter Pills */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 min-w-0"
      >
        {quickOptions.map((opt, idx) => {
          const isActive = activeQuickValue === opt.value;
          return (
            <button
              key={idx}
              onClick={() => onQuickOptionSelect(opt.value)}
              className={`px-4 py-1.5 rounded-full text-[13px] whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                isActive
                  ? 'text-white font-semibold shadow-sm'
                  : 'bg-[#f5f5f5] text-[#212f3f] hover:bg-[#e8e8e8]'
              }`}
              style={isActive ? { backgroundColor: accentColor } : {}}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Scroll Right */}
      <button
        onClick={scrollRight}
        className="w-8 h-8 rounded-full border border-[#e8e8e8] flex items-center justify-center flex-shrink-0 hover:border-[#4F46E5] hover:text-[#4F46E5] text-[#9ea5af] transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
