import { api } from "@/lib/axios";

export interface GetOrdersResponse {}

export async function getOrders() {
  const response = await api.get("/orders", {
    params: {
      pageIndex: 0,
    },
  });
}
