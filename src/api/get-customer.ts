import { api } from "@/lib/axios";

export interface GetCustomersQuery {
  pageIndex?: number | null;
  customerId?: string | null;
  customerName?: string | null;
  email?: string | null;
}

export interface GetCustomersResponse {
  customers: {
    customerId: string;
    customerName: string;
    email: string;
    phone: string | null;
    orderCount: number;
    createdAt: string;
  }[];
  meta: {
    pageIndex: number;
    perPage: number;
    totalCount: number;
  };
}

export async function getCustomers({
  pageIndex,
  customerName,
  email,
}: GetCustomersQuery) {
  const response = await api.get<GetCustomersResponse>("/customers", {
    params: {
      pageIndex,
      name: customerName,
      email,
    },
  });

  return response.data;
}
