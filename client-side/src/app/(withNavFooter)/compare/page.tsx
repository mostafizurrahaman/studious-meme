import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { featuredProducts } from '@/lib/malamal-content';
import { compareMetadata } from '@/lib/seo';
import { getComparisonSuggestions, getMyComparisonHistory } from '@/services/ComparisonHistory';
import { mapBackendProductToStorefrontProduct, type BackendProduct } from '@/services/Product';

export const metadata = compareMetadata;
export const dynamic = 'force-dynamic';

export default async function ComparePage() {
    const [suggestionsResult, historyResult] = await Promise.all([
        getComparisonSuggestions().catch(() => null),
        getMyComparisonHistory().catch(() => null),
    ]);

    const backendProducts = suggestionsResult?.data?.length
        ? await Promise.all(
              suggestionsResult.data.map(item =>
                  mapBackendProductToStorefrontProduct(item as BackendProduct),
              ),
          )
        : featuredProducts.slice(0, 3);
    const products = backendProducts.slice(0, 3);
    const history = Array.isArray(historyResult?.data)
        ? (
              historyResult.data as Array<{
                  _id?: string;
                  createdAt?: string;
                  products?: Array<{ title: string; sku: string; brand: string }>;
              }>
          ).slice(0, 5)
        : [];

    return (
        <main className="flex-1 bg-background pb-16">
            <div className="mx-auto w-full max-w-350 px-4 py-6 lg:px-6">
                <Card className="p-6 shadow-sm sm:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                        Comparison
                    </p>
                    <h1 className="mt-4 text-3xl font-black text-secondary sm:text-4xl">Compare</h1>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/65 sm:text-base">
                        Compare table showing product details side by side from the store catalog.
                    </p>
                </Card>

                <Card className="mt-6 overflow-hidden shadow-sm">
                    <CardContent className="p-0">
                        <div className="grid gap-4 border-b border-border p-4 lg:grid-cols-3">
                            {products.map(product => (
                                <div key={product.sku} className="rounded-2xl border border-border p-4">
                                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                                        <Image
                                            src={product.image}
                                            alt={product.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="mt-4 text-sm font-semibold text-foreground">
                                        {product.title}
                                    </div>
                                    <div className="mt-2 text-sm font-extrabold text-primary">
                                        {product.price}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-40 bg-muted text-secondary">Attribute</TableHead>
                                    {products.map(product => (
                                        <TableHead key={product.sku} className="text-secondary">
                                            {product.brand}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    ['Brand', ...products.map(product => product.brand)],
                                    ['SKU', ...products.map(product => product.sku)],
                                    ['Stock', ...products.map(product => product.stock)],
                                    ['Rating', ...products.map(product => product.rating)],
                                    ['Old price', ...products.map(product => product.oldPrice ?? '-')],
                                ].map(([label, ...values]) => (
                                    <TableRow key={label as string}>
                                        <TableCell className="bg-muted font-semibold text-secondary">
                                            {label}
                                        </TableCell>
                                        {values.map((value, index) => (
                                            <TableCell
                                                key={`${label}-${index}-${products[index]?.sku ?? value}`}
                                                className="text-foreground/70"
                                            >
                                                {value}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="mt-6 p-6 shadow-sm">
                    <h2 className="text-xl font-black text-secondary">Recent comparison history</h2>
                    <p className="mt-2 text-sm leading-7 text-foreground/65">
                        Signed-in users can view their latest backend-stored comparison records here.
                    </p>

                    <div className="mt-4 grid gap-3">
                        {history.length > 0 ? (
                            history.map((entry, index) => (
                                <div
                                    key={entry._id ?? `${entry.createdAt ?? 'history'}-${index}`}
                                    className="rounded-2xl border border-border p-4"
                                >
                                    <div className="text-xs uppercase tracking-[0.22em] text-foreground/45">
                                        {entry.createdAt
                                            ? new Date(entry.createdAt).toLocaleString('en-US')
                                            : 'Recent compare'}
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2 text-sm text-foreground/70">
                                        {entry.products?.map(product => (
                                            <span
                                                key={`${entry._id ?? index}-${product.sku}`}
                                                className="rounded-full bg-muted px-3 py-1"
                                            >
                                                {product.brand} · {product.title}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-foreground/60">
                                No comparison history found for the current session.
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </main>
    );
}
