'use client';

import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Product } from '@/lib/storefront-types';
import { useWishlistStore } from '@/lib/wishlist-store';
import { removeWishlistItem } from '@/services/WishlistHistory';

type Props = {
    suggestions: Product[];
    savedProducts: Product[];
};

export function WishlistPageClient({ suggestions, savedProducts }: Props) {
    const items = useWishlistStore(state => state.items);
    const hydrated = useWishlistStore(state => state.hydrated);
    const remove = useWishlistStore(state => state.remove);
    const accountProducts = savedProducts.length > 0 ? savedProducts : [];
    const products = hydrated && items.length > 0 ? items : accountProducts.length > 0 ? accountProducts : suggestions;

    return (
        <>
            <Card className="p-6 shadow-sm sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Saved items</p>
                <h1 className="mt-4 text-3xl font-black text-secondary sm:text-4xl">Wishlist</h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/65 sm:text-base">
                    {hydrated && items.length > 0
                        ? `${items.length} saved product${items.length === 1 ? '' : 's'} from this browser.`
                        : accountProducts.length > 0
                          ? `${accountProducts.length} saved product${accountProducts.length === 1 ? '' : 's'} from your account.`
                          : 'Save products from product pages; logged-in wishlist activity is stored in the backend.'}
                </p>
            </Card>

            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {products.map(product => (
                    <div key={product.sku} className="space-y-2">
                        <ProductCard product={product} />
                        {hydrated && items.some(item => item.sku === product.sku) ? (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    remove(product.sku);
                                    if (product.id) {
                                        void removeWishlistItem(product.id);
                                    }
                                }}
                                className="h-9 w-full rounded-full border-border text-xs font-semibold text-foreground/70"
                            >
                                Remove from wishlist
                            </Button>
                        ) : null}
                    </div>
                ))}
            </section>
        </>
    );
}
