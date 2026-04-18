import type { Metadata } from 'next';
import { requireDashboardRoles } from '@/lib/dashboard-auth';
import { buildMetadata } from '@/lib/seo';
import { getAllOrdersForAdmin, updateOrderStatus } from '@/services/Order';
import { DashboardOrdersManager } from '@/components/dashboard/DashboardOrdersManager';

export const metadata: Metadata = buildMetadata({
    title: 'Orders',
    description: 'Manage customer orders and order status.',
    path: '/dashboard/super-admin/orders',
    noindex: true,
});

export const dynamic = 'force-dynamic';

export default async function SuperAdminOrdersPage() {
    await requireDashboardRoles(['SUPER_ADMIN']);
    const result = await getAllOrdersForAdmin().catch(() => null);
    const orders = Array.isArray(result?.data?.data) ? result.data.data : [];

    async function updateStatus(formData: FormData) {
        'use server';

        const orderId = String(formData.get('orderId') ?? '');
        const status = String(formData.get('status') ?? '') as
            | 'PLACED'
            | 'PROCESSING'
            | 'DELIVERED'
            | 'CANCELLED';

        await updateOrderStatus(orderId, status);
    }

    return (
        <DashboardOrdersManager
            orders={orders}
            title="Orders"
            description={`${orders.length} orders loaded from backend.`}
            detailBaseHref="/dashboard/super-admin/orders"
            updateStatus={updateStatus}
        />
    );
}
