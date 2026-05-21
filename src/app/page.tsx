import Image from 'next/image';

import { CakeIcon, MapPinIcon, RulerIcon } from 'lucide-react';

import prisma from '@/lib/prisma';

import { ThemeSwitch } from '@/components/theme/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default async function Home() {
  const profiles = await prisma.profile.findMany({ where: { status: 'VERIFIED' }, include: { account: { select: { id: true, username: true } } } });

  return (
    <div className='flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <main className='flex w-full max-w-3xl flex-1 flex-col items-center justify-between bg-white px-16 py-32 sm:items-start dark:bg-black'>
        <Image className='dark:invert' src='/next.svg' alt='Next.js logo' width={100} height={20} priority />
        <div className='flex flex-col items-center gap-6 text-center sm:items-start sm:text-left'>
          <h1 className='max-w-xs text-3xl leading-10 font-semibold tracking-tight text-black dark:text-zinc-50'>To get started, edit the page.tsx file.</h1>
          <p className='max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400'>
            Looking for a starting point or more instructions? Head over to{' '}
            <a
              href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              className='font-medium text-zinc-950 dark:text-zinc-50'
            >
              Templates
            </a>{' '}
            or the{' '}
            <a
              href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              className='font-medium text-zinc-950 dark:text-zinc-50'
            >
              Learning
            </a>{' '}
            center.
          </p>
        </div>
        <div className='flex flex-col gap-4 text-base font-medium sm:flex-row'>
          <a
            className='bg-foreground text-background flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 transition-colors hover:bg-[#383838] md:w-39.5 dark:hover:bg-[#ccc]'
            href='https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image className='dark:invert' src='/vercel.svg' alt='Vercel logomark' width={16} height={16} />
            Deploy Now
          </a>
          <a
            className='flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/8 px-5 transition-colors hover:border-transparent hover:bg-black/4 md:w-39.5 dark:border-white/[.145] dark:hover:bg-[#1a1a1a]'
            href='https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            Documentation
          </a>
          <ThemeSwitch />
        </div>
      </main>{' '}
      <div className='flex flex-wrap items-center justify-center gap-4'>
        {profiles.map((profile) => (
          <Card key={profile.id} className='w-full max-w-sm pt-0'>
            <div className='relative aspect-3/1 overflow-hidden'>
              <Image unoptimized src={profile.bannerUrl || '/default-banner.png'} alt={`${profile.account.username}'s banner`} fill className='object-cover' />
              <div className='from-card/80 absolute inset-0 bg-linear-to-t to-transparent' />
            </div>

            <CardContent>
              {/* Info Row */}
              <div className='flex items-center gap-4'>
                {/* Avatar */}
                <div className='relative shrink-0'>
                  <div className='h-16 w-16 overflow-hidden rounded-full border-2'>
                    <Image
                      unoptimized
                      src={profile.avatarUrl || '/default-avatar.png'}
                      alt={`${profile.account.username}'s avatar`}
                      width={64}
                      height={64}
                      className='object-cover'
                    />
                  </div>
                </div>
                {/* Name & Details */}
                <div className='min-w-0 flex-1'>
                  <div className='flex flex-wrap items-center space-x-2'>
                    <h3 className='text-foreground truncate text-lg font-semibold'>{profile.displayName}</h3>
                    <span>({profile.pronouns})</span>
                  </div>
                  <p className='text-muted-foreground truncate text-sm'>@{profile.account.username}</p>
                </div>
              </div>
              {/* Location and Size */}
              <div className='flex flex-wrap items-center gap-x-4 gap-y-1 py-2 text-sm'>
                <span className='flex items-center gap-1'>
                  <CakeIcon className='h-3.5 w-3.5' />
                  {calculateAge(profile.birthday)} years old
                </span>
                <span className='flex items-center gap-1'>
                  <MapPinIcon className='h-3.5 w-3.5' />
                  {profile.location}
                </span>
                <span className='flex items-center gap-1'>
                  <RulerIcon className='h-3.5 w-3.5' />
                  {profile.size}
                  {profile.unit.toLowerCase()}
                </span>
              </div>

              {/* Bio */}
              <p className='text-muted-foreground line-clamp-2 text-sm'>{profile.bio}</p>

              {/* Interests */}
              <div className='flex flex-wrap gap-1.5 pt-4'>
                {profile.interests.map((interest) => (
                  <Badge key={interest} variant='secondary' className='text-xs font-normal'>
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function calculateAge(birthday: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }
  return age;
}
