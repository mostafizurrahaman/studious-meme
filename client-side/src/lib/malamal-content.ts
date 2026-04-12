export type Product = {
  title: string;
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
  href: '/shop-by-brands';
  image: string;
};

export const topCategories: Category[] = [
  {
    name: 'Air Cooler & Fans',
    slug: 'air-cooler-fans',
    href: '/category/air-cooler-fans',
    image: '/category-air-cooler.svg',
    description: 'Air cooler, ceiling fan, exhaust fan and accessories.',
    accent: 'from-[#0e2f56] to-[#163f77]',
  },
  {
    name: 'Cleaning & Maintenance',
    slug: 'cleaning-maintenance',
    href: '/category/cleaning-maintenance',
    image: '/category-cleaning.svg',
    description: 'Vacuum, washing, disinfection and plumbing tools.',
    accent: 'from-[#4d6b92] to-[#90a4c8]',
  },
  {
    name: 'Construction Machinery',
    slug: 'construction-machinery',
    href: '/category/construction-machinery',
    image: '/category-construction.svg',
    description: 'Heavy-duty tools for site and workshop work.',
    accent: 'from-[#5f2d1f] to-[#c56c47]',
  },
  {
    name: 'Electrical Tools',
    slug: 'electrical-tools',
    href: '/category/electrical-tools',
    image: '/category-electrical.svg',
    description: 'Generators, lights, cables and electrical accessories.',
    accent: 'from-[#233647] to-[#5a7288]',
  },
  {
    name: 'Power Tools',
    slug: 'power-tools',
    href: '/category/power-tools',
    image: '/category-power-tools.svg',
    description: 'Drills, saws, grinders and workshop tools.',
    accent: 'from-[#f15a24] to-[#f89c57]',
  },
  {
    name: 'Welding & Cutting',
    slug: 'welding-cutting',
    href: '/category/welding-cutting',
    image: '/category-welding.svg',
    description: 'Welding machines, cutters and consumables.',
    accent: 'from-[#5f2d1f] to-[#c56c47]',
  },
  {
    name: 'Commercial Packaging',
    slug: 'commercial-packaging',
    href: '/category/commercial-packaging',
    image: '/category-packaging.svg',
    description: 'Taping, sealing and packaging machines.',
    accent: 'from-[#233647] to-[#5a7288]',
  },
  {
    name: 'Material Handling',
    slug: 'material-handling',
    href: '/category/material-handling',
    image: '/category-handling.svg',
    description: 'Crane, hoist, mixer and handling equipment.',
    accent: 'from-[#3d5a48] to-[#80a27c]',
  },
];

export const featuredProducts: Product[] = [
  {
    title: 'Mig Welding Machine MIG-250GS Brand- RIVCEN Input – 220Volt',
    href: '/shop',
    image:
      'https://malamal.com.bd/wp-content/uploads/2024/01/2023-04-27-644a0f82c3507.png',
    price: 'Tk. 54,000.00',
    oldPrice: 'Tk. 60,000.00',
    badge: '-10%',
    brand: 'Rivcen',
    sku: '10916',
    stock: 'In stock',
    rating: '4.8',
    category: 'Welding & Cutting',
  },
  {
    title: '23L Vacuum Cleaner 2100W SANFORD-SF23L-2100W (Malaysia)',
    href: '/shop',
    image:
      'https://i0.wp.com/malamal.com.bd/wp-content/uploads/2024/01/sanford-23litre-vacuum-cleaner-bangladesh-bd.webp?fit=600%2C600&ssl=1',
    price: 'Tk. 10,500.00',
    oldPrice: 'Tk. 11,500.00',
    badge: '-9%',
    brand: 'Sanford',
    sku: '14090',
    stock: 'In stock',
    rating: '5.0',
    category: 'Cleaning & Maintenance',
  },
  {
    title: '12V/24V Battery Charger Brand INGCO – ING-CB1601',
    href: '/shop',
    image:
      'https://i0.wp.com/malamal.com.bd/wp-content/uploads/2024/01/openart-image_nfp4GZgE_1771756212999_raw.webp?fit=768%2C768&ssl=1',
    price: 'Tk. 6,525.00',
    oldPrice: 'Tk. 7,250.00',
    badge: '-10%',
    brand: 'INGCO',
    sku: '13168',
    stock: 'In stock',
    rating: '4.9',
    category: 'Electrical Tools',
  },
  {
    title: 'High Pressure Car Washer 1500W 100bar Brand TOTAL – TGT11236',
    href: '/shop',
    image:
      'https://malamal.com.bd/wp-content/uploads/2024/01/2023-04-27-644a14e018223.png',
    price: 'Tk. 12,600.00',
    oldPrice: 'Tk. 13,990.00',
    badge: '-10%',
    brand: 'Total',
    sku: '12086',
    stock: 'In stock',
    rating: '4.7',
    category: 'Cleaning & Maintenance',
  },
  {
    title: 'Electric Mini Crane with Rope Hoist 500 Kg 50 Mtr Winch',
    href: '/shop',
    image:
      'https://malamal.com.bd/wp-content/uploads/2024/01/2023-04-27-644a14e018223.png',
    price: 'Tk. 105,000.00',
    oldPrice: 'Tk. 118,000.00',
    badge: 'Hot',
    brand: 'Winner',
    sku: '13981',
    stock: 'In stock',
    rating: '4.8',
    category: 'Material Handling',
  },
];

