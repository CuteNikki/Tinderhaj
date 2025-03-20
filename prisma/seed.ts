import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedData: Prisma.UserCreateInput[] = [
  {
    username: 'nikki',
    display_name: 'Nikki',
  },
  {
    username: 'jake',
    display_name: 'Jake',
  },
  {
    username: 'jane',
    display_name: 'Jane',
  },
  {
    username: 'joe',
    display_name: 'Joe',
  },
  {
    username: 'jill',
    display_name: 'Jill',
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
