'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { formatMoney } from '@/lib/cart';
import { useCartStore } from '@/lib/cart-store';

export function OrdersPageClient() {
  const orders = useCartStore(state => state.orders);
  const addItems = useCartStore(state => state.addItems);
  const updateOrderStatus = useCartStore(state => state.updateOrderStatus);

  return (
    <main className="flex-1 bg-[#f5f6f8] pb-16">
      <div className="mx-auto w-full max-w-310 px-4 py-6 lg:px-0">
        <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Account
          </p>
          <h1 className="mt-4 text-3xl font-black text-[#0e2f56] sm:text-4xl">
            Orders
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-black/65 sm:text-base">
            Every checkout you place in this browser appears here automatically.
          </p>
        </section>

        <section className="mt-6 grid gap-4">
          {orders.length > 0 ? (
            orders.map(order => (
              <article
                key={order.id}
                className="rounded-3xl bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/my-account/orders/${order.id}`}
                      className="text-sm font-bold text-[#0e2f56] hover:text-primary"
                    >
                      {order.id}
                    </Link>
                    <div className="mt-1 text-xs uppercase tracking-[0.22em] text-black/45">
                      {new Date(order.createdAt).toLocaleString('en-US')}
                    </div>
                  </div>
                  <div className="rounded-full bg-[#f5f6f8] px-4 py-2 text-sm font-semibold text-black/70">
                    {order.status}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl bg-[#f5f6f8] px-4 py-3 text-sm">
                    <div className="text-black/55">Subtotal</div>
                    <div className="mt-1 font-bold text-black">
                      {formatMoney(order.subtotal)}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-[#f5f6f8] px-4 py-3 text-sm">
                    <div className="text-black/55">Discount</div>
                    <div className="mt-1 font-bold text-black">
                      - {formatMoney(order.discount)}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-[#f5f6f8] px-4 py-3 text-sm">
                    <div className="text-black/55">Delivery</div>
                    <div className="mt-1 font-bold text-black">
                      {formatMoney(order.delivery)}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-[#0e2f56] px-4 py-3 text-sm text-white">
                    <div className="text-white/65">Total</div>
                    <div className="mt-1 font-bold">
                      {formatMoney(order.total)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-sm text-black/65">
                  <span>Payment: {order.payment}</span>
                  {order.couponCode ? (
                    <span>Coupon: {order.couponCode}</span>
                  ) : null}
                  <span>Items: {order.items.length}</span>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button
                    asChild
                    className="h-10 rounded-full bg-[#0e2f56] px-4 text-sm font-semibold text-white hover:bg-[#0e2f56]/90"
                  >
                    <Link href={`/my-account/orders/${order.id}`}>
                      View details
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addItems(order.items)}
                    className="h-10 rounded-full border border-black/10 px-4 text-sm font-semibold text-black/75"
                  >
                    Reorder
                  </Button>
                  {order.status !== 'Cancelled' ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                      className="h-10 rounded-full border-primary/30 px-4 text-sm font-semibold text-primary hover:bg-primary/5"
                    >
                      Cancel order
                    </Button>
                  ) : null}
                  {order.status === 'Placed' ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => updateOrderStatus(order.id, 'Processing')}
                      className="h-10 rounded-full border-[#0e2f56]/20 px-4 text-sm font-semibold text-[#0e2f56] hover:bg-[#0e2f56]/5"
                    >
                      Mark processing
                    </Button>
                  ) : null}
                  {order.status === 'Processing' ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => updateOrderStatus(order.id, 'Delivered')}
                      className="h-10 rounded-full border-[#459647]/20 px-4 text-sm font-semibold text-[#459647] hover:bg-[#459647]/5"
                    >
                      Mark delivered
                    </Button>
                  ) : null}
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl bg-white p-6 text-sm text-black/65 shadow-sm">
              No saved orders yet.{' '}
              <Link className="font-semibold text-primary" href="/shop">
                Start shopping
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
