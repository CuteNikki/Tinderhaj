import type { Metadata } from 'next';

import { imprintMetadata } from '@/constants/metadata';

import { ScrollReveal } from '@/components/home/scroll-reveal';
import { TypographyH1, TypographyH2, TypographyLead, TypographyP } from '@/components/typography';

export const metadata: Metadata = imprintMetadata;

export default function ImprintPage() {
  return (
    <div className='bg-background flex flex-1 flex-col px-4 py-28 sm:px-4 lg:px-8'>
      <article className='container mx-auto max-w-7xl'>
        <ScrollReveal>
          <header className='mx-auto mb-6 max-w-4xl'>
            <p className='text-primary mb-1 text-xs font-bold tracking-widest uppercase'>Legal</p>
            <TypographyH1>Imprint</TypographyH1>
            <TypographyLead className='text-foreground mt-2'>Legal information and contact details for Tinderhaj.</TypographyLead>
            <p className='text-muted-foreground mt-2 text-sm'>Last updated: September 15, 2026</p>
          </header>
        </ScrollReveal>

        <div className='mx-auto max-w-4xl space-y-6'>
          <ScrollReveal delay={0.05}>
            <section className='space-y-2'>
              <TypographyH2>Provider</TypographyH2>
              <TypographyP>Information pursuant to § 5 DDG (German Digital Services Act):</TypographyP>
              <TypographyP>
                Nikki Sophie Berthold
                <br />
                Friedrich-Karl-Straße 28
                <br />
                32584 Löhne
                <br />
                Germany
              </TypographyP>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <section className='space-y-2'>
              <TypographyH2>Contact</TypographyH2>
              <TypographyP>
                Email:{' '}
                <a className='text-foreground font-medium underline' href='mailto:contact@tinderhaj.com'>
                  contact@tinderhaj.com
                </a>
              </TypographyP>
              <TypographyP>Phone: +49 176 46236314</TypographyP>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <section className='space-y-2'>
              <TypographyH2>Responsible for content</TypographyH2>
              <TypographyP>Responsible for content pursuant to § 18 (2) MStV:</TypographyP>
              <TypographyP>
                Nikki Sophie Berthold
                <br />
                Friedrich-Karl-Straße 28
                <br />
                32584 Löhne
                <br />
                Germany
              </TypographyP>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <section className='space-y-2'>
              <TypographyH2>Liability for content</TypographyH2>
              <TypographyP>
                As a service provider, we are responsible for our own content on these pages in accordance with § 7 (1) DDG. However, pursuant to §§ 8 to 10
                DDG, we are not obligated to monitor transmitted or stored third-party information, or to investigate circumstances that indicate illegal
                activity. Obligations to remove or block the use of information under general law remain unaffected. Liability in this regard is only possible
                from the point at which we become aware of a specific legal violation. Upon becoming aware of such violations, we will remove the content
                promptly.
              </TypographyP>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <section className='space-y-2'>
              <TypographyH2>Liability for links</TypographyH2>
              <TypographyP>
                Our service may contain links to external websites over which we have no control. We accept no liability for their content. The respective
                provider or operator of the linked pages is always responsible for their content. If we become aware of any legal violations, we will remove
                such links promptly.
              </TypographyP>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.5}>
            <section className='space-y-2'>
              <TypographyH2>Trademark notice</TypographyH2>
              <TypographyP>Blåhaj is a trademark of IKEA. Tinderhaj is an independent project and is not affiliated with IKEA or Tinder.</TypographyP>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.6}>
            <section className='space-y-2'>
              <TypographyH2>Copyright</TypographyH2>
              <TypographyP>
                The content and works created by the operator on this service are subject to copyright law. Contributions from third parties are marked as such.
                Reproduction, processing, distribution, or any form of commercialization beyond the scope of copyright law requires the prior written consent of
                the respective author or creator.
              </TypographyP>
            </section>
          </ScrollReveal>
        </div>
      </article>
    </div>
  );
}
