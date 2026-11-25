import { CONTENT_DELAY } from '@/lib/motion';

import { SettingsTabs } from '@/components/account/settings-tabs';
import { Eyebrow, PageTitle } from '@/components/common/heading';
import { Stagger } from '@/components/common/stagger';
import { ScrollReveal } from '@/components/home/scroll-reveal';

/**
 * Settings, split into tabs that are pages of their own, so a link (from an
 * email, say) can open the right one. The header and tabs stay put while a
 * tab loads, and only its sections change.
 */
export default function SettingsLayout({
  children,
}: LayoutProps<'/dashboard/account'>) {
  return (
    <div
      data-water='band'
      className='flex flex-1 flex-col px-4 py-28 sm:px-5 lg:px-8'
    >
      <div className='container mx-auto max-w-7xl'>
        <Stagger id='page-header' variant='sink' className='mb-24'>
          <Eyebrow>Your account</Eyebrow>
          <PageTitle>Settings</PageTitle>
        </Stagger>
        <ScrollReveal delay={CONTENT_DELAY}>
          <SettingsTabs />
        </ScrollReveal>
        {children}
      </div>
    </div>
  );
}
