import {memo, useCallback} from 'react';
import {useAside} from '~/components/Aside';
import {MenuIcon} from './Icons/MenuIcon';

export const MobileMenuToggle = memo(function MobileMenuToggle() {
  const aside = useAside();

  const handleClick = useCallback(() => {
    aside.open('mobile');
  }, [aside]);

  return (
    <button
      onClick={handleClick}
      className="md:hidden p-2 text-black hover:text-primary transition-colors duration-300 cursor-pointer"
      aria-label="Menu"
      type="button"
    >
      <MenuIcon />
    </button>
  );
});

