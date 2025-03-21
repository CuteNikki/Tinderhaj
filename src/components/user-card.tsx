import { User } from '@prisma/client';

import { TypographyLarge, TypographyMuted, TypographyP } from '@/components/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function UserCard({ user }: { user: User }) {
  // Get initials for avatar fallback
  const initials = user.display_name
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Calculate age from date of birth
  const calculateAge = (dob: Date): number => {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // If birthday hasn't occurred yet this year, subtract one year
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  return (
    <Card className='w-64 overflow-hidden'>
      <div className='h-20 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500' />
      <CardContent className='pt-0 pb-4'>
        <div className='-mt-16 flex flex-col items-center'>
          <Avatar className='h-20 w-20'>
            <AvatarImage src={user.avatar_url} alt={user.display_name} />
            <AvatarFallback className='text-xl'>{initials}</AvatarFallback>
          </Avatar>

          <div className='py-2 text-center'>
            <TypographyLarge className='text-xl font-bold'>{user.display_name}</TypographyLarge>
            <TypographyMuted className='text-muted-foreground text-sm'>@{user.username}</TypographyMuted>
          </div>

          <div className='flex gap-2'>
            <Badge variant='secondary'>{user.pronouns}</Badge>
            <Badge variant='secondary'>{calculateAge(user.birthday)} years old</Badge>
          </div>

          <div className='text-center'>
            <TypographyP className='text-muted-foreground'>{user.description}</TypographyP>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function UserCardSkeleton() {
  return (
    <Card className='w-64 overflow-hidden'>
      <Skeleton className='h-20 rounded-none' />
      <CardContent className='pt-0 pb-4'>
        <div className='-mt-16 flex flex-col items-center'>
          <div className='bg-accent h-20 w-20 rounded-full' />

          <div className='mt-2 flex flex-col items-center'>
            <Skeleton className='h-7 w-40 rounded-md' />
            <Skeleton className='h-4 w-30 rounded-md' />
          </div>

          <div className='flex gap-2 py-1'>
            <Skeleton className='h-6.5 w-12 rounded-md' />
            <Skeleton className='h-6.5 w-12 rounded-md' />
          </div>
          <Skeleton className='h-7 w-40 rounded-md' />
        </div>
      </CardContent>
    </Card>
  );
}
