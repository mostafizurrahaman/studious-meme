import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getCategoryAccentClassName, getCategoryAccentStyle } from '@/lib/category-accent';
import {
    brands,
    categoryShowcase,
    featuredProducts,
    latestProducts,
    offerProducts,
} from '@/lib/malamal-content';
import { ProductCard } from '@/components/ProductCard';
import { SectionHeading } from '@/components/SectionHeading';
import { Container } from '@/components/Container';
import { HomeHeroCarousel } from '@/components/HomeHeroCarousel';
import { mapBackendBrandToStorefrontBrand, type BackendBrand } from '@/services/Brand';
import { mapBackendCategoryToStorefrontCategory, type BackendCategory } from '@/services/Category/mappers';
import { mapBackendProductToStorefrontProduct, type BackendProduct } from '@/services/Product';

type HeroSlide = {
    title: string;
    description: string;
    image: string;
    href: string;
};

type HomePageProps = {
    heroContent?: {
        heroSection?: {
            slides?: Array<{
                title: string;
                description: string;
                image: string;
                clickUrl: string;
            }>;
            features?: Array<{
                title: string;
                description: string;
                image: string;
                clickUrl: string;
            }>;
        } | null;
        brands?: BackendBrand[];
        categories?: BackendCategory[];
        featuredProducts?: BackendProduct[];
        latestProducts?: BackendProduct[];
    } | null;
};

function SectionMarquee() {
    const message =
        'Welcome to Malamal.com.bd. Thank you for staying with Malamal | Malamal এর পক্ষ থেকে সবাইকে জানাই স্বাগত ও শুভকামনা ।';

    return (
        <Card className="overflow-hidden border-primary/20 py-3 shadow-sm">
            <div className="animate-[marquee_28s_linear_infinite] whitespace-nowrap text-sm font-semibold text-primary">
                <span className="inline-block px-6">{message}</span>
                <span className="inline-block px-6">{message}</span>
                <span className="inline-block px-6">{message}</span>
            </div>
        </Card>
    );
}

