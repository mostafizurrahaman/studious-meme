import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { allProducts, findProductBySku } from '@/lib/malamal-content';
import { SeoScripts } from '@/components/SeoScripts';
import { buildProductMetadata, buildProductSchemas } from '@/lib/seo';

type Props = {
  params: Promise<{ sku: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { sku } = await params;
  const product = findProductBySku(sku);

  if (!product) {
    return {
      title: 'Product not found',
      robots: { index: false, follow: false },
    };
  }

  return buildProductMetadata(product);
}

export function generateStaticParams() {
  return Array.from(
    new Map(allProducts.map(product => [product.sku, product])).values(),
  ).map(product => ({
    sku: product.sku,
  }));
}

export default async function ProductPage({ params }: Props) {
  const { sku } = await params;
  const product = findProductBySku(sku);

  if (!product) {
    notFound();
  }

  const related = allProducts
    .filter(item => item.sku !== product.sku)
    .slice(0, 4);
  const gallery = [product.image, ...related.map(item => item.image)].slice(
    0,
    4,
  );

  return (
    <>
      <SeoScripts data={buildProductSchemas(product)} />
      <main className="flex-1 bg-[#f5f6f8] pb-16">
        <div className="mx-auto w-full max-w-310 px-4 py-6 lg:px-0">
          <nav className="text-xs font-semibold uppercase tracking-[0.24em] text-black/45">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>{' '}
            /{' '}
            <Link href="/shop" className="hover:text-primary">
              Shop
            </Link>{' '}
            / {product.title}
          </nav>

          <section className="mt-4 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
              <div className="grid gap-4 lg:grid-cols-[92px_minmax(0,1fr)]">
                <div className="order-2 grid grid-cols-4 gap-3 lg:order-1 lg:grid-cols-1">
                  {gallery.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="relative aspect-square overflow-hidden rounded-2xl border border-black/8 bg-[#f5f6f8]"
                    >
                      <Image
                        src={image}
                        alt={`${product.title} thumbnail ${index + 1}`}
                        fill
                        sizes="92px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="order-1 lg:order-2">
                  <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#f5f6f8]">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover"
                    />
                    {product.badge ? (
                      <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-sm">
                        {product.badge}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                Product details
              </p>
              <h1 className="mt-4 text-[28px] font-black leading-tight text-[#0e2f56] sm:text-[34px]">
                {product.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-black/60">
                <span className="rounded-full bg-[#f5f6f8] px-3 py-1 font-semibold text-black/70">
                  Brand: {product.brand}
                </span>
                <span className="rounded-full bg-[#f5f6f8] px-3 py-1 font-semibold text-black/70">
                  SKU: {product.sku}
                </span>
                <span className="rounded-full bg-[#f5f6f8] px-3 py-1 font-semibold text-black/70">
                  {product.stock}
                </span>
                <span className="rounded-full bg-[#f5f6f8] px-3 py-1 font-semibold text-black/70">
                  Free consultation
                </span>
              </div>

              <div className="mt-5 flex items-center gap-2 text-sm text-black/60">
                <div className="text-primary">★★★★★</div>
                <span>Rated {product.rating}/5</span>
                <span className="mx-1 h-1 w-1 rounded-full bg-black/25" />
                <span>Verified store listing</span>
              </div>

              <div className="mt-6 rounded-3xl border border-black/8 bg-[#f5f6f8] p-5">
                <div className="flex items-end gap-3">
                  <div className="text-4xl font-black text-primary">
                    {product.price}
                  </div>
                  {product.oldPrice ? (
                    <div className="pb-1 text-lg text-black/40 line-through">
                      {product.oldPrice}
                    </div>
                  ) : null}
                </div>
                <div className="mt-2 text-sm text-black/55">
                  Price includes standard store margin and catalog discount.
                </div>
              </div>

              <p className="mt-5 text-[13px] leading-7 text-black/65">
                Built for workshop buyers and procurement teams, this product
                detail view keeps the same buying rhythm used across the
                storefront.
              </p>

              <div className="mt-5 grid gap-3 rounded-3xl bg-[#0e2f56] p-4 text-sm text-white sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 px-4 py-3">
                  Immediate order support
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-3">
                  Bulk quotation available
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <AddToCartButton product={product} />
                <Button
                  type="button"
                  className="h-12 rounded-full border border-[#0e2f56]/15 bg-[#0e2f56] px-6 text-sm font-bold text-white shadow-sm hover:bg-[#0e2f56]/90"
                >
                  Add to wishlist
                </Button>
              </div>

              <div className="mt-6 grid gap-3 rounded-3xl bg-[#0e2f56] p-4 text-sm text-white sm:grid-cols-3">
                {[
                  ['Delivery', 'Across Bangladesh'],
                  ['Support', 'Dedicated sales team'],
                  ['Quotation', 'Bulk order ready'],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl bg-white/10 px-4 py-3"
                  >
                    <div className="text-xs uppercase tracking-[0.22em] text-white/65">
                      {label}
                    </div>
                    <div className="mt-1 font-semibold text-white">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_300px]">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex flex-wrap gap-2 text-sm font-semibold">
                {['Description', 'Specifications', 'Reviews'].map(tab => (
                  <span
                    key={tab}
                    className="rounded-full bg-[#f5f6f8] px-4 py-2 text-black/70"
                  >
                    {tab}
                  </span>
                ))}
              </div>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div>
                  <h2 className="text-xl font-black text-[#0e2f56]">
                    Description
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-black/65">
                    {product.title} is displayed here with store-ready details,
                    product benefits and a clean purchase path for buyers.
                  </p>
                  <p className="mt-3 text-sm leading-7 text-black/65">
                    The layout is designed to feel familiar to Malamal shoppers,
                    with the main focus on product image, price, stock and
                    action buttons.
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#0e2f56]">
                    Specifications
                  </h2>
                  <div className="mt-4 overflow-hidden rounded-2xl border border-black/8">
                    {[
                      ['Brand', product.brand],
                      ['SKU', product.sku],
                      ['Availability', product.stock],
                      ['Condition', 'Brand new'],
                      ['Warranty', 'As per manufacturer policy'],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="grid grid-cols-[180px_1fr] border-b border-black/8 last:border-b-0"
                      >
                        <div className="bg-[#f5f6f8] px-4 py-3 font-semibold text-[#0e2f56]">
                          {label}
                        </div>
                        <div className="px-4 py-3 text-black/65">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 rounded-3xl bg-[#f5f6f8] p-5 text-sm leading-7 text-black/65">
                <p>
                  This product page mirrors a shop-first layout with the
                  gallery, price block, description, and specification table
                  arranged for quick buyer decisions.
                </p>
              </div>
            </div>
            <aside className="rounded-3xl bg-[#0e2f56] p-6 text-white shadow-sm">
              <h2 className="text-xl font-black">Need bulk pricing?</h2>
              <p className="mt-3 text-sm leading-7 text-white/78">
                Send your quantity and delivery location to receive a quotation
                for project or retail purchase.
              </p>
              <Button
                asChild
                className="mt-6 h-11 rounded-full bg-white px-6 text-sm font-bold text-[#0e2f56] hover:bg-white/90"
              >
                <Link href="/quotation-request">Request quotation</Link>
              </Button>
              <div className="mt-6 space-y-3 text-sm text-white/80">
                <div className="rounded-2xl bg-white/10 px-4 py-3">
                  Bulk order support
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-3">
                  Corporate procurement
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-3">
                  Delivery coordination
                </div>
              </div>
            </aside>
          </section>

          <section className="mt-10 rounded-3xl bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-black text-[#0e2f56]">
              Related products
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {related.map(item => (
                <ProductCard key={item.sku} product={item} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
