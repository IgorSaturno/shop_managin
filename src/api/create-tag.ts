import { api } from "@/lib/axios";

export interface CreateTagResponse {
  id: string;
  tag_name: string;
  slug: string;
  storeId: string;
}

export async function createTag(name: string) {
  const response = await api.post<CreateTagResponse>("/tags", { name });
  return response.data;
}

// export async function listTags() {
//   const response = await api.get<Tag[]>("/tags");
//   return response.data;
// }
