import Image from 'next/image';
import Link from 'next/link';

import { Container } from '@/components/Container';
import { MiniCartDropdown } from '@/components/cart/MiniCartDropdown';
import { brands, topCategories } from '@/lib/malamal-content';

export function Header() {
  return (
    <header className="w-full border-b border-black/10 bg-white shadow-sm">
      <div className="bg-[#0e2f56] py-2 text-xs text-white">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-semibold">
              Welcome to Malamal.com.bd. Thank you for staying with Malamal.
            </p>
            <a className="font-semibold text-white/90" href="tel:+8809638212121">
              Hotline: +880 9638212121
            </a>
          </div>
        </Container>
      </div>
      <div className="h-2 bg-[#f15a24]" />
      <Container>
        <div className="flex min-h-20 items-center gap-4 py-3 lg:min-h-20 lg:py-4">
          <Link
            href="/"
            className="flex shrink-0 items-center"
            aria-label="Malamal Home"
          >
            <Image
              src="https://i0.wp.com/malamal.com.bd/wp-content/uploads/2024/01/Logo-Malamal.com_.bd_.png?ssl=1"
              alt="Malamal.com.bd"
              width={192}
              height={40}
              priority
            />
          </Link>

          <div className="hidden items-center lg:flex">
            <details className="group relative">
              <summary className="list-none cursor-pointer rounded-full bg-[#0e2f56] px-4 py-3 text-sm font-semibold text-white outline-none [&::-webkit-details-marker]:hidden">
                Categories
              </summary>
              <div className="absolute left-0 top-full z-20 mt-3 hidden w-240 rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-black/5 group-open:block">
                <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.28em] text-[#f15a24]">Top categories</div>
                    <div className="mt-4 grid gap-2">
                      {topCategories.map(category => (
                        <Link key={category.name} href={category.href} className="rounded-2xl border border-black/8 px-4 py-3 hover:border-[#f15a24]/30 hover:bg-[#fff8f4]">
                          <div className="text-sm font-bold text-black">{category.name}</div>
                          <div className="mt-1 text-xs font-normal text-black/55">{category.description}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.28em] text-[#f15a24]">Quick links</div>
                    <div className="mt-4 grid gap-2">
                    {([
                        ['Shop', '/shop'],
                        ['Promotions', '/promotions'],
                        ['Main Categories', '/main-categories'],
                        ['Brands', '/shop-by-brands'],
                        ['Quotation Request', '/quotation-request'],
                        ['Our Contacts', '/our-contacts'],
                      ] as const).map(([label, href]) => (
                        <Link key={label} href={href} className="rounded-2xl border border-black/8 px-4 py-3 hover:border-[#f15a24]/30 hover:bg-[#fff8f4]">
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.28em] text-[#f15a24]">Popular brands</div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {brands.map(brand => (
                        <Link key={brand.name} href={brand.href} className="rounded-2xl border border-black/8 px-4 py-3 text-center hover:border-[#f15a24]/30 hover:bg-[#fff8f4]">
                          {brand.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>

          <div className="hidden flex-1 items-center xl:flex">
            <div className="flex w-full overflow-hidden rounded-full border border-black/10 bg-white shadow-sm">
              <input
                className="h-11 w-full px-4 text-sm outline-none"
                placeholder="Search tools, machines and brands"
                aria-label="Search"
              />
              <button
                type="button"
                className="h-11 cursor-pointer whitespace-nowrap bg-[#0e2f56] px-6 text-sm font-semibold text-white"
              >
                Search
              </button>
            </div>
          </div>

          <div className="ml-auto hidden items-center gap-3 md:flex">
            {([
              ['Compare', '/compare'],
              ['Wishlist', '/wishlist'],
            ] as const).map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 px-4 text-sm font-semibold text-black hover:border-[#f15a24]/30 hover:bg-[#fff8f4]"
              >
                {label}
              </Link>
            ))}
            <MiniCartDropdown />
            <div className="text-sm leading-tight">
              <div className="font-semibold text-black">Dedicated Support</div>
              <a
                className="font-semibold text-[#0e2f56]"
                href="tel:+8809638212121"
              >
                +880 9638212121
              </a>
            </div>
            <Link className="rounded-full bg-[#f15a24] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e45118]" href="/quotation-request">
              Quotation Request
            </Link>
          </div>
        </div>
      </Container>

      <div className="border-t border-black/5 bg-[#f5f6f8]">
        <Container>
          <nav className="hidden min-h-14 items-center justify-between gap-4 py-3 text-sm font-semibold text-black xl:flex">
            <div className="flex flex-wrap items-center gap-6">
              <Link className="hover:text-[#f15a24]" href="/shop">Shop</Link>
              <Link className="hover:text-[#f15a24]" href="/promotions">Promotions/Campaigns</Link>
              <Link className="hover:text-[#f15a24]" href="/main-categories">Main Categories</Link>
              <Link className="hover:text-[#f15a24]" href="/shop-by-brands">Shop By Brands</Link>
              <Link className="hover:text-[#f15a24]" href="/our-contacts">Our Contacts</Link>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              <Link className="hover:text-[#f15a24]" href="/my-account">My account</Link>
            </div>
          </nav>

          <details className="group py-3 lg:hidden">
            <summary className="list-none cursor-pointer rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black outline-none [&::-webkit-details-marker]:hidden">
              Menu
            </summary>
            <div className="mt-3 rounded-3xl bg-white p-4 shadow-lg ring-1 ring-black/5">
              <div className="grid gap-3">
                {([
                  ['Shop', '/shop'],
                  ['Promotions/Campaigns', '/promotions'],
                  ['Main Categories', '/main-categories'],
                  ['Shop By Brands', '/shop-by-brands'],
                  ['Quotation Request', '/quotation-request'],
                  ['Our Contacts', '/our-contacts'],
                  ['Compare', '/compare'],
                  ['Wishlist', '/wishlist'],
                  ['Cart', '/cart'],
                  ['My account', '/my-account'],
                ] as const).map(([label, href]) => (
                  <Link key={label} href={href} className="rounded-2xl border border-black/8 px-4 py-3 text-sm font-semibold text-black hover:border-[#f15a24]/30 hover:bg-[#fff8f4]">
                    {label}
                  </Link>
                ))}
              </div>
              <div className="mt-4">
                <div className="text-xs font-bold uppercase tracking-[0.28em] text-[#f15a24]">Categories</div>
                <div className="mt-3 grid gap-2">
                  {topCategories.map(category => (
                    <Link key={category.name} href={category.href} className="rounded-2xl border border-black/8 px-4 py-3 text-sm hover:border-[#f15a24]/30 hover:bg-[#fff8f4]">
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </details>
        </Container>
      </div>

      <div className="border-t border-black/5 bg-white xl:hidden">
        <Container>
          <div className="py-3">
            <div className="flex overflow-hidden rounded-full border border-black/10 bg-white shadow-sm">
              <input
                className="h-11 w-full px-4 text-sm outline-none"
                placeholder="Search tools, machines and brands"
                aria-label="Search"
              />
              <button
                type="button"
                className="h-11 cursor-pointer whitespace-nowrap bg-[#0e2f56] px-6 text-sm font-semibold text-white"
              >
                Search
              </button>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}
