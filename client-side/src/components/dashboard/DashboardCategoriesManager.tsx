'use client';

import type React from 'react';
import { Fragment, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ChevronDown, ImagePlus, Pencil, Plus, Trash2, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardInput } from '@/components/dashboard/DashboardInput';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    createCategory,
    createCategorySubCategory,
    deleteCategory,
    deleteCategorySubCategory,
    updateCategory,
    updateCategorySubCategory,
} from '@/services/Category';

type CategoryRow = {
    name: string;
    slug?: string;
    image?: string;
    description?: string;
    totalNews?: number;
    isActive?: boolean;
    subCategories?: Array<{
        name: string;
        slug: string;
        image?: string;
        description?: string;
        accent?: string;
        isActive?: boolean;
    }>;
};

type DashboardCategoriesManagerProps = {
    categories: CategoryRow[];
};

export function DashboardCategoriesManager({ categories }: DashboardCategoriesManagerProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [editingSlug, setEditingSlug] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [editingDescription, setEditingDescription] = useState('');
    const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
    const [newSubCategory, setNewSubCategory] = useState<
        Record<string, { name: string; slug: string; description: string }>
    >({});
    const [editingSubCategoryKey, setEditingSubCategoryKey] = useState<string | null>(null);
    const [editingSubCategory, setEditingSubCategory] = useState({
        name: '',
        slug: '',
        description: '',
        isActive: true,
    });
    const [categoryImageFile, setCategoryImageFile] = useState<File | null>(null);
    const [categoryImagePreview, setCategoryImagePreview] = useState('');
    const [editingCategoryImageFile, setEditingCategoryImageFile] = useState<File | null>(null);
    const [editingCategoryImagePreview, setEditingCategoryImagePreview] = useState('');
    const [categoryDragging, setCategoryDragging] = useState(false);
    const [editingCategoryDragging, setEditingCategoryDragging] = useState(false);
    const [subCategoryImageFiles, setSubCategoryImageFiles] = useState<Record<string, File | null>>({});
    const [subCategoryImagePreviews, setSubCategoryImagePreviews] = useState<Record<string, string>>({});
    const [subCategoryDraggingKey, setSubCategoryDraggingKey] = useState<string | null>(null);
    const [editingSubCategoryImageFile, setEditingSubCategoryImageFile] = useState<File | null>(null);
    const [editingSubCategoryImagePreview, setEditingSubCategoryImagePreview] = useState('');
    const [editingSubCategoryDragging, setEditingSubCategoryDragging] = useState(false);
    const categoryImageInputRef = useRef<HTMLInputElement>(null);
    const editingCategoryImageInputRef = useRef<HTMLInputElement>(null);
    const editingSubCategoryImageInputRef = useRef<HTMLInputElement>(null);

    const visibleCategories = useMemo(() => categories.slice(0, 24), [categories]);

    useEffect(() => {
        return () => {
            [categoryImagePreview, editingCategoryImagePreview, editingSubCategoryImagePreview]
                .filter((src): src is string => Boolean(src) && src.startsWith('blob:'))
                .forEach(src => URL.revokeObjectURL(src));
            Object.values(subCategoryImagePreviews)
                .filter((src): src is string => Boolean(src) && src.startsWith('blob:'))
                .forEach(src => URL.revokeObjectURL(src));
        };
    }, [categoryImagePreview, editingCategoryImagePreview, editingSubCategoryImagePreview, subCategoryImagePreviews]);

    function toSlug(value: string) {
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

    function handleCategoryImageSelect(file?: File) {
        if (!file) return;
        if (categoryImagePreview.startsWith('blob:')) URL.revokeObjectURL(categoryImagePreview);
        setCategoryImageFile(file);
        setCategoryImagePreview(URL.createObjectURL(file));
    }

    function handleEditingCategoryImageSelect(file?: File) {
        if (!file) return;
        if (editingCategoryImagePreview.startsWith('blob:')) URL.revokeObjectURL(editingCategoryImagePreview);
        setEditingCategoryImageFile(file);
        setEditingCategoryImagePreview(URL.createObjectURL(file));
    }

    function handleSubCategoryImageSelect(categorySlug: string, file?: File) {
        if (!file) return;
        const current = subCategoryImagePreviews[categorySlug] ?? '';
        if (current.startsWith('blob:')) URL.revokeObjectURL(current);
        setSubCategoryImageFiles(currentFiles => ({ ...currentFiles, [categorySlug]: file }));
        setSubCategoryImagePreviews(currentPreviews => ({
            ...currentPreviews,
            [categorySlug]: URL.createObjectURL(file),
        }));
    }

    function handleEditingSubCategoryImageSelect(file?: File) {
        if (!file) return;
        if (editingSubCategoryImagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(editingSubCategoryImagePreview);
        }
        setEditingSubCategoryImageFile(file);
        setEditingSubCategoryImagePreview(URL.createObjectURL(file));
    }

    function refreshWithToast(message: string, type: 'success' | 'error') {
        if (type === 'success') {
            toast.success(message);
        } else {
            toast.error(message);
        }

        router.refresh();
    }

    function handleCreate() {
        if (!newName.trim()) {
            toast.error('Category name is required.');
            return;
        }

        if (!categoryImageFile) {
            toast.error('Category image is required.');
            return;
        }

        startTransition(async () => {
            const result = await createCategory({
                name: newName.trim(),
                image: categoryImageFile,
                description: newDescription.trim(),
            });

            if (!result?.success) {
                refreshWithToast(result?.message ?? 'Failed to create category.', 'error');
                return;
            }

            setNewName('');
            setNewDescription('');
            setCategoryImageFile(null);
            setCategoryImagePreview('');
            refreshWithToast(result.message ?? 'Category created successfully.', 'success');
        });
    }

    function handleDelete(slug?: string) {
        if (!slug) {
            toast.error('A category slug is required to delete this item.');
            return;
        }

        startTransition(async () => {
            const result = await deleteCategory(slug);

            if (!result?.success) {
                refreshWithToast(result?.message ?? 'Failed to delete category.', 'error');
                return;
            }

            refreshWithToast(result.message ?? 'Category deleted successfully.', 'success');
        });
    }

    function handleUpdate(slug?: string) {
        if (!slug || !editingName.trim()) {
            toast.error('A category slug and name are required to update this item.');
            return;
        }

        startTransition(async () => {
            const result = await updateCategory(slug, {
                name: editingName.trim(),
                description: editingDescription.trim(),
                image: editingCategoryImageFile ?? undefined,
            });

            if (!result?.success) {
                refreshWithToast(result?.message ?? 'Failed to update category.', 'error');
                return;
            }

            setEditingSlug(null);
            setEditingName('');
            setEditingDescription('');
            setEditingCategoryImageFile(null);
            setEditingCategoryImagePreview('');
            refreshWithToast(result.message ?? 'Category updated successfully.', 'success');
        });
    }

    function handleCreateSubCategory(categorySlug?: string) {
        if (!categorySlug) {
            toast.error('Category slug is required to add a sub-category.');
            return;
        }

        const payload = newSubCategory[categorySlug];
        if (!payload?.name?.trim() || !payload?.slug?.trim()) {
            toast.error('Sub-category name and slug are required.');
            return;
        }

        startTransition(async () => {
            const result = await createCategorySubCategory(categorySlug, {
                name: payload.name.trim(),
                slug: payload.slug.trim(),
                description: payload.description.trim(),
                image: subCategoryImageFiles[categorySlug] ?? undefined,
                isActive: true,
            });

            if (!result?.success) {
                refreshWithToast(result?.message ?? 'Failed to create sub-category.', 'error');
                return;
            }

            setNewSubCategory(current => ({
                ...current,
                [categorySlug]: { name: '', slug: '', description: '' },
            }));
            setSubCategoryImageFiles(current => ({ ...current, [categorySlug]: null }));
            setSubCategoryImagePreviews(current => ({ ...current, [categorySlug]: '' }));
            refreshWithToast(result.message ?? 'Sub-category created successfully.', 'success');
        });
    }

    function handleUpdateSubCategory(categorySlug?: string, subCategorySlug?: string) {
        if (
            !categorySlug ||
            !subCategorySlug ||
            !editingSubCategory.name.trim() ||
            !editingSubCategory.slug.trim()
        ) {
            toast.error('Sub-category details are incomplete.');
            return;
        }

        startTransition(async () => {
            const result = await updateCategorySubCategory(categorySlug, subCategorySlug, {
                name: editingSubCategory.name.trim(),
                slug: editingSubCategory.slug.trim(),
                description: editingSubCategory.description.trim(),
                isActive: editingSubCategory.isActive,
                image: editingSubCategoryImageFile ?? undefined,
            });

            if (!result?.success) {
                refreshWithToast(result?.message ?? 'Failed to update sub-category.', 'error');
                return;
            }

            setEditingSubCategoryKey(null);
            setEditingSubCategoryImageFile(null);
            setEditingSubCategoryImagePreview('');
            refreshWithToast(result.message ?? 'Sub-category updated successfully.', 'success');
        });
    }

    function handleDeleteSubCategory(categorySlug?: string, subCategorySlug?: string) {
        if (!categorySlug || !subCategorySlug) {
            toast.error('Sub-category identifiers are required.');
            return;
        }

        startTransition(async () => {
            const result = await deleteCategorySubCategory(categorySlug, subCategorySlug);
            if (!result?.success) {
                refreshWithToast(result?.message ?? 'Failed to delete sub-category.', 'error');
                return;
            }
            refreshWithToast(result.message ?? 'Sub-category deleted successfully.', 'success');
        });
    }

    return (
        <div className="space-y-6">
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Categories</CardTitle>
                    <CardDescription>
                        {categories.length} categories loaded from backend. Create, rename, or remove entries
                        here.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 lg:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_1fr_1.2fr_auto]">
                    <DashboardInput
                        value={newName}
                        onChange={event => setNewName(event.target.value)}
                        placeholder="Create a new category"
                    />
                    <DashboardInput
                        value={newDescription}
                        onChange={event => setNewDescription(event.target.value)}
                        placeholder="Category description"
                    />
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={() => categoryImageInputRef.current?.click()}
                        onKeyDown={event => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                categoryImageInputRef.current?.click();
                            }
                        }}
                        onDragOver={event => {
                            event.preventDefault();
                            setCategoryDragging(true);
                        }}
                        onDragLeave={() => setCategoryDragging(false)}
                        onDrop={event => {
                            event.preventDefault();
                            setCategoryDragging(false);
                            handleCategoryImageSelect(event.dataTransfer.files?.[0]);
                        }}
                        className={`rounded-2xl border-2 border-dashed p-4 transition ${
                            categoryDragging
                                ? 'border-primary bg-primary/5'
                                : 'border-border/70 bg-background/80 hover:border-primary/40'
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <UploadCloud className="size-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-semibold text-foreground">Category image</div>
                                <p className="text-xs text-muted-foreground">Drag and drop or click to add.</p>
                                <div className="mt-3 overflow-hidden rounded-xl border bg-muted">
                                    {categoryImagePreview ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img src={categoryImagePreview} alt="Category preview" className="h-32 w-full object-cover" />
                                    ) : (
                                        <div className="flex h-32 items-center justify-center gap-2 text-sm text-muted-foreground">
                                            <ImagePlus className="size-4" />
                                            Preview will appear here
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <input
                        ref={categoryImageInputRef}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={event => {
                            handleCategoryImageSelect(event.target.files?.[0]);
                            event.currentTarget.value = '';
                        }}
                    />
                    <Button
                        type="button"
                        disabled={isPending}
                        onClick={handleCreate}
                        className="gap-2 bg-primary text-primary-foreground hover:bg-primary/70"
                    >
                        <Plus className="size-4" />
                        Add category
                    </Button>
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {visibleCategories.map(category => {
                                const isEditing = editingSlug === category.slug;

                                return (
                                    <Fragment key={category.slug ?? category.name}>
                                        <TableRow>
                                            <TableCell>
                                                {isEditing ? (
                                                    <>
                                                        <div
                                                            role="button"
                                                            tabIndex={0}
                                                            onClick={() => editingCategoryImageInputRef.current?.click()}
                                                            onKeyDown={event => {
                                                                if (event.key === 'Enter' || event.key === ' ') {
                                                                    event.preventDefault();
                                                                    editingCategoryImageInputRef.current?.click();
                                                                }
                                                            }}
                                                            onDragOver={event => {
                                                                event.preventDefault();
                                                                setEditingCategoryDragging(true);
                                                            }}
                                                            onDragLeave={() => setEditingCategoryDragging(false)}
                                                            onDrop={event => {
                                                                event.preventDefault();
                                                                setEditingCategoryDragging(false);
                                                                handleEditingCategoryImageSelect(event.dataTransfer.files?.[0]);
                                                            }}
                                                            className={`rounded-xl border-2 border-dashed p-2 transition ${
                                                                editingCategoryDragging
                                                                    ? 'border-primary bg-primary/5'
                                                                    : 'border-border/70 bg-background/80 hover:border-primary/40'
                                                            }`}
                                                        >
                                                            <div className="flex size-12 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                                                                {(editingCategoryImagePreview || category.image) ? (
                                                                    /* eslint-disable-next-line @next/next/no-img-element */
                                                                    <img
                                                                        src={editingCategoryImagePreview || category.image || ''}
                                                                        alt={category.name}
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <ImagePlus className="size-4 text-muted-foreground" />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <input
                                                            ref={editingCategoryImageInputRef}
                                                            type="file"
                                                            accept="image/*"
                                                            className="sr-only"
                                                            onChange={event => {
                                                                handleEditingCategoryImageSelect(event.target.files?.[0]);
                                                                event.currentTarget.value = '';
                                                            }}
                                                        />
                                                    </>
                                                ) : (
                                                    <div className="flex size-12 items-center justify-center overflow-hidden rounded-xl border bg-muted">
                                                        {category.image ? (
                                                            /* eslint-disable-next-line @next/next/no-img-element */
                                                            <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <ImagePlus className="size-4 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 px-2"
                                                        onClick={() =>
                                                            setExpandedSlug(current =>
                                                                current === category.slug
                                                                    ? null
                                                                    : (category.slug ?? null),
                                                            )
                                                        }
                                                    >
                                                        <ChevronDown
                                                            className={`size-4 transition ${expandedSlug === category.slug ? 'rotate-180' : ''}`}
                                                        />
                                                    </Button>
                                                    {isEditing ? (
                                                        <DashboardInput
                                                            value={editingName}
                                                            onChange={event => setEditingName(event.target.value)}
                                                        />
                                                    ) : (
                                                        category.name
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>{category.slug ?? '-'}</TableCell>
                                            <TableCell className="max-w-[240px] text-sm text-muted-foreground">
                                                {isEditing ? (
                                                    <DashboardInput
                                                        value={editingDescription}
                                                        onChange={event => setEditingDescription(event.target.value)}
                                                        placeholder="Category description"
                                                    />
                                                ) : (
                                                    sliceText(category.description)
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {category.subCategories?.length ?? category.totalNews ?? 0}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {category.isActive === false ? 'Inactive' : 'Active'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {isEditing ? (
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            disabled={isPending}
                                                            onClick={() => handleUpdate(category.slug)}
                                                        >
                                                            Save
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            disabled={isPending}
                                                        onClick={() => {
                                                                setEditingSlug(category.slug ?? null);
                                                                setEditingName(category.name);
                                                                setEditingDescription(category.description ?? '');
                                                                setEditingCategoryImageFile(null);
                                                                setEditingCategoryImagePreview(category.image ?? '');
                                                            }}
                                                        >
                                                            <Pencil className="size-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={isPending}
                                                        onClick={() => handleDelete(category.slug)}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        {expandedSlug === category.slug ? (
                                            <TableRow>
                                                <TableCell colSpan={6}>
                                                    <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
                                                        <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
                                                            <DashboardInput
                                                                placeholder="Sub-category name"
                                                                value={
                                                                    newSubCategory[category.slug ?? '']
                                                                        ?.name ?? ''
                                                                }
                                                                onChange={event =>
                                                                    setNewSubCategory(current => {
                                                                        const name = event.target.value;

                                                                        return {
                                                                            ...current,
                                                                            [category.slug ?? '']: {
                                                                                ...(current[
                                                                                    category.slug ?? ''
                                                                                ] ?? {
                                                                                    name: '',
                                                                                    slug: '',
                                                                                    description: '',
                                                                                }),
                                                                                name,
                                                                                slug: toSlug(name),
                                                                            },
                                                                        };
                                                                    })
                                                                }
                                                            />
                                                            <DashboardInput
                                                                placeholder="sub-category-slug"
                                                                value={
                                                                    newSubCategory[category.slug ?? '']
                                                                        ?.slug ?? ''
                                                                }
                                                                onChange={event =>
                                                                    setNewSubCategory(current => ({
                                                                        ...current,
                                                                        [category.slug ?? '']: {
                                                                            ...(current[
                                                                                category.slug ?? ''
                                                                             ] ?? {
                                                                                 name: '',
                                                                                 slug: '',
                                                                                 description: '',
                                                                             }),
                                                                            slug: toSlug(event.target.value),
                                                                        },
                                                                    }))
                                                                }
                                                            />
                                                            <DashboardInput
                                                                placeholder="Sub-category description"
                                                                value={
                                                                    newSubCategory[category.slug ?? '']
                                                                        ?.description ?? ''
                                                                }
                                                                onChange={event =>
                                                                    setNewSubCategory(current => ({
                                                                        ...current,
                                                                        [category.slug ?? '']: {
                                                                            ...(current[
                                                                                category.slug ?? ''
                                                                            ] ?? { name: '', slug: '', description: '' }),
                                                                            description: event.target.value,
                                                                        },
                                                                    }))
                                                                }
                                                            />
                                                            <Button
                                                                type="button"
                                                                className="bg-primary text-primary-foreground hover:bg-primary/70"
                                                                disabled={isPending}
                                                                onClick={() =>
                                                                    handleCreateSubCategory(category.slug)
                                                                }
                                                            >
                                                                Add sub-category
                                                            </Button>
                                                        </div>

                                                        <div className="rounded-xl border border-dashed border-border/70 bg-background/80 p-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                                    <UploadCloud className="size-5" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-semibold">Sub-category image</div>
                                                                    <div className="text-xs text-muted-foreground">Click or drop a file for this category.</div>
                                                                </div>
                                                            </div>
                                                            <label
                                                                htmlFor={`subcategory-image-${category.slug ?? 'root'}`}
                                                                onDragOver={event => {
                                                                    event.preventDefault();
                                                                    setSubCategoryDraggingKey(category.slug ?? '');
                                                                }}
                                                                onDragLeave={() => setSubCategoryDraggingKey(null)}
                                                                onDrop={event => {
                                                                    event.preventDefault();
                                                                    setSubCategoryDraggingKey(null);
                                                                    handleSubCategoryImageSelect(
                                                                        category.slug ?? '',
                                                                        event.dataTransfer.files?.[0],
                                                                    );
                                                                }}
                                                                className={`mt-3 rounded-xl border-2 border-dashed p-3 transition ${
                                                                    subCategoryDraggingKey === (category.slug ?? '')
                                                                        ? 'border-primary bg-primary/5'
                                                                        : 'border-border/70 bg-background/80 hover:border-primary/40'
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex size-10 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                                                                        {subCategoryImagePreviews[category.slug ?? ''] ? (
                                                                            /* eslint-disable-next-line @next/next/no-img-element */
                                                                            <img
                                                                                src={subCategoryImagePreviews[category.slug ?? '']}
                                                                                alt="Sub-category preview"
                                                                                className="h-full w-full object-cover"
                                                                            />
                                                                        ) : (
                                                                            <ImagePlus className="size-4 text-muted-foreground" />
                                                                        )}
                                                                    </div>
                                                                    <div className="text-xs text-muted-foreground">
                                                                        Click or drop sub-category image here
                                                                    </div>
                                                                </div>
                                                            </label>
                                                            <input
                                                                id={`subcategory-image-${category.slug ?? 'root'}`}
                                                                type="file"
                                                                accept="image/*"
                                                                className="sr-only"
                                                                onChange={event => {
                                                                    handleSubCategoryImageSelect(
                                                                        category.slug ?? '',
                                                                        event.target.files?.[0],
                                                                    );
                                                                    event.currentTarget.value = '';
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="grid gap-3">
                                                            {(category.subCategories ?? []).length > 0 ? (
                                                                category.subCategories?.map(
                                                                    (subCategory, index) => {
                                                                        const subCategoryKey = `${category.slug}:${subCategory.slug}`;
                                                                        const isEditingSubCategory =
                                                                            editingSubCategoryKey ===
                                                                            subCategoryKey;

                                                                        return (
                                                                            <div
                                                                                key={subCategoryKey}
                                                                                className="flex flex-col gap-3 rounded-lg border bg-background p-3 md:flex-row md:items-center"
                                                                            >
                                                                                <div className="grid flex-1 gap-3 md:grid-cols-4">
                                                                                    {isEditingSubCategory ? (
                                                                                        <>
                                                                                            <DashboardInput
                                                                                                value={
                                                                                                    editingSubCategory.name
                                                                                                }
                                                                                                onChange={event =>
                                                                                                    setEditingSubCategory(
                                                                                                        current => ({
                                                                                                            ...current,
                                                                                                            name: event
                                                                                                                .target
                                                                                                                .value,
                                                                                                        }),
                                                                                                    )
                                                                                                }
                                                                                            />
                                                                                            <DashboardInput
                                                                                                value={
                                                                                                    editingSubCategory.slug
                                                                                                }
                                                                                                onChange={event =>
                                                                                                    setEditingSubCategory(
                                                                                                        current => ({
                                                                                                            ...current,
                                                                                                            slug: event
                                                                                                                .target
                                                                                                                .value,
                                                                                                        }),
                                                                                                    )
                                                                                                }
                                                                                            />
                                                                                            <select
                                                                                                value={
                                                                                                    editingSubCategory.isActive
                                                                                                        ? 'true'
                                                                                                        : 'false'
                                                                                                }
                                                                                                onChange={event =>
                                                                                                    setEditingSubCategory(
                                                                                                        current => ({
                                                                                                            ...current,
                                                                                                            isActive:
                                                                                                                event
                                                                                                                    .target
                                                                                                                    .value ===
                                                                                                                'true',
                                                                                                        }),
                                                                                                    )
                                                                                                }
                                                                                                className="h-9 rounded-md border border-input bg-background px-3 text-sm w-fit"
                                                                                                >
                                                                                                <option value="true">
                                                                                                    Active
                                                                                                </option>
                                                                                                <option value="false">
                                                                                                    Inactive
                                                                                                </option>
                                                                                            </select>
                                                                                            <DashboardInput
                                                                                                value={
                                                                                                    editingSubCategory.description
                                                                                                }
                                                                                                onChange={event =>
                                                                                                    setEditingSubCategory(
                                                                                                        current => ({
                                                                                                            ...current,
                                                                                                            description:
                                                                                                                event.target.value,
                                                                                                        }),
                                                                                                    )
                                                                                                }
                                                                                                placeholder="Description"
                                                                                                className="md:col-span-4"
                                                                                            />
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            <div className="flex items-center gap-2 font-semibold text-primary">
                                                                                                <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs">
                                                                                                    {index +
                                                                                                        1}
                                                                                                </span>
                                                                                                <span>
                                                                                                    {
                                                                                                        subCategory.name
                                                                                                    }
                                                                                                </span>
                                                                                            </div>
                                                                                            <div className="font-medium">
                                                                                                {subCategory.slug}
                                                                                            </div>
                                                                                            <div className="text-sm text-muted-foreground">
                                                                                                {sliceText(subCategory.description)}
                                                                                            </div>
                                                                                            <Badge
                                                                                                variant="secondary"
                                                                                                className="w-fit"
                                                                                            >
                                                                                                {subCategory.isActive ===
                                                                                                false
                                                                                                    ? 'Inactive'
                                                                                                    : 'Active'}
                                                                                            </Badge>
                                                                                        </>
                                                                                    )}
                                                                                </div>
                                                                                {isEditingSubCategory ? (
                                                                                    <>
                                                                                        <div
                                                                                            role="button"
                                                                                            tabIndex={0}
                                                                                            onClick={() =>
                                                                                                editingSubCategoryImageInputRef.current?.click()
                                                                                            }
                                                                                            onKeyDown={event => {
                                                                                                if (event.key === 'Enter' || event.key === ' ') {
                                                                                                    event.preventDefault();
                                                                                                    editingSubCategoryImageInputRef.current?.click();
                                                                                                }
                                                                                            }}
                                                                                            onDragOver={event => {
                                                                                                event.preventDefault();
                                                                                                setEditingSubCategoryDragging(true);
                                                                                            }}
                                                                                            onDragLeave={() =>
                                                                                                setEditingSubCategoryDragging(false)
                                                                                            }
                                                                                            onDrop={event => {
                                                                                                event.preventDefault();
                                                                                                setEditingSubCategoryDragging(false);
                                                                                                handleEditingSubCategoryImageSelect(
                                                                                                    event.dataTransfer.files?.[0],
                                                                                                );
                                                                                            }}
                                                                                            className={`rounded-xl border-2 border-dashed p-3 transition ${
                                                                                                editingSubCategoryDragging
                                                                                                    ? 'border-primary bg-primary/5'
                                                                                                    : 'border-border/70 bg-background/80 hover:border-primary/40'
                                                                                            }`}
                                                                                        >
                                                                                            <div className="flex items-center gap-3">
                                                                                                <div className="flex size-10 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                                                                                                    {editingSubCategoryImagePreview || subCategory.image ? (
                                                                                                        /* eslint-disable-next-line @next/next/no-img-element */
                                                                                                        <img
                                                                                                            src={editingSubCategoryImagePreview || subCategory.image || ''}
                                                                                                            alt={subCategory.name}
                                                                                                            className="h-full w-full object-cover"
                                                                                                        />
                                                                                                    ) : (
                                                                                                        <ImagePlus className="size-4 text-muted-foreground" />
                                                                                                    )}
                                                                                                </div>
                                                                                                <div className="text-xs text-muted-foreground">
                                                                                                    Drop or click to replace sub-category image
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <input
                                                                                            ref={
                                                                                                editingSubCategoryImageInputRef
                                                                                            }
                                                                                            type="file"
                                                                                            accept="image/*"
                                                                                            className="sr-only"
                                                                                            onChange={event => {
                                                                                                handleEditingSubCategoryImageSelect(
                                                                                                    event.target.files?.[0],
                                                                                                );
                                                                                                event.currentTarget.value = '';
                                                                                            }}
                                                                                        />
                                                                                    </>
                                                                                ) : null}
                                                                                <div className="flex gap-2">
                                                                                    {isEditingSubCategory ? (
                                                                                        <>
                                                                                            <Button
                                                                                                size="sm"
                                                                                                disabled={
                                                                                                    isPending
                                                                                                }
                                                                                                onClick={() =>
                                                                                                    handleUpdateSubCategory(
                                                                                                        category.slug,
                                                                                                        subCategory.slug,
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                Save
                                                                                            </Button>
                                                                                            <Button
                                                                                                size="sm"
                                                                                                variant="outline"
                                                                                                onClick={() =>
                                                                                                    {
                                                                                                        setEditingSubCategoryKey(null);
                                                                                                        setEditingSubCategoryImageFile(null);
                                                                                                        setEditingSubCategoryImagePreview('');
                                                                                                    }
                                                                                                }
                                                                                            >
                                                                                                Cancel
                                                                                            </Button>
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            <Button
                                                                                                size="sm"
                                                                                                variant="outline"
                                                                                                disabled={
                                                                                                    isPending
                                                                                                }
                                                                                                onClick={() => {
                                                                                                    setEditingSubCategoryKey(
                                                                                                        subCategoryKey,
                                                                                                    );
                                                                                            setEditingSubCategory(
                                                                                                {
                                                                                                    name: subCategory.name,
                                                                                                    slug: subCategory.slug,
                                                                                                    description:
                                                                                                        subCategory.description ?? '',
                                                                                                    isActive:
                                                                                                        subCategory.isActive !==
                                                                                                        false,
                                                                                                },
                                                                                            );
                                                                                                setEditingSubCategoryImageFile(null);
                                                                                                setEditingSubCategoryImagePreview(
                                                                                                    subCategory.image ?? '',
                                                                                                );
                                                                                        }}
                                                                                            >
                                                                                                <Pencil className="size-4" />
                                                                                            </Button>
                                                                                            <Button
                                                                                                size="sm"
                                                                                                variant="outline"
                                                                                                disabled={
                                                                                                    isPending
                                                                                                }
                                                                                                onClick={() =>
                                                                                                    handleDeleteSubCategory(
                                                                                                        category.slug,
                                                                                                        subCategory.slug,
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                <Trash2 className="size-4" />
                                                                                            </Button>
                                                                                        </>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    },
                                                                )
                                                            ) : (
                                                                <div className="text-sm text-muted-foreground">
                                                                    No sub-categories yet.
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : null}
                                    </Fragment>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
