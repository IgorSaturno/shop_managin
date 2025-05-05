import { api } from "@/lib/axios";

export interface GetCouponsQueryParams {
  pageIndex?: number;
  status?: "active" | "expired" | "scheduled" | "all";
  couponId?: string | null;
  code?: string | null;
  discountType?: "percentage" | "fixed";
}

export interface Coupon {
  discount_coupon_id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number; // reais
  validFrom: Date;
  validUntil: Date;
  minimumOrder: string; // reais string
  maxUses: number;
  usedCount: number;
  active: boolean;
  products: { productId: string }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GetCouponsResponse {
  coupons: Coupon[];
  meta: {
    pageIndex: number;
    perPage: number;
    totalCount: number;
  };
}

export async function getCoupons(params: GetCouponsQueryParams) {
  const response = await api.get<GetCouponsResponse>("/discount-coupons", {
    params: {
      pageIndex: params.pageIndex,
      status: params.status !== "all" ? params.status : undefined,
      couponId: params.couponId ?? undefined,
      code: params.code ?? undefined,
      discountType: params.discountType ?? undefined,
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
