import type { Metadata } from 'next';

import { imprintMetadata } from '@/constants/metadata';

import { LegalPage } from '@/components/legal/legal-page';
import { LegalSection } from '@/components/legal/legal-section';
import { TypographyP } from '@/components/typography';

export const metadata: Metadata = imprintMetadata;

export default function ImprintPage() {
  return (
    <LegalPage title='Imprint' lead='Legal information and contact details for Tinderhaj.' updated='September 18, 2026'>
      <LegalSection delay={0.35} title='Provider'>
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
      </LegalSection>

      <LegalSection delay={0.45} title='Contact'>
        <TypographyP>
          Email:{' '}
          <a className='text-foreground font-medium underline' href='mailto:contact@tinderhaj.com'>
            contact@tinderhaj.com
          </a>
        </TypographyP>
        <TypographyP>Phone: +49 176 46236314</TypographyP>
      </LegalSection>

      <LegalSection delay={0.55} title='Responsible for content'>
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
      </LegalSection>

      <LegalSection delay={0.65} title='Liability for content'>
        <TypographyP>
          As a service provider, we are responsible for our own content on these pages in accordance with § 7 (1) DDG. However, pursuant to §§ 8 to 10 DDG, we
          are not obligated to monitor transmitted or stored third-party information, or to investigate circumstances that indicate illegal activity.
          Obligations to remove or block the use of information under general law remain unaffected. Liability in this regard is only possible from the point at
          which we become aware of a specific legal violation. Upon becoming aware of such violations, we will remove the content promptly.
        </TypographyP>
      </LegalSection>

      <LegalSection delay={0.75} title='Liability for links'>
        <TypographyP>
          Our service may contain links to external websites over which we have no control. We accept no liability for their content. The respective provider or
          operator of the linked pages is always responsible for their content. If we become aware of any legal violations, we will remove such links promptly.
        </TypographyP>
      </LegalSection>

      <LegalSection delay={0.85} title='Trademark notice'>
        <TypographyP>Blåhaj is a trademark of IKEA. Tinderhaj is an independent project and is not affiliated with IKEA or Tinder.</TypographyP>
      </LegalSection>

      <LegalSection delay={0.95} title='Copyright'>
        <TypographyP>
          The content and works created by the operator on this service are subject to copyright law. Contributions from third parties are marked as such.
          Reproduction, processing, distribution, or any form of commercialization beyond the scope of copyright law requires the prior written consent of the
          respective author or creator.
        </TypographyP>
      </LegalSection>
    </LegalPage>
  );
}
