import { api } from "@/lib/axios";

export interface GetCouponsQuery {
  pageIndex?: number;
  status?: "active" | "inactive" | "all";
}

export interface GetCouponsResponse {
  coupons: {
    id: string;
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    validUntil: string;
    validFrom: string;
    active: boolean;
    products: Array<{ productId: string }>;
    createdAt: string;
    updatedAt: string;
  }[];
  meta: {
    pageIndex: number;
    perPage: number;
    totalCount: number;
  };
}

export async function getCoupons({ pageIndex = 0, status }: GetCouponsQuery) {
  const response = await api.get<GetCouponsResponse>("/discount-coupons", {
    params: {
      pageIndex,
      status: status !== "all" ? undefined : status,
    },
  });

  const convertedData = {
    ...response.data,
    coupons: response.data.coupons.map((coupon) => ({
      ...coupon,
      validFrom: new Date(coupon.validFrom),
      validUntil: new Date(coupon.validUntil),
      createdAt: new Date(coupon.createdAt),
      updatedAt: new Date(coupon.updatedAt),
    })),
  };
  return convertedData;
}
