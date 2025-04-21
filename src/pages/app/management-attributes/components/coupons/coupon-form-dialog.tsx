import { createCoupon } from "@/api/create-coupon";
import { Button } from "@/components/ui/button";
import { DateRangePickerValidate } from "@/components/ui/date-range-picker-validate";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const couponFormSchema = z
  .object({
    code: z.string().min(3, "Código deve ter pelo menos 3 caracteres"),
    discountType: z.enum(["percentage", "fixed"]),
    discountValue: z.number().min(1, "Valor deve ser maior que 0"),
    active: z.boolean(),
    validFrom: z
      .date()
      .refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0))),
    validUntil: z
      .date()
      .refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0))),
  })
  .refine((data) => data.validUntil > data.validFrom, {
    message: "Data final deve ser posterior à data inicial",
    path: ["validUntil"],
  });

type CouponFormData = z.infer<typeof couponFormSchema>;

interface CouponFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CouponFormDialog({
  open,
  onOpenChange,
  onSuccess,
}: CouponFormDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<CouponFormData>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: "",
      discountType: "percentage",
      discountValue: 0,
      validFrom: new Date(),
      validUntil: new Date(new Date().setDate(new Date().getDate() + 7)),
      active: true,
    },
  });

  async function onSubmit(data: CouponFormData) {
    try {
      // Adaptação para enviar as datas corretamente para a API
      await createCoupon({
        code: data.code,
        discountType: data.discountType,
        discountValue: data.discountValue,
        validFrom: data.validFrom || new Date(), // Garante valor padrão
        validUntil: data.validUntil,
        active: data.active,
      });

      await queryClient.invalidateQueries({ queryKey: ["coupons"] });
      form.reset();
      onOpenChange(false);
      onSuccess();
      toast.success("Cupom criado com sucesso!");
    } catch (err) {
      console.error("Erro detalhado:", err);
      toast.error(
        (err as any).response?.data?.message ||
          "Falha ao criar cupom. Verifique os dados.",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Cupom</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do novo cupom de desconto
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input placeholder="EXEMPLO123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Desconto</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percentage">Percentual</SelectItem>
                      <SelectItem value="fixed">Valor Fixo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {form.watch("discountType") === "percentage"
                      ? "Porcentagem (%)"
                      : "Valor (R$)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step={
                        form.watch("discountType") === "percentage"
                          ? "1"
                          : "0.01"
                      }
                      placeholder={
                        form.watch("discountType") === "percentage"
                          ? "Ex: 10%"
                          : "Ex: 50,00"
                      }
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  {/* <div className="space-y-0.5"> */}
                  <FormLabel className="text-base">Ativo</FormLabel>
                  {/* </div> */}
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-6 w-6"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button variant="success" size="xs" type="submit">
                Criar Cupom
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
