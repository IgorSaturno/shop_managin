import { api } from "@/lib/axios";

export interface GetProductsQuery {
  productName?: string | null;
  pageIndex?: number;
  productId?: string | null;
  status?: string | null;
  categoryId?: string | null;
  brandId?: string | null;
  tags?: string | null;
}

export interface GetProductsResponse {
  products: {
    productId: string;
    productName: string;
    priceInCents: number;
    categoryId: string; // Alterado para ID
    brandId: string; // Alterado para ID
    tags: string;
    stock: number;
    sku: string;
    isFeatured: boolean;
    status: "available" | "unavailable" | "archived";
    createdAt: string;
    description: string;
    coupons: Array<{
      code: string;
      discountType: "percentage" | "fixed";
      discountValue: number;
    }>;
    images: string[];
  }[];
  meta: {
    pageIndex: number;
    perPage: number;
    totalCount: number;
  };
}

export async function getProducts({
  pageIndex = 0,
  productId,
  productName,
  status,
  categoryId,
  brandId,
  tags,
}: GetProductsQuery) {
  const response = await api.get<GetProductsResponse>("/products", {
    params: {
      productName,
      pageIndex,
      productId,
      status: status !== "all" ? status : undefined,
      categoryId: categoryId !== "all" ? categoryId : undefined, // Converte array para string separada por vírgulas
      brandId: brandId !== "all" ? brandId : undefined,
      tags: tags !== "all" ? tags : undefined,
    },
  });

  return response.data;
}
