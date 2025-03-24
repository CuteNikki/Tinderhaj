import { Footer } from '@/components/common/footer';
import { Navbar } from '@/components/common/navbar';
import { CallToAction } from '@/components/home/call-to-action';
import { Demo } from '@/components/home/demo';
import { Features } from '@/components/home/features';
import { Hero } from '@/components/home/hero';
import { Flow } from '@/components/home/flow';
import { Testimonials } from '@/components/home/testimonials';

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />

      <main className='flex-1'>
        <Hero />
        <Features />
        <Flow />
        <Demo />
        <Testimonials />
        <CallToAction />
      </main>

      <Footer />
    </div>
  );
}
