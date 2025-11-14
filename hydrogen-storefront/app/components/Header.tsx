import {useMemo} from 'react';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {motion} from 'framer-motion';
import {HeaderLogo} from './Header/HeaderLogo';
import {HeaderMenu} from './Header/HeaderMenu';
import {HeaderSearchBar} from './Header/HeaderSearchBar';
import {HeaderIcons} from './Header/HeaderIcons';
import {MobileMenuToggle} from './Header/MobileMenuToggle';

// Re-export HeaderMenu for backward compatibility
export {HeaderMenu};

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  const primaryDomainUrl = useMemo(
    () => header.shop.primaryDomain.url,
    [header.shop.primaryDomain.url],
  );

  const headerVariants = {
    hidden: {opacity: 0, y: -20},
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: {opacity: 0, y: -10},
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.header
      className="sticky top-0 z-[9] bg-white border-b border-gray-200"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 mx-auto max-w-[1240px] gap-4">
          {/* Left Side - Mobile Menu + Logo */}
          <motion.div
            className="flex items-center gap-4"
            variants={itemVariants}
          >
            <MobileMenuToggle />
            <HeaderLogo shop={shop} />
          </motion.div>

          {/* Navigation Links - Desktop Only */}
          <motion.nav
            className="hidden md:flex items-center gap-6 lg:gap-8 ml-6"
            variants={itemVariants}
          >
            <HeaderMenu
              menu={menu}
              viewport="desktop"
              primaryDomainUrl={primaryDomainUrl}
              publicStoreDomain={publicStoreDomain}
            />
          </motion.nav>

          {/* Search Bar - Desktop Only (Centered) */}
          <motion.div
            className="hidden lg:flex items-center flex-1 max-w-md"
            variants={itemVariants}
          >
            <HeaderSearchBar />
          </motion.div>

          {/* Right Icons - All Screen Sizes */}
          <motion.div variants={itemVariants}>
            <HeaderIcons cart={cart} isLoggedIn={isLoggedIn} />
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
