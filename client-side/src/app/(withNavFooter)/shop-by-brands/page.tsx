import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { brands } from '@/lib/malamal-content';
import { SeoScripts } from '@/components/SeoScripts';
import { buildShopByBrandsSchemas, shopByBrandsMetadata } from '@/lib/seo';
import { getAllBrands, mapBackendBrandToStorefrontBrand } from '@/services/Brand';

export const metadata = shopByBrandsMetadata;
export const dynamic = 'force-dynamic';

export default async function ShopByBrandsPage() {
    const brandsResult = await getAllBrands().catch(() => null);
    const brandItems = brandsResult?.data?.length
        ? await Promise.all(brandsResult.data.map(mapBackendBrandToStorefrontBrand))
        : brands;

    return (
        <>
            <SeoScripts data={buildShopByBrandsSchemas(brandItems)} />
            <main className="flex-1 bg-background pb-16">
                <div className="mx-auto w-full max-w-350 px-4 py-6 lg:px-6">
                    <Card className="border-0 bg-secondary p-6 text-secondary-foreground shadow-sm sm:p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary-foreground/65">
                            Brand directory
                        </p>
                        <h1 className="mt-4 text-3xl font-black sm:text-4xl">Shop By Brands</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-secondary-foreground/78 sm:text-base">
                            Brand browsing page with the names and collections used across the store.
                        </p>
                    </Card>

                    <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {brandItems.map(brand => (
                            <Link key={brand.name} href={brand.href} className="group">
                                <Card className="h-full p-6 text-center shadow-sm transition group-hover:-translate-y-0.5 group-hover:shadow-md">
                                    <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted">
                                        <Image
                                            src={brand.image}
                                            alt={brand.name}
                                            width={96}
                                            height={96}
                                            className="h-full w-full rounded-2xl bg-background object-contain p-2"
                                        />
                                    </div>
                                    <div className="mt-4 text-xl font-black text-secondary">{brand.name}</div>
                                    <div className="mt-2 text-sm text-foreground/55">View brand products</div>
                                </Card>
                            </Link>
                        ))}
                    </section>
                </div>
            </main>
        </>
    );
}
