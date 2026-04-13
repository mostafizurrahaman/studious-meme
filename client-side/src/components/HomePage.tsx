"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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

const heroSlides = [
  {
    title: 'Industrial tools for every project',
    description:
      'Dedicated categories for workshop, construction, cleaning and packaging equipment.',
    image:
      'https://malamal.com.bd/wp-content/uploads/2025/01/vacuum-packaging-sealer-machine-dz-400-pc.webp',
    href: '/shop',
  },
  {
    title: 'Reliable welding and cutting machines',
    description:
      'High-volume gear with a clean buying flow for the full catalog.',
    image:
      'https://malamal.com.bd/wp-content/uploads/2024/11/winner-welding-machine-pc.webp',
    href: '/shop',
  },
  {
    title: 'Garage tools and cleaning solutions',
    description:
      'Product discovery built like the reference site with a fast browsing experience.',
    image:
      'https://malamal.com.bd/wp-content/uploads/2024/11/garage-tools-and-equipment-pc.webp',
    href: '/shop',
  },
] as const;

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

export function HomePage() {
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex(current => (current + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const goToPrevious = () =>
    setHeroIndex(current => (current - 1 + heroSlides.length) % heroSlides.length);

  const goToNext = () =>
    setHeroIndex(current => (current + 1) % heroSlides.length);

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
                      <Card className="overflow-hidden shadow-sm">
                          <div className="grid h-full gap-4 p-3 sm:p-6 lg:grid-cols-[1.22fr_0.78fr] lg:p-6">
                              <div className="ui-image-card relative min-h-105 overflow-hidden rounded-3xl bg-muted sm:min-h-125 lg:min-h-125">
                                  <Image
                                      src={heroSlides[heroIndex].image}
                                      alt={heroSlides[heroIndex].title}
                                      fill
                                      sizes="(max-width: 1024px) 100vw, 760px"
                                      className="object-cover object-[center_top] p-2 transition duration-500 ease-out sm:p-4"
                                  />

                                  <Button
                                      type="button"
                                      onClick={goToPrevious}
                                      aria-label="Previous banner"
                                      variant="secondary"
                                      size="icon"
                                      className="absolute left-3 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full bg-transparent text-foreground shadow-md backdrop-blur-sm transition hover:bg-background"
                                  >
                                      <ArrowLeft className="h-4 w-4" />
                                  </Button>
                                  <Button
                                      type="button"
                                      onClick={goToNext}
                                      aria-label="Next banner"
                                      variant="secondary"
                                      size="icon"
                                      className="absolute right-3 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full bg-transparent text-foreground shadow-md backdrop-blur-sm transition hover:bg-background"
                                  >
                                      <ArrowRight className="h-4 w-4" />
                                  </Button>

                                  <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full bg-background/90 px-3 py-2 shadow-sm backdrop-blur-sm">
                                      {heroSlides.map((slide, index) => (
                                          <button
                                              key={slide.title}
                                              type="button"
                                              onClick={() => setHeroIndex(index)}
                                              aria-label={`Go to banner ${index + 1}`}
                                              className={`h-2.5 rounded-full transition-all ${index === heroIndex ? 'w-7 bg-primary' : 'w-2.5 bg-border'}`}
                                          />
                                      ))}
                                  </div>
                              </div>

                              <div className="space-y-4 rounded-3xl border border-border bg-card p-4 sm:p-5 lg:space-y-5 lg:p-6">
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
                                      Best Online Hardware Store
                                  </p>
                                  <h1 className="max-w-lg text-3xl font-black leading-[1.05] text-secondary sm:text-4xl">
                                      {heroSlides[heroIndex].title}
                                  </h1>
                                  <p className="text-sm leading-6 text-foreground/70 sm:text-base">
                                      {heroSlides[heroIndex].description}
                                  </p>
                                  <div className="flex flex-col gap-2.5 sm:flex-row">
                                      <Button
                                          asChild
                                          className="h-10 rounded-full px-4 text-sm font-bold shadow-sm"
                                      >
                                          <Link href={heroSlides[heroIndex].href}>Shop Now</Link>
                                      </Button>
                                      <Button
                                          asChild
                                          variant="outline"
                                          className="h-10 rounded-full border-border px-4 text-sm font-bold text-foreground hover:bg-primary hover:text-white"
                                      >
                                          <Link href="/promotions">View Promotions</Link>
                                      </Button>
                                  </div>
                              </div>

                              <div className="hidden gap-4 lg:grid lg:grid-cols-1">
                                  <Link
                                      href={heroSlides[1].href}
                                      className="ui-image-card group relative min-h-80 cursor-pointer overflow-hidden rounded-3xl border border-border bg-muted shadow-sm"
                                  >
                                      <Image
                                          src={heroSlides[1].image}
                                          alt={heroSlides[1].title}
                                          fill
                                          sizes="(max-width: 1024px) 33vw, 300px"
                                          className="object-cover transition duration-300 group-hover:scale-105"
                                      />
                                      <div className="absolute inset-0 bg-linear-to-r from-black/10 via-black/5 to-transparent" />
                                      <Badge className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white shadow-sm">
                                          Feature 1
                                      </Badge>
                                  </Link>

                                  <div className="grid grid-cols-2 gap-4">
                                      {[heroSlides[0], heroSlides[2]].map((slide, index) => (
                                          <Link
                                              key={slide.title}
                                              href={slide.href}
                                              className="ui-image-card group relative min-h-40 cursor-pointer overflow-hidden rounded-3xl border border-border bg-muted shadow-sm"
                                          >
                                              <Image
                                                  src={slide.image}
                                                  alt={slide.title}
                                                  fill
                                                  sizes="(max-width: 1024px) 16vw, 150px"
                                                  className="object-cover transition duration-300 group-hover:scale-105"
                                              />
                                              <div className="absolute inset-0 bg-linear-to-r from-black/10 via-black/5 to-transparent" />
                                              <Badge className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white shadow-sm">
                                                  Feature {index + 2}
                                              </Badge>
                                          </Link>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      </Card>
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
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                              {featuredProducts.map(product => (
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
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                              {latestProducts.map(product => (
                                  <ProductCard key={product.sku} product={product} />
                              ))}
                          </div>
                      </CardContent>
                  </Card>

                  <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {categoryShowcase.map(card => (
                          <Link
                              key={card.title}
                              href={card.href}
                              className={`ui-card group flex h-full cursor-pointer flex-col bg-linear-to-br ${card.accent} p-6 text-white shadow-sm`}
                          >
                              <Badge
                                  variant="secondary"
                                  className="w-fit rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.32em]"
                              >
                                  Category spotlight
                              </Badge>
                              <h3 className="mt-6 text-[26px] font-black leading-tight text-white">
                                  {card.title}
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
                              {brands.map(brand => (
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
                                      Malamal.com.bd is positioned as a trusted online hardware and industrial
                                      supply store in Bangladesh, serving workshop, maintenance and project
                                      buyers with a broad catalog.
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
