import Image from 'next/image';
import Link from 'next/link';

import { AddToCartButton } from '@/components/cart/AddToCartButton';
import type { Product } from '@/lib/malamal-content';

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  return (
    <article className="group overflow-hidden rounded-[20px] border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/product/${product.sku}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-[#f5f6f8] p-2.5">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-contain p-2.5 transition duration-300 group-hover:scale-105"
          />
          {product.badge ? (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-[#f15a24] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-sm">
              {product.badge}
            </span>
          ) : null}
          <div className="absolute right-2.5 top-2.5 flex flex-col gap-2 opacity-0 transition duration-300 group-hover:opacity-100">
            {['Compare', 'Quick view', 'Wishlist'].map(label => (
              <span
                key={label}
                className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-[10px] font-semibold text-black/70 shadow-sm"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </Link>
      <div className="space-y-2 p-4">
        <Link href={`/product/${product.sku}`} className="block">
          <h3 className="line-clamp-2 min-h-[2.9rem] text-[13px] font-semibold leading-5 text-black transition hover:text-[#f15a24]">
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center gap-2 text-[11px] text-black/55">
          <span>Brand: {product.brand}</span>
          <span>SKU {product.sku}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#f15a24]">
          <span>★★★★★</span>
          <span className="text-black/50">({product.rating})</span>
        </div>
        <div className="flex items-center gap-2 text-[13px]">
          <span className="font-extrabold text-[#f15a24]">{product.price}</span>
          {product.oldPrice ? (
            <span className="text-black/45 line-through">{product.oldPrice}</span>
          ) : null}
        </div>
        <div className="flex items-center justify-between text-[11px] text-black/60">
          <span>{product.stock}</span>
          <span>In catalog</span>
        </div>
        <div className="flex gap-2 pt-1">
          <AddToCartButton product={product} />
          <Link
            href={`/product/${product.sku}`}
            className="rounded-full border border-black/10 px-3 py-2 text-[11px] font-semibold text-black/70"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
