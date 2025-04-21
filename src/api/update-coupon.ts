import { api } from "@/lib/axios";

interface UpdateCouponParams {
  validFrom: Date;
  validUntil: Date;
}

export async function updateCoupon(id: string, data: UpdateCouponParams) {
  const response = await api.patch(`/discount-coupons/${id}`, {
    validFrom: data.validFrom.toISOString(),
    validUntil: data.validUntil.toISOString(),
  });
  return response.data;
}
