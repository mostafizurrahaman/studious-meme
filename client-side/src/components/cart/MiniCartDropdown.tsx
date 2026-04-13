'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatMoney } from '@/lib/cart';
import { useCartStore } from '@/lib/cart-store';

export function MiniCartDropdown() {
  const items = useCartStore(state => state.items);
  const count = useCartStore(state => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const subtotal = useCartStore(state =>
    state.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  );

  return (
    <details className="group relative hidden md:block">
        <summary className="list-none cursor-pointer outline-none [&::-webkit-details-marker]:hidden">
        <div className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 px-4 text-sm font-semibold text-black hover:border-[#f15a24]/30 hover:bg-[#fff8f4]">
          Cart
          <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f15a24] px-1.5 text-[11px] font-bold leading-none text-white">
            {count}
          </span>
        </div>
      </summary>

      <div className="absolute right-0 top-full z-30 mt-3 w-90 rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-black/5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-[#0e2f56]">Mini cart</div>
          <div className="text-xs font-semibold text-black/55">{count} items</div>
        </div>
        <div className="mt-4 space-y-3">
          {items.length > 0 ? (
            items.slice(0, 3).map(item => (
              <div key={item.sku} className="flex gap-3 rounded-2xl border border-black/8 p-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#f5f6f8]">
                  <Image src={item.image} alt={item.title} fill className="object-contain p-1.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-2 text-sm font-semibold text-black">{item.title}</div>
                  <div className="mt-1 text-xs text-black/55">Qty {item.quantity}</div>
                </div>
                <div className="text-xs font-semibold text-[#f15a24]">{formatMoney(item.unitPrice * item.quantity)}</div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-black/15 p-4 text-sm text-black/55">
              Your cart is empty.
            </div>
          )}
        </div>
        <div className="mt-4 rounded-2xl bg-[#f5f6f8] px-4 py-3 text-sm font-semibold text-black">
          Subtotal: {formatMoney(subtotal)}
        </div>
        <Link
          href="/cart"
          className="mt-4 inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-full bg-[#f15a24] px-6 text-sm font-bold text-white"
        >
          View cart
        </Link>
      </div>
    </details>
  );
}
