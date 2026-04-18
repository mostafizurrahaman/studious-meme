import type { Metadata } from 'next';
import { DashboardAdminsManager } from '@/components/dashboard/DashboardAdminsManager';
import { buildMetadata } from '@/lib/seo';
import { requireDashboardRoles } from '@/lib/dashboard-auth';
import { getAllAdmins } from '@/services/Admin';

export const metadata: Metadata = buildMetadata({
    title: 'Admins',
    description: 'Manage admin accounts as super admin.',
    path: '/dashboard/admins',
    noindex: true,
});

export const dynamic = 'force-dynamic';

export default async function DashboardAdminsPage() {
    await requireDashboardRoles(['SUPER_ADMIN']);
    const adminsResult = await getAllAdmins().catch(() => null);
    const admins = Array.isArray(adminsResult?.data) ? adminsResult.data : [];

    return <DashboardAdminsManager admins={admins} />;
}
