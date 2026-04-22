import Link from 'next/link';

import { SeoScripts } from '@/components/SeoScripts';
import { Card } from '@/components/ui/card';
import { getCategoryAccentClassName, getCategoryAccentStyle } from '@/lib/category-accent';
import { buildMainCategoriesSchemas, mainCategoriesMetadata } from '@/lib/seo';
import { getActiveCategories } from '@/services/Category';
import { mapBackendCategoryToStorefrontCategory, type BackendCategory } from '@/services/Category/mappers';

export const metadata = mainCategoriesMetadata;
export const revalidate = 300;

export default async function MainCategoriesPage() {
  const categoriesResult = await getActiveCategories().catch(() => null);
  const backendCategories = Array.isArray(categoriesResult?.data)
    ? categoriesResult.data.map(item => mapBackendCategoryToStorefrontCategory(item as BackendCategory))
    : [];
  const spotlightCards = backendCategories.slice(0, 6).map(category => ({
    title: category.name,
    description: category.description,
    href: category.href,
    accent: category.accent,
  }));

  return (
    <>
      <SeoScripts data={buildMainCategoriesSchemas(backendCategories)} />
      <main className="flex-1 bg-background pb-16">
        <div className="mx-auto w-full max-w-350 px-4 py-6 lg:px-6">
          <Card className="p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Main categories</p>
            <h1 className="mt-4 text-3xl font-black text-secondary sm:text-4xl">All Categories</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/65 sm:text-base">
              The category hub brings together the full storefront structure with cards, spotlights and quick
              links.
            </p>
          </Card>

          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {backendCategories.map(category => (
              <Link key={category.name} href={category.href} className="group">
                <Card className="h-full p-5 shadow-sm transition group-hover:-translate-y-0.5 group-hover:shadow-md">
                  <div className="text-lg font-extrabold text-secondary">{category.name}</div>
                  <p className="mt-2 text-sm leading-7 text-foreground/65">{category.description}</p>
                </Card>
              </Link>
            ))}
          </section>

          <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {spotlightCards.map(card => (
              <Link
                key={card.title}
                href={card.href}
                className={`rounded-3xl p-6 text-white shadow-sm ${getCategoryAccentClassName(card.accent)}`}
                style={getCategoryAccentStyle(card.accent)}
              >
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-white/65">
                  Spotlight
                </div>
                <h2 className="mt-4 text-2xl font-black text-white">{card.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/90">{card.description}</p>
                <span className="mt-6 inline-flex w-fit rounded-full bg-white/18 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                  Explore category
                </span>
              </Link>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}
