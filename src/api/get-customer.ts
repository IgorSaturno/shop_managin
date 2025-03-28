import { api } from "@/lib/axios";

export interface GetCustomersQuery {
  pageIndex?: number | null;
  name?: string | null;
  email?: string | null;
}

export interface GetCustomersResponse {
  customers: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    orderCount: number;
    createdAt: Date;
  }[];
  meta: {
    pageIndex: number;
    perPage: number;
    totalCount: number;
  };
}

export async function getCustomers({
  pageIndex,
  name,
  email,
}: GetCustomersQuery) {
  const response = await api.get<GetCustomersResponse>("/customers", {
    params: {
      pageIndex,
      name,
      email,
    },
  });

  return response.data;
}
