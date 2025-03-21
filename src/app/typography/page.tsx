import Link from 'next/link';

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

export default function TypographyPage() {
  return (
    <div className='grid min-h-screen justify-items-center gap-4 p-8'>
      <div className='flex flex-col items-center gap-4'>
        <Button asChild>
          <Link href='/'>Back to Home</Link>
        </Button>
        <TypographyH1>Typography</TypographyH1>
      </div>
      <div className='gap-2'>
        <TypographyH1>Heading 1</TypographyH1>
        <TypographyH2>Heading 2</TypographyH2>
        <TypographyH3>Heading 3</TypographyH3>
        <TypographyH4>Heading 4</TypographyH4>
        <TypographyLarge>Large Text</TypographyLarge>
        <TypographyLead>Lead Text</TypographyLead>
        <TypographyInlineCode>Inline Code</TypographyInlineCode>
        <TypographyP>Paragraph Text</TypographyP>
        <TypographySmall>Small Text</TypographySmall>
        <TypographyMuted>Muted Text</TypographyMuted>
        <TypographyBlockquote>Blockquote</TypographyBlockquote>
        <TypographyP>Unordered List:</TypographyP>
        <TypographyList>
          <li>List Item 1</li>
          <li>List Item 2</li>
        </TypographyList>
        <TypographyP>Ordered List:</TypographyP>
        <TypographyList className='list-decimal'>
          <li>List Item 1</li>
          <li>List Item 2</li>
        </TypographyList>
        <TypographyP>Shifted inside lists:</TypographyP>
        <TypographyList className='list-inside'>
          <li>List Item 1</li>
          <li>List Item 2</li>
        </TypographyList>
        <TypographyList className='list-inside list-decimal'>
          <li>List Item 1</li>
          <li>List Item 2</li>
        </TypographyList>
      </div>
    </div>
  );
}
