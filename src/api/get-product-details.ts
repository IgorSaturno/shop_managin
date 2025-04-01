import { api } from "@/lib/axios";

export interface GetProductDetialsParams {
  productId: string;
}

export interface GetProductDetialsResponse {
  productId: string;
  productName: string;
  description: string;
  price: string;
  stock: number;
  sku: string;
  category: string;
  subBrand: string;
  tags: string[];
  status: string;
  images: string[];
}

export async function GetProductDetials({
  productId,
}: GetProductDetialsParams) {
  const response = await api.get<GetProductDetialsResponse>(
    `/products/${productId}`,
  );
  return response.data;
}
