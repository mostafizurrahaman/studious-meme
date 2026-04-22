import { SeoScripts } from '@/components/SeoScripts';
import { WishlistPageClient } from '@/components/WishlistPageClient';
import { wishlistMetadata, wishlistSchemas } from '@/lib/seo';
import { getAllActiveProducts, mapBackendProductToStorefrontProduct } from '@/services/Product';
import type { BackendProduct } from '@/services/Product';
import { getMyWishlist } from '@/services/WishlistHistory';

export const metadata = wishlistMetadata;
export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const [productsResult, wishlistResult] = await Promise.all([
    getAllActiveProducts({ limit: 12 }).catch(() => null),
    getMyWishlist().catch(() => null),
  ]);
  const suggestions = productsResult?.data?.length
    ? await Promise.all(productsResult.data.map(mapBackendProductToStorefrontProduct))
    : [];
  const savedProducts = Array.isArray(wishlistResult?.data)
    ? (
        await Promise.all(
          wishlistResult.data.map(record => {
            const product = record.product as BackendProduct | undefined;
            return product?.title ? mapBackendProductToStorefrontProduct(product) : null;
          }),
        )
      ).filter(product => product !== null)
    : [];

  return (
    <>
      <SeoScripts data={wishlistSchemas} />
      <main className="flex-1 bg-background pb-16">
        <div className="mx-auto w-full max-w-350 px-4 py-6 lg:px-6">
          <WishlistPageClient suggestions={suggestions} savedProducts={savedProducts} />
        </div>
      </main>
    </>
  );
}
