import { auth, signIn, signOut } from '@/lib/auth';
import prisma from '@/lib/prisma';

import { TypographyH1, TypographyInlineCode, TypographyLarge, TypographyMuted, TypographyP } from '@/components/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default async function AuthPage() {
  const session = await auth();

  if (!session?.user?.email) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center'>
        <TypographyH1>Auth Test</TypographyH1>
        <div className='flex flex-col gap-4'>
          <TypographyP>Unauthenticated</TypographyP>
          <form
            action={async () => {
              'use server';

              await signIn('discord');
            }}
          >
            <Button>Sign in using Discord</Button>
          </form>
          <form
            action={async () => {
              'use server';

              await signIn('github');
            }}
          >
            <Button>Sign in using GitHub</Button>
          </form>
          <form
            action={async () => {
              'use server';

              await signIn('google');
            }}
          >
            <Button>Sign in using Google</Button>
          </form>
        </div>
      </div>
    );
  }

  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
  });

  const account = await prisma.account.findFirst({
    where: {
      userId: user?.id,
    },
  });

  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center'>
      <TypographyH1>Auth Test</TypographyH1>

      <div className='flex flex-col items-center justify-center gap-4'>
        <TypographyP>Authenticated</TypographyP>
        <form
          action={async () => {
            'use server';

            await signOut();
          }}
        >
          <Button>Sign out</Button>
        </form>
        <div className='flex flex-row items-center gap-4'>
          <Avatar className='h-12 w-12'>
            <AvatarImage src={`${session.user.image}`} alt={`${session.user.name}`} />
            <AvatarFallback>{session.user.name}</AvatarFallback>
          </Avatar>
          <div className='flex flex-col items-start text-start'>
            <TypographyLarge>{session.user.name}</TypographyLarge>
            <TypographyMuted>{session.user.email}</TypographyMuted>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <TypographyP>Session</TypographyP>
          <TypographyInlineCode className='p-2 text-start break-all whitespace-pre-wrap'>{JSON.stringify(session, null, 2)}</TypographyInlineCode>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <TypographyP>User</TypographyP>
          <TypographyInlineCode className='p-2 text-start break-all whitespace-pre-wrap'>{JSON.stringify(user, null, 2)}</TypographyInlineCode>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <TypographyP>Account</TypographyP>
          <TypographyInlineCode className='p-2 text-start break-all whitespace-pre-wrap'>{JSON.stringify(account, null, 2)}</TypographyInlineCode>
        </div>
      </div>
    </div>
  );
}
