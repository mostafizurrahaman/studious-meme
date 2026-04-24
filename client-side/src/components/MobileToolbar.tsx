'use client';

import Link from 'next/link';
import { ArrowLeftRight, Heart, ShoppingCart, UserRound } from 'lucide-react';

import { useUser } from '@/context/UserContext';
import { useCartStore } from '@/lib/cart-store';
import { useCompareStore } from '@/lib/compare-store';
import { useWishlistStore } from '@/lib/wishlist-store';
import { getDashboardPathByRole } from '@/lib/auth/roles';

const items = [
    ['Compare', '/compare', ArrowLeftRight],
    ['Wishlist', '/wishlist', Heart],
    ['Cart', '/cart', ShoppingCart],
    ['Account', '/my-account', UserRound],
] as const;

export function MobileToolbar() {
    const { user } = useUser();
    const cartCount = useCartStore(state => state.items.reduce((sum, item) => sum + item.quantity, 0));
    const compareCount = useCompareStore(state => state.items.length);
    const wishlistCount = useWishlistStore(state => state.items.length);

    const accountHref = user ? (getDashboardPathByRole(user.role) ?? '/dashboard') : '/my-account';

    return (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm lg:hidden">
            <div className="mx-auto grid max-w-310 grid-cols-4 px-2 py-2.5 text-[11px] font-semibold text-foreground/70">
                {items.map(([label, href, Icon]) => (
                    <Link
                        key={label}
                        href={label === 'Account' ? accountHref : href}
                        className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1.5 transition hover:bg-primary/5 hover:text-primary"
                    >
                        <span className="relative inline-flex items-center justify-center">
                            <Icon className="h-5 w-5" />
                            {label === 'Account' ? null : (
                                <span className="absolute -right-2 -top-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold leading-none text-white">
                                    {label === 'Cart'
                                        ? cartCount
                                        : label === 'Compare'
                                          ? compareCount
                                          : wishlistCount}
                                </span>
                            )}
                        </span>
                        <span>{label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
