// src/pages/app/products/components/product-table-row.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Search, Trash } from "lucide-react";
import { ProductDetails } from "./product-details";
import { useState } from "react";
import { showToast } from "@/components/toast";
import { deleteProduct } from "@/api/delete-product";
import { Badge } from "@/components/ui/badge";
import { calculateDiscountedPrice } from "@/lib/utils";
import { Category } from "@/api/get-categories";
import { Brand } from "@/api/get-brands";
import ProductEditDetails from "./product-edit-details";

interface ProductTableRowProps {
  product: {
    productId: string;
    productName: string;
    description: string;
    priceInCents: number;
    status: "available" | "unavailable" | "archived";
    stock: number;
    isFeatured: boolean;
    isArchived: boolean;
    categoryIds: string[]; // já é array
    brandId: string;
    tags?: Array<{ id: string; name: string }>;
    coupons: Array<{
      code: string;
      discountType: "percentage" | "fixed";
      discountValue: number;
    }>;
    images: string[];
  };
  refresh: () => void;
  categories: Category[]; // recebe como prop
  brands: Brand[]; // recebe como prop
}

export function ProductTableRow({
  product,
  refresh,
  categories,
  brands,
}: ProductTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditDetailsOpen, setIsEditDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const categoryNames =
    product.categoryIds
      .map((id) => {
        const c = categories.find((c) => c.category_id === id);
        return c?.category_name;
      })
      .filter(Boolean)
      .join(", ") || "N/A";

  const brandName =
    brands.find((b) => b.brand_id === product.brandId)?.brand_name || "N/A";

  const handleDelete = async () => {
    try {
      await deleteProduct(product.productId);
      showToast("Produto removido com sucesso", "success");
      setIsDeleteOpen(false);
      refresh();
    } catch {
      showToast("Erro ao remover o produto", "error");
    }
  };

  const originalCents = product.priceInCents;
  const discountedCents = calculateDiscountedPrice(
    originalCents,
    product.coupons,
  );

  const originalPrice = originalCents / 100;
  const discountedPrice = discountedCents / 100;

  function formatCouponValue(
    type: "percentage" | "fixed",
    raw: number,
  ): string {
    if (type === "fixed") {
      // raw está em centavos: 2514 → R$ 25,14
      const reais = raw / 100;
      return reais.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    } else {
      // raw está em basis points (centésimos de %): 2384 → 23.84%
      const pct = raw / 100;
      return `${pct.toFixed(2).replace(".", ",")}%`;
    }
  }

  return (
    <TableRow>
      {/* Detalhes */}
      <TableCell className="sm:w-[64px]">
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <ProductDetails productId={product.productId} open={isDetailsOpen} />
        </Dialog>
      </TableCell>

      {/* ID / Nome */}
      <TableCell className="font-mono text-xs sm:w-[100px]">
        {product.productId}
      </TableCell>
      <TableCell className="font-medium">{product.productName}</TableCell>

      {/* Categorias */}
      <TableCell className="hidden sm:table-cell sm:w-[180px]">
        {categoryNames}
      </TableCell>

      {/* Marca */}
      <TableCell className="hidden sm:table-cell sm:w-[180px]">
        {brandName}
      </TableCell>

      {/* Tags */}
      <TableCell className="hidden sm:table-cell">
        <div className="flex flex-wrap gap-1">
          {Array.from(new Set(product.tags ?? [])).map((tag, i) => (
            <span
              key={`${product.productId}-${tag}-${i}`}
              className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </TableCell>

      {/* Cupons */}
      <TableCell className="sm:w-[120px]">
        <div className="flex flex-wrap gap-1">
          {product.coupons.length > 0 ? (
            product.coupons.map((c) => {
              const formatted = formatCouponValue(
                c.discountType,
                c.discountValue,
              );
              return (
                <Badge
                  className="text-center text-xs"
                  key={c.code}
                  variant="outline"
                  title={`Desconto: ${formatted}`}
                >
                  {c.code} ({formatted})
                </Badge>
              );
            })
          ) : (
            <span className="text-xs text-muted-foreground/70">Nenhum</span>
          )}
        </div>
      </TableCell>

      {/* Estoque */}
      <TableCell className="sm:w-[120px]">{product.stock} uni</TableCell>

      {/* Preço */}
      <TableCell className="sm:w-[140px]">
        {originalPrice.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </TableCell>
      {/* Preço com desconto */}
      <TableCell className="sm:w-[140px]">
        {discountedPrice.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </TableCell>

      {/* Status */}
      <TableCell className="sm:w-[164px]">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              product.status === "available"
                ? "bg-green-500"
                : product.status === "archived"
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }`}
          />
          <span>{product.status}</span>
        </div>
      </TableCell>

      <TableCell>
        <Dialog open={isEditDetailsOpen} onOpenChange={setIsEditDetailsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Pencil /> Editar
            </Button>
          </DialogTrigger>
          <ProductEditDetails
            product={product}
            onClose={() => setIsEditDetailsOpen(false)}
            refresh={refresh}
          />
        </Dialog>
      </TableCell>

      {/* Remover */}
      <TableCell className="sm:w-[132px]">
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="xs">
              Excluir
              <Trash className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir Produto</DialogTitle>
              <DialogDescription>Confirme a ação</DialogDescription>
            </DialogHeader>
            <p>Esta ação não pode ser desfeita.</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Confirmar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}
