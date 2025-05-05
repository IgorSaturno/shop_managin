import { deleteBrand } from "@/api/delete-brand";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { toast } from "sonner";

interface BrandRowProps {
  brand: {
    brand_id: string;
    brand_name: string;
  };
  refresh: () => void;
}

export function BrandTableRow({ brand, refresh }: BrandRowProps) {
  const queryClient = useQueryClient();

  const handleDeleteBrand = async (brandId: string) => {
    try {
      await deleteBrand(brandId);
      await queryClient.invalidateQueries({ queryKey: ["brands"] });
      toast.success("Marca removida com sucesso!");
      refresh();
    } catch (error) {
      console.error("Erro ao excluir Marca:", error);
      toast.error("Erro ao excluir Marca.");
    }
  };

  return (
    <TableRow>
      <TableCell className="font-mono text-xs font-medium sm:w-[100px]">
        {brand.brand_id}
      </TableCell>
      <TableCell className="font-medium">{brand.brand_name}</TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => handleDeleteBrand(brand.brand_id)}
        >
          <Trash className="mr-2 h-4 w-4" />
          Excluir
        </Button>
      </TableCell>
    </TableRow>
  );
}
