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

export function ProductTableRow() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
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
          <ProductDetails />
        </Dialog>
      </TableCell>

      <TableCell>
        <img
          src="#"
          alt="Produto"
          className="h-10 w-10 rounded-md object-cover"
        />
      </TableCell>

      <TableCell className="font-mono text-xs font-medium">
        12345-abcde
      </TableCell>

      <TableCell className="font-medium">Dildo arco-iris</TableCell>
      <TableCell className="text-muted-foreground">Dildo</TableCell>
      <TableCell className="text-muted-foreground">ásos</TableCell>
      <TableCell className="font-medium">25 unidades</TableCell>
      <TableCell className="font-medium">R$ 79,90</TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="font-medium text-muted-foreground">Disponível</span>
        </div>
      </TableCell>

      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Pencil className="mr-2 h-3 w-3" />
              Editar
            </Button>
          </DialogTrigger>
          {/* <ProductEditDetails /> */}
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
              <Button
                variant="destructive"
                onClick={() => console.log("Produto removido!")}
              >
                Confirmar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}
