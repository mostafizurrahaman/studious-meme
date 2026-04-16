import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { buildMetadata } from '@/lib/seo';
import { getAllCategoriesWithTotalNewsCount } from '@/services/Category';
import { getAllUsers } from '@/services/Admin';
import { getAllUrls } from '@/services/ExtraData';
import { getCurrentUser } from '@/services/Auth';

export const metadata: Metadata = buildMetadata({
    title: 'Dashboard',
    description: 'Internal dashboard for catalog, content and support operations.',
    path: '/dashboard',
    noindex: true,
});

export const dynamic = 'force-dynamic';

function readCount(result: unknown): number {
    if (Array.isArray(result)) {
        return result.length;
    }

    if (typeof result === 'object' && result !== null) {
        const payload = result as { data?: unknown; meta?: { total?: unknown }; total?: unknown };

        if (typeof payload.total === 'number') return payload.total;
        if (typeof payload.meta?.total === 'number') return payload.meta.total;
        if (Array.isArray(payload.data)) return payload.data.length;
    }

    return 0;
}

export default async function DashboardPage() {
    const [user, categoriesResult, usersResult, linksResult] = await Promise.all([
        getCurrentUser(),
        getAllCategoriesWithTotalNewsCount().catch(() => null),
        getAllUsers().catch(() => null),
        getAllUrls().catch(() => null),
    ]);

    const categoryCount = readCount(categoriesResult);
    const userCount = readCount(usersResult);
    const linkCount = readCount(linksResult);

    const stats = [
        { label: 'Categories', value: categoryCount.toString(), helper: 'Catalog structure' },
        { label: 'Team users', value: userCount.toString(), helper: 'Admin access' },
        { label: 'Content links', value: linkCount.toString(), helper: 'Brand channels' },
        { label: 'Signed in', value: user?.name ?? 'Guest', helper: user?.role ?? 'No session' },
    ];

    const recentItems = [
        { name: 'New product sync', status: 'Pending', source: 'Catalog' },
        { name: 'Quotation request', status: 'Open', source: 'Support' },
        { name: 'Homepage hero update', status: 'Draft', source: 'CMS' },
    ];

    return (
        <div className="space-y-6">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {stats.map(stat => (
                    <Card key={stat.label} className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription>{stat.label}</CardDescription>
                            <CardTitle className="text-2xl">{stat.value}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{stat.helper}</p>
                        </CardContent>
                    </Card>
                ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent actions</CardTitle>
                        <CardDescription>Operational items that typically need review.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Source</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentItems.map(item => (
                                    <TableRow key={item.name}>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{item.status}</Badge>
                                        </TableCell>
                                        <TableCell>{item.source}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Current session</CardTitle>
                        <CardDescription>Authenticated context for dashboard actions.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium">Name</p>
                            <p className="text-sm text-muted-foreground">{user?.name ?? 'Guest'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">{user?.email ?? 'Not signed in'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Role</p>
                            <p className="text-sm text-muted-foreground">{user?.role ?? 'Unknown'}</p>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
