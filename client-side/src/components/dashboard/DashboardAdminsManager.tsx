'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Pencil, ShieldPlus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { createUser, deleteAdmin, updateAdmin } from '@/services/Admin';

type AdminRow = {
    _id?: string;
    name: string;
    email: string;
    phone?: string;
    isActive?: boolean;
    createdAt?: string;
};

type DashboardAdminsManagerProps = {
    admins: AdminRow[];
};

const initialForm = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'ADMIN',
};

export function DashboardAdminsManager({ admins }: DashboardAdminsManagerProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingForm, setEditingForm] = useState({ name: '', email: '', phone: '', isActive: true });

    const sortedAdmins = useMemo(
        () =>
            [...admins].sort((a, b) =>
                a.createdAt && b.createdAt ? b.createdAt.localeCompare(a.createdAt) : 0,
            ),
        [admins],
    );

    return (
        <div className="space-y-6">
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Create admin</CardTitle>
                    <CardDescription>Only super admins can create admin accounts.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <Input
                        placeholder="Name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                    <Input
                        placeholder="Email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                    <Input
                        placeholder="Phone"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                    />
                    <Input
                        type="password"
                        placeholder="Confirm password"
                        value={form.confirmPassword}
                        onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                    />
                    <div className="md:col-span-2">
                        <Button
                            type="button"
                            disabled={isPending}
                            onClick={() => {
                                startTransition(async () => {
                                    if (form.password !== form.confirmPassword) {
                                        toast.error('Passwords must match.');
                                        return;
                                    }

                                    const result = await createUser(form);

                                    if (!result?.success) {
                                        toast.error(result?.message ?? 'Failed to create admin.');
                                        return;
                                    }

                                    toast.success(result.message ?? 'Admin created successfully.');
                                    setForm(initialForm);
                                    router.refresh();
                                });
                            }}
                            className="gap-2"
                        >
                            <ShieldPlus className="size-4" />
                            Create admin
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Admin list</CardTitle>
                    <CardDescription>{admins.length} admin accounts found.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedAdmins.map(admin => {
                                const isEditing = editingId === admin._id;

                                return (
                                    <TableRow key={admin._id ?? admin.email}>
                                        <TableCell className="font-medium">
                                            {isEditing ? (
                                                <Input
                                                    value={editingForm.name}
                                                    onChange={e =>
                                                        setEditingForm({
                                                            ...editingForm,
                                                            name: e.target.value,
                                                        })
                                                    }
                                                />
                                            ) : (
                                                admin.name
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {isEditing ? (
                                                <Input
                                                    value={editingForm.email}
                                                    onChange={e =>
                                                        setEditingForm({
                                                            ...editingForm,
                                                            email: e.target.value,
                                                        })
                                                    }
                                                />
                                            ) : (
                                                admin.email
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {isEditing ? (
                                                <Input
                                                    value={editingForm.phone}
                                                    onChange={e =>
                                                        setEditingForm({
                                                            ...editingForm,
                                                            phone: e.target.value,
                                                        })
                                                    }
                                                />
                                            ) : (
                                                admin.phone || '-'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {isEditing ? (
                                                <select
                                                    value={editingForm.isActive ? 'true' : 'false'}
                                                    onChange={e =>
                                                        setEditingForm({
                                                            ...editingForm,
                                                            isActive: e.target.value === 'true',
                                                        })
                                                    }
                                                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                                                >
                                                    <option value="true">Active</option>
                                                    <option value="false">Inactive</option>
                                                </select>
                                            ) : (
                                                <Badge variant="secondary">
                                                    {admin.isActive === false ? 'Inactive' : 'Active'}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {isEditing ? (
                                                    <>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            disabled={isPending || !admin._id}
                                                            onClick={() => {
                                                                const adminId = admin._id;
                                                                if (!adminId) return;
                                                                startTransition(async () => {
                                                                    const result = await updateAdmin(
                                                                        adminId,
                                                                        editingForm,
                                                                    );
                                                                    if (!result?.success) {
                                                                        toast.error(
                                                                            result?.message ??
                                                                                'Failed to update admin.',
                                                                        );
                                                                        return;
                                                                    }
                                                                    toast.success(
                                                                        result.message ??
                                                                            'Admin updated successfully.',
                                                                    );
                                                                    setEditingId(null);
                                                                    router.refresh();
                                                                });
                                                            }}
                                                        >
                                                            Save
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => setEditingId(null)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            disabled={!admin._id}
                                                            onClick={() => {
                                                                setEditingId(admin._id ?? null);
                                                                setEditingForm({
                                                                    name: admin.name,
                                                                    email: admin.email,
                                                                    phone: admin.phone ?? '',
                                                                    isActive: admin.isActive !== false,
                                                                });
                                                            }}
                                                        >
                                                            <Pencil className="size-4" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            disabled={isPending || !admin._id}
                                                            onClick={() => {
                                                                const adminId = admin._id;
                                                                if (!adminId) return;
                                                                startTransition(async () => {
                                                                    const result = await deleteAdmin(adminId);
                                                                    if (!result?.success) {
                                                                        toast.error(
                                                                            result?.message ??
                                                                                'Failed to delete admin.',
                                                                        );
                                                                        return;
                                                                    }
                                                                    toast.success(
                                                                        result.message ??
                                                                            'Admin deleted successfully.',
                                                                    );
                                                                    router.refresh();
                                                                });
                                                            }}
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
