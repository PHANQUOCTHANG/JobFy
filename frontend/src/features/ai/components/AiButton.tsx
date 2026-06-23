import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface AiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  label?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const AiButton: React.FC<AiButtonProps> = ({ 
  isLoading, 
  label = 'AI viết giúp', 
  variant = 'primary', 
  size = 'sm',
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-1.5 font-medium transition-all rounded-md";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-sm",
    secondary: "bg-purple-100 text-purple-700 hover:bg-purple-200",
    outline: "border border-purple-300 text-purple-700 hover:bg-purple-50",
    ghost: "text-purple-600 hover:bg-purple-50"
  };

  const sizes = {
    sm: "text-xs px-2.5 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${isLoading ? 'opacity-80 cursor-not-allowed' : ''} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Sparkles className="w-3.5 h-3.5" />
      )}
      <span>{label}</span>
    </button>
  );
};
