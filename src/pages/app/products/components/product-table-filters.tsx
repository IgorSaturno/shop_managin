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
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { saveCategory, saveSubBrand } from "@/lib/localStorage";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { TagsInput } from "@/components/TagsInput";

export function ProductTableFilters({
  onFilter,
  categories,
  setCategories,
  subBrands,
  setSubBrands,
}: {
  onFilter: (filters: {
    id: string;
    name: string;
    category: string;
    subBrand: string;
    status: string;
    tags: string[];
  }) => void;
  categories: string[];
  setCategories: (categories: string[]) => void;
  subBrands: string[];
  setSubBrands: (subBrands: string[]) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubBrand, setSelectedSubBrand] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubBrandModalOpen, setIsSubBrandModalOpen] = useState(false);

  const [newCategory, setNewCategory] = useState("");
  const [newSubBrand, setNewSubBrand] = useState("");

  const [idFilter, setIdFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Atualiza filtros quando qualquer valor muda
  useEffect(() => {
    handleFilter();
  }, [selectedCategory, selectedSubBrand, selectedStatus]);

  const addCategory = () => {
    const trimmedCategory = newCategory.trim();

    if (!trimmedCategory) {
      toast.warning("Digite um nome para a categoria");
      return;
    }

    if (categories.includes(trimmedCategory)) {
      toast.warning("Esta categoria já existe");
      return;
    }

    try {
      const updatedCategories = [...categories, trimmedCategory];
      setCategories(updatedCategories);
      saveCategory(trimmedCategory);
      setNewCategory("");
      toast.success("Categoria adicionada com sucesso");
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
      toast.error("Falha ao adicionar categoria");
    }
  };

  const removeCategory = (category: string) => {
    try {
      const updatedCategories = categories.filter((c) => c !== category);
      setCategories(updatedCategories);
      localStorage.setItem("categories", JSON.stringify(updatedCategories));

      // Atualiza filtro se a categoria removida estava selecionada
      if (selectedCategory === category) {
        setSelectedCategory("all");
        onFilter({ ...getCurrentFilters(), category: "all" });
      }

      toast.success("Categoria removida");
    } catch (error) {
      console.error("Erro ao remover categoria:", error);
      toast.error("Falha ao remover categoria");
    }
  };

  const addSubBrand = () => {
    const trimmedSubBrand = newSubBrand.trim();

    if (!trimmedSubBrand) {
      toast.warning("Digite um nome para a marca");
      return;
    }

    if (subBrands.includes(trimmedSubBrand)) {
      toast.warning("Esta marca já existe");
      return;
    }

    try {
      const updatedSubBrands = [...subBrands, trimmedSubBrand];
      setSubBrands(updatedSubBrands);
      saveSubBrand(trimmedSubBrand);
      setNewSubBrand("");
      toast.success("Marca adicionada com sucesso");
    } catch (error) {
      console.error("Erro ao adicionar marca:", error);
      toast.error("Falha ao adicionar marca");
    }
  };

  const removeSubBrand = (subBrand: string) => {
    try {
      const updatedSubBrands = subBrands.filter((sb) => sb !== subBrand);
      setSubBrands(updatedSubBrands);
      localStorage.setItem("subBrands", JSON.stringify(updatedSubBrands));

      // Atualiza filtro se a marca removida estava selecionada
      if (selectedSubBrand === subBrand) {
        setSelectedSubBrand("all");
        onFilter({ ...getCurrentFilters(), subBrand: "all" });
      }

      toast.success("Marca removida");
    } catch (error) {
      console.error("Erro ao remover marca:", error);
      toast.error("Falha ao remover marca");
    }
  };

  const getCurrentFilters = () => ({
    id: idFilter,
    name: nameFilter,
    category: selectedCategory,
    subBrand: selectedSubBrand,
    status: selectedStatus,
    tags: selectedTags,
  });

  const handleFilter = () => {
    onFilter(getCurrentFilters());
  };

  const handleClearFilters = () => {
    setIdFilter("");
    setNameFilter("");
    setSelectedCategory("all");
    setSelectedSubBrand("all");
    setSelectedStatus("all");
    onFilter({
      id: "",
      name: "",
      category: "all",
      subBrand: "all",
      status: "all",
      tags: [],
    });
    toast.success("Filtros resetados");
  };

  return (
    <form
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        handleFilter();
      }}
    >
      <span className="text-sm font-semibold">Filtros:</span>

      <div className="grid grid-cols-1 gap-2 sm:flex sm:items-center sm:gap-2">
        {/* Filtro por ID */}
        <Input
          placeholder="ID do produto"
          className="h-8 w-full sm:w-[120px]"
          value={idFilter}
          onChange={(e) => setIdFilter(e.target.value)}
        />

        {/* Filtro por Nome */}
        <Input
          placeholder="Nome do produto"
          className="h-8 w-full sm:w-[180px]"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />

        <TagsInput initialTags={selectedTags} onTagsChange={setSelectedTags} />

        {/* Filtro por Categoria */}
        <div className="flex gap-2">
          <Select
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value)}
          >
            <SelectTrigger className="h-8 w-full sm:w-[180px]">
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              {categories
                .filter((cat) => cat.trim() !== "")
                .map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => setIsCategoryModalOpen(true)}
          >
            Gerenciar
          </Button>
        </div>

        {/* Filtro por Submarca */}
        <div className="flex gap-2">
          <Select
            value={selectedSubBrand}
            onValueChange={(value) => setSelectedSubBrand(value)}
          >
            <SelectTrigger className="h-8 w-full sm:w-[180px]">
              <SelectValue placeholder="Selecione a marca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as marcas</SelectItem>
              {subBrands
                .filter((sb) => sb.trim() !== "")
                .map((subBrand) => (
                  <SelectItem key={subBrand} value={subBrand}>
                    {subBrand}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => setIsSubBrandModalOpen(true)}
          >
            Gerenciar
          </Button>
        </div>

        {/* Filtro por Status */}
        <Select
          value={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value)}
        >
          <SelectTrigger className="h-8 w-full sm:w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Disponível">Disponível</SelectItem>
            <SelectItem value="Indisponível">Indisponível</SelectItem>
          </SelectContent>
        </Select>
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

      {/* Modal para Categorias */}
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
            {categories.map((category) => (
              <div
                key={category}
                className="flex items-center justify-between rounded p-2 hover:bg-muted"
              >
                <span className="text-sm">{category}</span>
                <Button
                  variant="ghost"
                  onClick={() => removeCategory(category)}
                >
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

      {/* Modal para Submarcas */}
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
            {subBrands.map((subBrand) => (
              <div
                key={subBrand}
                className="flex items-center justify-between rounded p-2 hover:bg-muted"
              >
                <span className="text-sm">{subBrand}</span>
                <Button
                  variant="ghost"
                  onClick={() => removeSubBrand(subBrand)}
                >
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
