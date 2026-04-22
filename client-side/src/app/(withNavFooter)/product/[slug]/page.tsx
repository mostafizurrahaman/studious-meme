import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProductCard } from '@/components/ProductCard';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { AddToWishlistButton } from '@/components/wishlist/AddToWishlistButton';
import { SeoScripts } from '@/components/SeoScripts';
import { buildProductMetadata, buildProductSchemas } from '@/lib/seo';
import { getActiveProductBySlug, getAllActiveProducts, getAllProducts, mapBackendProductToStorefrontProduct } from '@/services/Product';

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const productsResult = await getAllActiveProducts({ limit: 10000 }).catch(() => null);

  return Array.isArray(productsResult?.data)
    ? productsResult.data
        .map(product => product.slug)
        .filter((slug): slug is string => Boolean(slug))
        .map(slug => ({ slug }))
    : [];
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const productResult = await getActiveProductBySlug(slug).catch(() => null);
  const backendProduct = productResult?.data;
  const product = backendProduct ? await mapBackendProductToStorefrontProduct(backendProduct) : null;

  if (!product) {
    return {
      title: 'Product not found',
      robots: { index: false, follow: false },
    };
  }

  return buildProductMetadata(product);
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const productResult = await getActiveProductBySlug(slug).catch(() => null);
  const backendProduct = productResult?.data;
  const product = backendProduct ? await mapBackendProductToStorefrontProduct(backendProduct) : null;

  if (!product) notFound();

  const productsResult = await getAllProducts({
    limit: 4,
    category: product.category,
    excludeSlug: product.slug,
  }).catch(() => null);
  const related = productsResult?.data?.length
    ? await Promise.all(productsResult.data.map(mapBackendProductToStorefrontProduct))
    : [];
  const gallery = [product.image];

  return (
    <>
      <SeoScripts data={buildProductSchemas(product)} />
      <main className="flex-1 bg-background pb-16">
        <div className="mx-auto w-full max-w-310 px-4 py-6 lg:px-0">
          <nav className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground/45">
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
            <Card className="p-4 shadow-sm sm:p-6">
              <div className="grid gap-4 lg:grid-cols-[92px_minmax(0,1fr)]">
                <div className="order-2 grid grid-cols-4 gap-3 lg:order-1 lg:grid-cols-1">
                  {gallery.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted"
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
                  <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover"
                    />
                    {product.badge ? (
                      <Badge className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold shadow-sm">
                        {product.badge}
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                Product details
              </p>
              <h1 className="mt-4 text-[28px] font-black leading-tight text-secondary sm:text-[34px]">
                {product.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-foreground/60">
                {[`Brand: ${product.brand}`, `SKU: ${product.sku}`, product.stock].map(item => (
                    <span
                      key={item}
                      className="rounded-full bg-muted px-3 py-1 font-semibold text-foreground/70"
                    >
                      {item}
                    </span>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-2 text-sm text-foreground/60">
                <div className="text-primary">★★★★★</div>
                <span>Rated {product.rating}/5</span>
                <span className="mx-1 h-1 w-1 rounded-full bg-foreground/25" />
                <span>Verified store listing</span>
              </div>

              <Card className="mt-6 border-border bg-muted p-5">
                <div className="flex items-end gap-3">
                  <div className="text-4xl font-black text-primary">{product.price}</div>
                  {product.oldPrice ? (
                    <div className="pb-1 text-lg text-foreground/40 line-through">{product.oldPrice}</div>
                  ) : null}
                </div>
              </Card>

              <Card className="mt-5 grid gap-3 border-0 bg-secondary p-4 text-sm text-secondary-foreground sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 px-4 py-3">Immediate order support</div>
                <div className="rounded-2xl bg-white/10 px-4 py-3">Bulk quotation available</div>
              </Card>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <AddToCartButton product={product} />
                <AddToWishlistButton product={product} />
              </div>

              <Card className="mt-6 grid gap-3 border-0 bg-secondary p-4 text-sm text-secondary-foreground sm:grid-cols-3">
                {[
                  ['Delivery', 'Across Bangladesh'],
                  ['Support', 'Dedicated sales team'],
                  ['Quotation', 'Bulk order ready'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-white/10 px-4 py-3">
                    <div className="text-xs uppercase tracking-[0.22em] text-secondary-foreground/65">
                      {label}
                    </div>
                    <div className="mt-1 font-semibold text-secondary-foreground">{value}</div>
                  </div>
                ))}
              </Card>
            </Card>
          </section>

          <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_300px]">
            <Card className="p-6 shadow-sm">
              <div className="flex flex-wrap gap-2 text-sm font-semibold">
                {['Description', 'Specifications', 'Reviews'].map(tab => (
                  <span key={tab} className="rounded-full bg-muted px-4 py-2 text-foreground/70">
                    {tab}
                  </span>
                ))}
              </div>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div>
                  <h2 className="text-xl font-black text-secondary">Description</h2>
                  <p className="mt-3 text-sm leading-7 text-foreground/65">
                    No backend product description is available for this item yet.
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-black text-secondary">Specifications</h2>
                  <div className="mt-4 overflow-hidden rounded-2xl border border-border">
                    {[
                      ['Brand', product.brand],
                      ['SKU', product.sku],
                      ['Availability', product.stock],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="grid grid-cols-[180px_1fr] border-b border-border last:border-b-0"
                      >
                        <div className="bg-muted px-4 py-3 font-semibold text-secondary">{label}</div>
                        <div className="px-4 py-3 text-foreground/65">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-0 bg-secondary p-6 text-secondary-foreground shadow-sm">
              <h2 className="text-xl font-black">Need bulk pricing?</h2>
              <p className="mt-3 text-sm leading-7 text-secondary-foreground/78">
                Send your quantity and delivery location to receive a quotation for project or retail
                purchase.
              </p>
              <Button
                asChild
                className="mt-6 h-11 rounded-full bg-white px-6 text-sm font-bold text-secondary hover:bg-white/90"
              >
                <Link href="/quotation-request">Request quotation</Link>
              </Button>
              <div className="mt-6 space-y-3 text-sm text-secondary-foreground/80">
                <div className="rounded-2xl bg-white/10 px-4 py-3">Bulk order support</div>
                <div className="rounded-2xl bg-white/10 px-4 py-3">Corporate procurement</div>
                <div className="rounded-2xl bg-white/10 px-4 py-3">Delivery coordination</div>
              </div>
            </Card>
          </section>

          <Card className="mt-10 p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-black text-secondary">Related products</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {related.map(item => (
                <ProductCard key={item.sku} product={item} />
              ))}
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
