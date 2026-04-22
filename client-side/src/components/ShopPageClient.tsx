'use client';

import { type Route } from 'next';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Category, Product } from '@/lib/malamal-content';

type Props = {
  products: Product[];
  categories: Category[];
  meta: {
    total: number;
    limit: number;
    page: number;
    totalPage: number;
  };
};

function getActiveFilters(searchParams: URLSearchParams) {
  return {
    category: searchParams.get('c') ?? '',
    stock: searchParams.get('stock') ?? '',
    tag: searchParams.get('tag') ?? 'all',
    price: searchParams.get('price') ?? '',
    page: Math.max(Number(searchParams.get('page') ?? '1') || 1, 1),
  };
}

export function ShopPageClient({ products, categories, meta }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = getActiveFilters(searchParams);
  const totalPage = Math.max(meta.totalPage, 1);
  const page = Math.min(meta.page, totalPage);

  function updateFilter(key: string, value: string) {
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

  function clearFilters() {
    router.replace(pathname as Route, { scroll: false });
  }

  const activeCount = [
    filters.category,
    filters.stock,
    filters.price,
    filters.tag !== 'all' ? filters.tag : '',
  ].filter(Boolean).length;

  return (
    <section className="mt-6 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <Card className="p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-extrabold text-secondary">Filters</h2>
          {activeCount > 0 ? (
            <Button
              type="button"
              variant="ghost"
              onClick={clearFilters}
              className="h-auto px-2 py-1 text-xs font-semibold text-primary"
            >
              Clear
            </Button>
          ) : null}
        </div>
        <div className="mt-4 space-y-5 text-sm">
          <div>
            <div className="font-semibold text-foreground">Category</div>
            <div className="mt-2 grid gap-2">
              {categories.map(category => (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => updateFilter('c', filters.category === category.slug ? '' : category.slug)}
                  className={`cursor-pointer text-left transition hover:text-primary ${filters.category === category.slug ? 'font-bold text-primary' : 'text-foreground/65'}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="font-semibold text-foreground">Stock status</div>
            <div className="mt-2 grid gap-2">
              {[
                ['in-stock', 'In stock'],
                ['featured', 'Featured'],
                ['sale', 'On sale'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateFilter('stock', filters.stock === value ? '' : value)}
                  className={`cursor-pointer text-left transition hover:text-primary ${filters.stock === value ? 'font-bold text-primary' : 'text-foreground/65'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="font-semibold text-foreground">Price range</div>
            <div className="mt-2 grid gap-2">
              {[
                ['under-10000', 'Under Tk. 10k'],
                ['10000-50000', 'Tk. 10k-50k'],
                ['50000-plus', 'Tk. 50k+'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateFilter('price', filters.price === value ? '' : value)}
                  className={`cursor-pointer text-left transition hover:text-primary ${filters.price === value ? 'font-bold text-primary' : 'text-foreground/65'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <Card className="p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-sm text-foreground/65">
              Showing {products.length} of {meta.total} products across {categories.length} categories
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              {[
                ['all', 'All'],
                ['sale', 'Sale'],
                ['featured', 'Featured'],
                ['latest', 'Latest'],
                ['industrial', 'Industrial'],
                ['home', 'Home'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateFilter('tag', value === 'all' ? '' : value)}
                  className={`cursor-pointer rounded-full px-3 py-2 transition ${filters.tag === value || (value === 'all' && filters.tag === 'all') ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-foreground/75 hover:bg-muted/70'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {products.map(product => (
            <ProductCard key={product.sku} product={product} />
          ))}
        </div>

        {products.length === 0 ? (
          <Card className="p-6 text-center text-sm text-foreground/60 shadow-sm">
            No products match the selected filters.
          </Card>
        ) : null}

        <Card className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm shadow-sm">
          <span className="text-foreground/60">
            Page {page} of {totalPage}
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
            <Link
              href="/quotation-request"
              className="rounded-full bg-muted px-4 py-2 text-xs font-semibold text-foreground/70 hover:text-primary"
            >
              Bulk quote
            </Link>
            <Button
              type="button"
              variant="outline"
              disabled={page >= totalPage}
              onClick={() => updatePage(page + 1)}
              className="h-9 rounded-full border-border px-4 text-xs font-semibold"
            >
              Next
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
