import { api } from "@/lib/axios";

export interface GetBrandsResponse {
  brand_id: string;
  brand_name: string;
  slug: string;
  storeId: string;
}

export async function getBrands(): Promise<GetBrandsResponse[]> {
  const response = await api.get<GetBrandsResponse[]>("/brands");
  return response.data;
}