export const latestProducts: Product[] = [
  {
    title: 'TOTAL Mechanic Gloves TSP1806-XL',
    href: '/shop',
    image:
      'https://malamal.com.bd/wp-content/uploads/2024/01/2023-04-27-644a14e018223.png',
    price: 'Tk. 941.00',
    oldPrice: 'Tk. 990.00',
    badge: '-5%',
    brand: 'Total',
    sku: '12166',
    stock: 'In stock',
    rating: '4.6',
    category: 'Construction Machinery',
  },
  {
    title: '80L Industrial Vacuum Cleaner 4500W CHINA WET & DRY BAOLYWUD Brand',
    href: '/shop',
    image:
      'https://malamal.com.bd/wp-content/uploads/2024/01/2023-04-27-644a163aad382.jpg',
    price: 'Tk. 32,000.00',
    oldPrice: 'Tk. 36,500.00',
    badge: '-12%',
    brand: 'Sippon',
    sku: '11062',
    stock: 'In stock',
    rating: '4.5',
    category: 'Cleaning & Maintenance',
  },
  {
    title: 'Electric Router 2200W Brand Total – TR11122',
    href: '/shop',
    image:
      'https://malamal.com.bd/wp-content/uploads/2024/01/Untitled-design-17.png',
    price: 'Tk. 8,450.00',
    oldPrice: 'Tk. 9,100.00',
    badge: 'New',
    brand: 'Total',
    sku: '12138',
    stock: 'In stock',
    rating: '4.8',
    category: 'Power Tools',
  },
  {
    title: 'Bench Grinder Machine 8" 200mm 350W Brand INGCO – BG83502',
    href: '/shop',
    image:
      'https://malamal.com.bd/wp-content/uploads/2024/01/2023-04-27-644a0f82c3507.png',
    price: 'Tk. 5,250.00',
    oldPrice: 'Tk. 5,900.00',
    badge: '-11%',
    brand: 'INGCO',
    sku: '12788',
    stock: 'In stock',
    rating: '4.6',
    category: 'Power Tools',
  },
  {
    title: '13mm Impact Drill 750w Brand Total – TG108136',
    href: '/shop',
    image:
      'https://malamal.com.bd/wp-content/uploads/2024/01/2023-04-27-644a14e018223.png',
    price: 'Tk. 4,950.00',
    oldPrice: 'Tk. 5,450.00',
    badge: '-9%',
    brand: 'Total',
    sku: '13748',
    stock: 'In stock',
    rating: '4.4',
    category: 'Power Tools',
  },
];

export const offerProducts: Product[] = [
  {
    title: 'TOTAL Mechanic Gloves TSP1806-XL',
    href: '/shop',
    image:
      'https://malamal.com.bd/wp-content/uploads/2024/01/2023-04-27-644a14e018223.png',
    price: 'Tk. 941.00',
    oldPrice: 'Tk. 990.00',
    badge: '-5%',
    brand: 'Total',
    sku: '12166',
    stock: 'In stock',
    rating: '4.6',
    category: 'Construction Machinery',
  },
  {
    title: 'Lithium-Lon Vacuum Cleaner With Battery & Charger Brand Ingco – CVL12001',
    href: '/shop',
    image:
      'https://malamal.com.bd/wp-content/uploads/2024/01/2023-04-27-644a163aad382.jpg',
    price: 'Tk. 6,912.00',
    oldPrice: 'Tk. 7,680.00',
    badge: '-10%',
    brand: 'INGCO',
    sku: '12890',
    stock: 'In stock',
    rating: '4.7',
    category: 'Cleaning & Maintenance',
  },
  {
    title: '235mm (9-1/4”) Circular Saw 2200W INGCO – CS23522',
    href: '/shop',
    image:
      'https://malamal.com.bd/wp-content/uploads/2024/01/Untitled-design-17.png',
    price: 'Tk. 9,000.00',
    oldPrice: 'Tk. 10,000.00',
    badge: '-10%',
    brand: 'INGCO',
    sku: '14018',
    stock: 'In stock',
    rating: '4.8',
    category: 'Power Tools',
  },
  {
    title: 'Automatic Box Carton Taping Machine – PACKWELL FXC-4030',
    href: '/shop',
    image:
      'https://malamal.com.bd/wp-content/uploads/2025/01/fxc-auto-carton-box-taping-machine.webp',
    price: 'Tk. 120,000.00',
    oldPrice: 'Tk. 135,000.00',
    badge: 'Hot',
    brand: 'Packwell',
    sku: '047836',
    stock: 'In stock',
    rating: '4.9',
    category: 'Commercial Packaging',
  },
  {
    title: 'Fogger Machine MS/SY-5000 for HouseHold Use Bundle Offer',
    href: '/shop',
    image:
      'https://malamal.com.bd/wp-content/uploads/2024/01/2023-04-27-644a14216ada7.png',
    price: 'Tk. 11,200.00',
    oldPrice: 'Tk. 12,500.00',
    badge: 'Bundle',
    brand: 'Malamal',
    sku: '11922',
    stock: 'In stock',
    rating: '4.5',
    category: 'Cleaning & Maintenance',
  },
];

