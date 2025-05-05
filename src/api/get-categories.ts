import { api } from "@/lib/axios";

export interface GetCategoriesQuery {
  pageIndex?: number;
  categoryId?: string | null;
  categoryName?: string | null;
}

export interface Category {
  category_id: string;
  category_name: string;
  slug: string;
  storeId: string;
  createdAt: string;
}
export interface GetCategoryResponse {
  categories: Category[];
  meta: {
    pageIndex: number;
    perPage: number;
    totalCount: number;
  };
}

export async function getCategories({
  pageIndex,
  categoryId,
  categoryName,
}: GetCategoriesQuery): Promise<GetCategoryResponse> {
  const response = await api.get<GetCategoryResponse>("/categories", {
    params: {
      pageIndex,
      categoryId,
      categoryName,
    },
  });
  return response.data;
}
