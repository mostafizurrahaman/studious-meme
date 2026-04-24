import type { Metadata } from 'next';
import { parseMoney } from '@/lib/cart';
import type { Brand, Category, Product } from '@/lib/storefront-types';

export const siteConfig = {
  name: 'Malamal.com.bd',
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://malamal.com.bd',
  description:
    'Best Online Hardware Store in Bangladesh - Buy tools & hardware for sale online near Dhaka at low prices.',
  phone: '+880 9638212121',
  email: 'sales@malamal.com.bd',
  supportEmail: 'info@malamal.com.bd',
  address: 'Level 11 & 12, Medona Tower, 28, Mohakhali C/A, Dhaka-1212.',
  ogImage: process.env.NEXT_PUBLIC_SITE_OG_IMAGE?.trim() || '/logo.png',
  googleVerification: process.env.GOOGLE_SITE_VERIFICATION?.trim() || '',
};

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
};

export function buildMetadata({ title, description, path, image, noindex = false }: MetadataInput): Metadata {
  const resolvedImage = image ?? siteConfig.ogImage;
  const images = resolvedImage ? [{ url: absoluteUrl(resolvedImage) }] : undefined;

    return {
      title,
      description,
      alternates: {
        canonical: absoluteUrl(path),
      },
      robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
      icons: {
        icon: '/icon.png',
        shortcut: '/icon.png',
        apple: '/logo.png',
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: siteConfig.name,
      type: 'website',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images?.map(item => item.url),
    },
  };
}

export const siteMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: siteConfig.url,
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: 'website',
    images: [{ url: absoluteUrl(siteConfig.ogImage) }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [absoluteUrl(siteConfig.ogImage)],
  },
};

export const homeMetadata = buildMetadata({
  title: 'Best Online Hardware Store in Bangladesh',
  description: siteConfig.description,
  path: '/',
});

export const shopMetadata = buildMetadata({
  title: 'Shop Hardware Tools and Equipment in Bangladesh',
  description:
    'Browse hardware tools, industrial equipment, cleaning gear and workshop supplies across the Malamal catalog.',
  path: '/shop',
});

export const mainCategoriesMetadata = buildMetadata({
  title: 'All Categories - Hardware Store',
  description:
    'Browse all product categories including power tools, cleaning equipment, construction machinery and more.',
  path: '/main-categories',
});

export const shopByBrandsMetadata = buildMetadata({
  title: 'Shop By Brands - Trusted Hardware Brands',
  description:
    'Browse trusted hardware brands available on Malamal from the live storefront brand directory.',
  path: '/shop-by-brands',
});

export const promotionsMetadata = buildMetadata({
  title: 'Promotions & Offers - Hardware Deals',
  description: 'View current promotional offers and campaign products on sale at Malamal.',
  path: '/promotions',
});

export const cartMetadata = buildMetadata({
  title: 'Shopping Cart - Review Your Order',
  description: 'Review selected products in your shopping cart before checkout.',
  path: '/cart',
  noindex: true,
});

export const checkoutMetadata = buildMetadata({
  title: 'Checkout - Complete Your Order',
  description: 'Complete your order and submit delivery details.',
  path: '/checkout',
  noindex: true,
});

export const wishlistMetadata = buildMetadata({
  title: 'Wishlist - Saved Products',
  description: 'Review saved products and shortlist items for later purchase.',
  path: '/wishlist',
  noindex: true,
});

export const compareMetadata = buildMetadata({
  title: 'Compare Products - Side by Side',
  description: 'Compare product details side by side to make the best choice.',
  path: '/compare',
  noindex: true,
});

export const quotationRequestMetadata = buildMetadata({
  title: 'Request a Quotation - Bulk Orders',
  description: 'Request bulk pricing and wholesale quotations for project and procurement needs.',
  path: '/quotation-request',
});

export const ourContactsMetadata = buildMetadata({
  title: 'Contact Us - Malamal Support',
  description:
    'Get in touch with Malamal sales and support team via hotline, email, WhatsApp or visit our office.',
  path: '/our-contacts',
});

export const privacyPolicyMetadata = buildMetadata({
  title: 'Privacy Policy - Data Protection',
  description: 'Learn how Malamal collects, uses and protects your personal information.',
  path: '/privacy-policy',
  noindex: false,
});

export const termsAndConditionMetadata = buildMetadata({
  title: 'Terms and Conditions - Legal',
  description: 'Read the terms and conditions for using Malamal storefront and services.',
  path: '/terms-and-conditions',
  noindex: false,
});

export const deliveryReturnMetadata = buildMetadata({
  title: 'Delivery & Return Policy',
  description: 'Learn about our delivery coverage, return procedures and policies.',
  path: '/return-policy',
  noindex: false,
});

