import type { Metadata } from 'next';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { requireDashboardRoles } from '@/lib/dashboard-auth';
import { buildMetadata } from '@/lib/seo';
import { getAllContacts } from '@/services/Contact';

export const metadata: Metadata = buildMetadata({
    title: 'Messages',
    description: 'View incoming contact requests from customers.',
    path: '/dashboard/messages',
    noindex: true,
});

export const dynamic = 'force-dynamic';

export default async function DashboardMessagesPage() {
    await requireDashboardRoles(['ADMIN', 'SUPER_ADMIN']);
    const contactsResult = await getAllContacts().catch(() => null);
    const contacts = Array.isArray(contactsResult?.data)
        ? (contactsResult.data as Array<{
              name: string;
              email: string;
              message: string;
              isReplied?: boolean;
              createdAt?: string;
          }>)
        : [];

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>{contacts.length} contact requests loaded from backend.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contacts.slice(0, 12).map(contact => (
                            <TableRow key={`${contact.email}-${contact.createdAt ?? contact.name}`}>
                                <TableCell className="font-medium">{contact.name}</TableCell>
                                <TableCell>{contact.email}</TableCell>
                                <TableCell className="max-w-105 truncate">{contact.message}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">
                                        {contact.isReplied ? 'Replied' : 'Open'}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
