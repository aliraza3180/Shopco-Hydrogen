# Dynamic Homepage Banner - Implementation Guide

This guide covers all the possible ways to create a dynamic banner on your homepage that pulls data from Shopify Admin.

---

## 🎯 **Option 1: Shopify Metafields (Recommended)**

**Best for:** Simple banner with image, text, and link

### Setup in Shopify Admin:
1. Go to **Settings → Custom data → Metafields**
2. Create a metafield definition:
   - **Namespace and key:** `custom.homepage_banner`
   - **Type:** JSON (for structured data) or separate metafields
   - **Owner:** Shop
   - **Access:** Storefront API

3. Add metafield values:
   ```json
   {
     "image": "https://cdn.shopify.com/...",
     "title": "Summer Sale",
     "subtitle": "Get 50% off",
     "buttonText": "Shop Now",
     "buttonLink": "/collections/sale",
     "enabled": true
   }
   ```

### Implementation:

**1. Update the homepage loader to fetch metafields:**

```typescript
// app/routes/($locale)._index.tsx

const HOMEPAGE_BANNER_QUERY = `#graphql
  query HomepageBanner($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      id
      metafield(namespace: "custom", key: "homepage_banner") {
        id
        value
        type
      }
    }
  }
` as const;

async function loadCriticalData({context}: Route.LoaderArgs) {
  const [{collections, shop}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(HOMEPAGE_BANNER_QUERY),
  ]);

  // Parse the JSON metafield
  let banner = null;
  if (shop.metafield?.value) {
    try {
      banner = JSON.parse(shop.metafield.value);
    } catch (e) {
      console.error('Error parsing banner metafield:', e);
    }
  }

  return {
    featuredCollection: collections.nodes[0],
    banner: banner?.enabled ? banner : null,
  };
}
```

**2. Create a Banner component:**

```typescript
// app/components/HomepageBanner.tsx

import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';

interface BannerData {
  image: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
}

export function HomepageBanner({banner}: {banner: BannerData | null}) {
  if (!banner) return null;

  return (
    <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden">
      {banner.image && (
        <img
          src={banner.image}
          alt={banner.title}
          className="w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white p-8">
        {banner.title && (
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-center">
            {banner.title}
          </h2>
        )}
        {banner.subtitle && (
          <p className="text-xl md:text-2xl mb-6 text-center">
            {banner.subtitle}
          </p>
        )}
        {banner.buttonText && banner.buttonLink && (
          <Link
            to={banner.buttonLink}
            className="bg-white text-black px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
          >
            {banner.buttonText}
          </Link>
        )}
      </div>
    </div>
  );
}
```

**3. Use in homepage:**

```typescript
// app/routes/($locale)._index.tsx

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      {data.banner && <HomepageBanner banner={data.banner} />}
      <FeaturedCollection collection={data.featuredCollection} />
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}
```

---

## 🎯 **Option 2: Shopify Metaobjects (Best for Complex Banners)**

**Best for:** Multiple banners, structured data, better admin UX

### Setup in Shopify Admin:
1. Go to **Settings → Custom data → Metaobjects**
2. Create a metaobject definition:
   - **Type:** `homepage_banner`
   - **Fields:**
     - `banner_image` (File reference)
     - `title` (Single line text)
     - `subtitle` (Multi-line text)
     - `button_text` (Single line text)
     - `button_link` (URL)
     - `enabled` (Boolean)
     - `display_order` (Number)

3. Create banner entries in **Content → Metaobjects**

### Implementation:

