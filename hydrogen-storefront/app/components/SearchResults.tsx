import {Link} from 'react-router';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams, type RegularSearchReturn} from '~/lib/search';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & {term: string}) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsArticles({
  term,
  articles,
}: PartialSearchResult<'articles'>) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 md:mb-6 font-heading">Articles</h2>
      <div className="space-y-2">
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <div key={article.id}>
              <Link
                prefetch="intent"
                to={articleUrl}
                className="block rounded-md px-3 py-2 transition-colors duration-200 hover:bg-primary hover:text-white cursor-pointer"
              >
                {article.title}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsPages({term, pages}: PartialSearchResult<'pages'>) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 md:mb-6 font-heading">Pages</h2>
      <div className="space-y-2">
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <div key={page.id}>
              <Link
                prefetch="intent"
                to={pageUrl}
                className="block rounded-md px-3 py-2 transition-colors duration-200 hover:bg-primary hover:text-white cursor-pointer"
              >
                {page.title}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsProducts({
  term,
  products,
}: PartialSearchResult<'products'>) {
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 md:mb-6 font-heading">Products</h2>
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
          const ItemsMarkup = nodes.map((product) => {
            const productUrl = urlWithTrackingParams({
              baseUrl: `/products/${product.handle}`,
              trackingParams: product.trackingParameters,
              term,
            });

            const price = product?.selectedOrFirstAvailableVariant?.price;
            const image = product?.selectedOrFirstAvailableVariant?.image;

            return (
              <div key={product.id} className="mb-2">
                <Link
                  prefetch="intent"
                  to={productUrl}
                  className="flex items-center gap-4 rounded-md px-3 py-2 transition-colors duration-200 hover:bg-primary hover:text-white cursor-pointer"
                >
                  {image && (
                    <div className="flex-shrink-0">
                      <Image data={image} alt={product.title} width={50} />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{product.title}</p>
                    <small>
                      {price && <Money data={price} />}
                    </small>
                  </div>
                </Link>
              </div>
            );
          });

          return (
            <div className="space-y-4">
              <div>
                <PreviousLink className="text-primary hover:underline cursor-pointer">
                  {isLoading ? 'Loading...' : '↑ Load previous'}
                </PreviousLink>
              </div>
              <div className="space-y-2">{ItemsMarkup}</div>
              <div>
                <NextLink className="text-primary hover:underline cursor-pointer">
                  {isLoading ? 'Loading...' : 'Load more ↓'}
                </NextLink>
              </div>
            </div>
          );
        }}
      </Pagination>
    </div>
  );
}

function SearchResultsEmpty() {
  return (
    <p className="text-gray-600 text-center py-8">
      No results, try a different search.
    </p>
  );
}
