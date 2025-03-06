import { useState } from "react";
import {
  DialogContent,
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
import {
  getProducts,
  saveCategory,
  saveProduct,
  saveSubBrand,
} from "@/lib/localStorage";
import { Product } from "@/types/Product";
import { Button } from "@/components/ui/button";

export default function ProductCreateDialog({
  onClose,
  refresh,
}: {
  onClose: () => void;
  refresh: (products: Product[]) => void;
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [subBrand, setSubBrand] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<(File | string)[]>([]);
  const [status, setStatus] = useState<"Disponível" | "Indisponível">(
    "Disponível",
  );

  const handleCreate = () => {
    const imageUrls = images.map((image) =>
      typeof image === "string" ? image : URL.createObjectURL(image),
    ); // Gera URLs temporárias para as imagens

    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9), // Gera um ID aleatório
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

    console.log("Produto criado:", newProduct);

    saveProduct(newProduct);
    saveCategory(category);
    saveSubBrand(subBrand);
    refresh(getProducts());
    onClose();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar Produto</DialogTitle>
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
              <SelectItem value="Disponivel">Disponível</SelectItem>
              <SelectItem value="Indisponivel">Indisponível</SelectItem>
            </SelectContent>
          </Select>
        </Label>
        {/* Categoria - Select */}
        <Label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Categoria</span>
          <Select onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fetish">Fetiche</SelectItem>
              <SelectItem value="vibrators">Vibradores</SelectItem>
              <SelectItem value="dildo">Dildo</SelectItem>
              <SelectItem value="intimatehealth">Saúde íntima</SelectItem>
              <SelectItem value="accessories">Acessórios</SelectItem>
              <SelectItem value="cosmétics">Cosméticos</SelectItem>
            </SelectContent>
          </Select>
        </Label>

        {/* Sub marca - Select */}
        <Label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Sub marca</span>
          <Select onValueChange={setSubBrand}>
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
            initialImages={images}
          />
        </Label>

        <Button onClick={handleCreate}>Adicionar Produto</Button>
      </div>
    </DialogContent>
  );
}
