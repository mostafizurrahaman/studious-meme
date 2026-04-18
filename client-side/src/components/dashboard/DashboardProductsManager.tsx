'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardInput } from '@/components/dashboard/DashboardInput';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileUpload } from '@/components/ui/file-upload';
import { TableFilter } from '@/components/ui/table-filter';
import { TablePagination } from '@/components/ui/table-pagination';
import { createProduct, deleteProduct, type BackendProduct, updateProduct } from '@/services/Product';

type Option = { value: string; label: string };

type DashboardProductsManagerProps = {
    products: BackendProduct[];
    brandOptions: Option[];
    categoryOptions: Option[];
};

const initialForm = {
    title: '',
    slug: '',
    sku: '',
    image: '',
    price: '',
    oldPrice: '',
    badge: '',
    brand: '',
    category: '',
    subCategorySlug: '',
    stock: 'In stock',
    rating: '5.0',
    isFeatured: false,
    isActive: true,
};

export function DashboardProductsManager({ products, brandOptions, categoryOptions }: DashboardProductsManagerProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [form, setForm] = useState(initialForm);
    const [editingSlug, setEditingSlug] = useState<string | null>(null);
    const [editingForm, setEditingForm] = useState(initialForm);
    // Filter state
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // Filtered and paginated data
    const filteredData = useMemo(() => {
        const q = search.toLowerCase();
        const filtered = products.filter(p =>
            p.title?.toLowerCase().includes(q) ||
            p.sku?.toLowerCase().includes(q) ||
            p.slug?.toLowerCase().includes(q)
        );
        return filtered;
    }, [products, search]);

    const paginatedRows = useMemo(() => {
        const start = (page - 1) * limit;
        return filteredData.slice(start, start + limit);
    }, [filteredData, page, limit]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    function refresh(message: string, type: 'success' | 'error') {
        if (type === 'success') {
            toast.success(message);
        } else {
            toast.error(message);
        }
        router.refresh();
    }

    return (
        <div className="space-y-6">
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Create product</CardTitle>
                    <CardDescription>Add a new catalog item using backend CRUD.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <DashboardInput placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    <DashboardInput placeholder="Slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
                    <DashboardInput placeholder="SKU" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
                    <FileUpload value={form.image} onChange={url => setForm({ ...form, image: url })} placeholder="Product image" />
                    <DashboardInput placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                    <DashboardInput placeholder="Old price" value={form.oldPrice} onChange={e => setForm({ ...form, oldPrice: e.target.value })} />
                    <DashboardInput placeholder="Badge" value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} />
                    <DashboardInput placeholder="Sub-category slug" value={form.subCategorySlug} onChange={e => setForm({ ...form, subCategorySlug: e.target.value })} />
                    <DashboardInput placeholder="Stock label" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
                    <DashboardInput placeholder="Rating" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} />
                    <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })}>
                        <option value="">Brand</option>
                        {brandOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                    <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                        <option value="">Category</option>
                        {categoryOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} />Featured</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />Active</label>
                    <div className="xl:col-span-4">
                        <Button type="button" disabled={isPending} className="gap-2" onClick={() => startTransition(async () => {
                            const result = await createProduct(form);
                            if (!result?.success) return refresh(result?.message ?? 'Failed to create product.', 'error');
                            setForm(initialForm);
                            refresh(result.message ?? 'Product created successfully.', 'success');
                        })}><Plus className="size-4" />Create product</Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle>Products</CardTitle>
                        <CardDescription>{filteredData.length} of {products.length} items</CardDescription>
                    </div>
                    <TableFilter value={search} onChange={handleSearchChange} placeholder="Search products..." />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Brand</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedRows.map(product => {
                                const isEditing = editingSlug === product.slug;
                                return (
                                    <TableRow key={product.sku}>
                                        <TableCell className="font-medium">{isEditing ? <DashboardInput value={editingForm.title} onChange={e => setEditingForm({ ...editingForm, title: e.target.value })} /> : product.title}</TableCell>
                                        <TableCell>{typeof product.brand === 'string' ? product.brand : product.brand.name}</TableCell>
                                        <TableCell>{product.sku}</TableCell>
                                        <TableCell><Badge variant="secondary">{product.stock}</Badge></TableCell>
                                        <TableCell>{isEditing ? <DashboardInput value={editingForm.price} onChange={e => setEditingForm({ ...editingForm, price: e.target.value })} /> : product.price}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {isEditing ? (
                                                    <>
                                                        <Button size="sm" disabled={isPending} onClick={() => startTransition(async () => {
                                                            const result = await updateProduct(product.slug, editingForm);
                                                            if (!result?.success) return refresh(result?.message ?? 'Failed to update product.', 'error');
                                                            setEditingSlug(null);
                                                            refresh(result.message ?? 'Product updated successfully.', 'success');
                                                        })}>Save</Button>
                                                        <Button size="sm" variant="outline" onClick={() => setEditingSlug(null)}>Cancel</Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button size="sm" variant="outline" onClick={() => {
                                                            setEditingSlug(product.slug);
                                                            setEditingForm({
                                                                title: product.title,
                                                                slug: product.slug,
                                                                sku: product.sku,
                                                                image: product.image,
                                                                price: product.price,
                                                                oldPrice: product.oldPrice ?? '',
                                                                badge: product.badge ?? '',
                                                                brand: typeof product.brand === 'string' ? product.brand : (product.brand.slug ?? ''),
                                                                category: typeof product.category === 'string' ? product.category : (product.category.slug ?? ''),
                                                                subCategorySlug: product.subCategorySlug ?? '',
                                                                stock: product.stock,
                                                                rating: product.rating,
                                                                isFeatured: product.isFeatured,
                                                                isActive: product.isActive,
                                                            });
                                                        }}><Pencil className="size-4" /></Button>
                                                        <Button size="sm" variant="outline" disabled={isPending} onClick={() => startTransition(async () => {
                                                            const result = await deleteProduct(product.slug);
                                                            if (!result?.success) return refresh(result?.message ?? 'Failed to delete product.', 'error');
                                                            refresh(result.message ?? 'Product deleted successfully.', 'success');
                                                        })}><Trash2 className="size-4" /></Button>
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
                                onLimitChange={l => { setLimit(l); setPage(1); }}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
