import { copyright, disclaimer } from '@/features/navigation/constants/texts';
import { ThemeSwitch } from '@/features/theme/components/switch';

export function Footer() {
  return (
    <footer className='bg-primary py-16 text-primary-foreground'>
      <div className='container mx-auto flex flex-col justify-between gap-4 px-4 md:flex-row md:items-center'>
        <div>
          <p>{copyright}</p>
          <p className='mt-2'>{disclaimer}</p>
        </div>
        <ThemeSwitch />
      </div>
    </footer>
  );
}
