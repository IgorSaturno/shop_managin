import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

const categoryFiltersSchema = z.object({
  categoryId: z.string().optional(),
  categoryName: z.string().optional(),
});

type CategoryFilters = z.infer<typeof categoryFiltersSchema>;

export function CategoryTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { register, handleSubmit, reset } = useForm<CategoryFilters>({
    resolver: zodResolver(categoryFiltersSchema),
    defaultValues: {
      categoryId: searchParams.get("categoryId") ?? "",
      categoryName: searchParams.get("categoryName") ?? "",
    },
  });

  function onFilter(data: CategoryFilters) {
    setSearchParams((params) => {
      if (data.categoryId) params.set("categoryId", data.categoryId);
      else params.delete("categoryId");

      if (data.categoryName) params.set("categoryName", data.categoryName);
      else params.delete("categoryName");

      params.set("page", "1");
      return params;
    });
  }

  function onClear() {
    setSearchParams((params) => {
      params.delete("categoryId");
      params.delete("categoryName");
      params.set("page", "1");
      return params;
    });
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onFilter)}
      className="flex flex-col items-center gap-2 sm:flex-row"
    >
      <Input
        {...register("categoryId")}
        placeholder="Filtrar por ID"
        className="h-8 w-auto"
      />
      <Input
        {...register("categoryName")}
        placeholder="Filtrar por nome"
        className="h-8 w-auto"
      />
      <Button
        type="submit"
        size="xs"
        variant="secondary"
        className="flex items-center gap-1"
      >
        <Search className="h-4 w-4" /> Filtrar
      </Button>
      <Button
        type="button"
        size="xs"
        variant="outline"
        className="flex items-center gap-1"
        onClick={onClear}
      >
        <X className="h-4 w-4" /> Limpar
      </Button>
    </form>
  );
}
