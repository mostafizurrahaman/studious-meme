import type { Metadata } from 'next';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { requireDashboardRoles } from '@/lib/dashboard-auth';
import { buildMetadata } from '@/lib/seo';
import { getAllOrdersForAdmin, updateOrderStatus } from '@/services/Order';

export const metadata: Metadata = buildMetadata({
    title: 'Orders',
    description: 'Manage customer orders and order status.',
    path: '/dashboard/orders',
    noindex: true,
});

export const dynamic = 'force-dynamic';

export default async function DashboardOrdersPage() {
    await requireDashboardRoles(['ADMIN', 'SUPER_ADMIN']);
    const result = await getAllOrdersForAdmin().catch(() => null);
    const orders = Array.isArray(result?.data) ? result.data : [];

    async function updateStatus(formData: FormData) {
        'use server';

        const orderId = String(formData.get('orderId') ?? '');
        const status = String(formData.get('status') ?? '') as 'PLACED' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED';

        await updateOrderStatus(orderId, status);
    }

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>{orders.length} orders loaded from backend.</CardDescription>
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
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map(order => (
                            <TableRow key={order.orderId}>
                                <TableCell>
                                    <Link href={`/dashboard/orders/${order.orderId}`} className="font-medium hover:underline">
                                        {order.orderId}
                                    </Link>
                                    <div className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString('en-US')}</div>
                                </TableCell>
                                <TableCell>
                                    <div>{order.customer.name}</div>
                                    <div className="text-xs text-muted-foreground">{order.customer.phone}</div>
                                </TableCell>
                                <TableCell><Badge variant="secondary">{order.status}</Badge></TableCell>
                                <TableCell>
                                    <div>{order.paymentMethod}</div>
                                    <div className="text-xs text-muted-foreground">{order.paymentStatus}</div>
                                </TableCell>
                                <TableCell>Tk. {order.total.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                    <form action={updateStatus} className="flex justify-end gap-2">
                                        <input type="hidden" name="orderId" value={order.orderId} />
                                        <select name="status" defaultValue={order.status} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
                                            {['PLACED', 'PROCESSING', 'DELIVERED', 'CANCELLED'].map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                        <Button size="sm" type="submit">Update</Button>
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
