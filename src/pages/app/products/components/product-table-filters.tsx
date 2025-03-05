import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProductTableFilters() {
  return (
    <form className="flex items-center gap-2">
      <span className="text-sm font-semibold">Filtros:</span>
      <Input placeholder="ID do produto" className="h-8 w-auto" />
      <Input placeholder="Nome do produto" className="h-8 w-[320px]" />
      <Select defaultValue="all">
        <SelectTrigger className="h-8 w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas categorias</SelectItem>
          <SelectItem value="fetish">Fetiche</SelectItem>
          <SelectItem value="vibrators">Vibradores</SelectItem>
          <SelectItem value="dildo">Dildo</SelectItem>
          <SelectItem value="intimatehealth">Saúde íntima</SelectItem>
          <SelectItem value="accessories">Acessórios</SelectItem>
          <SelectItem value="cosmétics">Cosméticos</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="all">
        <SelectTrigger className="h-8 w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as marcas</SelectItem>
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

      <Button type="submit" variant="secondary" size="xs">
        <Search className="mr-2 h-4 w-4" />
        Filtrar resultados
      </Button>
      <Button type="button" variant="outline" size="xs">
        <X className="mr-2 h-4 w-4" />
        Remover filtros
      </Button>
    </form>
  );
}
