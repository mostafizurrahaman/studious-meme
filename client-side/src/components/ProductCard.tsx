import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import type { Product } from '@/lib/malamal-content';

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  return (
    <Card className="group overflow-hidden border-border transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/product/${product.sku}`} className="block">
        <div className="relative aspect-square bg-muted p-2.5">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="ui-image-card object-contain p-2.5 transition duration-300 group-hover:scale-105"
          />
          {product.badge ? (
            <Badge className="absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] shadow-sm">
              {product.badge}
            </Badge>
          ) : null}
          <div className="absolute right-2.5 top-2.5 flex flex-col gap-2 opacity-0 transition duration-300 group-hover:opacity-100">
            {['Compare', 'Quick view', 'Wishlist'].map(label => (
              <span
                key={label}
                className="rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-semibold text-foreground/70 shadow-sm"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </Link>
      <CardContent className="space-y-2.5 p-4 pt-4">
        <Link href={`/product/${product.sku}`} className="block">
          <h3 className="line-clamp-2 min-h-[3.1rem] text-[13px] font-semibold leading-5 text-foreground transition hover:text-primary">
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5 text-[11px] text-foreground/55">
          <span>Brand: {product.brand}</span>
          <span>SKU {product.sku}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-primary">
          <span>★★★★★</span>
          <span className="text-foreground/50">({product.rating})</span>
        </div>
        <div className="flex items-center gap-2 text-[13px]">
          <span className="font-extrabold text-primary">{product.price}</span>
          {product.oldPrice ? (
            <span className="text-foreground/45 line-through">
              {product.oldPrice}
            </span>
          ) : null}
        </div>
        <div className="flex items-center justify-between text-[11px] text-foreground/60">
          <span>{product.stock}</span>
          <span>In catalog</span>
        </div>
        <div className="grid gap-2 pt-1 sm:flex">
          <AddToCartButton product={product} />
          <Button
            asChild
            variant="outline"
            className="h-12 w-full rounded-full border-border px-3 text-[11px] font-semibold text-foreground/70 sm:w-auto"
          >
            <Link href={`/product/${product.sku}`}>View</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
