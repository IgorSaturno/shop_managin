import { api } from "@/lib/axios";

export interface GetTagsQuery {
  pageIndex?: number;
  tagId?: string | null;
  tagName?: string | null;
}

export interface Tag {
  tag_id: string;
  tag_name: string;
  slug: string;
  storeId: string;
  createdAt: string;
}

export interface GetTagsResponse {
  tags: Tag[];
  meta: {
    pageIndex: number;
    perPage: number;
    totalCount: number;
  };
}

export async function getTags({
  pageIndex,
  tagId,
  tagName,
}: GetTagsQuery): Promise<GetTagsResponse> {
  const response = await api.get<GetTagsResponse>("/tags", {
    params: {
      pageIndex,
      tagId,
      tagName,
    },
  });

  return response.data;
}
