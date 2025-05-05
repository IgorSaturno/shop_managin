import { deleteCategory } from "@/api/delete-category";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { toast } from "sonner";

interface CategoryRowProps {
  category: {
    category_id: string;
    category_name: string;
  };
  refresh: () => void;
}

export function CategoryTableRow({ category, refresh }: CategoryRowProps) {
  const queryClient = useQueryClient();

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria removida com sucesso!");
      refresh();
    } catch (error) {
      console.error("Erro ao excluir Categoria:", error);
      toast.error("Erro ao excluir Categoria.");
    }
  };

  return (
    <TableRow>
      <TableCell className="font-mono text-xs font-medium sm:w-[100px]">
        {category.category_id}
      </TableCell>
      <TableCell className="font-medium">{category.category_name}</TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => handleDeleteCategory(category.category_id)}
        >
          <Trash className="mr-2 h-4 w-4" />
          Excluir
        </Button>
      </TableCell>
    </TableRow>
  );
}
