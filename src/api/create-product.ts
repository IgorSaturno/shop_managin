import { api } from "@/lib/axios";

export interface CreateProductPayload {
  product_name: string;
  description: string;
  characteristics: string;
  priceInCents: number;
  stock: number;
  isFeatured: boolean;
  isArchived: boolean;
  status: string;
  categoryId: string;
  brandId: string;
  images: string[]; // array de URLs
  video?: string;
  couponIds?: string[]; // array de IDs
  tags?: string[]; // array de tags
}

export async function createProduct(payload: CreateProductPayload) {
  const response = await api.post("/products", payload);
  return response.data;
}
