import type { Metadata } from 'next';

import { termsMetadata } from '@/constants/metadata';

import { ScrollReveal } from '@/components/home/scroll-reveal';
import { TypographyH1, TypographyH2, TypographyLead, TypographyList, TypographyP } from '@/components/typography';

export const metadata: Metadata = termsMetadata;

export default function TermsPage() {
  return (
    <div className='bg-background flex flex-1 flex-col px-4 py-28 sm:px-4 lg:px-8'>
      <article className='container mx-auto max-w-7xl'>
        <ScrollReveal>
          <header className='mx-auto mb-6 max-w-4xl'>
            <p className='text-primary mb-1 text-xs font-bold tracking-widest uppercase'>Legal</p>
            <TypographyH1>Terms of Service</TypographyH1>
            <TypographyLead className='text-foreground mt-2'>The rules for using Tinderhaj and taking part in the community.</TypographyLead>
            <p className='text-muted-foreground mt-2 text-sm'>Last updated: September 18, 2026</p>
          </header>
        </ScrollReveal>

        <div className='mx-auto max-w-4xl space-y-6'>
          <ScrollReveal delay={0.05}>
            <section className='space-y-2'>
              <TypographyH2>1. Using Tinderhaj</TypographyH2>
              <TypographyP>
                By creating an account or using Tinderhaj, you agree to these Terms of Service and our Privacy Policy. If you do not agree, please do not use
                the service.
              </TypographyP>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <section className='space-y-2'>
              <TypographyH2>2. Eligibility</TypographyH2>
              <TypographyP>
                You must be at least 13 years old, or the minimum age required in your country, to use Tinderhaj. If you are under the age of legal majority
                where you live, you may use the service only with the consent and supervision of a parent or guardian.
              </TypographyP>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <section className='space-y-2'>
              <TypographyH2>3. Your account</TypographyH2>
              <TypographyList>
                <li>You are responsible for providing accurate information and keeping your login details secure.</li>
                <li>You may not impersonate another person, create accounts for abusive purposes, or share access to your account.</li>
                <li>You must be legally allowed to use online services in your jurisdiction.</li>
              </TypographyList>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <section className='space-y-2'>
              <TypographyH2>4. Profiles and content</TypographyH2>
              <TypographyP>
                You are responsible for the content you submit, including profile text and images. You confirm that you have the right to share that content and
                that it does not violate the rights of others.
              </TypographyP>
              <TypographyP>
                By submitting content, you give Tinderhaj permission to store, process, and display it as needed to operate the service, including displaying
                verified profiles in discovery.
              </TypographyP>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <section className='space-y-2'>
              <TypographyH2>5. Community rules</TypographyH2>
              <TypographyP>You may not use Tinderhaj to:</TypographyP>
              <TypographyList>
                <li>Harass, threaten, exploit, or harm other people.</li>
                <li>Submit illegal, hateful, deceptive, sexually explicit, or infringing content.</li>
                <li>Attempt to access accounts, data, or systems without permission.</li>
                <li>Scrape, disrupt, overload, or reverse engineer the service.</li>
                <li>Use the service for spam, scams, or unauthorized commercial activity.</li>
              </TypographyList>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <section className='space-y-2'>
              <TypographyH2>6. Verification and moderation</TypographyH2>
              <TypographyP>
                Verification is a moderation decision and is not a guarantee about a profile or its owner. We may review, reject, restrict, or remove profiles
                and content that violate these terms or create risk for the community.
              </TypographyP>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.35}>
            <section className='space-y-2'>
              <TypographyH2>7. Third-party services</TypographyH2>
              <TypographyP>
                Tinderhaj depends on third-party providers for hosting, databases, email delivery, and file storage. We are not responsible for the
                availability, performance, or actions of those third-party services.
              </TypographyP>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <section className='space-y-2'>
              <TypographyH2>8. Account suspension and deletion</TypographyH2>
              <TypographyP>
                We may suspend or remove accounts, profiles, or content when necessary to protect the service, investigate abuse, comply with law, or enforce
                these terms. You can delete your account from Account Settings. Deletion is permanent for the account data managed by Tinderhaj, subject to
                backups and legal obligations.
              </TypographyP>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.45}>
            <section className='space-y-2'>
              <TypographyH2>9. Disclaimers</TypographyH2>
              <TypographyP>
                Tinderhaj is provided as an evolving service. Features may change, be interrupted, or become unavailable. To the extent permitted by law,
                Tinderhaj is provided without guarantees that it will always be available, secure, or error-free.
              </TypographyP>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.5}>
            <section className='space-y-2'>
              <TypographyH2>10. Limitation of liability</TypographyH2>
              <TypographyP>
                To the fullest extent permitted by law, Tinderhaj and its operator will not be liable for indirect, incidental, special, or consequential
                damages arising from your use of, or inability to use, the service.
              </TypographyP>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.55}>
            <section className='space-y-2'>
              <TypographyH2>11. Changes to these terms</TypographyH2>
              <TypographyP>
                We may update these terms as the service changes. The updated version will be posted on this page with a revised update date. Continued use of
                Tinderhaj after an update means you accept the revised terms.
              </TypographyP>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.6}>
            <section className='space-y-2'>
              <TypographyH2>12. Contact</TypographyH2>
              <TypographyP>
                Questions about these terms can be sent to{' '}
                <a className='text-foreground font-medium underline' href='mailto:contact@tinderhaj.com'>
                  contact@tinderhaj.com
                </a>
                .
              </TypographyP>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.65}>
            <section className='space-y-2'>
              <TypographyH2>13. Governing law</TypographyH2>
              <TypographyP>
                These terms are governed by the laws of Germany, without regard to its conflict-of-law provisions, subject to any mandatory consumer protections
                that apply to you.
              </TypographyP>
            </section>
          </ScrollReveal>
        </div>
      </article>
    </div>
  );
}
