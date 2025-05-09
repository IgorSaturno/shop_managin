import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calcula o preço com desconto em centavos.
 * - Para cupom fixed: discountValue já está em centavos.
 * - Para cupom percentage: discountValue está em basis points (ex: 2384 = 23.84%).
 */
export const calculateDiscountedPrice = (
  priceInCents: number,
  coupons: Array<{
    discountType: "percentage" | "fixed";
    discountValue: number;
  }>,
): number => {
  if (!coupons.length) return priceInCents;

  // Se quisesse usar apenas o maior desconto, poderia fazer:
  // const bestDiscount = coupons.reduce((max, coupon) => {
  //   const value =
  //     coupon.discountType === "percentage"
  //       ? Math.round(priceInCents * (coupon.discountValue / 10000))
  //       : coupon.discountValue;
  //   return value > max ? value : max;
  // }, 0);
  // return Math.max(priceInCents - bestDiscount, 0);

  // Aplica cada desconto sobre o preço original
  let result = priceInCents;

  for (const coupon of coupons) {
    if (coupon.discountType === "fixed") {
      // desconto fixo em centavos
      result -= coupon.discountValue;
    } else {
      // basis points → porcentagem
      const percent = coupon.discountValue / 10000;
      result -= Math.round(priceInCents * percent);
    }
  }

  return Math.max(result, 0);
};
