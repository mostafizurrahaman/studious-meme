import Link from 'next/link';

const items = [
  ['Home', '/'],
  ['Categories', '/main-categories'],
  ['Wishlist', '/wishlist'],
  ['Cart', '/cart'],
  ['Account', '/my-account'],
] as const;

export function MobileToolbar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white/95 backdrop-blur-sm lg:hidden">
      <div className="mx-auto grid max-w-310 grid-cols-5 px-2 py-2 text-[11px] font-semibold text-black/70">
        {items.map(([label, href]) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col items-center gap-1 rounded-2xl py-1.5 transition hover:bg-primary/5 hover:text-primary"
          >
            <span className="h-2 w-2 rounded-full bg-primary" />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
