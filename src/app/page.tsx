import { Metadata } from 'next';

import { HomePage } from '@/components/pages/home';

export const metadata: Metadata = {
  title: 'Tinderhaj - Home',
  description: 'A dating app like Tinder for Blåhaj.',
};

export default function Home() {
  return <HomePage />;
}
