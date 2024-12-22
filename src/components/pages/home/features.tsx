import { Heart, Users, Waves } from 'lucide-react';

import { FeatureCard } from '@/components/pages/home/feature-card';

export function Features() {
  return (
    <section id='features' className='bg-accent py-16'>
      <div className='container mx-auto px-4'>
        <h3 className='mb-4 text-center text-3xl font-bold'>Why Choose Tinderhaj?</h3>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          <FeatureCard
            icon={<Heart className='h-12 w-12 text-red-500' />}
            title='Exclusive Blåhaj Community'
            description='Connect with fellow Blåhaj lovers from around the world.'
          />
          <FeatureCard
            icon={<Waves className='h-12 w-12 text-blue-400' />}
            title='Shark-Friendly Interface'
            description='Our app is designed with Blåhaj in mind, making navigation a breeze.'
          />
          <FeatureCard
            icon={<Users className='h-12 w-12 text-green-500' />}
            title='Group Swims'
            description='Organize Blåhaj meetups and group activities with your matches.'
          />
        </div>
      </div>
    </section>
  );
}
