import { HeartIcon, UsersIcon, WavesIcon } from 'lucide-react';
import { Metadata } from 'next';

export const allMetadata = {
  default: {
    title: 'Tinderhaj',
    description: 'A dating app like Tinder for Blåhaj.',
  } satisfies Metadata,
  home: {
    title: 'Tinderhaj - Home',
    description: 'A dating app like Tinder for Blåhaj.',
  } satisfies Metadata,
  notFound: {
    title: 'Tinderhaj - 404',
    description: "Oops! You've swum too far! Looks like this page got lost in the deep sea.",
  } satisfies Metadata,
};

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

export const notFound = {
  title: 'Blåhaj not found...',
  description: "Oops! You've swum too far! Looks like this page got lost in the deep sea.",
  action: 'Swim back Home',
};
