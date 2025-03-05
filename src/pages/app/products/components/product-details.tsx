import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useState } from "react";

const productImages = [
  "https://via.placeholder.com/300x300?text=Imagem+1",
  "https://via.placeholder.com/300x300?text=Imagem+2",
  "https://via.placeholder.com/300x300?text=Imagem+3",
  "https://via.placeholder.com/300x300?text=Imagem+4",
];

export function ProductDetails() {
  const [selectedImage, setSelectedImage] = useState(productImages[0]);
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Produto: Dildo arco-iris</DialogTitle>
        <DialogDescription>Detalhes do produto</DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-muted-foreground">ID</TableCell>
              <TableCell className="text-right">12345-abcde</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">Categoria</TableCell>
              <TableCell className="text-right">Dildo</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">Preço</TableCell>
              <TableCell className="text-right">R$ 79,90</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">Estoque</TableCell>
              <TableCell className="text-right">25 unidades</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">Status</TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="font-medium text-muted-foreground">
                    Disponível
                  </span>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div>
          <h3 className="text-lg font-semibold">Descrição</h3>
          <p className="text-muted-foreground">
            Camiseta preta de algodão premium, confortável e estilosa para
            qualquer ocasião.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <img
            src={selectedImage}
            alt="Produto"
            className="h-64 w-64 rounded-md shadow-md"
          />

          {/* Miniaturas das imagens */}
          <div className="mt-4 flex gap-2">
            {productImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Imagem ${index + 1}`}
                className={`h-16 w-16 cursor-pointer rounded-md border-2 ${
                  selectedImage === img
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
