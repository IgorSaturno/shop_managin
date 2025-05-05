import { z } from "zod";
import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Dialog,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateCoupon } from "@/api/update-coupon";

import { Coupon } from "@/api/get-coupons";
import { api } from "@/lib/axios";
import { DateRangePickerValidate } from "@/components/ui/date-range-picker-validate";

interface CouponEditDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon: Coupon;
  onSuccess: () => void;
}

const couponEditSchema = z
  .object({
    id: z.string(),
    code: z.string().min(1, "Código é obrigatório"),
    discountType: z.enum(["percentage", "fixed"]),
    discountValue: z.number().min(0.01, "Valor deve ser maior que 0"),
    minimumOrder: z
      .string()
      .optional()
      .transform((val) => (val === "" ? undefined : val)),
    maxUses: z
      .number()
      .min(1, "Mínimo 1 uso")
      .optional()
      .nullable()
      .transform((val) => val ?? undefined),
    validFrom: z
      .date()
      .refine((date) => !isNaN(date.getTime()), "Data inicial inválida")
      .refine(
        (date) => date >= new Date(new Date().setHours(0, 0, 0, 0)),
        "A data inicial não pode ser no passado",
      ),
    validUntil: z.date(),
    active: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.validUntil < data.validFrom) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A data final deve ser após a data inicial",
        path: ["validUntil"],
      });
    }
  });

type CouponEditSchema = z.infer<typeof couponEditSchema>;

export function CouponEditDetails({
  open,
  onOpenChange,
  coupon,
  onSuccess,
}: CouponEditDetailsProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    getValues, // getValues vem do react-hook-form
    setError: setFormError,
    clearErrors,
  } = useForm<CouponEditSchema>({
    resolver: zodResolver(couponEditSchema),
    defaultValues: {
      id: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue / 100,
      minimumOrder: coupon.minimumOrder
        ? (Number(coupon.minimumOrder) / 100).toFixed(2)
        : undefined,
      maxUses: coupon.maxUses ?? undefined,
      validFrom: new Date(coupon.validFrom),
      validUntil: new Date(coupon.validUntil),
      active: coupon.active,
    },
  });

  const code = useWatch({ control, name: "code" });

  useEffect(() => {
    let isMounted = true;
    const checkCodeAvailability = async (newCode: string) => {
      if (newCode === coupon.code) return;

      try {
        const response = await api.get(
          `/discount-coupons/check-code?code=${newCode}`,
        );

        if (isMounted) {
          if (!response.data.available) {
            setFormError("code", {
              type: "manual",
              message: "Este código já está em uso",
            });
          } else {
            setFormError("code", {});
          }
        }
      } catch (error) {
        console.error("Erro ao verificar código:", error);
      }
    };

    const debounceCheck = setTimeout(() => {
      if (code && code !== coupon.code) {
        checkCodeAvailability(code);
      }
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(debounceCheck);
    };
  }, [code, coupon.code, setFormError]);

  const isCouponActive = () => {
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);
    return now >= validFrom && now <= validUntil && coupon.active;
  };

  const isActive = isCouponActive();

  async function onSave(data: CouponEditSchema) {
    try {
      if (isActive) {
        toast.error("Alterações bloqueadas: Cupom ativo em vigência", {
          description:
            "Edições só são permitidas para cupons inativos ou fora do período de validade",
          action: {
            label: "Entendi",
            onClick: () => {},
          },
        });
        return;
      }

      await updateCoupon(coupon.id, {
        ...data,
        validFrom: data.validFrom.toISOString(),
        validUntil: data.validUntil.toISOString(),
      });

      toast.success("Cupom atualizado com sucesso!");
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      // ← AQUI: trata erro Axios/500 antes de acessar err.response.data
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
        return;
      }

      // a seguir, seus erros customizados
      if (err.message === "Código já está em uso") {
        setFormError("code", {
          type: "manual",
          message: "Este código já está em uso",
        });
        toast.error("Não foi possível atualizar: Código já está em uso");
        return;
      }

      if (err.message.includes("data")) {
        toast.error(err.message);
        setFormError(
          err.message.includes("inicial") ? "validFrom" : "validUntil",
          { type: "manual", message: err.message },
        );
        return;
      }

      // fallback genérico
      toast.error("Erro ao atualizar cupom");
      console.error("Erro detalhado:", err);
    }
  }

  const discountType = useWatch({ control, name: "discountType" });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Cupom</DialogTitle>
          <DialogDescription>Altere os dados do cupom</DialogDescription>
          {isActive && (
            <div className="mt-2 rounded-md bg-yellow-50 p-3 text-yellow-700">
              <p className="text-sm">
                Este cupom está ativo e em vigência. Alterações não são
                permitidas.
              </p>
            </div>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <Controller
            name="code"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <Label htmlFor="code">Código *</Label>
                <Input
                  id="code"
                  {...field}
                  className={fieldState.error ? "border-red-500" : ""}
                  disabled={isActive}
                />
                {fieldState.error && (
                  <p className="mt-1 text-sm text-red-500">
                    {fieldState.error.type === "manual"
                      ? "Este código já está em uso"
                      : fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="discountType"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <Label>Tipo de Desconto *</Label>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isActive}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">
                        Porcentagem (%)
                      </SelectItem>
                      <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="discountValue"
              control={control}
              render={({ field, fieldState }) => {
                const display =
                  discountType === "percentage"
                    ? // sem casas decimais na %
                      `${Math.round(field.value).toLocaleString("pt-BR")}%`
                    : // em reais com 2 decimais
                      field.value.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      });

                return (
                  <div>
                    <Label htmlFor="value">
                      {discountType === "percentage"
                        ? "Percentual (%)"
                        : "Valor (R$)"}
                    </Label>
                    <Input
                      id="value"
                      value={display}
                      disabled={isActive}
                      onChange={(e) => {
                        // limpa tudo que não for dígito ou vírgula
                        const cleaned = e.target.value.replace(/[^\d,]/g, "");
                        const num = parseFloat(cleaned.replace(",", "."));
                        field.onChange(isNaN(num) ? 0 : num);
                      }}
                    />
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                );
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="minimumOrder"
              control={control}
              render={({ field, fieldState }) => {
                // internal string → number
                const num = field.value ? parseFloat(field.value) : 0;
                const display = num.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                });
                return (
                  <div>
                    <Label htmlFor="min-order">Pedido Mínimo (R$)</Label>
                    <Input
                      id="min-order"
                      value={display}
                      disabled={isActive}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/[^\d,]/g, "");
                        const parsed = parseFloat(cleaned.replace(",", "."));
                        field.onChange(isNaN(parsed) ? "" : parsed.toString());
                      }}
                    />
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                );
              }}
            />

            <Controller
              name="maxUses"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <Label htmlFor="max-uses">Usos Máximos</Label>
                  <Input
                    id="max-uses"
                    type="number"
                    min="1"
                    disabled={isActive}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                  />
                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <Controller
            name="validFrom"
            control={control}
            render={({ field }) => (
              <DateRangePickerValidate
                date={{
                  from: field.value,
                  to: getValues("validUntil"), // getValues vem do react-hook-form
                }}
                onDateChange={(range) => {
                  if (range?.from) {
                    clearErrors("validFrom");
                    setValue("validFrom", range.from);
                  }
                  if (range?.to) {
                    clearErrors("validUntil");
                    setValue("validUntil", range.to);
                  }
                }}
                disabled={{ before: new Date() }}
                fromDate={new Date()}
              />
            )}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
