import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDashboardDate } from '@/lib/formatDate';
import type { BackendOrder } from '@/services/Order';

export function DashboardOrdersManager({
    orders,
    title,
    description,
    detailBaseHref,
    updateStatus,
}: {
    orders: BackendOrder[];
    title: string;
    description: string;
    detailBaseHref: string;
    updateStatus: (formData: FormData) => Promise<void>;
}) {
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Updated At</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map(order => (
                            <TableRow key={order.orderId}>
                                <TableCell>
                                    <Link
                                        href={`${detailBaseHref}/${order.orderId}`}
                                        className="font-medium hover:underline"
                                    >
                                        {order.orderId}
                                    </Link>
                                    <div className="text-xs text-muted-foreground">
                                        <span title={formatDashboardDate(order.createdAt, { time: true })}>
                                            {formatDashboardDate(order.createdAt)}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div>{order.customer.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {order.customer.phone}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{order.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div>{order.paymentMethod}</div>
                                    <div className="text-xs text-muted-foreground">{order.paymentStatus}</div>
                                </TableCell>
                                <TableCell>Tk. {order.total.toFixed(2)}</TableCell>
                                <TableCell>
                                    <span title={formatDashboardDate(order.createdAt, { time: true })}>
                                        {formatDashboardDate(order.createdAt)}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span title={formatDashboardDate(order.updatedAt, { time: true })}>
                                        {formatDashboardDate(order.updatedAt)}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <form action={updateStatus} className="flex justify-end gap-2">
                                        <input type="hidden" name="orderId" value={order.orderId} />
                                        <select
                                            name="status"
                                            defaultValue={order.status}
                                            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                                        >
                                            {['PLACED', 'PROCESSING', 'DELIVERED', 'CANCELLED'].map(
                                                status => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                        <Button size="sm" type="submit">
                                            Update
                                        </Button>
                                    </form>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
