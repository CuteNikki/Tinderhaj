import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedData: Prisma.UserCreateInput[] = [
  {
    username: 'ocean_swimmer',
    displayName: 'Blue Blahaj',
    avatarUrl: 'https://placehold.co/512x512/webp?text=OS',
    bannerUrl: 'https://placehold.co/1024x512/webp?text=Blue+Blahaj',
    birthday: new Date('2023-01-01'),
    pronouns: 'they/them',
    location: 'IKEA Shelf 3',
    interests: ['Swimming', 'Cuddles', 'Movies'],
    bio: 'Loves swimming and cuddles. Looking for a long-term relationship.',
  },
  {
    username: 'tooth_fairy',
    displayName: 'Sharky',
    avatarUrl: 'https://placehold.co/512x512/webp?text=TF',
    bannerUrl: 'https://placehold.co/1024x512/webp?text=Sharky',
    birthday: new Date('2024-01-01'),
    pronouns: 'he/him',
    location: 'Bedroom Corner',
    interests: ['Bathtubs', 'Sunbathing', 'Reading'],
    bio: 'New to the dating scene. Enjoys long floats in the bathtub and window sunbathing.',
  },
  {
    username: 'bubble_trouble',
    displayName: 'Bubbles',
    avatarUrl: 'https://placehold.co/512x512/webp?text=BT',
    bannerUrl: 'https://placehold.co/1024x512/webp?text=Bubbles',
    birthday: new Date('2022-01-01'),
    pronouns: 'she/her',
    location: 'Living Room Couch',
    interests: ['Netflix', 'Cuddling', 'Travel'],
    bio: 'Experienced cuddler seeking same. Must love Netflix and chill(y waters).',
  },
  {
    username: 'fin_tastic',
    displayName: 'Finley',
    avatarUrl: 'https://placehold.co/512x512/webp?text=FT',
    bannerUrl: 'https://placehold.co/1024x512/webp?text=Finley',
    birthday: new Date('2023-01-01'),
    pronouns: 'he/they',
    location: 'Backpack Ready',
    interests: ['Adventure', 'Hiking', 'Photography'],
    bio: "Adventure seeker looking for a Blahaj to explore the world with. Let's make waves together!",
  },
  {
    username: 'coral_reef',
    displayName: 'Coral',
    avatarUrl: 'https://placehold.co/512x512/webp?text=CR',
    bannerUrl: 'https://placehold.co/1024x512/webp?text=Coral',
    birthday: new Date('2024-01-01'),
    pronouns: 'she/they',
    location: 'Craft Room',
    interests: ['Art', 'Crafting', 'Music'],
    bio: 'Artistic soul who loves crafting and creating. Looking for someone to share cozy nights with.',
  },
  {
    username: 'captain_of_cuddles',
    displayName: 'Captain Blue',
    avatarUrl: 'https://placehold.co/512x512/webp?text=CB',
    bannerUrl: 'https://placehold.co/1024x512/webp?text=Captain+Blue',
    birthday: new Date('2020-01-01'),
    pronouns: 'he/him',
    location: 'Study Room',
    interests: ['Philosophy', 'Wisdom', 'Tea'],
    bio: 'Oldest shark in the sea. Wise, patient, and great at giving advice. Seeking meaningful connection.',
  },
  {
    username: 'barnacle_buddy',
    displayName: 'Barnacle Buddy',
    avatarUrl: 'https://placehold.co/512x512/webp?text=BB',
    bannerUrl: 'https://placehold.co/1024x512/webp?text=Barnacle+Buddy',
    birthday: new Date('2021-01-01'),
    pronouns: 'they/them',
    location: 'Under the Sea',
    interests: ['Coral', 'Seaweed', 'Sunken Ships'],
    bio: 'Loyal companion seeking a friend to explore the ocean with. Loves to stick around and chat.',
  },
  {
    username: 'splash_attack',
    displayName: 'Splash',
    avatarUrl: 'https://placehold.co/512x512/webp?text=SA',
    bannerUrl: 'https://placehold.co/1024x512/webp?text=Splash',
    birthday: new Date('2024-01-01'),
    pronouns: 'they/them',
    location: 'Playroom',
    interests: ['Games', 'Sports', 'Dancing'],
    bio: 'Energetic and playful. Love games and being tossed around. Looking for an active partner!',
  },
  {
    username: 'misty_waters',
    displayName: 'Misty',
    avatarUrl: 'https://placehold.co/512x512/webp?text=MW',
    bannerUrl: 'https://placehold.co/1024x512/webp?text=Misty',
    birthday: new Date('2023-01-01'),
    pronouns: 'she/her',
    location: 'Window Sill',
    interests: ['Poetry', 'Daydreaming', 'Snacks'],
    bio: 'Dreamer and poet. Often found gazing out windows contemplating the meaning of life... and snacks.',
  },
];

(async () => {
  await prisma.user.deleteMany();

  for (const data of seedData) {
    await prisma.user.upsert({
      where: { username: data.username },
      update: data,
      create: data,
    });
  }
})();
