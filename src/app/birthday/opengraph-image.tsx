import { ImageResponse } from 'next/og';

import { SITE_NAME } from '@/constants/metadata';

import { getBirthdayStats } from '@/lib/birthday';
import {
  Ocean,
  OG_FONTS,
  OG_HEADERS,
  OG_SIZE,
  OgPill,
  OgText,
  publicImage,
} from '@/lib/og';

export const alt = `${SITE_NAME}'s birthday: a Blåhaj hugging, with how many sharks, hearts and matches there have been so far.`;
export const size = OG_SIZE;
export const contentType = 'image/png';

const hug = await publicImage('blahajHug.webp');

const ordinal = (n: number) => {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  return `${n}${['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`;
};

/** Bits of confetti around the shark, as on the page. */
const CONFETTI = [
  { left: 700, top: 90, color: '#f472b6' },
  { left: 1080, top: 120, color: '#fcd34d' },
  { left: 760, top: 400, color: '#7dd3fc' },
  { left: 1110, top: 360, color: '#f472b6' },
  { left: 930, top: 70, color: '#7dd3fc' },
  { left: 990, top: 440, color: '#fcd34d' },
];

/** The birthday page shared: the hugging shark in confetti, and the numbers. */
export default async function Image() {
  const stats = await getBirthdayStats();
  const n = (value: number, one: string, many: string) =>
    `${value.toLocaleString('en-US')} ${value === 1 ? one : many}`;

  return new ImageResponse(
    <Ocean footer='tinderhaj.com/birthday'>
      <OgText>
        <OgPill>{`${ordinal(stats.birthday.number)} birthday`}</OgPill>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 28,
            fontSize: 84,
            fontWeight: 900,
            letterSpacing: -3,
            lineHeight: 1.02,
          }}
        >
          <span>Happy birthday,</span>
          <span style={{ color: '#8cc8ff' }}>{SITE_NAME}!</span>
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 20,
            fontSize: 30,
            fontWeight: 600,
            color: 'rgba(244, 249, 255, 0.85)',
          }}
        >
          {`${n(stats.sharks, 'shark', 'sharks')} · ${n(stats.hearts, 'heart', 'hearts')} · ${n(stats.matches, 'match', 'matches')}`}
        </div>
      </OgText>

      {CONFETTI.map((piece, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: piece.left,
            top: piece.top,
            width: 16,
            height: 16,
            borderRadius: index % 2 ? 9999 : 3,
            background: piece.color,
            transform: `rotate(${index * 25}deg)`,
          }}
        />
      ))}

      {/* The hugging shark, as on the page's card */}
      <div
        style={{ position: 'absolute', left: 730, top: 130, display: 'flex' }}
      >
        <img src={hug} width={360} height={360} alt='' />
      </div>
    </Ocean>,
    { ...OG_SIZE, fonts: OG_FONTS, headers: OG_HEADERS }
  );
}
