'use client';

import { useRouter } from 'next/navigation';

import { Grid2X2Icon, Search, SearchIcon } from 'lucide-react';
import { motion } from 'motion/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function DiscoveryFilter({ take, page, query, disabled }: { take?: number; page?: number; query?: string; disabled?: boolean }) {
  const router = useRouter();

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1], delay: 0.4 }}
      className='border-foreground/10 bg-background/85 rounded-3xl border p-3 shadow-lg backdrop-blur-md sm:rounded-full'
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const params = new URLSearchParams({ q: String(formData.get('q') ?? ''), p: '1', t: String(take ?? 6) });
        router.push(`/discovery?${params}#profiles`, { scroll: false });
        document.getElementById('profiles')?.scrollIntoView();
      }}
    >
      <div className='flex flex-col gap-1 sm:flex-row sm:items-center'>
        <label className='relative min-w-0 flex-1'>
          <span className='sr-only'>Search profiles</span>
          <Search className='text-muted-foreground pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2' />
          <Input
            name='q'
            type='search'
            placeholder='Search profiles...'
            defaultValue={query}
            disabled={disabled}
            className='rounded-2xl rounded-br-sm rounded-bl-sm pl-11 sm:rounded-tr-sm sm:rounded-br-sm sm:rounded-bl-2xl'
          />
        </label>
        <Select
          name='take'
          defaultValue={take?.toString()}
          onValueChange={(value) => {
            const params = new URLSearchParams({ q: query ?? '', p: String(page ?? 1), t: value });
            router.push(`/discovery?${params}`, { scroll: false });
          }}
          disabled={disabled}
        >
          <SelectTrigger
            aria-label='Select number of items per page'
            className='bg-background w-full rounded-sm px-4 sm:w-24 sm:rounded-tl-sm sm:rounded-tr-sm sm:rounded-br-sm sm:rounded-bl-sm'
          >
            <span className='flex items-center gap-2 sm:contents'>
              <Grid2X2Icon className='text-muted-foreground' />
              <SelectValue />
            </span>
          </SelectTrigger>
          <SelectContent position='popper'>
            <SelectItem value='3'>3</SelectItem>
            <SelectItem value='4'>4</SelectItem>
            <SelectItem value='6'>6</SelectItem>
            <SelectItem value='8'>8</SelectItem>
            <SelectItem value='9'>9</SelectItem>
            <SelectItem value='12'>12</SelectItem>
            <SelectItem value='15'>15</SelectItem>
            <SelectItem value='16'>16</SelectItem>
            <SelectItem value='18'>18</SelectItem>
          </SelectContent>
        </Select>
        <Button
          type='submit'
          disabled={disabled}
          variant='default'
          className='rounded-2xl rounded-tl-sm rounded-tr-sm border-none sm:rounded-tl-sm sm:rounded-tr-2xl sm:rounded-bl-sm'
        >
          <span>Search</span>
          <SearchIcon />
        </Button>
      </div>
    </motion.form>
  );
}
