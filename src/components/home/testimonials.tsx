import { TypographyBlockquote, TypographyH2, TypographyMuted, TypographyP } from '@/components/typography';
import { Card, CardContent } from '@/components/ui/card';

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
          <Card className='h-fit max-w-80'>
            <CardContent>
              <div className='flex flex-col space-y-2'>
                <div className='flex items-center gap-2'>
                  <div className='bg-primary h-10 w-10 rounded-full' />
                  <div>
                    <TypographyP className='font-bold'>Sharky Blue</TypographyP>
                    <TypographyMuted className='text-sm'>Matched for 3 months</TypographyMuted>
                  </div>
                </div>
                <TypographyBlockquote className='text-pretty'>
                  {`"I never thought I'd find another Blahaj who loves floating in bathtubs as much as I do. Thanks, Tinderhaj!"`}
                </TypographyBlockquote>
              </div>
            </CardContent>
          </Card>
          <Card className='max-w-80'>
            <CardContent>
              <div className='flex flex-col space-y-2'>
                <div className='flex items-center gap-2'>
                  <div className='bg-primary h-10 w-10 rounded-full' />
                  <div>
                    <TypographyP className='font-bold'>Finley</TypographyP>
                    <TypographyMuted className='text-sm'>Matched for 6 months</TypographyMuted>
                  </div>
                </div>
                <TypographyBlockquote className='text-pretty'>{`"Met my soulmate on my first day. We both love being the big spoon. It was meant to be!"`}</TypographyBlockquote>
              </div>
            </CardContent>
          </Card>
          <Card className='max-w-80'>
            <CardContent>
              <div className='flex flex-col space-y-2'>
                <div className='flex items-center gap-2'>
                  <div className='bg-primary h-10 w-10 rounded-full' />
                  <div>
                    <TypographyP className='font-bold'>Bubbles</TypographyP>
                    <TypographyMuted className='text-sm'>Matched for 1 year</TypographyMuted>
                  </div>
                </div>
                <TypographyBlockquote className='text-pretty'>
                  {`"After years of sitting on the IKEA shelf, I finally found my perfect match. We're inseparable now!"`}
                </TypographyBlockquote>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
