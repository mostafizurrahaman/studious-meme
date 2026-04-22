import { FloatingCategoryRail } from '@/components/FloatingCategoryRail';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { MobileToolbar } from '@/components/MobileToolbar';
import { getAllBrands, mapBackendBrandToStorefrontBrand } from '@/services/Brand';
import { getAllCategoriesWithTotalNewsCount } from '@/services/Category';
import { mapBackendCategoryToStorefrontCategory, type BackendCategory } from '@/services/Category/mappers';

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
    const [categoriesResult, brandsResult] = await Promise.all([
        getAllCategoriesWithTotalNewsCount().catch(() => null),
        getAllBrands().catch(() => null),
    ]);

    const categories = Array.isArray(categoriesResult?.data)
        ? categoriesResult.data
              .map(item => mapBackendCategoryToStorefrontCategory(item as BackendCategory))
              .slice(0, 12)
        : [];

    const brands = brandsResult?.data?.length
        ? await Promise.all(brandsResult.data.slice(0, 12).map(mapBackendBrandToStorefrontBrand))
        : [];

    return (
        <div>
            <Header categories={categories} brands={brands} />
            <FloatingCategoryRail categories={categories} />
            <div className="min-h-screen">{children}</div>
            <Footer categories={categories} brands={brands} />
            <MobileToolbar />
        </div>
    );
};

export default MainLayout;
