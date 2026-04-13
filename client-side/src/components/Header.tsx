import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Container } from '@/components/Container';
import { MiniCartDropdown } from '@/components/cart/MiniCartDropdown';
import { brands, topCategories } from '@/lib/malamal-content';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/10 bg-white text-black shadow-sm">
      <Container>
        <div className="flex min-h-18 items-center gap-4 py-2.5 lg:min-h-18 lg:py-3">
          <Link
            href="/"
            className="flex shrink-0 items-center"
            aria-label="Malamal Home"
          >
            <Image
              src="https://i0.wp.com/malamal.com.bd/wp-content/uploads/2024/01/Logo-Malamal.com_.bd_.png?ssl=1"
              alt="Malamal.com.bd"
              width={182}
              height={36}
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
                    <div className="text-xs font-bold uppercase tracking-[0.28em] text-primary">
                      Top categories
                    </div>
                    <div className="mt-4 grid gap-2">
                      {topCategories.map(category => (
                        <Link
                          key={category.name}
                          href={category.href}
                          className="rounded-2xl border border-black/8 px-4 py-3 hover:border-primary/30 hover:bg-primary"
                        >
                          <div className="text-sm font-bold text-black">
                            {category.name}
                          </div>
                          <div className="mt-1 text-xs font-normal text-black/55">
                            {category.description}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.28em] text-primary">
                      Quick links
                    </div>
                    <div className="mt-4 grid gap-2">
                      {(
                        [
                          ['Shop', '/shop'],
                          ['Promotions', '/promotions'],
                          ['Main Categories', '/main-categories'],
                          ['Brands', '/shop-by-brands'],
                          ['Quotation Request', '/quotation-request'],
                          ['Our Contacts', '/our-contacts'],
                        ] as const
                      ).map(([label, href]) => (
                        <Link
                          key={label}
                          href={href}
                          className="rounded-2xl border border-black/8 px-4 py-3 hover:border-primary/30 hover:bg-primary"
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.28em] text-primary">
                      Popular brands
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {brands.map(brand => (
                        <Link
                          key={brand.name}
                          href={brand.href}
                          className="rounded-2xl border border-black/8 px-4 py-3 text-center hover:border-primary/30 hover:bg-primary"
                        >
                          {brand.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>

          <div className="hidden flex-1 items-center lg:flex">
            <div className="flex w-full overflow-hidden rounded-full border border-black/10 bg-white shadow-sm">
              <Input
                className="h-11 w-full rounded-none border-0 bg-white px-4 text-sm text-black placeholder:text-black/45 shadow-none focus-visible:ring-0"
                placeholder="Search for products"
                aria-label="Search"
              />
              <Button type="button" className="h-11 rounded-none bg-[#0e2f56] px-6 text-sm font-semibold text-white hover:bg-[#0e2f56]/90">
                Search
              </Button>
            </div>
          </div>

          <div className="ml-auto hidden items-center gap-3 md:flex">
            {(
              [
                ['Compare', '/compare'],
                ['Wishlist', '/wishlist'],
              ] as const
            ).map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="inline-flex h-10 items-center justify-center rounded-full border border-black/10 px-3 text-xs font-semibold text-black hover:border-primary/30 hover:bg-primary"
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
            <Link
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/80"
              href="/quotation-request"
            >
              Quotation Request
            </Link>
          </div>
        </div>
      </Container>

      <div className="border-t border-black/5 bg-[#f5f6f8]">
        <Container>
          <nav className="hidden min-h-12 items-center justify-between gap-4 py-2 text-xs font-semibold text-black lg:flex">
            <div className="flex flex-wrap items-center gap-5">
              <Link
                className="inline-flex items-center rounded-full bg-primary px-3 py-1.5 text-white"
                href="/main-categories"
              >
                Categories
              </Link>
              <Link className="hover:text-primary" href="/shop">
                Shop
              </Link>
              <Link className="hover:text-primary" href="/promotions">
                Promotions/Campaigns
              </Link>
              <Link className="hover:text-primary" href="/shop-by-brands">
                Shop By Brands
              </Link>
              <Link className="hover:text-primary" href="/our-contacts">
                Our Contacts
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              <Link
                className="inline-flex items-center rounded-full bg-primary px-3 py-1.5 text-white"
                href="/main-categories"
              >
                All Categories
              </Link>
              <Link className="hover:text-primary" href="/delivery-return">
                Delivery & Return
              </Link>
              <Link className="hover:text-primary" href="/terms-and-condition">
                Terms & Condition
              </Link>
              <Link className="hover:text-primary" href="/my-account">
                My account
              </Link>
            </div>
          </nav>

          <details className="group py-3 lg:hidden">
            <summary className="list-none cursor-pointer rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black outline-none [&::-webkit-details-marker]:hidden">
              Menu
            </summary>
            <div className="mt-3 rounded-3xl bg-white p-4 shadow-lg ring-1 ring-black/5">
              <div className="grid gap-3">
                {(
                  [
                    ['Shop', '/shop'],
                    ['Promotions/Campaigns', '/promotions'],
                    ['Main Categories', '/main-categories'],
                    ['Shop By Brands', '/shop-by-brands'],
                    ['Delivery & Return', '/delivery-return'],
                    ['Terms & Condition', '/terms-and-condition'],
                    ['Quotation Request', '/quotation-request'],
                    ['Our Contacts', '/our-contacts'],
                    ['Compare', '/compare'],
                    ['Wishlist', '/wishlist'],
                    ['Cart', '/cart'],
                    ['My account', '/my-account'],
                  ] as const
                ).map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    className="rounded-2xl border border-black/8 px-4 py-3 text-sm font-semibold text-black hover:border-primary/30 hover:bg-primary"
                  >
                    {label}
                  </Link>
                ))}
              </div>
              <div className="mt-4">
                <div className="text-xs font-bold uppercase tracking-[0.28em] text-primary">
                  Categories
                </div>
                <div className="mt-3 grid gap-2">
                  {topCategories.map(category => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="rounded-2xl border border-black/8 px-4 py-3 text-sm hover:border-primary/30 hover:bg-primary"
                    >
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
              <Input
                className="h-11 w-full rounded-none border-0 bg-white px-4 text-sm text-black placeholder:text-black/45 shadow-none focus-visible:ring-0"
                placeholder="Search for products"
                aria-label="Search"
              />
              <Button type="button" className="h-11 rounded-none bg-[#0e2f56] px-6 text-sm font-semibold text-white hover:bg-[#0e2f56]/90">
                Search
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}