export const aboutUsMetadata = buildMetadata({
  title: 'About Us',
  description: 'Learn about Malamal, your trusted online hardware store in Bangladesh.',
  path: '/about-us',
});

export const myProfileMetadata = buildMetadata({
  title: 'My Profile',
  description: 'Manage your account profile and settings.',
  path: '/my-account/profile',
  noindex: true,
});

export const myAccountMetadata = buildMetadata({
  title: 'My Account - User Dashboard',
  description: 'Manage your account, orders, addresses and preferences.',
  path: '/my-account',
  noindex: true,
});

export const ordersMetadata = buildMetadata({
  title: 'My Orders - Order History',
  description: 'View all your orders, order details, status and delivery information.',
  path: '/my-account/orders',
  noindex: true,
});

export const orderDetailMetadata = buildMetadata({
  title: 'Order Details',
  description: 'View your order details, items, status and delivery information.',
  path: '/my-account/orders',
  noindex: true,
});

export function buildCategoryMetadata(category: {
  name?: string;
  title?: string;
  slug: string;
  description: string;
  image?: string;
}) {
  const title = category.name ?? category.title ?? 'Category';

  return buildMetadata({
    title,
    description: category.description,
    path: `/category/${category.slug}`,
    image: category.image,
  });
}

export function buildProductMetadata(product: {
  title: string;
  brand: string;
  sku: string;
  slug: string;
  price: string;
  image: string;
}) {
  return buildMetadata({
    title: product.title,
    description: `Buy ${product.title} from ${product.brand} on ${siteConfig.name}. SKU ${product.sku} with catalog pricing and quotation support.`,
    path: `/product/${product.slug}`,
    image: product.image,
  });
}

function catalogItem(name: string, url: string, image?: string) {
  return {
    '@type': 'ListItem',
    position: 0,
    item: {
      '@type': 'Thing',
      name,
      url: absoluteUrl(url),
      ...(image ? { image } : {}),
    },
  };
}

function buildCollectionSchema(
  title: string,
  description: string,
  path: string,
  items: Array<{ name: string; url: string; image?: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: absoluteUrl(path),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((item, index) => ({
        ...catalogItem(item.name, item.url, item.image),
        position: index + 1,
      })),
    },
  };
}

export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function buildFaqSchema(
  name: string,
  description: string,
  path: string,
  questions: Array<{ question: string; answer: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name,
    description,
    url: absoluteUrl(path),
    mainEntity: questions.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildArticleSchema(title: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: absoluteUrl(path),
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

function buildWebPageSchema(title: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: absoluteUrl(path),
  };
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  email: siteConfig.email,
  telephone: siteConfig.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: siteConfig.address,
    addressLocality: 'Dhaka',
    postalCode: '1212',
    addressCountry: 'BD',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: siteConfig.phone,
      email: siteConfig.email,
      areaServed: 'BD',
      availableLanguage: ['en', 'bn'],
    },
    {
      '@type': 'ContactPoint',
      contactType: 'support',
      telephone: siteConfig.phone,
      email: siteConfig.supportEmail,
      areaServed: 'BD',
      availableLanguage: ['en', 'bn'],
    },
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  url: siteConfig.url,
};

export const siteSchemas = [organizationSchema, websiteSchema];

export function buildHomeSchemas(input?: {
  categories?: Category[];
  products?: Product[];
  brands?: Brand[];
}) {
  const categories = input?.categories ?? [];
  const products = input?.products ?? [];
  const brandItems = input?.brands ?? [];

  const items = [
    ...categories.slice(0, 8).map(category => ({
      name: category.name,
      url: category.href,
      image: category.image ? absoluteUrl(category.image) : undefined,
    })),
    ...products.slice(0, 10).map(product => ({
      name: product.title,
      url: `/product/${product.slug}`,
      image: product.image,
    })),
    ...brandItems.slice(0, 8).map(brand => ({
      name: brand.name,
      url: brand.href,
      image: brand.image,
    })),
  ];

  return [
    buildBreadcrumbSchema([{ name: 'Home', url: '/' }]),
    ...(items.length
      ? [
          buildCollectionSchema(
            'Malamal Home',
            'Browse top categories, trusted brands and featured store sections.',
            '/',
            items,
          ),
        ]
      : []),
  ];
}

export function buildShopSchemas(products: Product[], categories: Category[]) {
  return [
    buildBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Shop', url: '/shop' },
    ]),
    buildFaqSchema(
      'Shop FAQ',
      'Frequently asked questions about browsing products and placing orders.',
      '/shop',
      [
        {
          question: 'How do I find the right product?',
          answer:
            'Use the category rail, product cards and the shop grid to browse by department, brand and catalog item.',
        },
        {
          question: 'Can I request bulk pricing?',
          answer:
            'Yes. Use the quotation request page for project orders, wholesale quantities and brand-specific pricing.',
        },
        {
          question: 'Do products show stock and pricing?',
          answer: 'Yes. Product cards show the current catalog price, stock status and brand information.',
        },
        {
          question: 'Can I check out from the shop page?',
          answer: 'Yes. Add products to cart, review the summary and proceed to checkout when ready.',
        },
      ],
    ),
    buildCollectionSchema(
      'Shop Catalog',
      'Browse products from the hardware catalog.',
      '/shop',
      products.slice(0, 50).map(product => ({
        name: product.title,
        url: `/product/${product.slug}`,
        image: product.image,
      })),
    ),
    buildCollectionSchema(
      'Shop Categories',
      'Browse the storefront category structure.',
      '/main-categories',
      categories.slice(0, 20).map(category => ({
        name: category.name,
        url: category.href,
        image: category.image ? absoluteUrl(category.image) : undefined,
      })),
    ),
  ];
}

