import type { Metadata } from 'next';
import { DashboardBrandsManager } from '@/components/dashboard/DashboardBrandsManager';
import { requireDashboardRoles } from '@/lib/dashboard-auth';
import { buildMetadata } from '@/lib/seo';
import { getAllBrands } from '@/services/Brand';

export const metadata: Metadata = buildMetadata({
    title: 'Brands',
    description: 'Manage brand directory entries and active status.',
    path: '/dashboard/super-admin/brands',
    noindex: true,
});

export const dynamic = 'force-dynamic';

export default async function SuperAdminBrandsPage() {
    await requireDashboardRoles(['SUPER_ADMIN']);
    const brandsResult = await getAllBrands().catch(() => null);
    const brands = Array.isArray(brandsResult?.data) ? brandsResult.data : [];

    return <DashboardBrandsManager brands={brands} />;
}
