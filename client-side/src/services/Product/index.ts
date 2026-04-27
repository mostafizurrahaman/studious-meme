"use server";

import { updateTag } from "next/cache";

import { requestBackendJson } from "@/lib/backend-api";
import { getValidAccessTokenForServerActions } from "@/lib/getValidAccessToken";
import type { Product as StorefrontProduct } from "@/lib/storefront-types";
import { slugify } from "@/lib/slug";

type BackendEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
};

type BackendProductRef =
  | { _id?: string; name?: string; slug?: string }
  | string;

export type BackendProduct = {
  _id?: string;
  title: string;
  slug: string;
  sku: string;
  images: string[];
  features: string;
  description: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  brand: BackendProductRef;
  category: BackendProductRef;
  subCategorySlug?: string;
  weightKg?: number;
  stock: number;
  rating: number;
  isFeatured: boolean;
  isNoCOD: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

function resolveName(value: BackendProductRef): string {
  if (typeof value === "string") {
    return value;
  }

  return value.name ?? value.slug ?? "Unknown";
}

function resolveSlug(value: BackendProductRef): string | undefined {
  if (typeof value === "string") {
    return undefined;
  }

  return value.slug;
}

export async function mapBackendProductToStorefrontProduct(
  product: BackendProduct,
): Promise<StorefrontProduct> {
  return {
    id: product._id,
    title: product.title,
    slug: product.slug,
    href: "/shop",
    images: product.images ?? [],
    features: product.features ?? "",
    description: product.description ?? "",
    price: String(product.price),
    oldPrice:
      product.oldPrice === undefined ? undefined : String(product.oldPrice),
    badge: product.badge,
    brand: resolveName(product.brand),
    sku: product.sku,
    stock: product.stock > 0 ? `${product.stock} in stock` : "Out of stock",
    rating: String(product.rating),
    category: resolveName(product.category),
    categorySlug: resolveSlug(product.category),
    isFeatured: product.isFeatured,
    isNoCOD: Boolean(product.isNoCOD),
    weightKg: typeof product.weightKg === "number" ? product.weightKg : 1,
    createdAt: product.createdAt,
  };
}

type GetAllProductsParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  c?: string;
  category?: string;
  stock?: string;
  s?: string;
  tag?: string;
  price?: string;
  p?: string;
  brand?: string;
  b?: string;
  sort?: string;
  subCategorySlug?: string;
  subCategory?: string;
  includeInactive?: boolean;
  excludeSlug?: string;
};

const buildProductSearchParams = (params: GetAllProductsParams) => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.searchTerm?.trim())
    searchParams.set("searchTerm", params.searchTerm.trim());
  if (params.c?.trim()) searchParams.set("c", params.c.trim());
  if (params.category?.trim())
    searchParams.set("category", params.category.trim());
  if (params.stock?.trim()) searchParams.set("stock", params.stock.trim());
  if (params.s?.trim()) searchParams.set("s", params.s.trim());
  if (params.tag?.trim()) searchParams.set("tag", params.tag.trim());
  if (params.price?.trim()) searchParams.set("price", params.price.trim());
  if (params.p?.trim()) searchParams.set("p", params.p.trim());
  if (params.brand?.trim()) searchParams.set("brand", params.brand.trim());
  if (params.b?.trim()) searchParams.set("b", params.b.trim());
  if (params.sort?.trim()) searchParams.set("sort", params.sort.trim());
  if (params.subCategorySlug?.trim())
    searchParams.set("subCategorySlug", params.subCategorySlug.trim());
  if (params.subCategory?.trim())
    searchParams.set("subCategory", params.subCategory.trim());
  if (typeof params.includeInactive === "boolean") {
    searchParams.set("includeInactive", String(params.includeInactive));
  }
  if (params.excludeSlug?.trim())
    searchParams.set("excludeSlug", params.excludeSlug.trim());

  return searchParams;
};

export const getAllProducts = async (
  params: GetAllProductsParams = {},
): Promise<BackendEnvelope<BackendProduct[]>> => {
  const searchParams = buildProductSearchParams(params);
  const query = searchParams.toString();

  return requestBackendJson<BackendEnvelope<BackendProduct[]>>(
    `/product/products${query ? `?${query}` : ""}`,
    { method: "GET", next: { tags: ["PRODUCTS"] } },
  );
};

const fetchActiveProductsPage = async (
  pageParams: Omit<GetAllProductsParams, "includeInactive">,
) => {
  const searchParams = buildProductSearchParams(pageParams);
  const query = searchParams.toString();

  return requestBackendJson<BackendEnvelope<BackendProduct[]>>(
    `/product/products/active${query ? `?${query}` : ""}`,
    { method: "GET", next: { tags: ["PRODUCTS"] } },
  );
};

export const getAllActiveProducts = async (
  params: Omit<GetAllProductsParams, "includeInactive"> = {},
): Promise<BackendEnvelope<BackendProduct[]>> =>
  fetchActiveProductsPage(params);

