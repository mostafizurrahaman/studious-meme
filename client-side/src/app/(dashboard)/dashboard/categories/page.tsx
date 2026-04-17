import type { Metadata } from 'next';

import { DashboardCategoriesManager } from '@/components/dashboard/DashboardCategoriesManager';
import { requireDashboardRoles } from '@/lib/dashboard-auth';
import { buildMetadata } from '@/lib/seo';
import { getAllCategoriesWithTotalNewsCount } from '@/services/Category';

export const metadata: Metadata = buildMetadata({
    title: 'Categories',
    description: 'Manage storefront category structure and counts.',
    path: '/dashboard/categories',
    noindex: true,
});

export const dynamic = 'force-dynamic';

export default async function DashboardCategoriesPage() {
    await requireDashboardRoles(['ADMIN', 'SUPER_ADMIN']);
    const categoriesResult = await getAllCategoriesWithTotalNewsCount().catch(() => null);
    const categories = Array.isArray(categoriesResult?.data) ? (categoriesResult.data as Array<{ name: string; slug?: string; totalNews?: number; isActive?: boolean }>) : [];

    return <DashboardCategoriesManager categories={categories} />;
}
