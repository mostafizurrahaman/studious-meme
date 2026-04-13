'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatMoney } from '@/lib/cart';
import { useCartStore } from '@/lib/cart-store';

export function CartPageClient() {
  const items = useCartStore(state => state.items);
  const hydrated = useCartStore(state => state.hydrated);
  const couponCode = useCartStore(state => state.couponCode);
  const appliedCoupon = useCartStore(state => state.appliedCoupon);
  const checkout = useCartStore(state => state.checkout);
  const count = useCartStore(state =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const subtotal = useCartStore(state =>
    state.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  );
  const increase = useCartStore(state => state.increase);
  const decrease = useCartStore(state => state.decrease);
  const remove = useCartStore(state => state.remove);
  const clear = useCartStore(state => state.clear);
  const setCouponCode = useCartStore(state => state.setCouponCode);
  const applyCoupon = useCartStore(state => state.applyCoupon);
  const clearCoupon = useCartStore(state => state.clearCoupon);
  const updateCheckout = useCartStore(state => state.updateCheckout);
  const [couponMessage, setCouponMessage] = useState('');
  const [toast, setToast] = useState('');

  const discount =
    appliedCoupon?.kind === 'percent'
      ? (subtotal * appliedCoupon.value) / 100
      : 0;
  const delivery = subtotal > 0 && appliedCoupon?.kind !== 'shipping' ? 250 : 0;
  const total = Math.max(subtotal - discount + delivery, 0);

  if (!hydrated) {
    return (
      <main className="flex-1 bg-[#f5f6f8] pb-16">
        <div className="mx-auto w-full max-w-310 px-4 py-6 lg:px-0">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            Loading cart...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[#f5f6f8] pb-16">
      <div className="mx-auto w-full max-w-310 px-4 py-6 lg:px-0">
        <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Checkout
          </p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-[#0e2f56] sm:text-4xl">
                Cart
              </h1>
              <p className="mt-3 text-sm leading-7 text-black/65 sm:text-base">
                Your cart is saved in this browser and the navbar count stays in
                sync.
              </p>
            </div>
            <div className="rounded-full bg-[#f5f6f8] px-4 py-2 text-sm font-semibold text-black/70">
              {count} item{count === 1 ? '' : 's'}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
            {items.length > 0 ? (
              items.map(item => (
                <div
                  key={item.sku}
                  className="flex gap-4 rounded-2xl border border-black/10 p-4"
                >
                  <Link
                    href={item.href}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#f5f6f8]"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain p-2"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={item.href}
                      className="line-clamp-2 font-semibold text-black hover:text-primary"
                    >
                      {item.title}
                    </Link>
                    <div className="mt-1 text-sm text-black/55">
                      SKU {item.sku} · {item.brand}
                    </div>
                    <div className="mt-2 text-sm font-bold text-primary">
                      {item.unitPriceLabel}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2 rounded-full border border-black/10 px-2 py-1">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => decrease(item.sku)}
                        className="h-auto px-2 text-lg leading-none text-black/70 hover:bg-transparent"
                      >
                        −
                      </Button>
                      <span className="min-w-6 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => increase(item.sku)}
                        className="h-auto px-2 text-lg leading-none text-black/70 hover:bg-transparent"
                      >
                        +
                      </Button>
                    </div>
                    <div className="text-sm font-semibold text-black/70">
                      {formatMoney(item.unitPrice * item.quantity)}
                    </div>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => remove(item.sku)}
                      className="h-auto p-0 text-xs font-semibold text-primary"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-black/15 p-8 text-center">
                <div className="text-lg font-black text-primary">
                  Your cart is empty
                </div>
                <p className="mt-2 text-sm text-black/55">
                  Start browsing the catalog and add products to save them here.
                </p>
                <Button
                  asChild
                  className="mt-6 h-11 rounded-full px-6 text-sm font-bold"
                >
                  <Link href="/shop">Browse shop</Link>
                </Button>
              </div>
            )}

            <div className="rounded-3xl border border-black/8 bg-[#f5f6f8] p-4">
              <div className="flex flex-wrap items-center gap-3">
                <Input
                  value={couponCode}
                  onChange={event => setCouponCode(event.target.value)}
                  placeholder="Coupon code"
                  className="h-11 min-w-0 flex-1 rounded-full border border-black/10 bg-white px-4 text-sm"
                />
                <Button
                  type="button"
                  onClick={() => {
                    const success = applyCoupon();
                    setCouponMessage(
                      success ? 'Coupon applied' : 'Invalid coupon code',
                    );
                    setToast(
                      success
                        ? 'Coupon applied successfully.'
                        : 'Coupon code was not recognized.',
                    );
                    window.setTimeout(() => setToast(''), 2200);
                  }}
                  className="h-11 rounded-full bg-[#0e2f56] px-5 text-sm font-bold text-white"
                >
                  Apply coupon
                </Button>
                {appliedCoupon ? (
                  <Button
                    type="button"
                    onClick={() => {
                      clearCoupon();
                      setCouponMessage('');
                    }}
                    variant="outline"
                    className="h-11 rounded-full border border-black/10 px-5 text-sm font-semibold text-black/70"
                  >
                    Remove
                  </Button>
                ) : null}
              </div>
              <div className="mt-3 text-sm text-black/55">
                {couponMessage ||
                  (appliedCoupon
                    ? `Applied ${appliedCoupon.code} · ${appliedCoupon.label}`
                    : 'Try SAVE10, MALAMAL5 or FREESHIP')}
              </div>
            </div>
          </div>

          <aside className="rounded-3xl bg-[#0e2f56] p-6 text-white shadow-sm">
            <h2 className="text-2xl font-black">Order summary</h2>
            <div className="mt-4 space-y-3 text-sm text-white/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              {discount > 0 ? (
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>- {formatMoney(discount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{formatMoney(delivery)}</span>
              </div>
              <div className="flex justify-between font-bold text-white">
                <span>Total</span>
                <span>{formatMoney(total)}</span>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              <Button
                asChild
                className="h-11 rounded-full px-6 text-sm font-bold"
              >
                <Link href="/quotation-request">Request quotation</Link>
              </Button>
              <Button
                asChild
                className="h-11 rounded-full bg-white px-6 text-sm font-bold text-[#0e2f56] hover:bg-white/90"
              >
                <Link href="/checkout">Proceed to checkout</Link>
              </Button>
              <Button
                type="button"
                onClick={clear}
                variant="outline"
                className="h-11 rounded-full border-white/20 px-6 text-sm font-bold text-white hover:bg-white/10"
              >
                Clear cart
              </Button>
            </div>
          </aside>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-[#0e2f56]">
                Checkout details
              </h2>
              <p className="mt-2 text-sm text-black/55">
                These fields stay saved in this browser.
              </p>
            </div>
            <div className="rounded-full bg-[#f5f6f8] px-4 py-2 text-sm font-semibold text-black/70">
              Persisted checkout form
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {[
              ['name', 'Full name', checkout.name],
              ['phone', 'Phone number', checkout.phone],
              ['email', 'Email address', checkout.email],
              ['city', 'City', checkout.city],
            ].map(([key, label, value]) => (
              <label
                key={key}
                className="grid gap-2 text-sm font-semibold text-black"
              >
                {label}
                <input
                  value={value}
                  onChange={event =>
                    updateCheckout(
                      key as 'name' | 'phone' | 'email' | 'city',
                      event.target.value,
                    )
                  }
                  className="h-11 rounded-xl border border-black/10 px-4 outline-none"
                />
              </label>
            ))}
            <label className="grid gap-2 text-sm font-semibold text-black lg:col-span-2">
              Delivery address
              <textarea
                value={checkout.address}
                onChange={event =>
                  updateCheckout('address', event.target.value)
                }
                className="min-h-28 rounded-2xl border border-black/10 px-4 py-3 outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-black lg:col-span-2">
              Order note
              <textarea
                value={checkout.note}
                onChange={event => updateCheckout('note', event.target.value)}
                className="min-h-24 rounded-2xl border border-black/10 px-4 py-3 outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-black lg:col-span-2">
              Payment method
              <select
                value={checkout.payment}
                onChange={event =>
                  updateCheckout('payment', event.target.value)
                }
                className="h-11 rounded-xl border border-black/10 px-4 outline-none"
              >
                {['Cash on delivery', 'Bank transfer', 'bKash', 'Nagad'].map(
                  option => (
                    <option key={option}>{option}</option>
                  ),
                )}
              </select>
            </label>
          </div>
        </section>

        {toast ? (
          <div className="fixed right-4 top-4 z-50 rounded-2xl bg-[#0e2f56] px-4 py-3 text-sm font-semibold text-white shadow-lg">
            {toast}
          </div>
        ) : null}
      </div>
    </main>
  );
}
