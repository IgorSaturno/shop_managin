import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createTag } from "@/api/create-tag";
import { useQueryClient } from "@tanstack/react-query";
import { DialogDescription } from "@radix-ui/react-dialog";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CategoryCreateDialog({
  open,
  onOpenChange,
}: CategoryFormDialogProps) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: { name: string }) => {
    try {
      if (!values.name.trim()) {
        toast.warning("Digite um nome para a categoria");
        return;
      }
      await createTag(values.name);
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      form.reset();
      onOpenChange(false);
      toast.success("Categoria criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar Categoria:", error);
      toast.error("Erro ao criar Categoria.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Categoria</DialogTitle>
          <DialogDescription>
            Preencha os detalhes da nova Categoria abaixo.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Categoria</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Promoção" />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Criar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
