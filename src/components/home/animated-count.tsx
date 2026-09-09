'use client';

import { useEffect, useState } from 'react';

interface AnimatedCountProps {
  target: number;
  duration?: number;
  localize?: boolean;
}

export function AnimatedCount({ target, duration = 1000, localize }: AnimatedCountProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easeOutProgress = 1 - Math.pow(1 - progress, 2);
      const currentCount = Math.floor(easeOutProgress * target);

      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration]);

  return localize ? count.toLocaleString(undefined, { maximumFractionDigits: 0 }) : count;
}
