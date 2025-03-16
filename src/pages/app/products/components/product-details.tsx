import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Product } from "@/types/Product";
import { getProducts } from "@/lib/localStorage";

const FALLBACK_IMAGE = "/placeholder-image.svg";

interface ProductDetailsProps {
  productId: string;
}

export function ProductDetails({ productId }: ProductDetailsProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>(""); // Estado para a imagem selecionada

  // Função para buscar e atualizar os detalhes do produto
  const updateProductDetails = () => {
    const products = getProducts();
    const foundProduct = products.find((p) => p.id === productId);
    setProduct(foundProduct || null);
  };

  useEffect(() => {
    updateProductDetails(); // Busca o produto quando o componente é montado

    const handleStorageChange = () => {
      updateProductDetails();
    };

    // Adiciona um listener para o evento 'storage'
    window.addEventListener("storage", handleStorageChange);

    // Adiciona um listener para o evento 'localStorageChange' (custom)
    window.addEventListener("localStorageChange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localStorageChange", handleStorageChange);
    };
  }, [productId]);
  // Atualiza a imagem selecionada quando o produto é carregado
  useEffect(() => {
    if (product) {
      setSelectedImage(product.imageUrl || FALLBACK_IMAGE);
    }
  }, [product]);

  if (!product) return <p>Produto não encontrado.</p>;

  // Filtra imagens válidas (Modificado)
  const productImages = (product?.images || [])
    .filter((img) => typeof img === "string" && img.length > 0)
    .concat(product?.imageUrl || FALLBACK_IMAGE)
    .filter((v, i, a) => a.indexOf(v) === i); // Remove duplicatas

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Produto: {product.name}</DialogTitle>
        <DialogDescription>Detalhes do produto</DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-muted-foreground">ID</TableCell>
              <TableCell className="text-right">{product.id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Categoria</TableCell>
              <TableCell className="text-right">{product.category}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Marca</TableCell>
              <TableCell className="text-right">{product.subBrand}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Tags</TableCell>
              <TableCell className="text-right">
                <div className="flex flex-wrap gap-1">
                  {product.tags?.map((tag) => (
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
              <TableCell className="text-right">R$ {product.price}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Estoque</TableCell>
              <TableCell className="text-right">
                {product.stock} unidades
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Status</TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      product.status === "Disponível"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="font-medium text-muted-foreground">
                    {product.status}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div>
          <h3 className="text-lg font-semibold">Descrição</h3>
          <p className="text-muted-foreground">{product.description}</p>
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
            {productImages.map((img, index) => (
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
    </DialogContent>
  );
}
