"use client";

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TablePagination } from '@/components/ui/table-pagination';
import { formatDashboardDate } from '@/lib/formatDate';

type UserSummary = {
    name?: string;
    email?: string;
    phone?: string;
};

export type DashboardWishlistRecord = {
    _id?: string;
    user?: UserSummary;
    productSnapshot?: {
        title: string;
        brand: string;
        image: string;
        sku: string;
        price: number;
    };
    createdAt?: string;
    updatedAt?: string;
};

export type DashboardComparisonRecord = {
    _id?: string;
    user?: UserSummary;
    productSnapshot?: {
        title: string;
        brand: string;
        sku: string;
        image: string;
    };
    createdAt?: string;
};

type PaginationMeta = { page: number; limit: number; total: number; totalPages: number };

export function DashboardWishlistManager({
    records,
    paginationMeta,
}: {
    records: DashboardWishlistRecord[];
    paginationMeta: PaginationMeta;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const updateQuery = useCallback(
        (updates: { page?: number; limit?: number }) => {
            const params = new URLSearchParams(searchParams.toString());

            params.set('page', String(updates.page ?? paginationMeta.page));
            params.set('limit', String(updates.limit ?? paginationMeta.limit));

            router.push(`${pathname}?${params.toString()}`);
        },
        [paginationMeta.limit, paginationMeta.page, pathname, router, searchParams],
    );

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Wishlist activity</CardTitle>
                <CardDescription>Products saved by users in the last 30 days.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4 text-sm text-muted-foreground">
                    Showing {records.length} of {paginationMeta.total} wishlist records
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Brand</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Saved</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {records.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="py-0">
                                <div className="my-4 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                                    No wishlist activity found.
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : null}
                    {records.map(record => {
                            const product = record.productSnapshot;
                            return (
                                <TableRow key={record._id ?? `${record.user?.email}-${product?.sku}`}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="relative size-12 overflow-hidden rounded-xl border bg-muted">
                                                {product?.image ? (
                                                    <Image src={product.image} alt={product.title} fill className="object-cover" />
                                                ) : null}
                                            </div>
                                            <div className="font-medium">{product?.title ?? '-'}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{record.user?.name ?? '-'}</div>
                                        <div className="text-xs text-muted-foreground">{record.user?.email ?? '-'}</div>
                                    </TableCell>
                                    <TableCell>{product?.brand ?? '-'}</TableCell>
                                    <TableCell>{product?.sku ?? '-'}</TableCell>
                                    <TableCell>{product?.price ? `Tk. ${product.price.toLocaleString('en-BD')}` : '-'}</TableCell>
                                    <TableCell>
                                        <span title={formatDashboardDate(record.updatedAt ?? record.createdAt, { time: true })}>
                                            {formatDashboardDate(record.updatedAt ?? record.createdAt)}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                {paginationMeta.total > 0 ? (
                    <div className="mt-4 border-t pt-4">
                        <TablePagination
                            page={paginationMeta.page}
                            limit={paginationMeta.limit}
                            total={paginationMeta.total}
                            onPageChange={page => updateQuery({ page })}
                            onLimitChange={limit => updateQuery({ page: 1, limit })}
                        />
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}

export function DashboardComparisonManager({
    records,
    paginationMeta,
}: {
    records: DashboardComparisonRecord[];
    paginationMeta: PaginationMeta;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const updateQuery = useCallback(
        (updates: { page?: number; limit?: number }) => {
            const params = new URLSearchParams(searchParams.toString());

            params.set('page', String(updates.page ?? paginationMeta.page));
            params.set('limit', String(updates.limit ?? paginationMeta.limit));

            router.push(`${pathname}?${params.toString()}`);
        },
        [paginationMeta.limit, paginationMeta.page, pathname, router, searchParams],
    );

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Comparison activity</CardTitle>
                <CardDescription>Products compared by users in the last 30 days.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4 text-sm text-muted-foreground">
                    Showing {records.length} of {paginationMeta.total} comparison records
                </div>
                <div className="grid gap-4">
                    {records.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                            No comparison activity found.
                        </div>
                    ) : null}
                    {records.map(record => (
                        <div key={record._id ?? record.createdAt} className="rounded-2xl border border-border p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <div className="font-semibold">{record.user?.name ?? 'Unknown user'}</div>
                                    <div className="text-xs text-muted-foreground">{record.user?.email ?? '-'}</div>
                                </div>
                                <Badge variant="secondary">
                                    {record.createdAt ? formatDashboardDate(record.createdAt) : 'Recent'}
                                </Badge>
                            </div>
                            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                                {record.productSnapshot ? (
                                    <div className="rounded-xl bg-muted p-3 text-sm">
                                        <div className="font-semibold">{record.productSnapshot.title}</div>
                                        <div className="mt-1 text-xs text-muted-foreground">
                                            {record.productSnapshot.brand} / {record.productSnapshot.sku}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
                {paginationMeta.total > 0 ? (
                    <div className="mt-4 border-t pt-4">
                        <TablePagination
                            page={paginationMeta.page}
                            limit={paginationMeta.limit}
                            total={paginationMeta.total}
                            onPageChange={page => updateQuery({ page })}
                            onLimitChange={limit => updateQuery({ page: 1, limit })}
                        />
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}
