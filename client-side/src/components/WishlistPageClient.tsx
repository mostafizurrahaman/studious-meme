'use client';

import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Product } from '@/lib/malamal-content';
import { useWishlistStore } from '@/lib/wishlist-store';

type Props = {
    suggestions: Product[];
};

export function WishlistPageClient({ suggestions }: Props) {
    const items = useWishlistStore(state => state.items);
    const hydrated = useWishlistStore(state => state.hydrated);
    const remove = useWishlistStore(state => state.remove);
    const products = hydrated && items.length > 0 ? items : suggestions;

    return (
        <>
            <Card className="p-6 shadow-sm sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                    Saved items
                </p>
                <h1 className="mt-4 text-3xl font-black text-secondary sm:text-4xl">Wishlist</h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/65 sm:text-base">
                    {hydrated && items.length > 0
                        ? `${items.length} saved product${items.length === 1 ? '' : 's'} from this browser.`
                        : 'Save products from product pages; meanwhile, browse backend catalog suggestions.'}
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
                                onClick={() => remove(product.sku)}
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
