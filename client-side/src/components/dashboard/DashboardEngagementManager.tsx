import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
    products?: Array<{
        title: string;
        brand: string;
        sku: string;
        image: string;
    }>;
    createdAt?: string;
};

export function DashboardWishlistManager({ records }: { records: DashboardWishlistRecord[] }) {
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Wishlist activity</CardTitle>
                <CardDescription>Products currently saved by users in backend wishlist records.</CardDescription>
            </CardHeader>
            <CardContent>
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
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No wishlist records found.
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
            </CardContent>
        </Card>
    );
}

export function DashboardComparisonManager({ records }: { records: DashboardComparisonRecord[] }) {
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Comparison history</CardTitle>
                <CardDescription>Backend-saved product comparison sessions from users.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {records.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                            No comparison history found.
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
                                {record.products?.map(product => (
                                    <div key={`${record._id}-${product.sku}`} className="rounded-xl bg-muted p-3 text-sm">
                                        <div className="font-semibold">{product.title}</div>
                                        <div className="mt-1 text-xs text-muted-foreground">
                                            {product.brand} / {product.sku}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
