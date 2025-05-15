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

import ReactSelect, { MultiValue } from "react-select";
// import { ImageUpload } from "@/components/ImageUpload";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

// import { TagsInput } from "@/components/TagsInput";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategories, GetCategoryResponse } from "@/api/get-categories";
import { GetBrandResponse, getBrands } from "@/api/get-brands";
import { getTags, GetTagsResponse } from "@/api/get-tags";
import { getCoupons } from "@/api/get-coupons";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProduct } from "@/api/create-product";
import { Dialog } from "@radix-ui/react-dialog";
import { ImageUpload } from "@/components/ImageUpload";
import { uploadImage } from "@/api/upload-images";
import { useState } from "react";
import { api } from "@/lib/axios";

interface productCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const productCreateSchema = z.object({
  product_name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  characteristics: z.string().optional(),
  priceInCents: z.number().min(1, "Preço inválido"),
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
});

type FormValues = z.infer<typeof productCreateSchema>;

type ProductImage = FormValues["images"][number];

export default function ProductCreateDialog({
  onSuccess,
  open,
  onOpenChange,
}: productCreateDialogProps) {
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<File[]>([]);

  const { data: categoriesData } = useQuery<GetCategoryResponse>({
    queryKey: ["categories", { pageIndex: 0 }],
    queryFn: () =>
      getCategories({ pageIndex: 0, categoryId: null, categoryName: null }),
  });
  const { data: brandsData } = useQuery<GetBrandResponse>({
    queryKey: ["brands", { pageIndex: 0 }],
    queryFn: () => getBrands({ pageIndex: 0, brandId: null, brandName: null }),
  });
  const { data: tagsData } = useQuery<GetTagsResponse>({
    queryKey: ["tags", { pageIndex: 0 }],
    queryFn: () => getTags({ pageIndex: 0, tagId: null, tagName: null }),
  });

  const { data: couponsData } = useQuery({
    queryKey: ["coupons", { pageIndex: 0 }],
    queryFn: () =>
      getCoupons({ pageIndex: 0, status: "all" }).then((res) =>
        res.coupons.map((c) => ({
          value: c.discount_coupon_id,
          label: c.code,
        })),
      ),
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      product_name: "",
      description: "",
      characteristics: "",
      priceInCents: 0,
      stock: 0,
      status: "available",
      categoryId: "",
      brandId: "",
      couponIds: [],
      tags: [],
      images: [],
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // 1) Cria produto sem imagens
      const { productId } = await createProduct({
        product_name: data.product_name,
        description: data.description,
        characteristics: data.characteristics || "",
        priceInCents: Math.round(data.priceInCents * 100),
        stock: data.stock,
        isFeatured: false,
        isArchived: false,
        status: data.status,
        categoryId: data.categoryId,
        brandId: data.brandId,
        tags: data.tags,
        images: [], // inicialmente vazio
        couponIds: data.couponIds,
      });

      // 2) Upload de imagens, se existirem arquivos
      let imagesToSave: ProductImage[] = [];
      if (files.length > 0) {
        const uploaded = await Promise.all(
          files.map((file) => uploadImage(file, productId)),
        );
        // extrai apenas URLs para salvar
        imagesToSave = uploaded.map((u) => u.urls);

        // 3) Atualiza produto com URLs das imagens
        await api.patch(`/products/${productId}/images`, {
          images: imagesToSave,
        });
      }

      toast.success("Produto criado com sucesso!");
      reset();
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onSuccess();
    } catch (error: any) {
      console.error("Erro no onSubmit:", error);
      toast.error(error.message || "Erro ao criar produto");
    }
  };

  // const validateFields = () => {
  //   if (!name.trim()) {
  //     toast.error("Nome do produto é obrigatório");
  //     return false;
  //   }

  //   const priceNumber = parseFloat(price);
  //   if (isNaN(priceNumber) || priceNumber < 0) {
  //     toast.error("Preço inválido");
  //     return false;
  //   }

  //   const stockNumber = parseInt(stock);
  //   if (isNaN(stockNumber) || stockNumber < 0) {
  //     toast.error("Estoque inválido");
  //     return false;
  //   }

  //   if (!category) {
  //     toast.error("Selecione uma categoria");
  //     return false;
  //   }

  //   if (!subBrand) {
  //     toast.error("Selecione uma sub marca");
  //     return false;
  //   }

  //   return true;
  // };

  // const handleCreate = async () => {
  //   if (!validateFields()) return;

  //   try {
  //     setIsLoading(true);

  //     const imagePromises = images.map(
  //       (file) =>
  //         new Promise<string>((resolve) => {
  //           const reader = new FileReader();
  //           reader.onload = (e) => resolve(e.target?.result as string);
  //           reader.readAsDataURL(file);
  //         }),
  //     );

  //     const imageUrls = await Promise.all(imagePromises);

  //     const newProduct: Product = {
  //       id: Date.now().toString(36) + Math.random().toString(36).substr(2),
  //       name: name.trim(),
  //       price: parseFloat(price),
  //       stock: parseInt(stock),
  //       category: category.trim(),
  //       subBrand: subBrand.trim(),
  //       description: description.trim(),
  //       imageUrl: imageUrls[0] || "/placeholder-image.svg",
  //       images: imageUrls,
  //       status,
  //       tags: Array.isArray(selectedTags) ? selectedTags : [],
  //       createdAt: new Date().toISOString(),
  //     };

  //     saveProduct(newProduct);
  //     refresh(getProducts());
  //     onClose();
  //     toast.success("Produto criado com sucesso!");
  //   } catch (error) {
  //     console.error("Erro ao criar produto:", error);
  //     toast.error("Falha ao criar produto");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar Novo Produto</DialogTitle>
          <DialogDescription>
            Preencha os campos para criar um novo produto
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="product_name"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <div className="mb-1">
                  <Label>Nome</Label>
                </div>
                <Input {...field} placeholder="Nome do produto..." />
                {fieldState.error && (
                  <p className="text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="priceInCents"
              control={control}
              render={({ field, fieldState }) => {
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
                        // tira tudo que não é dígito ou vírgula
                        const cleaned = e.target.value.replace(/[^\d,]/g, "");
                        // vírgula → ponto
                        const asNumber = parseFloat(cleaned.replace(",", "."));
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
                <div>
                  <div className="mb-1">
                    <Label>Stock</Label>
                  </div>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  {fieldState.error && (
                    <p className="text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <div>
                  <div className="mb-1">
                    <Label>Status</Label>
                  </div>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
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

            <Controller
              name="categoryId"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <div className="mb-1">
                    <Label>Categoria</Label>
                  </div>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesData?.categories.map((cat) => (
                        <SelectItem
                          key={cat.category_id}
                          value={cat.category_id}
                        >
                          {cat.category_name}
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
                <div>
                  <div className="mb-1">
                    <Label>Marca</Label>
                  </div>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {brandsData?.brands.map((b) => (
                        <SelectItem key={b.brand_id} value={b.brand_id}>
                          {b.brand_name}
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
              render={({ field, fieldState }) => (
                <div>
                  <Label>Tags</Label>
                  <ReactSelect<{ value: string; label: string }, true>
                    isMulti
                    options={
                      tagsData?.tags.map((t) => ({
                        value: t.tag_id,
                        label: t.tag_name,
                      })) || []
                    }
                    // ReactSelect espera o mesmo formato de opção aqui
                    value={
                      tagsData
                        ? tagsData.tags
                            .filter((t) => field.value.includes(t.tag_id))
                            .map((t) => ({
                              value: t.tag_id,
                              label: t.tag_name,
                            }))
                        : []
                    }
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
              )}
            />

            {/* Cupons (react-select multi) */}
            <Controller
              name="couponIds"
              control={control}
              render={({ field }) => (
                <div>
                  <Label>Cupons</Label>
                  <ReactSelect<{ value: string; label: string }, true>
                    isMulti
                    options={couponsData || []}
                    value={
                      couponsData?.filter((c) =>
                        field.value?.includes(c.value),
                      ) || []
                    }
                    onChange={(
                      selected: MultiValue<{ value: string; label: string }>,
                    ) => field.onChange(selected.map((s) => s.value))}
                    placeholder="Selecione cupons"
                    styles={selectStyles}
                  />
                </div>
              )}
            />
          </div>

          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <div className="mb-1">
                  <Label>Descrição</Label>
                </div>
                <Textarea {...field} className="min-h-[100px]" />
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
            render={({ field }) => (
              <div>
                <div className="mb-1">
                  <Label>Características</Label>
                </div>
                <Textarea {...field} className="min-h-[80px]" />
              </div>
            )}
          />

          <Controller
            name="images"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <Label>Imagens</Label>
                <ImageUpload
                  initialImages={field.value.map((img) => ({
                    original: img.original,
                    optimized: img.optimized,
                    thumbnail: img.thumbnail,
                  }))}
                  onImagesChange={(images) => {
                    // Atualiza apenas URLs no formulário
                    field.onChange(
                      images.map((img) => ({
                        original: img.original,
                        optimized: img.optimized,
                        thumbnail: img.thumbnail,
                      })),
                    );

                    // Atualiza arquivos apenas para novos uploads
                    setFiles(
                      images
                        .map((img) => img.file)
                        .filter((file): file is File => !!file),
                    );
                  }}
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

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Criar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
