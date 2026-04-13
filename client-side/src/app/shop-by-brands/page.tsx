import Image from 'next/image';
import Link from 'next/link';

import { brands } from '@/lib/malamal-content';
import { SeoScripts } from '@/components/SeoScripts';
import { shopByBrandsMetadata, shopByBrandsSchemas } from '@/lib/seo';

export const metadata = shopByBrandsMetadata;

export default function ShopByBrandsPage() {
  return (
      <>
          <SeoScripts data={shopByBrandsSchemas} />
          <main className="flex-1 bg-[#f5f6f8] pb-16">
              <div className="mx-auto w-full max-w-350 px-4 py-6 lg:px-6">
                  <section className="rounded-3xl bg-[#0e2f56] p-6 text-white shadow-sm sm:p-8">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/65">
                          Brand directory
                      </p>
                      <h1 className="mt-4 text-3xl font-black sm:text-4xl">Shop By Brands</h1>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/78 sm:text-base">
                          Brand browsing page with the names and collections used across the store.
                      </p>
                  </section>

                  <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {brands.map(brand => (
                          <Link
                              key={brand.name}
                              href={brand.href}
                              className="rounded-2xl bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                          >
                              <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-black/8 bg-[#f5f6f8]">
                                  <Image
                                      src={brand.image}
                                      alt={brand.name}
                                      width={96}
                                      height={96}
                                      className="h-full w-full rounded-2xl bg-white object-contain p-2"
                                  />
                              </div>
                              <div className="mt-4 text-xl font-black text-[#0e2f56]">{brand.name}</div>
                              <div className="mt-2 text-sm text-black/55">View brand products</div>
                          </Link>
                      ))}
                  </section>
              </div>
          </main>
      </>
  );
}
