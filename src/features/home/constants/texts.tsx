import { HeartIcon, UsersIcon, WavesIcon } from 'lucide-react';

export const features = {
  title: 'Why Choose Tinderhaj?',
  cards: [
    {
      icon: <HeartIcon className='h-12 w-12 text-red-500' />,
      title: 'Exclusive Blåhaj Community',
      description: 'Connect with fellow Blåhaj lovers from around the world.',
    },
    {
      icon: <WavesIcon className='h-12 w-12 text-blue-400' />,
      title: 'Shark-Friendly Interface',
      description: 'Our app is designed with Blåhaj in mind, making navigation a breeze.',
    },
    {
      icon: <UsersIcon className='h-12 w-12 text-green-500' />,
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
    src: '/blahaj_couple.webp',
    alt: 'Blåhaj Couple',
  },
};
