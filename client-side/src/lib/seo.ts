import type { Metadata } from 'next';
import { parseMoney } from '@/lib/cart';
import {
  brands,
  categoryShowcase,
  findCategoryByName,
  featuredProducts,
  latestProducts,
  offerProducts,
  topCategories,
} from '@/lib/malamal-content';

export const siteConfig = {
  name: 'Malamal.com.bd',
  url: 'https://malamal.com.bd',
  description:
    'Best Online Hardware Store in Bangladesh – Buy tools & hardware for sale online near Dhaka at low prices.',
  phone: '+880 9638212121',
  email: 'sales@malamal.com.bd',
  supportEmail: 'info@malamal.com.bd',
  address: 'Level 11 & 12, Medona Tower, 28, Mohakhali C/A, Dhaka-1212.',
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
  noindex?: boolean;
};

export function buildMetadata({ title, description, path, noindex = false }: MetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(path),
    },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: siteConfig.name,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export const siteMetadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
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
  title: 'Browse Hardware Categories',
  description:
    'Explore the full category map across power tools, welding, cleaning, packaging and material handling.',
  path: '/main-categories',
});

export function buildCategoryMetadata(category: { name?: string; title?: string; slug: string; description: string }) {
  const title = category.name ?? category.title ?? 'Category';

  return buildMetadata({
    title,
    description: category.description,
    path: `/category/${category.slug}`,
  });
}

export const shopByBrandsMetadata = buildMetadata({
  title: 'Shop by Brands',
  description:
    'Shop trusted brands used across the Malamal storefront and product catalog.',
  path: '/shop-by-brands',
});

export const promotionsMetadata = buildMetadata({
  title: 'Promotions and Offers',
  description:
    'See seasonal deals, featured bundles and promotional product highlights from the catalog.',
  path: '/promotions',
});

export const ourContactsMetadata = buildMetadata({
  title: 'Contact Malamal.com.bd',
  description:
    'Find hotline, email, WhatsApp and office details for sales and support.',
  path: '/our-contacts',
});

export const quotationRequestMetadata = buildMetadata({
  title: 'Request a Bulk Quotation',
  description:
    'Submit product details and quantity requirements for wholesale or project pricing.',
  path: '/quotation-request',
});

export const cartMetadata = buildMetadata({
  title: 'Shopping Cart',
  description: 'Review selected products before checkout.',
  path: '/cart',
  noindex: true,
});

export const checkoutMetadata = buildMetadata({
  title: 'Checkout',
  description: 'Complete your order and submit delivery details.',
  path: '/checkout',
  noindex: true,
});

export const myAccountMetadata = buildMetadata({
  title: 'My Account',
  description: 'Sign in to manage your account, quotations and order history.',
  path: '/my-account',
  noindex: true,
});

export const myAccountSchemas = [
  buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'My Account', url: '/my-account' },
  ]),
];

export const ordersMetadata = buildMetadata({
  title: 'Orders',
  description: 'View saved orders from this browser.',
  path: '/my-account/orders',
  noindex: true,
});

export const ordersSchemas = [
  buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'My Account', url: '/my-account' },
    { name: 'Orders', url: '/my-account/orders' },
  ]),
];

export const orderDetailMetadata = buildMetadata({
  title: 'Order Detail',
  description: 'View the details of a saved order.',
  path: '/my-account/orders/placeholder',
  noindex: true,
});

export function buildOrderDetailSchemas(orderId: string) {
  return [
    buildBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'My Account', url: '/my-account' },
      { name: 'Orders', url: '/my-account/orders' },
      { name: orderId, url: `/my-account/orders/${orderId}` },
    ]),
  ];
}

export const wishlistMetadata = buildMetadata({
  title: 'Wishlist',
  description: 'Review saved products and shortlist items for later.',
  path: '/wishlist',
  noindex: true,
});

export const compareMetadata = buildMetadata({
  title: 'Compare Products',
  description: 'Compare product details side by side.',
  path: '/compare',
  noindex: true,
});

export const privacyPolicyMetadata = buildMetadata({
  title: 'Privacy Policy',
  description: 'Read how Malamal handles account, order and support information.',
  path: '/privacy-policy',
  noindex: true,
});

export const privacyPolicySchemas = [
  buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Privacy Policy', url: '/privacy-policy' },
  ]),
  buildArticleSchema(
    'Privacy Policy',
    'Read how Malamal handles account, order and support information.',
    '/privacy-policy',
  ),
];

export const termsAndConditionMetadata = buildMetadata({
  title: 'Terms and Conditions',
  description: 'Review the storefront usage terms and conditions.',
  path: '/terms-and-condition',
  noindex: true,
});

export const termsAndConditionSchemas = [
  buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Terms and Conditions', url: '/terms-and-condition' },
  ]),
  buildArticleSchema(
    'Terms and Conditions',
    'Review the storefront usage terms and conditions.',
    '/terms-and-condition',
  ),
];

export const deliveryReturnMetadata = buildMetadata({
  title: 'Delivery and Return Policy',
  description: 'Read the delivery, return and refund policy for the storefront.',
  path: '/delivery-return',
  noindex: true,
});

export const deliveryReturnSchemas = [
  buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Delivery and Return Policy', url: '/delivery-return' },
  ]),
  buildArticleSchema(
    'Delivery and Return Policy',
    'Read the delivery, return and refund policy for the storefront.',
    '/delivery-return',
  ),
];

