import { ImageResponse } from 'next/og';

import { SITE_NAME, SITE_TAGLINE } from '@/constants/metadata';
import { OG_FONTS, OG_SIZE, Ocean, OgPill, OgText, publicImage } from '@/lib/og';

export const alt = `${SITE_NAME}: ${SITE_TAGLINE}. A Blåhaj plush shark next to the words “Meet sharks”.`;
export const size = OG_SIZE;
export const contentType = 'image/png';

// The hero's little extras on the home page, around our own Blåhaj.
const [shark, hug, heart] = await Promise.all([publicImage('blahajSmall.png'), publicImage('blahajHug.webp'), publicImage('blahajHeart.webp')]);

/** What a link to Tinderhaj looks like when it's shared: the home page's hero, in brief. */
export default function Image() {
  return new ImageResponse(
    <Ocean footer='tinderhaj.com'>
      <OgText>
        <OgPill>{SITE_TAGLINE}</OgPill>
        <div style={{ display: 'flex', marginTop: 28, fontSize: 120, fontWeight: 900, letterSpacing: -4.5, lineHeight: 1 }}>{SITE_NAME}</div>
        <div style={{ display: 'flex', marginTop: 8, fontSize: 64, fontWeight: 900, letterSpacing: -2, color: '#8cc8ff' }}>Meet sharks.</div>
        <div style={{ display: 'flex', marginTop: 14, fontSize: 30, fontWeight: 600, lineHeight: 1.35, color: 'rgba(244, 249, 255, 0.78)' }}>
          Find your perfect match by color, size, and squishiness.
        </div>
      </OgText>

      {/* The shark's halo, and the dashed ring around it */}
      <div
        style={{
          position: 'absolute',
          left: 720,
          top: 85,
          width: 410,
          height: 410,
          borderRadius: 9999,
          background: 'radial-gradient(circle closest-side, rgba(140, 200, 255, 0.3) 0%, rgba(140, 200, 255, 0.08) 100%)',
        }}
      />
      <div style={{ position: 'absolute', left: 697, top: 62, width: 456, height: 456, borderRadius: 9999, border: '2px dashed rgba(220, 238, 255, 0.3)' }} />

      <div
        style={{
          position: 'absolute',
          left: 752,
          top: 46,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 24px',
          borderRadius: 9999,
          background: 'rgba(150, 205, 255, 0.5)',
          border: '1px solid rgba(220, 238, 255, 0.5)',
          color: '#f4f9ff',
          fontSize: 28,
          fontWeight: 600,
          boxShadow: '0 12px 28px rgba(2, 20, 45, 0.25)',
        }}
      >
        <svg width='28' height='28' viewBox='0 0 24 24' fill='#ed3867'>
          <path d='M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.13-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.13a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.13 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.13a.5.5 0 0 1-.96 0z' />
        </svg>
        A match worth meeting
      </div>
      {/* Above the pill, peeking over it, but below the card */}
      <img src={shark} width={430} height={430} alt='' style={{ position: 'absolute', left: 706, top: 84, transform: 'rotate(6deg)' }} />

      <div
        style={{
          position: 'absolute',
          left: 1055,
          top: 165,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 84,
          height: 84,
          borderRadius: 9999,
          background: 'rgba(150, 205, 255, 0.5)',
          boxShadow: '0 12px 28px rgba(2, 20, 45, 0.3)',
          transform: 'rotate(12deg)',
        }}
      >
        <img src={heart} width={54} height={54} alt='' />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 815,
          top: 432,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '12px 26px 12px 12px',
          borderRadius: 18,
          background: 'rgba(150, 205, 255, 0.5)',
          border: '1px solid rgba(220, 238, 255, 0.5)',
          color: '#f4f9ff',
          boxShadow: '0 18px 36px rgba(2, 20, 45, 0.25)',
          transform: 'rotate(-3deg)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 68,
            height: 68,
            borderRadius: 12,
            background: 'rgba(220, 238, 255, 0.25)',
          }}
        >
          <img src={hug} width={62} height={62} alt='' />
        </div>
        <div style={{ display: 'flex', fontSize: 30, fontWeight: 900, letterSpacing: -0.5 }}>It’s a match!</div>
      </div>
    </Ocean>,
    { ...OG_SIZE, fonts: OG_FONTS },
  );
}
