import Link from 'next/link';

type Props = {
  title: string;
  actionHref?: string;
  actionLabel?: string;
};

export function SectionHeading({
  title,
  actionHref,
  actionLabel = 'More Products',
}: Props) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 className="text-lg font-extrabold tracking-tight text-[#0e2f56] sm:text-xl">
        {title}
      </h2>
      {actionHref ? (
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#f15a24] shadow-sm"
          href={actionHref}
        >
          {actionLabel}
          <span aria-hidden="true">›</span>
        </Link>
      ) : null}
    </div>
  );
}
