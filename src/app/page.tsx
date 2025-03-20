import { ThemeButton } from '@/components/theme-button';
import {
  TypographyBlockquote,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyInlineCode,
  TypographyLarge,
  TypographyLead,
  TypographyList,
  TypographyMuted,
  TypographyP,
  TypographySmall,
} from '@/components/typography';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
        <main className='flex flex-col gap-[32px] row-start-2 items-center sm:items-start'>
          <Image className='dark:invert' src='/next.svg' alt='Next.js logo' width={180} height={38} priority />

          <TypographyList className='list-decimal'>
            <li>
              Get started by editing <TypographyInlineCode>src/app/page.tsx</TypographyInlineCode>.
            </li>
            <li>Save and see your changes instantly.</li>
          </TypographyList>

          <div className='flex gap-4 items-center flex-col sm:flex-row'>
            <Button asChild>
              <Link href='https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'>
                <Image className='dark:invert' src='/vercel.svg' alt='Vercel logomark' width={20} height={20} />
                Deploy Now
              </Link>
            </Button>
            <Button asChild variant='secondary'>
              <Link href='https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'>Read our docs</Link>
            </Button>
            <ThemeButton />
          </div>
        </main>
        <footer className='row-start-3 flex gap-6 flex-wrap items-center justify-center'>
          <Link
            className='flex items-center gap-2 hover:underline underline-offset-4'
            href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
          >
            <Image aria-hidden src='/file.svg' alt='File icon' width={16} height={16} />
            Learn
          </Link>
          <Link
            className='flex items-center gap-2 hover:underline underline-offset-4'
            href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
          >
            <Image aria-hidden src='/window.svg' alt='Window icon' width={16} height={16} />
            Examples
          </Link>
          <Link
            className='flex items-center gap-2 hover:underline underline-offset-4'
            href='https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
          >
            <Image aria-hidden src='/globe.svg' alt='Globe icon' width={16} height={16} />
            Go to nextjs.org →
          </Link>
        </footer>
      </div>
      <div className='flex flex-col gap-2 p-8 sm:p-24'>
        <span className='text-5xl'>Typography Preview</span>
        <TypographyBlockquote>Blockquote</TypographyBlockquote>
        <TypographyH1>Heading 1</TypographyH1>
        <TypographyH2>Heading 2</TypographyH2>
        <TypographyH3>Heading 3</TypographyH3>
        <TypographyH4>Heading 4</TypographyH4>
        <TypographyInlineCode>Inline Code</TypographyInlineCode>
        <TypographyLarge>Large Text</TypographyLarge>
        <TypographyLead>Lead Text</TypographyLead>
        Unordered List:
        <TypographyList>
          <li>List Item 1</li>
          <li>List Item 2</li>
        </TypographyList>
        Ordered List:
        <TypographyList className='list-decimal'>
          <li>List Item 1</li>
          <li>List Item 2</li>
        </TypographyList>
        Shifted inside lists:
        <TypographyList className='list-inside'>
          <li>List Item 1</li>
          <li>List Item 2</li>
        </TypographyList>
        <TypographyList className='list-decimal list-inside'>
          <li>List Item 1</li>
          <li>List Item 2</li>
        </TypographyList>
        <TypographyMuted>Muted Text</TypographyMuted>
        <TypographyP>Paragraph Text</TypographyP>
        <TypographySmall>Small Text</TypographySmall>
      </div>
    </>
  );
}
