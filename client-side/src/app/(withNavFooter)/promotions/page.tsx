import { ProductCard } from '@/components/ProductCard';
import { SeoScripts } from '@/components/SeoScripts';
import { Card, CardContent } from '@/components/ui/card';
import { offerProducts } from '@/lib/malamal-content';
import { buildPromotionsSchemas, promotionsMetadata } from '@/lib/seo';
import { getAllProducts, mapBackendProductToStorefrontProduct } from '@/services/Product';

export const metadata = promotionsMetadata;
export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ page?: string; limit?: string }>;
};

const DEFAULT_PROMOTIONS_LIMIT = 24;

export default async function PromotionsPage({ searchParams }: Props) {
  const query = await searchParams;
  const page = Math.max(Number(query.page ?? '1') || 1, 1);
  const limit = Math.max(
    Number(query.limit ?? String(DEFAULT_PROMOTIONS_LIMIT)) || DEFAULT_PROMOTIONS_LIMIT,
    1,
  );
  const productsResult = await getAllProducts({ page, limit, tag: 'sale' }).catch(() => null);
  const products = productsResult?.data?.length
    ? await Promise.all(productsResult.data.map(mapBackendProductToStorefrontProduct))
    : offerProducts;
  const totalPages = productsResult?.meta?.totalPages ?? 1;

  return (
    <>
      <SeoScripts data={buildPromotionsSchemas(products)} />
      <main className="flex-1 bg-background pb-16">
        <div className="mx-auto w-full max-w-350 px-4 py-6 lg:px-6">
          <Card className="border-0 bg-linear-to-r from-primary to-secondary p-6 text-white shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              Campaigns and offers
            </p>
            <h1 className="mt-4 text-3xl font-black sm:text-4xl">Promotions / Campaigns</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/82 sm:text-base">
              Promotional layout with product cards and campaign copy for the current storefront.
            </p>
          </Card>

          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ['Seasonal sale', 'Limited-time hardware bundles and discounts.'],
              ['Bulk quotes', 'Best for projects, workshops and procurement.'],
              ['Featured deals', 'Curated top selling industrial items.'],
              ['New arrivals', 'Fresh stock from trusted brands.'],
            ].map(([title, text]) => (
              <Card key={title} className="p-5 shadow-sm">
                <div className="text-lg font-extrabold text-secondary">{title}</div>
                <p className="mt-2 text-sm leading-7 text-foreground/65">{text}</p>
              </Card>
            ))}
          </section>

          <Card className="mt-10 p-5 shadow-sm sm:p-6">
            <CardContent className="p-0">
              <h2 className="text-xl font-black text-secondary">The Best Offers</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {products.map(product => (
                  <ProductCard key={product.sku} product={product} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 flex flex-wrap items-center justify-between gap-3 p-4 text-sm shadow-sm">
            <span className="text-foreground/60">
              Page {productsResult?.meta?.page ?? page} of {totalPages}
            </span>
            <div className="flex gap-2">
              {page > 1 ? (
                <a
                  href={`/promotions?page=${page - 1}`}
                  className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground/70"
                >
                  Prev
                </a>
              ) : null}
              {page < totalPages ? (
                <a
                  href={`/promotions?page=${page + 1}`}
                  className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground/70"
                >
                  Next
                </a>
              ) : null}
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
