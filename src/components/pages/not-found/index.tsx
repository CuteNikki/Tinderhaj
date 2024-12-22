import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import Link from 'next/link';

export function NotFound() {
  return (
    <main>
      <section className='py-20'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-5xl font-bold mb-6 text-primary'>Blåhaj not found!</h2>
          <p className='text-xl mb-8 text-foreground/80'>Oops! You&apos;ve swum too far! Looks like this page got lost in the deep sea.</p>
          <Button size='lg' asChild>
            <Link href='/'>
              Swim back Home
              <Home />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