export function buildCategorySchemas(
  category: {
    name?: string;
    title?: string;
    slug: string;
    description: string;
  },
  inputProducts?: Product[],
) {
  const title = category.name ?? category.title ?? 'Category';
  const products = inputProducts ?? [];

  return [
    buildBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Main Categories', url: '/main-categories' },
      { name: title, url: `/category/${category.slug}` },
    ]),
    buildFaqSchema(
      `${title} FAQ`,
      `Frequently asked questions about ${title.toLowerCase()}.`,
      `/category/${category.slug}`,
      [
        {
          question: `What products are in ${title}?`,
          answer: `This category groups products related to ${title.toLowerCase()} from the Malamal catalog.`,
        },
        {
          question: 'Can I request a bulk quotation?',
          answer:
            'Yes. Use the quotation request page for project buying, wholesale quantities and special pricing.',
        },
        {
          question: 'Are product prices and stock shown here?',
          answer: 'Yes. Product cards show the current catalog price, stock status and brand information.',
        },
        {
          question: 'Can I open a product from this category page?',
          answer: 'Yes. Select any product card to view details, add it to cart or place an order.',
        },
      ],
    ),
    buildCollectionSchema(
      title,
      category.description,
      `/category/${category.slug}`,
      products.map(product => ({
        name: product.title,
        url: `/product/${product.slug}`,
        image: product.image,
      })),
    ),
  ];
}

export function buildMainCategoriesSchemas(categories: Category[]) {
  const items = categories;

  return [
    buildBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Main Categories', url: '/main-categories' },
    ]),
    buildCollectionSchema(
      'All Categories',
      'Explore the storefront category structure.',
      '/main-categories',
      items.map(category => ({
        name: category.name,
        url: category.href,
        image: category.image ? absoluteUrl(category.image) : undefined,
      })),
    ),
  ];
}

export function buildShopByBrandsSchemas(brandItems: Brand[]) {
  const items = brandItems;

  return [
    buildBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Shop by Brands', url: '/shop-by-brands' },
    ]),
    buildCollectionSchema(
      'Shop By Brands',
      'Browse the trusted brands used across the storefront.',
      '/shop-by-brands',
      items.map(brand => ({
        name: brand.name,
        url: brand.href,
        image: brand.image,
      })),
    ),
  ];
}

export function buildPromotionsSchemas(products: Product[]) {
  const items = products;

  return [
    buildBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Promotions', url: '/promotions' },
    ]),
    buildCollectionSchema(
      'Promotions',
      'View the current promotional offers and campaign products.',
      '/promotions',
      items.slice(0, 50).map(product => ({
        name: product.title,
        url: `/product/${product.slug}`,
        image: product.image,
      })),
    ),
  ];
}

export const cartSchemas = [
  buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Cart', url: '/cart' },
  ]),
  buildWebPageSchema('Shopping Cart', 'Review selected products before checkout.', '/cart'),
];

export const checkoutSchemas = [
  buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Cart', url: '/cart' },
    { name: 'Checkout', url: '/checkout' },
  ]),
  buildWebPageSchema('Checkout', 'Complete your order and submit delivery details.', '/checkout'),
];

export const wishlistSchemas = [
  buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Wishlist', url: '/wishlist' },
  ]),
  buildWebPageSchema('Wishlist', 'Review saved products and shortlist items for later.', '/wishlist'),
];

export const compareSchemas = [
  buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Compare', url: '/compare' },
  ]),
  buildWebPageSchema('Compare Products', 'Compare product details side by side.', '/compare'),
];

