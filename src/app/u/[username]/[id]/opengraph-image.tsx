import { ImageResponse } from 'next/og';

import { SITE_NAME } from '@/constants/metadata';
import { getSharkPage } from '@/lib/hearts';
import { OG_FONTS, OG_SIZE, Ocean, OgPill, OgText, SHARK_SRC, toOgImage } from '@/lib/og';
import { calculateAge } from '@/lib/utils';

import SiteImage from '@/app/opengraph-image';

export const alt = `A shark on ${SITE_NAME}: its photo on a card, with its name and what it likes.`;
export const size = OG_SIZE;
export const contentType = 'image/png';

const AVATAR = 340;
// Clear of the card, tilted as it is.
const TEXT_WIDTH = 520;

/** A shark's page when it's shared: its photo on a card, and its name and details beside it. */
export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // As anyone would see it, so a banned account's shark shares like any other.
  const page = await getSharkPage(id, null);
  if (!page) return SiteImage();

  const { shark } = page;
  const src = shark.avatarUrl && (await toOgImage(shark.avatarUrl, AVATAR));
  const age = calculateAge(shark.birthday);
  const facts = [
    age != null && (age === 1 ? '1 year old' : `${age} years old`),
    shark.size != null && `${shark.size}${shark.unit.toLowerCase()}`,
    shark.location,
  ].filter(Boolean);
  const interests = shark.interests.slice(0, 4);
  const rest = shark.interests.length - interests.length;
  // As big as fits on one line of the text side (each letter about 3/5 as wide as it’s tall); longer ones wrap.
  const nameSize = Math.max(48, Math.min(120, Math.floor(TEXT_WIDTH / (shark.displayName.length * 0.6))));

  return new ImageResponse(
    <Ocean footer={`tinderhaj.com/u/${shark.user.username}`}>
      <OgText>
        <OgPill>Meet me on {SITE_NAME}</OgPill>
        <div
          style={{
            display: 'flex',
            marginTop: 28,
            fontSize: nameSize,
            fontWeight: 900,
            letterSpacing: -nameSize / 26,
            lineHeight: 1.05,
            wordBreak: 'break-word',
            maxWidth: TEXT_WIDTH,
          }}
        >
          {shark.displayName}
        </div>
        <div style={{ display: 'flex', marginTop: 12, fontSize: 36, fontWeight: 900, letterSpacing: -1, color: '#8cc8ff', maxWidth: TEXT_WIDTH }}>
          {shark.pronouns ? `${shark.pronouns} · @${shark.user.username}` : `@${shark.user.username}`}
        </div>
        {facts.length > 0 && (
          <div style={{ display: 'flex', marginTop: 18, fontSize: 28, fontWeight: 600, color: 'rgba(244, 249, 255, 0.78)', maxWidth: TEXT_WIDTH }}>
            {facts.join(' · ')}
          </div>
        )}
        {interests.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 24, maxWidth: TEXT_WIDTH }}>
            {interests.map((interest, i) => (
              <Chip key={i}>{interest}</Chip>
            ))}
            {rest > 0 && <Chip muted>{`+${rest} more`}</Chip>}
          </div>
        )}
      </OgText>

      <div
        style={{
          position: 'absolute',
          left: 715,
          top: 95,
          transform: 'rotate(5deg)',
          display: 'flex',
          padding: 16,
          borderRadius: 32,
          // As the user page's cards: frosted, but solid
          background: 'linear-gradient(135deg, rgb(84, 142, 204) 0%, rgb(100, 164, 230) 100%)',
          border: '1px solid rgba(220, 238, 255, 0.5)',
          boxShadow: '0 24px 48px rgba(2, 20, 45, 0.3)',
        }}
      >
        {src ? (
          <img src={src} width={AVATAR} height={AVATAR} alt='' style={{ borderRadius: 20 }} />
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: AVATAR,
              height: AVATAR,
              borderRadius: 20,
              background: 'rgba(220, 238, 255, 0.25)',
            }}
          >
            <img src={SHARK_SRC} width={AVATAR - 40} height={AVATAR - 40} alt='' />
          </div>
        )}
      </div>

      {/* A heart, pinned to the card's corner */}
      <div
        style={{
          position: 'absolute',
          left: 1040,
          top: 70,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 88,
          height: 88,
          borderRadius: 9999,
          background: '#f4f9ff',
          boxShadow: '0 12px 28px rgba(2, 20, 45, 0.3)',
          transform: 'rotate(12deg)',
        }}
      >
        <svg width='48' height='48' viewBox='0 0 24 24' fill='#ed3867'>
          <path d='M12 21s-7.5-4.6-10-9.3C.3 8.2 2.4 4 6.4 4c2.3 0 3.9 1.3 5.6 3.2C13.7 5.3 15.3 4 17.6 4c4 0 6.1 4.2 4.4 7.7C19.5 16.4 12 21 12 21z' />
        </svg>
      </div>
    </Ocean>,
    { ...OG_SIZE, fonts: OG_FONTS },
  );
}

function Chip({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <div
      style={{
        display: 'block',
        maxWidth: 260,
        padding: '8px 18px',
        borderRadius: 9999,
        background: muted ? 'transparent' : 'rgba(150, 205, 255, 0.5)',
        border: muted ? '1px solid rgba(140, 200, 255, 0.5)' : '1px solid rgba(220, 238, 255, 0.5)',
        color: muted ? '#8cc8ff' : '#f4f9ff',
        fontSize: 24,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {children}
    </div>
  );
}
