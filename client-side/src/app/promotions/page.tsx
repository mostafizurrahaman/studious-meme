import { ProductCard } from '@/components/ProductCard';
import { offerProducts } from '@/lib/malamal-content';

export default function PromotionsPage() {
  return (
    <main className="flex-1 bg-[#f5f6f8] pb-16">
      <div className="mx-auto w-full max-w-350 px-4 py-6 lg:px-6">
        <section className="rounded-3xl bg-linear-to-r from-[#f15a24] to-[#0e2f56] p-6 text-white shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            Campaigns and offers
          </p>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">Promotions / Campaigns</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/82 sm:text-base">
            Promotional layout with product cards and campaign copy for the current
            storefront.
          </p>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Seasonal sale', 'Limited-time hardware bundles and discounts.'],
            ['Bulk quotes', 'Best for projects, workshops and procurement.'],
            ['Featured deals', 'Curated top selling industrial items.'],
            ['New arrivals', 'Fresh stock from trusted brands.'],
          ].map(([title, text]) => (
            <div key={title} className="rounded-3xl bg-white p-5 shadow-sm">
              <div className="text-lg font-extrabold text-[#0e2f56]">{title}</div>
              <p className="mt-2 text-sm leading-7 text-black/65">{text}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-3xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black text-[#0e2f56]">The Best Offers</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {offerProducts.map(product => (
              <ProductCard key={product.sku} product={product} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
