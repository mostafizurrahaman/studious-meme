import type { Metadata } from 'next';
import { DashboardUsersManager } from '@/components/dashboard/DashboardUsersManager';
import { requireDashboardRoles } from '@/lib/dashboard-auth';
import { buildMetadata } from '@/lib/seo';
import { getAllUsers } from '@/services/Admin';

export const metadata: Metadata = buildMetadata({
    title: 'Users',
    description: 'Manage customer user accounts.',
    path: '/dashboard/admin/users',
    noindex: true,
});

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
    await requireDashboardRoles(['ADMIN', 'SUPER_ADMIN']);
    const usersResult = await getAllUsers().catch(() => null);
    const users = Array.isArray(usersResult?.data) ? (usersResult.data as Array<unknown>) : [];

    return (
        <DashboardUsersManager
            users={users as Array<{ _id?: string; name?: string; email?: string; phone?: string; isActive?: boolean; createdAt?: string }>}
            title="Users"
            description="Browse customer accounts managed through the backend."
        />
    );
}
