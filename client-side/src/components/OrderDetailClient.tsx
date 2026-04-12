'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

import { formatMoney } from '@/lib/cart';
import { useCartStore } from '@/lib/cart-store';

export function OrderDetailClient({ orderId }: { orderId: string }) {
  const order = useCartStore(state => state.orders.find(item => item.id === orderId));
  const addItems = useCartStore(state => state.addItems);
  const updateOrderStatus = useCartStore(state => state.updateOrderStatus);

  const timeline = useMemo(
    () => [
      { key: 'Placed', label: 'Placed' },
      { key: 'Processing', label: 'Processing' },
      { key: 'Delivered', label: 'Delivered' },
    ],
    [],
  );

  if (!order) {
    return (
      <main className="flex-1 bg-[#f5f6f8] pb-16">
        <div className="mx-auto w-full max-w-310 px-4 py-6 lg:px-0">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            Order not found. <Link className="font-semibold text-[#f15a24]" href="/my-account/orders">Back to orders</Link>
          </div>
        </div>
      </main>
    );
  }

  const activeIndex = order.status === 'Delivered' ? 2 : order.status === 'Processing' ? 1 : 0;

  const download = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJson = () => {
    download(`${order.id}.json`, JSON.stringify(order, null, 2), 'application/json');
  };

  const exportCsv = () => {
    const rows = [
      ['Order ID', 'Item', 'SKU', 'Qty', 'Unit Price', 'Line Total'],
      ...order.items.map(item => [
        order.id,
        item.title,
        item.sku,
        String(item.quantity),
        item.unitPriceLabel,
        formatMoney(item.unitPrice * item.quantity),
      ]),
    ];

    const csv = rows
      .map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\n');

    download(`${order.id}.csv`, csv, 'text/csv');
  };

  return (
    <main className="flex-1 bg-[#f5f6f8] pb-16">
      <div className="mx-auto w-full max-w-310 px-4 py-6 lg:px-0">
        <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15a24]">Order detail</p>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-[#0e2f56] sm:text-4xl">{order.id}</h1>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-black/65">
                <span>{new Date(order.createdAt).toLocaleString('en-US')}</span>
                <span>{order.status}</span>
                <span>{order.payment}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 print:hidden">
              <button type="button" onClick={() => window.print()} className="inline-flex h-10 items-center justify-center rounded-full bg-[#0e2f56] px-4 text-sm font-semibold text-white">
                Save PDF
              </button>
              <button type="button" onClick={exportJson} className="inline-flex h-10 items-center justify-center rounded-full border border-black/10 px-4 text-sm font-semibold text-black/75">
                Export JSON
              </button>
              <button type="button" onClick={exportCsv} className="inline-flex h-10 items-center justify-center rounded-full border border-black/10 px-4 text-sm font-semibold text-black/75">
                Export CSV
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
            <div className="rounded-3xl border border-black/8 bg-[#f5f6f8] p-5 print:border-black/15 print:bg-white">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-[#0e2f56]">Invoice</div>
                  <div className="mt-1 text-sm text-black/55">Malamal.com.bd order receipt</div>
                </div>
                <div className="text-right text-sm text-black/65">
                  <div>Customer: {order.customer.name || 'Guest'}</div>
                  <div>Phone: {order.customer.phone || '-'}</div>
                  <div>Email: {order.customer.email || '-'}</div>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4 print:hidden">
                {timeline.map((step, index) => {
                  const isActive = index <= activeIndex;
                  const isCancelled = order.status === 'Cancelled';

                  return (
                    <div key={step.key} className={`rounded-2xl border px-4 py-3 text-sm ${isActive ? 'border-[#f15a24]/30 bg-white' : 'border-black/8 bg-white/70'}`}>
                      <div className={`text-xs uppercase tracking-[0.22em] ${isActive ? 'text-[#f15a24]' : 'text-black/40'}`}>{step.label}</div>
                      <div className="mt-2 font-semibold text-black/75">
                        {isCancelled && step.key !== 'Placed' ? 'Skipped' : isActive ? 'Completed' : 'Pending'}
                      </div>
                    </div>
                  );
                })}
                {order.status === 'Cancelled' ? (
                  <div className="rounded-2xl border border-[#f15a24]/20 bg-[#fff4ef] px-4 py-3 text-sm text-[#f15a24] sm:col-span-2 xl:col-span-4">
                    This order was cancelled.
                  </div>
                ) : null}
              </div>
            </div>

            {order.items.map(item => (
              <div key={item.sku} className="flex gap-4 rounded-2xl border border-black/10 p-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#f5f6f8]">
                  <Image src={item.image} alt={item.title} fill className="object-contain p-2" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-black">{item.title}</div>
                  <div className="mt-1 text-sm text-black/55">SKU {item.sku} · Qty {item.quantity}</div>
                  <div className="mt-2 text-sm font-bold text-[#f15a24]">{item.unitPriceLabel}</div>
                </div>
                <div className="text-sm font-semibold text-black/70">{formatMoney(item.unitPrice * item.quantity)}</div>
              </div>
            ))}
          </div>

          <aside className="rounded-3xl bg-[#0e2f56] p-6 text-white shadow-sm">
            <h2 className="text-2xl font-black">Summary</h2>
            <div className="mt-4 space-y-3 text-sm text-white/80">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatMoney(order.subtotal)}</span></div>
              <div className="flex justify-between"><span>Discount</span><span>- {formatMoney(order.discount)}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>{formatMoney(order.delivery)}</span></div>
              <div className="flex justify-between font-bold text-white"><span>Total</span><span>{formatMoney(order.total)}</span></div>
            </div>
            <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm text-white/80">
              {order.customer.address || 'No address saved.'}
            </div>
            <div className="mt-6 grid gap-3">
              <button type="button" onClick={() => addItems(order.items)} className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-[#0e2f56]">
                Reorder
              </button>
              {order.status !== 'Cancelled' ? (
                <button type="button" onClick={() => updateOrderStatus(order.id, 'Cancelled')} className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-bold text-white">
                  Cancel order
                </button>
              ) : null}
              {order.status === 'Placed' ? (
                <button type="button" onClick={() => updateOrderStatus(order.id, 'Processing')} className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-bold text-white">
                  Mark processing
                </button>
              ) : null}
              {order.status === 'Processing' ? (
                <button type="button" onClick={() => updateOrderStatus(order.id, 'Delivered')} className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-bold text-white">
                  Mark delivered
                </button>
              ) : null}
              <Link href="/my-account/orders" className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-bold text-white">
                Back to orders
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
