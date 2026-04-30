'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { searchProducts, type SearchResult } from '@/services/Product';
import { Loader2, Search } from 'lucide-react';

const DEBOUNCE_MS = 600;

export function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (query.trim().length < 2) return;

    timeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await searchProducts(query, 10);

        setResults(data);
        setIsOpen(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  const visibleResults = query.trim().length >= 2 ? results : null;
  const showDropdown =
    isOpen && visibleResults && (visibleResults.products.length > 0 || visibleResults.suggestions.length > 0);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="flex w-full overflow-hidden rounded-full border border-border bg-background shadow-sm">
        <div className="relative flex flex-1 items-center">
          <Search className="ml-4 h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
            placeholder="Search…"
            className="h-11 w-full bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            aria-label="Search"
          />
          {isLoading && <Loader2 className="mr-4 h-4 w-4 animate-spin text-muted-foreground" />}
        </div>

        <Link
          href={query.trim().length >= 2 ? `/shop?searchTerm=${encodeURIComponent(query)}` : '/shop'}
          className="flex h-11 shrink-0 items-center bg-secondary px-3 text-sm font-semibold text-secondary-foreground! hover:bg-secondary/80"
        >
          Search
        </Link>
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-9999 mt-2 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
          {visibleResults.suggestions.length > 0 && (
            <div className="border-b border-border p-2 bg-white!">
              {/* <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">Suggestions</p> */}
              {visibleResults.suggestions.slice(0, 12).map((item, index) => (
                <Link
                  key={index}
                  href={`/product/${item.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-sm text-gray-500! hover:bg-accent"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          )}

          {/* {results!.products.length > 0 && (
            <div className="p-2">
              <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">Products</p>
              <div className="max-h-80 overflow-y-auto">
                {results!.products.slice(0, 12).map(product => (
                  <Link
                    key={product.slug}
                    href={`/product/${product.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-accent"
                  >
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-secondary">
                      {product.images[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm">{product.title}</p>
                      <p className="text-xs font-semibold text-primary">৳{product.price.toLocaleString()}</p>
                    </div>
                    {product.badge && (
                      <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                        {product.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
}
