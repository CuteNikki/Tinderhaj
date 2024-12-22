import { ThemeSwitch } from '@/components/theme/switch';

export function Footer() {
  return (
    <footer className='bg-primary py-16 text-primary-foreground'>
      <div className='container mx-auto flex flex-col justify-between gap-4 px-4 md:flex-row md:items-center'>
        <div>
          <p>&copy; {new Date().getFullYear()} Tinderhaj. All rights reserved.</p>
          <p className='mt-2'>Blåhaj is a trademark of IKEA. Tinderhaj is not affiliated with IKEA.</p>
        </div>
        <ThemeSwitch />
      </div>
    </footer>
  );
}
