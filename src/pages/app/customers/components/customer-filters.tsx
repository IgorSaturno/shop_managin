import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

export function CustomerFilters() {
  return (
    <form className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-2">
      <span className="text-sm font-semibold">Filtros:</span>

      <div className="grid grid-cols-1 gap-2 sm:flex sm:items-center sm:gap-2">
        <Input
          placeholder="ID do cliente"
          className="h-8 w-full sm:w-[120px]"
        />
        <Input placeholder="Email" className="h-8 w-full sm:w-[200px]" />
        <Input placeholder="Telefone" className="h-8 w-full sm:w-[180px]" />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
          <Button
            type="button"
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
          >
            <X className="mr-2 h-4 w-4" />
            Limpar Tudo
          </Button>
        </div>
      </div>
    </form>
  );
}
