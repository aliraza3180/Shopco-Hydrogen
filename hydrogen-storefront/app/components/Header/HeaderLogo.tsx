import {NavLink} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {memo, useMemo} from 'react';
import type {HeaderQuery} from 'storefrontapi.generated';

interface HeaderLogoProps {
  shop: HeaderQuery['shop'];
}

export const HeaderLogo = memo(function HeaderLogo({shop}: HeaderLogoProps) {
  // Simple property access doesn't need memoization, but keeping for consistency
  const logoUrl = shop.brand?.logo?.image?.url;

  return (
    <div className="flex-shrink-0">
      <NavLink
        prefetch="intent"
        to="/"
        className="flex items-center cursor-pointer"
        end
      >
        {logoUrl ? (
          <Image
            alt={shop.name}
            data={{
              url: logoUrl,
              altText: shop.name,
            }}
            width={160}
            height={40}
            loading="eager"
            sizes="(max-width: 768px) 126px, 160px"
            className="w-[126px] md:w-[160px]"
          />
        ) : (
          <strong className="text-xl md:text-2xl font-bold font-heading text-black uppercase">
            {shop.name}
          </strong>
        )}
      </NavLink>
    </div>
  );
});

