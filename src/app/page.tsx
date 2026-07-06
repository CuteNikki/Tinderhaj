import { Hero } from '@/components/home/hero';
import { Navbar } from '@/components/navigation/navbar';

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
      <main className='flex flex-1 flex-col'>
        <Hero />
        <div className='dark:bg-primary/20 bg-primary/18 relative flex min-h-screen items-center justify-center'>
          <div className='from-background via-background to-primary/10 dark:to-primary/30 absolute inset-0 -z-10 bg-linear-to-tr' />

          <p>{'Some Other Random Text Here'}</p>
        </div>
      </main>
    </div>
  );
}
