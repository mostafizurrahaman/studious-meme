import Image from 'next/image';
import Link from 'next/link';

import {
  brands,
  categoryShowcase,
  featuredProducts,
  latestProducts,
  offerProducts,
  supportStats,
  topCategories,
} from '@/lib/malamal-content';

import { ProductCard } from '@/components/ProductCard';
import { SectionHeading } from '@/components/SectionHeading';

const heroSlides = [
  {
    title: 'Industrial tools for every project',
    description:
      'Dedicated categories for workshop, construction, cleaning and packaging equipment.',
    image:
      'https://malamal.com.bd/wp-content/uploads/2025/01/vacuum-packaging-sealer-machine-dz-400-pc.webp',
    href: '/shop',
  },
  {
    title: 'Reliable welding and cutting machines',
    description:
      'High-volume gear with a clean buying flow for the full catalog.',
    image:
      'https://malamal.com.bd/wp-content/uploads/2024/11/winner-welding-machine-pc.webp',
    href: '/shop',
  },
  {
    title: 'Garage tools and cleaning solutions',
    description:
      'Product discovery built like the reference site with a fast browsing experience.',
    image:
      'https://malamal.com.bd/wp-content/uploads/2024/11/garage-tools-and-equipment-pc.webp',
    href: '/shop',
  },
] as const;

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-center text-white backdrop-blur-sm">
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.24em] text-white/70">
        {label}
      </div>
    </div>
  );
}

function SectionMarquee() {
  const message =
    'Welcome to Malamal.com.bd. Thank you for staying with Malamal | Malamal এর পক্ষ থেকে সবাইকে জানাই স্বাগত ও শুভকামনা ।';

  return (
    <div className="overflow-hidden rounded-2xl border border-[#f15a24]/20 bg-white py-3 shadow-sm">
      <div className="animate-[marquee_28s_linear_infinite] whitespace-nowrap text-sm font-semibold text-[#f15a24]">
        <span className="inline-block px-6">{message}</span>
        <span className="inline-block px-6">{message}</span>
        <span className="inline-block px-6">{message}</span>
      </div>
    </div>
  );
}

