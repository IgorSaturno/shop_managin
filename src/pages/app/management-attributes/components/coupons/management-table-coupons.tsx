import { getCoupons, GetCouponsQuery } from "@/api/get-coupons";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CirclePlus, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CouponFormDialog } from "./coupon-form-dialog";
import { deleteCoupons } from "@/api/delete-coupons";
import { updateCoupon } from "@/api/update-coupon";
import { DateRangePickerValidate } from "@/components/ui/date-range-picker-validate";

export function ManagementTableCoupons() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [pageIndex] = useState(0);
  const [status] = useState<"active" | "inactive" | "all">("all");

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["coupons", pageIndex, status],
    queryFn: ({ queryKey }) => {
      const [, params] = queryKey as [string, GetCouponsQuery];
      return getCoupons(params);
    },
  });

  const handleDateUpdate = async (
    couponId: string,
    range: { from: Date; to: Date },
  ) => {
    try {
      await updateCoupon(couponId, {
        validFrom: range.from,
        validUntil: range.to,
      });
      await queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Período de validade atualizado!");
    } catch (error) {
      console.error("Erro detalhado:", error);
      toast.error("Erro ao atualizar período");
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    try {
      await deleteCoupons(couponId);
      await queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Cupom removido com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir cupom:", error);
      toast.error("Erro ao excluir cupom.");
    }
  };

  function getStatusBadge(validFrom: Date, validUntil: Date) {
    const today = new Date();

    if (today > validUntil) {
      return <span className="text-red-500">Expirado</span>;
    }
    if (today >= validFrom) {
      return <span className="text-green-500">Ativo</span>;
    }
    return <span className="text-orange-500">Programado</span>;
  }

  return (
    <div className="rounded-md border p-1">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="secondary"
          size="xs"
          onClick={() => setIsDialogOpen(true)}
          className="gap-2"
        >
          <CirclePlus className="h-4 w-4" />
          Novo Cupom
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[12%]">ID</TableHead>
            <TableHead className="w-[10%]">Código</TableHead>
            <TableHead className="w-[10%]">Tipo</TableHead>
            <TableHead className="w-[10%]">Valor</TableHead>
            <TableHead className="w-[15%]">Range</TableHead>
            <TableHead className="w-[15%]">Status</TableHead>
            <TableHead className="w-[15%]">Criado em</TableHead>
            <TableHead className="w-[20%]"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow key="loading">
              <TableCell colSpan={8} className="h-24 text-center">
                Carregando cupons...
              </TableCell>
            </TableRow>
          ) : coupons?.coupons?.length ? (
            coupons.coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>{coupon.id}</TableCell>
                <TableCell>{coupon.code}</TableCell>
                <TableCell>
                  {coupon.discountType.toLowerCase() === "percentage"
                    ? "%"
                    : "R$"}
                </TableCell>
                <TableCell>
                  {coupon.discountType === "percentage"
                    ? `${coupon.discountValue}%`
                    : (coupon.discountValue / 100).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                </TableCell>
                <TableCell>
                  <DateRangePickerValidate
                    date={{
                      from: new Date(coupon.validFrom),
                      to: new Date(coupon.validUntil),
                    }}
                    onDateChange={(range) => {
                      if (range?.from && range?.to) {
                        handleDateUpdate(coupon.id, {
                          from: range.from,
                          to: range.to,
                        });
                      }
                    }}
                    className="w-[250px]"
                  />
                  <div className="mt-1 text-xs text-muted-foreground">
                    {getStatusBadge(
                      new Date(coupon.validFrom),
                      new Date(coupon.validUntil),
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const currentDate = new Date();
                      const validFrom = new Date(coupon.validFrom);
                      const validUntil = new Date(coupon.validUntil);

                      let status = "";
                      if (currentDate > validUntil) {
                        status = "Expirado";
                      } else if (currentDate >= validFrom) {
                        status = "Ativo";
                      } else {
                        status = "Programado";
                      }

                      return (
                        <>
                          <span
                            className={`h-2 w-2 rounded-full ${
                              status === "Ativo"
                                ? "bg-green-500"
                                : status === "Expirado"
                                  ? "bg-red-500"
                                  : "bg-orange-500"
                            }`}
                          />
                          <span className="font-medium text-muted-foreground">
                            {status}
                          </span>
                        </>
                      );
                    })()}
                  </div>
                </TableCell>
                <TableCell>
                  {coupon.createdAt
                    ? new Date(coupon.createdAt).toLocaleDateString("pt-BR")
                    : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleDeleteCoupon(coupon.id)}
                  >
                    <Trash className="h-4 w-4" />
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow key="empty">
              <TableCell colSpan={3} className="h-24 text-center">
                Nenhum cupom encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <CouponFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["categories"] })
        }
      />
    </div>
  );
}
