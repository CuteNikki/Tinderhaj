import { Metadata } from 'next';

export const layoutMetadata: Metadata = {
  title: 'Tinderhaj',
  description: `The world's first dating site exclusively for IKEA's Blåhaj plush sharks.`,
  openGraph: {
    url: 'https://tinderhaj.com',
    images: [
      {
        url: 'https://tinderhaj.com/blahaj.webp',
        alt: 'Blåhaj',
        width: 128,
        height: 128,
      },
    ],
  },
};

export const homeMetadata: Metadata = {
  title: 'Tinderhaj - Home',
  description: `Welcome to the world's first dating site exclusively for IKEA's Blåhaj plush sharks.`,
  openGraph: {
    url: 'https://tinderhaj.com',
    images: [
      {
        url: 'https://tinderhaj.com/blahaj.webp',
        alt: 'Blåhaj',
        width: 128,
        height: 128,
      },
    ],
  },
};

export const discoveryMetadata: Metadata = {
  title: 'Tinderhaj - Discovery',
  description: `Discover your perfect match among IKEA's Blåhaj plush sharks.`,
  openGraph: {
    url: 'https://tinderhaj.com/about',
    images: [
      {
        url: 'https://tinderhaj.com/blahaj.webp',
        alt: 'Blåhaj',
        width: 128,
        height: 128,
      },
    ],
  },
};

export const notFoundMetadata: Metadata = {
  title: 'Tinderhaj - Not Found',
  description: `Oops! Looks like you've swum too far. Or we lost this page in the deep sea.`,
  openGraph: {
    url: 'https://tinderhaj.com/404',
    images: [
      {
        url: 'https://tinderhaj.com/blahajSpinSmall.gif',
        alt: 'Blåhaj Spin',
        width: 382,
        height: 201,
      },
    ],
  },
};

export const signInMetadata: Metadata = {
  title: 'Tinderhaj - Sign In',
  description: `Sign in to the world's first dating site exclusively for IKEA's Blåhaj plush sharks.`,
  openGraph: {
    url: 'https://tinderhaj.com/sign-in',
    images: [
      {
        url: 'https://tinderhaj.com/blahaj.webp',
        alt: 'Blåhaj',
        width: 128,
        height: 128,
      },
    ],
  },
};
