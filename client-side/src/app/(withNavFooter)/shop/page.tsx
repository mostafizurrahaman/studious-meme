import { Card, CardHeader } from '@/components/ui/card';
import { SeoScripts } from '@/components/SeoScripts';
import { ShopPageClient } from '@/components/ShopPageClient';
import { featuredProducts, latestProducts, topCategories } from '@/lib/malamal-content';
import { buildShopSchemas, shopMetadata } from '@/lib/seo';
import { getAllCategoriesWithTotalNewsCount } from '@/services/Category';
import { mapBackendCategoryToStorefrontCategory, type BackendCategory } from '@/services/Category/mappers';
import { getAllProducts, mapBackendProductToStorefrontProduct } from '@/services/Product';

export const metadata = shopMetadata;
export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const [productsResult, categoriesResult] = await Promise.all([
    getAllProducts({ limit: 1000 }).catch(() => null),
    getAllCategoriesWithTotalNewsCount().catch(() => null),
  ]);

  const products = productsResult?.data?.length
    ? await Promise.all(productsResult.data.map(mapBackendProductToStorefrontProduct))
    : [...featuredProducts, ...latestProducts];
  const backendCategories = Array.isArray(categoriesResult?.data)
    ? categoriesResult.data.map(item => mapBackendCategoryToStorefrontCategory(item as BackendCategory))
    : topCategories;

  return (
    <>
      <SeoScripts data={buildShopSchemas(products, backendCategories)} />
      <main className="flex-1 bg-background pb-16">
        <div className="mx-auto w-full max-w-350 px-4 py-6 lg:px-6">
          <Card className="border-0 bg-secondary text-secondary-foreground shadow-sm">
            <CardHeader className="p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary-foreground/65">
                Product catalog
              </p>
              <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="text-3xl font-black sm:text-4xl">Shop</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/78 sm:text-base">
                    Browse the storefront catalog with filters, categories and product cards across the full
                    hardware range.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
                  {[
                    ['1200+', 'Products'],
                    ['30+', 'Brands'],
                    ['24h', 'Support'],
                    ['B2B', 'Quotation'],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-2xl bg-white/10 px-4 py-3">
                      <div className="text-lg font-extrabold">{value}</div>
                      <div className="text-[11px] uppercase tracking-[0.24em] text-secondary-foreground/65">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardHeader>
          </Card>

          <ShopPageClient products={products} categories={backendCategories} />
        </div>
      </main>
    </>
  );
}
