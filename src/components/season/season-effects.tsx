'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';

import {
  GhostIcon,
  HeartIcon,
  PartyPopperIcon,
  RainbowIcon,
  SnowflakeIcon,
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
  /** Which of its effect's kinds it is (see Look) */
  kind: Kind;
  x: number;
  y: number;
  /** How big, in pixels from its middle */
  r: number;
  /** Pixels a second along its way */
  speed: number;
  /** How far it sways from side to side, in pixels */
  sway: number;
  /** Where it is in its sway or its flap */
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
  y: number,
  dark: boolean
) => void;

/**
 * One kind of thing an effect has: which way it goes, how big and fast, its
 * colours on the light and the dark theme, and how one is drawn.
 */
type Kind = {
  move: 'fall' | 'rise' | 'across';
  size: [number, number];
  speed: [number, number];
  colors: { light: string[]; dark: string[] };
  draw: Draw;
};

/**
 * A season's effect: its kinds, each as likely as the others, and how many
 * there are: per 10,000 square pixels of the page's first screen, and at most
 * `max`, however big the screen, so it stays calm.
 */
type Look = {
  density: number;
  max: number;
  kinds: Kind[];
  icon: LucideIcon;
  /** What it is, for the button that turns it off */
  name: string;
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

/** A strip of paper, turning, and flipping over as it falls: as wide as it's turned toward you. */
const confetti: Draw = (context, p, x, y) => {
  const flip = Math.cos(p.phase * 3);
  context.save();
  context.translate(x, y);
  context.rotate(p.angle);
  context.fillRect(-p.r, (-p.r / 2) * flip, p.r * 2, p.r * flip);
  context.restore();
};

/**
 * A bat gliding: wide wings with a scalloped trailing edge, lifting and
 * dipping slowly, a body, and a head with two ears.
 */
const bat: Draw = (context, p, x, y) => {
  const r = p.r;
  const lift = Math.sin(p.phase * 3) * 0.25;
  context.beginPath();
  context.moveTo(x, y - r * 0.2);
  for (const side of [1, -1]) {
    const at = (dx: number, dy: number) =>
      [x + side * dx * r, y + dy * r] as const;
    context.moveTo(...at(0.2, -0.25));
    // The leading edge, out to the wing's tip
    context.quadraticCurveTo(...at(0.9, -1.5 - lift), ...at(2.1, -1 - lift));
    // Three scallops back to the body
    context.quadraticCurveTo(...at(1.9, -0.35), ...at(1.6, 0.05 - lift / 2));
    context.quadraticCurveTo(...at(1.3, -0.35), ...at(1, 0.25));
    context.quadraticCurveTo(...at(0.65, -0.15), ...at(0.2, 0.45));
    context.closePath();
  }
  context.fill();
  // Body, head and ears
  context.beginPath();
  context.ellipse(x, y + r * 0.1, r * 0.32, r * 0.5, 0, 0, Math.PI * 2);
  context.fill();
  context.beginPath();
  context.arc(x, y - r * 0.42, r * 0.28, 0, Math.PI * 2);
  context.fill();
  // An ear on each side, as a shape of its own, so the head's fill can't leave gaps
  for (const side of [-1, 1]) {
    context.beginPath();
    context.moveTo(x + side * r * 0.24, y - r * 0.5);
    context.lineTo(x + side * r * 0.17, y - r * 0.88);
    context.lineTo(x + side * r * 0.04, y - r * 0.6);
    context.closePath();
    context.fill();
  }
};

/**
 * A little ghost: a round head, a wavy hem that ripples as it floats, and two
 * dot eyes. Outlined on the light page, where white wouldn't show on its own.
 */
const ghost: Draw = (context, p, x, y, dark) => {
  const r = p.r;
  const ripple = Math.sin(p.phase * 4) * r * 0.08;
  context.beginPath();
  context.arc(x, y - r * 0.2, r, Math.PI, 0);
  context.lineTo(x + r, y + r * 0.9);
  // The hem: three bumps, rippling
  const bumps = 3;
  for (let i = bumps; i > 0; i--) {
    const right = x - r + ((2 * r) / bumps) * i;
    const left = right - (2 * r) / bumps;
    context.quadraticCurveTo(
      (left + right) / 2,
      y + r * 0.9 + (i % 2 ? r * 0.35 + ripple : -r * 0.05 - ripple),
      left,
      y + r * 0.9
    );
  }
  context.closePath();
  context.fill();
  if (!dark) {
    context.lineWidth = 1;
    context.strokeStyle = 'rgba(71, 85, 105, 0.45)';
    context.stroke();
  }
  context.fillStyle = '#1e293b';
  for (const side of [-1, 1]) {
    context.beginPath();
    context.ellipse(
      x + side * r * 0.35,
      y - r * 0.15,
      r * 0.13,
      r * 0.18,
      0,
      0,
      Math.PI * 2
    );
    context.fill();
  }
};

/** Confetti in a day's colours. */
const confettiIn = (colors: {
  light: string[];
  dark: string[];
}): Look['kinds'] => [
  { move: 'fall', size: [3, 5], speed: [40, 90], colors, draw: confetti },
];

const LOOKS: Record<SeasonEffect, Look> = {
  // Snow's colour is the theme's --snow, read as it falls (see SeasonEffects)
  snow: {
    density: 0.25,
    max: 60,
    kinds: [
      {
        move: 'fall',
        size: [3, 7],
        speed: [20, 60],
        colors: { light: [], dark: [] },
        draw: flake,
      },
    ],
    icon: SnowflakeIcon,
    name: 'snow',
  },
  confetti: {
    density: 0.2,
    max: 50,
    kinds: confettiIn({
      light: ['#f472b6', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'],
      dark: ['#f9a8d4', '#fcd34d', '#93c5fd', '#6ee7b7', '#c4b5fd'],
    }),
    icon: PartyPopperIcon,
    name: 'confetti',
  },
  valentines: {
    density: 0.2,
    max: 50,
    kinds: confettiIn({
      light: ['#f472b6', '#ed3867', '#fb7185', '#e11d48'],
      dark: ['#f9a8d4', '#fb7185', '#fda4af', '#f472b6'],
    }),
    icon: HeartIcon,
    name: 'confetti',
  },
  // The trans flag's light blue, pink and white; on the light page a pale grey instead of white
  trans: {
    density: 0.2,
    max: 50,
    kinds: confettiIn({
      light: ['#5bcefa', '#f5a9b8', '#cbd5e1'],
      dark: ['#5bcefa', '#f5a9b8', '#ffffff'],
    }),
    icon: HeartIcon,
    name: 'confetti',
  },
  // The rainbow flag's six colours, a little lighter on the dark theme
  pride: {
    density: 0.2,
    max: 50,
    kinds: confettiIn({
      light: ['#e40303', '#ff8c00', '#f5c400', '#008026', '#004dff', '#750787'],
      dark: ['#ff5c5c', '#ffa94d', '#ffe066', '#51cf66', '#5c9dff', '#c77dff'],
    }),
    icon: RainbowIcon,
    name: 'confetti',
  },
  halloween: {
    density: 0.025,
    max: 10,
    kinds: [
      {
        move: 'across',
        size: [11, 15],
        speed: [30, 55],
        // Silhouettes against the light page; moonlit grey against the dark one
        colors: { light: ['#1e1b2e', '#27243a'], dark: ['#94a3b8', '#a3b1c6'] },
        draw: bat,
      },
      {
        move: 'rise',
        size: [7, 11],
        speed: [12, 25],
        colors: { light: ['#ffffff'], dark: ['#f1f5f9'] },
        draw: ghost,
      },
    ],
    icon: GhostIcon,
    name: 'bats and ghosts',
  },
};

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
 * The season's effect at the top of every page (see seasonOn): snow,
 * confetti, bats and ghosts, drawn on a canvas over the first screen that
 * lets every click through. It scrolls away with the page rather than
 * staying over it, which would make scrolling feel dizzy. None for those
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
    // The canvas's size: the page's first screen
    let width = 0;
    let height = 0;
    let dark = false;
    let frame = 0;
    let last = performance.now();

    const palette = (kind: Kind) => {
      if (effect === 'snow')
        return [
          getComputedStyle(document.documentElement).getPropertyValue('--snow'),
        ];
      return dark ? kind.colors.dark : kind.colors.light;
    };
    const pick = (colors: string[]) =>
      colors[Math.floor(Math.random() * colors.length)];

    /** A new one: anywhere on screen when the page starts, else coming in from its edge. */
    function spawn(anywhere: boolean): Particle {
      const kind = look.kinds[Math.floor(Math.random() * look.kinds.length)];
      const r = between(kind.size);
      return {
        kind,
        x: kind.move === 'across' && !anywhere ? -r * 3 : Math.random() * width,
        y:
          anywhere || kind.move === 'across'
            ? Math.random() * height
            : kind.move === 'rise'
              ? height + r * 2
              : -r * 2,
        r,
        speed: between(kind.speed),
        sway: 10 + Math.random() * 20,
        phase: Math.random() * Math.PI * 2,
        angle: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 1.2,
        color: pick(palette(kind)),
      };
    }

    function size() {
      const ratio = devicePixelRatio || 1;
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      canvas!.width = width * ratio;
      canvas!.height = height * ratio;
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(
        look.max,
        Math.max(1, Math.round((width * height * look.density) / 10_000))
      );
      particles = Array.from({ length: count }, () => spawn(true));
    }

    function draw(now: number) {
      // Seconds since the last frame, at most a tenth, so a hidden tab doesn't jump
      const step = Math.min((now - last) / 1000, 0.1);
      last = now;
      // The theme can change while it's on: they take its colours
      const nowDark = document.documentElement.classList.contains('dark');
      if (nowDark !== dark) {
        dark = nowDark;
        for (const p of particles) p.color = pick(palette(p.kind));
      }
      context!.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const { move } = p.kind;
        p.phase += step;
        p.angle += p.spin * step;
        if (move === 'fall') p.y += p.speed * step;
        if (move === 'rise') p.y -= p.speed * step;
        if (move === 'across') p.x += p.speed * step;
        const x = move === 'across' ? p.x : p.x + Math.sin(p.phase) * p.sway;
        const y = move === 'across' ? p.y + Math.sin(p.phase) * p.sway : p.y;
        // Gone past an edge: another in its place
        if (y - p.r * 3 > height || y + p.r * 3 < 0 || x - p.r * 3 > width) {
          particles[i] = spawn(false);
          continue;
        }
        context!.lineWidth = 1.5;
        context!.lineCap = 'round';
        context!.fillStyle = p.color;
        context!.strokeStyle = p.color;
        p.kind.draw(context!, p, x, y, dark);
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
          // Fading out toward its bottom edge, so nothing is cut off at a line there
          className='pointer-events-none absolute inset-x-0 top-0 z-40 h-svh w-full mask-b-from-50% mask-b-to-100%'
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
