import { cn } from '@/lib/utils';

/**
 * Bits of confetti around the birthday card, each drifting in a loop of its
 * own (see .confetti in globals.css), and still for those who ask for less motion. Where each
 * sits is in percent of the card's box, so they keep around it at any width;
 * on phones only above and below it, so none reach past the screen's edge.
 */
const PIECES = [
  {
    left: 4,
    top: 10,
    color: 'bg-pink-400',
    shape: 'rounded-sm',
    turn: 'rotate-12',
  },
  { left: 12, top: 72, color: 'bg-amber-300', shape: 'rounded-full', turn: '' },
  {
    left: 22,
    top: 2,
    color: 'bg-primary',
    shape: 'rounded-sm',
    turn: '-rotate-45',
  },
  {
    left: 90,
    top: 8,
    color: 'bg-amber-300',
    shape: 'rounded-sm',
    turn: 'rotate-45',
  },
  { left: 96, top: 46, color: 'bg-pink-400', shape: 'rounded-full', turn: '' },
  {
    left: 84,
    top: 88,
    color: 'bg-primary',
    shape: 'rounded-sm',
    turn: 'rotate-12',
  },
  {
    left: 2,
    top: 44,
    color: 'bg-sky-300',
    shape: 'rounded-sm',
    turn: '-rotate-12',
  },
  { left: 70, top: 0, color: 'bg-sky-300', shape: 'rounded-full', turn: '' },
  {
    left: 40,
    top: 96,
    color: 'bg-amber-300',
    shape: 'rounded-sm',
    turn: 'rotate-45',
  },
];

export function Confetti() {
  return (
    <div
      aria-hidden='true'
      className='pointer-events-none absolute inset-x-0 -inset-y-6 sm:-inset-10'
    >
      {PIECES.map((piece, index) => (
        <span
          key={index}
          className={cn(
            'confetti absolute size-3',
            piece.color,
            piece.shape,
            piece.turn
          )}
          style={
            {
              left: `${piece.left}%`,
              top: `${piece.top}%`,
              '--confetti-delay': `${index * -0.7}s`,
              '--confetti-duration': `${5 + (index % 4)}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
