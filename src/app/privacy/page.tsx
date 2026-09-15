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
          <header className='mx-auto mb-6 max-w-4xl'>
            <p className='text-primary mb-1 text-xs font-bold tracking-widest uppercase'>Legal</p>
            <TypographyH1>Privacy Policy</TypographyH1>
            <TypographyLead className='text-foreground mt-2'>How Tinderhaj handles the information needed to run the service.</TypographyLead>
            <p className='text-muted-foreground mt-2 text-sm'>Last updated: September 15, 2026</p>
          </header>
        </ScrollReveal>
        <div className='mx-auto max-w-4xl space-y-6'>
          <PrivacySection delay={0.05} title='1. Introduction'>
            <TypographyP>
              This Privacy Policy explains how Tinderhaj collects, uses, and protects information when you use the service. By creating an account or using
              Tinderhaj, you acknowledge the practices described here.
            </TypographyP>
          </PrivacySection>
          <PrivacySection delay={0.1} title='2. Information you provide'>
            <TypographyP>We collect information you provide directly, including:</TypographyP>
            <TypographyList>
              <li>Account details such as your email address, username, and password credentials. Passwords are stored in hashed form.</li>
              <li>Profile information such as display name, images, pronouns, location, size, interests, and biography.</li>
              <li>Moderation information such as verification status, rejection feedback, and notes associated with a profile.</li>
              <li>Messages or requests you send to us, including privacy or support requests.</li>
            </TypographyList>
          </PrivacySection>
          <PrivacySection delay={0.15} title='3. Information collected automatically'>
            <TypographyP>
              When you use Tinderhaj, we may receive limited technical information needed to operate and secure the service, such as your IP address, browser
              type, timestamps, and basic usage or error information provided by our hosting infrastructure.
            </TypographyP>
          </PrivacySection>
          <PrivacySection delay={0.2} title='4. How we use information'>
            <TypographyP>We use information to:</TypographyP>
            <TypographyList>
              <li>Provide, operate, and maintain accounts, profiles, and discovery.</li>
              <li>Authenticate users, maintain sessions, and send password recovery emails.</li>
              <li>Review profiles, enforce our rules, prevent abuse, and keep the community safe.</li>
              <li>Diagnose problems, protect the service, and improve its features.</li>
            </TypographyList>
          </PrivacySection>
          <PrivacySection delay={0.25} title='5. Legal bases for processing'>
            <TypographyP>
              Where applicable law requires a legal basis, we process information as needed to perform our agreement with you, pursue legitimate interests such
              as security and service improvement, comply with legal obligations, or rely on consent where we request it.
            </TypographyP>
          </PrivacySection>
          <PrivacySection delay={0.3} title='6. Public profiles and sharing'>
            <TypographyP>
              Verified profile information may be visible to other Tinderhaj users through discovery. We do not sell personal information. We share information
              only with service providers needed to host, operate, secure, store, or deliver parts of the service, or when required for legal and safety
              reasons.
            </TypographyP>
          </PrivacySection>
          <PrivacySection delay={0.35} title='7. Third-party services'>
            <TypographyP>
              We use third-party providers for infrastructure, database hosting, email delivery, and file uploads. These providers process information only as
              needed to provide their services and may have their own privacy policies.
            </TypographyP>
          </PrivacySection>
          <PrivacySection delay={0.4} title='8. Cookies and local storage'>
            <TypographyP>
              Tinderhaj uses an essential httpOnly session cookie to keep you signed in. The app may also use local storage for preferences such as your
              selected theme. We do not use advertising or cross-site tracking cookies.
            </TypographyP>
          </PrivacySection>
          <PrivacySection delay={0.45} title='9. Retention and deletion'>
            <TypographyP>
              We retain information while it is needed to provide the service, meet legal obligations, resolve disputes, and protect Tinderhaj. You can delete
              your account from Account Settings. Account deletion removes your account, profiles, sessions, and password recovery tokens from the application
              database, subject to backups and information we must retain by law.
            </TypographyP>
          </PrivacySection>
          <PrivacySection delay={0.5} title='10. Your rights'>
            <TypographyP>
              Depending on where you live, you may have rights to access, correct, export, delete, restrict, or object to certain processing of your personal
              information. You can manage your username and account deletion in Account Settings, or contact us at contact@tinderhaj.com.
            </TypographyP>
          </PrivacySection>
          <PrivacySection delay={0.55} title='11. Security'>
            <TypographyP>
              We use measures such as password hashing, protected sessions, access controls, and encryption in transit to help protect information. No method of
              transmission or storage is completely secure, and we continue to improve our safeguards.
            </TypographyP>
          </PrivacySection>
          <PrivacySection delay={0.6} title="12. Children's privacy">
            <TypographyP>
              Tinderhaj is not intended for children under 13, or under the minimum age required in your country. We do not knowingly collect personal
              information from children. If you believe a child has provided information, contact us so we can review and remove it where appropriate.
            </TypographyP>
          </PrivacySection>
          <PrivacySection delay={0.65} title='13. International processing'>
            <TypographyP>
              Your information may be processed in countries other than your own by Tinderhaj or our service providers. Where required, we take steps to protect
              information in accordance with applicable law.
            </TypographyP>
          </PrivacySection>
          <PrivacySection delay={0.7} title='14. Changes to this policy'>
            <TypographyP>
              We may update this Privacy Policy as Tinderhaj changes. The updated version will be posted on this page with a revised update date.
            </TypographyP>
          </PrivacySection>
          <PrivacySection delay={0.75} title='15. Contact us'>
            <TypographyP>
              Questions about this Privacy Policy or how we handle information can be sent to{' '}
              <a className='text-foreground font-medium underline' href='mailto:contact@tinderhaj.com'>
                contact@tinderhaj.com
              </a>
              .
            </TypographyP>
          </PrivacySection>
        </div>
      </article>
    </div>
  );
}

function PrivacySection({ children, delay, title }: { children: React.ReactNode; delay: number; title: string }) {
  return (
    <ScrollReveal delay={delay}>
      <section className='space-y-2'>
        <TypographyH2>{title}</TypographyH2>
        {children}
      </section>
    </ScrollReveal>
  );
}
