'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardInput } from '@/components/dashboard/DashboardInput';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableFilter } from '@/components/ui/table-filter';
import { TablePagination } from '@/components/ui/table-pagination';
import { createBrand, deleteBrand, type BackendBrand, updateBrand } from '@/services/Brand';
import Image from 'next/image';

const initialForm = { name: '', slug: '', image: '', description: '', isActive: true };

// function EmptyCard() {
//     return { name: '', slug: '', image: '', description: '', isActive: true };
// }

function slugify(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

export function DashboardBrandsManager({ brands }: { brands: BackendBrand[] }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [form, setForm] = useState(initialForm);
    const [brandImageFile, setBrandImageFile] = useState<File | null>(null);
    const [brandImagePreview, setBrandImagePreview] = useState('');
    const [editingSlug, setEditingSlug] = useState<string | null>(null);
    const [editingForm, setEditingForm] = useState(initialForm);
    // Filter state
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const filteredData = useMemo(() => {
        const q = search.toLowerCase();
        return brands.filter(b => b.name?.toLowerCase().includes(q) || b.slug?.toLowerCase().includes(q));
    }, [brands, search]);

    const paginatedRows = useMemo(() => {
        const start = (page - 1) * limit;
        return filteredData.slice(start, start + limit);
    }, [filteredData, page, limit]);

    useEffect(() => {
        return () => {
            if (brandImagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(brandImagePreview);
            }
        };
    }, [brandImagePreview]);

    function refresh(message: string, type: 'success' | 'error') {
        if (type === 'success') {
            toast.success(message);
        } else {
            toast.error(message);
        }
        router.refresh();
    }

    function handleBrandNameChange(name: string) {
        setForm(current => ({
            ...current,
            name,
            slug: slugify(name),
        }));
    }

    function handleBrandImageSelect(file?: File) {
        if (!file) return;

        if (brandImagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(brandImagePreview);
        }

        setBrandImageFile(file);
        setBrandImagePreview(URL.createObjectURL(file));
    }

    return (
        <div className="space-y-6">
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Create brand</CardTitle>
                    <CardDescription>Add and manage storefront brands.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                    <DashboardInput
                        placeholder="Name"
                        value={form.name}
                        onChange={e => handleBrandNameChange(e.target.value)}
                    />
                    <DashboardInput placeholder="Slug" value={form.slug} readOnly />
                    <div className="space-y-2 xl:col-span-2">
                        <div className="rounded-2xl border border-border/70 bg-background/80 p-3 shadow-sm">
                            <div className="text-sm font-medium text-foreground">Brand image</div>
                            <div className="mt-3 flex flex-col gap-3">
                                {brandImagePreview ? (
                                    <div className="overflow-hidden rounded-xl border bg-muted">
                                        <Image
                                            src={brandImagePreview}
                                            alt="Brand preview"
                                            height={500}
                                            width={500}
                                            className="h-36 w-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-dashed border-border/80 px-4 py-8 text-center text-sm text-muted-foreground">
                                        Select an image to preview it here.
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/80"
                                    onChange={e => {
                                        handleBrandImageSelect(e.target.files?.[0]);
                                        e.currentTarget.value = '';
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <DashboardInput
                        placeholder="Description"
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                    />
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={form.isActive}
                            onChange={e => setForm({ ...form, isActive: e.target.checked })}
                        />
                        Active
                    </label>
                    <div className="xl:col-span-5">
                        <Button
                            type="button"
                            className="gap-2"
                            disabled={isPending}
                            onClick={() =>
                                startTransition(async () => {
                                    if (!brandImageFile) {
                                        toast.error('Brand image is required.');
                                        return;
                                    }

                                    const result = await createBrand({
                                        name: form.name,
                                        slug: form.slug,
                                        image: brandImageFile,
                                        description: form.description,
                                        isActive: form.isActive,
                                    });

                                    if (!result?.success)
                                        return refresh(result?.message ?? 'Failed to create brand.', 'error');

                                    setForm(initialForm);
                                    setBrandImageFile(null);
                                    setBrandImagePreview('');

                                    refresh(result.message ?? 'Brand created successfully.', 'success');
                                })
                            }
                        >
                            <Plus className="size-4" />
                            Create brand
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle>Brands</CardTitle>
                        <CardDescription>
                            {filteredData.length} of {brands.length}
                        </CardDescription>
                    </div>
                    <TableFilter value={search} onChange={setSearch} placeholder="Search brands..." />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedRows.map(brand => {
                                const isEditing = editingSlug === brand.slug;
                                return (
                                    <TableRow key={brand.slug}>
                                        <TableCell className="font-medium">
                                            {isEditing ? (
                                                <DashboardInput
                                                    value={editingForm.name}
                                                    onChange={e =>
                                                        setEditingForm({
                                                            ...editingForm,
                                                            name: e.target.value,
                                                        })
                                                    }
                                                />
                                            ) : (
                                                brand.name
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {isEditing ? (
                                                <DashboardInput
                                                    value={editingForm.slug}
                                                    onChange={e =>
                                                        setEditingForm({
                                                            ...editingForm,
                                                            slug: e.target.value,
                                                        })
                                                    }
                                                />
                                            ) : (
                                                brand.slug
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {isEditing ? (
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={editingForm.isActive}
                                                        onChange={e =>
                                                            setEditingForm({
                                                                ...editingForm,
                                                                isActive: e.target.checked,
                                                            })
                                                        }
                                                    />
                                                    Active
                                                </label>
                                            ) : (
                                                <Badge variant="secondary">
                                                    {brand.isActive === false ? 'Inactive' : 'Active'}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {isEditing ? (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            disabled={isPending}
                                                            onClick={() =>
                                                                startTransition(async () => {
                                                                    const result = await updateBrand(
                                                                        brand.slug,
                                                                        editingForm,
                                                                    );
                                                                    if (!result?.success)
                                                                        return refresh(
                                                                            result?.message ??
                                                                                'Failed to update brand.',
                                                                            'error',
                                                                        );
                                                                    setEditingSlug(null);
                                                                    refresh(
                                                                        result.message ??
                                                                            'Brand updated successfully.',
                                                                        'success',
                                                                    );
                                                                })
                                                            }
                                                        >
                                                            Save
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => setEditingSlug(null)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                setEditingSlug(brand.slug);
                                                                setEditingForm({
                                                                    name: brand.name,
                                                                    slug: brand.slug,
                                                                    image: brand.image ?? '',
                                                                    description: brand.description ?? '',
                                                                    isActive: brand.isActive,
                                                                });
                                                            }}
                                                        >
                                                            <Pencil className="size-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            disabled={isPending}
                                                            onClick={() =>
                                                                startTransition(async () => {
                                                                    const result = await deleteBrand(
                                                                        brand.slug,
                                                                    );
                                                                    if (!result?.success)
                                                                        return refresh(
                                                                            result?.message ??
                                                                                'Failed to delete brand.',
                                                                            'error',
                                                                        );
                                                                    refresh(
                                                                        result.message ??
                                                                            'Brand deleted successfully.',
                                                                        'success',
                                                                    );
                                                                })
                                                            }
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
                    {filteredData.length > limit && (
                        <div className="mt-4 border-t pt-4">
                            <TablePagination
                                page={page}
                                limit={limit}
                                total={filteredData.length}
                                onPageChange={setPage}
                                onLimitChange={l => {
                                    setLimit(l);
                                    setPage(1);
                                }}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
