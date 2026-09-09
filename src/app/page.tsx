import { FeatureContent } from '@/components/home/feature-content';
import { GuideStep } from '@/components/home/guide-step';
import { Hero } from '@/components/home/hero';
import { ScrollReveal } from '@/components/home/scroll-reveal';
import { Footer } from '@/components/navigation/footer';
import { Navbar } from '@/components/navigation/navbar';

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
      <main className='flex flex-1 flex-col'>
        <Hero />
        <section id='guide' className='bg-muted text-foreground relative scroll-m-16 overflow-hidden py-18'>
          <ScrollReveal>
            <div className='container mx-auto max-w-350 px-5 lg:px-10'>
              <div className='mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end'>
                <div>
                  <p className='text-primary mb-3 text-xs font-bold tracking-widest uppercase'>A better kind of first date</p>
                  <h2 className='max-w-xl text-4xl leading-tight font-black tracking-tight sm:text-5xl'>
                    Less swiping.
                    <br />
                    <span className='text-primary'>More finding.</span>
                  </h2>
                </div>
                <p className='text-muted-foreground max-w-sm text-sm leading-relaxed'>
                  No games, no ghosting, no pressure. Just good profiles and a community that knows what it means to be soft.
                </p>
              </div>
              <div className='grid md:grid-cols-3'>
                {[
                  { number: '01', title: 'Build your vibe', copy: 'Tell the world what makes your fins flutter.', icon: 'sparkles' as const },
                  { number: '02', title: 'Find your people', copy: 'Discover compatible plush from near and far.', icon: 'search' as const },
                  { number: '03', title: 'Make it official', copy: 'Send a little heart. Start something lovely.', icon: 'heart' as const },
                ].map(({ number, title, copy, icon }) => (
                  <GuideStep key={number} number={number} title={title} copy={copy} icon={icon} />
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>
        <section id='features' className='bg-card text-card-foreground scroll-m-16 px-4 py-18'>
          <FeatureContent />
        </section>
      </main>
      <Footer />
    </div>
  );
}
