import type { Metadata } from 'next';
import Link from 'next/link';

import { MAX_PROFILES } from '@/constants/auth';
import { termsMetadata } from '@/constants/metadata';
import { HEARTS_PER_DAY } from '@/lib/hearts';

import { LegalPage } from '@/components/legal/legal-page';
import { LegalSection } from '@/components/legal/legal-section';
import { TypographyList, TypographyP } from '@/components/typography';

export const metadata: Metadata = termsMetadata;

export default function TermsPage() {
  return (
    <LegalPage title='Terms of Service' lead='The rules for using Tinderhaj and taking part in the community.' updated='October 9, 2026'>
      <LegalSection index={0} title='1. Using Tinderhaj'>
        <TypographyP>
          By creating an account or using Tinderhaj, you agree to these Terms of Service, our{' '}
          <Link className='text-foreground font-medium underline' href='/guidelines'>
            Guidelines
          </Link>
          , and our{' '}
          <Link className='text-foreground font-medium underline' href='/privacy'>
            Privacy Policy
          </Link>
          . If you do not agree, please do not use the service.
        </TypographyP>
      </LegalSection>

      <LegalSection index={1} title='2. What Tinderhaj is'>
        <TypographyP>
          Tinderhaj is a free, just-for-fun dating site for plush sharks. Profiles are for plush sharks such as IKEA&apos;s Blåhaj, not for people. Each account
          can have up to {MAX_PROFILES} profiles, and each profile can send up to {HEARTS_PER_DAY} hearts a day. Two profiles hearting each other is a match.
          There is nothing to buy.
        </TypographyP>
      </LegalSection>

      <LegalSection index={2} title='3. Eligibility'>
        <TypographyP>
          You must be at least 13 years old, or the minimum age required in your country, to use Tinderhaj. If you are under the age of legal majority where you
          live, you may use the service only with the consent and supervision of a parent or guardian.
        </TypographyP>
      </LegalSection>

      <LegalSection index={3} title='4. Your account'>
        <TypographyList>
          <li>You are responsible for providing accurate information and keeping your login details secure.</li>
          <li>You may not impersonate another person, create accounts for abusive purposes, or share access to your account.</li>
          <li>You must be legally allowed to use online services in your jurisdiction.</li>
          <li>If you sign in with another service, such as Google or GitHub, its own terms apply to your account there.</li>
        </TypographyList>
      </LegalSection>

      <LegalSection index={4} title='5. Profiles and content'>
        <TypographyP>
          You are responsible for the content you submit, including profile text and images. You confirm that the profiles are of your own plush sharks, that
          you have the right to share that content, and that it does not violate the rights of others.
        </TypographyP>
        <TypographyP>
          By submitting content, you give Tinderhaj permission to store, process, and display it as needed to operate the service, including showing verified
          profiles in discovery, on your user page, and in the preview picture shown when a link to your user page is shared. This permission ends when you
          delete the content, subject to backups and legal obligations.
        </TypographyP>
      </LegalSection>

      <LegalSection index={5} title='6. Community rules'>
        <TypographyP>You may not use Tinderhaj to:</TypographyP>
        <TypographyList>
          <li>Harass, threaten, exploit, or harm other people.</li>
          <li>Submit illegal, hateful, deceptive, sexually explicit, or infringing content.</li>
          <li>Attempt to access accounts, data, or systems without permission.</li>
          <li>Scrape, disrupt, overload, or reverse engineer the service.</li>
          <li>Use the service for spam, scams, or unauthorized commercial activity.</li>
        </TypographyList>
        <TypographyP>
          Profiles must also follow our{' '}
          <Link className='text-foreground font-medium underline' href='/guidelines'>
            Guidelines
          </Link>
          , which say what moderators look for and are part of these terms.
        </TypographyP>
      </LegalSection>

      <LegalSection index={6} title='7. Verification and moderation'>
        <TypographyP>
          A moderator reviews every profile before it appears in discovery. Editing a verified profile sends it back for review. If a profile is rejected, you
          are told which parts need fixing, often with a note, and can fix them and send it in again. Moderators may also take a verified profile out of
          discovery to review it again.
        </TypographyP>
        <TypographyP>
          Verification is a moderation decision and is not a guarantee about a profile or its owner. We may review, reject, restrict, or remove profiles and
          content that violate these terms or the Guidelines, or create risk for the community.
        </TypographyP>
      </LegalSection>

      <LegalSection index={7} title='8. Reporting content'>
        <TypographyP>
          If you come across content you believe is illegal or breaks these terms, email{' '}
          <a className='text-foreground font-medium underline' href='mailto:contact@tinderhaj.com'>
            contact@tinderhaj.com
          </a>{' '}
          with a link to it and why you think so. A person reviews every report, and we let you know what we decided.
        </TypographyP>
      </LegalSection>

      <LegalSection index={8} title='9. Bans, suspension, and deletion'>
        <TypographyP>
          Moderators may ban accounts that break these terms, for a set time or until the ban is lifted. A banned account can&apos;t sign in, and is shown the
          reason for the ban and when it ends. If you think a ban is a mistake, contact us and a person will look at it again.
        </TypographyP>
        <TypographyP>
          We may also suspend or remove accounts, profiles, or content when necessary to protect the service, investigate abuse, comply with law, or enforce
          these terms. You can delete a profile at any time, and your whole account from Account Settings after confirming a link sent to your email. Deletion
          is permanent for the account data managed by Tinderhaj, subject to backups and legal obligations.
        </TypographyP>
      </LegalSection>

      <LegalSection index={9} title='10. Third-party services'>
        <TypographyP>
          Tinderhaj depends on third-party providers for hosting, databases, email delivery, file storage, and signing in with other services. We are not
          responsible for the availability, performance, or actions of those third-party services.
        </TypographyP>
      </LegalSection>

      <LegalSection index={10} title='11. Disclaimers'>
        <TypographyP>
          Tinderhaj is provided as an evolving service. Features may change, be interrupted, or become unavailable. To the extent permitted by law, Tinderhaj is
          provided without guarantees that it will always be available, secure, or error-free.
        </TypographyP>
      </LegalSection>

      <LegalSection index={11} title='12. Limitation of liability'>
        <TypographyP>
          We are liable without limitation for intent and gross negligence, for injury to life, body, or health, and under the German Product Liability Act. For
          slight negligence, we are liable only if we breach an essential obligation, meaning one that makes using the service possible in the first place and
          that you can regularly rely on, and then only for the foreseeable damage typical for this kind of service. Otherwise, our liability is excluded. These
          limits also apply to anyone acting on our behalf.
        </TypographyP>
      </LegalSection>

      <LegalSection index={12} title='13. Changes to these terms'>
        <TypographyP>
          We may update these terms as the service changes. The updated version will be posted on this page with a revised update date. Continued use of
          Tinderhaj after an update means you accept the revised terms.
        </TypographyP>
      </LegalSection>

      <LegalSection index={13} title='14. Contact'>
        <TypographyP>
          Questions about these terms can be sent to{' '}
          <a className='text-foreground font-medium underline' href='mailto:contact@tinderhaj.com'>
            contact@tinderhaj.com
          </a>
          .
        </TypographyP>
      </LegalSection>

      <LegalSection index={14} title='15. Governing law'>
        <TypographyP>
          These terms are governed by the laws of Germany, without regard to its conflict-of-law provisions, subject to any mandatory consumer protections that
          apply to you.
        </TypographyP>
      </LegalSection>
    </LegalPage>
  );
}
