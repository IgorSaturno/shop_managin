import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

const couponFiltersSchema = z.object({
  couponId: z.string().optional(),
  code: z.string().optional(),
  discountType: z.enum(["percentage", "fixed"]).optional(),
  status: z.enum(["active", "expired", "scheduled", "all"]).optional(),
});

type CouponFilters = z.infer<typeof couponFiltersSchema>;

export function CouponTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { register, handleSubmit, reset, watch, setValue } =
    useForm<CouponFilters>({
      resolver: zodResolver(couponFiltersSchema),
      defaultValues: {
        couponId: searchParams.get("couponId") ?? "",
        code: searchParams.get("code") ?? "",
        discountType: ["percentage", "fixed"].includes(
          searchParams.get("discountType") || "",
        )
          ? (searchParams.get("discountType") as any)
          : undefined,
        status: ["all", "active", "expired", "scheduled"].includes(
          searchParams.get("status") || "",
        )
          ? (searchParams.get("status") as any)
          : "all",
      },
    });

  function onFilter(data: CouponFilters) {
    setSearchParams((params) => {
      if (data.couponId) params.set("couponId", data.couponId);
      else params.delete("couponId");

      if (data.code) params.set("code", data.code);
      else params.delete("code");

      if (data.discountType) params.set("discountType", data.discountType);
      else params.delete("discountType");

      if (data.status && data.status !== "all")
        params.set("status", data.status);
      else params.delete("status");

      params.set("page", "1");
      return params;
    });
  }

  function onClear() {
    setSearchParams((params) => {
      params.delete("couponId");
      params.delete("code");
      params.delete("discountType");
      params.delete("status");
      params.set("page", "1");
      return params;
    });
    reset({
      couponId: "",
      code: "",
      discountType: undefined,
      status: "all",
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onFilter)}
      className="flex flex-col items-center gap-2 sm:flex-row"
    >
      <Input
        {...register("couponId")}
        placeholder="Filtrar por id"
        className="h-8 w-[150px]"
      />
      <Input
        {...register("code")}
        placeholder="Filtrar por código"
        className="h-8 w-[150px]"
      />

      {/* <Controller control={control} name="status" render={({field}) => ()}/> */}

      <Select
        value={watch("discountType") ?? ""}
        onValueChange={(value) =>
          setValue("discountType", value as "percentage" | "fixed")
        }
      >
        <SelectTrigger className="h-8 w-[160px]">
          <SelectValue placeholder="Tipo de desconto" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="percentage">Porcentagem</SelectItem>
          <SelectItem value="fixed">Valor Fixo</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={watch("status") ?? "all"}
        onValueChange={(value) => setValue("status", value as any)}
      >
        <SelectTrigger className="h-8 w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="active">Ativos</SelectItem>
          <SelectItem value="expired">Expirados</SelectItem>
          <SelectItem value="scheduled">Programados</SelectItem>
        </SelectContent>
      </Select>

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
