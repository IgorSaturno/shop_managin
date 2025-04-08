import { useState, useEffect, useMemo, useCallback } from "react";
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { TagsInput } from "@/components/TagsInput";
import { updateProduct } from "@/api/update-product";

interface ProductEditDetailsProps {
  product: {
    productId: string;
    productName: string;
    description: string;
    priceInCents: number;
    status: "available" | "unavailable" | "archived";
    stock: number;
    categoryId: string;
    brandId: string;
    tags?: string[];
    images: string[];
  };
  onClose: () => void;
  refresh: () => void;
}

export default function ProductEditDetails({
  product,
  onClose,
  refresh,
}: ProductEditDetailsProps) {
  // 1. Memoize valores iniciais para evitar recriação desnecessária
  const initialImages = useMemo(() => product.images, [product.images]);
  const initialTags = useMemo(() => product.tags || [], [product.tags]);

  // 2. Estados com inicialização segura
  const [editedProduct, setEditedProduct] = useState({
    productId: product.productId,
    productName: product.productName,
    description: product.description,
    price: product.priceInCents / 100, // Conversão para decimal
    stock: product.stock,
    status: product.status,
    categoryId: product.categoryId,
    brandId: product.brandId,
  });

  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [brands, setBrands] = useState<{ value: string; label: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editedTags, setEditedTags] = useState<string[]>(initialTags);
  const [editedImages, setEditedImages] = useState<string[]>(initialImages);

  // 3. Carregamento otimizado de dados
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/brands"),
        ]);

        const [categoriesData, brandsData] = await Promise.all([
          categoriesRes.json(),
          brandsRes.json(),
        ]);

        // Ordenar dados para consistência
        setCategories(
          categoriesData.sort((a, b) => a.label.localeCompare(b.label)),
        );
        setBrands(brandsData.sort((a, b) => a.label.localeCompare(b.label)));
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Falha ao carregar dados de configuração");
      }
    };

    loadData();
  }, []); // Executa apenas uma vez

  // 4. Callback memoizado para atualização de imagens
  const handleImageUpdate = useCallback((newImages: string[]) => {
    setEditedImages((prev) => {
      // Comparação profunda para evitar atualizações desnecessárias
      return JSON.stringify(prev) === JSON.stringify(newImages)
        ? prev
        : newImages;
    });
  }, []);

  // 5. Validação de campos
  const validateFields = (): boolean => {
    const errors = [];
    if (!editedProduct.productName.trim()) errors.push("Nome é obrigatório");
    if (editedProduct.price < 0) errors.push("Preço inválido");
    if (editedProduct.stock < 0) errors.push("Estoque inválido");

    if (errors.length > 0) {
      toast.error(errors.join("\n"));
      return false;
    }
    return true;
  };

  // 6. Lógica de salvamento
  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      setIsLoading(true);

      await updateProduct({
        id: editedProduct.productId,
        name: editedProduct.productName,
        description: editedProduct.description,
        price: editedProduct.price,
        stock: editedProduct.stock,
        status: editedProduct.status,
        categoryId: editedProduct.categoryId,
        brandId: editedProduct.brandId,
        tags: editedTags,
        images: editedImages,
      });

      refresh();
      toast.success("Produto atualizado!");
      onClose();
    } catch (error) {
      console.error("Erro detalhado:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar";
      toast.error(errorMessage);
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
            value={editedProduct.productName}
            onChange={(e) =>
              setEditedProduct({
                ...editedProduct,
                productName: e.target.value,
              })
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
            onValueChange={(value: "available" | "unavailable" | "archived") =>
              setEditedProduct({ ...editedProduct, status: value })
            }
          >
            <SelectTrigger id="productStatus">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Disponível</SelectItem>
              <SelectItem value="unavailable">Indisponível</SelectItem>
              <SelectItem value="archived">Arquivado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Categoria e Marca */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="productCategory">Categoria</Label>
            <Select
              value={editedProduct.categoryId}
              onValueChange={(value) =>
                setEditedProduct({ ...editedProduct, categoryId: value })
              }
            >
              <SelectTrigger id="productCategory">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="productBrand">Marca</Label>
            <Select
              value={editedProduct.brandId}
              onValueChange={(value) =>
                setEditedProduct({ ...editedProduct, brandId: value })
              }
            >
              <SelectTrigger id="productBrand">
                <SelectValue placeholder="Selecione a marca" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.value} value={brand.value}>
                    {brand.label}
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

        {/* Tags */}
        <div className="space-y-1">
          <Label>Tags</Label>
          <TagsInput initialTags={editedTags} onTagsChange={setEditedTags} />
        </div>

        {/* Upload de Imagens */}
        <div className="space-y-1">
          <Label>Imagens do Produto (Máx. 4)</Label>
          <ImageUpload
            initialImages={editedImages}
            onImagesChange={handleImageUpdate}
            maxImages={4}
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
