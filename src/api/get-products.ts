import { api } from "@/lib/axios";

export interface GetProductsQuery {
  productName?: string | null;
  pageIndex?: number;
  productId?: string | null;
  status?: string | null;
  category?: string | null;
  subBrand?: string | null;
  tags?: string[] | null;
}

export interface GetProductsResponse {
  products: {
    productId: string;
    productName: string;
    priceInCents: number;
    categoryName: string;
    brandName: string;
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
  category,
  subBrand,
  tags,
}: GetProductsQuery) {
  const response = await api.get<GetProductsResponse>("/products", {
    params: {
      productName,
      pageIndex,
      status,
      productId,
      category,
      subBrand,
      tags,
    },
  });

  const mappedProducts = response.data.products.map((product) => ({
    ...product,
    category: product.categoryName,
    subBrand: product.brandName,
  }));

  return {
    ...response.data,
    products: mappedProducts,
  };
}
