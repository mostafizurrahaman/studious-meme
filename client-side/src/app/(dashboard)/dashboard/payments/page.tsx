import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { requireDashboardRoles } from '@/lib/dashboard-auth';
import { buildMetadata } from '@/lib/seo';
import { getAllPaymentsForAdmin } from '@/services/Payment';

export const metadata: Metadata = buildMetadata({
    title: 'Payments',
    description: 'Manage storefront payment history.',
    path: '/dashboard/payments',
    noindex: true,
});

export const dynamic = 'force-dynamic';

export default async function DashboardPaymentsPage() {
    await requireDashboardRoles(['ADMIN', 'SUPER_ADMIN']);
    const paymentsResult = await getAllPaymentsForAdmin().catch(() => null);
    const payments = Array.isArray(paymentsResult?.data) ? (paymentsResult.data as any[]) : [];

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Payments</CardTitle>
                <CardDescription>Browse through all the payments received via SSLCommerz.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tran ID</TableHead>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No payments found.
                                </TableCell>
                            </TableRow>
                        ) : null}
                        {payments.map(item => (
                            <TableRow key={item._id}>
                                <TableCell className="font-medium">{item.tranId}</TableCell>
                                <TableCell>{item.orderId}</TableCell>
                                <TableCell>Tk. {item.amount}</TableCell>
                                <TableCell>
                                    <Badge variant={item.status === 'VALID' ? 'default' : 'destructive'}>
                                        {item.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{item.card_type || '-'}</TableCell>
                                <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
