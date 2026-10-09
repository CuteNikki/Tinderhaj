import type { Metadata } from 'next';

import { termsMetadata } from '@/constants/metadata';

import { LegalPage } from '@/components/legal/legal-page';
import { LegalSection } from '@/components/legal/legal-section';
import { TypographyList, TypographyP } from '@/components/typography';

export const metadata: Metadata = termsMetadata;

export default function TermsPage() {
  return (
    <LegalPage title='Terms of Service' lead='The rules for using Tinderhaj and taking part in the community.' updated='September 18, 2026'>
      <LegalSection delay={0.35} title='1. Using Tinderhaj'>
        <TypographyP>
          By creating an account or using Tinderhaj, you agree to these Terms of Service and our Privacy Policy. If you do not agree, please do not use the
          service.
        </TypographyP>
      </LegalSection>

      <LegalSection delay={0.45} title='2. Eligibility'>
        <TypographyP>
          You must be at least 13 years old, or the minimum age required in your country, to use Tinderhaj. If you are under the age of legal majority where you
          live, you may use the service only with the consent and supervision of a parent or guardian.
        </TypographyP>
      </LegalSection>

      <LegalSection delay={0.55} title='3. Your account'>
        <TypographyList>
          <li>You are responsible for providing accurate information and keeping your login details secure.</li>
          <li>You may not impersonate another person, create accounts for abusive purposes, or share access to your account.</li>
          <li>You must be legally allowed to use online services in your jurisdiction.</li>
        </TypographyList>
      </LegalSection>

      <LegalSection delay={0.65} title='4. Profiles and content'>
        <TypographyP>
          You are responsible for the content you submit, including profile text and images. You confirm that you have the right to share that content and that
          it does not violate the rights of others.
        </TypographyP>
        <TypographyP>
          By submitting content, you give Tinderhaj permission to store, process, and display it as needed to operate the service, including displaying verified
          profiles in discovery.
        </TypographyP>
      </LegalSection>

      <LegalSection delay={0.75} title='5. Community rules'>
        <TypographyP>You may not use Tinderhaj to:</TypographyP>
        <TypographyList>
          <li>Harass, threaten, exploit, or harm other people.</li>
          <li>Submit illegal, hateful, deceptive, sexually explicit, or infringing content.</li>
          <li>Attempt to access accounts, data, or systems without permission.</li>
          <li>Scrape, disrupt, overload, or reverse engineer the service.</li>
          <li>Use the service for spam, scams, or unauthorized commercial activity.</li>
        </TypographyList>
      </LegalSection>

      <LegalSection delay={0.85} title='6. Verification and moderation'>
        <TypographyP>
          Verification is a moderation decision and is not a guarantee about a profile or its owner. We may review, reject, restrict, or remove profiles and
          content that violate these terms or create risk for the community.
        </TypographyP>
      </LegalSection>

      <LegalSection delay={0.95} title='7. Third-party services'>
        <TypographyP>
          Tinderhaj depends on third-party providers for hosting, databases, email delivery, and file storage. We are not responsible for the availability,
          performance, or actions of those third-party services.
        </TypographyP>
      </LegalSection>

      <LegalSection delay={1.05} title='8. Account suspension and deletion'>
        <TypographyP>
          We may suspend or remove accounts, profiles, or content when necessary to protect the service, investigate abuse, comply with law, or enforce these
          terms. You can delete your account from Account Settings. Deletion is permanent for the account data managed by Tinderhaj, subject to backups and
          legal obligations.
        </TypographyP>
      </LegalSection>

      <LegalSection delay={1.15} title='9. Disclaimers'>
        <TypographyP>
          Tinderhaj is provided as an evolving service. Features may change, be interrupted, or become unavailable. To the extent permitted by law, Tinderhaj is
          provided without guarantees that it will always be available, secure, or error-free.
        </TypographyP>
      </LegalSection>

      <LegalSection delay={1.25} title='10. Limitation of liability'>
        <TypographyP>
          To the fullest extent permitted by law, Tinderhaj and its operator will not be liable for indirect, incidental, special, or consequential damages
          arising from your use of, or inability to use, the service.
        </TypographyP>
      </LegalSection>

      <LegalSection delay={1.35} title='11. Changes to these terms'>
        <TypographyP>
          We may update these terms as the service changes. The updated version will be posted on this page with a revised update date. Continued use of
          Tinderhaj after an update means you accept the revised terms.
        </TypographyP>
      </LegalSection>

      <LegalSection delay={1.45} title='12. Contact'>
        <TypographyP>
          Questions about these terms can be sent to{' '}
          <a className='text-foreground font-medium underline' href='mailto:contact@tinderhaj.com'>
            contact@tinderhaj.com
          </a>
          .
        </TypographyP>
      </LegalSection>

      <LegalSection delay={1.55} title='13. Governing law'>
        <TypographyP>
          These terms are governed by the laws of Germany, without regard to its conflict-of-law provisions, subject to any mandatory consumer protections that
          apply to you.
        </TypographyP>
      </LegalSection>
    </LegalPage>
  );
}
