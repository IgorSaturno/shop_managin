import { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateProduct } from "@/lib/localStorage";
import { Product } from "@/types/Product";
import { ImageUpload } from "@/components/ImageUpload";

interface ProductEditDetailsProps {
  product: Product;
  onClose: () => void;
}

export default function ProductEditDetails({
  product,
  onClose,
}: ProductEditDetailsProps) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [stock, setStock] = useState(product.stock.toString());
  const [category, setCategory] = useState(product.category);
  const [subBrand, setSubBrand] = useState(product.subBrand);
  const [description, setDescription] = useState(product.description);
  const [images, setImages] = useState<(File | string)[]>(
    product.images || [product.imageUrl],
  ); // Estado para as imagens
  const [status, setStatus] = useState<"Disponível" | "Indisponível">(
    product.status,
  );

  const handleSave = () => {
    const imageUrls = images.map((image) =>
      typeof image === "string" ? image : URL.createObjectURL(image),
    ); // Gera URLs temporárias para as imagens

    const updatedProduct: Product = {
      ...product,
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      subBrand,
      description,
      imageUrl: imageUrls[0] || "https://via.placeholder.com/150", // Usa a primeira imagem ou uma imagem padrão
      images: imageUrls, // Inclui todas as imagens no array
      status,
    };

    updateProduct(updatedProduct); // Atualiza o produto no localStorage
    onClose(); // Fecha o modal
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar Produto</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <Label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Nome do Produto</span>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Label>

        <Label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Preço</span>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Label>

        <Label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Estoque</span>
          <Input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </Label>

        <Label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Status</span>
          <Select
            value={status}
            onValueChange={(value: "Disponível" | "Indisponível") =>
              setStatus(value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Disponível">Disponível</SelectItem>
              <SelectItem value="Indisponível">Indisponível</SelectItem>
            </SelectContent>
          </Select>
        </Label>

        <Label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Categoria</span>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fetish">Fetiche</SelectItem>
              <SelectItem value="vibrators">Vibradores</SelectItem>
              <SelectItem value="dildo">Dildo</SelectItem>
              <SelectItem value="intimatehealth">Saúde íntima</SelectItem>
              <SelectItem value="accessories">Acessórios</SelectItem>
              <SelectItem value="cosmetics">Cosméticos</SelectItem>
            </SelectContent>
          </Select>
        </Label>

        <Label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Sub marca</span>
          <Select value={subBrand} onValueChange={setSubBrand}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a sub marca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asos">ásos</SelectItem>
              <SelectItem value="biosex">BioSex</SelectItem>
              <SelectItem value="dermosex">Dermosex</SelectItem>
              <SelectItem value="femme">Femme</SelectItem>
              <SelectItem value="govibes">Go Vibes</SelectItem>
              <SelectItem value="goplay">Go Play</SelectItem>
              <SelectItem value="hotsentidos">Hot Sentidos</SelectItem>
              <SelectItem value="ingrid">Igrid Guimarães</SelectItem>
              <SelectItem value="lubrisex">Lubrisex</SelectItem>
              <SelectItem value="seduction">Seduction</SelectItem>
              <SelectItem value="sensevibe">Sensevibe</SelectItem>
              <SelectItem value="sweetvibe">Sweet Vibe</SelectItem>
              <SelectItem value="sexcleaner">SexCleaner</SelectItem>
              <SelectItem value="thesecret">The Secret</SelectItem>
            </SelectContent>
          </Select>
        </Label>

        <Label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Descrição</span>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Digite a descrição do produto..."
            className="min-h-[100px]"
          />
        </Label>

        <Label className="flex flex-col gap-2">
          <span className="text-sm font-medium">
            Imagens do Produto (Máx. 4)
          </span>
          <ImageUpload
            onUpload={(files) => {
              const newImages = [...images, ...files].slice(0, 4); // Limita a 4 imagens
              setImages(newImages);
            }}
            onRemove={(index) => {
              const newImages = images.filter((_, i) => i !== index); // Remove a imagem pelo índice
              setImages(newImages);
            }}
            initialImages={images} // Passa as imagens atuais
          />
        </Label>

        <Button onClick={handleSave}>Salvar Alterações</Button>
      </div>
    </DialogContent>
  );
}
