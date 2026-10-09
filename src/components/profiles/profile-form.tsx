'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon, PlusIcon, TriangleAlertIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import {
  BLAHAJ_SIZE_CM,
  BLAHAJ_SIZE_INCH,
  MAX_BIO_LENGTH,
  MAX_DISPLAY_NAME_LENGTH,
  MAX_INTEREST_LENGTH,
  MAX_INTERESTS,
  MAX_LOCATION_LENGTH,
  MAX_PRONOUNS_LENGTH,
  MIN_DISPLAY_NAME_LENGTH,
} from '@/constants/auth';
import { MAX_AVATAR_SIZE_MB, MAX_BANNER_SIZE_MB } from '@/constants/uploads';
import { createProfile, updateProfile } from '@/lib/actions';
import { CONTENT_DELAY, STAGGER } from '@/lib/motion';
import { profileFieldLabel } from '@/lib/profile-fields';
import type { ProfileWithOwner } from '@/lib/queries';
import { createProfileSchema } from '@/lib/schemas';
import { cn } from '@/lib/utils';

import { useConfirm } from '@/components/common/confirm-dialog';
import { Eyebrow } from '@/components/common/heading';
import { SettingsSection } from '@/components/common/settings-section';
import { DiscoveryProfile } from '@/components/discovery/profile';
import { ScrollReveal } from '@/components/home/scroll-reveal';
import { ImageUploadField } from '@/components/profiles/image-upload-field';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type Values = z.input<typeof createProfileSchema>;

const EMPTY: Values = {
  displayName: '',
  avatarUrl: null,
  bannerUrl: null,
  bio: '',
  location: '',
  pronouns: '',
  // Optional: empty unless they fill it in.
  size: null,
  unit: 'CM',
  birthday: null,
  interests: [],
};

/** Where a new profile you've started waits on this device, until you create it. */
const draftKey = (username: string) => `profile-draft:${username}`;

/** A new profile you started earlier, if there's one. Kept in the browser, so it may be gone, or not readable. */
function readDraft(username: string): Values | null {
  try {
    const saved = JSON.parse(localStorage.getItem(draftKey(username)) ?? 'null');
    if (!saved || typeof saved !== 'object') return null;
    return { ...EMPTY, ...saved, birthday: saved.birthday ? new Date(saved.birthday) : null };
  } catch {
    return null;
  }
}

function writeDraft(username: string, values: Values | null) {
  try {
    if (values) localStorage.setItem(draftKey(username), JSON.stringify(values));
    else localStorage.removeItem(draftKey(username));
  } catch {
    // Not kept, then: the form still works
  }
}

/** Whether anything's been filled in at all. */
function started(values: Values) {
  return Object.entries(values).some(([key, value]) => key !== 'unit' && (Array.isArray(value) ? value.length > 0 : value !== null && value !== ''));
}

/**
 * A shark's profile to fill in, on a page of its own: new (`username` is
 * whose it'll be), or one of yours to change (`profile`). Its card shows
 * beside it as it's filled in, on wide screens.
 */
