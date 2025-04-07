import { api } from "@/lib/axios";

export interface GetProductsQuery {
  productName?: string | null;
  pageIndex?: number;
  productId?: string | null;
  status?: string | null;
  category?: string | null;
  brandId?: string | null;
  tags?: string[] | null;
}

export interface GetProductsResponse {
  products: {
    productId: string;
    productName: string;
    priceInCents: number;
    categoryId: string; // Alterado para ID
    brandId: string; // Alterado para ID
    tags: string[];
    stock: number;
    sku: string;
    isFeatured: boolean;
    status: "available" | "unavailable" | "archived";
    createdAt: string;
    description: string;
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
  category,
  brandId,
  tags,
}: GetProductsQuery) {
  const response = await api.get<GetProductsResponse>("/products", {
    params: {
      productName,
      pageIndex,
      productId,
      status: status !== "all" ? status : undefined,
      category: category !== "all" ? category : undefined,
      brandId: brandId !== "all" ? brandId : undefined,
      tags: tags?.join(","), // Converte array para string separada por vírgulas
    },
  });

  return response.data;
}
