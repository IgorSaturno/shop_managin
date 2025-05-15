import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/ImageUpload";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { updateProduct } from "@/api/update-product";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/api/get-categories";
import { getBrands } from "@/api/get-brands";
import { getTags, GetTagsResponse } from "@/api/get-tags";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCoupons } from "@/api/get-coupons";
import ReactSelect, { MultiValue } from "react-select";

import { useEffect } from "react";

export interface RowProduct {
  productId: string;
  productName: string;
  description?: string;
  characteristics?: string;
  priceInCents: number;
  status: "available" | "unavailable" | "archived";
  stock: number;
  categoryIds: string[]; // note que aqui é array
  brandId: string;
  tags?: Array<{ id: string; name: string }>;
  images: string[]; // só URLs planas
  couponIds?: string[];
  isFeatured: boolean;
  isArchived: boolean;
}

export interface ProductEditDetailsProps {
  product: RowProduct;
  onClose: () => void;
  refresh: () => void;
}

const productEditSchema = z.object({
  productId: z.string(),
  productName: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  characteristics: z.string().optional(),
  priceInCents: z.number().min(0.01, "Preço inválido"),
  stock: z.number().min(0, "Estoque inválido"),
  status: z.enum(["available", "unavailable", "archived"]),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  brandId: z.string().min(1, "Selecione uma marca"),
  tags: z.array(z.string()),
  images: z
    .array(
      z.object({
        original: z.string(),
        optimized: z.string(),
        thumbnail: z.string(),
      }),
    )
    .max(4, "Máximo 4 imagens"),
  couponIds: z.array(z.string()).optional(),
  isFeatured: z.boolean(),
  isArchived: z.boolean(),
});

type ProductEditSchema = z.infer<typeof productEditSchema>;

