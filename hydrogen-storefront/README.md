# Hydrogen Storefront

A modern, feature-rich Shopify Hydrogen storefront built with React Router 7, TypeScript, and Tailwind CSS. This storefront provides a complete e-commerce experience with advanced features including predictive search, customer accounts, cart management, and beautiful animations.

## 🚀 Overview

This Hydrogen storefront is a fully functional headless commerce solution that leverages Shopify's Storefront API and Customer Account API. It's built on top of React Router 7 (formerly Remix) and includes a comprehensive set of components and routes for a complete shopping experience.

## ✨ Features

### Core E-commerce Features
- **Product Catalog**: Browse products, collections, and featured items
- **Product Pages**: Detailed product views with variant selection, images, and descriptions
- **Shopping Cart**: Full cart functionality with add, update, remove, and quantity management
- **Checkout Integration**: Seamless integration with Shopify Checkout
- **Collections**: Browse and filter products by collections
- **Search**: Both regular and predictive search across products, pages, articles, and collections

### Customer Account Features
- **Customer Authentication**: Login, logout, and account management
- **Order History**: View past orders and order details
- **Address Management**: Add, edit, and manage shipping addresses
- **Profile Management**: Update customer profile information

### User Experience Features
- **Responsive Design**: Mobile-first design that works on all devices
- **Animations**: Smooth animations powered by Framer Motion
- **Hero Banner**: Animated hero section with statistics counter
- **Announcement Bar**: Rotating announcement slider with swipe gestures
- **Predictive Search**: Real-time search suggestions as you type
- **Mobile Menu**: Slide-out navigation menu for mobile devices
- **Cart Sidebar**: Quick cart access without leaving the page
- **Search Sidebar**: Dedicated search interface with predictive results

### Content Features
- **Blog Support**: Blog listing and article pages
- **Pages**: Static content pages
- **Policies**: Privacy, refund, shipping, and terms pages
- **Sitemap**: Automatic sitemap generation
- **SEO**: Meta tags and canonical URLs for better SEO

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **GraphQL Code Generation**: Auto-generated types from Shopify API
- **Server-Side Rendering**: Fast initial page loads with SSR
- **Deferred Loading**: Critical data loads first, non-critical data defers
- **Analytics Integration**: Built-in Shopify Analytics support
- **Internationalization**: Multi-language and multi-country support
- **Performance Optimized**: Image optimization, code splitting, and caching

## 🛠 Tech Stack

