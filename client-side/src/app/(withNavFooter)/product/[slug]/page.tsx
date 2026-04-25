import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductCard } from "@/components/ProductCard";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { AddToCompareButton } from "@/components/compare/AddToCompareButton";
import { AddToWishlistButton } from "@/components/wishlist/AddToWishlistButton";
import { SeoScripts } from "@/components/SeoScripts";
import { buildProductMetadata, buildProductSchemas } from "@/lib/seo";
import {
  getActiveProductBySlug,
  getAllActiveProducts,
  getAllActiveProductsAcrossPages,
  mapBackendProductToStorefrontProduct,
} from "@/services/Product";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const productsResult = await getAllActiveProductsAcrossPages({
    limit: 10000,
  }).catch(() => null);

  return Array.isArray(productsResult?.data)
    ? productsResult.data
        .map((product) => product.slug)
        .filter((slug): slug is string => Boolean(slug))
        .map((slug) => ({ slug }))
    : [];
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const productResult = await getActiveProductBySlug(slug).catch(() => null);
  const backendProduct = productResult?.data;
  const product = backendProduct
    ? await mapBackendProductToStorefrontProduct(backendProduct)
    : null;

  if (!product) {
    return {
      title: "Product not found",
      robots: { index: false, follow: false },
    };
  }

  return buildProductMetadata(product);
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const productResult = await getActiveProductBySlug(slug).catch(() => null);
  const backendProduct = productResult?.data;
  const product = backendProduct
    ? await mapBackendProductToStorefrontProduct(backendProduct)
    : null;

  if (!product) notFound();

  const productsResult = await getAllActiveProducts({
    limit: 4,
    category: product.category,
    excludeSlug: product.slug,
  }).catch(() => null);
  const related = productsResult?.data?.length
    ? await Promise.all(
        productsResult.data.map(mapBackendProductToStorefrontProduct),
      )
    : [];

  // const shortDescription = `${product.title} is available with ${product.brand} branding, catalog pricing, and support for direct order or quotation requests.`;
  const longDescription = `${product.title} is listed with SKU ${product.sku} and ${product.stock}. Contact our sales team for delivery coordination, bulk pricing, and project procurement support.`;

  return (
    <>
      <SeoScripts data={buildProductSchemas(product)} />
      <main className="flex-1 bg-background pb-16">
        <div className="mx-auto w-full max-w-310 px-2 py-2 sm:px-4 sm:py-6 lg:px-0">
          <nav className="overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-semibold text-foreground/45 sm:text-xs">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>{" "}
            /{" "}
            <Link href="/shop" className="hover:text-primary">
              Shop
            </Link>{" "}
            / {product.title}
          </nav>

          <section className="mt-2 grid gap-3 lg:grid-cols-[1.08fr_0.92fr] lg:gap-6">
            <Card className="overflow-hidden rounded-none border-0 bg-transparent p-0 shadow-none lg:rounded-3xl lg:border lg:bg-card lg:p-4 lg:shadow-sm">
              <div className="grid gap-4">
                <div className="relative aspect-16/10 overflow-hidden rounded-2xl bg-muted lg:aspect-square lg:rounded-3xl">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                  />
                  {product.badge ? (
                    <Badge className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold shadow-sm">
                      {product.badge}
                    </Badge>
                  ) : null}
                </div>
              </div>
            </Card>

            <div className="space-y-3 rounded-none border-0 bg-transparent p-0 shadow-none lg:space-y-4 lg:rounded-3xl lg:border lg:bg-card lg:p-6 lg:shadow-sm">
              <h1 className="text-[18px] font-black leading-tight text-secondary sm:text-[34px] lg:text-[30px]">
                {product.title}
              </h1>

              <div className="flex items-center gap-2 text-sm text-foreground/60">
                <div className="text-primary">★★★★★</div>
                <span>Rated {product.rating}/5</span>
              </div>

              <div className="flex items-end gap-2">
                <div className="text-2xl font-black text-primary sm:text-4xl">
                  {product.price}
                </div>
                {product.oldPrice ? (
                  <div className="pb-1 text-sm text-foreground/40 line-through sm:text-lg">
                    {product.oldPrice}
                  </div>
                ) : null}
              </div>

              <div className="text-[10px] font-semibold text-foreground/65 sm:text-sm">
                Brand: {product.brand} · SKU: {product.sku} · {product.stock}
              </div>

              <div className="grid gap-2">
                <AddToCartButton
                  product={product}
                  className="h-9 text-[13px] font-bold sm:h-12 sm:text-base"
                />
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
                  <AddToCompareButton
                    product={product}
                    className="h-8 rounded-full border-border px-2 text-[9px] font-semibold sm:h-11 sm:px-3 sm:text-sm"
                  />
                  <AddToWishlistButton
                    product={product}
                    compact
                    className="h-8 rounded-full border-border px-2 text-[9px] font-semibold sm:h-11 sm:px-3 sm:text-sm"
                  />
                </div>
              </div>

              <Card className="mt-2 grid gap-2 border-0 bg-secondary p-3 text-xs text-secondary-foreground sm:mt-6 sm:grid-cols-3 sm:gap-3 sm:p-4 sm:text-sm">
                {[
                  ["Delivery", "Across Bangladesh"],
                  ["Support", "Dedicated sales team"],
                  ["Quotation", "Bulk order ready"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl bg-white/10 px-3 py-2 sm:px-4 sm:py-3"
                  >
                    <div className="text-[9px] uppercase tracking-[0.18em] text-secondary-foreground/65 sm:text-xs sm:tracking-[0.22em]">
                      {label}
                    </div>
                    <div className="mt-1 text-[11px] font-semibold text-secondary-foreground sm:text-sm">
                      {value}
                    </div>
                  </div>
                ))}
              </Card>

              <div className="hidden space-y-3 pt-1 lg:block">
                <h2 className="text-base font-black text-secondary">
                  Product highlights
                </h2>
                <p className="text-sm leading-7 text-foreground/65">
                  {longDescription}
                </p>
                {/* <div className="grid gap-2 text-sm text-foreground/70">
                  {['Heavy-duty webbing sling', 'Project and retail ready', 'Fast quotation support'].map(
                    item => (
                      <div key={item} className="rounded-2xl bg-muted px-4 py-3 font-semibold">
                        {item}
                      </div>
                    ),
                  )}
                </div> */}
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_300px]">
            <Card className="p-6 shadow-sm">
              <div className="flex flex-wrap gap-2 text-sm font-semibold">
                {["Description", "Specifications", "Reviews"].map((tab) => (
                  <span
                    key={tab}
                    className="rounded-full bg-muted px-4 py-2 text-foreground/70"
                  >
                    {tab}
                  </span>
                ))}
              </div>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div>
                  <h2 className="text-xl font-black text-secondary">
                    Description
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-foreground/65">
                    No backend product description is available for this item
                    yet.
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-black text-secondary">
                    Specifications
                  </h2>
                  <div className="mt-4 overflow-hidden rounded-2xl border border-border">
                    {[
                      ["Brand", product.brand],
                      ["SKU", product.sku],
                      ["Availability", product.stock],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="grid grid-cols-[180px_1fr] border-b border-border last:border-b-0"
                      >
                        <div className="bg-muted px-4 py-3 font-semibold text-secondary">
                          {label}
                        </div>
                        <div className="px-4 py-3 text-foreground/65">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-0 bg-secondary p-6 text-secondary-foreground shadow-sm">
              <h2 className="text-xl font-black">Need bulk pricing?</h2>
              <p className="mt-3 text-sm leading-7 text-secondary-foreground/78">
                Send your quantity and delivery location to receive a quotation
                for project or retail purchase.
              </p>
              <Button
                asChild
                className="mt-6 h-11 rounded-full bg-white px-6 text-sm font-bold text-black! hover:bg-white/90"
              >
                <Link href="/quotation-request">Request quotation</Link>
              </Button>
              <div className="mt-6 space-y-3 text-sm text-secondary-foreground/80">
                <div className="rounded-2xl bg-white/10 px-4 py-3">
                  Bulk order support
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-3">
                  Corporate procurement
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-3">
                  Delivery coordination
                </div>
              </div>
            </Card>
          </section>

          <Card className="mt-10 p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-black text-secondary">
              Related products
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4">
              {related.map((item) => (
                <ProductCard key={item.sku} product={item} />
              ))}
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
