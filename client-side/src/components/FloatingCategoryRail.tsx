'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { topCategories } from '@/lib/malamal-content';

export function FloatingCategoryRail() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="fixed left-2 top-3 z-50 hidden lg:block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div
        className={`overflow-hidden rounded-2xl bg-white/97 shadow-md ring-1 ring-black/10 backdrop-blur transition-[width] duration-200 ${
          open ? 'w-72' : 'w-10'
        }`}
      >
        <div className="grid gap-1.5 px-1.5 py-2.5">
          <div className="flex items-center gap-2 rounded-full">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f15a24] text-xs font-bold text-white">
              =
            </span>
            <span
              className={`text-sm font-bold text-white transition ${
                open ? 'opacity-100' : 'w-0 overflow-hidden opacity-0'
              } rounded-full bg-[#f15a24] px-4 py-1.5 whitespace-nowrap`}
            >
              Categories
            </span>
          </div>

          {topCategories.map(category => (
            <Link
              key={category.name}
              href={category.href}
              className="flex items-center gap-2 rounded-md px-0.5 py-1.5 hover:bg-[#f7f7f7]"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-black/10 bg-white">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={12}
                  height={12}
                  className="h-3 w-3 object-contain opacity-80"
                />
              </span>
              <span
                className={`text-sm text-black/85 whitespace-nowrap transition ${
                  open ? 'opacity-100' : 'w-0 overflow-hidden opacity-0'
                }`}
              >
                {category.name}
              </span>
            </Link>
          ))}

          <Link
            href="/main-categories"
            className={`rounded-md px-1 py-1.5 text-sm font-semibold text-black/85 hover:bg-[#f7f7f7] whitespace-nowrap transition ${
              open ? 'opacity-100' : 'h-0 overflow-hidden p-0 opacity-0'
            }`}
          >
            See All Categories &gt;&gt;
          </Link>
        </div>
      </div>
      <div
        className={`pointer-events-none fixed inset-0 z-[-1] bg-black/35 transition ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
