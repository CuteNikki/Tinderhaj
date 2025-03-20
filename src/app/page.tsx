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
      <div className='grid min-h-screen items-center justify-items-center gap-16 p-8 pb-20 sm:p-20'>
        <main className='row-start-2 flex flex-col items-center gap-8 sm:items-start'>
          {/* <video autoPlay loop muted playsInline width={382} height={201} preload='auto'>
            <source src='/blahajSpinSmall.mp4' type='video/mp4' />
            Your browser does not support the video tag.
          </video> */}
          <Image unoptimized loading='eager' src='/blahajSpinSmall.gif' alt='Blahaj spin' width={382} height={201} />

          <TypographyList className='list-decimal'>
            <li>
              Get started by editing <TypographyInlineCode>src/app/page.tsx</TypographyInlineCode>.
            </li>
            <li>Save and see your changes instantly.</li>
          </TypographyList>

          <div className='flex flex-col items-center gap-4 sm:flex-row'>
            <Button asChild>
              <Link href='https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'>
                <Image src='/blahaj.webp' alt='Blahaj' width={32} height={32} />
                Deploy Now
              </Link>
            </Button>
            <Button asChild variant='secondary'>
              <Link href='https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'>Read our docs</Link>
            </Button>
            <ThemeButton />
          </div>
        </main>
        <footer className='row-start-3 flex flex-wrap items-center justify-center gap-6'>
          <Link
            className='flex items-center gap-2 underline-offset-4 hover:underline'
            href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
          >
            <Image unoptimized aria-hidden src='/blahajHug.webp' alt='Blahaj hug Blahaj' width={32} height={32} />
            Learn
          </Link>
          <Link
            className='flex items-center gap-2 underline-offset-4 hover:underline'
            href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
          >
            <Image unoptimized aria-hidden src='/blahajHeart.webp' alt='Blahaj Heart' width={32} height={32} />
            Examples
          </Link>
          <Link
            className='flex items-center gap-2 underline-offset-4 hover:underline'
            href='https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
          >
            <Image unoptimized aria-hidden src='/blahajThink.webp' alt='Blahaj Think' width={32} height={32} />
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
        <TypographyList className='list-inside list-decimal'>
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
