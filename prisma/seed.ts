import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Recommended banner size: 1144x572 2:1
// Recommended avatar size: 512x512 1:1

const seedData: Prisma.ProfileCreateInput[] = [
  {
    username: 'bubble_trouble',
    displayName: 'Bubbles',
    avatarUrl: 'https://placehold.co/512x512/33FF57/FFFFFF/webp?text=BT',
    bannerUrl: 'https://placehold.co/1144x572/33FF57/FFFFFF/webp?text=Bubbles',
    birthday: new Date('2021-01-01'),
    size: 100.0,
    pronouns: 'they/them',
    location: 'IKEA Shelf 3',
    interests: ['Swimming', 'Cuddles', 'Movies'],
    bio: 'Loves swimming and cuddles. Looking for a long-term relationship.',
  },
  {
    username: 'fin_tastic',
    displayName: 'Finley',
    avatarUrl: 'https://placehold.co/512x512/3357FF/FFFFFF/webp?text=FT',
    bannerUrl: 'https://placehold.co/1144x572/3357FF/FFFFFF/webp?text=Finley',
    birthday: new Date('2023-01-01'),
    size: 55.0,
    pronouns: 'he/they',
    location: 'Backpack Ready',
    interests: ['Adventure', 'Hiking', 'Photography'],
    bio: "Adventure seeker looking for a Blåhaj to explore the world with. Let's make waves together!",
  },
  {
    username: 'tooth_fairy',
    displayName: 'Sharky',
    avatarUrl: 'https://placehold.co/512x512/FF5733/FFFFFF/webp?text=TF',
    bannerUrl: 'https://placehold.co/1144x572/FF5733/FFFFFF/webp?text=Sharky',
    birthday: new Date('2024-01-01'),
    size: 55.0,
    pronouns: 'he/him',
    location: 'Bedroom Corner',
    interests: ['Bathtubs', 'Sunbathing', 'Reading'],
    bio: 'New to the dating scene. Enjoys long floats in the bathtub and window sunbathing.',
  },
  {
    username: 'ocean_swimmer',
    displayName: 'Blue Blåhaj',
    avatarUrl: 'https://placehold.co/512x512/5733FF/FFFFFF/webp?text=OS',
    bannerUrl: 'https://placehold.co/1144x572/5733FF/FFFFFF/webp?text=Blue+Blåhaj',
    birthday: new Date('2022-01-01'),
    size: 100.0,
    pronouns: 'she/her',
    location: 'Living Room Couch',
    interests: ['Netflix', 'Cuddling', 'Travel'],
    bio: 'Experienced cuddler seeking same. Must love Netflix and chill(y waters).',
  },
  {
    username: 'coral_reef',
    displayName: 'Coral',
    avatarUrl: 'https://placehold.co/512x512/FF33A1/FFFFFF/webp?text=CR',
    bannerUrl: 'https://placehold.co/1144x572/FF33A1/FFFFFF/webp?text=Coral',
    birthday: new Date('2024-01-01'),
    size: 55.0,
    pronouns: 'she/they',
    location: 'Craft Room',
    interests: ['Art', 'Crafting', 'Music'],
    bio: 'Artistic soul who loves crafting and creating. Looking for someone to share cozy nights with.',
  },
  {
    username: 'captain_of_cuddles',
    displayName: 'Captain Blue',
    avatarUrl: 'https://placehold.co/512x512/33FFF5/FFFFFF/webp?text=CB',
    bannerUrl: 'https://placehold.co/1144x572/33FFF5/FFFFFF/webp?text=Captain+Blue',
    birthday: new Date('2020-01-01'),
    size: 100.0,
    pronouns: 'he/him',
    location: 'Study Room',
    interests: ['Philosophy', 'Wisdom', 'Tea'],
    bio: 'Oldest shark in the sea. Wise, patient, and great at giving advice. Seeking meaningful connection.',
  },
  {
    username: 'barnacle_buddy',
    displayName: 'Barnacle Buddy',
    avatarUrl: 'https://placehold.co/512x512/FF5733/FFFFFF/webp?text=BB',
    bannerUrl: 'https://placehold.co/1144x572/FF5733/FFFFFF/webp?text=Barnacle+Buddy',
    birthday: new Date('2021-01-01'),
    size: 100.0,
    pronouns: 'they/them',
    location: 'Under the Sea',
    interests: ['Coral', 'Seaweed', 'Sunken Ships'],
    bio: 'Loyal companion seeking a friend to explore the ocean with. Loves to stick around and chat.',
  },
  {
    username: 'splash_attack',
    displayName: 'Splash',
    avatarUrl: 'https://placehold.co/512x512/5733FF/FFFFFF/webp?text=SA',
    bannerUrl: 'https://placehold.co/1144x572/5733FF/FFFFFF/webp?text=Splash',
    birthday: new Date('2024-01-01'),
    size: 55.0,
    pronouns: 'they/them',
    location: 'Playroom',
    interests: ['Games', 'Sports', 'Dancing'],
    bio: 'Energetic and playful. Love games and being tossed around. Looking for an active partner!',
  },
  {
    username: 'misty_waters',
    displayName: 'Misty',
    avatarUrl: 'https://placehold.co/512x512/FF33A1/FFFFFF/webp?text=MW',
    bannerUrl: 'https://placehold.co/1144x572/FF33A1/FFFFFF/webp?text=Misty',
    birthday: new Date('2023-01-01'),
    size: 55.0,
    pronouns: 'she/her',
    location: 'Window Sill',
    interests: ['Poetry', 'Daydreaming', 'Snacks'],
    bio: 'Dreamer and poet. Often found gazing out windows contemplating the meaning of life... and snacks.',
  },
];

(async () => {
  await prisma.profile.deleteMany();

  for (const data of seedData) {
    await prisma.profile.upsert({
      where: { username: data.username },
      update: data,
      create: data,
    });
  }
})();