export async function HomePage({ heroContent }: HomePageProps) {
    const heroSlides: HeroSlide[] = heroContent?.heroSection?.slides?.length
        ? heroContent.heroSection.slides.map(slide => ({
              title: slide.title,
              description: slide.description,
              image: slide.image,
              href: slide.clickUrl || '/shop',
          }))
        : [
              {
                  title: 'Industrial tools for every project',
                  description:
                      'Dedicated categories for workshop, construction, cleaning and packaging equipment.',
                  image: 'https://malamal.com.bd/wp-content/uploads/2025/01/vacuum-packaging-sealer-machine-dz-400-pc.webp',
                  href: '/shop',
              },
              {
                  title: 'Reliable welding and cutting machines',
                  description: 'High-volume gear with a clean buying flow for the full catalog.',
                  image: 'https://malamal.com.bd/wp-content/uploads/2024/11/winner-welding-machine-pc.webp',
                  href: '/shop',
              },
              {
                  title: 'Garage tools and cleaning solutions',
                  description:
                      'Product discovery built like the reference site with a fast browsing experience.',
                  image: 'https://malamal.com.bd/wp-content/uploads/2024/11/garage-tools-and-equipment-pc.webp',
                  href: '/shop',
              },
          ];

    const heroFeatures: HeroSlide[] = heroContent?.heroSection?.features?.length
        ? heroContent.heroSection.features.map(card => ({
              title: card.title,
              description: card.description,
              image: card.image,
              href: card.clickUrl || '/shop',
          }))
        : heroSlides;

    const featuredCatalog = heroContent?.featuredProducts?.length
        ? await Promise.all(heroContent.featuredProducts.map(mapBackendProductToStorefrontProduct))
        : featuredProducts;

    const latestCatalog = heroContent?.latestProducts?.length
        ? await Promise.all(heroContent.latestProducts.map(mapBackendProductToStorefrontProduct))
        : latestProducts;

    const categoryCards = heroContent?.categories?.length
        ? heroContent.categories.slice(0, 6).map(mapBackendCategoryToStorefrontCategory)
        : categoryShowcase;

    const brandItems = heroContent?.brands?.length
        ? await Promise.all(heroContent.brands.map(mapBackendBrandToStorefrontBrand))
        : brands;

    return (
        <main className="flex-1 bg-background pb-16">
            <Container>
                <div className="py-6">
                    <div className="mb-4 flex justify-center lg:hidden">
                        <Link
                            href="/main-categories"
                            className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-white! shadow-sm"
                        >
                            All Categories
                        </Link>
                    </div>

                    <section>
                        <HomeHeroCarousel slides={heroSlides} features={heroFeatures} />
                    </section>

                    <div className="mt-4">
                        <SectionMarquee />
                    </div>

                    <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {[
                            'FASTEST DELIVERY POSSIBLE',
                            'SECURE PAYMENT SYSTEM',
                            'CASH ON DELIVERY AT YOUR DOORS',
                            'AUTHENTICITY 100% GUARANTEED',
                        ].map(item => (
                            <div
                                key={item}
                                className="rounded-2xl border border-border bg-card p-4 text-center shadow-sm"
                            >
                                <div className="mb-2 mx-auto h-2.5 w-2.5 rounded-full bg-primary" />
                                <div className="text-[11px] font-extrabold tracking-[0.18em] text-secondary">
                                    {item}
                                </div>
                            </div>
                        ))}
                    </section>

                    <Card className="mt-8 shadow-sm">
                        <CardHeader className="px-5 pb-0 pt-5 sm:px-6">
                            <SectionHeading title="The Best Offers" actionHref="/shop" />
                        </CardHeader>
                        <CardContent className="px-5 pb-5 pt-6 sm:px-6">
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
                                {offerProducts.map(product => (
                                    <ProductCard key={product.sku} product={product} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-8 shadow-sm">
                        <CardHeader className="px-5 pb-0 pt-5 sm:px-6">
                            <SectionHeading title="Featured products" actionHref="/shop" />
                        </CardHeader>
                        <CardContent className="px-5 pb-5 pt-6 sm:px-6">
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
                                {featuredCatalog.map(product => (
                                    <ProductCard key={product.sku} product={product} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-8 shadow-sm">
                        <CardHeader className="px-5 pb-0 pt-5 sm:px-6">
                            <SectionHeading title="Latest Products" actionHref="/shop" />
                        </CardHeader>
                        <CardContent className="px-5 pb-5 pt-6 sm:px-6">
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
                                {latestCatalog.map(product => (
                                    <ProductCard key={product.sku} product={product} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {categoryCards.map(card => (
                            <Link
                                key={card.slug}
                                href={card.href}
                                className={`ui-card group flex h-full cursor-pointer flex-col p-6 text-white shadow-sm ${getCategoryAccentClassName(card.accent)}`}
                                style={getCategoryAccentStyle(card.accent)}
                            >
                                <Badge
                                    variant="secondary"
                                    className="w-fit rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.32em]"
                                >
                                    Category spotlight
                                </Badge>
                                <h3 className="mt-6 text-[26px] font-black leading-tight text-white">
                                    {'name' in card ? card.name : card.title}
                                </h3>
                                <p className="mt-3 max-w-md text-sm leading-7 text-white/90">
                                    {card.description}
                                </p>
                                <span className="mt-auto self-center rounded-full bg-white/18 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition group-hover:bg-white/24">
                                    Explore category
                                </span>
                            </Link>
                        ))}
                    </section>

                    <Card className="mt-8 shadow-sm">
                        <CardHeader className="px-5 pb-0 pt-5 sm:px-6">
                            <SectionHeading title="Shop By Brands" actionHref="/shop-by-brands" />
                        </CardHeader>
                        <CardContent className="px-5 pb-5 pt-6 sm:px-6">
                            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
                                {brandItems.map(brand => (
                                    <Link
                                        key={brand.name}
                                        href={brand.href}
                                        className="rounded-xl border border-border px-4 py-5 text-center text-sm font-bold text-foreground transition hover:border-primary/30 hover:bg-primary hover:text-primary-foreground cursor-pointer"
                                    >
                                        <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg bg-background shadow-sm">
                                            <Image
                                                src={brand.image}
                                                alt={brand.name}
                                                width={64}
                                                height={64}
                                                className="h-full w-full rounded-xl object-contain p-2"
                                            />
                                        </div>
                                        <div className="mt-3">{brand.name}</div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-8 grid gap-6 border-0 bg-secondary p-6 text-secondary-foreground shadow-sm lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary-foreground/65">
                                Built for the storefront workflow
                            </p>
                            <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
                                Catalog, cart and checkout flows are all covered here.
                            </h2>
                            <p className="mt-4 max-w-2xl text-sm leading-7 text-secondary-foreground/78 sm:text-base">
                                The structure mirrors the storefront and keeps product, cart and checkout
                                sections aligned for the full shopping experience.
                            </p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {[
                                ['SEO content', 'Built for content-rich catalog pages'],
                                ['Product grids', 'Structured for live data'],
                                ['Navigation', 'Matches the existing shop flow'],
                                ['Performance', 'Minimal client-side code'],
                            ].map(([title, text]) => (
                                <div key={title} className="rounded-2xl bg-white/10 p-4">
                                    <div className="font-semibold">{title}</div>
                                    <div className="mt-1 text-sm text-secondary-foreground/75">{text}</div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="mt-8 shadow-sm">
                        <CardContent className="p-6">
                            <h2 className="text-xl font-black text-secondary sm:text-2xl">
                                Malamal.com.bd hardware store overview
                            </h2>
                            <Separator className="my-5" />
                            <div className="grid gap-6 text-sm leading-7 text-foreground/70 lg:grid-cols-2">
                                <div className="space-y-4">
                                    <p>
                                        Malamal.com.bd is positioned as a trusted online hardware and
                                        industrial supply store in Bangladesh, serving workshop, maintenance
                                        and project buyers with a broad catalog.
                                    </p>
                                    <p>
                                        This frontend keeps the storefront hierarchy, brand focus and product
                                        merchandising style while staying easy to connect to live data.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <p>
                                        Product grids, account areas and quotation forms are laid out so the
                                        site can connect to live data without changing the structure.
                                    </p>
                                    <p>
                                        The current build intentionally keeps the homepage mostly
                                        server-rendered and lightweight for fast initial load.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Container>
        </main>
    );
}