export const ourContactsSchemas = [
  buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Our Contacts', url: '/our-contacts' },
  ]),
  {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Malamal.com.bd',
    description: 'Hotline, email, WhatsApp and office details for sales and support.',
    url: absoluteUrl('/our-contacts'),
    mainEntity: organizationSchema,
  },
];

export const quotationRequestSchemas = [
  buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Quotation Request', url: '/quotation-request' },
  ]),
  buildFaqSchema(
    'Quotation Request FAQ',
    'Frequently asked questions about bulk quotation requests.',
    '/quotation-request',
    [
      {
        question: 'What details should I include in a quotation request?',
        answer:
          'Share product names or links, quantity, delivery area, budget range and any brand preference so the sales team can prepare an accurate quote.',
      },
      {
        question: 'How quickly will I receive a reply?',
        answer:
          'Requests are reviewed by the sales team and answered as soon as possible during support hours.',
      },
      {
        question: 'Can I request pricing for multiple brands?',
        answer:
          'Yes. Include the preferred brand and any acceptable alternatives to compare options in one quote.',
      },
      {
        question: 'Is quotation support available for bulk orders?',
        answer: 'Yes. The request form is designed for wholesale, procurement and project buying workflows.',
      },
    ],
  ),
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Bulk Quotation Request',
    description: 'Request project and wholesale pricing for hardware and industrial products.',
    serviceType: 'Wholesale and bulk quotation',
    provider: organizationSchema,
    areaServed: 'BD',
    url: absoluteUrl('/quotation-request'),
  },
];

export function buildProductSchemas(product: {
  title: string;
  slug: string;
  brand: string;
  sku: string;
  image: string;
  price: string;
  oldPrice?: string;
  stock: string;
  rating: string;
  category: string;
  categorySlug?: string;
}) {
  const url = absoluteUrl(`/product/${product.slug}`);
  const currentPrice = parseMoney(product.price);
  const categoryUrl = product.categorySlug?.trim()
    ? absoluteUrl(`/category/${product.categorySlug}`)
    : absoluteUrl('/shop');
  const offer =
    Number.isFinite(currentPrice) && currentPrice > 0
      ? {
          '@type': 'Offer',
          url,
          priceCurrency: 'BDT',
          price: currentPrice,
          availability: product.stock.toLowerCase().includes('in stock')
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
        }
      : undefined;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: absoluteUrl('/'),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Shop',
          item: absoluteUrl('/shop'),
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: product.category,
          item: categoryUrl,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: product.title,
          item: url,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      image: [absoluteUrl(product.image)],
      sku: product.sku,
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      description: `${product.title} available from ${product.brand} on ${siteConfig.name}.`,
      offers: offer,
    },
  ];
}

export const privacyPolicySchemas = [
  buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Privacy Policy', url: '/privacy-policy' },
  ]),
  buildArticleSchema(
    'Privacy Policy - Data Protection',
    'Learn how Malamal collects, uses and protects your personal information.',
    '/privacy-policy',
  ),
];

export const termsAndConditionSchemas = [
  buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Terms and Conditions', url: '/terms-and-conditions' },
  ]),
  buildArticleSchema(
    'Terms and Conditions',
    'Read the terms and conditions for using Malamal storefront and services.',
    '/terms-and-conditions',
  ),
];

export const deliveryReturnSchemas = [
  buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Return Policy', url: '/return-policy' },
  ]),
  buildArticleSchema(
    'Delivery & Return Policy',
    'Learn about our delivery coverage, return procedures and policies.',
    '/return-policy',
  ),
];

export const aboutUsSchemas = [
  buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'About Us', url: '/about-us' },
  ]),
  buildArticleSchema(
    'About Malamal - Your Trusted Hardware Store',
    'Learn about Malamal, your trusted online hardware store in Bangladesh.',
    '/about-us',
  ),
];

export const myAccountSchemas = [
  buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'My Account', url: '/my-account' },
  ]),
  buildWebPageSchema(
    'My Account',
    'Manage your account, orders, addresses and preferences.',
    '/my-account',
  ),
];

export const ordersSchemas = [
  buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'My Account', url: '/my-account' },
    { name: 'Orders', url: '/my-account/orders' },
  ]),
  buildWebPageSchema(
    'My Orders',
    'View all your orders, order details, status and delivery information.',
    '/my-account/orders',
  ),
];

export function buildOrderDetailSchemas(orderId: string) {
  return [
    buildBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'My Account', url: '/my-account' },
      { name: 'Orders', url: '/my-account/orders' },
      { name: `Order ${orderId}`, url: `/my-account/orders/${orderId}` },
    ]),
    buildWebPageSchema(
      `Order ${orderId}`,
      'View your order details, status and delivery information.',
      `/my-account/orders/${orderId}`,
    ),
  ];
}
