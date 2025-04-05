import { api } from "@/lib/axios";

export interface GetProductDetailsParams {
  productId: string;
}

export interface GetProductDetailsResponse {
  productId: string;
  productName: string;
  description: string;
  priceInCents: number;
  stock: number;
  sku: string;
  category: string;
  subBrand: string;
  tags: string[];
  status: "available" | "unavailable" | "archived";
  images: string[];
  createdAt: string;
}

export async function GetProductDetails({
  productId,
}: GetProductDetailsParams) {
  const response = await api.get<GetProductDetailsResponse>(
    `/products/${productId}`,
  );
  return response.data;
}
