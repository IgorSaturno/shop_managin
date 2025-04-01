import { api } from "@/lib/axios";

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export async function getTags(): Promise<Tag[]> {
  const response = await api.get<Tag[]>("/tags");
  return response.data;
}
