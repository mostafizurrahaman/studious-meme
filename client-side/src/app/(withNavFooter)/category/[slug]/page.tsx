import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { CategoryPageClient } from '@/components/CategoryPageClient';
import { SeoScripts } from '@/components/SeoScripts';
import { Card } from '@/components/ui/card';
import { categoryPages, findCategoryBySlug, getProductsByCategory } from '@/lib/malamal-content';
import { buildCategoryMetadata, buildCategorySchemas } from '@/lib/seo';
import { getAllBrands } from '@/services/Brand';
import { getCategoryBySlug } from '@/services/Category';
import { mapBackendCategoryToCategoryPageEntry } from '@/services/Category/mappers';
import { getProductsByCategorySlug, mapBackendProductToStorefrontProduct } from '@/services/Product';

type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{
        b?: string;
        s?: string;
        p?: string;
        page?: string;
        limit?: string;
    }>;
};

export function generateStaticParams() {
    return categoryPages.map(category => ({ slug: category.slug }));
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const backendCategory = await getCategoryBySlug(slug).catch(() => null);
    const category = backendCategory?.data
        ? mapBackendCategoryToCategoryPageEntry(backendCategory.data)
        : findCategoryBySlug(slug);

    if (!category) {
        return {
            title: 'Category not found',
            robots: { index: false, follow: false },
        };
    }

    return buildCategoryMetadata(category);
}

const DEFAULT_CATEGORY_LIMIT = 24;

export default async function CategoryPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const query = await searchParams;
    const page = Math.max(Number(query.page ?? '1') || 1, 1);
    const limit = Math.max(Number(query.limit ?? String(DEFAULT_CATEGORY_LIMIT)) || DEFAULT_CATEGORY_LIMIT, 1);
    const backendCategory = await getCategoryBySlug(slug).catch(() => null);
    const category = backendCategory?.data
        ? mapBackendCategoryToCategoryPageEntry(backendCategory.data)
        : findCategoryBySlug(slug);

    if (!category) {
        notFound();
    }

    const title = 'name' in category ? category.name : category.title;
    const [productsResult, brandsResult] = await Promise.all([
        getProductsByCategorySlug(slug, {
            page,
            limit,
            b: query.b,
            s: query.s,
            p: query.p,
        }).catch(() => null),
        getAllBrands().catch(() => null),
    ]);
    const products = productsResult?.data?.length
        ? await Promise.all(productsResult.data.map(mapBackendProductToStorefrontProduct))
        : getProductsByCategory(title);
    const meta = {
        total: productsResult?.meta?.total ?? products.length,
        limit: productsResult?.meta?.limit ?? limit,
        currentPage: productsResult?.meta?.currentPage ?? productsResult?.meta?.page ?? page,
        totalPages: productsResult?.meta?.totalPages ?? productsResult?.meta?.totalPage ?? 1,
    };
    const brandFilters = brandsResult?.data?.map(brand => brand.name).filter(Boolean) ?? [];

    return (
        <>
            <SeoScripts data={buildCategorySchemas(category, products)} />
            <main className="flex-1 bg-background pb-16">
                <div className="mx-auto w-full max-w-350 px-4 py-6 lg:px-6">
                    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-foreground/55">
                        <ol className="flex flex-wrap items-center gap-2">
                            <li>
                                <Link href="/" className="cursor-pointer hover:text-primary">
                                    Home
                                </Link>
                            </li>
                            <li>/</li>
                            <li>
                                <Link href="/main-categories" className="cursor-pointer hover:text-primary">
                                    Main Categories
                                </Link>
                            </li>
                            <li>/</li>
                            <li className="font-semibold text-foreground/75">{title}</li>
                        </ol>
                    </nav>
                    <Suspense fallback={<Card className="p-6 shadow-sm">Loading category...</Card>}>
                        <CategoryPageClient
                            category={category}
                            products={products}
                            brands={brandFilters}
                            meta={meta}
                        />
                    </Suspense>
                    <Card className="mt-6 flex items-center justify-between p-4 text-sm shadow-sm">
                        <span className="text-foreground/60">Need a broader view?</span>
                        <Link href="/main-categories" className="cursor-pointer font-semibold text-primary">
                            Back to categories
                        </Link>
                    </Card>
                </div>
            </main>
        </>
    );
}
