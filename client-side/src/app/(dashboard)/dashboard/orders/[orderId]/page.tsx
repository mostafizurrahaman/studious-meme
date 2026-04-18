import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { requireDashboardRoles } from '@/lib/dashboard-auth';
import { buildMetadata } from '@/lib/seo';
import { getOrderById } from '@/services/Order';
import { OrderDetailAdminClient } from '@/components/dashboard/OrderDetailAdminClient';

export const metadata: Metadata = buildMetadata({
    title: 'Order Detail',
    description: 'View and manage order details.',
    path: '/dashboard/orders/[orderId]',
    noindex: true,
});

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ orderId: string }>;
};

export default async function DashboardOrderDetailPage({ params }: Props) {
    await requireDashboardRoles(['ADMIN', 'SUPER_ADMIN']);
    const { orderId } = await params;
    const result = await getOrderById(orderId).catch(() => null);
    const order = result?.data ?? null;

    return (
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                    <CardTitle>Order {orderId}</CardTitle>
                    <CardDescription>
                        {order ? `${order.items.length} items · Tk.${order.total}` : 'Not found'}
                    </CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline">
                        <Link href="/dashboard/orders">Back to Orders</Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <OrderDetailAdminClient order={order} />
            </CardContent>
        </Card>
    );
}
