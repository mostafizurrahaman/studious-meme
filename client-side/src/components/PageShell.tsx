import type { PropsWithChildren } from 'react';

import { Card } from '@/components/ui/card';
import { Container } from '@/components/Container';

type Props = PropsWithChildren<{
    title: string;
    description?: string;
}>;

export function PageShell({ title, description, children }: Props) {
    return (
        <main className="flex-1 bg-background">
            <Container>
                <div className="py-8">
                    <Card className="p-6 shadow-sm">
                        <h1 className="text-xl font-extrabold text-secondary">{title}</h1>
                        {description ? (
                            <p className="mt-2 text-sm text-foreground/60">{description}</p>
                        ) : null}

                        <div className="mt-6">{children}</div>
                    </Card>
                </div>
            </Container>
        </main>
    );
}
