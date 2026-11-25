'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';

import {
  Flower2Icon,
  GhostIcon,
  HeartIcon,
  PartyPopperIcon,
  RainbowIcon,
  SnowflakeIcon,
  SunIcon,
  type LucideIcon,
} from 'lucide-react';

import type { SeasonEffect } from '@/constants/seasons';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

/** Whether someone turned the season's effects off, remembered in their browser. */
const OFF_KEY = 'tinderhaj.effects-off';
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

type Particle = {
  x: number;
  y: number;
  /** How big, in pixels from its middle */
  r: number;
  /** Pixels a second along its way */
  speed: number;
  /** How far it sways from side to side, in pixels */
  sway: number;
  /** Where it is in its sway, its flap or its twinkle */
  phase: number;
  /** How it's turned, and how fast it turns, in radians (a second) */
  angle: number;
  spin: number;
  color: string;
};

type Draw = (
  context: CanvasRenderingContext2D,
  p: Particle,
  x: number,
  y: number
) => void;

/**
 * How each season's effect moves and looks: which way it goes, how many there
 * are (per 10,000 square pixels of window), how big and fast, its colours on
 * the light and the dark theme, and how one is drawn.
 */
type Look = {
  move: 'fall' | 'rise' | 'across' | 'twinkle';
  density: number;
  size: [number, number];
  speed: [number, number];
  colors: { light: string[]; dark: string[] };
  icon: LucideIcon;
  /** What it is, for the button that turns it off */
  name: string;
  draw: Draw;
};

/** Six arms: three lines through its middle, a third of a turn apart. */
const flake: Draw = (context, p, x, y) => {
  context.beginPath();
  for (const arm of [0, Math.PI / 3, (2 * Math.PI) / 3]) {
    const dx = Math.cos(p.angle + arm) * p.r;
    const dy = Math.sin(p.angle + arm) * p.r;
    context.moveTo(x - dx, y - dy);
    context.lineTo(x + dx, y + dy);
  }
  context.stroke();
};

const heart: Draw = (context, p, x, y) => {
  const r = p.r;
  context.beginPath();
  context.moveTo(x, y + r);
  context.bezierCurveTo(
    x - r * 1.6,
    y - r * 0.2,
    x - r * 0.6,
    y - r * 1.4,
    x,
    y - r * 0.4
  );
  context.bezierCurveTo(
    x + r * 0.6,
    y - r * 1.4,
    x + r * 1.6,
    y - r * 0.2,
    x,
    y + r
  );
  context.fill();
};

const confetti: Draw = (context, p, x, y) => {
  context.save();
  context.translate(x, y);
  context.rotate(p.angle);
  // Flipping over as it falls: as wide as it's turned toward you
  context.fillRect(
    -p.r,
    (-p.r / 2) * Math.cos(p.phase * 3),
    p.r * 2,
    p.r * Math.cos(p.phase * 3)
  );
  context.restore();
};

const petal: Draw = (context, p, x, y) => {
  context.beginPath();
  context.ellipse(x, y, p.r, p.r * 0.55, p.angle, 0, Math.PI * 2);
  context.fill();
};

/** A four-pointed glint that brightens and fades where it is. */
const sparkle: Draw = (context, p, x, y) => {
  const glow = Math.max(0, Math.sin(p.phase));
  if (!glow) return;
  const r = p.r * glow;
  context.globalAlpha = glow;
  context.beginPath();
  context.moveTo(x - r, y);
  context.lineTo(x + r, y);
  context.moveTo(x, y - r);
  context.lineTo(x, y + r);
  context.stroke();
  context.globalAlpha = 1;
};

