'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';

import { SnowflakeIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

/** Whether someone turned the snow off, remembered in their browser. */
const OFF_KEY = 'tinderhaj.snow-off';
/** About how many flakes per 10,000 square pixels of window. */
const DENSITY = 0.6;
const MAX_FLAKES = 160;

type Flake = {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  phase: number;
  /** How far it's turned, and how fast it turns, in radians (a second) */
  angle: number;
  spin: number;
};

/** The six arms of a flake: three lines through its middle, a third of a turn apart. */
const ARMS = [0, Math.PI / 3, (2 * Math.PI) / 3];

function readOff() {
  try {
    return localStorage.getItem(OFF_KEY) === '1';
  } catch {
    return false;
  }
}

/** Those listening for the snow being turned on or off: here, or in another tab. */
const listeners = new Set<() => void>();

function subscribeOff(listener: () => void) {
  listeners.add(listener);
  addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    removeEventListener('storage', listener);
  };
}

function writeOff(off: boolean) {
  try {
    if (off) localStorage.setItem(OFF_KEY, '1');
    else localStorage.removeItem(OFF_KEY);
  } catch {
    // Not remembered, then
  }
  listeners.forEach((listener) => listener());
}

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function subscribeMotion(listener: () => void) {
  const query = matchMedia(REDUCED_MOTION);
  query.addEventListener('change', listener);
  return () => query.removeEventListener('change', listener);
}

/**
 * Snow falling over the page, in December (see currentSeason): drawn on a
 * canvas that lets every click through, in the theme's --snow. None for those
 * who ask for less motion. The button in the corner turns it off, and back on.
 */
export function Snow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Off and still on the server, so nothing shows before the browser says otherwise
  const off = useSyncExternalStore(subscribeOff, readOff, () => true);
  const still = useSyncExternalStore(
    subscribeMotion,
    () => matchMedia(REDUCED_MOTION).matches,
    () => true
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || off || still) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    let flakes: Flake[] = [];
    let color = '';
    let frame = 0;
    let last = performance.now();

    function size() {
      const ratio = devicePixelRatio || 1;
      canvas!.width = innerWidth * ratio;
      canvas!.height = innerHeight * ratio;
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(
        MAX_FLAKES,
        Math.round((innerWidth * innerHeight * DENSITY) / 10_000)
      );
      flakes = Array.from({ length: count }, () => ({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        r: 3 + Math.random() * 4,
        speed: 20 + Math.random() * 40,
        drift: 10 + Math.random() * 20,
        phase: Math.random() * Math.PI * 2,
        angle: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 1.2,
      }));
    }

    function draw(now: number) {
      // Seconds since the last frame, at most a tenth, so a hidden tab doesn't jump
      const step = Math.min((now - last) / 1000, 0.1);
      last = now;
      // The theme can change while it snows
      if (frame % 60 === 0)
        color = getComputedStyle(document.documentElement).getPropertyValue(
          '--snow'
        );
      context!.clearRect(0, 0, innerWidth, innerHeight);
      context!.strokeStyle = color;
      context!.lineWidth = 1.5;
      context!.lineCap = 'round';
      for (const flake of flakes) {
        flake.y += flake.speed * step;
        flake.phase += step;
        const x = flake.x + Math.sin(flake.phase) * flake.drift;
        if (flake.y - flake.r > innerHeight) {
          flake.y = -flake.r;
          flake.x = Math.random() * innerWidth;
        }
        // A six-armed flake rather than a dot, so it can't be taken for one of the water's bubbles
        flake.angle += flake.spin * step;
        context!.beginPath();
        for (const arm of ARMS) {
          const dx = Math.cos(flake.angle + arm) * flake.r;
          const dy = Math.sin(flake.angle + arm) * flake.r;
          context!.moveTo(x - dx, flake.y - dy);
          context!.lineTo(x + dx, flake.y + dy);
        }
        context!.stroke();
      }
      frame = requestAnimationFrame(draw);
    }

    size();
    addEventListener('resize', size);
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('resize', size);
    };
  }, [off, still]);

  // Nothing to turn off for those who asked for less motion
  if (still) return null;

  const label = off ? 'Let it snow' : 'Turn the snow off';
  return (
    <>
      {!off && (
        <canvas
          ref={canvasRef}
          aria-hidden='true'
          className='pointer-events-none fixed inset-0 z-40 size-full'
        />
      )}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            aria-label={label}
            aria-pressed={!off}
            onClick={() => writeOff(!off)}
            className='fixed right-4 bottom-4 z-50 rounded-full shadow-md'
          >
            <SnowflakeIcon
              className={off ? 'text-muted-foreground' : 'text-primary'}
              aria-hidden='true'
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side='left'>{label}</TooltipContent>
      </Tooltip>
    </>
  );
}
