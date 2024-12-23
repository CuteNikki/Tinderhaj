import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { signUp } from '@/constants/texts';

export function SignUp() {
  return (
    <section id='cta' className='bg-card py-16 text-card-foreground'>
      <div className='container mx-auto flex flex-col items-center px-4 text-center'>
        <h3 className='mb-4 text-3xl font-bold'>{signUp.title}</h3>
        <p className='mb-8 text-muted-foreground'>{signUp.description}</p>
        <Button variant='default' size='lg'>
          {signUp.action}
          <ArrowRight />
        </Button>
      </div>
    </section>
  );
}