export function HomePage() {
  return (
    <main className="flex-1 bg-[#f5f6f8] pb-16">
      <div className="w-full px-4 py-6">
        <section className="grid gap-4 lg:grid-cols-[290px_minmax(0,1fr)_290px]">
          <aside className="hidden overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm lg:block">
            <div className="bg-[#0e2f56] px-4 py-3 text-sm font-extrabold tracking-wide text-white">
              All Categories
            </div>
            <div className="border-b border-black/8 bg-[#f5f6f8] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-black/45">
              Browse by department
            </div>
            <div className="space-y-2.5 p-4">
              {topCategories.map(category => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/5 px-3 py-2 transition hover:border-[#f15a24]/30 hover:bg-[#fff8f4]"
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <div>
                    <div className="text-sm font-semibold text-black">
                      {category.name}
                    </div>
                    <div className="text-xs text-black/55">
                      {category.description}
                    </div>
                  </div>
                </Link>
              ))}
              <Link
                href="/main-categories"
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#f15a24]/30 px-3 py-2 text-sm font-semibold text-[#f15a24]"
              >
                See all categories &gt;&gt;
              </Link>
            </div>
          </aside>

          <div className="overflow-hidden rounded-3xl bg-[#0e2f56] shadow-sm">
            <div className="grid h-full gap-4 p-5 sm:p-6 lg:grid-cols-[1.22fr_0.78fr] lg:p-6">
              <div className="flex min-h-125 flex-col justify-between rounded-3xl bg-linear-to-br from-[#0e2f56] via-[#173f73] to-[#233647] p-6 text-white sm:p-8 lg:p-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/70">
                    Bangladesh&apos;s most reliable hardware store
                  </p>
                  <h1 className="mt-4 max-w-xl text-[34px] font-black leading-tight sm:text-[54px]">
                    Best Online Hardware Store in Bangladesh
                  </h1>
                  <p className="mt-4 max-w-lg text-[14px] leading-7 text-white/78 sm:text-base">
                    Buy tools, equipment and industrial supplies with fast
                    delivery, secure checkout and a storefront shaped for B2B
                    and B2C buying.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                      href="/shop"
                      className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-[#f15a24] px-6 text-sm font-bold text-white"
                    >
                      Shop Now
                    </Link>
                    <Link
                      href="/promotions"
                      className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 text-sm font-bold text-white"
                    >
                      View Promotions
                    </Link>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-4">
                  {supportStats.map(stat => (
                    <StatCard key={stat.label} {...stat} />
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {heroSlides.map((slide, index) => (
                  <Link
                    key={slide.title}
                    href={slide.href}
                    className="group relative min-h-38.5 cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-[#1a2740] p-4 text-white shadow-sm lg:min-h-40"
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      sizes="(max-width: 1024px) 33vw, 300px"
                      className="object-cover opacity-60 transition duration-300 group-hover:scale-105 group-hover:opacity-70"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-[#0e2f56]/96 via-[#0e2f56]/58 to-transparent" />
                    <div className="relative z-10 flex h-full flex-col justify-between">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
                        Featured {index + 1}
                      </div>
                      <div>
                        <h2 className="max-w-72 text-[17px] font-extrabold leading-6 lg:text-[17px]">
                          {slide.title}
                        </h2>
                        <p className="mt-2 max-w-80 text-[13px] leading-5 text-white/75">
                          {slide.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <aside className="hidden rounded-2xl border border-black/8 bg-white p-4 shadow-sm lg:block">
            <div className="text-sm font-extrabold tracking-wide text-[#0e2f56]">
              Why Malamal
            </div>
            <div className="mt-4 space-y-4 text-sm">
              <div>
                <div className="font-semibold text-black">
                  Fast delivery support
                </div>
                <div className="text-black/55">
                  Inside Dhaka and across Bangladesh.
                </div>
              </div>
              <div>
                <div className="font-semibold text-black">
                  Trusted payment options
                </div>
                <div className="text-black/55">
                  Cash, cards, bank and mobile payment.
                </div>
              </div>
              <div>
                <div className="font-semibold text-black">
                  B2B quotation ready
                </div>
                <div className="text-black/55">
                  Project purchases are handled through quotation.
                </div>
              </div>
            </div>
          </aside>
        </section>

        <div className="mt-4">
          <SectionMarquee />
        </div>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            'FASTEST DELIVERY POSSIBLE',
            'SECURE PAYMENT SYSTEM',
            'CASH ON DELIVERY',
            'AUTHENTICITY GUARANTEED',
          ].map(item => (
            <div
              key={item}
              className="rounded-2xl bg-white p-4 text-center shadow-sm"
            >
              <div className="text-[11px] font-extrabold tracking-[0.24em] text-[#0e2f56]">
                {item}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-3xl bg-white p-5 shadow-sm sm:p-6">
          <SectionHeading title="The Best Offers" actionHref="/shop" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {offerProducts.map(product => (
              <ProductCard key={product.sku} product={product} />
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl bg-white p-5 shadow-sm sm:p-6">
          <SectionHeading title="Featured products" actionHref="/shop" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {featuredProducts.map(product => (
              <ProductCard key={product.sku} product={product} />
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl bg-white p-5 shadow-sm sm:p-6">
          <SectionHeading title="Latest Products" actionHref="/shop" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {latestProducts.map(product => (
              <ProductCard key={product.sku} product={product} />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categoryShowcase.map(card => (
            <Link
              key={card.title}
              href={card.href}
              className={`group cursor-pointer rounded-3xl bg-linear-to-br ${card.accent} p-6 text-white shadow-sm`}
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/70">
                Category spotlight
              </div>
              <h3 className="mt-6 text-[26px] font-black leading-tight">
                {card.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-white/80">
                {card.description}
              </p>
              <div className="mt-8 inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition group-hover:bg-white/20">
                Explore category
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-8 rounded-3xl bg-white p-5 shadow-sm sm:p-6">
          <SectionHeading title="Shop By Brands" actionHref="/shop-by-brands" />
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {brands.map(brand => (
              <Link
                key={brand.name}
                href={brand.href}
                className="rounded-2xl border border-black/10 px-4 py-5 text-center text-sm font-bold text-black transition hover:border-[#f15a24]/30 hover:bg-[#fff8f4] cursor-pointer"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-contain p-2"
                  />
                </div>
                <div className="mt-3">{brand.name}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 rounded-3xl bg-[#0e2f56] p-6 text-white shadow-sm lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/65">
              Built for the storefront workflow
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
              Catalog, cart and checkout flows are all covered here.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78 sm:text-base">
              The structure mirrors the storefront and keeps product, cart and
              checkout sections aligned for the full shopping experience.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['SEO content', 'Built for content-rich catalog pages'],
              ['Product grids', 'Structured for live data'],
              ['Navigation', 'Matches the existing shop flow'],
              ['Performance', 'Minimal client-side code'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl bg-white/10 p-4">
                <div className="font-semibold">{title}</div>
                <div className="mt-1 text-sm text-white/75">{text}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-[#0e2f56] sm:text-2xl">
            Malamal.com.bd hardware store overview
          </h2>
          <div className="mt-5 grid gap-6 text-sm leading-7 text-black/70 lg:grid-cols-2">
            <div className="space-y-4">
              <p>
                Malamal.com.bd is positioned as a trusted online hardware and
                industrial supply store in Bangladesh, serving workshop,
                maintenance and project buyers with a broad catalog.
              </p>
              <p>
                This frontend keeps the storefront hierarchy, brand focus and
                product merchandising style while staying easy to connect to
                live data.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                Product grids, account areas and quotation forms are laid out so
                the site can connect to live data without changing the
                structure.
              </p>
              <p>
                The current build intentionally keeps the homepage mostly
                server-rendered and lightweight for fast initial load.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
