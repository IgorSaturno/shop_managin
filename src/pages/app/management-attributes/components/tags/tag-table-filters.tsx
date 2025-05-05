import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

const tagFiltersSchema = z.object({
  tagId: z.string().optional(),
  tagName: z.string().optional(),
});

type TagFilters = z.infer<typeof tagFiltersSchema>;

export function TagTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { register, handleSubmit, reset } = useForm<TagFilters>({
    resolver: zodResolver(tagFiltersSchema),
    defaultValues: {
      tagId: searchParams.get("tagId") ?? "",
      tagName: searchParams.get("tagName") ?? "",
    },
  });

  function onFilter(data: TagFilters) {
    setSearchParams((params) => {
      if (data.tagId) params.set("tagId", data.tagId);
      else params.delete("tagId");

      if (data.tagName) params.set("tagName", data.tagName);
      else params.delete("tagName");

      params.set("page", "1");
      return params;
    });
  }

  function onClear() {
    setSearchParams((params) => {
      params.delete("tagId");
      params.delete("tagName");
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
        {...register("tagId")}
        placeholder="Filtrar por ID"
        className="h-8 w-auto"
      />
      <Input
        {...register("tagName")}
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
