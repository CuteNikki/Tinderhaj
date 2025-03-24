import Image from 'next/image';

import { TypographyBlockquote, TypographyH2, TypographyMuted, TypographyP } from '@/components/typography';
import { Card, CardContent } from '@/components/ui/card';

const demoTestimonials = [
  {
    id: '2',
    username: 'fin_tastic',
    displayName: 'Finley',
    avatarUrl: 'https://placehold.co/512x512/3357FF/FFFFFF/webp?text=FT',
    createdAt: new Date('2025-01-01'),
    text: 'Met my soulmate on my first day. We both love being the big spoon. It was meant to be!',
  },
  {
    id: '1',
    username: 'bubble_trouble',
    displayName: 'Bubbles',
    avatarUrl: 'https://placehold.co/512x512/33FF57/FFFFFF/webp?text=BT',
    createdAt: new Date('2024-01-01'),
    text: "After years of sitting on the IKEA shelf, I finally found my perfect match. We're inseparable now!",
  },
  {
    id: '3',
    username: 'tooth_fairy',
    displayName: 'Sharky',
    avatarUrl: 'https://placehold.co/512x512/FF5733/FFFFFF/webp?text=TF',
    createdAt: new Date('2025-03-01'),
    text: "I never thought I'd find another Blahaj who loves floating in bathtubs as much as I do. Thanks, Tinderhaj!",
  },
];

function timeAgo(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const units = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'week', seconds: 604800 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 },
  ];

  for (const { unit, seconds } of units) {
    const count = Math.floor(diffInSeconds / seconds);
    if (count >= 1) {
      return `${count} ${unit}${count > 1 ? 's' : ''}`;
    }
  }

  return 'just now';
}

export function Testimonials() {
  return (
    <section id='testimonials' className='bg-muted w-full py-24'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <TypographyH2>Happy Sharks</TypographyH2>
            <TypographyMuted>
              {"Don't just take our word for it –"}
              <br />
              hear from our satisfied Blahajs.
            </TypographyMuted>
          </div>
        </div>
        <div className='mx-auto flex max-w-5xl flex-wrap justify-center gap-6 pt-12'>
          {demoTestimonials.map((testimonial, index) => (
            <Card key={`testimonial-${index}-${testimonial.id}`} className='max-w-80'>
              <CardContent>
                <div className='flex flex-col space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Image
                      unoptimized
                      priority
                      draggable={false}
                      width={80}
                      height={80}
                      src={testimonial.avatarUrl}
                      alt={`${testimonial.displayName}'s profile picture`}
                      className='h-12 w-12 rounded-full object-cover select-none'
                    />
                    <div>
                      <TypographyP className='font-bold'>{testimonial.displayName}</TypographyP>
                      <TypographyMuted className='text-sm'>Matched for {timeAgo(testimonial.createdAt)}</TypographyMuted>
                    </div>
                  </div>
                  <TypographyBlockquote className='text-pretty'>{`"${testimonial.text}"`}</TypographyBlockquote>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
