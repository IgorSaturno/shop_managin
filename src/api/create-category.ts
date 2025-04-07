import { api } from "@/lib/axios";

export interface Category {
  category_id: string;
  category_name: string;
  storeId: string;
}

export async function createCategory(name: string) {
  const response = await api.post<Category>("/categories", { name });
  return response.data;
}

export async function listCategories() {
  const response = await api.get<Category[]>("/categories");
  return response.data;
}
