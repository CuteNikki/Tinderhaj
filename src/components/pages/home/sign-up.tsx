import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function SignUp() {
  return (
    <section id='cta' className='py-20 bg-primary/80 text-primary-foreground'>
      <div className='container mx-auto px-4 text-center flex flex-col items-center gap-4'>
        <h3 className='text-4xl font-bold'>Ready to Find Your Blåhaj Soulmate?</h3>
        <p className='text-xl'>Join Tinderhaj today and start your journey to plushie love!</p>
        <Button variant='secondary'>
          Sign Up
          <ArrowRight />
        </Button>
      </div>
    </section>
  );
}
