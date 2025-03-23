import { Footer } from '@/components/common/footer';
import { CallToAction } from '@/components/home/call-to-action';
import { Demo } from '@/components/home/demo';
import { Features } from '@/components/home/features';
import { Hero } from '@/components/home/hero';
import { HowItWorks } from '@/components/home/how-it-works';
import { Testimonials } from '@/components/home/testimonials';
import { Navbar } from '@/components/common/navbar';

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />

      <main className='flex-1'>
        <Hero />
        <Features />
        <HowItWorks />
        <Demo />
        <Testimonials />
        <CallToAction />
      </main>

      <Footer />
    </div>
  );
}
