'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatMoney } from '@/lib/cart';
import { useCartStore } from '@/lib/cart-store';

export function OrdersPageClient() {
  const orders = useCartStore(state => state.orders);
  const addItems = useCartStore(state => state.addItems);
  const updateOrderStatus = useCartStore(state => state.updateOrderStatus);

  return (
    <main className="flex-1 bg-background pb-16">
      <div className="mx-auto w-full max-w-310 px-4 py-6 lg:px-0">
        <Card className="p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Account
          </p>
          <h1 className="mt-4 text-3xl font-black text-secondary sm:text-4xl">
            Orders
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/65 sm:text-base">
            Every checkout you place in this browser appears here automatically.
          </p>
        </Card>

        <section className="mt-6 grid gap-4">
          {orders.length > 0 ? (
            orders.map(order => (
              <Card key={order.id} className="p-5 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <Link href={`/my-account/orders/${order.id}`} className="text-sm font-bold text-secondary hover:text-primary">
                      {order.id}
                    </Link>
                    <div className="mt-1 text-xs uppercase tracking-[0.22em] text-foreground/45">
                      {new Date(order.createdAt).toLocaleString('en-US')}
                    </div>
                  </div>
                  <div className="rounded-full bg-muted px-4 py-2 text-sm font-semibold text-foreground/70">
                    {order.status}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl bg-muted px-4 py-3 text-sm">
                    <div className="text-foreground/55">Subtotal</div>
                    <div className="mt-1 font-bold text-foreground">{formatMoney(order.subtotal)}</div>
                  </div>
                  <div className="rounded-2xl bg-muted px-4 py-3 text-sm">
                    <div className="text-foreground/55">Discount</div>
                    <div className="mt-1 font-bold text-foreground">- {formatMoney(order.discount)}</div>
                  </div>
                  <div className="rounded-2xl bg-muted px-4 py-3 text-sm">
                    <div className="text-foreground/55">Delivery</div>
                    <div className="mt-1 font-bold text-foreground">{formatMoney(order.delivery)}</div>
                  </div>
                  <div className="rounded-2xl bg-secondary px-4 py-3 text-sm text-secondary-foreground">
                    <div className="text-secondary-foreground/65">Total</div>
                    <div className="mt-1 font-bold">{formatMoney(order.total)}</div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-sm text-foreground/65">
                  <span>Payment: {order.payment}</span>
                  {order.couponCode ? <span>Coupon: {order.couponCode}</span> : null}
                  <span>Items: {order.items.length}</span>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Button asChild className="h-10 rounded-full bg-secondary px-4 text-sm font-semibold text-secondary-foreground hover:bg-secondary/90">
                    <Link href={`/my-account/orders/${order.id}`}>View details</Link>
                  </Button>
                  <Button type="button" variant="outline" onClick={() => addItems(order.items)} className="h-10 rounded-full border-border px-4 text-sm font-semibold text-foreground/75">
                    Reorder
                  </Button>
                  {order.status !== 'Cancelled' ? (
                    <Button type="button" variant="outline" onClick={() => updateOrderStatus(order.id, 'Cancelled')} className="h-10 rounded-full border-primary/30 px-4 text-sm font-semibold text-primary hover:bg-primary/5">
                      Cancel order
                    </Button>
                  ) : null}
                  {order.status === 'Placed' ? (
                    <Button type="button" variant="outline" onClick={() => updateOrderStatus(order.id, 'Processing')} className="h-10 rounded-full border-secondary/20 px-4 text-sm font-semibold text-secondary hover:bg-secondary/5">
                      Mark processing
                    </Button>
                  ) : null}
                  {order.status === 'Processing' ? (
                    <Button type="button" variant="outline" onClick={() => updateOrderStatus(order.id, 'Delivered')} className="h-10 rounded-full border-emerald-600/20 px-4 text-sm font-semibold text-emerald-600 hover:bg-emerald-600/5">
                      Mark delivered
                    </Button>
                  ) : null}
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-6 text-sm text-foreground/65 shadow-sm">
              No saved orders yet.{' '}
              <Link className="font-semibold text-primary" href="/shop">
                Start shopping
              </Link>
            </Card>
          )}
        </section>
      </div>
    </main>
  );
}
