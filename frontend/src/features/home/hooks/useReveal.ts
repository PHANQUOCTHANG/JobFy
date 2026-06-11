import { useState, useEffect, useRef } from "react";

export function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => { 
      if (e.isIntersecting) { 
        setV(true); 
        o.disconnect(); 
      } 
    }, { threshold });
    o.observe(el);
    return () => o.disconnect();
  }, [threshold]);
  
  return { ref, v };
}
