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
import { Search, Trash } from "lucide-react";
import { ProductDetails } from "./product-details";
import { useState } from "react";
import { showToast } from "@/components/toast";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { deleteProduct } from "@/api/delete-product";
import { Badge } from "@/components/ui/badge";
import { calculateDiscountedPrice } from "@/lib/utils";

interface ProductTableRowProps {
  product: {
    productId: string;
    productName: string;
    description: string;
    priceInCents: number;
    status: "available" | "unavailable" | "archived";
    stock: number;
    sku: string;
    isFeatured: boolean;
    categoryIds: string[];
    brandId: string;
    tags?: string[];
    coupons: Array<{
      code: string;
      discountType: "percentage" | "fixed";
      discountValue: number;
    }>;
    images: string[];
  };
  refresh: () => void;
}

export function ProductTableRow({ product, refresh }: ProductTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Buscar categorias com valor padrão
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/categories");
      // Garante que o retorno seja array, mesmo se a API estiver malformatada
      return Array.isArray(response.data) ? response.data : [];
    },
  });

  // Buscar marcas com valor padrão
  const { data: brands = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const response =
        await api.get<Array<{ value: string; label: string }>>("/brands");
      return response.data; // Altere para response.data.data se necessário
    },
  });

  // Processar categorias
  const categoryNames = (
    Array.isArray(categories) 
      ? categories
          .filter((category) => product.categoryIds?.includes(category.value))
          .map((category) => category.label)
      : [] // Fallback definitivo
  ).join(", ") || "N/A"; // Join + fallback final

  // Processar marca
  const brandName =
    brands.find((brand) => brand.value === product.brandId)?.label || "N/A";

  const handleDelete = async () => {
    try {
      await deleteProduct(product.productId);
      showToast("Produto removido com sucesso", "success");
      setIsDeleteOpen(false);
      refresh();
    } catch (error) {
      showToast("Erro ao remover o produto", "error");
      console.error("Erro ao deletar produto:", error);
    }
  };

  return (
    <TableRow>
      {/* Célula de Detalhes */}
      <TableCell className="sm:w-[64px]">
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes do produto</span>
            </Button>
          </DialogTrigger>
          <ProductDetails
            key={product.productId}
            productId={product.productId}
            open={isDetailsOpen}
          />
        </Dialog>
      </TableCell>

      {/* Conteúdo das células */}
      <TableCell className="font-mono text-xs font-medium sm:w-[100px]">
        {product.productId}
      </TableCell>
      <TableCell className="font-medium">{product.productName}</TableCell>

      {/* Categorias */}
      <TableCell className="hidden text-muted-foreground sm:table-cell sm:w-[180px]">
        {categoryNames}
      </TableCell>

      {/* Marca */}
      <TableCell className="hidden text-muted-foreground sm:table-cell sm:w-[180px]">
        {brandName}
      </TableCell>

      {/* Tags */}
      <TableCell className="hidden sm:table-cell">
        <div className="flex flex-wrap gap-1">
          {Array.from(new Set(product.tags ?? [])).map((tag, index) => (
            <span
              key={`${product.productId}-${tag}-${index}`}
              className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
            >
              {tag}
            </span>
          ))}
        </div>
      </TableCell>

      {/* Cupons */}
      <TableCell className="font-medium sm:w-[120px]">
        <div className="flex flex-wrap gap-1">
          {product.coupons?.map((coupon) => (
            <Badge
              key={coupon.code}
              variant="outline"
              className="mr-1 text-xs"
              title={`Desconto: ${coupon.discountValue}${coupon.discountType === "percentage" ? "%" : "R$"}`}
            >
              {coupon.code} ({coupon.discountValue}
              {coupon.discountType === "percentage" ? "%" : "R$"})
            </Badge>
          ))}
          {product.coupons?.length === 0 && (
            <span className="text-xs text-muted-foreground/70">
              Nenhum cupom
            </span>
          )}
        </div>
      </TableCell>

      {/* Estoque */}
      <TableCell className="font-medium sm:w-[120px]">
        {product.stock} uni...
      </TableCell>

      {/* Preço */}
      <TableCell className="font-medium sm:w-[140px]">
        {product.coupons?.length > 0 ? (
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground/60 line-through">
              {(product.priceInCents / 100).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
            <span className="font-semibold text-green-600">
              {(
                calculateDiscountedPrice(
                  product.priceInCents,
                  product.coupons,
                ) / 100
              ).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
        ) : (
          <span>
            {(product.priceInCents / 100).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        )}
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
          <span className="font-medium text-muted-foreground">
            {product.status}
          </span>
        </div>
      </TableCell>

      {/* Botão de Exclusão */}
      <TableCell className="sm:w-[132px]">
        <div className="flex gap-2">
          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="xs">
                <Trash className="mr-2 h-3 w-3" />
                Remover
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remover Produto</DialogTitle>
                <DialogDescription aria-describedby={undefined} />
              </DialogHeader>
              <p>
                Tem certeza de que deseja remover este produto? Esta ação não
                pode ser desfeita.
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteOpen(false)}
                >
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Confirmar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </TableCell>
    </TableRow>
  );
}
