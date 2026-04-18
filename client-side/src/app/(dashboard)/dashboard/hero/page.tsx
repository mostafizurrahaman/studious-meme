import type { Metadata } from 'next';

import { DashboardHeroManager } from '@/components/dashboard/DashboardHeroManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { requireDashboardRoles } from '@/lib/dashboard-auth';
import { buildMetadata } from '@/lib/seo';
import { getAllHeroSections, getHomeContent } from '@/services/HeroSection';

export const metadata: Metadata = buildMetadata({
    title: 'Hero Section',
    description: 'Manage homepage hero slides and featured cards.',
    path: '/dashboard/hero',
    noindex: true,
});

export const dynamic = 'force-dynamic';

export default async function DashboardHeroPage() {
    await requireDashboardRoles(['ADMIN', 'SUPER_ADMIN']);
    const [heroResult, allHeroResult] = await Promise.all([
        getHomeContent().catch(() => null),
        getAllHeroSections().catch(() => null),
    ]);
    const heroSection = heroResult?.data?.heroSection;
    const allHeroes = Array.isArray(allHeroResult?.data) ? allHeroResult.data : [];

    return (
        <div className="space-y-6">
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Homepage hero</CardTitle>
                    <CardDescription>Backend-driven home hero content and featured cards.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div>
                        <p className="mb-3 text-sm font-semibold">Slides</p>
                        <div className="space-y-3">
                            {heroSection?.slides?.map((slide, index) => (
                                <div
                                    key={`${slide.title}-${index}`}
                                    className="rounded-xl border bg-background p-3 text-sm"
                                >
                                    <div className="font-medium">{slide.title}</div>
                                    <div className="text-muted-foreground">{slide.description}</div>
                                </div>
                            )) ?? (
                                <div className="text-sm text-muted-foreground">No slide data available.</div>
                            )}
                        </div>
                    </div>
                    <div>
                        <p className="mb-3 text-sm font-semibold">Features</p>
                        <div className="space-y-3">
                            {heroSection?.features?.map((card, index) => (
                                <div
                                    key={`${card.title}-${index}`}
                                    className="rounded-xl border bg-background p-3 text-sm"
                                >
                                    <div className="font-medium">{card.title}</div>
                                    <div className="text-muted-foreground">{card.description}</div>
                                </div>
                            )) ?? (
                                <div className="text-sm text-muted-foreground">
                                    No feature card data available.
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Attached catalog data</CardTitle>
                    <CardDescription>
                        Brands, categories and product highlights surfaced by the backend hero endpoint.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 text-sm">
                    {[
                        ['Brands', heroResult?.data?.brands?.length ?? 0],
                        ['Categories', heroResult?.data?.categories?.length ?? 0],
                        ['Featured products', heroResult?.data?.featuredProducts?.length ?? 0],
                        ['Latest products', heroResult?.data?.latestProducts?.length ?? 0],
                    ].map(([label, value]) => (
                        <div key={String(label)} className="rounded-xl border p-4">
                            <div className="text-muted-foreground">{label}</div>
                            <div className="mt-1 text-2xl font-black">{String(value)}</div>
                        </div>
                    ))}
                </CardContent>
            </Card>
            <DashboardHeroManager heroes={allHeroes} />
        </div>
    );
}
