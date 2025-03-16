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
import { Product } from "@/types/Product";
import { getProducts, removeProduct } from "@/lib/localStorage";
import { showToast } from "@/components/toast";

const FALLBACK_IMAGE = "/placeholder-image.svg";

interface ProductTableRowProps {
  product: Product;
  refresh: (products: Product[]) => void;
}

export function ProductTableRow({ product, refresh }: ProductTableRowProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = () => {
    try {
      removeProduct(product.id);
      refresh(getProducts());
      showToast("Produto removido com sucesso!");
    } catch (error) {
      showToast("Erro ao remover produto!", "error");
    }
  };

  const handleEditSuccess = () => {
    refresh(getProducts()); // Força atualização após edição
    setIsEditOpen(false);
  };

  return (
    <TableRow>
      {/* Detalhes do Produto */}
      <TableCell className="sm:w-[64px]">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes do produto</span>
            </Button>
          </DialogTrigger>
          <ProductDetails
            key={product.id + Date.now()} // Força recarregar ao atualizar
            productId={product.id}
          />
        </Dialog>
      </TableCell>

      {/* Imagem Principal */}
      <TableCell className="sm:w-[100px]">
        <img
          src={product.imageUrl || FALLBACK_IMAGE}
          alt={product.name}
          className="h-10 w-10 rounded-md object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = FALLBACK_IMAGE;
            target.onerror = null; // Impede loop
          }}
        />
      </TableCell>

      {/* Demais Células */}
      <TableCell className="font-mono text-xs font-medium sm:w-[100px]">
        {product.id}
      </TableCell>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell className="hidden text-muted-foreground sm:table-cell sm:w-[180px]">
        {product.category || "Sem categoria"}
      </TableCell>
      <TableCell className="hidden text-muted-foreground sm:table-cell sm:w-[180px]">
        {product.subBrand || "Sem marca"}
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <div className="flex flex-wrap gap-1">
          {product.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </TableCell>
      <TableCell className="font-medium sm:w-[120px]">
        {product.stock ?? 0} unidades
      </TableCell>
      <TableCell className="font-medium sm:w-[140px]">
        R$ {product.price?.toFixed?.(2)?.replace(".", ",") ?? "0,00"}
      </TableCell>

      {/* Status */}
      <TableCell className="sm:w-[164px]">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              product.status === "Disponível" ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="font-medium text-muted-foreground">
            {product.status}
          </span>
        </div>
      </TableCell>

      {/* Botão de Edição */}
      <TableCell className="sm:w-[132px]">
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
      </TableCell>

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
