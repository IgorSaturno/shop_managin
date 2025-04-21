import { api } from "@/lib/axios";

export interface CreateCouponParams {
  code: string;
  discountType: "percentage" | "fixed"; // lowercase
  discountValue: number;
  validUntil: Date;
  validFrom: Date;
  active: boolean;
}

export async function createCoupon(data: CreateCouponParams) {
  const response = await api.post("/discount-coupons", {
    ...data,
    validUntil: data.validUntil.toISOString(), // Certifique-se que é uma string ISO válida
    minimumOrder: "0",
  });
  return response.data;
}
