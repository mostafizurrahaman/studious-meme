import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';
import { SeoScripts } from '@/components/SeoScripts';
import { buildProductMetadata, buildProductSchemas } from '@/lib/seo';
import {
  getActiveProductBySlug,
  getAllActiveProducts,
  getAllActiveProductsAcrossPages,
  mapBackendProductToStorefrontProduct,
} from '@/services/Product';

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const productsResult = await getAllActiveProductsAcrossPages({
    limit: 10000,
  }).catch(() => null);

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

  const productsResult = await getAllActiveProducts({
    limit: 5,
    category: product.category,
    excludeSlug: product.slug,
  }).catch(() => null);
  const related = productsResult?.data?.length
    ? await Promise.all(productsResult.data.map(mapBackendProductToStorefrontProduct))
    : [];

  return (
    <>
      <SeoScripts data={buildProductSchemas(product)} />
      <main className="flex-1 bg-muted/40 pb-16">
        <div className="mx-auto w-full max-w-310 px-3 py-3 sm:px-4 sm:py-5 lg:px-0">
          <nav className="overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium text-foreground/55">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>{' '}
            /{' '}
            <Link href="/shop" className="hover:text-primary">
              Shop
            </Link>{' '}
            / {product.title}
          </nav>

          <div className="mt-3 rounded-md bg-background p-3 shadow-sm sm:p-4">
            <ProductDetailClient product={product} />
          </div>

          <section className="mt-8">
            <h2 className="text-2xl font-bold text-secondary">Related Products</h2>
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5 xl:gap-4">
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
