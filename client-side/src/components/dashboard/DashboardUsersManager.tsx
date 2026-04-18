import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type DashboardUserRecord = {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
    isActive?: boolean;
    createdAt?: string;
};

export function DashboardUsersManager({
    users,
    title,
    description,
}: {
    users: DashboardUserRecord[];
    title: string;
    description: string;
}) {
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : null}
                        {users.slice(0, 20).map(user => (
                            <TableRow key={user._id ?? `${user.email}-${user.name}`}>
                                <TableCell className="font-medium">{user.name ?? '-'}</TableCell>
                                <TableCell>{user.email ?? '-'}</TableCell>
                                <TableCell>{user.phone ?? '-'}</TableCell>
                                <TableCell>
                                    <Badge variant={user.isActive === false ? 'secondary' : 'default'}>
                                        {user.isActive === false ? 'Inactive' : 'Active'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
