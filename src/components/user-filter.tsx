'use client';

import { SearchIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

export function UserFilter({ page = 1, take, query, disabled }: { page?: number; take: number; query: string; disabled?: boolean }) {
  return (
    <form
      className='flex gap-2'
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        window.location.href = `?query=${formData.get('query')}&page=1&take=${take}`;
      }}
    >
      <Input type='search' name='query' placeholder='Search' defaultValue={query} disabled={disabled} className='max-w-60' />
      <Select
        disabled={disabled}
        defaultValue={take.toString()}
        onValueChange={(value) => {
          window.location.href = `?query=${query}&page=${page}&take=${value}`;
        }}
      >
        <SelectTrigger aria-label='Select number of items per page'>{take}</SelectTrigger>
        <SelectContent>
          <SelectItem value='5'>5</SelectItem>
          <SelectItem value='10'>10</SelectItem>
          <SelectItem value='15'>15</SelectItem>
          <SelectItem value='20'>20</SelectItem>
          <SelectItem value='25'>25</SelectItem>
        </SelectContent>
      </Select>
      <Button aria-label='Submit search' type='submit' variant='outline' size='icon' disabled={disabled}>
        <SearchIcon />
      </Button>
    </form>
  );
}
