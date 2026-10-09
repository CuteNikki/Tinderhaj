import type { Metadata } from 'next';
import Link from 'next/link';

import { privacyMetadata } from '@/constants/metadata';

import { LegalPage } from '@/components/legal/legal-page';
import { LegalSection } from '@/components/legal/legal-section';
import { TypographyList, TypographyP } from '@/components/typography';

export const metadata: Metadata = privacyMetadata;

export default function PrivacyPage() {
  return (
    <LegalPage title='Privacy Policy' lead='How Tinderhaj handles the information needed to run the service.' updated='October 9, 2026'>
      <LegalSection index={0} title='1. Introduction'>
        <TypographyP>
          This Privacy Policy explains how Tinderhaj collects, uses, and protects information when you use the service. By creating an account or using
          Tinderhaj, you acknowledge the practices described here.
        </TypographyP>
      </LegalSection>
      <LegalSection index={1} title='2. Who is responsible'>
        <TypographyP>
          The controller responsible for processing your information is Nikki Sophie Berthold, Friedrich-Karl-Straße 28, 32584 Löhne, Germany, reachable at{' '}
          <a className='text-foreground font-medium underline' href='mailto:contact@tinderhaj.com'>
            contact@tinderhaj.com
          </a>
          . Full contact details are in the{' '}
          <Link className='text-foreground font-medium underline' href='/imprint'>
            Imprint
          </Link>
          .
        </TypographyP>
      </LegalSection>
      <LegalSection index={2} title='3. Information you provide'>
        <TypographyP>We collect information you provide directly, including:</TypographyP>
        <TypographyList>
          <li>Account details such as your email address, username, and password credentials. Passwords are stored in hashed form.</li>
          <li>
            Sign-in security settings you choose to set up: the secret for your authenticator app and your backup codes (both stored encrypted), and the public
            keys of your passkeys. Passkeys&apos; private keys and your fingerprint or face never leave your device.
          </li>
          <li>
            If you sign in with another service, such as Google, Apple, Microsoft, GitHub, Discord, X, Twitch, or Facebook: your account ID there, your email
            address and whether that service verified it, and your name or handle there, which we use to suggest your username. We also receive access tokens
            from that service, which we store encrypted and don&apos;t use after you sign in. We don&apos;t keep your profile picture from it.
          </li>
          <li>
            Profile information about your sharks, such as display name, avatar and banner images, birthday (shown as an age), pronouns, location, size,
            interests, and biography.
          </li>
          <li>Hearts your profiles send and receive, when they were sent, and when you saw the ones you received.</li>
          <li>
            Moderation information such as verification status, which parts of a profile need fixing and a moderator&apos;s note about it, and, if your account
            is banned, the reason, when the ban ends, and which moderator banned you.
          </li>
          <li>Messages or requests you send to us, including privacy or support requests.</li>
        </TypographyList>
      </LegalSection>
      <LegalSection index={3} title='4. Information collected automatically'>
        <TypographyP>
          When you use Tinderhaj, we may receive limited technical information needed to operate and secure the service, such as your IP address, browser type,
          timestamps, and basic usage or error information provided by our hosting infrastructure.
        </TypographyP>
        <TypographyP>
          For each session where you are signed in, we store the IP address and browser (user agent) it was started from, along with when it started, when it
          was last active, and when it expires. You can see this list in Account Settings, so you can spot and sign out of sessions you don&apos;t recognize. We
          also count requests per IP address for a short time to limit repeated sign-in attempts.
        </TypographyP>
      </LegalSection>
      <LegalSection index={4} title='5. How we use information'>
        <TypographyP>We use information to:</TypographyP>
        <TypographyList>
          <li>Provide, operate, and maintain accounts, profiles, discovery, hearts, and matches.</li>
          <li>
            Authenticate users, maintain sessions, and send account emails: email verification, email change confirmations, password recovery, sign-in codes,
            and account deletion confirmations.
          </li>
          <li>Review profiles, enforce our Terms and Guidelines, prevent abuse, and keep the community safe.</li>
          <li>Diagnose problems, protect the service, and improve its features.</li>
        </TypographyList>
      </LegalSection>
      <LegalSection index={5} title='6. Legal bases for processing'>
        <TypographyP>We process your information on the following legal bases under the EU General Data Protection Regulation (GDPR):</TypographyP>
        <TypographyList>
          <li>
            To perform our agreement with you (Art. 6(1)(b) GDPR): your account, sign-in, profiles, hearts and matches, and the emails your account needs.
          </li>
          <li>
            Our legitimate interests (Art. 6(1)(f) GDPR) in a safe and working service: reviewing profiles, enforcing our rules and bans, limiting repeated
            sign-in attempts, the list of your sessions, and technical information for security and fixing problems.
          </li>
          <li>To comply with legal obligations (Art. 6(1)(c) GDPR), for example when we must keep or disclose information by law.</li>
          <li>Your consent (Art. 6(1)(a) GDPR), where we ask for it. You can withdraw consent at any time, without affecting what was done before.</li>
        </TypographyList>
      </LegalSection>
      <LegalSection index={6} title='7. Who can see what'>
        <TypographyP>
          Verified profile information may be visible to anyone through discovery and on your user page, along with your username and when you joined. Your user
          page, when its link is shared, shows a preview picture of your verified sharks. Profiles that aren&apos;t verified are visible only to you and to
          moderators.
        </TypographyP>
        <TypographyP>
          When one of your profiles sends a heart, the owner of the profile it goes to sees which of your profiles sent it. When two profiles heart each other,
          both owners see the match.
        </TypographyP>
        <TypographyP>
          Moderators and admins can see profiles waiting for review and the moderation information about them, along with your username, role, and any ban.
          Admins can also see your email address, whether it&apos;s verified, and how many sessions you have, and can sign you out everywhere, send you a
          password reset link, or delete your account.
        </TypographyP>
        <TypographyP>
          We do not sell personal information. We share information only with service providers needed to host, operate, secure, store, or deliver parts of the
          service, or when required for legal and safety reasons.
        </TypographyP>
      </LegalSection>
      <LegalSection index={7} title='8. Third-party services'>
        <TypographyP>We use these service providers, which process information on our behalf and only as needed to provide their services:</TypographyP>
        <TypographyList>
          <li>
            Vercel Inc. (USA) hosts the website. Every visit passes through it, so it processes technical information such as your IP address and the pages you
            request.
          </li>
          <li>
            Our database runs on a server we rent from Index-Hosting (Kurz &amp; Lankow GbR, Germany), in a data center in Germany. Accounts, profiles, hearts,
            and sessions are stored there.
          </li>
          <li>Resend, Inc. (USA) delivers our emails, so it processes your email address and the emails we send you.</li>
          <li>UploadThing (USA) stores the pictures you upload for your profiles.</li>
        </TypographyList>
        <TypographyP>
          If you choose to sign in with another service, that service learns that you are signing in to Tinderhaj, under its own privacy policy. You can
          disconnect it in Account Settings, as long as you keep another way to sign in.
        </TypographyP>
        <TypographyP>Tinderhaj links to its pages on other sites, such as GitHub. If you follow one, that site&apos;s own privacy policy applies.</TypographyP>
      </LegalSection>
      <LegalSection index={8} title='9. Cookies and browser storage'>
        <TypographyP>
          Tinderhaj uses only essential httpOnly cookies: to keep you signed in, and short-lived ones while you sign in with another service. If you use
          two-step sign-in, a short-lived cookie remembers that you entered your password while you enter the code, and if you choose &quot;Don&apos;t ask again
          on this device&quot;, a cookie lets that device skip the code for 30 days. If a banned account tries to sign in, a cookie lasting 15 minutes lets the
          ban page show that account its reason.
        </TypographyP>
        <TypographyP>
          Your browser&apos;s own storage keeps your selected theme, a profile you&apos;re writing until you save it, where you were on a page, and a note to
          send a sign-in code once. This stays on your device and isn&apos;t sent to us. We do not use advertising or cross-site tracking cookies, or analytics.
        </TypographyP>
      </LegalSection>
      <LegalSection index={9} title='10. Retention and deletion'>
        <TypographyP>
          We retain information while it is needed to provide the service, meet legal obligations, resolve disputes, and protect Tinderhaj. You can delete your
          account from Account Settings after confirming a link sent to your email. Account deletion removes your account, profiles and their hearts, sessions,
          passkeys, two-step sign-in settings, and pending email links from the application database, subject to backups and information we must retain by law.
          You can also delete a single profile, along with its hearts, at any time.
        </TypographyP>
        <TypographyP>
          Sessions end when you sign out or after a few days without use, and email links expire after one to 24 hours. Ban details are cleared when a ban is
          lifted, or at the next sign-in after it runs out.
        </TypographyP>
      </LegalSection>
      <LegalSection index={10} title='11. Your rights'>
        <TypographyP>
          Under the GDPR you have the right to access your information, to correct it, to have it deleted, to restrict its processing, to receive it in a
          portable format, and to object to processing based on our legitimate interests. Where we rely on your consent, you can withdraw it at any time.
        </TypographyP>
        <TypographyP>
          You can manage your username, email, password, two-step sign-in, passkeys, sessions, profiles, and account deletion in the app, or contact us at
          contact@tinderhaj.com for anything else.
        </TypographyP>
        <TypographyP>
          You also have the right to lodge a complaint with a data protection supervisory authority, for example the one where you live, or the one responsible
          for us: the State Commissioner for Data Protection and Freedom of Information of North Rhine-Westphalia (LDI NRW).
        </TypographyP>
      </LegalSection>
      <LegalSection index={11} title='12. Security'>
        <TypographyP>
          We use measures such as password hashing, protected sessions, optional two-step sign-in and passkeys, limits on repeated sign-in attempts, access
          controls, and encryption in transit to help protect information. No method of transmission or storage is completely secure, and we continue to improve
          our safeguards.
        </TypographyP>
      </LegalSection>
      <LegalSection index={12} title="13. Children's privacy">
        <TypographyP>
          Tinderhaj is not intended for children under 13, or under the minimum age required in your country. We do not knowingly collect personal information
          from children. If you believe a child has provided information, contact us so we can review and remove it where appropriate.
        </TypographyP>
      </LegalSection>
      <LegalSection index={13} title='14. International processing'>
        <TypographyP>
          Vercel, Resend, and UploadThing are based in the United States, so information they process may be transferred there. These transfers rely on the
          safeguards the GDPR provides for, such as the EU-U.S. Data Privacy Framework or the European Commission&apos;s standard contractual clauses.
        </TypographyP>
      </LegalSection>
      <LegalSection index={14} title='15. Changes to this policy'>
        <TypographyP>
          We may update this Privacy Policy as Tinderhaj changes. The updated version will be posted on this page with a revised update date.
        </TypographyP>
      </LegalSection>
      <LegalSection index={15} title='16. Contact us'>
        <TypographyP>
          Questions about this Privacy Policy or how we handle information can be sent to{' '}
          <a className='text-foreground font-medium underline' href='mailto:contact@tinderhaj.com'>
            contact@tinderhaj.com
          </a>
          .
        </TypographyP>
      </LegalSection>
    </LegalPage>
  );
}
