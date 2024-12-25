import Image from 'next/image';

export const features = {
  title: 'Why Choose Tinderhaj?',
  cards: [
    {
      icon: <Image src='/blahajHeart.webp' alt='Blåhaj Heart' unoptimized width={48} height={48} />,
      title: 'Exclusive Blåhaj Community',
      description: 'Connect with fellow Blåhaj lovers from around the world.',
    },
    {
      icon: <Image src='/blahajThink.webp' alt='Blåhaj Think' unoptimized width={48} height={48} />,
      title: 'Shark-Friendly Interface',
      description: 'Our site is designed with Blåhaj in mind, making navigation a breeze.',
    },
    {
      icon: <Image src='/blahajHug.webp' alt='Blåhaj Hug' unoptimized width={48} height={48} />,
      title: 'Group Swims',
      description: 'Organize Blåhaj meetups and group activities with your matches.',
    },
  ],
};

export const signUp = {
  title: 'Ready to Find Your Blåhaj Soulmate?',
  description: 'Join Tinderhaj today and start your journey to plushie love!',
  action: 'Sign Up',
};

export const hero = {
  title: 'Find Your Perfect Blåhaj Match',
  description: "The world's first dating site exclusively for Blåhaj!",
  action: 'Dive In Now',
  image: {
    src: '/blahajCouple.webp',
    alt: 'Blåhaj Couple',
  },
};
