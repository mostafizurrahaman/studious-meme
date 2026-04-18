'use client';

import type React from 'react';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ImagePlus, Pencil, Plus, Trash2, UploadCloud } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardInput } from '@/components/dashboard/DashboardInput';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableFilter } from '@/components/ui/table-filter';
import { TablePagination } from '@/components/ui/table-pagination';
import { createBrand, deleteBrand, type BackendBrand, updateBrand } from '@/services/Brand';
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

function sliceText(value?: string, maxLength = 44) {
    if (!value) return '-';
    return value.length > maxLength ? `${value.slice(0, maxLength).trim()}…` : value;
}

export function DashboardBrandsManager({ brands }: { brands: BackendBrand[] }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [form, setForm] = useState(initialForm);
    const [brandImageFile, setBrandImageFile] = useState<File | null>(null);
    const [brandImagePreview, setBrandImagePreview] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [editingSlug, setEditingSlug] = useState<string | null>(null);
    const [editingForm, setEditingForm] = useState(initialForm);
    const [editingBrandImageFile, setEditingBrandImageFile] = useState<File | null>(null);
    const [editingBrandImagePreview, setEditingBrandImagePreview] = useState('');
    const [isEditingDragging, setIsEditingDragging] = useState(false);
    // Filter state
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const editingImageInputRef = useRef<HTMLInputElement>(null);

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

    function handleEditingBrandImageSelect(file?: File) {
        if (!file) return;

        if (editingBrandImagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(editingBrandImagePreview);
        }

        setEditingBrandImageFile(file);
        setEditingBrandImagePreview(URL.createObjectURL(file));
    }

    function handleEditingBrandImageDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        setIsEditingDragging(false);
        handleEditingBrandImageSelect(event.dataTransfer.files?.[0]);
    }

    function handleBrandImageDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        setIsDragging(false);
        handleBrandImageSelect(event.dataTransfer.files?.[0]);
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
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() => imageInputRef.current?.click()}
                            onKeyDown={event => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    imageInputRef.current?.click();
                                }
                            }}
                            onDragEnter={() => setIsDragging(true)}
                            onDragOver={event => {
                                event.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleBrandImageDrop}
                            className={`rounded-2xl border-2 border-dashed p-4 transition ${
                                isDragging
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border/70 bg-background/80 hover:border-primary/40 hover:bg-muted/20'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <UploadCloud className="size-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-semibold text-foreground">Brand image</div>
                                    <p className="text-xs text-muted-foreground">
                                        Drag and drop an image here or click to upload.
                                    </p>
                                    <div className="mt-3 overflow-hidden rounded-xl border bg-muted">
                                        {brandImagePreview ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img
                                                src={brandImagePreview}
                                                alt="Brand preview"
                                                className="h-36 w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-36 items-center justify-center gap-2 text-sm text-muted-foreground">
                                                <ImagePlus className="size-4" />
                                                Preview will appear here
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <input
                            ref={imageInputRef}
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={e => {
                                handleBrandImageSelect(e.target.files?.[0]);
                                e.currentTarget.value = '';
                            }}
                        />
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
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedRows.map(brand => {
                                const isEditing = editingSlug === brand.slug;
                                return (
                                    <TableRow key={brand.slug}>
                                        <TableCell>
                                            {isEditing ? (
                                                <>
                                                    <div
                                                        role="button"
                                                        tabIndex={0}
                                                        onClick={() => editingImageInputRef.current?.click()}
                                                        onKeyDown={event => {
                                                            if (event.key === 'Enter' || event.key === ' ') {
                                                                event.preventDefault();
                                                                editingImageInputRef.current?.click();
                                                            }
                                                        }}
                                                        onDragEnter={() => setIsEditingDragging(true)}
                                                        onDragOver={event => {
                                                            event.preventDefault();
                                                            setIsEditingDragging(true);
                                                        }}
                                                        onDragLeave={() => setIsEditingDragging(false)}
                                                        onDrop={handleEditingBrandImageDrop}
                                                        className={`rounded-xl border-2 border-dashed p-2 transition ${
                                                            isEditingDragging
                                                                ? 'border-primary bg-primary/5'
                                                                : 'border-border/70 bg-background/80 hover:border-primary/40'
                                                        }`}
                                                    >
                                                        <div className="flex flex-col items-center gap-2">
                                                            <div className="flex size-12 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                                                                {editingBrandImagePreview ||
                                                                editingForm.image ? (
                                                                    /* eslint-disable-next-line @next/next/no-img-element */
                                                                    <img
                                                                        src={
                                                                            editingBrandImagePreview ||
                                                                            editingForm.image
                                                                        }
                                                                        alt={editingForm.name || brand.name}
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <ImagePlus className="size-4 text-muted-foreground" />
                                                                )}
                                                            </div>
                                                            <div className="text-center text-[11px] text-muted-foreground">
                                                                Drop or click to replace
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <input
                                                        ref={editingImageInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        className="sr-only"
                                                        onChange={e => {
                                                            handleEditingBrandImageSelect(
                                                                e.target.files?.[0],
                                                            );
                                                            e.currentTarget.value = '';
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                <div className="flex size-12 items-center justify-center overflow-hidden rounded-xl border bg-muted">
                                                    {brand.image ? (
                                                        /* eslint-disable-next-line @next/next/no-img-element */
                                                        <img
                                                            src={brand.image}
                                                            alt={brand.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <ImagePlus className="size-4 text-muted-foreground" />
                                                    )}
                                                </div>
                                            )}
                                        </TableCell>
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
                                        <TableCell className="max-w-60 text-sm text-muted-foreground">
                                            {isEditing ? (
                                                <DashboardInput
                                                    value={editingForm.description}
                                                    onChange={e =>
                                                        setEditingForm({
                                                            ...editingForm,
                                                            description: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Description"
                                                />
                                            ) : (
                                                sliceText(brand.description)
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
                                                                        {
                                                                            name: editingForm.name,
                                                                            slug: editingForm.slug,
                                                                            image:
                                                                                editingBrandImageFile ??
                                                                                undefined,
                                                                            description:
                                                                                editingForm.description,
                                                                            isActive: editingForm.isActive,
                                                                        },
                                                                    );
                                                                    if (!result?.success)
                                                                        return refresh(
                                                                            result?.message ??
                                                                                'Failed to update brand.',
                                                                            'error',
                                                                        );
                                                                    setEditingSlug(null);
                                                                    setEditingBrandImageFile(null);
                                                                    setEditingBrandImagePreview('');
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
                                                            onClick={() => {
                                                                setEditingSlug(null);
                                                                setEditingBrandImageFile(null);
                                                                setEditingBrandImagePreview('');
                                                            }}
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
                                                                setEditingBrandImageFile(null);
                                                                setEditingBrandImagePreview(
                                                                    brand.image ?? '',
                                                                );
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
