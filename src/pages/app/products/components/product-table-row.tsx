import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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

interface ProductTableRowProps {
  product: Product;
  refresh: (products: Product[]) => void;
}

export function ProductTableRow({ product, refresh }: ProductTableRowProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = () => {
    removeProduct(product.id);
    refresh(getProducts());
    setIsDeleteOpen(false);
  };

  return (
    <TableRow>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes do produto</span>
            </Button>
          </DialogTrigger>
          <ProductDetails key={product.id} productId={product.id} />
        </Dialog>
      </TableCell>

      <TableCell>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-10 w-10 rounded-md object-cover"
        />
      </TableCell>

      <TableCell className="font-mono text-xs font-medium">
        {product.id}
      </TableCell>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell className="text-muted-foreground">
        {product.category}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {product.subBrand}
      </TableCell>
      <TableCell className="font-medium">{product.stock} unidades</TableCell>
      <TableCell className="font-medium">
        R$ {product.price.toFixed(2)}
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${product.status === "Disponível" ? "bg-green-500" : "bg-red-500"}`}
          />
          <span className="font-medium text-muted-foreground">
            {product.status}
          </span>
        </div>
      </TableCell>

      <TableCell>
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Pencil className="mr-2 h-3 w-3" />
              Editar
            </Button>
          </DialogTrigger>
          <ProductEditDetails
            product={product}
            onClose={() => {
              setIsEditOpen(false); // Fecha o modal de edição
              refresh(getProducts()); // Atualiza a lista de produtos
            }}
          />
        </Dialog>
      </TableCell>

      <TableCell>
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
            </DialogHeader>
            <p>
              Tem certeza de que deseja remover este produto? Esta ação não pode
              ser desfeita.
            </p>
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
