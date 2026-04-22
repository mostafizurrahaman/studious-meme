import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDashboardDate } from '@/lib/formatDate';
import type { BackendPayment } from '@/services/Payment';
import Link from 'next/link';

function getStatusVariant(status: BackendPayment['status']) {
    switch (status) {
        case 'SUCCEEDED':
            return 'default';
        case 'FAILED':
            return 'destructive';
        case 'CANCELED':
            return 'secondary';
        case 'PENDING':
            return 'outline';
        default:
            return 'secondary';
    }
}

export function DashboardPaymentsManager({
    payments,
    title,
    description,
    paginationMeta,
    listBaseHref,
}: {
    payments: BackendPayment[];
    title: string;
    description: string;
    paginationMeta: { page: number; limit: number; total: number; totalPages: number };
    listBaseHref: string;
}) {
    const pageHref = (page: number, limit = paginationMeta.limit) => `${listBaseHref}?page=${page}&limit=${limit}`;

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                    Showing {payments.length} of {paginationMeta.total} payments
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tran ID</TableHead>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No payments found.
                                </TableCell>
                            </TableRow>
                        ) : null}
                        {payments.map(item => {
                            const orderId = typeof item.order === 'object' ? item.order.orderId : item.order;
                            return (
                                <TableRow key={item._id}>
                                    <TableCell className="font-medium">{item.transactionId}</TableCell>
                                    <TableCell>{orderId}</TableCell>
                                    <TableCell>Tk. {item.amount}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                                    </TableCell>
                                     <TableCell>
                                         <span title={formatDashboardDate(item.createdAt, { time: true })}>
                                             {formatDashboardDate(item.createdAt)}
                                         </span>
                                     </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                {paginationMeta.total > 0 ? (
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>
                                Page {paginationMeta.page} of {paginationMeta.totalPages}
                            </span>
                            {[25, 50, 100].map(limit => (
                                <Link
                                    key={limit}
                                    href={pageHref(1, limit)}
                                    className={`rounded-md border px-2 py-1 text-xs ${
                                        paginationMeta.limit === limit ? 'bg-primary text-primary-foreground' : ''
                                    }`}
                                >
                                    {limit}
                                </Link>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm" disabled={paginationMeta.page <= 1}>
                                <Link href={pageHref(Math.max(1, paginationMeta.page - 1))}>Prev</Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                disabled={paginationMeta.page >= paginationMeta.totalPages}
                            >
                                <Link href={pageHref(Math.min(paginationMeta.totalPages, paginationMeta.page + 1))}>
                                    Next
                                </Link>
                            </Button>
                        </div>
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}
