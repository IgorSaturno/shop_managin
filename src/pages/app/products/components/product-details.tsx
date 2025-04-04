import { GetProductDetails } from "@/api/get-product-details";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const FALLBACK_IMAGE = "/placeholder-image.svg";

export interface ProductDetailsProps {
  productId: string;
  open: boolean;
}

export function ProductDetails({ productId, open }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState<string>(FALLBACK_IMAGE);

  const { data: product } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => GetProductDetails({ productId }),
    enabled: open,
  });

  useEffect(() => {
    if (product && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    } else {
      setSelectedImage(FALLBACK_IMAGE);
    }
  }, [product]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Produto: {product?.productName}</DialogTitle>
        <DialogDescription>Detalhes do produto</DialogDescription>
      </DialogHeader>

      {product && (
        <div className="space-y-6">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="text-muted-foreground">ID</TableCell>
                <TableCell className="text-right">{productId}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Categoria
                </TableCell>
                <TableCell className="text-right">
                  {product?.category}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Marca</TableCell>
                <TableCell className="text-right">
                  {product?.subBrand}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Tags</TableCell>
                <TableCell className="text-right">
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
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Preço</TableCell>
                <TableCell className="text-right">
                  {(product?.priceInCents / 100).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Estoque</TableCell>
                <TableCell className="text-right">
                  {product?.stock} unidades
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Criado há
                </TableCell>
                <TableCell className="text-right">
                  {product?.stock} unidades
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Status</TableCell>
                <TableCell className="flex justify-end">
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
                      {product?.status}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div>
            <h3 className="text-lg font-semibold">Descrição</h3>
            <p className="text-muted-foreground">{product?.description}</p>
          </div>

          <div className="flex flex-col items-center">
            <img
              src={selectedImage}
              alt="Produto"
              className="h-64 w-64 rounded-md object-cover shadow-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                (e.target as HTMLImageElement).onerror = null;
              }}
            />

            {/* Miniaturas das imagens */}
            <div className="mt-4 flex gap-2">
              {product?.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Imagem ${index + 1}`}
                  className={`h-16 w-16 cursor-pointer rounded-md border-2 object-cover ${
                    selectedImage === img
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(img)}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                    (e.target as HTMLImageElement).onerror = null;
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </DialogContent>
  );
}
