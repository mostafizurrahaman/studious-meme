import type { PropsWithChildren } from 'react';
import { Container } from '@/components/Container';

type Props = PropsWithChildren<{
  title: string;
  description?: string;
}>;

export function PageShell({ title, description, children }: Props) {
  return (
    <main className="flex-1 bg-[#f5f6f8]">
      <Container>
        <div className="py-8">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h1 className="text-xl font-extrabold text-[#0e2f56]">{title}</h1>
            {description ? (
              <p className="mt-2 text-sm text-black/60">{description}</p>
            ) : null}

            <div className="mt-6">{children}</div>
          </div>
        </div>
      </Container>
    </main>
  );
}
