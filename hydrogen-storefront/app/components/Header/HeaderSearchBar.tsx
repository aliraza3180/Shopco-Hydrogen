import {memo, useState, useId, useCallback, useEffect, useRef} from 'react';
import {Link} from 'react-router';
import {SearchFormPredictive, SEARCH_ENDPOINT} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';
import {SearchIcon} from './Icons/SearchIcon';

export const HeaderSearchBar = memo(function HeaderSearchBar() {
  const queriesDatalistId = useId();
  const [isFocused, setIsFocused] = useState(false);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  const handleFocus = useCallback(
    (
      e: React.FocusEvent<HTMLInputElement>,
      fetchResults: (event: React.ChangeEvent<HTMLInputElement>) => void,
    ) => {
      // Clear any pending blur timeout
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }
      setIsFocused(true);
      fetchResults(e as unknown as React.ChangeEvent<HTMLInputElement>);
    },
    [],
  );

  const handleBlur = useCallback(() => {
    // Delay to allow click events on results
    blurTimeoutRef.current = setTimeout(() => {
      setIsFocused(false);
      blurTimeoutRef.current = null;
    }, 200);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, goToSearch: () => void) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        goToSearch();
      }
    },
    [],
  );

  return (
    <div className="relative w-full">
      <SearchFormPredictive>
        {({fetchResults, goToSearch, inputRef, fetcher}) => (
          <>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={(e) => handleFocus(e, fetchResults)}
                onBlur={handleBlur}
                onKeyDown={(e) => handleKeyDown(e, goToSearch)}
                placeholder="Search for products..."
                ref={inputRef}
                type="search"
                className="[&::-webkit-search-cancel-button]:cursor-pointer [&::-ms-clear]:cursor-pointer block w-full pl-12 pr-4 py-3 border-0 rounded-full bg-gray-100 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors"
                autoComplete="off"
              />
            </div>

            {/* Predictive Search Results Dropdown */}
            {isFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-[600px] overflow-y-auto">
                <SearchResultsPredictive>
                  {({items, total, term, state, closeSearch}) => {
                    const {articles, collections, pages, products, queries} = items;

                    if (state === 'loading' && term.current) {
                      return (
                        <div className="p-4 text-center text-gray-500">Loading...</div>
                      );
                    }

                    if (!total) {
                      return (
                        <div className="p-4 text-center text-gray-500">
                          <SearchResultsPredictive.Empty term={term} />
                        </div>
                      );
                    }

                    return (
                      <div className="p-4">
                        <SearchResultsPredictive.Queries
                          queries={queries}
                          queriesDatalistId={queriesDatalistId}
                        />
                        <SearchResultsPredictive.Products
                          products={products}
                          closeSearch={closeSearch}
                          term={term}
                        />
                        <SearchResultsPredictive.Collections
                          collections={collections}
                          closeSearch={closeSearch}
                          term={term}
                        />
                        <SearchResultsPredictive.Pages
                          pages={pages}
                          closeSearch={closeSearch}
                          term={term}
                        />
                        <SearchResultsPredictive.Articles
                          articles={articles}
                          closeSearch={closeSearch}
                          term={term}
                        />
                        {term.current && total ? (
                          <Link
                            onClick={closeSearch}
                            to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                            className="block mt-4 pt-4 border-t border-gray-200 text-center text-primary hover:underline cursor-pointer"
                          >
                            View all results for &quot;{term.current}&quot; →
                          </Link>
                        ) : null}
                      </div>
                    );
                  }}
                </SearchResultsPredictive>
              </div>
            )}
          </>
        )}
      </SearchFormPredictive>
    </div>
  );
});

