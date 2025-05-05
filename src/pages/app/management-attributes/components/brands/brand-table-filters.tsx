import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

const brandFiltersSchema = z.object({
  brandId: z.string().optional(),
  brandName: z.string().optional(),
});

type BrandFilters = z.infer<typeof brandFiltersSchema>;

export function BrandTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { register, handleSubmit, reset } = useForm<BrandFilters>({
    resolver: zodResolver(brandFiltersSchema),
    defaultValues: {
      brandId: searchParams.get("brandId") ?? "",
      brandName: searchParams.get("brandName") ?? "",
    },
  });

  function onFilter(data: BrandFilters) {
    setSearchParams((params) => {
      if (data.brandId) params.set("brandId", data.brandId);
      else params.delete("brandId");

      if (data.brandName) params.set("brandName", data.brandName);
      else params.delete("brandName");

      params.set("page", "1");
      return params;
    });
  }

  function onClear() {
    setSearchParams((params) => {
      params.delete("brandId");
      params.delete("brandName");
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
        {...register("brandId")}
        placeholder="Filtrar por ID"
        className="h-8 w-auto"
      />
      <Input
        {...register("brandName")}
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
