import { deleteCoupons } from "@/api/delete-coupons";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { Coupon } from "@/api/get-coupons";
import { useState } from "react";
import { CouponEditDetails } from "./coupon-edit-details";

interface CouponTableRowProps {
  coupon: Coupon;
  refresh: () => void;
}

export function CouponTableRow({ coupon, refresh }: CouponTableRowProps) {
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteCoupons(coupon.discount_coupon_id);
      await queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Cupom removido com sucesso!");
      refresh();
    } catch (error) {
      console.error("Erro ao excluir cupom:", error);
      toast.error("Erro ao excluir cupom.");
    }
  };

  const getStatusBadge = (validFrom: Date, validUntil: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const from = new Date(validFrom);
    from.setHours(0, 0, 0, 0);
    const until = new Date(validUntil);
    until.setHours(0, 0, 0, 0);

    if (today > until)
      return (
        <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
          Expirado
        </span>
      );
    if (today >= from)
      return (
        <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
          Ativo
        </span>
      );
    return (
      <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
        Programado
      </span>
    );
  };

  const validFrom = new Date(coupon.validFrom);
  const validUntil = new Date(coupon.validUntil);

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          {coupon.discount_coupon_id}
        </TableCell>
        <TableCell>{coupon.code}</TableCell>
        <TableCell>
          {coupon.discountType === "percentage" ? "%" : "R$"}
        </TableCell>
        <TableCell>
          {coupon.discountType === "percentage"
            ? `${(coupon.discountValue / 100).toLocaleString("pt-BR", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}%`
            : (coupon.discountValue / 100).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
        </TableCell>
        <TableCell>
          {(Number(coupon.minimumOrder) / 100).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </TableCell>
        <TableCell>{coupon.maxUses}</TableCell>
        <TableCell>{coupon.usedCount}</TableCell>
        <TableCell>
          {validFrom.toLocaleDateString("pt-BR")} –{" "}
          {validUntil.toLocaleDateString("pt-BR")}
        </TableCell>
        <TableCell>{getStatusBadge(validFrom, validUntil)}</TableCell>
        <TableCell>
          {coupon.createdAt
            ? new Date(coupon.createdAt).toLocaleDateString("pt-BR")
            : "N/A"}
        </TableCell>
        <TableCell>
          {coupon.updatedAt
            ? new Date(coupon.updatedAt).toLocaleDateString("pt-BR")
            : "N/A"}
        </TableCell>
        <TableCell className="space-x-2">
          <Button variant="ghost" size="xs" onClick={() => setIsEditOpen(true)}>
            <Pencil className="mr-1 h-4 w-4" />
            Editar
          </Button>
          <Button variant="ghost" size="xs" onClick={handleDelete}>
            <Trash className="mr-1 h-4 w-4" />
            Remover
          </Button>
        </TableCell>
      </TableRow>

      <CouponEditDetails
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        coupon={coupon}
        onSuccess={refresh}
      />
    </>
  );
}
