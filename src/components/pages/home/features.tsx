import { FeatureCard } from '@/components/pages/home/feature-card';

import { features } from '@/constants/texts';

export function Features() {
  return (
    <section id='features' className='bg-accent py-16'>
      <div className='container mx-auto px-4'>
        <h3 className='mb-4 text-center text-3xl font-bold'>{features.title}</h3>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          {features.cards.map((card, index) => (
            <FeatureCard key={`feature-card-${index}-${card.title}`} icon={card.icon} title={card.title} description={card.description} />
          ))}
        </div>
      </div>
    </section>
  );
}
