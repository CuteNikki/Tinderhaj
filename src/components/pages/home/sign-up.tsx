import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function SignUp() {
  return (
    <section id='cta' className='bg-card py-16 text-card-foreground'>
      <div className='container mx-auto flex flex-col items-center px-4 text-center'>
        <h3 className='mb-4 text-3xl font-bold'>Ready to Find Your Blåhaj Soulmate?</h3>
        <p className='mb-8 text-muted-foreground'>Join Tinderhaj today and start your journey to plushie love!</p>
        <Button variant='default' size='lg'>
          Sign Up
          <ArrowRight />
        </Button>
      </div>
    </section>
  );
}
