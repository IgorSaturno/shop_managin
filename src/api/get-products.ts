import { api } from "@/lib/axios";

export interface GetProductsQuery {
  productName?: string | null;
  pageIndex?: number;
}

export interface Product {
  productId: string;
  productName: string;
  description: string;
  priceInCents: number;
  stock: number;
  sku: string;
  isFeatured: boolean;
  status: string;
}

export interface GetProductsResponse {
  products: Product[];
  meta: {
    pageIndex: number;
    perPage: number;
    totalCount: number;
  };
}

export async function getProducts({
  productName,
  pageIndex = 0,
}: GetProductsQuery) {
  const response = await api.get<GetProductsResponse>("/products", {
    params: { productName, pageIndex },
  });
  return response.data;
}
