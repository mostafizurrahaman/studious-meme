import { SeoScripts } from '@/components/SeoScripts';
import { WishlistPageClient } from '@/components/WishlistPageClient';
import { wishlistMetadata, wishlistSchemas } from '@/lib/seo';
import { getAllProducts, mapBackendProductToStorefrontProduct } from '@/services/Product';

export const metadata = wishlistMetadata;
export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const productsResult = await getAllProducts({ limit: 12 }).catch(() => null);
  const products = productsResult?.data?.length
    ? await Promise.all(productsResult.data.map(mapBackendProductToStorefrontProduct))
    : [];

  return (
    <>
      <SeoScripts data={wishlistSchemas} />
      <main className="flex-1 bg-background pb-16">
        <div className="mx-auto w-full max-w-350 px-4 py-6 lg:px-6">
          <WishlistPageClient suggestions={products} />
        </div>
      </main>
    </>
  );
}
