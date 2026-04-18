import type { Metadata } from 'next';
import { requireDashboardRoles } from '@/lib/dashboard-auth';
import { buildMetadata } from '@/lib/seo';
import { getAllPaymentsForAdmin } from '@/services/Payment';
import { DashboardPaymentsManager } from '@/components/dashboard/DashboardPaymentsManager';

export const metadata: Metadata = buildMetadata({
    title: 'Payments',
    description: 'Manage storefront payment history.',
    path: '/dashboard/admin/payments',
    noindex: true,
});

export const dynamic = 'force-dynamic';

export default async function AdminPaymentsPage() {
    await requireDashboardRoles(['ADMIN', 'SUPER_ADMIN']);
    const paymentsResult = await getAllPaymentsForAdmin().catch(() => null);
    const payments = Array.isArray(paymentsResult?.data?.data) ? paymentsResult.data.data : [];

    return (
        <DashboardPaymentsManager
            payments={payments}
            title="Payments"
            description="Browse through all the payments received via SSLCommerz."
        />
    );
}
