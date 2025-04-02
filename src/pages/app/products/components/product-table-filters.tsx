import { Search, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { z } from "zod";
import { useSearchParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const productFiltersSchema = z.object({
  productId: z.string().optional(),
  productName: z.string().optional(),
  tags: z.string().optional(),
  status: z.string().optional(),
  category: z.string().optional(),
  subBrand: z.string().optional(),
});

type ProductFiltersSchema = z.infer<typeof productFiltersSchema>;

export function ProductTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const productId = searchParams.get("productId") || "";
  const productName = searchParams.get("productName") || "";
  const tagsParam = searchParams.get("tags") || "";
  const statusParam = searchParams.get("status") || "all";
  const categoryParam = searchParams.get("category") || "all";
  const subBrandParam = searchParams.get("subBrand") || "all";

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubBrandModalOpen, setIsSubBrandModalOpen] = useState(false);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);

  const [newCategory, setNewCategory] = useState("");
  const [newSubBrand, setNewSubBrand] = useState("");
  const [newTag, setNewTag] = useState("");
  const [categories, setCategories] = useState<string[]>([
    "Eletrônicos",
    "Roupas",
    "Livros",
  ]);
  const [subBrands, setSubBrands] = useState<string[]>(["Marca A", "Marca B"]);
  const [tags, setTags] = useState<string[]>(["Promoção", "Lançamento"]);

  const { register, handleSubmit, control, reset } =
    useForm<ProductFiltersSchema>({
      resolver: zodResolver(productFiltersSchema),
      defaultValues: {
        productId,
        productName,
        tags: tagsParam,
        status: statusParam,
        category: categoryParam,
        subBrand: subBrandParam,
      },
    });

  function handleFilter({
    productId,
    productName,
    tags,
    status,
    category,
    subBrand,
  }: ProductFiltersSchema) {
    setSearchParams((state) => {
      if (productId) {
        state.set("productId", productId);
      } else {
        state.delete("productId");
      }
      if (productName) {
        state.set("productName", productName);
      } else {
        state.delete("productName");
      }
      if (tags) {
        state.set("tags", tags);
      } else {
        state.delete("tags");
      }
      if (status && status !== "all") {
        state.set("status", status);
      } else {
        state.delete("status");
      }
      if (category && category !== "all") {
        state.set("category", category);
      } else {
        state.delete("category");
      }
      if (subBrand && subBrand !== "all") {
        state.set("subBrand", subBrand);
      } else {
        state.delete("subBrand");
      }
      state.set("page", "1");
      return state;
    });
  }

  function handleClearFilters() {
    setSearchParams((state) => {
      state.delete("productId");
      state.delete("productName");
      state.delete("tags");
      state.delete("status");
      state.delete("category");
      state.delete("subBrand");
      state.set("page", "1");
      return state;
    });
    reset({
      productId: "",
      productName: "",
      tags: "",
      status: "all",
      category: "all",
      subBrand: "all",
    });
    toast.success("Filtros resetados");
  }

  const addCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) {
      toast.warning("Digite um nome para a categoria");
      return;
    }
    if (categories.includes(trimmed)) {
      toast.warning("Esta categoria já existe");
      return;
    }
    setCategories((prev) => [...prev, trimmed]);
    setNewCategory("");
    toast.success("Categoria adicionada com sucesso");
  };

  const removeCategory = (cat: string) => {
    setCategories((prev) => prev.filter((c) => c !== cat));
    toast.success("Categoria removida");
  };

  const addSubBrand = () => {
    const trimmed = newSubBrand.trim();
    if (!trimmed) {
      toast.warning("Digite um nome para a marca");
      return;
    }
    if (subBrands.includes(trimmed)) {
      toast.warning("Esta marca já existe");
      return;
    }
    setSubBrands((prev) => [...prev, trimmed]);
    setNewSubBrand("");
    toast.success("Marca adicionada com sucesso");
  };

  const removeSubBrand = (sb: string) => {
    setSubBrands((prev) => prev.filter((s) => s !== sb));
    toast.success("Marca removida");
  };

  const addTag = () => {
    const trimmed = newTag.trim().toLowerCase();
    if (!trimmed) {
      toast.warning("Digite um nome para a tag");
      return;
    }
    if (tags.includes(trimmed)) {
      toast.warning("Esta tag já existe");
      return;
    }
    setTags((prev) => [...prev, trimmed]);
    setNewTag("");
    toast.success("Tag adicionada com sucesso");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
    toast.success("Tag removida");
  };

  return (
    <form
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-2"
      onSubmit={handleSubmit(handleFilter)}
    >
      <span className="text-sm font-semibold">Filtros:</span>

      <div className="grid grid-cols-1 gap-2 sm:flex sm:items-center sm:gap-2">
        <Input
          placeholder="ID do produto"
          className="h-8 w-full"
          {...register("productId")}
        />
        <Input
          placeholder="Nome do produto"
          className="h-8 w-full"
          {...register("productName")}
        />
        <Input
          placeholder="Tags associadas"
          className="h-8 w-full"
          {...register("tags")}
        />

        <Controller
          name="status"
          control={control}
          render={({ field: { name, onChange, value, disabled } }) => (
            <Select
              defaultValue="all"
              name={name}
              onValueChange={onChange}
              value={value}
              disabled={disabled}
            >
              <SelectTrigger className="h-8 w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        <div className="flex gap-2">
          <Controller
            name="category"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="h-8 w-full sm:w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas categorias</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => setIsCategoryModalOpen(true)}
          >
            Gerenciar
          </Button>
        </div>

        <div className="flex gap-2">
          <Controller
            name="subBrand"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="h-8 w-full sm:w-[180px]">
                  <SelectValue placeholder="Marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as marcas</SelectItem>
                  {subBrands.map((sb) => (
                    <SelectItem key={sb} value={sb}>
                      {sb}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => setIsSubBrandModalOpen(true)}
          >
            Gerenciar
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
        <Button
          type="submit"
          variant="secondary"
          size="xs"
          className="w-full sm:w-auto"
        >
          <Search className="mr-2 h-4 w-4" />
          Aplicar Filtros
        </Button>
        <Button
          type="button"
          variant="outline"
          size="xs"
          className="w-full sm:w-auto"
          onClick={handleClearFilters}
        >
          <X className="mr-2 h-4 w-4" />
          Limpar Tudo
        </Button>
      </div>

      <Dialog open={isTagsModalOpen} onOpenChange={setIsTagsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Tags</DialogTitle>
            <DialogDescription>
              Crie e gerencie tags para classificação
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Input
              placeholder="Nova tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTag()}
            />
            <Button onClick={addTag}>Adicionar</Button>
          </div>
          <div className="mt-4 max-h-60 space-y-2 overflow-y-auto">
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center justify-between rounded p-2 hover:bg-muted"
              >
                <span className="text-sm">{tag}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTag(tag)}
                >
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            {tags.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">
                Nenhuma tag cadastrada
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Categorias</DialogTitle>
            <DialogDescription>
              Adicione ou remova categorias disponíveis
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Input
              placeholder="Nova categoria"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
            />
            <Button onClick={addCategory}>Adicionar</Button>
          </div>
          <div className="mt-4 max-h-60 space-y-2 overflow-y-auto">
            {categories.map((cat) => (
              <div
                key={cat}
                className="flex items-center justify-between rounded p-2 hover:bg-muted"
              >
                <span className="text-sm">{cat}</span>
                <Button variant="ghost" onClick={() => removeCategory(cat)}>
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">
                Nenhuma categoria cadastrada
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSubBrandModalOpen} onOpenChange={setIsSubBrandModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Marcas</DialogTitle>
            <DialogDescription>
              Adicione ou remova marcas disponíveis
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Input
              placeholder="Nova marca"
              value={newSubBrand}
              onChange={(e) => setNewSubBrand(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSubBrand()}
            />
            <Button onClick={addSubBrand}>Adicionar</Button>
          </div>
          <div className="mt-4 max-h-60 space-y-2 overflow-y-auto">
            {subBrands.map((sb) => (
              <div
                key={sb}
                className="flex items-center justify-between rounded p-2 hover:bg-muted"
              >
                <span className="text-sm">{sb}</span>
                <Button variant="ghost" onClick={() => removeSubBrand(sb)}>
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            {subBrands.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">
                Nenhuma marca cadastrada
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
}
