'use client';

import { Search } from 'lucide-react';

import { TypographyH2, TypographyMuted } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

export function ProfileFilter({ take, page, query, disabled }: { take?: number; page?: number; query?: string; disabled?: boolean }) {
  return (
    <section className='bg-muted w-full py-6 md:py-10'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-evenly'>
          <div>
            <TypographyH2>Discover Blåhaj</TypographyH2>
            <TypographyMuted>Find your perfect plush match!</TypographyMuted>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              window.location.href = `/discovery?q=${formData.get('q')}&p=1&t=${take}`;
            }}
          >
            <div className='flex flex-row gap-2'>
              <Input
                aria-label='search input'
                name='q'
                type='search'
                placeholder='Search profiles...'
                defaultValue={query}
                disabled={disabled}
                className='w-full'
              />
              <Select
                name='take'
                defaultValue={take?.toString()}
                onValueChange={(value) => {
                  window.location.href = `?q=${query}&p=${page}&t=${value}`;
                }}
                disabled={disabled}
              >
                <SelectTrigger aria-label='Select number of items per page'>{take ?? 8}</SelectTrigger>
                <SelectContent>
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
              <Button aria-label='submit search' variant='outline' type='submit' size='icon' disabled={disabled}>
                <Search />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