```typescript
const HOMEPAGE_BANNER_QUERY = `#graphql
  query HomepageBanner($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: "homepage-banner", type: "homepage_banner"}) {
      id
      handle
      fields {
        key
        value
        reference {
          ... on MediaImage {
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
` as const;

// Helper to parse metaobject fields
function parseMetaobject(metaobject: any) {
  const fields: Record<string, any> = {};
  metaobject.fields.forEach((field: any) => {
    if (field.reference) {
      fields[field.key] = field.reference;
    } else {
      fields[field.key] = field.value;
    }
  });
  return fields;
}
```

---

## 🎯 **Option 3: Shopify Files + Metafields**

**Best for:** When you want to upload images directly in Shopify

### Setup:
1. Upload banner image in **Settings → Files**
2. Create metafield with file reference:
   - **Type:** File reference
   - **Namespace:** `custom`
   - **Key:** `homepage_banner_image`

### Implementation:

```typescript
const HOMEPAGE_BANNER_QUERY = `#graphql
  query HomepageBanner($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      metafield(namespace: "custom", key: "homepage_banner_image") {
        reference {
          ... on MediaImage {
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
      metafield(namespace: "custom", key: "homepage_banner_title") {
        value
      }
      metafield(namespace: "custom", key: "homepage_banner_text") {
        value
      }
      metafield(namespace: "custom", key: "homepage_banner_link") {
        value
      }
    }
  }
` as const;
```

---

## 🎯 **Option 4: Shopify Pages (Simple but Limited)**

**Best for:** Content-managed banners with rich text

### Setup:
1. Create a page in **Online Store → Pages**
2. Use page handle: `homepage-banner`
3. Store image URL in page body or use page image

### Implementation:

```typescript
const HOMEPAGE_BANNER_QUERY = `#graphql
  query HomepageBanner($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    page(handle: "homepage-banner") {
      id
      title
      body
      handle
    }
  }
` as const;
```

---

## 🎯 **Option 5: Custom Admin App (Most Flexible)**

**Best for:** Complex requirements, multiple banners, scheduling

### Setup:
1. Create a Shopify Admin app
2. Build custom admin interface for banner management
3. Store data via Admin API
4. Fetch via Storefront API (metafields or custom endpoint)

### Implementation:
- Use Shopify Admin API to create/update banners
- Store in metafields or custom database
- Fetch in Hydrogen via Storefront API

---

## 🎯 **Option 6: Shopify Online Store 2.0 Sections (Hybrid Approach)**

**Best for:** If you want to use theme editor but in headless

### Setup:
1. Create a section in a traditional theme
2. Export section settings as JSON
3. Fetch via Storefront API

**Note:** This is more complex and not recommended for pure headless.

---

## 📋 **Comparison Table**

| Option | Complexity | Admin UX | Flexibility | Recommended |
|--------|-----------|----------|-------------|-------------|
| **Metafields (JSON)** | ⭐⭐ Low | ⭐⭐ Basic | ⭐⭐⭐ Good | ✅ Yes |
| **Metaobjects** | ⭐⭐⭐ Medium | ⭐⭐⭐⭐ Great | ⭐⭐⭐⭐ Excellent | ✅✅ Best |
| **Files + Metafields** | ⭐⭐ Low | ⭐⭐⭐ Good | ⭐⭐⭐ Good | ✅ Yes |
| **Pages** | ⭐ Very Low | ⭐⭐ Basic | ⭐⭐ Limited | ⚠️ Limited |
| **Custom App** | ⭐⭐⭐⭐⭐ High | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐⭐ Excellent | ⚠️ Complex |
| **Sections** | ⭐⭐⭐⭐ High | ⭐⭐⭐⭐ Great | ⭐⭐⭐ Good | ❌ Not Recommended |

---

## 🚀 **Recommended Implementation: Metaobjects**

Here's a complete example using Metaobjects (most flexible):

### 1. Create Metaobject in Shopify Admin:
- Type: `homepage_banner`
- Fields:
  - `banner_image` (File reference - Image)
  - `title` (Single line text)
  - `subtitle` (Multi-line text)
  - `button_text` (Single line text)
  - `button_link` (URL)
  - `enabled` (Boolean)
  - `display_order` (Number)

### 2. Complete Implementation:

```typescript
// app/routes/($locale)._index.tsx

const HOMEPAGE_BANNER_QUERY = `#graphql
  query HomepageBanner($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    metaobjects(
      type: "homepage_banner"
      first: 1
      sortKey: CREATED_AT
      reverse: true
    ) {
      nodes {
        id
        handle
        fields {
          key
          value
          reference {
            ... on MediaImage {
              image {
                url
                altText
                width
                height
              }
            }
          }
        }
      }
    }
  }
` as const;

async function loadCriticalData({context}: Route.LoaderArgs) {
  const [{collections, metaobjects}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(HOMEPAGE_BANNER_QUERY),
  ]);

  // Parse metaobject fields
  let banner = null;
  const bannerNode = metaobjects.nodes[0];
  if (bannerNode) {
    const fields: Record<string, any> = {};
    bannerNode.fields.forEach((field: any) => {
      if (field.reference) {
        fields[field.key] = field.reference;
      } else {
        fields[field.key] = field.value;
      }
    });
    
    // Only show if enabled
    if (fields.enabled === 'true' || fields.enabled === true) {
      banner = {
        image: fields.banner_image?.image,
        title: fields.title,
        subtitle: fields.subtitle,
        buttonText: fields.button_text,
        buttonLink: fields.button_link,
      };
    }
  }

  return {
    featuredCollection: collections.nodes[0],
    banner,
  };
}
```

---

## 🎨 **Banner Component with Tailwind:**

```typescript
// app/components/HomepageBanner.tsx

import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';

interface BannerData {
  image?: {
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  };
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
}

export function HomepageBanner({banner}: {banner: BannerData | null}) {
  if (!banner) return null;

  return (
    <section className="relative w-full h-[400px] md:h-[600px] lg:h-[700px] overflow-hidden mb-8">
      {banner.image && (
        <Image
          data={banner.image}
          sizes="100vw"
          className="w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white p-4 md:p-8">
        {banner.title && (
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-center max-w-4xl">
            {banner.title}
          </h1>
        )}
        {banner.subtitle && (
          <p className="text-lg md:text-xl lg:text-2xl mb-6 text-center max-w-2xl">
            {banner.subtitle}
          </p>
        )}
        {banner.buttonText && banner.buttonLink && (
          <Link
            to={banner.buttonLink}
            className="bg-white text-black px-6 md:px-8 py-3 md:py-4 rounded-md font-semibold text-base md:text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            {banner.buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}
```

---

## 📝 **Quick Start Steps:**

1. **Choose your approach** (Metaobjects recommended)
2. **Set up in Shopify Admin:**
   - Create metaobject definition or metafield
   - Add banner content
3. **Update homepage route:**
   - Add GraphQL query
   - Parse the data in loader
4. **Create banner component:**
   - Use Tailwind for styling
   - Make it responsive
5. **Add to homepage:**
   - Import and render component
   - Handle null/empty states

---

## 🔧 **Tips:**

- **Caching:** Use `storefront.CacheLong()` for banner queries
- **Error Handling:** Always handle missing/null banner data gracefully
- **Performance:** Consider lazy loading banner images
- **Responsive:** Use Tailwind responsive classes
- **Accessibility:** Add proper alt text and ARIA labels

---

## 📚 **Resources:**

- [Shopify Metafields Docs](https://shopify.dev/docs/apps/custom-data/metafields)
- [Shopify Metaobjects Docs](https://shopify.dev/docs/apps/custom-data/metaobjects)
- [Storefront API Metafields](https://shopify.dev/docs/api/storefront/latest/objects/Metafield)
- [Hydrogen Image Component](https://shopify.dev/docs/api/hydrogen/components/image)

---

**Need help implementing?** Let me know which option you prefer and I can help you set it up!

