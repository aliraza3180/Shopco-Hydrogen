import {Suspense, memo, useMemo} from 'react';
import {Await, useAsyncValue} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartIcon} from './Icons/CartIcon';

interface CartIconButtonProps {
  cart: Promise<CartApiQueryFragment | null>;
}

export const CartIconButton = memo(function CartIconButton({
  cart,
}: CartIconButtonProps) {
  return (
    <Suspense fallback={<CartIcon count={null} />}>
      <Await resolve={cart}>
        <CartIconWithCount />
      </Await>
    </Suspense>
  );
});

function CartIconWithCount() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  const count = useMemo(() => cart?.totalQuantity ?? 0, [cart?.totalQuantity]);
  return <CartIcon count={count} />;
}

