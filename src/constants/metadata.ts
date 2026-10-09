import { Metadata } from 'next';

export const SITE_URL = 'https://tinderhaj.com';
export const SITE_NAME = 'Tinderhaj';
export const SITE_TAGLINE = 'The dating site for Blåhaj';

/**
 * Shared by every page. Open Graph and Twitter set no title or description of
 * their own, so each page's are used for them, and every page shares the image
 * from `app/opengraph-image.tsx`.
 */
export const layoutMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s · ${SITE_NAME}`,
    default: `${SITE_NAME} · Meet sharks`,
  },
  description:
    "The world's first dating site exclusively for IKEA's Blåhaj plush sharks. Browse profiles and find the perfect match by color, size, and squishiness.",
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

/** For pages only their account, or moderators, can see: kept out of search. */
const unlisted: Metadata = { robots: { index: false, follow: false } };

export const homeMetadata: Metadata = {
  title: { absolute: `${SITE_NAME} · Meet sharks` },
  description:
    "A warm, weird little corner of the internet for Blåhaj looking for their person. The world's first dating site for IKEA's plush sharks, matching by color, size, and squishiness.",
};

export const notFoundMetadata: Metadata = {
  title: 'Not Found',
  description: 'This page swam off. Head back home to continue your Blåhaj adventure.',
};

export const discoveryMetadata: Metadata = {
  title: 'Discovery',
  description: 'Browse Blåhaj profiles and find your perfect match by color, size, and squishiness.',
};

export const signInMetadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to Tinderhaj and pick up where you left off with your plush matches.',
};

export const signUpMetadata: Metadata = {
  title: 'Sign Up',
  description: 'Create your Tinderhaj account and find your perfect plush match.',
};

export const forgotPasswordMetadata: Metadata = {
  title: 'Recovery',
  description: 'Request a password reset link for your Tinderhaj account.',
};

export const resetPasswordMetadata: Metadata = {
  ...unlisted,
  title: 'Recovery',
  description: 'Choose a new password for your Tinderhaj account.',
};

export const twoFactorMetadata: Metadata = {
  ...unlisted,
  title: 'Two-Step Sign-In',
  description: 'Finish signing in to Tinderhaj with a code.',
};

export const verifiedMetadata: Metadata = {
  ...unlisted,
  title: 'Email Verification',
  description: 'Confirm the email address of your Tinderhaj account.',
};

export const bannedMetadata: Metadata = {
  ...unlisted,
  title: 'Banned',
  description: 'Why your Tinderhaj account can’t sign in.',
};

export const newProfileMetadata: Metadata = {
  ...unlisted,
  title: 'New Profile',
  description: 'Create a new Tinderhaj profile for one of your sharks.',
};

export const editProfileMetadata: Metadata = {
  ...unlisted,
  title: 'Edit Profile',
  description: 'Change one of your Tinderhaj profiles.',
};

export const profilesMetadata: Metadata = {
  ...unlisted,
  title: 'Profiles',
  description: 'Create and manage your Tinderhaj profiles.',
};

export const heartsMetadata: Metadata = {
  ...unlisted,
  title: 'Hearts',
  description: 'Your matches, and the hearts your sharks sent and received.',
};

export const accountMetadata: Metadata = {
  ...unlisted,
  title: 'Settings',
  description: 'Manage your Tinderhaj account.',
};

export const deleteAccountMetadata: Metadata = {
  ...unlisted,
  title: 'Delete Account',
  description: 'Confirm deleting your Tinderhaj account.',
};

export const verifyMetadata: Metadata = {
  ...unlisted,
  title: 'Verification',
  description: 'Review and verify Tinderhaj profiles.',
};

export const usersMetadata: Metadata = {
  ...unlisted,
  title: 'Users',
  description: 'See and manage the accounts on Tinderhaj.',
};

export const userMetadata: Metadata = {
  ...unlisted,
  title: 'User',
  description: 'A Tinderhaj account, for moderators.',
};

export const userPageMetadata: Metadata = {
  title: 'Sharks',
  description: 'All the sharks of someone on Tinderhaj.',
};

export const privacyMetadata: Metadata = {
  title: 'Privacy',
  description: 'Learn how Tinderhaj collects, uses, and protects your information.',
};

export const termsMetadata: Metadata = {
  title: 'Terms',
  description: 'Read the terms for using Tinderhaj.',
};

export const guideMetadata: Metadata = {
  title: 'Guide',
  description: 'How Tinderhaj works, from signing up to your first match.',
};

export const featuresMetadata: Metadata = {
  title: 'Features',
  description: 'Everything Tinderhaj does for you and your sharks: discovery, hearts and matches, hand-checked profiles, and more.',
};

export const contactMetadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Tinderhaj by email, or find it around the internet.',
};

export const aboutMetadata: Metadata = {
  title: 'About',
  description: 'Why Tinderhaj exists, who makes it, and what it cares about: a free, open-source dating site for Blåhaj.',
};

export const communityMetadata: Metadata = {
  title: 'Community',
  description: 'Where Blåhaj and their people hang out around the internet, and the ways to join in with Tinderhaj.',
};

export const guidelinesMetadata: Metadata = {
  title: 'Guidelines',
  description: 'What moderators look for in a Blåhaj profile, how review works, and what happens when something isn’t right.',
};

export const imprintMetadata: Metadata = {
  title: 'Imprint',
  description: 'Legal information and contact details for Tinderhaj.',
};
