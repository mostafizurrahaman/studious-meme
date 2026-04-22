export type Product = {
  title: string;
  slug: string;
  href: '/shop';
  image: string;
  price: string;
  oldPrice?: string;
  badge?: string;
  brand: string;
  sku: string;
  stock: string;
  rating: string;
  category: string;
  isFeatured?: boolean;
  createdAt?: string;
};

export type Category = {
  name: string;
  slug: string;
  href: `/category/${string}`;
  image: string;
  description: string;
  accent: string;
};

export type Brand = {
  name: string;
  slug: string;
  href: `/shop?b=${string}`;
  image: string;
};

export const contactChannels = [
  {
    label: 'Hotline',
    value: '+880 9638212121',
    href: 'tel:+8809638212121',
  },
  {
    label: 'Sales',
    value: 'sales@malamal.com.bd',
    href: 'mailto:sales@malamal.com.bd',
  },
  {
    label: 'Support',
    value: 'info@malamal.com.bd',
    href: 'mailto:info@malamal.com.bd',
  },
  {
    label: 'WhatsApp',
    value: '+880 1972525821',
    href: 'https://wa.me/8801972525821',
  },
  {
    label: 'B2B Sales',
    value: '+880 1972525828',
    href: 'tel:+8801972525828',
  },
];

export const accountBenefits = [
  'Track orders from one dashboard',
  'Save addresses for faster checkout',
  'Request bulk quotations easily',
  'Build a wishlist for saved purchases',
];

export const policySections = [
  {
    title: 'Information we collect',
    items: [
      'Account details, order details and contact information.',
      'Device and browser data for analytics and performance.',
      'Support conversations and quotation request submissions.',
    ],
  },
  {
    title: 'How we use data',
    items: [
      'To process orders, deliver products and provide support.',
      'To improve the storefront, service quality and product discovery.',
      'To send transactional updates and important notices.',
    ],
  },
  {
    title: 'Your choices',
    items: [
      'Request access or corrections to your personal information.',
      'Opt out of non-essential marketing when available.',
      'Remove inactive account data when needed.',
    ],
  },
];

export const supportStats = [
  { value: '24/7', label: 'Ordering support' },
  { value: '1000+', label: 'Products in stock' },
  { value: '64', label: 'District coverage' },
  { value: 'B2B', label: 'Project quotation' },
];
