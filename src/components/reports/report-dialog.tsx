'use client';

import { FlagIcon, Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useId, useState, useTransition } from 'react';
import { toast } from 'sonner';

import type { ReportReason } from '@/generated/enums';
import { reportProfile } from '@/lib/actions';
import { REPORT_DETAILS_MAX, REPORT_REASONS } from '@/lib/reports';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type Shark = { id: string; displayName: string };

/**
 * Reports `shark` to the moderators, or with `contact`, the way to reach its
 * owner, which only matches see. Whatever `children` is opens it.
 */
export function ReportDialog({ shark, contact = false, children }: { shark: Shark; contact?: boolean; children: React.ReactNode }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | ''>('');
  const [details, setDetails] = useState('');
  const [pending, startTransition] = useTransition();
  // "Something else" needs saying what.
  const ready = !!reason && (reason !== 'OTHER' || !!details.trim());

  function send() {
    if (!reason) return;
    startTransition(async () => {
      const error = await reportProfile({ profileId: shark.id, reason, details, contact }).catch(() => ({ message: 'Unable to send the report!' }));
      if (error) return void toast.error(error.message, { duration: 5000, position: 'top-center' });

      setOpen(false);
      setReason('');
      setDetails('');
      toast.success('Thanks for telling us. A moderator will take a look.', { duration: 5000, position: 'top-center' });
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{contact ? `Report how to reach ${shark.displayName}’s owner` : `Report ${shark.displayName}`}</DialogTitle>
          <DialogDescription>Only moderators see reports, and nobody is told who made one.</DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor={`${id}-reason`}>What’s wrong?</Label>
            <Select value={reason} onValueChange={(value) => setReason(value as ReportReason)}>
              <SelectTrigger id={`${id}-reason`} className='w-full'>
                <SelectValue placeholder='Pick a reason' />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(REPORT_REASONS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor={`${id}-details`}>{reason === 'OTHER' ? 'What’s wrong' : 'Anything else (optional)'}</Label>
            <Textarea
              id={`${id}-details`}
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              maxLength={REPORT_DETAILS_MAX}
              placeholder='Whatever helps a moderator see it, e.g. which picture.'
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='secondary'>Cancel</Button>
          </DialogClose>
          <Button variant='destructive' onClick={send} disabled={pending || !ready}>
            {pending ? <Loader2Icon className='animate-spin' aria-hidden='true' /> : <FlagIcon aria-hidden='true' />}
            Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * A small flag beside the heart on a shark's card, for reporting it. Signed
 * out, it leads to signing in, as the heart does. Not on your own sharks.
 */
export function ReportButton({ shark, signedIn, own }: { shark: Shark; signedIn: boolean; own: boolean }) {
  if (own) return null;

  const label = signedIn ? `Report ${shark.displayName}` : `Sign in to report ${shark.displayName}`;
  const button = signedIn ? (
    <Button variant='ghost' size='icon-sm' className='text-muted-foreground' aria-label={label}>
      <FlagIcon aria-hidden='true' />
    </Button>
  ) : (
    <Button variant='ghost' size='icon-sm' className='text-muted-foreground' asChild>
      <Link href='/sign-in' aria-label={label}>
        <FlagIcon aria-hidden='true' />
      </Link>
    </Button>
  );

  if (!signedIn) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    );
  }

  // Both triggers on the one button: the dialog's inside the tooltip's.
  return (
    <Tooltip>
      <ReportDialog shark={shark}>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
      </ReportDialog>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
