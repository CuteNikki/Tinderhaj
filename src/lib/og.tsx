import 'server-only';

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

/** Shared images (Open Graph and Twitter): what a link looks like when it's shared. */
export const OG_SIZE = { width: 1200, height: 630 };

const [black, semibold, shark] = await Promise.all([
  readFile(join(process.cwd(), 'src/assets/fonts/geist-900.ttf')),
  readFile(join(process.cwd(), 'src/assets/fonts/geist-600.ttf')),
  readFile(join(process.cwd(), 'public/blahajSmall.png')),
]);

export const OG_FONTS = [
  { name: 'Geist', data: black, weight: 900 as const, style: 'normal' as const },
  { name: 'Geist', data: semibold, weight: 600 as const, style: 'normal' as const },
];

/** The Blåhaj, ready to drop into an image. */
export const SHARK_SRC = `data:image/png;base64,${shark.toString('base64')}`;

/** An image from `public/`, in any format, ready to drop into an image. */
export async function publicImage(file: string) {
  const png = await sharp(join(process.cwd(), 'public', file))
    .png()
    .toBuffer();
  return `data:image/png;base64,${png.toString('base64')}`;
}

/**
 * Someone's upload as a square PNG, since images can't be drawn from every
 * format an upload might be in. Null if it can't be had in time.
 */
export async function toOgImage(url: string, size: number) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (!response.ok) return null;
    const png = await sharp(Buffer.from(await response.arrayBuffer()))
      .resize(size, size, { fit: 'cover' })
      .png()
      .toBuffer();
    return `data:image/png;base64,${png.toString('base64')}`;
  } catch {
    return null;
  }
}

const BUBBLES = [
  { left: 640, top: 70, size: 22 },
  { left: 680, top: 140, size: 12 },
  { left: 1132, top: 536, size: 28 },
  { left: 1112, top: 392, size: 14 },
  { left: 600, top: 520, size: 16 },
];

/** Where the frame sits: just inside the edges, with round corners. */
const FRAME = {
  position: 'absolute',
  left: 20,
  top: 20,
  width: OG_SIZE.width - 40,
  height: OG_SIZE.height - 40,
  borderRadius: 32,
} as const;

/** The deep blue water every shared image is set in. */
export function Ocean({ children, footer }: { children: React.ReactNode; footer: string }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Geist',
        color: '#f4f9ff',
        // Light falling through the water, over the deep
        backgroundImage:
          'radial-gradient(circle at 82% 22%, rgba(140, 200, 255, 0.4) 0%, rgba(140, 200, 255, 0) 45%), linear-gradient(135deg, #062a52 0%, #0a4a8f 55%, #1d78d6 100%)',
      }}
    >
      {/* Waves rolling in along the bottom, kept inside the frame */}
      <div style={{ ...FRAME, display: 'flex', overflow: 'hidden' }}>
        <svg width='1200' height='200' viewBox='0 0 1200 200' style={{ position: 'absolute', left: -FRAME.left, bottom: 0 }}>
          <path d='M0 80 C 150 45, 300 45, 450 80 S 760 130, 900 120 S 1120 92, 1200 86 V 200 H 0 Z' fill='rgba(140, 200, 255, 0.08)' />
          <path d='M0 110 C 200 85, 350 85, 550 112 S 860 158, 1000 148 S 1150 122, 1200 116 V 200 H 0 Z' fill='rgba(140, 200, 255, 0.09)' />
          {/* The deepest one runs high enough on the left to hold the link */}
          <path d='M0 136 C 200 126, 400 126, 620 142 S 940 182, 1060 170 S 1170 150, 1200 146 V 200 H 0 Z' fill='rgba(4, 24, 50, 0.4)' />
        </svg>
      </div>
      {BUBBLES.map((bubble, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: bubble.left,
            top: bubble.top,
            width: bubble.size,
            height: bubble.size,
            borderRadius: 9999,
            border: '2px solid rgba(220, 238, 255, 0.5)',
            background: 'rgba(220, 238, 255, 0.12)',
          }}
        />
      ))}
      {children}
      <div
        style={{
          position: 'absolute',
          left: 84,
          bottom: 42,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          // A long link (a long username's page) a touch smaller, so its end stays clear of where the wave dips
          fontSize: footer.length > 30 ? 20 : 24,
          fontWeight: 600,
          color: '#f4f9ff',
          // Lifts it off the waves behind
          textShadow: '0 2px 10px rgba(2, 20, 45, 0.8)',
        }}
      >
        <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='#8cc8ff' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
          <path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' />
          <path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' />
        </svg>
        {footer}
      </div>
      {/* A frame, so it sits like a card wherever it's shown */}
      <div style={{ ...FRAME, border: '2px solid rgba(220, 238, 255, 0.22)' }} />
    </div>
  );
}

/** The text side of an image: the space left of whatever's pictured, and above the waves. */
export function OgText({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 0 155px 84px', width: 640 }}>{children}</div>;
}

export function OgPill({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 12,
        padding: '10px 22px',
        borderRadius: 9999,
        background: 'rgba(255, 255, 255, 0.12)',
        border: '1px solid rgba(255, 255, 255, 0.22)',
        fontSize: 24,
        fontWeight: 600,
        letterSpacing: 2,
        textTransform: 'uppercase',
      }}
    >
      <svg width='24' height='24' viewBox='0 0 24 24' fill='#ed3867'>
        <path d='M12 21s-7.5-4.6-10-9.3C.3 8.2 2.4 4 6.4 4c2.3 0 3.9 1.3 5.6 3.2C13.7 5.3 15.3 4 17.6 4c4 0 6.1 4.2 4.4 7.7C19.5 16.4 12 21 12 21z' />
      </svg>
      {children}
    </div>
  );
}
