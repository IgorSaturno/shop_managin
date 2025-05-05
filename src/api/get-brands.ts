import { api } from "@/lib/axios";

export interface GetBrandsQuery {
  pageIndex?: number;
  brandId?: string | null;
  brandName?: string | null;
}

export interface Brand {
  brand_id: string;
  brand_name: string;
  slug: string;
  storeId: string;
  createdAt: string;
}
export interface GetBrandResponse {
  brands: Brand[];
  meta: {
    pageIndex: number;
    perPage: number;
    totalCount: number;
  };
}

export async function getBrands({
  pageIndex,
  brandId,
  brandName,
}: GetBrandsQuery): Promise<GetBrandResponse> {
  const response = await api.get<GetBrandResponse>("/brands", {
    params: {
      pageIndex,
      brandId,
      brandName,
    },
  });
  return response.data;
}
