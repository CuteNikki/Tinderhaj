import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedData: Prisma.UserCreateInput[] = [
  {
    username: 'nikki',
    display_name: 'Nikki',
    avatar_url: 'https://placehold.co/80x80/webp?text=N',
    pronouns: 'she/her',
    birthday: new Date('2004-09-26'),
    description: 'I am a software engineer.',
  },
  {
    username: 'jake',
    display_name: 'Jake',
    avatar_url: 'https://placehold.co/80x80/webp?text=J',
    pronouns: 'he/him',
    birthday: new Date('2000-01-01'),
    description: 'Hey, am Jake!',
  },
  {
    username: 'jane',
    display_name: 'Jane',
    avatar_url: 'https://placehold.co/80x80/webp?text=J',
    pronouns: 'she/her',
    birthday: new Date('1999-12-31'),
    description: 'I like plushies',
  },
  {
    username: 'joe',
    display_name: 'Joe',
    avatar_url: 'https://placehold.co/80x80/webp?text=J',
    pronouns: 'he/him',
    birthday: new Date('1999-12-30'),
    description: 'no idea what to put here',
  },
  {
    username: 'jill',
    display_name: 'Jill',
    avatar_url: 'https://placehold.co/80x80/webp?text=J',
    pronouns: 'she/her',
    birthday: new Date('1999-12-29'),
    description: 'another description',
  },
  {
    username: 'john',
    display_name: 'John',
    avatar_url: 'https://placehold.co/80x80/webp?text=J',
    pronouns: 'he/him',
    birthday: new Date('1999-12-28'),
    description: 'Peach Cat is the best!',
  },
  {
    username: 'jess',
    display_name: 'Jess',
    avatar_url: 'https://placehold.co/80x80/webp?text=J',
    pronouns: 'she/her',
    birthday: new Date('1999-12-27'),
    description: 'Not a mom',
  },
  {
    username: 'james',
    display_name: 'James',
    avatar_url: 'https://placehold.co/80x80/webp?text=J',
    pronouns: 'he/him',
    birthday: new Date('1999-12-26'),
    description: 'Morning person',
  },
  {
    username: 'jenny',
    display_name: 'Jenny',
    avatar_url: 'https://placehold.co/80x80/webp?text=J',
    pronouns: 'she/her',
    birthday: new Date('1999-12-25'),
    description: 'Night owl',
  },
  {
    username: 'julia',
    display_name: 'Julia',
    avatar_url: 'https://placehold.co/80x80/webp?text=J',
    pronouns: 'she/her',
    birthday: new Date('1999-12-24'),
    description: 'I like to read',
  },
  {
    username: 'jacob',
    display_name: 'Jacob',
    avatar_url: 'https://placehold.co/80x80/webp?text=J',
    pronouns: 'he/him',
    birthday: new Date('1999-12-23'),
    description: 'I like to write',
  },
  {
    username: 'julie',
    display_name: 'Julie',
    avatar_url: 'https://placehold.co/80x80/webp?text=J',
    pronouns: 'she/her',
    birthday: new Date('1999-12-22'),
    description: 'I like to draw',
  },
  {
    username: 'josh',
    display_name: 'Josh',
    avatar_url: 'https://placehold.co/80x80/webp?text=J',
    pronouns: 'he/him',
    birthday: new Date('1999-12-21'),
    description: 'I am a big fan of cats',
  },
  {
    username: 'julian',
    display_name: 'Julian',
    avatar_url: 'https://placehold.co/80x80/webp?text=J',
    pronouns: 'he/him',
    birthday: new Date('1999-12-20'),
    description: 'I am a big fan of dogs',
  },
  {
    username: 'jordan',
    display_name: 'Jordan',
    avatar_url: 'https://placehold.co/80x80/webp?text=J',
    pronouns: 'he/him',
    birthday: new Date('1999-12-19'),
    description: 'Cats are better',
  },
];

(async () => {
  for (const data of seedData) {
    await prisma.user.upsert({
      where: { username: data.username },
      update: {},
      create: data,
    });
  }
})();
