'use client';

import qs            from 'query-string';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BiSearch }  from 'react-icons/bi';
import useDebounce   from '@/hooks/useDebounce';

const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = useState('');
  const debouncedValue    = useDebounce(value, 500);

  useEffect(() => {
    const query: any = {};
    if (debouncedValue) query.title = debouncedValue;
    const url = qs.stringifyUrl({ url: '/search', query });
    router.push(url);
  }, [debouncedValue, router]);

  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <BiSearch size={20} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
      <input
        placeholder="Search songs, artists, vibes..."
        value={value}
        onChange={e => setValue(e.target.value)}
        className="flex-1 bg-transparent outline-none text-base"
        style={{
          color:      'var(--text-primary)',
        }}
      />
    </div>
  );
};

export default SearchInput;