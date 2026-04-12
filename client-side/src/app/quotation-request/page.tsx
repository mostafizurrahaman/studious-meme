import { brands } from '@/lib/malamal-content';
import { SeoScripts } from '@/components/SeoScripts';
import { quotationRequestMetadata, quotationRequestSchemas } from '@/lib/seo';

export const metadata = quotationRequestMetadata;

export default function QuotationRequestPage() {
  return (
    <>
      <SeoScripts data={quotationRequestSchemas} />
      <main className="flex-1 bg-[#f5f6f8] pb-16">
      <div className="mx-auto w-full max-w-350 px-4 py-6 lg:px-6">
        <section className="rounded-3xl bg-[#0e2f56] p-6 text-white shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/65">
            B2B request
          </p>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">Quotation Request</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/78 sm:text-base">
            Quotation form layout for bulk order workflows and project purchases.
          </p>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <form className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-black">
                  Full name
                  <input className="h-11 rounded-xl border border-black/10 px-4 outline-none" placeholder="Your name" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-black">
                  Company
                  <input className="h-11 rounded-xl border border-black/10 px-4 outline-none" placeholder="Company / organization" />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-black">
                  Email
                  <input className="h-11 rounded-xl border border-black/10 px-4 outline-none" placeholder="name@company.com" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-black">
                  Phone
                  <input className="h-11 rounded-xl border border-black/10 px-4 outline-none" placeholder="01XXXXXXXXX" />
                </label>
              </div>
              <label className="grid gap-2 text-sm font-semibold text-black">
                Interested products
                <textarea className="min-h-32 rounded-2xl border border-black/10 px-4 py-3 outline-none" placeholder="List the items, quantity and any specification details" />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-black">
                Brand preference
                <select className="h-11 rounded-xl border border-black/10 px-4 outline-none">
                  {brands.map(brand => (
                    <option key={brand.name}>{brand.name}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-black">
                Message
                <textarea className="min-h-36 rounded-2xl border border-black/10 px-4 py-3 outline-none" placeholder="Tell us about the project timeline, delivery location and special requirements" />
              </label>
              <button type="button" className="inline-flex h-11 w-fit cursor-pointer items-center justify-center rounded-full bg-[#f15a24] px-6 text-sm font-bold text-white">
                Request quotation
              </button>
            </form>
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#0e2f56]">What to include</h2>
              <div className="mt-4 grid gap-3 text-sm text-black/65">
                {[
                  'Product names or item links',
                  'Required quantity and delivery area',
                  'Budget range or target pricing',
                  'Preferred brand or alternative brands',
                ].map(item => (
                  <div key={item} className="rounded-2xl bg-[#f5f6f8] px-4 py-3">{item}</div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-[#0e2f56] p-6 text-white shadow-sm">
              <h2 className="text-xl font-black">Bulk buying support</h2>
              <p className="mt-3 text-sm leading-7 text-white/78">
                This form is designed for project procurement, wholesale requests and
                quotation processing.
              </p>
            </div>
          </div>
        </section>
      </div>
      </main>
    </>
  );
}
