'use client';

import { Fragment, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ChevronDown, Pencil, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TableFilter } from '@/components/ui/table-filter';
import { TablePagination } from '@/components/ui/table-pagination';
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
    totalNews?: number;
    isActive?: boolean;
    subCategories?: Array<{
        name: string;
        slug: string;
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
    const [editingSlug, setEditingSlug] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
    const [newSubCategory, setNewSubCategory] = useState<Record<string, { name: string; slug: string }>>({});
    const [editingSubCategoryKey, setEditingSubCategoryKey] = useState<string | null>(null);
    const [editingSubCategory, setEditingSubCategory] = useState({ name: '', slug: '', isActive: true });

    const visibleCategories = useMemo(() => categories.slice(0, 24), [categories]);

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

        startTransition(async () => {
            const result = await createCategory({ name: newName.trim() });

            if (!result?.success) {
                refreshWithToast(result?.message ?? 'Failed to create category.', 'error');
                return;
            }

            setNewName('');
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
            const result = await updateCategory(slug, { name: editingName.trim() });

            if (!result?.success) {
                refreshWithToast(result?.message ?? 'Failed to update category.', 'error');
                return;
            }

            setEditingSlug(null);
            setEditingName('');
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
                isActive: true,
            });

            if (!result?.success) {
                refreshWithToast(result?.message ?? 'Failed to create sub-category.', 'error');
                return;
            }

            setNewSubCategory(current => ({ ...current, [categorySlug]: { name: '', slug: '' } }));
            refreshWithToast(result.message ?? 'Sub-category created successfully.', 'success');
        });
    }

    function handleUpdateSubCategory(categorySlug?: string, subCategorySlug?: string) {
        if (!categorySlug || !subCategorySlug || !editingSubCategory.name.trim() || !editingSubCategory.slug.trim()) {
            toast.error('Sub-category details are incomplete.');
            return;
        }

        startTransition(async () => {
            const result = await updateCategorySubCategory(categorySlug, subCategorySlug, {
                name: editingSubCategory.name.trim(),
                slug: editingSubCategory.slug.trim(),
                isActive: editingSubCategory.isActive,
            });

            if (!result?.success) {
                refreshWithToast(result?.message ?? 'Failed to update sub-category.', 'error');
                return;
            }

            setEditingSubCategoryKey(null);
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
                        {categories.length} categories loaded from backend. Create, rename, or remove entries here.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 sm:flex-row">
                    <Input
                        value={newName}
                        onChange={event => setNewName(event.target.value)}
                        placeholder="Create a new category"
                    />
                    <Button type="button" disabled={isPending} onClick={handleCreate} className="gap-2">
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
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
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
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 px-2"
                                                        onClick={() => setExpandedSlug(current => current === category.slug ? null : (category.slug ?? null))}
                                                    >
                                                        <ChevronDown className={`size-4 transition ${expandedSlug === category.slug ? 'rotate-180' : ''}`} />
                                                    </Button>
                                                    {isEditing ? (
                                                        <Input
                                                            value={editingName}
                                                            onChange={event => setEditingName(event.target.value)}
                                                        />
                                                    ) : (
                                                        category.name
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>{category.slug ?? '-'}</TableCell>
                                            <TableCell>{category.totalNews ?? 0}</TableCell>
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
                                                <TableCell colSpan={5}>
                                                    <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
                                                        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                                                            <Input
                                                                placeholder="Sub-category name"
                                                                value={newSubCategory[category.slug ?? '']?.name ?? ''}
                                                                onChange={event =>
                                                                    setNewSubCategory(current => ({
                                                                        ...current,
                                                                        [category.slug ?? '']: {
                                                                            ...(current[category.slug ?? ''] ?? { name: '', slug: '' }),
                                                                            name: event.target.value,
                                                                        },
                                                                    }))
                                                                }
                                                            />
                                                            <Input
                                                                placeholder="sub-category-slug"
                                                                value={newSubCategory[category.slug ?? '']?.slug ?? ''}
                                                                onChange={event =>
                                                                    setNewSubCategory(current => ({
                                                                        ...current,
                                                                        [category.slug ?? '']: {
                                                                            ...(current[category.slug ?? ''] ?? { name: '', slug: '' }),
                                                                            slug: event.target.value,
                                                                        },
                                                                    }))
                                                                }
                                                            />
                                                            <Button type="button" disabled={isPending} onClick={() => handleCreateSubCategory(category.slug)}>
                                                                Add sub-category
                                                            </Button>
                                                        </div>

                                                        <div className="grid gap-3">
                                                            {(category.subCategories ?? []).length > 0 ? (
                                                                category.subCategories?.map(subCategory => {
                                                                    const subCategoryKey = `${category.slug}:${subCategory.slug}`;
                                                                    const isEditingSubCategory = editingSubCategoryKey === subCategoryKey;

                                                                    return (
                                                                        <div key={subCategoryKey} className="flex flex-col gap-3 rounded-lg border bg-background p-3 md:flex-row md:items-center">
                                                                            <div className="grid flex-1 gap-3 md:grid-cols-3">
                                                                                {isEditingSubCategory ? (
                                                                                    <>
                                                                                        <Input value={editingSubCategory.name} onChange={event => setEditingSubCategory(current => ({ ...current, name: event.target.value }))} />
                                                                                        <Input value={editingSubCategory.slug} onChange={event => setEditingSubCategory(current => ({ ...current, slug: event.target.value }))} />
                                                                                        <select
                                                                                            value={editingSubCategory.isActive ? 'true' : 'false'}
                                                                                            onChange={event => setEditingSubCategory(current => ({ ...current, isActive: event.target.value === 'true' }))}
                                                                                            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                                                                                        >
                                                                                            <option value="true">Active</option>
                                                                                            <option value="false">Inactive</option>
                                                                                        </select>
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <div className="font-medium">{subCategory.name}</div>
                                                                                        <div className="text-sm text-muted-foreground">{subCategory.slug}</div>
                                                                                        <Badge variant="secondary">{subCategory.isActive === false ? 'Inactive' : 'Active'}</Badge>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                            <div className="flex gap-2">
                                                                                {isEditingSubCategory ? (
                                                                                    <>
                                                                                        <Button size="sm" disabled={isPending} onClick={() => handleUpdateSubCategory(category.slug, subCategory.slug)}>Save</Button>
                                                                                        <Button size="sm" variant="outline" onClick={() => setEditingSubCategoryKey(null)}>Cancel</Button>
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <Button
                                                                                            size="sm"
                                                                                            variant="outline"
                                                                                            disabled={isPending}
                                                                                            onClick={() => {
                                                                                                setEditingSubCategoryKey(subCategoryKey);
                                                                                                setEditingSubCategory({
                                                                                                    name: subCategory.name,
                                                                                                    slug: subCategory.slug,
                                                                                                    isActive: subCategory.isActive !== false,
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <Pencil className="size-4" />
                                                                                        </Button>
                                                                                        <Button size="sm" variant="outline" disabled={isPending} onClick={() => handleDeleteSubCategory(category.slug, subCategory.slug)}>
                                                                                            <Trash2 className="size-4" />
                                                                                        </Button>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })
                                                            ) : (
                                                                <div className="text-sm text-muted-foreground">No sub-categories yet.</div>
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