export function buildProductMetadata(product: { title: string; brand: string; sku: string; slug: string; price: string }) {
  return buildMetadata({
    title: product.title,
    description: `Buy ${product.title} from ${product.brand} on ${siteConfig.name}. SKU ${product.sku} with catalog pricing and quotation support.`,
    path: `/product/${product.slug}`,
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

function buildCollectionSchema(title: string, description: string, path: string, items: Array<{ name: string; url: string; image?: string }>) {
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

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  email: siteConfig.email,
  telephone: siteConfig.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Level 11 & 12, Medona Tower, 28, Mohakhali C/A',
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

export const homeSchemas = [
  buildCollectionSchema(
    'Malamal Home',
    'Browse top categories and featured store sections.',
    '/',
    topCategories.map(category => ({
      name: category.name,
      url: category.href,
      image: absoluteUrl(category.image),
    })),
  ),
];

export const shopSchemas = [
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
        answer: 'Use the category rail, product cards and the shop grid to browse by department, brand and catalog item.',
      },
      {
        question: 'Can I request bulk pricing?',
        answer: 'Yes. Use the quotation request page for project orders, wholesale quantities and brand-specific pricing.',
      },
      {
        question: 'Do products show stock and pricing?',
        answer: 'Yes. Each product card includes the catalog price, old price when available, brand and stock status.',
      },
      {
        question: 'Can I check out from the shop page?',
        answer: 'Yes. Add products to cart, review the summary and proceed to checkout when ready.',
      },
    ],
  ),
  buildCollectionSchema(
    'Shop Catalog',
    'Browse featured and latest products from the hardware catalog.',
    '/shop',
    [...featuredProducts, ...latestProducts].map(product => ({
      name: product.title,
      url: `/product/${product.slug}`,
      image: product.image,
    })),
  ),
];

export function buildCategorySchemas(category: { name?: string; title?: string; slug: string; description: string }) {
  const title = category.name ?? category.title ?? 'Category';
  const products = [...featuredProducts, ...latestProducts, ...offerProducts].filter(
    product => product.category === title,
  );

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
          answer: 'Yes. Use the quotation request page for project buying, wholesale quantities and special pricing.',
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

export const mainCategoriesSchemas = [
  buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Main Categories', url: '/main-categories' },
  ]),
  buildCollectionSchema(
    'All Categories',
    'Explore the storefront category structure.',
    '/main-categories',
    [...topCategories, ...categoryShowcase].map(category => ({
      name: 'name' in category ? category.name : category.title,
      url: category.href,
      image: 'image' in category ? absoluteUrl(category.image) : undefined,
    })),
  ),
];

export const shopByBrandsSchemas = [
  buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Shop by Brands', url: '/shop-by-brands' },
  ]),
  buildCollectionSchema(
    'Shop By Brands',
    'Browse the trusted brands used across the storefront.',
    '/shop-by-brands',
    brands.map(brand => ({
      name: brand.name,
      url: brand.href,
      image: brand.image,
    })),
  ),
];

export const promotionsSchemas = [
  buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Promotions', url: '/promotions' },
  ]),
  buildCollectionSchema(
    'Promotions',
    'View the current promotional offers and campaign products.',
    '/promotions',
    offerProducts.map(product => ({
      name: product.title,
      url: `/product/${product.slug}`,
      image: product.image,
    })),
  ),
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
        answer: 'Share product names or links, quantity, delivery area, budget range and any brand preference so the sales team can prepare an accurate quote.',
      },
      {
        question: 'How quickly will I receive a reply?',
        answer: 'Requests are reviewed by the sales team and answered as soon as possible during support hours.',
      },
      {
        question: 'Can I request pricing for multiple brands?',
        answer: 'Yes. Include the preferred brand and any acceptable alternatives to compare options in one quote.',
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

export function buildProductSchemas(product: { title: string; slug: string; brand: string; sku: string; image: string; price: string; oldPrice?: string; stock: string; rating: string; category: string }) {
  const url = absoluteUrl(`/product/${product.slug}`);
  const currentPrice = parseMoney(product.price);
  const oldPrice = product.oldPrice ? parseMoney(product.oldPrice) : null;
  const ratingValue = Number.parseFloat(product.rating);
  const category = findCategoryByName(product.category);

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
          item: absoluteUrl(category ? `/category/${category.slug}` : '/shop'),
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
      image: [product.image],
      sku: product.sku,
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      description: `${product.title} available from ${product.brand} on ${siteConfig.name}.`,
      aggregateRating: Number.isFinite(ratingValue)
        ? {
            '@type': 'AggregateRating',
            ratingValue,
            reviewCount: Math.max(5, Math.round(ratingValue * 20)),
          }
        : undefined,
      offers: oldPrice
        ? [
            {
              '@type': 'Offer',
              url,
              priceCurrency: 'BDT',
              price: currentPrice,
              availability: product.stock.toLowerCase().includes('in stock')
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              itemCondition: 'https://schema.org/NewCondition',
            },
            {
              '@type': 'Offer',
              url,
              priceCurrency: 'BDT',
              price: oldPrice,
              itemCondition: 'https://schema.org/NewCondition',
              priceValidUntil: '2027-12-31',
            },
          ]
        : {
            '@type': 'Offer',
            url,
            priceCurrency: 'BDT',
            price: currentPrice,
            availability: product.stock.toLowerCase().includes('in stock')
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
          },
    },
  ];
}
