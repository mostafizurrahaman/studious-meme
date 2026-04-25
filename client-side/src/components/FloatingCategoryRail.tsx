"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { Category } from "@/lib/storefront-types";

type Props = {
  categories: Category[];
};

export function FloatingCategoryRail({ categories }: Props) {
  const [open, setOpen] = useState(false);
  const [activeCategorySlug, setActiveCategorySlug] = useState(
    categories[0]?.slug ?? "",
  );

  const activeCategory = useMemo(
    () =>
      categories.find((category) => category.slug === activeCategorySlug) ??
      categories[0] ??
      null,
    [activeCategorySlug, categories],
  );

  return (
    <div
      className="fixed left-2 z-50 hidden lg:block"
      style={{
        top: "calc(var(--storefront-header-height, clamp(120px, 12vw, 160px)) + 0.75rem)",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Card
        className={`overflow-hidden rounded-2xl shadow-md ring-1 ring-black/10 backdrop-blur transition-[width] duration-200 ${
          open ? "w-72" : "w-10"
        }`}
      >
        <div className="grid gap-1.5 px-1.5 py-2.5">
          <div className="flex items-center gap-2 rounded-full">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              =
            </span>
            <span
              className={`rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground transition ${
                open ? "opacity-100" : "w-0 overflow-hidden opacity-0"
              } whitespace-nowrap`}
            >
              Categories
            </span>
          </div>

          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              onMouseEnter={() => setActiveCategorySlug(category.slug)}
              onFocus={() => setActiveCategorySlug(category.slug)}
              className={`flex items-center gap-2 rounded-md px-0.5 py-1.5 hover:bg-muted ${
                activeCategorySlug === category.slug ? "bg-muted" : ""
              }`}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-border bg-background">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={12}
                    height={12}
                    className="h-3 w-3 object-contain opacity-80"
                  />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </span>
              <span
                className={`text-sm text-foreground/85 whitespace-nowrap transition ${
                  open ? "opacity-100" : "w-0 overflow-hidden opacity-0"
                }`}
              >
                {category.name}
              </span>
            </Link>
          ))}

          {open && activeCategory?.subCategories?.length ? (
            <div className="mt-2 rounded-xl border border-border bg-background p-2">
              <div className="px-1 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                {activeCategory.name} sub categories
              </div>
              <div className="mt-1 grid gap-1">
                {activeCategory.subCategories.map((subCategory) => (
                  <Link
                    key={subCategory.slug}
                    href={`/category/${activeCategory.slug}?subCategorySlug=${subCategory.slug}`}
                    className="rounded-md px-2 py-1.5 text-xs font-medium text-foreground/75 transition hover:bg-primary/5 hover:text-primary"
                  >
                    {subCategory.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <Link
            href="/main-categories"
            className={`rounded-md px-1 py-1.5 text-sm font-semibold text-foreground/85 hover:bg-muted whitespace-nowrap transition ${
              open ? "opacity-100" : "h-0 overflow-hidden p-0 opacity-0"
            }`}
          >
            See All Categories &gt;&gt;
          </Link>
        </div>
      </Card>
      <div
        className={`pointer-events-none fixed inset-0 z-[-1] bg-secondary/35 transition ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
