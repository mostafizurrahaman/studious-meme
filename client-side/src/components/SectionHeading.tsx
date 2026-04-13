import type { Route } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

type Props = {
  title: string;
  actionHref?: Route;
  actionLabel?: string;
};

export function SectionHeading({
  title,
  actionHref,
  actionLabel = 'More Products',
}: Props) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 className="text-lg font-extrabold tracking-tight text-secondary sm:text-xl">
        {title}
      </h2>
      {actionHref ? (
        <Button
          asChild
          variant="outline"
          className="rounded-full border-border bg-background px-4 py-2 text-sm font-semibold text-primary shadow-sm hover:bg-primary/5"
        >
          <Link href={actionHref}>
            {actionLabel}
            <span aria-hidden="true">›</span>
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
