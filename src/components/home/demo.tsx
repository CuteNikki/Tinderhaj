import { Heart, X } from 'lucide-react';

import { ProfileCard } from '@/components/discovery/profile-card';
import { TypographyH2, TypographyMuted } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';

export function Demo() {
  return (
    <section id='demo' className='w-full py-12 md:py-24'>
      <div className='container mx-auto flex flex-col items-center justify-center px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <TypographyH2>Find Your Match</TypographyH2>
            <TypographyMuted className='text-pretty'>Our intuitive swipe interface makes finding your perfect Blahaj simple and fun.</TypographyMuted>
          </div>
        </div>
        <div className='relative pt-12'>
          {/* Left card */}
          <ProfileCard
            className='absolute top-0 -left-60 -z-10 mt-24 hidden lg:block'
            profile={{
              id: '2',
              username: 'tooth_fairy',
              displayName: 'Sharky',
              avatarUrl: 'https://placehold.co/512x512/webp?text=TF',
              bannerUrl: 'https://placehold.co/1024x512/webp?text=Sharky',
              birthday: new Date('2024-01-01'),
              pronouns: 'she/her',
              location: 'Bedroom Corner',
              interests: ['Bathtubs', 'Sunbathing', 'Reading'],
              bio: 'New to the dating scene. Enjoys long floats in the bathtub and window sunbathing.',
              createdAt: new Date(),
              updatedAt: new Date(),
            }}
          />
          {/* Center card */}
          <ProfileCard
            className='z-0'
            profile={{
              id: '1',
              username: 'bubble_trouble',
              displayName: 'Bubbles',
              avatarUrl: 'https://placehold.co/512x512/webp?text=BT',
              bannerUrl: 'https://placehold.co/1024x512/webp?text=Bubbles',
              birthday: new Date('2023-01-01'),
              pronouns: 'they/them',
              location: 'IKEA Shelf 3',
              interests: ['Swimming', 'Cuddles', 'Movies'],
              bio: 'Loves swimming and cuddles. Looking for a long-term relationship.',
              createdAt: new Date(),
              updatedAt: new Date(),
            }}
          >
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
          </ProfileCard>
          {/* Right card */}
          <ProfileCard
            className='absolute top-0 -right-60 -z-10 mt-24 hidden lg:block'
            profile={{
              id: '3',
              username: 'fin_tastic',
              displayName: 'Finley',
              avatarUrl: 'https://placehold.co/512x512/webp?text=FT',
              bannerUrl: 'https://placehold.co/1024x512/webp?text=Finley',
              birthday: new Date('2023-01-01'),
              pronouns: 'he/they',
              location: 'Backpack Ready',
              interests: ['Adventure', 'Hiking', 'Photography'],
              bio: "Adventure seeker looking for a Blahaj to explore the world with. Let's make waves together!",
              createdAt: new Date(),
              updatedAt: new Date(),
            }}
          />
        </div>
      </div>
    </section>
  );
}
