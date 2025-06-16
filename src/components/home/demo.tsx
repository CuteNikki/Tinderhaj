import { Account, Profile } from '@prisma/client';
import { Heart, X } from 'lucide-react';

import { ProfileCard } from '@/components/discovery/profile-card';
import { TypographyH2, TypographyMuted } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';

const demoProfiles: (Profile & { Account: Account })[] = [
  {
    id: '1',
    accountId: '1',
    Account: {
      id: '1',
      canVerify: false,
      email: 'bubble_trouble@tinderhaj.com',
      password: 'some_secret123',
      salt: '',
      username: 'bubble_trouble',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    displayName: 'Bubbles',
    avatarUrl: 'https://placehold.co/512x512/33FF57/FFFFFF/webp?text=BT',
    bannerUrl: 'https://placehold.co/1144x572/33FF57/FFFFFF/webp?text=Bubbles',
    birthday: new Date('2021-01-01'),
    size: 100,
    pronouns: 'they/them',
    location: 'IKEA Shelf 3',
    interests: ['Swimming', 'Cuddles', 'Movies'],
    bio: 'Loves swimming and cuddles. Looking for a long-term relationship.',
    createdAt: new Date(),
    updatedAt: new Date(),
    isVerified: true,
  },
  {
    id: '2',
    accountId: '2',
    Account: {
      id: '2',
      canVerify: false,
      email: 'fin_tastic@tinderhaj.com',
      password: 'some_secret123',
      salt: '',
      username: 'fin_tastic',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    displayName: 'Finley',
    avatarUrl: 'https://placehold.co/512x512/3357FF/FFFFFF/webp?text=FT',
    bannerUrl: 'https://placehold.co/1144x572/3357FF/FFFFFF/webp?text=Finley',
    birthday: new Date('2023-01-01'),
    size: 55,
    pronouns: 'he/they',
    location: 'Backpack Ready',
    interests: ['Adventure', 'Hiking', 'Photography'],
    bio: "Adventure seeker looking for a Blåhaj to explore the world with. Let's make waves together!",
    createdAt: new Date(),
    updatedAt: new Date(),
    isVerified: true,
  },
  {
    id: '3',
    accountId: '3',
    Account: {
      id: '3',
      canVerify: false,
      email: 'tooth_fairy@tinderhaj.com',
      password: 'some_secret123',
      salt: '',
      username: 'tooth_fairy',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    displayName: 'Sharky',
    avatarUrl: 'https://placehold.co/512x512/FF5733/FFFFFF/webp?text=TF',
    bannerUrl: 'https://placehold.co/1144x572/FF5733/FFFFFF/webp?text=Sharky',
    birthday: new Date('2024-01-01'),
    size: 55,
    pronouns: 'he/him',
    location: 'Bedroom Corner',
    interests: ['Bathtubs', 'Sunbathing', 'Reading'],
    bio: 'New to the dating scene. Enjoys long floats in the bathtub and window sunbathing.',
    createdAt: new Date(),
    updatedAt: new Date(),
    isVerified: true,
  },
];

export function Demo() {
  return (
    <section id='demo' className='w-full py-24'>
      <div className='container mx-auto flex flex-col items-center justify-center px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <TypographyH2>Find Your Match</TypographyH2>
            <TypographyMuted className='px-4 text-balance'>Our intuitive swipe interface makes finding your perfect Blåhaj simple and fun.</TypographyMuted>
          </div>
        </div>
        <div className='relative flex items-center justify-center pt-12'>
          {/* Left card */}
          <ProfileCard
            className='z-0 mt-12 -mr-14 hidden -rotate-6 transition-transform hover:z-20 hover:scale-110 hover:rotate-1 lg:block'
            profile={demoProfiles[1]}
          >
            <CardButtons />
          </ProfileCard>
          {/* Center card */}
          <ProfileCard className='z-10 transition-transform sm:-rotate-2 sm:hover:scale-110 sm:hover:rotate-0' profile={demoProfiles[0]}>
            <CardButtons />
          </ProfileCard>
          {/* Right card */}
          <ProfileCard
            className='z-0 mt-12 -ml-14 hidden rotate-6 transition-transform hover:z-20 hover:scale-110 hover:rotate-2 sm:block'
            profile={demoProfiles[2]}
          >
            <CardButtons />
          </ProfileCard>
        </div>
      </div>
    </section>
  );
}

function CardButtons() {
  return (
    <CardFooter className='flex flex-row items-center justify-center gap-6 pb-4'>
      <Button size='icon' variant='outline' className='h-12 w-12 rounded-full'>
        <X className='h-6 w-6' />
        <span className='sr-only'>Dislike</span>
      </Button>
      <Button size='icon' className='h-12 w-12 rounded-full'>
        <Heart className='h-6 w-6' />
        <span className='sr-only'>Like</span>
      </Button>
    </CardFooter>
  );
}
