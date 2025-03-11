import { useState, useEffect } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/ImageUpload";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/types/Product";
import { Button } from "@/components/ui/button";
import {
  updateProduct,
  getProducts,
  getCategories,
  getSubBrands,
} from "@/lib/localStorage";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ProductEditDetailsProps {
  product: Product;
  onClose: () => void;
  refresh: (products: Product[]) => void;
}

export default function ProductEditDetails({
  product,
  onClose,
  refresh,
}: ProductEditDetailsProps) {
  const [editedProduct, setEditedProduct] = useState<Product>({ ...product });
  const [editedImages, setEditedImages] = useState<(File | string)[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [subBrands, setSubBrands] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Inicialização dos estados
  useEffect(() => {
    setEditedProduct({ ...product });
    setEditedImages([...product.images]);
    setCategories(getCategories());
    setSubBrands(getSubBrands());
  }, [product]);

  // Conversão de arquivo para Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Atualização de imagens
  const handleImageUpdate = async (files: (File | string)[]) => {
    try {
      setIsLoading(true);

      const processedImages = await Promise.all(
        files.map(async (img) => {
          if (typeof img === "string") return img; // Mantém Base64 existentes

          // Converte novos arquivos para Base64
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(img);
          });
        }),
      );

      setEditedImages(processedImages);
    } catch (error) {
      toast.error("Erro ao processar imagens");
    } finally {
      setIsLoading(false);
    }
  };

  // Validação de campos
  const validateFields = (): boolean => {
    if (!editedProduct.name.trim()) {
      toast.error("Nome do produto é obrigatório");
      return false;
    }

    if (isNaN(editedProduct.price)) {
      toast.error("Preço inválido");
      return false;
    }

    if (editedProduct.price < 0) {
      toast.error("O preço não pode ser negativo");
      return false;
    }

    if (isNaN(editedProduct.stock)) {
      toast.error("Estoque inválido");
      return false;
    }

    if (editedProduct.stock < 0) {
      toast.error("O estoque não pode ser negativo");
      return false;
    }

    return true;
  };

  // Salvamento das alterações
  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      setIsLoading(true);

      // Processamento final das imagens
      const processedImages = await Promise.all(
        editedImages.map(async (img) => {
          if (typeof img === "string") return img;
          return await fileToBase64(img);
        }),
      );

      const updatedProduct: Product = {
        ...editedProduct,
        price: Number(editedProduct.price),
        stock: Number(editedProduct.stock),
        images: processedImages,
        imageUrl: processedImages[0] || "https://via.placeholder.com/150",
        category: editedProduct.category.trim() || "Sem categoria",
        subBrand: editedProduct.subBrand.trim() || "Sem marca",
      };

      updateProduct(updatedProduct);
      refresh(getProducts());
      toast.success("Produto atualizado com sucesso");
      onClose();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Falha ao atualizar produto");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Editar Produto</DialogTitle>
        <DialogDescription>
          Faça as alterações necessárias nos campos abaixo
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {/* Campo Nome */}
        <div className="space-y-1">
          <Label htmlFor="productName">Nome do Produto</Label>
          <Input
            id="productName"
            value={editedProduct.name}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, name: e.target.value })
            }
          />
        </div>

        {/* Preço e Estoque */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="productPrice">Preço (R$)</Label>
            <Input
              id="productPrice"
              type="number"
              min="0"
              step="0.01"
              value={editedProduct.price}
              onChange={(e) =>
                setEditedProduct({
                  ...editedProduct,
                  price: Number(e.target.value),
                })
              }
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="productStock">Estoque</Label>
            <Input
              id="productStock"
              type="number"
              min="0"
              value={editedProduct.stock}
              onChange={(e) =>
                setEditedProduct({
                  ...editedProduct,
                  stock: Number(e.target.value),
                })
              }
            />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-1">
          <Label htmlFor="productStatus">Status</Label>
          <Select
            value={editedProduct.status}
            onValueChange={(value: "Disponível" | "Indisponível") =>
              setEditedProduct({ ...editedProduct, status: value })
            }
          >
            <SelectTrigger id="productStatus">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Disponível">Disponível</SelectItem>
              <SelectItem value="Indisponível">Indisponível</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Categoria e Submarca */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="productCategory">Categoria</Label>
            <Select
              value={editedProduct.category}
              onValueChange={(value) =>
                setEditedProduct({ ...editedProduct, category: value })
              }
            >
              <SelectTrigger id="productCategory">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="productSubBrand">Sub Marca</Label>
            <Select
              value={editedProduct.subBrand}
              onValueChange={(value) =>
                setEditedProduct({ ...editedProduct, subBrand: value })
              }
            >
              <SelectTrigger id="productSubBrand">
                <SelectValue placeholder="Selecione a sub marca" />
              </SelectTrigger>
              <SelectContent>
                {subBrands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Descrição */}
        <div className="space-y-1">
          <Label htmlFor="productDescription">Descrição</Label>
          <Textarea
            id="productDescription"
            value={editedProduct.description}
            onChange={(e) =>
              setEditedProduct({
                ...editedProduct,
                description: e.target.value,
              })
            }
            className="min-h-[100px]"
          />
        </div>

        {/* Upload de Imagens */}
        <div className="space-y-1">
          <Label>Imagens do Produto (Máx. 4)</Label>
          <ImageUpload
            onUpload={handleImageUpdate}
            onRemove={(index) => {
              setEditedImages((prev) => prev.filter((_, i) => i !== index));
            }}
            initialImages={editedImages}
            disabled={isLoading}
          />
        </div>

        {/* Botões de Ação */}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
