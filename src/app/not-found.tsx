import { Metadata } from 'next';

import { NotFound } from '@/components/pages/not-found';

export const metadata: Metadata = {
  title: 'Tinderhaj - 404',
  description: "Oops! You've swum too far! Looks like this page got lost in the deep sea.",
};

export default function Page() {
  return <NotFound />;
}
