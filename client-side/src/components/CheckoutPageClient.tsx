'use client';

import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { formatMoney } from '@/lib/cart';
import { useCartStore } from '@/lib/cart-store';
import { submitCheckoutAction } from '@/app/checkout/actions';
import type { CheckoutActionState } from '@/app/checkout/actions';

export function CheckoutPageClient() {
  const items = useCartStore(state => state.items);
  const hydrated = useCartStore(state => state.hydrated);
  const checkout = useCartStore(state => state.checkout);
  const appliedCoupon = useCartStore(state => state.appliedCoupon);
  const subtotal = useCartStore(state =>
    state.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  );
  const updateCheckout = useCartStore(state => state.updateCheckout);
  const clear = useCartStore(state => state.clear);
  const addOrder = useCartStore(state => state.addOrder);
  const router = useRouter();
  const [result, formAction, pending] = useActionState<CheckoutActionState, FormData>(submitCheckoutAction, { ok: false, error: '' });

  const discount = appliedCoupon?.kind === 'percent' ? (subtotal * appliedCoupon.value) / 100 : 0;
  const delivery = subtotal > 0 && appliedCoupon?.kind !== 'shipping' ? 250 : 0;
  const total = Math.max(subtotal - discount + delivery, 0);
  const summaryItems = items.slice(0, 4);

  useEffect(() => {
    if (!result.ok) return;

    addOrder(result.order);
    clear();
    const timeout = window.setTimeout(() => {
      router.push('/my-account/orders');
    }, 1200);

    return () => window.clearTimeout(timeout);
  }, [addOrder, clear, result, router]);

  if (!hydrated) {
    return (
      <main className="flex-1 bg-background pb-16">
        <div className="mx-auto w-full max-w-310 px-4 py-6 lg:px-0">
          <Card className="p-6 shadow-sm">Loading checkout...</Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-background pb-16">
      <div className="mx-auto w-full max-w-310 px-4 py-6 lg:px-0">
        {result.ok ? (
          <div className="fixed right-4 top-4 z-50 max-w-sm rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg">
            Order submitted successfully. Redirecting to your orders.
          </div>
        ) : result.error ? (
          <div className="fixed right-4 top-4 z-50 max-w-sm rounded-2xl bg-destructive px-4 py-3 text-sm font-semibold text-white shadow-lg">
            {result.error}
          </div>
        ) : null}

        <Card className="p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Checkout
          </p>
          <h1 className="mt-4 text-3xl font-black text-secondary sm:text-4xl">
            Place order
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/65 sm:text-base">
            Checkout fields are persisted in this browser and can be wired to server actions later without changing the UI.
          </p>
        </Card>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-6 shadow-sm">
            <form className="grid gap-4" method="post" action={formAction}>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ['name', 'Full name', checkout.name],
                  ['phone', 'Phone number', checkout.phone],
                  ['email', 'Email address', checkout.email],
                  ['city', 'City', checkout.city],
                ].map(([key, label, value]) => (
                  <label key={key} className="grid gap-2 text-sm font-semibold text-foreground">
                    {label}
                    <Input
                      name={key}
                      value={value}
                      onChange={event =>
                        updateCheckout(key as 'name' | 'phone' | 'email' | 'city', event.target.value)
                      }
                    />
                  </label>
                ))}
              </div>

              <input type="hidden" name="cartItemsJson" value={JSON.stringify(items)} />
              <input type="hidden" name="couponCode" value={appliedCoupon?.code ?? ''} />

              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Delivery address
                <Textarea
                  name="address"
                  value={checkout.address}
                  onChange={event => updateCheckout('address', event.target.value)}
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Order note
                <Textarea
                  name="note"
                  value={checkout.note}
                  onChange={event => updateCheckout('note', event.target.value)}
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Payment method
                <select
                  name="payment"
                  value={checkout.payment}
                  onChange={event => updateCheckout('payment', event.target.value)}
                  className="h-11 rounded-2xl border border-input bg-background px-4 outline-none"
                >
                  {['Cash on delivery', 'Bank transfer', 'bKash', 'Nagad'].map(option => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>

              <div className="mt-2 flex flex-wrap gap-3">
                <Button type="submit" disabled={pending} className="h-11 rounded-full px-6 text-sm font-bold shadow-sm">
                  {pending ? 'Submitting...' : 'Place order'}
                </Button>
                <Button asChild variant="outline" className="h-11 rounded-full border-border px-6 text-sm font-bold text-foreground/75">
                  <Link href="/cart">Back to cart</Link>
                </Button>
              </div>
            </form>
          </Card>

          <Card className="border-0 bg-secondary p-6 text-secondary-foreground shadow-sm">
            <h2 className="text-2xl font-black">Order summary</h2>
            <div className="mt-4 space-y-3 text-sm text-secondary-foreground/80">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div>
              {discount > 0 ? <div className="flex justify-between"><span>Discount</span><span>- {formatMoney(discount)}</span></div> : null}
              <div className="flex justify-between"><span>Delivery</span><span>{formatMoney(delivery)}</span></div>
              <div className="flex justify-between font-bold text-secondary-foreground"><span>Total</span><span>{formatMoney(total)}</span></div>
            </div>

            <Separator className="my-6 bg-white/15" />

            <Card className="bg-white/10 p-4 text-sm text-secondary-foreground/80">
              {items.length > 0
                ? `${items.length} product line${items.length === 1 ? '' : 's'} ready for checkout.`
                : 'Your cart is empty.'}
            </Card>

            <Card className="mt-6 space-y-3 bg-white/10 p-4 text-secondary-foreground">
              <div className="text-sm font-semibold">Item breakdown</div>
              {summaryItems.length > 0 ? (
                summaryItems.map(item => (
                  <div key={item.sku} className="flex items-center justify-between gap-3 text-sm text-secondary-foreground/80">
                    <span className="line-clamp-1">{item.title}</span>
                    <span className="shrink-0">x{item.quantity}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-secondary-foreground/70">No items yet.</div>
              )}
              {items.length > summaryItems.length ? (
                <div className="text-xs text-secondary-foreground/65">
                  + {items.length - summaryItems.length} more line
                  {items.length - summaryItems.length === 1 ? '' : 's'}
                </div>
              ) : null}
            </Card>
          </Card>
        </section>
      </div>
    </main>
  );
}
