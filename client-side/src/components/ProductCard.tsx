import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { AddToCompareButton } from '@/components/compare/AddToCompareButton';
import { AddToWishlistButton } from '@/components/wishlist/AddToWishlistButton';
import { getProductPrimaryImage, type Product } from '@/lib/storefront-types';

type Props = {
  product: Product;
  priority?: boolean;
  trailingAction?: React.ReactNode;
};

export function ProductCard({ product, priority = false, trailingAction }: Props) {
  const primaryImage = getProductPrimaryImage(product);

  return (
    <Card className="group overflow-hidden border-border transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-square bg-muted p-2">
        <Link href={`/product/${product.slug}`} className="absolute inset-0 block">
          <Image
            src={primaryImage}
            alt={product.title}
            fill
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="ui-image-card object-contain p-2 transition duration-300 group-hover:scale-105"
          />
          {product.badge ? (
            <Badge className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] shadow-sm">
              {product.badge}
            </Badge>
          ) : null}
        </Link>
        <div className="absolute right-2 top-2 z-10 flex flex-col gap-1.5 opacity-0 transition duration-300 group-hover:opacity-100">
          <AddToCompareButton
            product={product}
            compact
            className="w-full rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-semibold text-foreground/70 shadow-sm transition hover:border-primary/30 hover:text-primary"
          />
          <Link
            href={`/product/${product.slug}`}
            className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-semibold text-foreground/70 shadow-sm transition hover:border-primary/30 hover:text-primary"
          >
            Quick view
          </Link>
          <AddToWishlistButton
            product={product}
            compact
            className="w-full rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-semibold text-foreground/70 shadow-sm transition hover:border-primary/30 hover:text-primary"
          />
        </div>
      </div>
      <CardContent className="space-y-1.5 p-2.5 pt-2.5 sm:space-y-2 sm:p-4 sm:pt-4">
        <Link href={`/product/${product.slug}`} className="block">
          <h3
            className="wrap-break-word text-[11px] font-semibold leading-5 text-foreground transition hover:text-primary sm:text-[13px]"
            title={product.title}
          >
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center gap-1 text-[9px] text-foreground/55 sm:text-[11px]">
          <span>Brand: {product.brand}</span>
          <span>SKU {product.sku}</span>
        </div>
        <div className="flex items-center gap-1 text-[9px] text-primary sm:text-[11px]">
          <span>★★★★★</span>
          <span className="text-foreground/50">({product.rating})</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] sm:text-[13px]">
          <span className="font-extrabold text-primary">{product.price}</span>
          {product.oldPrice ? (
            <span className="text-foreground/45 line-through">{product.oldPrice}</span>
          ) : null}
        </div>
        <div className="flex items-center justify-between text-[9px] text-foreground/60 sm:text-[11px]">
          <span>{product.stock}</span>
          <span>In catalog</span>
        </div>
        <div className="grid gap-1.5 pt-1 sm:grid-cols-1 sm:gap-2">
          <AddToCartButton product={product} />
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              className="h-8 flex-1 rounded-full border-border px-3 text-[8px] font-semibold text-foreground/70 sm:h-12 sm:text-[11px]"
            >
              <Link href={`/product/${product.slug}`}>View</Link>
            </Button>
            {trailingAction ? <div className="shrink-0">{trailingAction}</div> : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
