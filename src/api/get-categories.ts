import { api } from "@/lib/axios";

export interface GetCategoryResponse {
  category_id: string;
  category_name: string;
  storeId: string;
}

export async function getCategories(): Promise<GetCategoryResponse[]> {
  const response = await api.get<GetCategoryResponse[]>("/categories");
  return response.data;
}
