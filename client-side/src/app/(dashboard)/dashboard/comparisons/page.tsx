import type { Metadata } from 'next';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { requireDashboardRoles } from '@/lib/dashboard-auth';
import { buildMetadata } from '@/lib/seo';
import { getAllComparisonHistory } from '@/services/ComparisonHistory';

export const metadata: Metadata = buildMetadata({
    title: 'Comparisons',
    description: 'Inspect saved product comparison history.',
    path: '/dashboard/comparisons',
    noindex: true,
});

export const dynamic = 'force-dynamic';

export default async function DashboardComparisonsPage() {
    await requireDashboardRoles(['ADMIN', 'SUPER_ADMIN']);
    const historyResult = await getAllComparisonHistory().catch(() => null);
    const history = Array.isArray(historyResult?.data)
        ? (historyResult.data as Array<{
              user?: { name?: string; email?: string };
              products?: unknown[];
              createdAt?: string;
          }>)
        : [];

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Comparisons</CardTitle>
                <CardDescription>{history.length} comparison records loaded from backend.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Products</TableHead>
                            <TableHead>Created</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.slice(0, 12).map((item, index) => (
                            <TableRow key={`${item.createdAt ?? index}`}>
                                <TableCell className="font-medium">
                                    {item.user?.name ?? item.user?.email ?? 'Anonymous'}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{item.products?.length ?? 0}</Badge>
                                </TableCell>
                                <TableCell>{item.createdAt ?? '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
