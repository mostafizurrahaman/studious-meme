import type { PropsWithChildren } from 'react';

export function Container({ children }: PropsWithChildren) {
  return <div className="mx-auto w-full max-w-310 px-4">{children}</div>;
}
