import {memo, useCallback} from 'react';
import {useAside} from '~/components/Aside';
import {SearchIcon} from './Icons/SearchIcon';

export const SearchIconButton = memo(function SearchIconButton() {
  const aside = useAside();

  const handleClick = useCallback(() => {
    aside.open('search');
  }, [aside]);

  return (
    <button
      onClick={handleClick}
      className="p-2 text-black hover:text-primary transition-colors duration-300 cursor-pointer"
      aria-label="Search"
      type="button"
    >
      <SearchIcon className="w-6 h-6" />
    </button>
  );
});

