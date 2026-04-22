'use client';

import { type Route } from 'next';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProductCard } from '@/components/ProductCard';
import { getCategoryAccentClassName, getCategoryAccentStyle } from '@/lib/category-accent';
import { parseMoney } from '@/lib/cart';
import type { CategoryPageEntry, Product } from '@/lib/malamal-content';

type FilterKey =
  | 'all'
  | `brand:${string}`
  | 'stock:in-stock'
  | 'price:under-10000'
  | 'price:10000-50000'
  | 'price:50000-plus';

type SelectedFilterKey = Exclude<FilterKey, 'all'>;

type Props = {
  category: CategoryPageEntry;
  products: Product[];
};

type FilterGroup = 'brand' | 'stock' | 'price';

type FilterState = {
  brand: string[];
  stock: string[];
  price: string[];
};

function getProductFilters(product: Product) {
  const price = parseMoney(product.price);

  return {
    brand: product.brand,
    inStock: product.stock.toLowerCase().includes('in stock'),
    under10000: price < 10000,
    between10000And50000: price >= 10000 && price < 50000,
    over50000: price >= 50000,
  };
}

function getFilterGroup(filter: FilterKey): FilterGroup | 'all' {
  if (filter === 'all') return 'all';
  if (filter.startsWith('brand:')) return 'brand';
  if (filter.startsWith('stock:')) return 'stock';
  return 'price';
}

function matchesFilters(product: Product, filters: FilterKey[]) {
  if (filters.includes('all') || filters.length === 0) return true;

  const item = getProductFilters(product);
  const grouped = filters.reduce<Record<FilterGroup, FilterKey[]>>(
    (acc, filter) => {
      const group = getFilterGroup(filter);

      if (group !== 'all') {
        acc[group].push(filter);
      }

      return acc;
    },
    { brand: [], stock: [], price: [] },
  );

  const brandMatches =
    grouped.brand.length === 0 ||
    grouped.brand.some(filter => item.brand === filter.slice(6));
  const stockMatches =
    grouped.stock.length === 0 ||
    grouped.stock.some(filter => filter === 'stock:in-stock' && item.inStock);
  const priceMatches =
    grouped.price.length === 0 ||
    grouped.price.some(filter => {
      if (filter === 'price:under-10000') return item.under10000;
      if (filter === 'price:10000-50000') return item.between10000And50000;
      return item.over50000;
    });

  return brandMatches && stockMatches && priceMatches;
}

