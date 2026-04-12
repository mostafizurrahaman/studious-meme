import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { CategoryPageClient } from '@/components/CategoryPageClient';
import { SeoScripts } from '@/components/SeoScripts';
import { categoryPages, findCategoryBySlug, getProductsByCategory } from '@/lib/malamal-content';
import { buildCategoryMetadata, buildCategorySchemas } from '@/lib/seo';

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return categoryPages.map(category => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = findCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Category not found',
      robots: { index: false, follow: false },
    };
  }

  return buildCategoryMetadata(category);
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = findCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const title = 'name' in category ? category.name : category.title;
  const products = getProductsByCategory(title);

  return (
    <>
      <SeoScripts data={buildCategorySchemas(category)} />
      <main className="flex-1 bg-[#f5f6f8] pb-16">
        <div className="mx-auto w-full max-w-350 px-4 py-6 lg:px-6">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-black/55">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="cursor-pointer hover:text-[#f15a24]">Home</Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/main-categories" className="cursor-pointer hover:text-[#f15a24]">Main Categories</Link>
              </li>
              <li>/</li>
              <li className="font-semibold text-black/75">{title}</li>
            </ol>
          </nav>
          <Suspense fallback={<div className="rounded-3xl bg-white p-6 shadow-sm">Loading category...</div>}>
            <CategoryPageClient category={category} products={products} />
          </Suspense>
          <section className="mt-6 flex items-center justify-between rounded-3xl bg-white p-4 text-sm shadow-sm">
            <span className="text-black/60">Need a broader view?</span>
            <Link href="/main-categories" className="cursor-pointer font-semibold text-[#f15a24]">
              Back to categories
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
