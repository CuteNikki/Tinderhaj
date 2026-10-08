import { ImageResponse } from 'next/og';

import { SITE_NAME } from '@/constants/metadata';
import { getUserPage } from '@/lib/hearts';
import { OG_FONTS, OG_SIZE, Ocean, OgPill, OgText, SHARK_SRC, toOgImage } from '@/lib/og';

import SiteImage from '@/app/opengraph-image';

export const alt = `Someone’s sharks on ${SITE_NAME}, shown as photos fanned out like cards.`;
export const size = OG_SIZE;
export const contentType = 'image/png';

const AVATAR = 232;
// Clear of the fan's leftmost card.
const TEXT_WIDTH = 460;

/** Where each of up to three sharks lies in the fan, by how many there are. */
const FANS = [
  [],
  [{ left: 785, top: 150, rotate: 5 }],
  [
    { left: 665, top: 125, rotate: -7 },
    { left: 870, top: 160, rotate: 8 },
  ],
  [
    { left: 600, top: 165, rotate: -10 },
    { left: 880, top: 175, rotate: 11 },
    { left: 740, top: 115, rotate: 1 },
  ],
];

/** Someone's page when it's shared: their name and a fan of their sharks. */
export default async function Image({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  // As anyone would see it, so a banned account's page shares like any other.
  const page = await getUserPage(decodeURIComponent(username), null);
  if (!page) return SiteImage();

  const { user, sharks } = page;
  const shown = await Promise.all(
    sharks.slice(0, 3).map(async (shark) => ({
      name: shark.displayName,
      src: (shark.avatarUrl && (await toOgImage(shark.avatarUrl, AVATAR))) || null,
    })),
  );
  // The next few beyond the fan, by name, and how many past those.
  const more = sharks.slice(3, 5).map((shark) => shark.displayName);
  const rest = sharks.length - 3 - more.length;
  const fan = FANS[shown.length];
  const handle = `@${user.username}`;
  // As big as fits on one line of the text side (each letter about 3/4 as wide as it's tall); longer ones wrap.
  const handleSize = Math.max(40, Math.min(112, Math.floor(TEXT_WIDTH / (handle.length * 0.75))));

  return new ImageResponse(
    <Ocean footer={`tinderhaj.com/u/${user.username}`}>
      <OgText>
        <OgPill>Sharks on {SITE_NAME}</OgPill>
        <div
          style={{
            display: 'flex',
            marginTop: 28,
            fontSize: handleSize,
            fontWeight: 900,
            letterSpacing: -handleSize / 26,
            lineHeight: 1.05,
            // Between words where it can, and only mid-word for a name too long for a line
            wordBreak: 'break-word',
            maxWidth: TEXT_WIDTH,
          }}
        >
          {handle.replaceAll('_', '_​')}
        </div>
        <div style={{ display: 'flex', marginTop: 16, fontSize: 44, fontWeight: 900, letterSpacing: -1, color: '#8cc8ff' }}>
          {sharks.length === 0 ? 'No sharks here yet.' : sharks.length === 1 ? '1 shark to meet.' : `${sharks.length} sharks to meet.`}
        </div>
        <div style={{ display: 'flex', marginTop: 20, fontSize: 28, fontWeight: 600, color: 'rgba(244, 249, 255, 0.78)' }}>
          Joined {user.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.
        </div>
        {more.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 24, maxWidth: TEXT_WIDTH }}>
            {more.map((name, i) => (
              <Chip key={i}>{name}</Chip>
            ))}
            {rest > 0 && <Chip muted>{`+${rest} more`}</Chip>}
          </div>
        )}
      </OgText>

      {shown.length === 0 ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={SHARK_SRC} width={560} height={560} alt='' style={{ position: 'absolute', right: -10, top: 40, transform: 'rotate(8deg)' }} />
      ) : (
        shown.map((shark, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: fan[i].left,
              top: fan[i].top,
              transform: `rotate(${fan[i].rotate}deg)`,
              display: 'flex',
              flexDirection: 'column',
              width: AVATAR + 28,
              padding: 14,
              borderRadius: 28,
              // Frosted like the site image's cards, but solid, so the cards beneath don't show through
              background: 'linear-gradient(135deg, rgb(84, 142, 204) 0%, rgb(100, 164, 230) 100%)',
              border: '1px solid rgba(220, 238, 255, 0.5)',
              boxShadow: '0 24px 48px rgba(2, 20, 45, 0.3)',
            }}
          >
            {shark.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={shark.src} width={AVATAR} height={AVATAR} alt='' style={{ borderRadius: 18 }} />
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={SHARK_SRC} width={AVATAR - 30} height={AVATAR - 30} alt='' />
              </div>
            )}
            <div
              style={{
                display: 'block',
                marginTop: 12,
                padding: '0 4px',
                fontSize: 28,
                fontWeight: 900,
                letterSpacing: -0.5,
                color: '#f4f9ff',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {shark.name}
            </div>
          </div>
        ))
      )}
    </Ocean>,
    { ...OG_SIZE, fonts: OG_FONTS },
  );
}

function Chip({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <div
      style={{
        display: 'block',
        maxWidth: 240,
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
