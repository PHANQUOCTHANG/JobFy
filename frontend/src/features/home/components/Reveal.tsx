import React from "react";
import { useReveal } from "../hooks/useReveal";

export function Reveal({ children, delay = 0, y = 24, className = "" }: {
  children: React.ReactNode; delay?: number; y?: number; className?: string;
}) {
  const { ref, v } = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: v ? 1 : 0,
      transform: v ? "translateY(0)" : `translateY(${y}px)`,
      transition: `opacity .65s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .65s cubic-bezier(.16,1,.3,1) ${delay}ms`,
    }}>{children}</div>
  );
}
