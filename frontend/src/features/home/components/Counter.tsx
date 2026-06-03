import { useState, useEffect } from "react";
import { useReveal } from "../hooks/useReveal";

export function Counter({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) {
  const { ref, v } = useReveal();
  const [n, setN] = useState(0);
  
  useEffect(() => {
    if (!v) return;
    const step = to / 60; 
    let cur = 0;
    const t = setInterval(() => { 
      cur += step; 
      if (cur >= to) { 
        setN(to); 
        clearInterval(t); 
      } else {
        setN(Math.floor(cur));
      }
    }, 16);
    return () => clearInterval(t);
  }, [v, to]);
  
  return <span ref={ref}>{prefix}{n >= 1000 ? (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "K" : n}{suffix}</span>;
}
