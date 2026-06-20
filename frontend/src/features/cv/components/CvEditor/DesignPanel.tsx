import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';

interface DesignPanelProps {
  onClose?: () => void;
  currentColor: string;
  onChangeColor: (color: string) => void;
  currentFont: string;
  onChangeFont: (font: string) => void;
  fontSize: 'small' | 'medium' | 'large';
  onChangeFontSize: (size: 'small' | 'medium' | 'large') => void;
  lineHeight: number;
  onChangeLineHeight: (height: number) => void;
  background: string;
  onChangeBackground: (bg: string) => void;
}

// Hex to HSV and back helpers
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}

function rgbToHsv(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0, s = max === 0 ? 0 : d / max, v = max;
  if (max !== min) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h, s, v };
}

function hsvToRgb(h: number, s: number, v: number) {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r = 0, g = 0, b = 0;
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return { r: r * 255, g: g * 255, b: b * 255 };
}

const backgroundOptions = [
  { id: 'white', bg: '#ffffff', preview: 'bg-white border border-gray-200' },
  { id: 'blue-grad', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', preview: 'from-[#667eea] to-[#764ba2]' },
  { id: 'gray-light', bg: '#f8f9fa', preview: 'bg-[#f8f9fa] border border-gray-200' },
  { id: 'dark', bg: '#1a1a2e', preview: 'bg-[#1a1a2e]' },
  { id: 'pink-grad', bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', preview: 'from-[#f093fb] to-[#f5576c]' },
  { id: 'indigo-grad', bg: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', preview: 'from-[#4F46E5] to-[#7C3AED]' },
  { id: 'green-grad', bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', preview: 'from-[#43e97b] to-[#38f9d7]' },
  { id: 'orange-grad', bg: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', preview: 'from-[#f6d365] to-[#fda085]' },
  { id: 'cream', bg: '#fef9e7', preview: 'bg-[#fef9e7] border border-gray-200' },
  { id: 'light-blue', bg: '#e8f4fd', preview: 'bg-[#e8f4fd] border border-gray-200' },
  { id: 'light-pink', bg: '#fde8f4', preview: 'bg-[#fde8f4] border border-gray-200' },
  { id: 'pure-white-2', bg: '#ffffff', preview: 'bg-white border border-gray-200' },
];

const fonts = ['Roboto', 'Inter', 'Open Sans', 'Lora', 'Merriweather', 'Raleway'];

export const DesignPanel: React.FC<DesignPanelProps> = ({
  onClose,
  currentColor,
  onChangeColor,
  currentFont,
  onChangeFont,
  fontSize,
  onChangeFontSize,
  lineHeight,
  onChangeLineHeight,
  background,
  onChangeBackground,
}) => {
  // --- Color Picker State ---
  const rgb = hexToRgb(currentColor.startsWith('#') ? currentColor : '#000000');
  const { h, s, v } = rgbToHsv(rgb.r, rgb.g, rgb.b);

  const [hue, setHue] = useState(h);
  const [sat, setSat] = useState(s);
  const [bri, setBri] = useState(v);
  const [hexInput, setHexInput] = useState(currentColor.replace('#', ''));

  const gradientRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const isDraggingGrad = useRef(false);
  const isDraggingHue = useRef(false);

  useEffect(() => {
    const { r, g, b } = hsvToRgb(hue, sat, bri);
    const hex = rgbToHex(r, g, b);
    onChangeColor(hex);
    setHexInput(hex.replace('#', ''));
  }, [hue, sat, bri]);

  const handleGradientMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingGrad.current = true;
    updateGradientPos(e.nativeEvent);
  }, [hue]);

  const updateGradientPos = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!gradientRef.current) return;
    const rect = gradientRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setSat(x);
    setBri(1 - y);
  }, []);

  const updateHuePos = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!hueRef.current) return;
    const rect = hueRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHue(x);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingGrad.current) updateGradientPos(e);
      if (isDraggingHue.current) updateHuePos(e);
    };
    const onMouseUp = () => {
      isDraggingGrad.current = false;
      isDraggingHue.current = false;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp); };
  }, [updateGradientPos, updateHuePos]);

  const handleHexInput = (val: string) => {
    setHexInput(val);
    if (val.length === 6) {
      const hex = '#' + val;
      const rgb2 = hexToRgb(hex);
      const hsv2 = rgbToHsv(rgb2.r, rgb2.g, rgb2.b);
      setHue(hsv2.h);
      setSat(hsv2.s);
      setBri(hsv2.v);
      onChangeColor(hex);
    }
  };

  const hueColor = `hsl(${hue * 360}, 100%, 50%)`;
  const currentHex = currentColor.replace('#', '').toUpperCase();

  const fontSizeSteps: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
  const fontSizeLabels = ['Nhỏ', 'Trung bình', 'Siêu lớn'];
  const fontSizeIndex = fontSizeSteps.indexOf(fontSize);

  const presetColors = [
    '#1a1a1a', '#334155', '#1e3a8a', '#0ea5e9', '#059669',
    '#dc2626', '#9333ea', '#c2410c', '#be185d', '#ca8a04',
  ];

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <h3 className="font-bold text-gray-800 text-sm">Thiết kế &amp; Font</h3>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors p-0.5 rounded">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Font */}
        <div className="px-4 py-3 border-b border-gray-50">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Font chữ</label>
          <select
            value={currentFont}
            onChange={(e) => onChangeFont(e.target.value)}
            className="w-full border border-gray-200 rounded-md py-1.5 px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#4F46E5] text-gray-700"
          >
            {fonts.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {/* Font Size */}
        <div className="px-4 py-3 border-b border-gray-50">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Cỡ chữ</label>
          <div className="relative">
            <input
              type="range"
              min="0" max="2" step="1"
              value={fontSizeIndex}
              onChange={(e) => onChangeFontSize(fontSizeSteps[parseInt(e.target.value)])}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#00B14F] bg-gray-200"
            />
            <div className="flex justify-between mt-1.5">
              {fontSizeLabels.map((l, i) => (
                <span key={i} className={`text-[9px] font-medium ${fontSizeIndex === i ? 'text-[#00B14F]' : 'text-gray-400'}`}>{l}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Line Height */}
        <div className="px-4 py-3 border-b border-gray-50">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Khoảng cách dòng</label>
          <div className="relative">
            <div className="flex justify-between mb-1">
              <span className="text-[9px] text-gray-400">1.0</span>
              <span className="text-[9px] text-gray-400">2.0</span>
            </div>
            <input
              type="range"
              min="1" max="2" step="0.1"
              value={lineHeight}
              onChange={(e) => onChangeLineHeight(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#00B14F] bg-gray-200"
            />
          </div>
        </div>

        {/* Color Picker */}
        <div className="px-4 py-3 border-b border-gray-50">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Màu chủ đề</label>

          {/* Preset Row */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {presetColors.map(c => (
              <button
                key={c}
                onClick={() => {
                  const rgb2 = hexToRgb(c);
                  const hsv2 = rgbToHsv(rgb2.r, rgb2.g, rgb2.b);
                  setHue(hsv2.h);
                  setSat(hsv2.s);
                  setBri(hsv2.v);
                  onChangeColor(c);
                  setHexInput(c.replace('#', ''));
                }}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${currentColor.toLowerCase() === c.toLowerCase() ? 'border-[#00B14F] scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Gradient Box */}
          <div
            ref={gradientRef}
            onMouseDown={handleGradientMouseDown}
            className="w-full h-32 rounded-md cursor-crosshair relative select-none mb-2"
            style={{
              background: `linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #fff, ${hueColor})`,
            }}
          >
            {/* Selector dot */}
            <div
              className="absolute w-3 h-3 rounded-full border-2 border-white shadow-md pointer-events-none"
              style={{
                left: `calc(${sat * 100}% - 6px)`,
                top: `calc(${(1 - bri) * 100}% - 6px)`,
                backgroundColor: currentColor,
              }}
            />
          </div>

          {/* Hue Slider */}
          <div
            ref={hueRef}
            onMouseDown={(e) => { isDraggingHue.current = true; updateHuePos(e); }}
            className="w-full h-4 rounded-full cursor-pointer relative select-none mb-3"
            style={{
              background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
            }}
          >
            <div
              className="absolute top-0.5 w-3 h-3 rounded-full border-2 border-white shadow-md pointer-events-none"
              style={{ left: `calc(${hue * 100}% - 6px)`, backgroundColor: hueColor }}
            />
          </div>

          {/* Hex + Preview */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-md border border-gray-200 flex-shrink-0"
              style={{ backgroundColor: currentColor }}
            />
            <div className="flex-1 flex items-center border border-gray-200 rounded-md overflow-hidden">
              <span className="px-2 py-1.5 text-[10px] text-gray-400 font-mono bg-gray-50 border-r border-gray-200">#</span>
              <input
                type="text"
                value={hexInput}
                onChange={(e) => handleHexInput(e.target.value.toUpperCase().replace(/[^0-9A-F]/gi, ''))}
                maxLength={6}
                className="flex-1 px-2 py-1.5 text-xs font-mono focus:outline-none text-gray-700"
                placeholder="000000"
              />
            </div>
          </div>
        </div>

        {/* Background / Hình nền CV */}
        <div className="px-4 py-3">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Hình nền CV</label>
          <div className="grid grid-cols-4 gap-1.5">
            {backgroundOptions.map((opt, i) => {
              const isActive = background === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onChangeBackground(opt.id)}
                  className={`relative w-full aspect-square rounded border-2 overflow-hidden transition-all ${isActive ? 'border-[#00B14F] shadow-md' : 'border-transparent hover:border-gray-300'}`}
                >
                  <div
                    className="w-full h-full"
                    style={opt.bg.includes('gradient') ? { background: opt.bg } : { backgroundColor: opt.bg }}
                  />
                  {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <div className="w-4 h-4 bg-[#00B14F] rounded-full flex items-center justify-center">
                        <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
