'use client';

import { CheckIcon, CopyIcon } from 'lucide-react';
import { useState } from 'react';

import { CONTACT_EMAIL } from '@/constants/contact';

import { Button } from '@/components/ui/button';

/** Copies the email address, for those who'd rather paste it than open their mail app. */
export function CopyEmail() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Not allowed here (an insecure page, say): the address is right there to select
    }
  }

  return (
    <Button type='button' variant='outline' className='h-10 rounded-full px-5' onClick={copy}>
      {copied ? <CheckIcon /> : <CopyIcon />}
      {copied ? 'Copied' : 'Copy'}
    </Button>
  );
}
