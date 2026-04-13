import { ProductCard } from '@/components/ProductCard';
import { latestProducts } from '@/lib/malamal-content';
import { wishlistMetadata } from '@/lib/seo';

export const metadata = wishlistMetadata;

export default function WishlistPage() {
  return (
    <main className="flex-1 bg-[#f5f6f8] pb-16">
      <div className="mx-auto w-full max-w-350 px-4 py-6 lg:px-6">
        <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Saved items
          </p>
          <h1 className="mt-4 text-3xl font-black text-[#0e2f56] sm:text-4xl">
            Wishlist
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-black/65 sm:text-base">
            Wishlist layout with sample saved products for the storefront
            account flow.
          </p>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {latestProducts.map(product => (
            <ProductCard key={product.sku} product={product} />
          ))}
        </section>
      </div>
    </main>
  );
}
