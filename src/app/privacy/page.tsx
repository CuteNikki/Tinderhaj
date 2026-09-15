import type { Metadata } from 'next';

import { privacyMetadata } from '@/constants/metadata';

import { ScrollReveal } from '@/components/home/scroll-reveal';
import { TypographyH1, TypographyH2, TypographyLead, TypographyList, TypographyP } from '@/components/typography';

export const metadata: Metadata = privacyMetadata;

export default function PrivacyPage() {
  return (
    <div className='bg-background flex flex-1 flex-col px-4 py-28 sm:px-4 lg:px-8'>
      <article className='container mx-auto max-w-7xl'>
        <ScrollReveal>
          <header className='mx-auto mb-12 max-w-4xl'>
            <p className='text-primary mb-1 text-xs font-bold tracking-widest uppercase'>Legal</p>
            <TypographyH1>Privacy Policy</TypographyH1>
            <TypographyLead className='text-foreground mt-2'>How Tinderhaj handles the information needed to run the service.</TypographyLead>
            <p className='text-muted-foreground mt-2 text-sm'>Last updated: September 15, 2026</p>
          </header>
        </ScrollReveal>

        <div className='mx-auto max-w-4xl space-y-10'>
          <ScrollReveal delay={0.05}>
            <section className='space-y-2'>
              <TypographyH2>1. Information we collect</TypographyH2>
              <TypographyP>When you use Tinderhaj, we may collect the following information:</TypographyP>
              <TypographyList>
                <li>Account information such as your username, email address, and password credentials.</li>
                <li>Profile information you provide, including display name, images, pronouns, location, size, interests, and biography.</li>
                <li>Moderation information, such as verification status and feedback associated with a profile.</li>
                <li>Session and security information needed to keep you signed in and support password recovery.</li>
                <li>Technical information sent by your browser or hosting infrastructure when you access the service.</li>
              </TypographyList>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <section className='space-y-2'>
              <TypographyH2>2. How we use information</TypographyH2>
              <TypographyP>We use this information to provide and protect Tinderhaj, including to:</TypographyP>
              <TypographyList>
                <li>Create and manage your account and profiles.</li>
                <li>Display verified profiles and support discovery features.</li>
                <li>Authenticate users, maintain sessions, and send password recovery emails.</li>
                <li>Review profiles and enforce our service rules.</li>
                <li>Diagnose problems, improve the service, and prevent abuse.</li>
              </TypographyList>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <section className='space-y-2'>
              <TypographyH2>3. Public profile information</TypographyH2>
              <TypographyP>
                Profile information may be visible to other Tinderhaj users after a profile has been verified. Do not add information to a public profile that
                you do not want other users to see.
              </TypographyP>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <section className='space-y-2'>
              <TypographyH2>4. Cookies and sessions</TypographyH2>
              <TypographyP>
                Tinderhaj uses a necessary, httpOnly session cookie to keep you signed in. We may also use cookies or similar technologies provided by the
                hosting platform or integrated services when they are needed to operate, secure, or measure the service.
              </TypographyP>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <section className='space-y-2'>
              <TypographyH2>5. Service providers</TypographyH2>
              <TypographyP>
                We may use service providers to host the application, store data, deliver uploaded images, send email, and provide infrastructure. These
                providers process information only as needed to provide their services and may have their own privacy policies.
              </TypographyP>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <section className='space-y-2'>
              <TypographyH2>6. Retention and deletion</TypographyH2>
              <TypographyP>
                We retain information for as long as it is needed to provide the service, meet legal obligations, resolve disputes, and protect Tinderhaj. You
                can delete your account from the Account page. Account deletion removes your account, profiles, sessions, and password recovery tokens from our
                application database, subject to backups or information we must retain by law.
              </TypographyP>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.35}>
            <section className='space-y-2'>
              <TypographyH2>7. Your choices and rights</TypographyH2>
              <TypographyP>
                Depending on where you live, you may have rights to access, correct, export, restrict, or delete your personal information. You can update your
                username or delete your account in Account Settings. For other requests, contact us using the email address below.
              </TypographyP>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <section className='space-y-2'>
              <TypographyH2>8. Children&apos;s privacy</TypographyH2>
              <TypographyP>
                Tinderhaj is not intended for children who are not legally allowed to use online services in their jurisdiction. We do not knowingly collect
                personal information from children.
              </TypographyP>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.45}>
            <section className='space-y-2'>
              <TypographyH2>9. Changes to this policy</TypographyH2>
              <TypographyP>
                We may update this Privacy Policy as Tinderhaj changes. The updated version will be posted on this page with a revised update date.
              </TypographyP>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.5}>
            <section className='space-y-2'>
              <TypographyH2>10. Contact</TypographyH2>
              <TypographyP>
                Questions about privacy can be sent to{' '}
                <a className='text-foreground font-medium underline' href='mailto:contact@tinderhaj.com'>
                  contact@tinderhaj.com
                </a>
                .
              </TypographyP>
            </section>
          </ScrollReveal>
        </div>
      </article>
    </div>
  );
}
