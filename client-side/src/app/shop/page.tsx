import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { SeoScripts } from '@/components/SeoScripts';
import {
  featuredProducts,
  latestProducts,
  topCategories,
} from '@/lib/malamal-content';
import { shopMetadata, shopSchemas } from '@/lib/seo';

export const metadata = shopMetadata;

export default function ShopPage() {
  const products = [...featuredProducts, ...latestProducts];

  return (
    <>
      <SeoScripts data={shopSchemas} />
      <main className="flex-1 bg-[#f5f6f8] pb-16">
        <div className="mx-auto w-full max-w-350 px-4 py-6 lg:px-6">
          <section className="rounded-3xl bg-[#0e2f56] p-6 text-white shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/65">
              Product catalog
            </p>
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-black sm:text-4xl">Shop</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/78 sm:text-base">
                  Browse the storefront catalog with filters, categories and
                  product cards across the full hardware range.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
                {[
                  ['1200+', 'Products'],
                  ['30+', 'Brands'],
                  ['24h', 'Support'],
                  ['B2B', 'Quotation'],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl bg-white/10 px-4 py-3"
                  >
                    <div className="text-lg font-extrabold">{value}</div>
                    <div className="text-[11px] uppercase tracking-[0.24em] text-white/65">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
            <aside className="hidden rounded-3xl bg-white p-5 shadow-sm lg:block">
              <h2 className="text-sm font-extrabold text-[#0e2f56]">Filters</h2>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <div className="font-semibold text-black">Category</div>
                  <div className="mt-2 grid gap-2 text-black/65">
                    {topCategories.map(category => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="hover:text-primary"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-black">Stock status</div>
                  <div className="mt-2 grid gap-2 text-black/65">
                    <span>In stock</span>
                    <span>Featured</span>
                    <span>On sale</span>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-black">Price range</div>
                  <div className="mt-2 text-black/65">
                    Tk. 500 - Tk. 120,000
                  </div>
                </div>
              </div>
            </aside>

            <div className="space-y-4">
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="text-sm text-black/65">
                    Showing {products.length} products in this catalog view
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    {[
                      'All',
                      'Sale',
                      'Featured',
                      'Latest',
                      'Industrial',
                      'Home',
                    ].map(tag => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#f5f6f8] px-3 py-2 text-black/75"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {products.map(product => (
                  <ProductCard key={product.sku} product={product} />
                ))}
              </div>

              <div className="flex items-center justify-between rounded-3xl bg-white p-4 text-sm shadow-sm">
                <span className="text-black/60">Page 1 of 8</span>
                <div className="flex gap-2">
                  <span className="rounded-full bg-[#0e2f56] px-4 py-2 font-semibold text-white">
                    1
                  </span>
                  <span className="rounded-full bg-[#f5f6f8] px-4 py-2 font-semibold text-black/70">
                    2
                  </span>
                  <span className="rounded-full bg-[#f5f6f8] px-4 py-2 font-semibold text-black/70">
                    3
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
