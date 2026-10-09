/**
 * Bubbles rising through the water. `left` across the hero, `rest` how high
 * it sits when motion is reduced and it stays still. Negative delays, so
 * they're already on their way up when the page opens.
 */
const BUBBLES = [
  { left: 3, rest: 70, size: 16, duration: 16, delay: -3 },
  { left: 9, rest: 30, size: 8, duration: 12, delay: -9 },
  { left: 17, rest: 88, size: 22, duration: 19, delay: -14 },
  { left: 28, rest: 15, size: 10, duration: 14, delay: -6 },
  { left: 38, rest: 60, size: 6, duration: 11, delay: -2 },
  { left: 45, rest: 35, size: 14, duration: 15, delay: -10 },
  { left: 52, rest: 78, size: 18, duration: 17, delay: -11 },
  { left: 58, rest: 22, size: 8, duration: 13, delay: -4 },
  { left: 64, rest: 10, size: 26, duration: 21, delay: -17 },
  { left: 71, rest: 64, size: 10, duration: 13, delay: -7 },
  { left: 79, rest: 42, size: 14, duration: 15, delay: -12 },
  { left: 85, rest: 18, size: 9, duration: 12, delay: -5 },
  { left: 90, rest: 82, size: 24, duration: 20, delay: -8 },
  { left: 96, rest: 50, size: 8, duration: 12, delay: -1 },
];

/** Shafts of light falling in from the surface, at the top right like the shared images. */
const RAYS = [
  { left: 52, width: 7, delay: 0 },
  { left: 63, width: 12, delay: -3 },
  { left: 77, width: 5, delay: -6 },
  { left: 86, width: 10, delay: -4.5 },
];

/**
 * `swells` whole swells across a strip twice as wide as the hero, so rolling
 * it left by half brings it back around to where it started. `y` is where the
 * water sits, `height` how far it rises and falls.
 */
function wave(y: number, height: number, swells: number) {
  const half = 2880 / swells / 2;
  const crest = y - height;
  const trough = y + height;
  let d = `M0 ${y} C ${half / 3} ${crest}, ${(2 * half) / 3} ${crest}, ${half} ${y}`;
  // Each curve picks up from the one before it, so they join without a kink
  for (let x = half; x < 2880; x += half) {
    const through = Math.round(x / half) % 2 ? trough : crest;
    d += ` S ${x + (2 * half) / 3} ${through}, ${x + half} ${y}`;
  }
  return `${d} V 120 H 0 Z`;
}

/**
 * Waves along the bottom, from the far ones to the near one, which is the color
 * of the section that follows and deep enough for the hint to sit in, clear of the swells.
 */
const WAVES = [
  { d: wave(28, 14, 6), fill: 'var(--ocean-wave)', duration: '40s', reverse: true },
  { d: wave(48, 12, 4), fill: 'var(--ocean-wave)', duration: '30s', reverse: false },
  { d: wave(68, 8, 6), fill: 'var(--muted)', duration: '22s', reverse: false },
];

/** The water the hero is set in, as in the shared images: light from above, bubbles, and waves rolling in. */
export function Ocean() {
  return (
    <div
      aria-hidden
      className='pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[linear-gradient(135deg,var(--ocean-from)_0%,var(--ocean-to)_100%)]'
    >
      {/* Light falling through the water, behind the shark */}
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,var(--ocean-light)_0%,transparent_45%)]' />
      {RAYS.map((ray, i) => (
        <div
          key={i}
          className='animate-sway absolute -top-16 h-[85%] origin-top bg-[linear-gradient(to_bottom,var(--ocean-ray),transparent)] blur-md'
          style={{ left: `${ray.left}%`, width: `${ray.width}%`, animationDelay: `${ray.delay}s`, transform: 'skewX(-18deg)' }}
        />
      ))}
      {BUBBLES.map((bubble, i) => (
        <span
          key={i}
          className='animate-rise absolute -bottom-8 rounded-full border-2 border-(--ocean-bubble) bg-(--ocean-bubble)/30 motion-reduce:bottom-(--rest)'
          style={
            {
              left: `${bubble.left}%`,
              width: bubble.size,
              height: bubble.size,
              animationDuration: `${bubble.duration}s`,
              animationDelay: `${bubble.delay}s`,
              '--rest': `${bubble.rest}%`,
            } as React.CSSProperties
          }
        />
      ))}
      {WAVES.map((layer, i) => (
        <svg
          key={i}
          viewBox='0 0 2880 120'
          preserveAspectRatio='none'
          className='animate-roll absolute bottom-0 left-0 h-24 w-[200%] sm:h-28'
          style={{ animationDuration: layer.duration, animationDirection: layer.reverse ? 'reverse' : 'normal' }}
        >
          <path d={layer.d} fill={layer.fill} />
        </svg>
      ))}
    </div>
  );
}
