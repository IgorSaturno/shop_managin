import { api } from "@/lib/axios";

export interface GetTagsResponse {
  id: string;
  tag_name: string;
  slug: string;
  storeId: string;
}

export async function getTags(): Promise<GetTagsResponse[]> {
  const response = await api.get<GetTagsResponse[]>("/tags");
  return response.data;
}
