import { getCoupons, GetCouponsResponse } from "@/api/get-coupons";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CirclePlus } from "lucide-react";
import { useState } from "react";

import { Helmet } from "react-helmet-async";
import { CouponTableRow } from "./coupon-table-row";
import { Pagination } from "@/components/pagination";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { CouponTableFilters } from "./coupon-table-filters";
import { CouponCreateDialog } from "./coupon-create-dialog";

export function CouponsManagin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const couponId = searchParams.get("couponId") || undefined;
  const code = searchParams.get("code") || undefined;
  const statusParam = searchParams.get("status");
  const validStatuses = ["all", "active", "expired", "scheduled"] as const;
  const status = validStatuses.includes(
    statusParam as (typeof validStatuses)[number],
  )
    ? (statusParam as (typeof validStatuses)[number])
    : "all";

  const discountTypeParam = searchParams.get("discountType");
  const validDiscountTypes = ["percentage", "fixed"] as const;
  const discountType = validDiscountTypes.includes(
    discountTypeParam as (typeof validDiscountTypes)[number],
  )
    ? (discountTypeParam as (typeof validDiscountTypes)[number])
    : undefined;

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get("page") ?? "1");

  const { data: result } = useQuery<GetCouponsResponse>({
    queryKey: ["coupons", { pageIndex, status, code, discountType, couponId }],
    queryFn: () =>
      getCoupons({
        pageIndex,
        status: status !== "all" ? status : undefined,
        code,
        discountType,
        couponId,
      }),
  });

  function handlePaginate(pageIndex: number) {
    setSearchParams((state) => {
      state.set("page", (pageIndex + 1).toString());
      return state;
    });
  }

  const queryClient = useQueryClient();
  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["coupons"] });
  };

  return (
    <>
      <Helmet title="Coupons" />
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Coupons
        </h1>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <CouponTableFilters />

          <Button
            variant="secondary"
            size="xs"
            onClick={() => setIsDialogOpen(true)}
            className="gap-2"
          >
            <CirclePlus className="h-4 w-4" /> Creat new Coupon
          </Button>

          <CouponCreateDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSuccess={() =>
              queryClient.invalidateQueries({ queryKey: ["coupons"] })
            }
          />
        </div>

        <div className="overflow-x-auto">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Valor mínimo</TableHead>
                  <TableHead>Usos max.</TableHead>
                  <TableHead>Utilizado</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Atualizado em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result?.coupons.map((coupon) => (
                  <CouponTableRow
                    key={coupon.discount_coupon_id}
                    coupon={coupon}
                    refresh={refresh}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
          {result && (
            <Pagination
              onPageChange={handlePaginate}
              pageIndex={result.meta.pageIndex}
              totalCount={result.meta.totalCount}
              perPage={result.meta.perPage}
            />
          )}
        </div>
      </div>
    </>
  );
}
