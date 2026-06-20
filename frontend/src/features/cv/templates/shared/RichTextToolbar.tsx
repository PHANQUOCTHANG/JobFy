import React, { useState } from 'react';

const FONT_SIZES = ['10', '11', '12', '13', '14', '16', '18', '20', '24'];
const FONTS = ['Roboto', 'Inter', 'Open Sans', 'Lora', 'Merriweather', 'Raleway', 'Playfair Display'];

function execCmd(cmd: string, value?: string) {
  document.execCommand(cmd, false, value);
}

interface RichTextToolbarProps {
  color: string;
  font: string;
}

export function RichTextToolbar({ color, font }: RichTextToolbarProps) {
  const [fontSize, setFontSize] = useState('13px');
  const [fontFamily, setFontFamily] = useState(font);

  const apply = (cmd: string, val?: string) => {
    execCmd(cmd, val);
  };

  return (
    <div
      className="flex items-center gap-0.5 px-2 py-1 bg-white border border-gray-200 rounded-md shadow-md z-50 flex-wrap"
      style={{ fontSize: 12 }}
      onMouseDown={(e) => e.preventDefault()} // keep focus in editor
    >
      {/* Font size */}
      <select
        value={fontSize}
        onChange={(e) => { setFontSize(e.target.value); apply('fontSize', e.target.value); }}
        className="border border-gray-200 rounded px-1 py-0.5 text-xs text-gray-700 focus:outline-none"
        style={{ width: 60 }}
      >
        {FONT_SIZES.map(s => <option key={s} value={s}>{s}px</option>)}
      </select>

      <div className="w-px h-4 bg-gray-200 mx-0.5" />

      {/* Font family */}
      <select
        value={fontFamily}
        onChange={(e) => { setFontFamily(e.target.value); apply('fontName', e.target.value); }}
        className="border border-gray-200 rounded px-1 py-0.5 text-xs text-gray-700 focus:outline-none"
        style={{ width: 80 }}
      >
        {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
      </select>

      <div className="w-px h-4 bg-gray-200 mx-0.5" />

      {/* Color dot */}
      <div className="relative">
        <div
          className="w-5 h-5 rounded-full border-2 border-gray-300 cursor-pointer"
          style={{ backgroundColor: color }}
          onClick={() => apply('foreColor', color)}
        />
      </div>

      <div className="w-px h-4 bg-gray-200 mx-0.5" />

      {/* Bold */}
      <button onMouseDown={() => apply('bold')} className="w-6 h-6 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded font-bold text-xs">B</button>
      {/* Italic */}
      <button onMouseDown={() => apply('italic')} className="w-6 h-6 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded italic text-xs">I</button>
      {/* Underline */}
      <button onMouseDown={() => apply('underline')} className="w-6 h-6 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded underline text-xs">U</button>

      <div className="w-px h-4 bg-gray-200 mx-0.5" />

      {/* Ordered list */}
      <button onMouseDown={() => apply('insertOrderedList')} className="w-6 h-6 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded" title="Danh sách số">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
      </button>
      {/* Unordered list */}
      <button onMouseDown={() => apply('insertUnorderedList')} className="w-6 h-6 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded" title="Danh sách gạch đầu dòng">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1" fill="currentColor"/><circle cx="3" cy="12" r="1" fill="currentColor"/><circle cx="3" cy="18" r="1" fill="currentColor"/></svg>
      </button>

      <div className="w-px h-4 bg-gray-200 mx-0.5" />

      {/* Alignment */}
      {['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'].map((cmd, i) => {
        const icons = [
          <svg key="l" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>,
          <svg key="c" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>,
          <svg key="r" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>,
          <svg key="j" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
        ];
        return (
          <button key={cmd} onMouseDown={() => apply(cmd)} className="w-6 h-6 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded">
            {icons[i]}
          </button>
        );
      })}
    </div>
  );
}
