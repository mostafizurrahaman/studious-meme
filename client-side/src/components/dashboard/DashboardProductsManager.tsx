'use client';

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
import { createProduct, deleteProduct, type BackendProduct, updateProduct } from '@/services/Product';
import { formatDashboardDate } from '@/lib/formatDate';
import { slugify } from '@/lib/slug';
import type { BackendCategory } from '@/services/Category/mappers';
import Image from 'next/image';

type Option = { value: string; label: string };

type DashboardProductsManagerProps = {
  products: BackendProduct[];
  brandOptions: Option[];
  categories: BackendCategory[];
};

const initialForm = {
  title: '',
  slug: '',
  sku: '',
  image: '',
  price: '0',
  oldPrice: '',
  badge: '',
  brand: '',
  category: '',
  subCategorySlug: '',
  stock: '0',
  rating: '5',
  isFeatured: false,
  isActive: true,
};

export function DashboardProductsManager({
  products,
  brandOptions,
  categories,
}: DashboardProductsManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState(initialForm);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState('');
  const [slugAutoSync, setSlugAutoSync] = useState(true);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editingForm, setEditingForm] = useState(initialForm);
  const productImageInputRef = useRef<HTMLInputElement>(null);
  // Filter state
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const selectedCategory = useMemo(
    () => categories.find(category => category.slug === form.category) ?? null,
    [categories, form.category],
  );

  const subCategoryOptions = selectedCategory?.subCategories ?? [];

  useEffect(() => {
    return () => {
      if (productImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(productImagePreview);
      }
    };
  }, [productImagePreview]);

  // Filtered and paginated data
  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    const filtered = products.filter(
      p =>
        p.title?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q),
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

  function handleTitleChange(value: string) {
    setForm(current => ({
      ...current,
      title: value,
      slug: slugAutoSync ? slugify(value) : current.slug,
    }));
  }

  function handleSlugChange(value: string) {
    setSlugAutoSync(false);
    setForm(current => ({
      ...current,
      slug: slugify(value),
    }));
  }

  function handleEditingTitleChange(value: string) {
    setEditingForm(current => ({
      ...current,
      title: value,
      slug: slugify(value),
    }));
  }

  function handleCategoryChange(value: string) {
    setForm(current => ({
      ...current,
      category: value,
      subCategorySlug: '',
    }));
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Create product</CardTitle>
          <CardDescription>Add a new catalog item using backend CRUD.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <DashboardInput
            placeholder="Title"
            value={form.title}
            onChange={e => handleTitleChange(e.target.value)}
          />
          <DashboardInput
            placeholder="Slug"
            value={form.slug}
            onChange={e => handleSlugChange(e.target.value)}
          />
          <DashboardInput
            placeholder="SKU"
            value={form.sku}
            onChange={e => setForm({ ...form, sku: e.target.value })}
          />
          <div className="md:col-span-2 xl:col-span-4">
            <div
              role="button"
              tabIndex={0}
              onClick={() => productImageInputRef.current?.click()}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  productImageInputRef.current?.click();
                }
              }}
              className="rounded-2xl border-2 border-dashed border-border/70 bg-background/80 p-4 transition hover:border-primary/40"
            >
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UploadCloud className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-foreground">Product image</div>
                  <p className="text-xs text-muted-foreground">Click or drop to upload.</p>
                  <div className="mt-3 overflow-hidden rounded-xl border bg-muted">
                    {productImagePreview ? (
                      <Image
                        height={500}
                        width={500}
                        src={productImagePreview}
                        alt="Product preview"
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
              ref={productImageInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={event => {
                const file = event.target.files?.[0];
                if (file) {
                  if (productImagePreview.startsWith('blob:')) {
                    URL.revokeObjectURL(productImagePreview);
                  }
                  setProductImageFile(file);
                  setProductImagePreview(URL.createObjectURL(file));
                }
                event.currentTarget.value = '';
              }}
            />
          </div>
          <DashboardInput
            placeholder="Price"
            type="number"
            min={0}
            step="0.01"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
          />
          <DashboardInput
            placeholder="Old price"
            type="number"
            min={0}
            step="0.01"
            value={form.oldPrice}
            onChange={e => setForm({ ...form, oldPrice: e.target.value })}
          />
          <DashboardInput
            placeholder="Badge. ex: Sale, New, Hot"
            value={form.badge}
            onChange={e => setForm({ ...form, badge: e.target.value })}
          />
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={form.category}
            onChange={e => handleCategoryChange(e.target.value)}
          >
            <option value="">Category</option>
            {categories.map(category => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          <DashboardInput
            placeholder="Stock quantity"
            type="number"
            min={0}
            step={1}
            value={form.stock}
            onChange={e => setForm({ ...form, stock: e.target.value })}
          />
          <DashboardInput
            placeholder="Rating"
            type="number"
            min={0}
            step="0.1"
            value={form.rating}
            onChange={e => setForm({ ...form, rating: e.target.value })}
          />
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={form.brand}
            onChange={e => setForm({ ...form, brand: e.target.value })}
          >
            <option value="">Brand</option>
            {brandOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={form.subCategorySlug}
            onChange={e => setForm({ ...form, subCategorySlug: e.target.value })}
            disabled={!form.category}
          >
            <option value="">Sub-category</option>
            {subCategoryOptions.map(subCategory => (
              <option key={subCategory.slug} value={subCategory.slug}>
                {subCategory.name}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={e => setForm({ ...form, isFeatured: e.target.checked })}
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={e => setForm({ ...form, isActive: e.target.checked })}
            />
            Active
          </label>
          <div className="xl:col-span-4">
            <Button
              type="button"
              disabled={isPending}
              className="gap-2"
              onClick={() => {
                if (!productImageFile && !form.image.trim()) {
                  toast.error('Product image is required.');
                  return;
                }

                startTransition(async () => {
                  const priceValue = Number(form.price);
                  const oldPriceValue = form.oldPrice.trim() ? Number(form.oldPrice) : undefined;
                  const ratingValue = Number(form.rating);
                  const stockValue = Number(form.stock);

                  if (!Number.isFinite(priceValue) || priceValue < 0) {
                    toast.error('Price must be a valid non-negative number.');
                    return;
                  }

                  if (oldPriceValue !== undefined && (!Number.isFinite(oldPriceValue) || oldPriceValue < 0)) {
                    toast.error('Old price must be a valid non-negative number.');
                    return;
                  }

                  if (!Number.isFinite(ratingValue) || ratingValue < 0) {
                    toast.error('Rating must be a valid non-negative number.');
                    return;
                  }

                  if (!Number.isInteger(stockValue) || stockValue < 0) {
                    toast.error('Stock must be a non-negative whole number.');
                    return;
                  }

                  const result = await createProduct({
                    ...form,
                    slug: form.slug.trim(),
                    category: form.category.trim(),
                    subCategorySlug: form.subCategorySlug.trim() || undefined,
                    price: priceValue,
                    oldPrice: oldPriceValue,
                    stock: stockValue,
                    rating: ratingValue,
                    image: productImageFile ?? form.image ?? undefined,
                  });
                  if (!result?.success)
                    return refresh(result?.message ?? 'Failed to create product.', 'error');
                  setForm(initialForm);
                  setProductImageFile(null);
                  setProductImagePreview('');
                  setSlugAutoSync(true);
                  refresh(result.message ?? 'Product created successfully.', 'success');
                });
              }}
            >
              <Plus className="size-4" />
              Create product
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Products</CardTitle>
            <CardDescription>
              {filteredData.length} of {products.length} items
            </CardDescription>
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
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRows.map(product => {
                const isEditing = editingSlug === product.slug;
                return (
                  <TableRow key={product.sku}>
                    <TableCell className="font-medium">
                      {isEditing ? (
                        <DashboardInput
                          value={editingForm.title}
                          onChange={e => handleEditingTitleChange(e.target.value)}
                        />
                      ) : (
                        product.title
                      )}
                    </TableCell>
                    <TableCell>
                      {typeof product.brand === 'string' ? product.brand : product.brand.name}
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.stock}</Badge>
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <DashboardInput
                          value={editingForm.price}
                          onChange={e => setEditingForm({ ...editingForm, price: e.target.value })}
                        />
                      ) : (
                        product.price
                      )}
                    </TableCell>
                    <TableCell>
                      <span title={formatDashboardDate(product.createdAt, { time: true })}>
                        {formatDashboardDate(product.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span title={formatDashboardDate(product.updatedAt, { time: true })}>
                        {formatDashboardDate(product.updatedAt)}
                      </span>
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
                                  const priceValue = Number(editingForm.price);
                                  const oldPriceValue = editingForm.oldPrice.trim()
                                    ? Number(editingForm.oldPrice)
                                    : undefined;
                                  const ratingValue = Number(editingForm.rating);
                                  const stockValue = Number(editingForm.stock);

                                  if (!Number.isFinite(priceValue) || priceValue < 0) {
                                    toast.error('Price must be a valid non-negative number.');
                                    return;
                                  }

                                  if (
                                    oldPriceValue !== undefined &&
                                    (!Number.isFinite(oldPriceValue) || oldPriceValue < 0)
                                  ) {
                                    toast.error('Old price must be a valid non-negative number.');
                                    return;
                                  }

                                  if (!Number.isFinite(ratingValue) || ratingValue < 0) {
                                    toast.error('Rating must be a valid non-negative number.');
                                    return;
                                  }

                                  if (!Number.isInteger(stockValue) || stockValue < 0) {
                                    toast.error('Stock must be a non-negative whole number.');
                                    return;
                                  }

                                  const result = await updateProduct(product.slug, {
                                    ...editingForm,
                                    price: priceValue,
                                    oldPrice: oldPriceValue,
                                    stock: stockValue,
                                    rating: ratingValue,
                                  });
                                  if (!result?.success)
                                    return refresh(result?.message ?? 'Failed to update product.', 'error');
                                  setEditingSlug(null);
                                  refresh(result.message ?? 'Product updated successfully.', 'success');
                                })
                              }
                            >
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingSlug(null)}>
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingSlug(product.slug);
                                setEditingForm({
                                  title: product.title,
                                  slug: product.slug,
                                  sku: product.sku,
                                  image: product.image,
                                  price: String(product.price),
                                  oldPrice: product.oldPrice === undefined ? '' : String(product.oldPrice),
                                  badge: product.badge ?? '',
                                  brand:
                                    typeof product.brand === 'string'
                                      ? product.brand
                                      : (product.brand.slug ?? ''),
                                  category:
                                    typeof product.category === 'string'
                                      ? product.category
                                      : (product.category.slug ?? ''),
                                  subCategorySlug: product.subCategorySlug ?? '',
                                  stock: String(product.stock),
                                  rating: String(product.rating),
                                  isFeatured: product.isFeatured,
                                  isActive: product.isActive,
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
                                  const result = await deleteProduct(product.slug);
                                  if (!result?.success)
                                    return refresh(result?.message ?? 'Failed to delete product.', 'error');
                                  refresh(result.message ?? 'Product deleted successfully.', 'success');
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
