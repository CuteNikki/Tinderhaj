import { Hero } from '@/components/home/hero';
import { Navbar } from '@/components/navigation/navbar';

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
      <main className='flex flex-1 flex-col'>
        <Hero />
      </main>
    </div>
  );
}
