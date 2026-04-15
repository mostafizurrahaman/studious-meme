import { ProductCard } from '@/components/ProductCard';
import { latestProducts } from '@/lib/malamal-content';
import { wishlistMetadata } from '@/lib/seo';
import { Card } from '@/components/ui/card';

export const metadata = wishlistMetadata;

export default function WishlistPage() {
  return (
    <main className="flex-1 bg-background pb-16">
      <div className="mx-auto w-full max-w-350 px-4 py-6 lg:px-6">
        <Card className="p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Saved items
          </p>
          <h1 className="mt-4 text-3xl font-black text-secondary sm:text-4xl">
            Wishlist
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/65 sm:text-base">
            Wishlist layout with sample saved products for the storefront
            account flow.
          </p>
        </Card>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {latestProducts.map(product => (
            <ProductCard key={product.sku} product={product} />
          ))}
        </section>
      </div>
    </main>
  );
}
