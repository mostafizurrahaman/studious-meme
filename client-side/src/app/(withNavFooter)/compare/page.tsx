import Image from 'next/image';
import Link from 'next/link';
import { SeoScripts } from '@/components/SeoScripts';
import { CompareRemoveButton } from '@/components/compare/CompareRemoveButton';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { compareMetadata, compareSchemas } from '@/lib/seo';
import type { Product } from '@/lib/storefront-types';
import { getMyComparisonHistory, type ComparisonHistoryRecord } from '@/services/ComparisonHistory';

export const metadata = compareMetadata;
export const dynamic = 'force-dynamic';

const snapshotToProduct = (snapshot: NonNullable<ComparisonHistoryRecord['productSnapshot']>): Product => ({
    title: snapshot.title,
    slug: snapshot.slug,
    href: '/shop',
    image: snapshot.image,
    price: String(snapshot.price),
    oldPrice: snapshot.oldPrice === undefined ? undefined : String(snapshot.oldPrice),
    brand: snapshot.brand,
    sku: snapshot.sku,
    stock: snapshot.stock > 0 ? `${snapshot.stock} in stock` : 'Out of stock',
    rating: String(snapshot.rating),
    category: snapshot.category,
    categorySlug: snapshot.subCategorySlug,
    isFeatured: snapshot.isFeatured,
    isNoCOD: snapshot.isNoCOD,
    weightKg: typeof snapshot.weightKg === 'number' ? snapshot.weightKg : 1,
});

export default async function ComparePage() {
    const result = await getMyComparisonHistory().catch(() => null);
    const records: ComparisonHistoryRecord[] = Array.isArray(result?.data) ? result.data : [];
    const products = records
        .map(record => record.productSnapshot)
        .filter((snapshot): snapshot is NonNullable<ComparisonHistoryRecord['productSnapshot']> => Boolean(snapshot))
        .slice(0, 4)
        .map(snapshotToProduct);

    return (
        <>
            <SeoScripts data={compareSchemas} />
            <main className="flex-1 bg-background pb-16">
                <div className="mx-auto w-full max-w-350 px-4 py-6 lg:px-6">
                    <Card className="p-6 shadow-sm sm:p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Comparison</p>
                        <h1 className="mt-4 text-3xl font-black text-secondary sm:text-4xl">Compare</h1>
                        <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/65 sm:text-base">
                            Compare up to four products from the same category.
                        </p>
                    </Card>

                    <Card className="mt-6 overflow-hidden shadow-sm">
                        <CardContent className="p-0">
                            {products.length > 0 ? (
                                <>
                                    <div className="grid gap-4 border-b border-border p-4 lg:grid-cols-3">
                                        {products.map((product, index) => {
                                            const record = records[index];
                                            const productId = record?.product ? String(record.product) : '';
                                            return (
                                                <div key={product.sku} className="rounded-2xl border border-border p-4">
                                                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                                                        <Image src={product.image} alt={product.title} fill className="object-cover" />
                                                    </div>
                                                    <div className="mt-4 text-sm font-semibold text-foreground">{product.title}</div>
                                                    <div className="mt-2 text-sm font-extrabold text-primary">{product.price}</div>
                                                    {productId ? <CompareRemoveButton productId={productId} /> : null}
                                                </div>
                                            );
                                        })}
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
                                                    <TableCell className="bg-muted font-semibold text-secondary">{label}</TableCell>
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
                                </>
                            ) : (
                                <div className="p-8 text-center text-sm text-foreground/60">
                                    No products in your compare list. <Link href="/shop" className="text-primary">Browse products</Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </>
    );
}
