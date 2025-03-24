import { TypographyH2, TypographyH4, TypographyMuted } from '@/components/typography';

export function Flow() {
  return (
    <section id='flow' className='bg-muted w-full py-24'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <TypographyH2>How Tinderhaj Works</TypographyH2>
            <TypographyMuted className='px-4 text-balance'>Finding your perfect Blahaj match is as easy as 1-2-3.</TypographyMuted>
          </div>
        </div>
        <div className='mx-auto grid max-w-5xl gap-6 pt-12 md:grid-cols-3'>
          <div className='flex flex-col items-center space-y-2 text-center'>
            <div className='bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full text-xl'>1</div>
            <TypographyH4>Create Profile</TypographyH4>
            <TypographyMuted className='max-w-96 text-balance'>
              Upload your best photos and tell us about your interests (swimming, cuddling, etc.).
            </TypographyMuted>
          </div>
          <div className='flex flex-col items-center space-y-2 text-center'>
            <div className='bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full text-xl'>2</div>
            <TypographyH4>Swipe & Match</TypographyH4>
            <TypographyMuted className='max-w-96 text-balance'>
              {"Swipe right on Blahajs you like, left on those you don't. Match when both swipe right!"}
            </TypographyMuted>
          </div>
          <div className='flex flex-col items-center space-y-2 text-center'>
            <div className='bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full text-xl'>3</div>
            <TypographyH4>Meet Up</TypographyH4>
            <TypographyMuted className='max-w-96 text-balance'>Plan your first date at the local IKEA or a cozy bed corner.</TypographyMuted>
          </div>
        </div>
      </div>
    </section>
  );
}
