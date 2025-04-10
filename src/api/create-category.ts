import { api } from "@/lib/axios";

export interface createCategoryResponse {
  category_id: string;
  category_name: string;
  storeId: string;
}

export async function createCategory(name: string) {
  const response = await api.post<createCategoryResponse>("/categories", {
    name,
  });
  return response.data;
}

// export async function listCategories() {
//   const response = await api.get<Category[]>("/categories");
//   return response.data;
// }
