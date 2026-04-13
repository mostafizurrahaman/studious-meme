'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Container } from '@/components/Container';
import { MiniCartDropdown } from '@/components/cart/MiniCartDropdown';
import { brands, topCategories } from '@/lib/malamal-content';

export function Header() {
    const pathname = usePathname();
    const categoriesRef = useRef<HTMLDetailsElement>(null);
    const menuRef = useRef<HTMLDetailsElement>(null);
    const cartRef = useRef<HTMLDetailsElement>(null);

    useEffect(() => {
        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target as Node | null;

            if (categoriesRef.current && target && !categoriesRef.current.contains(target)) {
                categoriesRef.current.open = false;
            }

            if (menuRef.current && target && !menuRef.current.contains(target)) {
                menuRef.current.open = false;
            }

            if (cartRef.current && target && !cartRef.current.contains(target)) {
                cartRef.current.open = false;
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);

        return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, []);

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        if (href === '/shop') return pathname === '/shop' || pathname.startsWith('/product/');
        if (href === '/main-categories')
            return pathname === '/main-categories' || pathname.startsWith('/category/');
        if (href === '/my-account') return pathname === '/my-account' || pathname.startsWith('/my-account/');
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    const navLinkClass = (href: string) =>
        `inline-flex items-center rounded-full px-3 py-1.5 transition ${
            isActive(href) ? 'bg-primary text-white' : 'text-foreground hover:bg-primary hover:text-white'
        }`;

    const drawerLinkClass = (href: string) =>
        `rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
            isActive(href)
                ? 'border-primary bg-primary text-white'
                : 'border-border text-foreground hover:border-primary/30 hover:bg-primary hover:text-white'
        }`;

    const activeStyle = (href: string) =>
        isActive(href) ? { backgroundColor: 'var(--primary)', color: '#ffffff' } : undefined;

    const activeDrawerStyle = (href: string) =>
        isActive(href)
            ? { backgroundColor: 'var(--primary)', borderColor: 'var(--primary)', color: '#ffffff' }
            : undefined;

    const activePillStyle = (href: string) =>
        isActive(href) ? { backgroundColor: 'var(--primary)', color: '#ffffff' } : undefined;

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border bg-background text-foreground shadow-sm">
            {/* 1st layer */}
            <Container>
                <div className="flex min-h-18 items-center gap-4 py-2.5 lg:min-h-18 lg:py-3">
                    <Link href="/" className="flex shrink-0 items-center" aria-label="Malamal Home">
                        <Image
                            src="https://i0.wp.com/malamal.com.bd/wp-content/uploads/2024/01/Logo-Malamal.com_.bd_.png?ssl=1"
                            alt="Malamal.com.bd"
                            width={182}
                            height={36}
                            priority
                            className="h-auto w-36 sm:w-45.5"
                        />
                    </Link>

                    {/* categories */}
                    <div className="hidden items-center lg:flex">
                        <details ref={categoriesRef} className="group relative">
                            <summary className="list-none cursor-pointer rounded-full bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground outline-none [&::-webkit-details-marker]:hidden">
                                Categories
                            </summary>
                            <div className="absolute left-0 top-full z-20 mt-3 hidden w-240 rounded-3xl border border-border bg-card p-5 shadow-2xl ring-1 ring-black/5 group-open:block">
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
                                                    className="rounded-2xl border border-border px-4 py-3 transition hover:border-primary/30 hover:bg-primary hover:text-white"
                                                >
                                                    <div className="text-sm font-bold text-foreground">
                                                        {category.name}
                                                    </div>
                                                    <div className="mt-1 text-xs font-normal text-foreground/55">
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
                                                    className="rounded-2xl border border-border px-4 py-3 transition hover:border-primary/30 hover:bg-primary hover:text-white"
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
                                                    className="rounded-2xl border border-border px-4 py-3 text-center transition hover:border-primary/30 hover:bg-primary hover:text-white"
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

                    {/* search input */}
                    <div className="hidden flex-1 items-center lg:flex">
                        <div className="flex w-full overflow-hidden rounded-full border border-border bg-background shadow-sm">
                            <Input
                                className="h-11 w-full rounded-none border-0 bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground shadow-none focus-visible:ring-0"
                                placeholder="Search for products"
                                aria-label="Search"
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                className="h-11 rounded-none px-6 text-sm font-semibold"
                            >
                                Search
                            </Button>
                        </div>
                    </div>

                    {/* compare and wishlist button with Quotation Request button */}
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
                                className="inline-flex h-10 items-center justify-center rounded-full border border-border px-3 text-xs font-semibold text-foreground transition hover:border-primary/30 hover:bg-primary hover:text-white"
                                style={activePillStyle(href)}
                            >
                                {label}
                            </Link>
                        ))}
                        <MiniCartDropdown ref={cartRef} active={pathname === '/cart'} />
                        <div className="text-sm leading-tight">
                            <div className="font-semibold text-foreground">Dedicated Support</div>
                            <a className="font-semibold text-secondary" href="tel:+8809638212121">
                                +880 9638212121
                            </a>
                        </div>
                        {/* Quotation Request button */}
                        <Link
                            className="inline-flex h-10 items-center justify-center rounded-full border border-border px-3 text-xs font-semibold text-foreground transition hover:border-primary/30 hover:bg-primary hover:text-white"
                            href="/quotation-request"
                            style={activePillStyle('/quotation-request')}
                        >
                            Quotation Request
                        </Link>
                    </div>
                </div>
            </Container>

            {/* 2nd layer */}
            <div className="border-t border-border bg-muted/70">
                <Container>
                    <nav className="hidden min-h-12 items-center justify-between gap-4 py-2 text-xs font-semibold text-foreground lg:flex">
                        {/* left part */}
                        <div className="flex flex-wrap items-center gap-5">
                            <Link
                                className={navLinkClass('/main-categories')}
                                href="/main-categories"
                                style={activeStyle('/main-categories')}
                            >
                                Categories
                            </Link>
                            <Link className={navLinkClass('/shop')} href="/shop" style={activeStyle('/shop')}>
                                Shop
                            </Link>
                            <Link
                                className={navLinkClass('/promotions')}
                                href="/promotions"
                                style={activeStyle('/promotions')}
                            >
                                Promotions/Campaigns
                            </Link>
                            <Link
                                className={navLinkClass('/shop-by-brands')}
                                href="/shop-by-brands"
                                style={activeStyle('/shop-by-brands')}
                            >
                                Shop By Brands
                            </Link>
                            <Link
                                className={navLinkClass('/our-contacts')}
                                href="/our-contacts"
                                style={activeStyle('/our-contacts')}
                            >
                                Our Contacts
                            </Link>
                        </div>

                        {/* right part */}
                        <div className="flex flex-wrap items-center gap-5">
                            {/* <Link className={navLinkClass('/main-categories')} href="/main-categories">
                                All Categories
                            </Link> */}
                            <Link
                                className={navLinkClass('/delivery-return')}
                                href="/delivery-return"
                                style={activeStyle('/delivery-return')}
                            >
                                Delivery & Return
                            </Link>
                            <Link
                                className={navLinkClass('/terms-and-condition')}
                                href="/terms-and-condition"
                                style={activeStyle('/terms-and-condition')}
                            >
                                Terms & Condition
                            </Link>
                            <Link
                                className={navLinkClass('/my-account')}
                                href="/my-account"
                                style={activeStyle('/my-account')}
                            >
                                My account
                            </Link>
                        </div>
                    </nav>

                    <details ref={menuRef} className="group py-3 lg:hidden">
                        <summary className="list-none cursor-pointer rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground outline-none [&::-webkit-details-marker]:hidden">
                            Menu
                        </summary>
                        <Card className="mt-3 p-4 shadow-lg ring-1 ring-black/5">
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
                                        className={drawerLinkClass(href)}
                                        style={activeDrawerStyle(href)}
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
                                            className={drawerLinkClass(category.href)}
                                            style={activeDrawerStyle(category.href)}
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </details>
                </Container>
            </div>

            <div className="border-t border-border bg-background xl:hidden">
                <Container>
                    <div className="py-3">
                        <div className="flex overflow-hidden rounded-full border border-border bg-background shadow-sm">
                            <Input
                                className="h-11 w-full rounded-none border-0 bg-background px-4 text-sm text-foreground placeholder:text-foreground/45 shadow-none focus-visible:ring-0"
                                placeholder="Search for products"
                                aria-label="Search"
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                className="h-11 rounded-none px-6 text-sm font-semibold"
                            >
                                Search
                            </Button>
                        </div>
                    </div>
                </Container>
            </div>
        </header>
    );
}
