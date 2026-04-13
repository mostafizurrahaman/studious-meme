import { SeoScripts } from '@/components/SeoScripts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { brands } from '@/lib/malamal-content';
import { quotationRequestMetadata, quotationRequestSchemas } from '@/lib/seo';

export const metadata = quotationRequestMetadata;

export default function QuotationRequestPage() {
  return (
    <>
      <SeoScripts data={quotationRequestSchemas} />
      <main className="flex-1 bg-background pb-16">
        <div className="mx-auto w-full max-w-350 px-4 py-6 lg:px-6">
          <Card className="border-0 bg-secondary text-secondary-foreground shadow-sm">
            <CardHeader className="p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary-foreground/65">
                B2B request
              </p>
              <h1 className="mt-4 text-3xl font-black sm:text-4xl">
                Quotation Request
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-secondary-foreground/78 sm:text-base">
                Quotation form layout for bulk order workflows and project purchases.
              </p>
            </CardHeader>
          </Card>

          <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="p-6 shadow-sm">
              <form className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-foreground">
                    Full name
                    <Input placeholder="Your name" />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-foreground">
                    Company
                    <Input placeholder="Company / organization" />
                  </label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-foreground">
                    Email
                    <Input placeholder="name@company.com" />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-foreground">
                    Phone
                    <Input placeholder="01XXXXXXXXX" />
                  </label>
                </div>
                <label className="grid gap-2 text-sm font-semibold text-foreground">
                  Interested products
                  <Textarea placeholder="List the items, quantity and any specification details" className="min-h-32" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-foreground">
                  Brand preference
                  <select className="h-11 rounded-2xl border border-input bg-background px-4 outline-none">
                    {brands.map(brand => (
                      <option key={brand.name}>{brand.name}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-semibold text-foreground">
                  Message
                  <Textarea
                    placeholder="Tell us about the project timeline, delivery location and special requirements"
                    className="min-h-36"
                  />
                </label>
                <Button type="button" className="h-11 w-fit rounded-full px-6 text-sm font-bold shadow-sm">
                  Request quotation
                </Button>
              </form>
            </Card>
            <div className="space-y-4">
              <Card className="p-6 shadow-sm">
                <h2 className="text-xl font-black text-secondary">What to include</h2>
                <div className="mt-4 grid gap-3 text-sm text-foreground/65">
                  {[
                    'Product names or item links',
                    'Required quantity and delivery area',
                    'Budget range or target pricing',
                    'Preferred brand or alternative brands',
                  ].map(item => (
                    <div key={item} className="rounded-2xl bg-muted px-4 py-3">
                      {item}
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="border-0 bg-secondary p-6 text-secondary-foreground shadow-sm">
                <h2 className="text-xl font-black">Bulk buying support</h2>
                <p className="mt-3 text-sm leading-7 text-secondary-foreground/78">
                  This form is designed for project procurement, wholesale requests
                  and quotation processing.
                </p>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
