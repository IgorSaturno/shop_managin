import { api } from "@/lib/axios";

export interface UploadImagesResponse {
  id: string;
  urls: {
    original: string;
    optimized: string;
    thumbnail: string;
  };
}

export async function uploadImage(
  file: File,
  productId: string,
): Promise<UploadImagesResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<UploadImagesResponse>(
    `/products/${productId}/images`,
    formData,
  );

  return response.data;
}