export default function ProductEditDetails({
  product,
  onClose,
  refresh,
}: ProductEditDetailsProps) {
  const form = useForm<ProductEditSchema>({
    resolver: zodResolver(productEditSchema),
    defaultValues: {} as any,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    console.log("couponIds", product.couponIds);
    reset({
      productId: product.productId,
      productName: product.productName,
      description: product.description,
      characteristics: product.characteristics,
      priceInCents: product.priceInCents / 100,
      stock: product.stock,
      status: product.status,
      categoryId: product.categoryIds[0] ?? "",
      brandId: product.brandId,
      tags: product.tags?.map((t) => t.id) || [],
      couponIds: product.couponIds || [],
      images: (product.images || []).map((url) => ({
        original: url,
        optimized: url,
        thumbnail: url,
      })),
      isFeatured: product.isFeatured,
      isArchived: product.isArchived,
    });
  }, [product, reset]);

  const { data: categoriesOptionsUpdate } = useQuery({
    queryKey: ["categories", "edit"],
    queryFn: () =>
      getCategories({ pageIndex: 0, categoryId: null, categoryName: null }),
  });
  const { data: brandsOptionsUpdate } = useQuery({
    queryKey: ["brands", "edit"],
    queryFn: () => getBrands({ pageIndex: 0, brandId: null, brandName: null }),
  });
  const { data: tagsOptionsUpdate } = useQuery<GetTagsResponse>({
    queryKey: ["tags", "edit"],
    queryFn: () => getTags({ pageIndex: 0, tagId: null, tagName: null }),
  });
  const { data: couponOptionsUpdate } = useQuery({
    queryKey: ["coupons", "edit"],
    queryFn: () =>
      getCoupons({ pageIndex: 0, status: "all" }).then((res) =>
        res.coupons.map((c) => ({
          value: c.discount_coupon_id,
          label: c.code,
        })),
      ),
  });

  const handleSave = async (data: ProductEditSchema) => {
    try {
      await updateProduct({
        productId: data.productId,
        product_name: data.productName,
        description: data.description,
        characteristics: data.characteristics,
        priceInCents: Math.round(data.priceInCents * 100), // converte para centavos
        stock: data.stock,
        status: data.status,
        categoryId: data.categoryId,
        brandId: data.brandId,
        tags: data.tags,
        images: data.images,
        couponIds: data.couponIds ?? [],
        isFeatured: data.isFeatured,
        isArchived: data.isArchived,
      });

      toast.success("Produto atualizado!");
      refresh();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar");
    }
  };

  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      background: "var(--background)",
      borderRadius: 4,
      borderColor: state.isFocused ? "#6366F1" : "none",
      boxShadow: state.isFocused ? "0 0 0 1px #6366F1" : undefined,
      "&:hover": { borderColor: "#6366F1" },
      padding: 2,
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: "#030712", // Tailwind bg-gray-800
      color: "#F9FAFB", // Tailwind text-gray-100
      borderRadius: 4,
      border: "1px solid #2f3238", // Tailwind border-gray-600
      marginTop: 4,
      zIndex: 10,
    }),
    option: (base: any, { isFocused, isSelected }: any) => ({
      ...base,
      backgroundColor: isSelected
        ? "#6366F1" // Tailwind indigo-500
        : isFocused
          ? "#4F46E5" // Tailwind indigo-600
          : "transparent",
      color: isSelected || isFocused ? "#FFFFFF" : "#F9FAFB",
      cursor: "pointer",
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: "#E0E7FF",
      borderRadius: 3,
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: "#4338CA",
      fontWeight: 500,
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: "#4338CA",
      ":hover": { backgroundColor: "#C7D2FE", color: "#312E81" },
    }),
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Editar Produto</DialogTitle>
        <DialogDescription>
          Faça as alterações necessárias nos campos abaixo
        </DialogDescription>
      </DialogHeader>

      {/* ALTERAR: Converter para formulário controlado */}
      <form onSubmit={handleSubmit(handleSave)}>
        <div className="space-y-4">
          {/* Campo Nome */}
          <Controller
            name="productName"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <Label htmlFor="productName">Nome do Produto</Label>
                <Input id="productName" {...field} />
                {fieldState.error && (
                  <p className="text-red-500">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />

          {/* Preço e Estoque */}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="priceInCents"
              control={control}
              render={({ field, fieldState }) => {
                // converte o valor numérico para string formatada em R$
                const display = field.value.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                });

                return (
                  <div>
                    <div className="mb-1">
                      <Label>Preço (R$)</Label>
                    </div>
                    <Input
                      value={display}
                      onChange={(e) => {
                        // remove tudo que não é dígito ou vírgula
                        const cleaned = e.target.value.replace(/[^\d,]/g, "");
                        // substitui vírgula por ponto e converte pra float
                        const asNumber = parseFloat(cleaned.replace(",", "."));
                        // joga o número “puro” de volta pro formulário
                        field.onChange(isNaN(asNumber) ? 0 : asNumber);
                      }}
                    />
                    {fieldState.error && (
                      <p className="text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                );
              }}
            />

            <Controller
              name="stock"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <Label htmlFor="stock">Estoque</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  {fieldState.error && (
                    <p className="text-red-500">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Status */}
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <div className="space-y-1">
                <Label htmlFor="status">Status</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponível</SelectItem>
                    <SelectItem value="unavailable">Indisponível</SelectItem>
                    <SelectItem value="archived">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          {/* Categoria e Marca */}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="categoryId"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <Label>Categoria</Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesOptionsUpdate?.categories.map((category) => (
                        <SelectItem
                          key={category.category_id}
                          value={category.category_id}
                        >
                          {category.category_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <p className="text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              name="brandId"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <Label>Marca</Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {brandsOptionsUpdate?.brands.map((brand) => (
                        <SelectItem key={brand.brand_id} value={brand.brand_id}>
                          {brand.brand_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <p className="text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="tags"
              control={control}
              render={({ field, fieldState }) => {
                // 1) monta as opções no formato { value, label }
                const tagOptions =
                  tagsOptionsUpdate?.tags.map((t) => ({
                    value: t.tag_id,
                    label: t.tag_name,
                  })) ?? [];

                // 2) filtra só as opções que já estão selecionadas
                const selectedTags = tagOptions.filter((opt) =>
                  field.value.includes(opt.value),
                );

                return (
                  <div>
                    <Label>Tags</Label>
                    <ReactSelect<{ value: string; label: string }, true>
                      isMulti
                      options={tagOptions}
                      value={selectedTags}
                      onChange={(
                        selected: MultiValue<{ value: string; label: string }>,
                      ) => field.onChange(selected.map((s) => s.value))}
                      placeholder="Selecione tags"
                      styles={selectStyles}
                    />
                    {fieldState.error && (
                      <p className="text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                );
              }}
            />

            <Controller
              name="couponIds"
              control={control}
              render={({ field }) => {
                const couponOptions = couponOptionsUpdate ?? [];
                const selectedCoupons = couponOptions.filter((opt) =>
                  field.value?.includes(opt.value),
                );

                return (
                  <div>
                    <Label>Cupons</Label>
                    <ReactSelect<{ value: string; label: string }, true>
                      isMulti
                      options={couponOptions}
                      value={selectedCoupons}
                      onChange={(
                        selected: MultiValue<{ value: string; label: string }>,
                      ) => field.onChange(selected.map((s) => s.value))}
                      placeholder="Selecione cupons"
                      styles={selectStyles}
                    />
                  </div>
                );
              }}
            />
          </div>

          {/* Descrição */}
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <Label htmlFor="productDescription">Descrição</Label>
                <Textarea
                  id="productDescription"
                  {...field}
                  className="min-h-[100px]"
                />
                {fieldState.error && (
                  <p className="text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="characteristics"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <Label htmlFor="productCharacteristics">Caracteristicas</Label>
                <Textarea
                  id="productCharacteristics"
                  {...field}
                  className="min-h-[100px]"
                />
                {fieldState.error && (
                  <p className="text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Upload de Imagens */}
          <Controller
            name="images"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <Label>Imagens do Produto (Máx. 4)</Label>
                <ImageUpload
                  initialImages={field.value}
                  onImagesChange={field.onChange}
                  maxImages={4}
                />
                {fieldState.error && (
                  <p className="text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Botões de Ação */}
          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </div>
      </form>
    </DialogContent>
  );
}
