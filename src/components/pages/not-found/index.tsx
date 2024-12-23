import { Button } from '@/components/ui/button';
import { notFound } from '@/constants/texts';
import { Home } from 'lucide-react';
import Link from 'next/link';

export function NotFound() {
  return (
    <main>
      <section className='py-32'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='mb-2 text-3xl font-bold'>{notFound.title}</h2>
          <p className='mb-4 text-balance text-muted-foreground'>{notFound.description}</p>
          <Button size='lg' asChild>
            <Link href='/'>
              {notFound.action}
              <Home />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
