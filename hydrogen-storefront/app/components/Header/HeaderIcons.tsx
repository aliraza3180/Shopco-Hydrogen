import {Suspense, memo} from 'react';
import {Await, NavLink} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartIconButton} from './CartIconButton';
import {UserIcon} from './Icons/UserIcon';
import {SearchIconButton} from './SearchIconButton';

interface HeaderIconsProps {
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
}

export const HeaderIcons = memo(function HeaderIcons({
  cart,
  isLoggedIn,
}: HeaderIconsProps) {
  return (
    <div className="flex items-center md:gap-4">
      {/* Search Icon - Mobile/Tablet Only */}
      <div className="lg:hidden">
        <SearchIconButton />
      </div>

      {/* Cart Icon */}
      <CartIconButton cart={cart} />

      {/* User Icon */}
      <NavLink
        prefetch="intent"
        to="/account"
        className="p-2 text-black hover:text-primary transition-colors duration-300 cursor-pointer"
        aria-label="Account"
      >
        <Suspense fallback={<UserIcon />}>
          <Await resolve={isLoggedIn} errorElement={<UserIcon />}>
            {() => <UserIcon />}
          </Await>
        </Suspense>
      </NavLink>
    </div>
  );
});

