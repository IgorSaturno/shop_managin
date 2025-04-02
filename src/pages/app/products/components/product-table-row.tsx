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
import ProductEditDetails from "./product-edit-details";

import { showToast } from "@/components/toast";

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
    category?: string;
    subBrand?: string;
    tags?: string[];
  };
  refresh: () => void;
}

export function ProductTableRow({ product, refresh }: ProductTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEditSuccess = () => {
    setIsEditOpen(false);
    refresh();
  };

  const handleDelete = async () => {
    try {
      showToast("Produto removido com sucesso", "success");
      setIsDeleteOpen(false);
      refresh();
    } catch {
      showToast("Erro ao remover o produto", "error");
    }
  };
  return (
    <TableRow>
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

      <TableCell className="font-mono text-xs font-medium sm:w-[100px]">
        {product.productId}
      </TableCell>
      <TableCell className="font-medium">{product.productName}</TableCell>
      <TableCell className="hidden text-muted-foreground sm:table-cell sm:w-[180px]">
        {product?.category}
      </TableCell>
      <TableCell className="hidden text-muted-foreground sm:table-cell sm:w-[180px]">
        {product?.subBrand}
      </TableCell>

      <TableCell className="hidden sm:table-cell">
        <div className="flex flex-wrap gap-1">
          {product?.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
            >
              {tag}
            </span>
          ))}
        </div>
      </TableCell>

      <TableCell className="font-medium sm:w-[120px]">
        {product.stock} unidades
      </TableCell>
      <TableCell className="font-medium sm:w-[140px]">
        {(product.priceInCents / 100).toLocaleString("pt-BR", {
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
          <span className="font-medium text-muted-foreground">
            {product.status}
          </span>
        </div>
      </TableCell>

      {/* Botão de Edição */}
      {/* <TableCell className="sm:w-[132px]">
        <div className="flex gap-2">
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="xs">
                <Pencil className="mr-2 h-3 w-3" />
                Editar
              </Button>
            </DialogTrigger>
            <ProductEditDetails
              product={product}
              onClose={() => setIsEditOpen(false)}
              refresh={handleEditSuccess} // Usa função dedicada
            />
          </Dialog>
        </div>
      </TableCell> */}

      {/* Botão de Exclusão */}
      <TableCell className="sm:w-[132px]">
        <div className="flex gap-2">
          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="xs">
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
