import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import Link from 'next/link';

export function NotFound() {
  return (
    <main>
      <section className='py-32'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='mb-2 text-3xl font-bold'>Blåhaj not found...</h2>
          <p className='mb-4 text-balance text-muted-foreground'>Oops! You&apos;ve swum too far! Looks like this page got lost in the deep sea.</p>
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
