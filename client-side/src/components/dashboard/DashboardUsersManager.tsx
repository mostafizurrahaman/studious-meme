"use client";

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { formatDashboardDate } from '@/lib/formatDate';
import { deleteUserById, updateUserStatus } from '@/services/Admin';

type DashboardUserRecord = {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
    image?: string;
    dob?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
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
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function refresh(message: string, type: 'success' | 'error') {
        if (type === 'success') {
            toast.success(message);
        } else {
            toast.error(message);
        }

        router.refresh();
    }

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
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>DOB</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Updated At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="h-24 text-center">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : null}
                        {users.slice(0, 20).map(user => (
                            <TableRow key={user._id ?? `${user.email}-${user.name}`}>
                                <TableCell>
                                    <div className="flex size-12 items-center justify-center overflow-hidden rounded-xl border bg-muted">
                                        {user.image ? (
                                            <Image
                                                height={500}
                                                width={500}
                                                src={user.image}
                                                alt={user.name ?? 'User'}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xs text-muted-foreground">-</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{user.name ?? '-'}</TableCell>
                                <TableCell>{user.email ?? '-'}</TableCell>
                                <TableCell>{user.phone ?? '-'}</TableCell>
                                <TableCell>{formatDashboardDate(user.dob, { time: false })}</TableCell>
                                <TableCell>
                                    <Badge variant={user.isActive === false ? 'secondary' : 'default'}>
                                        {user.isActive === false ? 'Inactive' : 'Active'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <span title={formatDashboardDate(user.createdAt, { time: true })}>
                                        {formatDashboardDate(user.createdAt)}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span title={formatDashboardDate(user.updatedAt, { time: true })}>
                                        {formatDashboardDate(user.updatedAt)}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={isPending}
                                            onClick={() => {
                                                const userId = user._id;
                                                if (!userId) return;

                                                startTransition(async () => {
                                                    const result = await updateUserStatus(
                                                        userId,
                                                        user.isActive === false,
                                                    );

                                                    if (!result?.success) {
                                                        return refresh(
                                                            result?.message ?? 'Failed to update user status.',
                                                            'error',
                                                        );
                                                    }

                                                    refresh(result.message ?? 'User status updated successfully.', 'success');
                                                });
                                            }}
                                        >
                                            {user.isActive === false ? 'Unblock' : 'Block'}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={isPending}
                                            onClick={() => {
                                                const userId = user._id;
                                                if (!userId) return;

                                                startTransition(async () => {
                                                    const result = await deleteUserById(userId);

                                                    if (!result?.success) {
                                                        return refresh(
                                                            result?.message ?? 'Failed to delete user.',
                                                            'error',
                                                        );
                                                    }

                                                    refresh(result.message ?? 'User deleted successfully.', 'success');
                                                });
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