- **Framework**: [React Router 7](https://reactrouter.com/) (formerly Remix)
- **Commerce**: [Shopify Hydrogen](https://shopify.dev/custom-storefronts/hydrogen) (v2025.7.0)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Build Tool**: Vite
- **Deployment**: Shopify Oxygen
- **GraphQL**: Shopify Storefront API & Customer Account API

## 📁 Project Structure

```
hydrogen-storefront/
├── app/
│   ├── assets/              # Static assets (favicon, etc.)
│   ├── components/          # React components
│   │   ├── Header/         # Header components and icons
│   │   ├── AddToCartButton.tsx
│   │   ├── AnnouncementBar.tsx
│   │   ├── CartMain.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroBanner.tsx
│   │   ├── PageLayout.tsx
│   │   └── ...
│   ├── graphql/            # GraphQL queries and mutations
│   │   └── customer-account/
│   ├── lib/                # Utility functions and helpers
│   │   ├── fragments.ts    # GraphQL fragments
│   │   ├── search.ts       # Search utilities
│   │   └── ...
│   ├── routes/             # File-based routing
│   │   ├── ($locale)._index.tsx      # Homepage
│   │   ├── ($locale).products.$handle.tsx
│   │   ├── ($locale).collections.$handle.tsx
│   │   ├── ($locale).cart.tsx
│   │   ├── ($locale).search.tsx
│   │   ├── ($locale).account.*.tsx   # Customer account routes
│   │   └── ...
│   ├── styles/             # Global styles
│   │   ├── app.css
│   │   ├── reset.css
│   │   └── tailwind.css
│   ├── root.tsx            # Root layout component
│   └── entry.client.tsx    # Client entry point
├── public/                 # Public assets
│   ├── fonts/             # Custom fonts
│   └── images/            # Images
├── react-router.config.ts  # React Router configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── vite.config.ts          # Vite configuration
└── package.json
```

## 🎨 Key Components

### Layout Components
- **PageLayout**: Main layout wrapper with header, footer, and sidebars
- **Header**: Responsive header with logo, navigation, search, and cart
- **Footer**: Footer with menu links and policies
- **AnnouncementBar**: Rotating announcement slider with swipe support

### Product Components
- **ProductItem**: Product card for listings
- **ProductImage**: Optimized product image display
- **ProductPrice**: Price display with compare-at pricing
- **ProductForm**: Product variant selection and add to cart

### Cart Components
- **CartMain**: Main cart display (page and sidebar layouts)
- **CartLineItem**: Individual cart line item
- **CartSummary**: Cart totals and checkout button
- **AddToCartButton**: Add to cart button with loading states

### Search Components
- **SearchForm**: Regular search form
- **SearchFormPredictive**: Predictive search with real-time results
- **SearchResults**: Search results display
- **SearchResultsPredictive**: Predictive search results

### Special Components
- **HeroBanner**: Animated hero section with statistics
- **Aside**: Sidebar component for cart, search, and mobile menu
- **PaginatedResourceSection**: Pagination wrapper for collections

## 🗺 Routes & Pages

### Public Routes
- `/` - Homepage with hero banner, featured collection, and recommended products
- `/products/:handle` - Product detail page
- `/collections` - Collections listing
- `/collections/:handle` - Collection page with products
- `/collections/all` - All products page
- `/search` - Search results page
- `/cart` - Shopping cart page
- `/blogs` - Blog listing
- `/blogs/:blogHandle` - Blog posts listing
- `/blogs/:blogHandle/:articleHandle` - Article page
- `/pages/:handle` - Static page
- `/policies` - Policies listing
- `/policies/:handle` - Policy page

### Customer Account Routes
- `/account` - Account dashboard (redirects to orders)
- `/account/login` - Customer login
- `/account/logout` - Customer logout
- `/account/orders` - Order history
- `/account/orders/:id` - Order details
- `/account/profile` - Profile management
- `/account/addresses` - Address management

## 🎨 Styling

The project uses **Tailwind CSS v4** with custom configuration:

- **Primary Color**: `#FF3333` (Red)
- **Secondary Color**: `#FF33331A` (Red with opacity)
- **Fonts**:
  - Sans: Poppins
  - Heading: Integral CF

Custom fonts are included in `/public/fonts/` and loaded via CSS.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn
- Shopify store with Storefront API access
- (Optional) Customer Account API setup for account features

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd hydrogen-storefront
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with your Shopify credentials:
   ```env
   PUBLIC_STORE_DOMAIN=your-store.myshopify.com
   PUBLIC_STOREFRONT_API_TOKEN=your-storefront-api-token
   PUBLIC_STOREFRONT_ID=your-storefront-id
   PUBLIC_CHECKOUT_DOMAIN=checkout.shopify.com
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

   The storefront will be available at `http://localhost:3000` (or the port shown in the terminal).

### Customer Account API Setup

To enable customer account features (`/account` routes), follow these steps:

1. Set up a public domain for local development (see [Shopify Docs](https://shopify.dev/docs/custom-storefronts/building-with-the-customer-account-api/hydrogen#step-1-set-up-a-public-domain-for-local-development))
2. Configure the Customer Account API in your Shopify admin
3. Add the necessary environment variables for customer account authentication

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run typecheck` - Type check TypeScript files
- `npm run codegen` - Generate GraphQL types and React Router types

## 🏗 Building for Production

```bash
npm run build
```

This will:
- Generate GraphQL types from your Shopify schema
- Build the application for production
- Optimize assets and code splitting
- Prepare for deployment to Shopify Oxygen

## 🚢 Deployment

This Hydrogen storefront is designed to deploy to **Shopify Oxygen**, Shopify's edge hosting platform.

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy using Shopify CLI**:
   ```bash
   shopify hydrogen deploy
   ```

For more deployment options, see the [Hydrogen deployment documentation](https://shopify.dev/custom-storefronts/hydrogen/deployment).

## 🔧 Configuration

### Menu Handles

Update menu handles in `app/root.tsx`:
- Header menu: `'main-menu'` (line 108)
- Footer menu: `'footer'` (line 130)

### Customization

- **Colors**: Edit `tailwind.config.ts` to change theme colors
- **Fonts**: Update font families in `tailwind.config.ts` and ensure fonts are in `/public/fonts/`
- **Hero Banner**: Customize in `app/components/HeroBanner.tsx`
- **Announcement Bar**: Configure announcements in `app/components/AnnouncementBar.tsx`

## 📚 Documentation

- [Hydrogen Documentation](https://shopify.dev/custom-storefronts/hydrogen)
- [React Router Documentation](https://reactrouter.com/)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- [Shopify Customer Account API](https://shopify.dev/docs/api/customer-account)

## 🎯 Key Features Explained

### Predictive Search
The storefront includes both regular and predictive search. Predictive search provides real-time suggestions as users type, searching across products, collections, pages, articles, and query suggestions.

### Deferred Loading
The application uses a pattern of loading critical data first (above the fold) and deferring non-critical data (below the fold) to improve initial page load performance.

### Optimistic UI
Product variant selection uses optimistic updates for instant feedback, with URL parameters syncing the selected variant.

### Analytics
Built-in Shopify Analytics integration tracks:
- Product views
- Collection views
- Search queries
- Cart events

## 🤝 Contributing

This is a Hydrogen template/storefront. Feel free to customize it for your needs!

## 📄 License

This project uses the Hydrogen template license. See Shopify's terms for more information.

---

Built with ❤️ using [Shopify Hydrogen](https://shopify.dev/custom-storefronts/hydrogen)