export function ProfileForm({ username, profile }: { username: string; profile?: ProfileWithOwner }) {
  const router = useRouter();
  const [ask, confirmDialog] = useConfirm();
  const [interests, setInterests] = useState<string[]>(profile?.interests ?? []);
  const [newInterest, setNewInterest] = useState('');
  // A new one picked up from where you left it, on this device
  const [resumed, setResumed] = useState(false);

  const form = useForm<Values, unknown, z.output<typeof createProfileSchema>>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: profile
      ? {
          displayName: profile.displayName,
          avatarUrl: profile.avatarUrl ?? null,
          bannerUrl: profile.bannerUrl ?? null,
          bio: profile.bio ?? '',
          location: profile.location ?? '',
          pronouns: profile.pronouns ?? '',
          size: profile.size,
          unit: profile.unit,
          birthday: profile.birthday,
          interests: profile.interests,
        }
      : EMPTY,
  });

  // A new one: pick up where you left off, then keep what you fill in, until it's created
  useEffect(() => {
    if (profile) return;
    const draft = readDraft(username);
    if (draft && started(draft)) {
      form.reset(draft);
      // Only once it's on the page: the draft is in this device's storage, which the server rendering it can't see
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInterests(draft.interests ?? []);
      setResumed(true);
    }
  }, [form, profile, username]);

  // Everything filled in so far, as it changes; read whole when saving the draft
  const values = useWatch({ control: form.control });
  useEffect(() => {
    if (profile) return;
    const draft = { ...form.getValues(), interests };
    writeDraft(username, started(draft) ? draft : null);
  }, [values, interests, form, profile, username]);

  function startOver() {
    form.reset(EMPTY);
    setInterests([]);
    setNewInterest('');
    setResumed(false);
    writeDraft(username, null);
  }

  /** Leaving: changes to one that's saved would be lost, so ask first; a new one waits on this device. */
  async function leave(event: React.MouseEvent) {
    if (!profile || unchanged) return;
    event.preventDefault();
    const confirmed = await ask({
      title: 'Discard your changes?',
      description: `Nothing you've changed on ${profile.displayName} is saved yet.`,
      action: 'Discard',
      destructive: true,
    });
    if (confirmed) router.push('/dashboard/profiles');
  }

  const preview = values;
  const unit = preview.unit;
  const submitting = form.formState.isSubmitting;
  // Nothing to save until something's changed: a field, or an interest added or taken away
  const interestsChanged = interests.join('\n') !== (profile?.interests ?? []).join('\n');
  const unchanged = !!profile && !form.formState.isDirty && !interestsChanged;
  // A new one needs a name, at least, before there's anything to create
  const nameless = !profile && (preview.displayName ?? '').trim().length < MIN_DISPLAY_NAME_LENGTH;

  /** What a moderator asked to have changed, for a profile sent back. */
  const flagged = (key: string) => profile?.status === 'REJECTED' && profile.rejectedFields.includes(key);

  function addInterest() {
    const value = newInterest.trim();
    if (!value || interests.length >= MAX_INTERESTS || interests.includes(value)) return;
    setInterests([...interests, value]);
    setNewInterest('');
  }

  async function onSubmit(data: z.output<typeof createProfileSchema>) {
    // Live in discovery: saving takes it out, so say so first
    if (profile?.status === 'VERIFIED') {
      const confirmed = await ask({
        title: `Take ${profile.displayName} out of discovery?`,
        description: 'Saving changes takes it out of discovery until you send it for review again and it’s verified.',
        action: 'Save changes',
        destructive: true,
      });
      if (!confirmed) return;
    }

    const error = profile ? await updateProfile({ ...data, id: profile.id, interests }) : await createProfile({ ...data, interests });
    if (error) return void toast.error(error.message, { duration: 5000, position: 'top-center' });

    if (!profile) writeDraft(username, null);
    toast.success('Profile saved as a draft. Submit it for review when you’re ready.', { duration: 5000, position: 'top-center' });
    router.push('/dashboard/profiles');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-x-8'>
        <div className='grid gap-6'>
          {resumed && (
            <div className='border-foreground/10 bg-card flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border p-3 text-sm'>
              <p className='text-muted-foreground mr-auto text-pretty'>Picked up where you left off. It&apos;s kept on this device until you create it.</p>
              <Button type='button' variant='outline' size='sm' onClick={startOver}>
                Start over
              </Button>
            </div>
          )}
          {profile?.status === 'VERIFIED' && (
            // On small screens, where the save bar has no room to say it
            <ScrollReveal delay={CONTENT_DELAY} className='sm:hidden'>
              <p className='flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-600 dark:text-amber-400'>
                <TriangleAlertIcon className='mt-0.5 size-4 shrink-0' aria-hidden='true' />
                This profile is live in discovery. Saving changes takes it out until you send it for review again and it&apos;s verified.
              </p>
            </ScrollReveal>
          )}
          {profile?.status === 'REJECTED' && (profile.rejectedFields.length > 0 || profile.rejectionNote) && (
            <ScrollReveal delay={CONTENT_DELAY}>
              <div className='border-destructive/30 bg-destructive/10 text-destructive rounded-lg border p-3 text-sm'>
                {profile.rejectedFields.length > 0 && (
                  <div className='flex flex-wrap items-center gap-1.5'>
                    <span className='font-semibold'>Needs fixing:</span>
                    {profile.rejectedFields.map((field) => (
                      <Badge key={field} variant='destructive'>
                        {profileFieldLabel(field)}
                      </Badge>
                    ))}
                  </div>
                )}
                {profile.rejectionNote && (
                  <p className={profile.rejectedFields.length > 0 ? 'mt-2 leading-relaxed' : 'leading-relaxed'}>
                    <span className='font-semibold'>Note:</span> {profile.rejectionNote}
                  </p>
                )}
              </div>
            </ScrollReveal>
          )}

          <SettingsSection title='Name' description='What everyone sees first, and what they call it.' delay={CONTENT_DELAY}>
            <div className='grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]'>
              <FormField
                control={form.control}
                name='displayName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Display name <span className='text-destructive'>*</span>
                      <Flag show={flagged('displayName')} />
                    </FormLabel>
                    <FormControl>
                      <Input maxLength={MAX_DISPLAY_NAME_LENGTH} required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='pronouns'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Pronouns
                      <Flag show={flagged('pronouns')} />
                    </FormLabel>
                    <FormControl>
                      <Input maxLength={MAX_PRONOUNS_LENGTH} placeholder='e.g. they/them' {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </SettingsSection>

          <SettingsSection
            title='Pictures'
            description='A wide one across the top of its card, and a round one for its face, laid out as they show.'
            delay={CONTENT_DELAY + STAGGER}
          >
            <div className='@container'>
              {/* Side by side only when the card itself has room, whatever the screen */}
              <div className='grid items-start gap-5 @2xl:grid-cols-[minmax(0,1fr)_28rem]'>
                <div className='grid gap-3'>
                  <dl className='grid gap-3 text-sm'>
                    <PictureHint name='Banner' flagged={flagged('bannerUrl')}>
                      5:2, like 1200×480px, up to {MAX_BANNER_SIZE_MB}MB.
                    </PictureHint>
                    <PictureHint name='Avatar' flagged={flagged('avatarUrl')}>
                      Square, like 512×512px, up to {MAX_AVATAR_SIZE_MB}MB.
                    </PictureHint>
                  </dl>
                  <p className='text-muted-foreground text-xs text-pretty'>Click either picture to upload a new one.</p>
                </div>
                {/* As on its card: the avatar over the banner's bottom corner */}
                <div className='relative w-full max-w-md pb-10'>
                  <FormField
                    control={form.control}
                    name='bannerUrl'
                    render={({ field }) => (
                      <FormItem>
                        <ImageUploadField bare label='Banner' endpoint='profileBanner' value={field.value ?? null} onChange={field.onChange} shape='banner' />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='avatarUrl'
                    render={({ field }) => (
                      <FormItem className='absolute bottom-0 left-4 sm:left-6'>
                        <ImageUploadField
                          bare
                          label='Avatar'
                          endpoint='profileAvatar'
                          value={field.value ?? null}
                          onChange={field.onChange}
                          shape='circle'
                          className='ring-card size-24 rounded-full shadow-md ring-4'
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection title='About' description='In its own words, and the things it loves.' delay={CONTENT_DELAY + 2 * STAGGER}>
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='bio'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center justify-between'>
                      <FormLabel>
                        Bio
                        <Flag show={flagged('bio')} />
                      </FormLabel>
                      <span className='text-muted-foreground text-xs tabular-nums'>
                        {(field.value ?? '').length}/{MAX_BIO_LENGTH}
                      </span>
                    </div>
                    <FormControl>
                      <Textarea maxLength={MAX_BIO_LENGTH} placeholder='Loves long floats in the bath…' {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <div className='flex items-center justify-between'>
                  <FormLabel>
                    Interests
                    <Flag show={flagged('interests')} />
                  </FormLabel>
                  <span className='text-muted-foreground text-xs tabular-nums'>
                    {interests.length}/{MAX_INTERESTS}
                  </span>
                </div>
                {interests.length > 0 && (
                  <div className='flex flex-wrap gap-1.5'>
                    {interests.map((interest) => (
                      <Badge key={interest} variant='secondary' className='gap-1 py-1 pr-1 pl-2.5'>
                        {interest}
                        <button
                          type='button'
                          aria-label={`Remove ${interest}`}
                          onClick={() => setInterests(interests.filter((i) => i !== interest))}
                          className='hover:bg-foreground/10 rounded-full p-0.5'
                        >
                          <XIcon className='size-3' aria-hidden='true' />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                {interests.length < MAX_INTERESTS && (
                  <div className='flex items-center gap-2'>
                    <Input
                      value={newInterest}
                      maxLength={MAX_INTEREST_LENGTH}
                      placeholder='e.g. Cuddles'
                      aria-label='New interest'
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addInterest();
                        }
                      }}
                    />
                    <Button type='button' variant='outline' size='icon' aria-label='Add interest' onClick={addInterest} disabled={!newInterest.trim()}>
                      <PlusIcon />
                    </Button>
                  </div>
                )}
              </FormItem>
            </div>
          </SettingsSection>

          <SettingsSection title='Details' description='All optional, to help the right sharks find it.' delay={CONTENT_DELAY + 3 * STAGGER}>
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='birthday'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Birthday
                      <Flag show={flagged('birthday')} />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        {...field}
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='location'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Location
                      <Flag show={flagged('location')} />
                    </FormLabel>
                    <FormControl>
                      <Input maxLength={MAX_LOCATION_LENGTH} placeholder='e.g. Bedroom corner' {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='size'
                render={({ field }) => (
                  <FormItem className='sm:col-span-2'>
                    <FormLabel>
                      Size
                      <Flag show={flagged('size')} />
                    </FormLabel>
                    <div className='flex items-center gap-2'>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='Optional'
                          className='sm:max-w-40'
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                        />
                      </FormControl>
                      <FormField
                        control={form.control}
                        name='unit'
                        render={({ field: unitField }) => (
                          <Select value={unitField.value} onValueChange={unitField.onChange}>
                            <SelectTrigger className='w-24' aria-label='Unit'>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='CM'>cm</SelectItem>
                              <SelectItem value='INCH'>inch</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <p className='text-muted-foreground text-xs'>
                      IKEA BLÅHAJ come in two sizes: small, {unit === 'INCH' ? `${BLAHAJ_SIZE_INCH.small} inches` : `${BLAHAJ_SIZE_CM.small}cm`}, and large,{' '}
                      {unit === 'INCH' ? `${BLAHAJ_SIZE_INCH.large} inches` : `${BLAHAJ_SIZE_CM.large}cm`}.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </SettingsSection>
        </div>

        {/* Its card exactly as discovery will show it, and no wider than there: beside the form on wide screens, staying in view as it scrolls, and on narrower ones under it, just before saving */}
        <ScrollReveal
          delay={CONTENT_DELAY + STAGGER}
          variant='card'
          className='w-full max-w-104 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1'
        >
          <Eyebrow as='h2'>Preview</Eyebrow>
          <DiscoveryProfile
            profile={{
              id: profile?.id ?? 'new',
              displayName: preview.displayName || 'Your shark',
              pronouns: preview.pronouns || null,
              avatarUrl: preview.avatarUrl ?? null,
              bannerUrl: preview.bannerUrl ?? null,
              bio: preview.bio || null,
              location: preview.location || null,
              size: preview.size ?? null,
              unit: unit ?? 'CM',
              birthday: preview.birthday ?? null,
              interests,
              status: 'VERIFIED',
              // Long since, so it isn't marked new: that's only for a while after it's verified
              verifiedAt: null,
              createdAt: new Date(0),
              user: { username },
            }}
          />
        </ScrollReveal>
        {/* Floating along the bottom of the screen while you're in the form, so saving is never a scroll away; resting under it at the end */}
        <div className='sticky bottom-4 z-30 px-2 lg:col-start-1'>
          <ScrollReveal
            delay={CONTENT_DELAY + 4 * STAGGER}
            className='border-foreground/10 bg-background/85 xs:pl-5 flex w-full items-center gap-2 rounded-full border p-2 shadow-lg backdrop-blur-md'
          >
            {profile?.status === 'VERIFIED' && !unchanged && (
              // Live: saving takes it out (and asks first). On small screens it's said at the top instead.
              <p className='hidden items-center gap-1.5 text-sm leading-tight text-amber-600 sm:flex dark:text-amber-400'>
                <TriangleAlertIcon className='size-4 shrink-0' aria-hidden='true' />
                Saving takes it out of discovery
              </p>
            )}
            <p
              className={cn(
                'text-muted-foreground xs:not-sr-only sr-only text-xs leading-tight sm:text-sm',
                profile?.status === 'VERIFIED' && !unchanged && 'sm:hidden',
              )}
            >
              {unchanged ? 'No changes yet' : nameless ? 'Give it a name to start' : profile ? 'Saves as a draft' : 'Starts out as a draft'}
            </p>
            {/* Sharing the pill between them on the smallest screens, where there's no note beside them */}
            <div className='max-xs:w-full ml-auto flex shrink-0 gap-2'>
              <Button variant='secondary' className='max-xs:flex-1' asChild>
                <Link href='/dashboard/profiles' onClick={leave}>
                  Cancel
                </Link>
              </Button>
              <Button type='submit' className='max-xs:flex-1' disabled={submitting || unchanged || nameless}>
                {submitting && <Loader2Icon className='animate-spin' aria-hidden='true' />}
                {profile ? 'Save changes' : 'Create profile'}
              </Button>
            </div>
          </ScrollReveal>
        </div>
        {confirmDialog}
      </form>
    </Form>
  );
}

/** What one of the pictures is for, and what fits, by name. */
function PictureHint({ name, flagged, children }: { name: string; flagged: boolean; children: React.ReactNode }) {
  return (
    <div>
      <dt className='flex items-center gap-1.5 font-medium'>
        {name}
        <Flag show={flagged} />
      </dt>
      <dd className='text-muted-foreground mt-0.5 text-pretty'>{children}</dd>
    </div>
  );
}

/** Beside a field a moderator asked to have changed. */
function Flag({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <Badge variant='destructive' className='text-[10px]'>
      Needs update
    </Badge>
  );
}
