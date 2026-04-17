import type { Metadata } from 'next';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { buildMetadata } from '@/lib/seo';
import { requireRoleSegment } from '@/lib/dashboard-auth';
import { getAllCategoriesWithTotalNewsCount } from '@/services/Category';
import { getAllUsers } from '@/services/Admin';
import { getAllUrls } from '@/services/ExtraData';
import { getMyOrders } from '@/services/Order';

export const metadata: Metadata = buildMetadata({
    title: 'Dashboard',
    description: 'Role-based dashboard overview.',
    path: '/dashboard',
    noindex: true,
});

export const dynamic = 'force-dynamic';

function readCount(result: unknown): number {
    if (Array.isArray(result)) return result.length;
    if (typeof result === 'object' && result !== null) {
        const payload = result as { data?: unknown; meta?: { total?: unknown }; total?: unknown };
        if (typeof payload.total === 'number') return payload.total;
        if (typeof payload.meta?.total === 'number') return payload.meta.total;
        if (Array.isArray(payload.data)) return payload.data.length;
    }
    return 0;
}

type Props = { params: Promise<{ role: string }> };

export default async function RoleDashboardPage({ params }: Props) {
    const { role } = await params;
    const user = await requireRoleSegment(role);

    if (user.role === 'USER') {
        const ordersResult = await getMyOrders().catch(() => null);
        const orders = Array.isArray(ordersResult?.data) ? ordersResult.data : [];

        return (
            <div className="space-y-6">
                <section className="grid gap-4 md:grid-cols-3">
                    {[
                        ['Orders', String(orders.length)],
                        ['Pending payments', String(orders.filter(order => order.paymentStatus !== 'PAID').length)],
                        ['Delivered', String(orders.filter(order => order.status === 'DELIVERED').length)],
                    ].map(([label, value]) => (
                        <Card key={label} className="shadow-sm">
                            <CardHeader className="pb-2">
                                <CardDescription>{label}</CardDescription>
                                <CardTitle className="text-2xl">{value}</CardTitle>
                            </CardHeader>
                        </Card>
                    ))}
                </section>

                <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Order progress</CardTitle>
                            <CardDescription>Quick access to your recent order states and payment completion.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {[
                                ['Placed', orders.filter(order => order.status === 'PLACED').length],
                                ['Processing', orders.filter(order => order.status === 'PROCESSING').length],
                                ['Delivered', orders.filter(order => order.status === 'DELIVERED').length],
                                ['Paid', orders.filter(order => order.paymentStatus === 'PAID').length],
                            ].map(([label, value]) => (
                                <div key={String(label)} className="rounded-xl border p-4">
                                    <div className="text-sm text-muted-foreground">{String(label)}</div>
                                    <div className="mt-1 text-2xl font-black">{String(value)}</div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Shortcuts</CardTitle>
                            <CardDescription>Common actions for account holders.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            <Button asChild><Link href="/shop">Continue shopping</Link></Button>
                            <Button asChild variant="outline"><Link href="/my-account/orders">All orders</Link></Button>
                            <Button asChild variant="outline"><Link href="/quotation-request">Request quotation</Link></Button>
                        </CardContent>
                    </Card>
                </section>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>My orders</CardTitle>
                        <CardDescription>Track all of your backend orders from one place.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map(order => (
                                    <TableRow key={order.orderId}>
                                        <TableCell className="font-medium">{order.orderId}</TableCell>
                                        <TableCell><Badge variant="secondary">{order.status}</Badge></TableCell>
                                        <TableCell>{order.paymentStatus}</TableCell>
                                        <TableCell>Tk. {order.total.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Button asChild size="sm" variant="outline">
                                                <Link href={`/my-account/orders/${order.orderId}`}>View</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const [categoriesResult, usersResult, linksResult] = await Promise.all([
        getAllCategoriesWithTotalNewsCount().catch(() => null),
        getAllUsers().catch(() => null),
        getAllUrls().catch(() => null),
    ]);

    const stats = [
        { label: 'Categories', value: String(readCount(categoriesResult)) },
        { label: 'Users', value: String(readCount(usersResult)) },
        { label: 'Content links', value: String(readCount(linksResult)) },
        { label: 'Role', value: user.role },
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
                    </Card>
                ))}
            </section>

            <section className="grid gap-4 xl:grid-cols-3">
                {[
                    { title: 'Catalog', description: 'Manage products, categories, sub-categories, and brands.', href: '/dashboard/products' },
                    { title: 'Content', description: 'Update hero content and review customer messages.', href: '/dashboard/hero' },
                    { title: 'Comparisons', description: 'Inspect customer comparison behavior and saved records.', href: '/dashboard/comparisons' },
                ].map(card => (
                    <Card key={card.title} className="shadow-sm">
                        <CardHeader>
                            <CardTitle>{card.title}</CardTitle>
                            <CardDescription>{card.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="outline">
                                <Link href={card.href}>Open {card.title.toLowerCase()}</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </section>
        </div>
    );
}