function parseGroupValues(value: string | null) {
  return (value ?? '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

function parseFilterState(
  searchParams: URLSearchParams,
  allowed: FilterKey[],
): FilterKey[] {
  const allowedSet = new Set(allowed);

  const brand = parseGroupValues(searchParams.get('b')).map(
    value => `brand:${value}` as const,
  );
  const stock = parseGroupValues(searchParams.get('s')).map(
    value => `stock:${value}` as const,
  );
  const price = parseGroupValues(searchParams.get('p')).map(
    value => `price:${value}` as const,
  );

  const parsed = [...brand, ...stock, ...price].filter(item =>
    allowedSet.has(item as FilterKey),
  ) as SelectedFilterKey[];

  return parsed.length > 0 ? parsed : ['all'];
}

function splitFilterState(filters: FilterKey[]) {
  return filters.reduce<FilterState>(
    (state, filter) => {
      if (filter === 'all') return state;

      if (filter.startsWith('brand:')) {
        state.brand.push(filter.slice(6));
      } else if (filter.startsWith('stock:')) {
        state.stock.push(filter.slice(6));
      } else {
        state.price.push(filter.slice(6));
      }

      return state;
    },
    { brand: [], stock: [], price: [] },
  );
}

export function CategoryPageClient({ category, products }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const title = 'name' in category ? category.name : category.title;

  const filters = [
    { key: 'all' as const, label: title },
    { key: 'stock:in-stock' as const, label: 'In stock' },
    { key: 'price:under-10000' as const, label: 'Under Tk. 10k' },
    { key: 'price:10000-50000' as const, label: 'Tk. 10k-50k' },
    { key: 'price:50000-plus' as const, label: 'Tk. 50k+' },
    ...Array.from(new Set(products.map(product => product.brand))).map(
      brand => ({
        key: `brand:${brand}` as const,
        label: brand,
      }),
    ),
  ];

  const activeFilters = parseFilterState(
    searchParams,
    filters.map(filter => filter.key),
  );

  const visibleProducts = products.filter(product =>
    matchesFilters(product, activeFilters),
  );

  function toggleFilter(filter: FilterKey) {
    const params = new URLSearchParams(searchParams.toString());

    if (filter === 'all') {
      params.delete('b');
      params.delete('s');
      params.delete('p');
    } else {
      const next = splitFilterState(activeFilters);

      if (filter.startsWith('brand:')) {
        const value = filter.slice(6);
        next.brand = next.brand.includes(value)
          ? next.brand.filter(item => item !== value)
          : [...next.brand, value];
        if (next.brand.length > 0) params.set('b', next.brand.join(','));
        else params.delete('b');
      }

      if (filter.startsWith('stock:')) {
        const value = filter.slice(6);
        next.stock = next.stock.includes(value)
          ? next.stock.filter(item => item !== value)
          : [...next.stock, value];
        if (next.stock.length > 0) params.set('s', next.stock.join(','));
        else params.delete('s');
      }

      if (filter.startsWith('price:')) {
        const value = filter.slice(6);
        next.price = next.price.includes(value)
          ? next.price.filter(item => item !== value)
          : [...next.price, value];
        if (next.price.length > 0) params.set('p', next.price.join(','));
        else params.delete('p');
      }
    }

    if (!params.has('b') && !params.has('s') && !params.has('p')) {
      params.delete('b');
      params.delete('s');
      params.delete('p');
    }

    const query = params.toString();
    router.replace((query ? `${pathname}?${query}` : pathname) as Route, {
      scroll: false,
    });
  }

  const activeLabel = activeFilters.includes('all')
    ? 'All items'
    : `${activeFilters.length} filters active`;

  const selectedFilters = activeFilters.includes('all') ? [] : activeFilters;

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

      <Card className="mt-6 flex items-center justify-between p-4 text-sm shadow-sm">
        <span className="text-foreground/60">
          {visibleProducts.length} of {products.length} products shown
        </span>
        <span className="font-semibold text-primary capitalize">
          {activeLabel}
        </span>
      </Card>

      <Card className="mt-6 p-4 shadow-sm">
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          {filters.map(filter => {
            const selected = activeFilters.includes(filter.key);

            return (
              <Button
                key={filter.key}
                type="button"
                onClick={() => toggleFilter(filter.key)}
                className={`h-auto cursor-pointer rounded-full px-3 py-2 text-xs font-semibold transition ${selected ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90' : 'bg-muted text-foreground/75 hover:bg-muted/70'}`}
              >
                {filter.label}
              </Button>
            );
          })}
          {!activeFilters.includes('all') ? (
            <Button
              type="button"
              onClick={() =>
                router.replace(pathname as never, { scroll: false })
              }
              className="h-auto cursor-pointer rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Clear all
            </Button>
          ) : null}
        </div>
      </Card>

      {selectedFilters.length > 0 ? (
        <Card className="mt-4 p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="text-foreground/50">Selected:</span>
            {selectedFilters.map(filterKey => {
              const label =
                filters.find(filter => filter.key === filterKey)?.label ??
                filterKey;

              return (
                <Button
                  key={filterKey}
                  type="button"
                  onClick={() => toggleFilter(filterKey)}
                  className="inline-flex h-auto cursor-pointer items-center gap-2 rounded-full bg-secondary px-3 py-2 text-xs font-semibold text-secondary-foreground transition hover:bg-secondary/90"
                >
                  <span>{label}</span>
                  <span aria-hidden="true">×</span>
                </Button>
              );
            })}
          </div>
        </Card>
      ) : null}

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {visibleProducts.map(product => (
          <ProductCard key={product.sku} product={product} />
        ))}
      </section>

      {visibleProducts.length === 0 ? (
        <Card className="mt-6 p-6 text-sm text-foreground/65 shadow-sm">
          No products match the current filter.
        </Card>
      ) : null}
    </>
  );
}
