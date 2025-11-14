import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {CloseIcon} from './Header/Icons/CloseIcon';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;

  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      // Prevent body scroll on mobile when sidebar is open
      if (window.innerWidth <= 720) {
        document.documentElement.style.overflow = 'hidden';
      }

      document.addEventListener(
        'keydown',
        function handler(event: KeyboardEvent) {
          if (event.key === 'Escape') {
            close();
          }
        },
        {signal: abortController.signal},
      );
    } else {
      document.documentElement.style.overflow = '';
    }

    return () => {
      abortController.abort();
      document.documentElement.style.overflow = '';
    };
  }, [close, expanded]);

  return (
    <div
      aria-modal
      className={`fixed inset-0 z-10 bg-black/20 transition-opacity duration-[400ms] ease-in-out ${
        expanded
          ? 'opacity-100 pointer-events-auto visible'
          : 'opacity-0 pointer-events-none invisible'
      }`}
      role="dialog"
    >
      <button
        className="absolute inset-0 left-0 top-0 h-full bg-transparent border-0 text-transparent cursor-pointer"
        onClick={close}
        type="button"
        aria-label="Close overlay"
      />
      <aside
        className={`fixed right-0 top-0 h-screen w-[80%] md:w-[400px] bg-white shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-transform duration-200 ease-in-out ${
          expanded ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between h-16 border-b border-black px-5">
          <h3 className="m-0">{heading}</h3>
          <button
            className="flex items-center justify-center p-1 hover:text-primary transition-colors duration-300 font-bold cursor-pointer"
            onClick={close}
            aria-label="Close"
            type="button"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="overflow-y-auto">{children}</main>
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