export const getAllActiveProductsAcrossPages = async (
  params: Omit<GetAllProductsParams, "includeInactive" | "page"> = {},
): Promise<BackendEnvelope<BackendProduct[]>> => {
  const firstPage = await fetchActiveProductsPage({ ...params, page: 1 });
  const products = [...(firstPage.data ?? [])];
  const totalPages = firstPage.meta?.totalPages ?? 1;
  const limit = firstPage.meta?.limit ?? params.limit;

  if (totalPages <= 1) {
    return {
      ...firstPage,
      data: products,
    };
  }

  const remainingPages = Array.from(
    { length: totalPages - 1 },
    (_, index) => index + 2,
  );
  const remainingResults = await Promise.all(
    remainingPages.map((page) =>
      fetchActiveProductsPage({ ...params, page, ...(limit ? { limit } : {}) }),
    ),
  );

  remainingResults.forEach((result) => {
    if (Array.isArray(result.data)) {
      products.push(...result.data);
    }
  });

  return {
    ...firstPage,
    data: products,
    meta: {
      ...firstPage.meta,
      page: 1,
      limit,
      total: firstPage.meta?.total ?? products.length,
      totalPages,
    },
  };
};

export const getProductBySlug = async (
  slug: string,
): Promise<BackendEnvelope<BackendProduct>> => {
  return requestBackendJson<BackendEnvelope<BackendProduct>>(
    `/product/products/${slug}`,
    {
      method: "GET",
      next: { tags: ["PRODUCTS"] },
    },
  );
};

export const getActiveProductBySlug = async (
  slug: string,
): Promise<BackendEnvelope<BackendProduct | null>> => {
  return requestBackendJson<BackendEnvelope<BackendProduct | null>>(
    `/product/products/active/${slug}`,
    {
      method: "GET",
      next: { tags: ["PRODUCTS"] },
    },
  );
};

export const getProductsByCategorySlug = async (
  slug: string,
  params: Omit<GetAllProductsParams, "c" | "category"> = {},
): Promise<BackendEnvelope<BackendProduct[]>> => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim()) {
      searchParams.set(key, String(value).trim());
    }
  });

  const query = searchParams.toString();

  return requestBackendJson<BackendEnvelope<BackendProduct[]>>(
    `/product/products/by-category/${slug}${query ? `?${query}` : ""}`,
    {
      method: "GET",
      next: { tags: ["PRODUCTS", "CATEGORIES"] },
    },
  );
};

export const getProductsBySubCategorySlug = async (
  slug: string,
  params: Omit<GetAllProductsParams, "subCategorySlug" | "subCategory"> = {},
): Promise<BackendEnvelope<BackendProduct[]>> => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim()) {
      searchParams.set(key, String(value).trim());
    }
  });

  const query = searchParams.toString();

  return requestBackendJson<BackendEnvelope<BackendProduct[]>>(
    `/product/products/by-sub-category/${slug}${query ? `?${query}` : ""}`,
    {
      method: "GET",
      next: { tags: ["PRODUCTS", "CATEGORIES"] },
    },
  );
};

type ProductMutationPayload = {
  title: string;
  slug: string;
  sku: string;
  images?: Array<File | string>;
  features: string;
  description: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  brand: string;
  category: string;
  subCategorySlug?: string;
  stock: number;
  rating: number;
  weightKg: number;
  isFeatured?: boolean;
  isNoCOD?: boolean;
  isActive?: boolean;
};

function toFormData(payload: Record<string, unknown>) {
  const formData = new FormData();

  const { images, ...rest } = payload as {
    images?: Array<File | string>;
    [key: string]: unknown;
  };
  const imageUrls = (images ?? []).filter(
    (item): item is string => typeof item === "string" && Boolean(item),
  );

  formData.set(
    "data",
    JSON.stringify({
      ...rest,
      ...(imageUrls.length > 0 ? { images: imageUrls } : {}),
    }),
  );

  (images ?? []).forEach((item) => {
    if (item instanceof File) {
      formData.append("images", item);
    }
  });

  return formData;
}

export const createProduct = async (
  payload: ProductMutationPayload,
): Promise<BackendEnvelope<BackendProduct>> => {
  const accessToken = await getValidAccessTokenForServerActions();
  const result = await requestBackendJson<BackendEnvelope<BackendProduct>>(
    "/product/products",
    {
      method: "POST",
      body: toFormData({
        ...payload,
        slug: slugify(payload.slug),
      }),
      token: accessToken ?? undefined,
    },
  );

  updateTag("PRODUCTS");
  return result;
};

export const updateProduct = async (
  slug: string,
  payload: Partial<ProductMutationPayload>,
): Promise<BackendEnvelope<BackendProduct>> => {
  const accessToken = await getValidAccessTokenForServerActions();
  const result = await requestBackendJson<BackendEnvelope<BackendProduct>>(
    `/product/products/${slug}`,
    {
      method: "PATCH",
      body: toFormData({
        ...payload,
        slug: payload.slug ? slugify(payload.slug) : payload.slug,
      }),
      token: accessToken ?? undefined,
    },
  );

  updateTag("PRODUCTS");
  return result;
};

export const deleteProduct = async (
  slug: string,
): Promise<BackendEnvelope<BackendProduct>> => {
  const accessToken = await getValidAccessTokenForServerActions();
  const result = await requestBackendJson<BackendEnvelope<BackendProduct>>(
    `/product/products/${slug}`,
    {
      method: "DELETE",
      token: accessToken ?? undefined,
    },
  );

  updateTag("PRODUCTS");
  return result;
};
