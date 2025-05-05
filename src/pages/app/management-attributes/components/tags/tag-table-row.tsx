import { deleteTag } from "@/api/delete-tag";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { toast } from "sonner";

interface TagTableRowProps {
  tag: {
    tag_id: string;
    tag_name: string;
  };
  refresh: () => void;
}

export function TagTableRow({ tag, refresh }: TagTableRowProps) {
  const queryClient = useQueryClient();

  const handleDeleteTag = async (tagId: string) => {
    try {
      await deleteTag(tagId);
      await queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag removida com sucesso!");
      refresh();
    } catch (error) {
      console.error("Erro ao excluir tag:", error);
      toast.error("Erro ao excluir tag.");
    }
  };

  return (
    <TableRow>
      <TableCell className="font-mono text-xs font-medium sm:w-[100px]">
        {tag.tag_id}
      </TableCell>
      <TableCell className="font-medium">{tag.tag_name}</TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => handleDeleteTag(tag.tag_id)}
        >
          <Trash className="mr-2 h-4 w-4" />
          Excluir
        </Button>
      </TableCell>
    </TableRow>
  );
}
