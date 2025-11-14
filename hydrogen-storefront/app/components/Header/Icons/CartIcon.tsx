import {memo, useCallback} from 'react';
import {useAnalytics} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import type {CartViewPayload} from '@shopify/hydrogen';

interface CartIconProps {
  count: number | null;
}

export const CartIcon = memo(function CartIcon({count}: CartIconProps) {
  const aside = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      aside.open('cart');
      publish('cart_viewed', {
        cart,
        prevCart,
        shop,
        url: typeof window !== 'undefined' ? window.location.href : '',
      } as CartViewPayload);
    },
    [aside, publish, cart, prevCart, shop],
  );

  return (
    <button
      onClick={handleClick}
      className="relative p-2 text-black hover:text-primary transition-colors duration-300 cursor-pointer"
      aria-label="Shopping cart"
      type="button"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      {count !== null && count > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
});

