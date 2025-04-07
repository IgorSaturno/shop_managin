import { api } from "@/lib/axios";

export interface Tag {
  id: string;
  tag_name: string;
  slug: string;
  storeId: string;
}

export async function createTag(name: string) {
  const response = await api.post<Tag>("/tags", { name });
  return response.data;
}

export async function listTags() {
  const response = await api.get<Tag[]>("/tags");
  return response.data;
}
