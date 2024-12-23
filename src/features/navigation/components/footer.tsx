import { Button } from '@/components/ui/button';
import { copyright, disclaimer, madeBy, source } from '@/features/navigation/constants/texts';
import { ThemeSwitch } from '@/features/theme/components/switch';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className='bg-primary py-8 text-primary-foreground'>
      <div className='container mx-auto flex flex-col justify-between gap-4 px-4 md:flex-row md:items-center'>
        <div>
          <p>{copyright}</p>
          <p className='mt-2'>{disclaimer}</p>
          <span className='mt-2 flex flex-row items-center'>
            <p>{madeBy.text.split(madeBy.replace)[0]}</p>
            <Link href={madeBy.url} className='ml-1 underline'>
              {madeBy.replace}
            </Link>
            <p>{madeBy.text.split(madeBy.replace)[1]}</p>
          </span>
        </div>
        <div className='flex flex-row items-center gap-2'>
          <Button asChild variant='secondary' size='sm'>
            <Link href={source.url}>
              <source.icon />
              {source.text}
            </Link>
          </Button>
          <ThemeSwitch />
        </div>
      </div>
    </footer>
  );
}
