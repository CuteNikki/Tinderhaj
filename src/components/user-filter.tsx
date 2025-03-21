import { SearchIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function UserFilter({ take, query, disabled }: { take: number; query: string; disabled?: boolean }) {
  return (
    <form className='flex gap-2' action={'/users'} method='get'>
      <Input type='search' name='query' placeholder='Search' defaultValue={query} disabled={disabled} className='max-w-60' />
      <input type='hidden' name='page' value={1} disabled />
      <input type='hidden' name='take' value={take} disabled />
      <Button type='submit' variant='outline' size='icon' disabled={disabled}>
        <SearchIcon />
      </Button>
    </form>
  );
}
