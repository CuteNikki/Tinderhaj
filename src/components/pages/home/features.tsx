import { Heart, Users, Waves } from 'lucide-react';

import { FeatureCard } from '@/components/pages/home/feature-card';

export function Features() {
  return (
    <section id='features' className='py-16 bg-primary/60'>
      <div className='container mx-auto px-4'>
        <h3 className='text-3xl font-bold mb-12 text-center text-primary-foreground'>Why Choose Tinderhaj?</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <FeatureCard
            icon={<Heart className='w-12 h-12 text-red-500' />}
            title='Exclusive Blåhaj Community'
            description='Connect with fellow Blåhaj lovers from around the world.'
          />
          <FeatureCard
            icon={<Waves className='w-12 h-12 text-blue-500' />}
            title='Shark-Friendly Interface'
            description='Our app is designed with Blåhaj in mind, making navigation a breeze.'
          />
          <FeatureCard
            icon={<Users className='w-12 h-12 text-green-500' />}
            title='Group Swims'
            description='Organize Blåhaj meetups and group activities with your matches.'
          />
        </div>
      </div>
    </section>
  );
}
