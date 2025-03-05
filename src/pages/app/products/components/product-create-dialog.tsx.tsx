import { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
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

export default function ProductCreateDialog({
  onClose,
}: {
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [subBrand, setSubBrand] = useState("");
  const [description, setDescription] = useState("");

  const [images, setImages] = useState<File[]>([]);

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;

    const newImages = Array.from(files).slice(0, 4 - images.length); // Limita a 4 imagens
    setImages((prev) => [...prev, ...newImages]);
  }

  function handleRemoveImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function handleCreate() {
    console.log("Novo produto:", {
      name,
      price,
      stock,
      category,
      subBrand,
      images,
    });
    onClose(); // Fecha o modal após salvar
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar Produto</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <Label className="flex flex-col gap-2">
          <span className="text-sm font-medium">ID Identificador</span>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Label>

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

        <ImageUpload onUpload={setImages} />
      </div>
    </DialogContent>
  );
}
