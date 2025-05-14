import { api } from "@/lib/axios";

export interface ProductImage {
  original: string;
  optimized: string;
  thumbnail: string;
}

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
  images: ProductImage[]; // array de URLs
  video?: string;
  couponIds?: string[]; // array de IDs
  tags?: string[]; // array de tags
}

export async function createProduct(payload: CreateProductPayload) {
  try {
    // Transforma o payload para formato seguro
    const formatted = {
      ...payload,
      priceInCents: Number(payload.priceInCents),
      stock: Number(payload.stock),
    };

    const response = await api.post("/products", formatted);
    return response.data;
  } catch (error) {
    console.error("Erro na criação do produto:", error);
    throw new Error("Falha ao criar produto");
  }
}
