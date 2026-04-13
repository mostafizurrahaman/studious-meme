import Link from 'next/link';

import { categoryShowcase, topCategories } from '@/lib/malamal-content';
import { SeoScripts } from '@/components/SeoScripts';
import { mainCategoriesMetadata, mainCategoriesSchemas } from '@/lib/seo';

export const metadata = mainCategoriesMetadata;

export default function MainCategoriesPage() {
  return (
    <>
      <SeoScripts data={mainCategoriesSchemas} />
      <main className="flex-1 bg-[#f5f6f8] pb-16">
      <div className="mx-auto w-full max-w-350 px-4 py-6 lg:px-6">
        <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15a24]">
            Main categories
          </p>
          <h1 className="mt-4 text-3xl font-black text-[#0e2f56] sm:text-4xl">
            All Categories
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-black/65 sm:text-base">
            The category hub brings together the full storefront structure with cards,
            spotlights and quick links.
          </p>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {topCategories.map(category => (
            <Link
              key={category.name}
              href={category.href}
              className="rounded-3xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-lg font-extrabold text-[#0e2f56]">{category.name}</div>
              <p className="mt-2 text-sm leading-7 text-black/65">{category.description}</p>
            </Link>
          ))}
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categoryShowcase.map(card => (
            <Link
              key={card.title}
              href={card.href}
              className={`rounded-3xl bg-linear-to-br ${card.accent} p-6 text-white shadow-sm`}
            >
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-white/65">
                Spotlight
              </div>
              <h2 className="mt-4 text-2xl font-black text-white">{card.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/90">{card.description}</p>
              <div className="mt-6 inline-flex items-center rounded-full bg-white/18 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                Explore category
              </div>
            </Link>
          ))}
        </section>
      </div>
      </main>
    </>
  );
}
