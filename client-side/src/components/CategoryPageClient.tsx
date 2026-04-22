'use client';

import { type Route } from 'next';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getCategoryAccentClassName, getCategoryAccentStyle } from '@/lib/category-accent';
import type { CategoryPageEntry, Product } from '@/lib/malamal-content';

type Props = {
    category: CategoryPageEntry;
    products: Product[];
    brands: string[];
    meta: {
        total: number;
        limit: number;
        currentPage: number;
        totalPages: number;
    };
};

function parseGroupValues(value: string | null) {
    return (value ?? '')
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
}

export function CategoryPageClient({ category, products, brands, meta }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const title = 'name' in category ? category.name : category.title;
    const activeBrands = parseGroupValues(searchParams.get('b'));
    const activeStock = searchParams.get('s') ?? '';
    const activePrice = searchParams.get('p') ?? '';
    const totalPages = Math.max(meta.totalPages, 1);
    const page = Math.min(meta.currentPage, totalPages);
    const activeCount = activeBrands.length + [activeStock, activePrice].filter(Boolean).length;

    function updateParam(key: string, value: string) {
        const params = new URLSearchParams(searchParams.toString());

        if (value) params.set(key, value);
        else params.delete(key);

        params.delete('page');
        router.replace((params.toString() ? `${pathname}?${params.toString()}` : pathname) as Route, {
            scroll: false,
        });
    }

    function updatePage(nextPage: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(nextPage));
        router.replace(`${pathname}?${params.toString()}` as Route, { scroll: false });
    }

    return (
        <>
            <section
                className={`rounded-3xl p-6 text-white shadow-sm sm:p-8 ${getCategoryAccentClassName(category.accent)}`}
                style={getCategoryAccentStyle(category.accent)}
            >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/65">
                    Category page
                </p>
                <h1 className="mt-4 text-3xl font-black sm:text-4xl">{title}</h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/78 sm:text-base">
                    {category.description}
                </p>
            </section>

            <Card className="mt-6 flex flex-wrap items-center justify-between gap-3 p-4 text-sm shadow-sm">
                <span className="text-foreground/60">
                    Showing {products.length} of {meta.total} products
                </span>
                {activeCount > 0 ? (
                    <Button
                        type="button"
                        onClick={() => router.replace(pathname as Route, { scroll: false })}
                        className="h-auto cursor-pointer rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
                    >
                        Clear all
                    </Button>
                ) : (
                    <span className="font-semibold text-primary">All items</span>
                )}
            </Card>

            <Card className="mt-6 p-4 shadow-sm">
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    {[
                        ['s', 'in-stock', 'In stock', activeStock],
                        ['p', 'under-10000', 'Under Tk. 10k', activePrice],
                        ['p', '10000-50000', 'Tk. 10k-50k', activePrice],
                        ['p', '50000-plus', 'Tk. 50k+', activePrice],
                    ].map(([key, value, label, active]) => (
                        <Button
                            key={`${key}-${value}`}
                            type="button"
                            onClick={() => updateParam(key, active === value ? '' : value)}
                            className={`h-auto cursor-pointer rounded-full px-3 py-2 text-xs font-semibold transition ${active === value ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90' : 'bg-muted text-foreground/75 hover:bg-muted/70'}`}
                        >
                            {label}
                        </Button>
                    ))}
                    {brands.map(brand => {
                        const selected = activeBrands.includes(brand);

                        return (
                            <Button
                                key={brand}
                                type="button"
                                onClick={() => {
                                    const next = selected
                                        ? activeBrands.filter(item => item !== brand)
                                        : [...activeBrands, brand];
                                    updateParam('b', next.join(','));
                                }}
                                className={`h-auto cursor-pointer rounded-full px-3 py-2 text-xs font-semibold transition ${selected ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90' : 'bg-muted text-foreground/75 hover:bg-muted/70'}`}
                            >
                                {brand}
                            </Button>
                        );
                    })}
                </div>
            </Card>

            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {products.map(product => (
                    <ProductCard key={product.sku} product={product} />
                ))}
            </section>

            {products.length === 0 ? (
                <Card className="mt-6 p-6 text-sm text-foreground/65 shadow-sm">
                    No products match the current filter.
                </Card>
            ) : null}

            <Card className="mt-6 flex flex-wrap items-center justify-between gap-3 p-4 text-sm shadow-sm">
                <span className="text-foreground/60">
                    Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={page <= 1}
                        onClick={() => updatePage(page - 1)}
                        className="h-9 rounded-full border-border px-4 text-xs font-semibold"
                    >
                        Prev
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={page >= totalPages}
                        onClick={() => updatePage(page + 1)}
                        className="h-9 rounded-full border-border px-4 text-xs font-semibold"
                    >
                        Next
                    </Button>
                </div>
            </Card>
        </>
    );
}
