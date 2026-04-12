'use client';

import Link from 'next/link';

import { useCartStore } from '@/lib/cart-store';

export function CartCountLink() {
  const count = useCartStore(state => state.items.reduce((sum, item) => sum + item.quantity, 0));

  return (
    <Link
      href="/cart"
      className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 px-4 text-sm font-semibold text-black hover:border-[#f15a24]/30 hover:bg-[#fff8f4]"
      aria-label={`Cart with ${count} items`}
    >
      Cart
      <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f15a24] px-1.5 text-[11px] font-bold leading-none text-white">
        {count}
      </span>
    </Link>
  );
}
