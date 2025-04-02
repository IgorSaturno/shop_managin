import { api } from "@/lib/axios";

export interface GetProductsQuery {
  productName?: string | null;
  pageIndex?: number;
  productId?: string | null;
  status?: string | null;
}

export interface GetProductsResponse {
  products: {
    productId: string;
    productName: string;
    priceInCents: number;
    category: string;
    subBrand: string;
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
  pageIndex,
  productId,
  productName,
  status,
}: GetProductsQuery) {
  const response = await api.get<GetProductsResponse>("/products", {
    params: { productName, pageIndex, status, productId },
  });
  return response.data;
}
