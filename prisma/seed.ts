import { PrismaPg } from '@prisma/adapter-pg';

import { AccountRole, Prisma, PrismaClient, ProfileStatus, SizeUnit } from '@/generated/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

/** Owns every seeded shark. Without a password, so nobody can sign in to it. */
const SYSTEM_USER = {
  username: 'system',
  email: 'system@tinderhaj.com',
  role: AccountRole.USER,
} satisfies Prisma.UserCreateInput;

const SHARKS: Omit<Prisma.ProfileUncheckedCreateInput, 'userId'>[] = [
  {
    displayName: 'Bubbles',
    avatarUrl: 'https://placehold.co/512x512/33FF57/FFFFFF/webp?text=B',
    bannerUrl: 'https://placehold.co/1144x572/33FF57/FFFFFF/webp?text=Bubbles',
    birthday: new Date('2021-01-01'),
    size: 100.0,
    unit: SizeUnit.CM,
    pronouns: 'they/them',
    location: 'IKEA Shelf 3',
    interests: ['Swimming', 'Cuddles', 'Movies'],
    bio: 'Loves swimming and cuddles. Looking for a long-term relationship.',
    status: ProfileStatus.VERIFIED,
  },
  {
    displayName: 'Finley',
    avatarUrl: 'https://placehold.co/512x512/3357FF/FFFFFF/webp?text=F',
    bannerUrl: 'https://placehold.co/1144x572/3357FF/FFFFFF/webp?text=Finley',
    birthday: new Date('2023-01-01'),
    size: 55.0,
    unit: SizeUnit.CM,
    pronouns: 'he/they',
    location: 'Backpack Ready',
    interests: ['Adventure', 'Hiking', 'Photography'],
    bio: "Adventure seeker looking for a Blåhaj to explore the world with. Let's make waves together!",
    status: ProfileStatus.VERIFIED,
  },
  {
    displayName: 'Sharky',
    avatarUrl: 'https://placehold.co/512x512/FF5733/FFFFFF/webp?text=S',
    bannerUrl: 'https://placehold.co/1144x572/FF5733/FFFFFF/webp?text=Sharky',
    birthday: new Date('2024-01-01'),
    size: 55.0,
    unit: SizeUnit.CM,
    pronouns: 'he/him',
    location: 'Bedroom Corner',
    interests: ['Bathtubs', 'Sunbathing', 'Reading'],
    bio: 'New to the dating scene. Enjoys long floats in the bathtub and window sunbathing.',
    status: ProfileStatus.VERIFIED,
  },
  {
    displayName: 'Blue Blåhaj',
    avatarUrl: 'https://placehold.co/512x512/5733FF/FFFFFF/webp?text=BB',
    bannerUrl: 'https://placehold.co/1144x572/5733FF/FFFFFF/webp?text=Blue+Blåhaj',
    birthday: new Date('2022-01-01'),
    size: 100.0,
    unit: SizeUnit.CM,
    pronouns: 'she/her',
    location: 'Living Room Couch',
    interests: ['Netflix', 'Cuddling', 'Travel'],
    bio: 'Experienced cuddler seeking same. Must love Netflix and chill(y waters).',
    status: ProfileStatus.VERIFIED,
  },
  {
    displayName: 'Coral',
    avatarUrl: 'https://placehold.co/512x512/FF33A1/FFFFFF/webp?text=C',
    bannerUrl: 'https://placehold.co/1144x572/FF33A1/FFFFFF/webp?text=Coral',
    birthday: new Date('2024-01-01'),
    size: 55.0,
    unit: SizeUnit.CM,
    pronouns: 'she/they',
    location: 'Craft Room',
    interests: ['Art', 'Crafting', 'Music'],
    bio: 'Artistic soul who loves crafting and creating. Looking for someone to share cozy nights with.',
    status: ProfileStatus.VERIFIED,
  },
  {
    displayName: 'Captain Blue',
    avatarUrl: 'https://placehold.co/512x512/33FFF5/FFFFFF/webp?text=CB',
    bannerUrl: 'https://placehold.co/1144x572/33FFF5/FFFFFF/webp?text=Captain+Blue',
    birthday: new Date('2020-01-01'),
    size: 100.0,
    unit: SizeUnit.CM,
    pronouns: 'he/him',
    location: 'Study Room',
    interests: ['Philosophy', 'Wisdom', 'Tea'],
    bio: 'Oldest shark in the sea. Wise, patient, and great at giving advice. Seeking meaningful connection.',
    status: ProfileStatus.VERIFIED,
  },
  {
    displayName: 'Barnacle Buddy',
    avatarUrl: 'https://placehold.co/512x512/FF5733/FFFFFF/webp?text=BB',
    bannerUrl: 'https://placehold.co/1144x572/FF5733/FFFFFF/webp?text=Barnacle+Buddy',
    birthday: new Date('2021-01-01'),
    size: 100.0,
    unit: SizeUnit.CM,
    pronouns: 'they/them',
    location: 'Under the Sea',
    interests: ['Coral', 'Seaweed', 'Sunken Ships'],
    bio: 'Loyal companion seeking a friend to explore the ocean with. Loves to stick around and chat.',
    status: ProfileStatus.VERIFIED,
  },
  {
    displayName: 'Splash',
    avatarUrl: 'https://placehold.co/512x512/5733FF/FFFFFF/webp?text=S',
    bannerUrl: 'https://placehold.co/1144x572/5733FF/FFFFFF/webp?text=Splash',
    birthday: new Date('2024-01-01'),
    size: 55.0,
    unit: SizeUnit.CM,
    pronouns: 'they/them',
    location: 'Playroom',
    interests: ['Games', 'Sports', 'Dancing'],
    bio: 'Energetic and playful. Love games and being tossed around. Looking for an active partner!',
    status: ProfileStatus.VERIFIED,
  },
  {
    displayName: 'Misty',
    avatarUrl: 'https://placehold.co/512x512/FF33A1/FFFFFF/webp?text=M',
    bannerUrl: 'https://placehold.co/1144x572/FF33A1/FFFFFF/webp?text=Misty',
    birthday: new Date('2023-01-01'),
    size: 55.0,
    unit: SizeUnit.CM,
    pronouns: 'she/her',
    location: 'Window Sill',
    interests: ['Poetry', 'Daydreaming', 'Snacks'],
    bio: 'Dreamer and poet. Often found gazing out windows contemplating the meaning of life... and snacks.',
    status: ProfileStatus.VERIFIED,
  },
];

/**
 * Adds the system account and its sharks, or puts them back as they are
 * here. Changes nothing else, so it's safe to run on a database with real
 * accounts in it, and to run again.
 */
const system = await prisma.user.upsert({
  where: { email: SYSTEM_USER.email },
  update: SYSTEM_USER,
  create: SYSTEM_USER,
});

// Matched by name, as sharks have no other fixed handle.
for (const shark of SHARKS) {
  const existing = await prisma.profile.findFirst({ where: { userId: system.id, displayName: shark.displayName }, select: { id: true } });

  if (existing) await prisma.profile.update({ where: { id: existing.id }, data: shark });
  else await prisma.profile.create({ data: { ...shark, userId: system.id } });
}

await prisma.$disconnect();
