import {memo, useMemo, useCallback} from 'react';
import {NavLink} from 'react-router';
import {useAside} from '~/components/Aside';
import type {HeaderQuery} from 'storefrontapi.generated';
import {FALLBACK_HEADER_MENU} from './utils';
import {activeLinkStyle} from './utils';

type Viewport = 'desktop' | 'mobile';

interface HeaderMenuProps {
  menu: HeaderQuery['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: string;
}

export const HeaderMenu = memo(function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: HeaderMenuProps) {
  const {close} = useAside();

  const normalizeUrl = useCallback(
    (url: string) => {
      if (
        url.includes('myshopify.com') ||
        url.includes(publicStoreDomain) ||
        url.includes(primaryDomainUrl)
      ) {
        try {
          return new URL(url).pathname;
        } catch {
          return url;
        }
      }
      return url;
    },
    [publicStoreDomain, primaryDomainUrl],
  );

  type MenuItemType = NonNullable<typeof menu>['items'][0];

  const menuItems = useMemo(() => (menu || FALLBACK_HEADER_MENU).items, [menu]);

  const renderMenuItem = useCallback(
    (item: MenuItemType, level = 0) => {
    if (!item.url && (!item.items || item.items.length === 0)) return null;

    const url = item.url ? normalizeUrl(item.url) : '#';
    const hasChildren = item.items && item.items.length > 0;

    if (viewport === 'mobile') {
      return (
        <div key={item.id} className="w-full border-b border-gray-100">
          <NavLink
            className={({isActive}) =>
              `block px-4 py-3 text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors font-medium cursor-pointer ${
                isActive ? 'text-primary' : ''
              }`
            }
            end={!hasChildren}
            onClick={close}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
          {hasChildren && item.items && (
            <div className="bg-gray-50">
              {item.items.map((childItem) => (
                <div key={childItem.id} className="pl-6">
                  {renderMenuItem(childItem as MenuItemType, level + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Desktop view
    return (
      <div key={item.id} className={`relative ${hasChildren ? 'group' : ''}`}>
        <NavLink
          className={({isActive}) =>
            `relative text-black hover:text-primary transition-colors duration-300 font-medium text-base cursor-pointer ${
              isActive ? 'text-primary' : ''
            } ${
              hasChildren ? 'flex items-center gap-1' : ''
            } after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[2px] after:bg-primary after:transition-transform after:duration-300 after:ease-in-out after:scale-x-0 after:origin-right hover:after:scale-x-100 hover:after:origin-left ${
              isActive ? 'after:scale-x-100 after:origin-left' : ''
            }`
          }
          end={!hasChildren}
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to={url}
        >
          {item.title}
          {hasChildren && (
            <svg
              className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </NavLink>
        {hasChildren && item.items && (
          <div className="absolute top-[30px] left-0 bg-white shadow-lg border border-gray-100 rounded-lg hidden group-hover:block w-auto min-w-fit z-[100] py-2 whitespace-nowrap">
            {item.items.map((childItem) => (
              <div key={childItem.id} className="px-4 py-2 hover:bg-gray-50">
                {renderMenuItem(childItem as MenuItemType, level + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
    },
    [viewport, normalizeUrl, close],
  );

  return (
    <nav
      className={
        viewport === 'mobile'
          ? 'flex flex-col gap-0 w-full'
          : 'flex items-center gap-6'
      }
      role="navigation"
    >
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          className={({isActive}) =>
            `block px-4 py-3 text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors font-medium border-b border-gray-100 cursor-pointer ${
              isActive ? 'text-primary' : ''
            }`
          }
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {menuItems.map((item) => renderMenuItem(item as MenuItemType))}
    </nav>
  );
});

