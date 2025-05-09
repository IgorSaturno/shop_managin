import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useSearchParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  Category,
  getCategories,
  GetCategoryResponse,
} from "@/api/get-categories";
import { Brand, GetBrandResponse, getBrands } from "@/api/get-brands";
import { getTags, GetTagsResponse, Tag } from "@/api/get-tags";
import { getCoupons } from "@/api/get-coupons";

const productFiltersSchema = z.object({
  productId: z.string().optional(),
  productName: z.string().optional(),
  tags: z.string().optional(),
  status: z.string().optional(),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  couponId: z.string().optional(),
});

type ProductFiltersSchema = z.infer<typeof productFiltersSchema>;

export function ProductTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: categoriesResponse } = useQuery<GetCategoryResponse>({
    queryKey: ["categories", { pageIndex: 0 }],
    queryFn: () =>
      getCategories({
        pageIndex: 0,
        categoryId: null,
        categoryName: null,
      }),
  });

  const { data: brandsResponse } = useQuery<GetBrandResponse>({
    queryKey: ["brands", { pageIndex: 0 }], // Adicionado pageIndex na queryKey
    queryFn: () =>
      getBrands({
        pageIndex: 0,
        brandId: null,
        brandName: null,
      }),
  });

  const { data: tagsResponse } = useQuery<GetTagsResponse>({
    queryKey: ["tags", { pageIndex: 0 }],
    queryFn: () =>
      getTags({
        pageIndex: 0,
        tagId: null,
        tagName: null,
      }),
  });

  const { data: couponsResponse } = useQuery<
    { value: string; label: string }[]
  >({
    queryKey: ["coupons", { pageIndex: 0 }],
    queryFn: () =>
      getCoupons({ pageIndex: 0, status: "all" }).then((res) =>
        res.coupons.map((c) => ({
          value: c.discount_coupon_id,
          label: c.code,
        })),
      ),
  });

  const { register, handleSubmit, control, reset } =
    useForm<ProductFiltersSchema>({
      resolver: zodResolver(productFiltersSchema),
      defaultValues: {
        productId: searchParams.get("productId") || "",
        productName: searchParams.get("productName") || "",
        tags: searchParams.get("tags") || "all",
        status: searchParams.get("status") || "all",
        categoryId: searchParams.get("categoryId") || "all",
        brandId: searchParams.get("brandId") || "all",
        couponId: searchParams.get("couponId") || "all",
      },
    });

  const handleFilter = (data: ProductFiltersSchema) => {
    setSearchParams((state) => {
      [
        "productId",
        "productName",
        "tags",
        "status",
        "categoryId",
        "brandId",
        "couponId",
      ].forEach((key) => state.delete(key));

      if (data.productId) state.set("productId", data.productId);
      if (data.productName) state.set("productName", data.productName);
      if (data.status && data.status !== "all")
        state.set("status", data.status);
      if (data.categoryId && data.categoryId !== "all")
        state.set("categoryId", data.categoryId);
      if (data.brandId && data.brandId !== "all")
        state.set("brandId", data.brandId);
      if (data.tags && data.tags !== "all") state.set("tags", data.tags);
      if (data.couponId && data.couponId !== "all")
        state.set("couponId", data.couponId);

      state.set("page", "1");
      return state;
    });
  };

  const handleClearFilters = () => {
    setSearchParams((state) => {
      [
        "productId",
        "productName",
        "tags",
        "status",
        "categoryId",
        "brandId",
        "couponId",
      ].forEach((key) => state.delete(key));
      state.set("page", "1");
      return state;
    });
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-2"
    >
      <span className="text-sm font-semibold">Filtros:</span>

      <div className="grid grid-cols-1 gap-2 sm:flex sm:items-center sm:gap-2">
        <Input
          placeholder="ID do produto"
          className="h-8 w-auto"
          {...register("productId")}
        />
        <Input
          placeholder="Nome do produto"
          className="h-8 w-auto"
          {...register("productName")}
        />

        {/* Status */}
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                <SelectItem value="available">Disponível</SelectItem>
                <SelectItem value="unavailable">Indisponível</SelectItem>
                <SelectItem value="archived">Arquivado</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {/* Tags */}
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue placeholder="Todas tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas tags</SelectItem>
                {tagsResponse?.tags.map((tag: Tag) => (
                  <SelectItem key={tag.tag_id} value={tag.tag_id}>
                    {tag.tag_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {/* Categorias */}
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue placeholder="Todas categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                {categoriesResponse?.categories.map((category: Category) => (
                  <SelectItem
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {/* Marcas */}
        <Controller
          name="brandId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue placeholder="Todas marcas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas marcas</SelectItem>
                {brandsResponse?.brands.map((brand: Brand) => (
                  <SelectItem key={brand.brand_id} value={brand.brand_id}>
                    {brand.brand_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {/* Cupons */}
        <Controller
          name="couponId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue placeholder="Todos cupons" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos cupons</SelectItem>
                {couponsResponse?.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
        <Button type="submit" variant="secondary" size="xs">
          <Search className="mr-2 h-4 w-4" />
          Aplicar Filtros
        </Button>
        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={handleClearFilters}
        >
          <X className="mr-2 h-4 w-4" />
          Limpar Tudo
        </Button>
      </div>
    </form>
  );
}