/** A bat from the side: two wings flapping from its body, and a round head. */
const bat: Draw = (context, p, x, y) => {
  const r = p.r;
  const flap = Math.sin(p.phase * 10) * 0.8;
  context.beginPath();
  context.moveTo(x, y);
  for (const side of [-1, 1]) {
    context.quadraticCurveTo(
      x + side * r,
      y - r * (0.4 + flap),
      x + side * r * 2,
      y - r * flap
    );
    context.quadraticCurveTo(
      x + side * r * 1.3,
      y + r * 0.1,
      x + side * r * 0.9,
      y + r * 0.4
    );
    context.quadraticCurveTo(x + side * r * 0.5, y + r * 0.1, x, y + r * 0.5);
    context.moveTo(x, y);
  }
  context.fill();
  context.beginPath();
  context.arc(x, y - r * 0.1, r * 0.35, 0, Math.PI * 2);
  context.fill();
};

const HEARTS = {
  light: ['#f472b6', '#fb7185', '#ed3867'],
  dark: ['#f9a8d4', '#fb7185', '#f472b6'],
};

const LOOKS: Record<SeasonEffect, Look> = {
  // Snow's colour is the theme's --snow, read as it falls (see SeasonEffects)
  snow: {
    move: 'fall',
    density: 0.6,
    size: [3, 7],
    speed: [20, 60],
    colors: { light: [], dark: [] },
    icon: SnowflakeIcon,
    name: 'snow',
    draw: flake,
  },
  confetti: {
    move: 'fall',
    density: 0.5,
    size: [3, 5],
    speed: [40, 90],
    colors: {
      light: ['#f472b6', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'],
      dark: ['#f9a8d4', '#fcd34d', '#93c5fd', '#6ee7b7', '#c4b5fd'],
    },
    icon: PartyPopperIcon,
    name: 'confetti',
    draw: confetti,
  },
  hearts: {
    move: 'rise',
    density: 0.25,
    size: [4, 8],
    speed: [20, 45],
    colors: HEARTS,
    icon: HeartIcon,
    name: 'hearts',
    draw: heart,
  },
  // The trans flag's light blue, pink and white; on the light page a pale grey instead of white
  trans: {
    move: 'rise',
    density: 0.25,
    size: [4, 8],
    speed: [20, 45],
    colors: {
      light: ['#5bcefa', '#f5a9b8', '#cbd5e1'],
      dark: ['#5bcefa', '#f5a9b8', '#ffffff'],
    },
    icon: HeartIcon,
    name: 'hearts',
    draw: heart,
  },
  pride: {
    move: 'rise',
    density: 0.25,
    size: [4, 8],
    speed: [20, 45],
    colors: {
      light: ['#e40303', '#ff8c00', '#f5c400', '#008026', '#004dff', '#750787'],
      dark: ['#ff5c5c', '#ffa94d', '#ffe066', '#51cf66', '#5c9dff', '#c77dff'],
    },
    icon: RainbowIcon,
    name: 'rainbow hearts',
    draw: heart,
  },
  petals: {
    move: 'fall',
    density: 0.25,
    size: [3, 6],
    speed: [15, 35],
    colors: {
      light: ['#f9a8d4', '#f472b6', '#fbcfe8'],
      dark: ['#fbcfe8', '#f9a8d4', '#fce7f3'],
    },
    icon: Flower2Icon,
    name: 'petals',
    draw: petal,
  },
  sparkles: {
    move: 'twinkle',
    density: 0.2,
    size: [3, 6],
    speed: [0, 0],
    colors: { light: ['#f59e0b', '#fbbf24'], dark: ['#fde68a', '#fcd34d'] },
    icon: SunIcon,
    name: 'sunlight',
    draw: sparkle,
  },
  bats: {
    move: 'across',
    density: 0.05,
    size: [5, 9],
    speed: [40, 80],
    colors: { light: ['#5b21b6', '#6d28d9'], dark: ['#c4b5fd', '#a78bfa'] },
    icon: GhostIcon,
    name: 'bats',
    draw: bat,
  },
};

/** At most this many on screen, however big the window. */
const MAX_PARTICLES = 160;

const between = ([low, high]: [number, number]) =>
  low + Math.random() * (high - low);

function readOff() {
  try {
    return localStorage.getItem(OFF_KEY) === '1';
  } catch {
    return false;
  }
}

/** Those listening for the effects being turned on or off: here, or in another tab. */
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

function subscribeMotion(listener: () => void) {
  const query = matchMedia(REDUCED_MOTION);
  query.addEventListener('change', listener);
  return () => query.removeEventListener('change', listener);
}

/**
 * The season's effect over every page (see seasonOn): snow, hearts, bats and
 * the like, drawn on a canvas that lets every click through. None for those
 * who ask for less motion. The button in the corner turns them all off, for
 * every season, and back on.
 */
export function SeasonEffects({ effect }: { effect: SeasonEffect }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Off and still on the server, so nothing shows before the browser says otherwise
  const off = useSyncExternalStore(subscribeOff, readOff, () => true);
  const still = useSyncExternalStore(
    subscribeMotion,
    () => matchMedia(REDUCED_MOTION).matches,
    () => true
  );
  const look = LOOKS[effect];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || off || still) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    let particles: Particle[] = [];
    let dark = false;
    let frame = 0;
    let last = performance.now();

    const palette = () => {
      if (effect === 'snow')
        return [
          getComputedStyle(document.documentElement).getPropertyValue('--snow'),
        ];
      return dark ? look.colors.dark : look.colors.light;
    };

    function spawn(anywhere: boolean): Particle {
      const colors = palette();
      return {
        x:
          look.move === 'across' && !anywhere
            ? -20
            : Math.random() * innerWidth,
        y:
          anywhere || look.move === 'across' || look.move === 'twinkle'
            ? Math.random() * innerHeight
            : look.move === 'rise'
              ? innerHeight + 20
              : -20,
        r: between(look.size),
        speed: between(look.speed),
        sway: 10 + Math.random() * 20,
        phase: Math.random() * Math.PI * 2,
        angle: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    }

    function size() {
      const ratio = devicePixelRatio || 1;
      canvas!.width = innerWidth * ratio;
      canvas!.height = innerHeight * ratio;
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(
        MAX_PARTICLES,
        Math.round((innerWidth * innerHeight * look.density) / 10_000)
      );
      particles = Array.from({ length: count }, () => spawn(true));
    }

    function draw(now: number) {
      // Seconds since the last frame, at most a tenth, so a hidden tab doesn't jump
      const step = Math.min((now - last) / 1000, 0.1);
      last = now;
      // The theme can change while it's on: new ones take its colours
      const nowDark = document.documentElement.classList.contains('dark');
      if (nowDark !== dark) {
        dark = nowDark;
        const colors = palette();
        for (const p of particles)
          p.color = colors[Math.floor(Math.random() * colors.length)];
      }
      context!.clearRect(0, 0, innerWidth, innerHeight);
      context!.lineWidth = 1.5;
      context!.lineCap = 'round';
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.phase += step;
        p.angle += p.spin * step;
        if (look.move === 'fall') p.y += p.speed * step;
        if (look.move === 'rise') p.y -= p.speed * step;
        if (look.move === 'across') p.x += p.speed * step;
        const x =
          look.move === 'across' ? p.x : p.x + Math.sin(p.phase) * p.sway;
        const y =
          look.move === 'across' ? p.y + Math.sin(p.phase * 2) * p.sway : p.y;
        // Gone past an edge, or a glint that's had its moment: another in its place
        const gone =
          y - p.r * 2 > innerHeight ||
          y + p.r * 2 < 0 ||
          x - p.r * 2 > innerWidth ||
          (look.move === 'twinkle' && p.phase > Math.PI * 2);
        if (gone) {
          particles[i] = spawn(look.move === 'twinkle');
          if (look.move === 'twinkle') particles[i].phase = 0;
          continue;
        }
        context!.fillStyle = p.color;
        context!.strokeStyle = p.color;
        look.draw(context!, p, x, y);
      }
      frame = requestAnimationFrame(draw);
    }

    dark = document.documentElement.classList.contains('dark');
    size();
    addEventListener('resize', size);
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('resize', size);
    };
  }, [effect, look, off, still]);

  // Nothing to turn off for those who asked for less motion
  if (still) return null;

  const label = off
    ? `Turn the ${look.name} back on`
    : `Turn the ${look.name} off`;
  const Icon = look.icon;
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
            <Icon
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
