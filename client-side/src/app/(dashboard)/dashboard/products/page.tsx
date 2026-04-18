import type { Metadata } from 'next';

import { DashboardProductsManager } from '@/components/dashboard/DashboardProductsManager';
import { requireDashboardRoles } from '@/lib/dashboard-auth';
import { buildMetadata } from '@/lib/seo';
import { getAllProducts } from '@/services/Product';
import { getAllBrands } from '@/services/Brand';
import { getAllCategoriesWithTotalNewsCount } from '@/services/Category';

export const metadata: Metadata = buildMetadata({
    title: 'Products',
    description: 'Manage product catalog entries and inventory status.',
    path: '/dashboard/products',
    noindex: true,
});

export const dynamic = 'force-dynamic';

export default async function DashboardProductsPage() {
    await requireDashboardRoles(['ADMIN', 'SUPER_ADMIN']);
    const [productsResult, brandsResult, categoriesResult] = await Promise.all([
        getAllProducts().catch(() => null),
        getAllBrands().catch(() => null),
        getAllCategoriesWithTotalNewsCount().catch(() => null),
    ]);

    const products = productsResult?.data ?? [];
    const brandOptions = Array.isArray(brandsResult?.data)
        ? brandsResult.data.map(brand => ({ value: brand.slug, label: brand.name }))
        : [];
    const categoryOptions = Array.isArray(categoriesResult?.data)
        ? categoriesResult.data.map(category => ({ value: category.slug, label: category.name }))
        : [];

    return (
        <DashboardProductsManager
            products={products}
            brandOptions={brandOptions}
            categoryOptions={categoryOptions}
        />
    );
}
