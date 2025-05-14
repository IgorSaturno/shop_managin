import { api } from "@/lib/axios";

export type ProductFormData = {
  product_id: string;
  product_name: string;
  description?: string;
  characteristics?: string;
  price: number;
  stock: number;
  status: "available" | "unavailable" | "archived";
  categoryId: string;
  brandId: string;
  tags?: string[];
  images?: {
    original: string;
    optimized: string;
    thumbnail: string;
  }[];
  couponIds?: string[];
  isFeatured?: boolean;
  isArchived?: boolean;
};

export async function updateProduct(data: ProductFormData) {
  const payload = {
    product_name: data.product_name,
    description: data.description,
    characteristics: data.characteristics,
    priceInCents: Math.round(data.price),
    stock: data.stock,
    status: data.status,
    categoryId: data.categoryId,
    brandId: data.brandId,
    tags: data.tags ?? [],
    images: data.images ?? [],
    couponIds: data.couponIds ?? [],
    isFeatured: data.isFeatured ?? false,
    isArchived: data.isArchived ?? false,
  };
  const response = await api.patch(`/products/${data.product_id}`, payload);
  return response.data;
}
