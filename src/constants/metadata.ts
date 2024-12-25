import { Metadata } from 'next';

export const defaultData: Metadata = {
  title: 'Tinderhaj',
  description: 'A dating app like Tinder for Blåhaj.',
  openGraph: {
    url: 'https://tinderhaj.com',
    images: [
      {
        url: 'https://tinderhaj.com/opengraph-image.gif',
        width: 96,
        height: 96,
        alt: 'Tinderhaj',
      },
    ],
  },
};

export const homeData: Metadata = {
  title: 'Tinderhaj - Home',
  description: 'A dating app like Tinder for Blåhaj.',
  openGraph: {
    url: 'https://tinderhaj.com',
    images: [
      {
        url: 'https://tinderhaj.com/opengraph-image.gif',
        width: 96,
        height: 96,
        alt: 'Tinderhaj',
      },
    ],
  },
};

export const notFoundData: Metadata = {
  title: 'Tinderhaj - 404',
  description: "Oops! You've swum too far! Looks like this page got lost in the deep sea.",
  openGraph: {
    url: 'https://tinderhaj.com',
    images: [
      {
        url: 'https://tinderhaj.com/opengraph-image.gif',
        width: 96,
        height: 96,
        alt: 'Tinderhaj',
      },
    ],
  },
};

export const constructionData: Metadata = {
  title: 'Tinderhaj - Construction',
  description: 'Oops! This feature is still under construction. Please come back later!',
  openGraph: {
    url: 'https://tinderhaj.com',
    images: [
      {
        url: 'https://tinderhaj.com/opengraph-image.gif',
        width: 96,
        height: 96,
        alt: 'Tinderhaj',
      },
    ],
  },
};
