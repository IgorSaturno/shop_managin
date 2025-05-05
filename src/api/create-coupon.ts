import { api } from "@/lib/axios";

export interface CreateCouponParams {
  discount_coupon_id: string;
  code: string;
  discountType: "percentage" | "fixed"; // lowercase
  discountValue: number;
  validUntil: string;
  validFrom: string;
  minimumOrder?: string;
  maxUses?: number;
  active: boolean;
}

export async function createCoupon(data: CreateCouponParams) {
  const response = await api.post("/discount-coupons", data);
  return response.data;
}