export const brands: Brand[] = [
  {
    name: 'INGCO',
    href: '/shop-by-brands',
    image:
      'https://i0.wp.com/malamal.com.bd/wp-content/uploads/2024/01/openart-image_nfp4GZgE_1771756212999_raw.webp?fit=768%2C768&ssl=1',
  },
  {
    name: 'Total',
    href: '/shop-by-brands',
    image:
      'https://malamal.com.bd/wp-content/uploads/2024/01/2023-04-27-644a14e018223.png',
  },
  {
    name: 'Winner',
    href: '/shop-by-brands',
    image:
      'https://malamal.com.bd/wp-content/uploads/2024/01/2023-04-27-644a14e018223.png',
  },
  {
    name: 'Rivcen',
    href: '/shop-by-brands',
    image:
      'https://malamal.com.bd/wp-content/uploads/2024/01/2023-04-27-644a0f82c3507.png',
  },
  {
    name: 'Sanford',
    href: '/shop-by-brands',
    image:
      'https://i0.wp.com/malamal.com.bd/wp-content/uploads/2024/01/sanford-23litre-vacuum-cleaner-bangladesh-bd.webp?fit=600%2C600&ssl=1',
  },
  {
    name: 'Packwell',
    href: '/shop-by-brands',
    image:
      'https://malamal.com.bd/wp-content/uploads/2025/01/fxc-auto-carton-box-taping-machine.webp',
  },
  {
    name: 'DCK',
    href: '/shop-by-brands',
    image:
      'https://malamal.com.bd/wp-content/uploads/2024/01/Untitled-design-17.png',
  },
  {
    name: 'WADFOW',
    href: '/shop-by-brands',
    image:
      'https://malamal.com.bd/wp-content/uploads/2024/01/2023-04-27-644a14216ada7.png',
  },
];

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
    href: 'tel:+8801972525821',
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

type CategoryShowcase = {
  title: string;
  slug: string;
  href: `/category/${string}`;
  description: string;
  accent: string;
};

export const categoryShowcase: CategoryShowcase[] = [
  {
    title: 'Cleaning & maintenance',
    slug: 'cleaning-maintenance',
    href: '/category/cleaning-maintenance',
    description:
      'Vacuum cleaners, washers, foggers, disinfection and maintenance gear.',
    accent: 'from-[#0e2f56] to-[#163f77]',
  },
  {
    title: 'Ladder',
    slug: 'ladder',
    href: '/category/ladder',
    description: 'Aluminium ladders, step ladders and working platforms.',
    accent: 'from-[#4d6b92] to-[#90a4c8]',
  },
  {
    title: 'Power tools',
    slug: 'power-tools',
    href: '/category/power-tools',
    description: 'Drills, saws, routers and workshop essentials.',
    accent: 'from-[#f15a24] to-[#f89c57]',
  },
  {
    title: 'Welding & cutting',
    slug: 'welding-cutting',
    href: '/category/welding-cutting',
    description: 'Welding machines, cutters and industrial workshop machines.',
    accent: 'from-[#5f2d1f] to-[#c56c47]',
  },
  {
    title: 'Commercial packaging',
    slug: 'commercial-packaging',
    href: '/category/commercial-packaging',
    description: 'Taping, sealing, batching and packaging machines.',
    accent: 'from-[#233647] to-[#5a7288]',
  },
  {
    title: 'Material handling',
    slug: 'material-handling',
    href: '/category/material-handling',
    description: 'Mini crane, hoist, mixer and load handling systems.',
    accent: 'from-[#3d5a48] to-[#80a27c]',
  },
];

export const categoryPages = (() => {
  const pages = new Map<string, (typeof topCategories)[number] | (typeof categoryShowcase)[number]>();

  for (const category of [...topCategories, ...categoryShowcase]) {
    if (!pages.has(category.slug)) {
      pages.set(category.slug, category);
    }
  }

  return Array.from(pages.values());
})();

export type CategoryPageEntry = (typeof categoryPages)[number];

export function findCategoryBySlug(slug: string) {
  return categoryPages.find(category => category.slug === slug);
}

export function findCategoryByName(name: string) {
  return categoryPages.find(category => ('name' in category ? category.name : category.title) === name);
}

export function getProductsByCategory(categoryName: string) {
  return allProducts.filter(product => product.category === categoryName);
}

export const supportStats = [
  { value: '24/7', label: 'Ordering support' },
  { value: '1000+', label: 'Products in stock' },
  { value: '64', label: 'District coverage' },
  { value: 'B2B', label: 'Project quotation' },
];

export const allProducts = [
  ...offerProducts,
  ...featuredProducts,
  ...latestProducts,
];

export function findProductBySku(sku: string) {
  return allProducts.find(product => product.sku === sku);
}
