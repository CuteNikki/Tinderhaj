/**
 * Counts up to `target` over `duration` ms, starting `delay` seconds into the
 * page. Played by the browser (see .count-up in globals.css), so the number
 * climbs as soon as the page shows rather than reading 0 until its JavaScript
 * has loaded. `localize` groups thousands in the number it lands on.
 */
export function AnimatedCount({ target, duration = 1000, delay = 0, localize }: { target: number; duration?: number; delay?: number; localize?: boolean }) {
  return (
    <span className='count-up' style={{ '--count': target, '--count-duration': `${duration}ms`, '--count-delay': `${delay}s` } as React.CSSProperties}>
      <span>{localize ? target.toLocaleString('en-US', { maximumFractionDigits: 0 }) : target}</span>
    </span>
  );
}
