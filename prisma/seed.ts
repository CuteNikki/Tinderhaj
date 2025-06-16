import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Recommended banner size: 1200x600 2:1
// Recommended avatar size: 512x512 1:1

const seedData: Prisma.AccountCreateInput[] = [
  {
    username: 'bubble_trouble',
    email: 'bubble_trouble@tinderhaj.com',
    password: 'some_secret123',
    salt: '',
    canVerify: false,
    Profile: {
      create: {
        displayName: 'Bubbles',
        avatarUrl: 'https://placehold.co/512x512/33FF57/FFFFFF/webp?text=BT',
        bannerUrl: 'https://placehold.co/1144x572/33FF57/FFFFFF/webp?text=Bubbles',
        birthday: new Date('2021-01-01'),
        size: 100.0,
        pronouns: 'they/them',
        location: 'IKEA Shelf 3',
        interests: ['Swimming', 'Cuddles', 'Movies'],
        bio: 'Loves swimming and cuddles. Looking for a long-term relationship.',
        isVerified: true,
      },
    },
  },
  {
    username: 'fin_tastic',
    email: 'fin_tastic@tinderhaj.com',
    password: 'some_secret123',
    salt: '',
    canVerify: false,
    Profile: {
      create: {
        displayName: 'Finley',
        avatarUrl: 'https://placehold.co/512x512/3357FF/FFFFFF/webp?text=FT',
        bannerUrl: 'https://placehold.co/1144x572/3357FF/FFFFFF/webp?text=Finley',
        birthday: new Date('2023-01-01'),
        size: 55.0,
        pronouns: 'he/they',
        location: 'Backpack Ready',
        interests: ['Adventure', 'Hiking', 'Photography'],
        bio: "Adventure seeker looking for a Blåhaj to explore the world with. Let's make waves together!",
        isVerified: true,
      },
    },
  },
  {
    username: 'tooth_fairy',
    email: 'tooth_fairy@tinderhaj.com',
    password: 'some_secret123',
    salt: '',
    canVerify: false,
    Profile: {
      create: {
        displayName: 'Sharky',
        avatarUrl: 'https://placehold.co/512x512/FF5733/FFFFFF/webp?text=TF',
        bannerUrl: 'https://placehold.co/1144x572/FF5733/FFFFFF/webp?text=Sharky',
        birthday: new Date('2024-01-01'),
        size: 55.0,
        pronouns: 'he/him',
        location: 'Bedroom Corner',
        interests: ['Bathtubs', 'Sunbathing', 'Reading'],
        bio: 'New to the dating scene. Enjoys long floats in the bathtub and window sunbathing.',
        isVerified: true,
      },
    },
  },
  {
    username: 'ocean_swimmer',
    email: 'ocean_swimmer@tinderhaj.com',
    password: 'some_secret123',
    salt: '',
    canVerify: false,
    Profile: {
      create: {
        displayName: 'Blue Blåhaj',
        avatarUrl: 'https://placehold.co/512x512/5733FF/FFFFFF/webp?text=OS',
        bannerUrl: 'https://placehold.co/1144x572/5733FF/FFFFFF/webp?text=Blue+Blåhaj',
        birthday: new Date('2022-01-01'),
        size: 100.0,
        pronouns: 'she/her',
        location: 'Living Room Couch',
        interests: ['Netflix', 'Cuddling', 'Travel'],
        bio: 'Experienced cuddler seeking same. Must love Netflix and chill(y waters).',
        isVerified: true,
      },
    },
  },
  {
    username: 'coral_reef',
    email: 'coral_reef@tinderhaj.com',
    password: 'some_secret123',
    salt: '',
    canVerify: false,
    Profile: {
      create: {
        displayName: 'Coral',
        avatarUrl: 'https://placehold.co/512x512/FF33A1/FFFFFF/webp?text=CR',
        bannerUrl: 'https://placehold.co/1144x572/FF33A1/FFFFFF/webp?text=Coral',
        birthday: new Date('2024-01-01'),
        size: 55.0,
        pronouns: 'she/they',
        location: 'Craft Room',
        interests: ['Art', 'Crafting', 'Music'],
        bio: 'Artistic soul who loves crafting and creating. Looking for someone to share cozy nights with.',
        isVerified: true,
      },
    },
  },
  {
    username: 'captain_of_cuddles',
    email: 'captain_of_cuddles@tinderhaj.com',
    password: 'some_secret123',
    salt: '',
    canVerify: false,
    Profile: {
      create: {
        displayName: 'Captain Blue',
        avatarUrl: 'https://placehold.co/512x512/33FFF5/FFFFFF/webp?text=CB',
        bannerUrl: 'https://placehold.co/1144x572/33FFF5/FFFFFF/webp?text=Captain+Blue',
        birthday: new Date('2020-01-01'),
        size: 100.0,
        pronouns: 'he/him',
        location: 'Study Room',
        interests: ['Philosophy', 'Wisdom', 'Tea'],
        bio: 'Oldest shark in the sea. Wise, patient, and great at giving advice. Seeking meaningful connection.',
        isVerified: true,
      },
    },
  },
  {
    username: 'barnacle_buddy',
    email: 'barnacle_buddy@tinderhaj.com',
    password: 'some_secret123',
    salt: '',
    canVerify: false,
    Profile: {
      create: {
        displayName: 'Barnacle Buddy',
        avatarUrl: 'https://placehold.co/512x512/FF5733/FFFFFF/webp?text=BB',
        bannerUrl: 'https://placehold.co/1144x572/FF5733/FFFFFF/webp?text=Barnacle+Buddy',
        birthday: new Date('2021-01-01'),
        size: 100.0,
        pronouns: 'they/them',
        location: 'Under the Sea',
        interests: ['Coral', 'Seaweed', 'Sunken Ships'],
        bio: 'Loyal companion seeking a friend to explore the ocean with. Loves to stick around and chat.',
        isVerified: true,
      },
    },
  },
  {
    username: 'splash_attack',
    email: 'splash_attack@tinderhaj.com',
    password: 'some_secret123',
    salt: '',
    canVerify: false,
    Profile: {
      create: {
        displayName: 'Splash',
        avatarUrl: 'https://placehold.co/512x512/5733FF/FFFFFF/webp?text=SA',
        bannerUrl: 'https://placehold.co/1144x572/5733FF/FFFFFF/webp?text=Splash',
        birthday: new Date('2024-01-01'),
        size: 55.0,
        pronouns: 'they/them',
        location: 'Playroom',
        interests: ['Games', 'Sports', 'Dancing'],
        bio: 'Energetic and playful. Love games and being tossed around. Looking for an active partner!',
        isVerified: true,
      },
    },
  },
  {
    username: 'misty_waters',
    email: 'misty_waters@tinderhaj.com',
    password: 'some_secret123',
    salt: '',
    canVerify: false,
    Profile: {
      create: {
        displayName: 'Misty',
        avatarUrl: 'https://placehold.co/512x512/FF33A1/FFFFFF/webp?text=MW',
        bannerUrl: 'https://placehold.co/1144x572/FF33A1/FFFFFF/webp?text=Misty',
        birthday: new Date('2023-01-01'),
        size: 55.0,
        pronouns: 'she/her',
        location: 'Window Sill',
        interests: ['Poetry', 'Daydreaming', 'Snacks'],
        bio: 'Dreamer and poet. Often found gazing out windows contemplating the meaning of life... and snacks.',
        isVerified: true,
      },
    },
  },
];

(async () => {
  await prisma.profile.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();

  for (const account of seedData) {
    await prisma.account.create({
      data: account,
    });
  }
})();
