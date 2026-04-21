import type { Metadata } from 'next';
import { DashboardProductsManager } from '@/components/dashboard/DashboardProductsManager';
import { requireDashboardRoles } from '@/lib/dashboard-auth';
import { buildMetadata } from '@/lib/seo';
import { getAllProducts } from '@/services/Product';
import { getAllBrands } from '@/services/Brand';
import { getAllCategoriesWithTotalNewsCount } from '@/services/Category';
import type { BackendCategory } from '@/services/Category/mappers';

export const metadata: Metadata = buildMetadata({
    title: 'Products',
    description: 'Manage product catalog entries and inventory status.',
    path: '/dashboard/admin/products',
    noindex: true,
});

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
    await requireDashboardRoles(['ADMIN', 'SUPER_ADMIN']);
    const [productsResult, brandsResult, categoriesResult] = await Promise.all([
        getAllProducts().catch(() => null),
        getAllBrands().catch(() => null),
        getAllCategoriesWithTotalNewsCount().catch(() => null),
    ]);

    const products = productsResult?.data ?? [];
    const brandOptions = Array.isArray(brandsResult?.data)
        ? brandsResult.data.flatMap(brand => (brand._id ? [{ value: brand._id, label: brand.name }] : []))
        : [];
    const categories = Array.isArray(categoriesResult?.data) ? (categoriesResult.data as BackendCategory[]) : [];

    return (
        <DashboardProductsManager
            products={products}
            brandOptions={brandOptions}
            categories={categories}
        />
    );
}
