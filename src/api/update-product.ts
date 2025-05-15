import { api } from "@/lib/axios";

export interface ProductImage {
  original: string;
  optimized: string;
  thumbnail: string;
}

export type UpdateProductPayload = {
  productId: string;
  product_name?: string;
  description?: string;
  characteristics?: string;
  priceInCents?: number;
  stock?: number;
  status?: "available" | "unavailable" | "archived";
  categoryId?: string;
  brandId?: string;
  tags?: string[];
  images?: ProductImage[];
  couponIds?: string[];
  isFeatured?: boolean;
  isArchived?: boolean;
};

export async function updateProduct(data: UpdateProductPayload) {
  const { productId, ...rest } = data;

  const resp = await api.patch(`/products/${productId}`, rest);
  return resp.data;
}
