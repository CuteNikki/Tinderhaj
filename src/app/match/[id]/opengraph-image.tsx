import { ImageResponse } from 'next/og';

import { SITE_NAME } from '@/constants/metadata';

import { getSharedMatch } from '@/lib/hearts';
import {
  Ocean,
  OG_FONTS,
  OG_HEADERS,
  OG_SIZE,
  OgPill,
  OgText,
  SHARK_SRC,
  toOgImage,
} from '@/lib/og';
import SiteImage from '@/app/opengraph-image';

export const alt = `Two sharks that matched on ${SITE_NAME}: their photos on two cards, a heart between them, and their names.`;
export const size = OG_SIZE;
export const contentType = 'image/png';

const AVATAR = 250;
// Clear of the cards, tilted as they are.
const TEXT_WIDTH = 500;

/** Where each card sits, and how it leans: toward each other. */
const CARDS = [
  { left: 628, top: 92, rotate: -7 },
  { left: 862, top: 150, rotate: 6 },
];

/** A shared match: both sharks' photos on cards leaning together, and their names. */
export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const match = await getSharedMatch(id);
  if (!match) return SiteImage();

  const sharks = match.sharks;
  const srcs = await Promise.all(
    sharks.map((shark) => shark.avatarUrl && toOgImage(shark.avatarUrl, AVATAR))
  );
  // Both names on lines of their own, as big as the longer one fits (each letter about 3/5 as wide as it's tall)
  const longest = Math.max(...sharks.map((shark) => shark.displayName.length));
  const nameSize = Math.max(
    44,
    Math.min(96, Math.floor(TEXT_WIDTH / ((longest + 2) * 0.6)))
  );

  return new ImageResponse(
    <Ocean footer='tinderhaj.com'>
      <OgText>
        <OgPill>It&apos;s a match</OgPill>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 28,
            fontSize: nameSize,
            fontWeight: 900,
            letterSpacing: -nameSize / 26,
            lineHeight: 1.05,
            wordBreak: 'break-word',
            maxWidth: TEXT_WIDTH,
          }}
        >
          <span>{sharks[0].displayName}</span>
          <span style={{ color: '#8cc8ff' }}>
            &amp; {sharks[1].displayName}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 20,
            fontSize: 28,
            fontWeight: 600,
            color: 'rgba(244, 249, 255, 0.78)',
            maxWidth: TEXT_WIDTH,
          }}
        >
          {`@${sharks[0].user.username} · @${sharks[1].user.username}`}
        </div>
      </OgText>

      {CARDS.map((card, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: card.left,
            top: card.top,
            transform: `rotate(${card.rotate}deg)`,
            display: 'flex',
            padding: 14,
            borderRadius: 28,
            // As the shark's own image's card: frosted, but solid
            background:
              'linear-gradient(135deg, rgb(84, 142, 204) 0%, rgb(100, 164, 230) 100%)',
            border: '1px solid rgba(220, 238, 255, 0.5)',
            boxShadow: '0 24px 48px rgba(2, 20, 45, 0.3)',
          }}
        >
          {srcs[i] ? (
            <img
              src={srcs[i]}
              width={AVATAR}
              height={AVATAR}
              alt=''
              style={{ borderRadius: 18 }}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: AVATAR,
                height: AVATAR,
                borderRadius: 18,
                background: 'rgba(220, 238, 255, 0.25)',
              }}
            >
              <img
                src={SHARK_SRC}
                width={AVATAR - 40}
                height={AVATAR - 40}
                alt=''
              />
            </div>
          )}
        </div>
      ))}

      {/* The heart, where the two cards meet */}
      <div
        style={{
          position: 'absolute',
          left: 852,
          top: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 96,
          height: 96,
          borderRadius: 9999,
          background: '#f4f9ff',
          boxShadow: '0 12px 28px rgba(2, 20, 45, 0.3)',
          transform: 'rotate(-8deg)',
        }}
      >
        <svg width='54' height='54' viewBox='0 0 24 24' fill='#ed3867'>
          <path d='M12 21s-7.5-4.6-10-9.3C.3 8.2 2.4 4 6.4 4c2.3 0 3.9 1.3 5.6 3.2C13.7 5.3 15.3 4 17.6 4c4 0 6.1 4.2 4.4 7.7C19.5 16.4 12 21 12 21z' />
        </svg>
      </div>
    </Ocean>,
    { ...OG_SIZE, fonts: OG_FONTS, headers: OG_HEADERS }
  );
}
