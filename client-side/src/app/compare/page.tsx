import Image from 'next/image';

import { featuredProducts } from '@/lib/malamal-content';

export default function ComparePage() {
  const products = featuredProducts.slice(0, 3);

  return (
    <main className="flex-1 bg-[#f5f6f8] pb-16">
      <div className="mx-auto w-full max-w-350 px-4 py-6 lg:px-6">
        <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15a24]">
            Comparison
          </p>
          <h1 className="mt-4 text-3xl font-black text-[#0e2f56] sm:text-4xl">
            Compare
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-black/65 sm:text-base">
            Compare table showing product details side by side from the store catalog.
          </p>
        </section>

        <section className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="grid gap-4 border-b border-black/8 p-4 lg:grid-cols-3">
            {products.map(product => (
              <div key={product.sku} className="rounded-2xl border border-black/10 p-4">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#f5f6f8]">
                  <Image src={product.image} alt={product.title} fill className="object-cover" />
                </div>
                <div className="mt-4 text-sm font-semibold text-black">{product.title}</div>
                <div className="mt-2 text-sm font-extrabold text-[#f15a24]">{product.price}</div>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-sm">
              <tbody>
                {[
                  ['Brand', ...products.map(product => product.brand)],
                  ['SKU', ...products.map(product => product.sku)],
                  ['Stock', ...products.map(product => product.stock)],
                  ['Rating', ...products.map(product => product.rating)],
                  ['Old price', ...products.map(product => product.oldPrice ?? '-')],
                ].map(([label, ...values]) => (
                  <tr key={label as string}>
                    <th className="w-40 border-b border-black/8 bg-[#f5f6f8] px-4 py-4 text-left font-bold text-[#0e2f56]">
                      {label}
                    </th>
                    {values.map(value => (
                      <td key={`${label}-${value}`} className="border-b border-black/8 px-4 py-4 text-black/70">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
