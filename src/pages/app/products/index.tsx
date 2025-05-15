"use client";

import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts, GetProductsResponse } from "@/api/get-products";
import { getCategories, GetCategoryResponse } from "@/api/get-categories";
import { GetBrandResponse, getBrands } from "@/api/get-brands";
import { ProductTableFilters } from "./components/product-table-filters";
import { ProductTableRow } from "./components/product-table-row";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
// import { ProductCreateDialog } from "./components/product-create-dialog";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProductCreateDialog from "./components/product-create-dialog";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // filtros na URL
  const productName = searchParams.get("productName");
  const productId = searchParams.get("productId");
  const status = searchParams.get("status");
  const categoryId = searchParams.get("categoryId");
  const brandId = searchParams.get("brandId");
  const tagsParam = searchParams.get("tags");
  const couponId = searchParams.get("couponId");

  const categoryIds = categoryId && categoryId !== "all" ? [categoryId] : null;
  const tags = tagsParam && tagsParam !== "all" ? [tagsParam] : null;

  const pageIndex = z.coerce
    .number()
    .transform((p) => p - 1)
    .parse(searchParams.get("page") ?? "1");

  // dados mestre: categories e brands
  const { data: categoriesData } = useQuery<GetCategoryResponse>({
    queryKey: [
      "categories",
      { pageIndex: 0, categoryId: null, categoryName: null },
    ],
    queryFn: () =>
      getCategories({ pageIndex: 0, categoryId: null, categoryName: null }),
  });
  const { data: brandsData } = useQuery<GetBrandResponse>({
    queryKey: ["brands", { pageIndex: 0, brandId: null, brandName: null }],
    queryFn: () => getBrands({ pageIndex: 0, brandId: null, brandName: null }),
  });

  // consulta produtos com filtros e paginação
  const { data: result } = useQuery<GetProductsResponse>({
    queryKey: [
      "products",
      {
        pageIndex,
        productName,
        productId,
        status,
        categoryIds,
        brandId,
        tags,
        couponId,
      },
    ],
    queryFn: () =>
      getProducts({
        pageIndex,
        productName,
        productId,
        status: status === "all" ? null : status,
        categoryId,
        brandId: brandId === "all" ? null : brandId,
        tags,
        couponId: couponId === "all" ? null : couponId,
      }),
  });

  function handlePaginate(newPage: number) {
    setSearchParams((state) => {
      state.set("page", String(newPage + 1));
      return state;
    });
  }

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["products"] });
  }

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      <Helmet title="Produtos" />
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Produtos
        </h1>
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <ProductTableFilters />
          <Button
            variant="secondary"
            size="xs"
            onClick={() => setIsCreateOpen(true)}
            className="gap-2"
          >
            <CirclePlus className="h-4 w-4" /> Novo Produto
          </Button>
          <ProductCreateDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            onSuccess={refresh}
          />
        </div>

        <div className="overflow-x-auto">
          <div className="mb-4 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[180px]">Categorias</TableHead>
                  <TableHead className="w-[180px]">Marcas</TableHead>
                  <TableHead className="w-[180px]">Tags</TableHead>
                  <TableHead className="w-[180px]">Cupons</TableHead>
                  <TableHead className="w-[120px]">Estoque</TableHead>
                  <TableHead className="w-[140px]">Preço</TableHead>
                  <TableHead className="w-[140px]">Preço.D</TableHead>
                  <TableHead className="w-[164px]">Status</TableHead>
                  <TableHead className="w-[132px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result?.products.map((product) => {
                  return (
                    <ProductTableRow
                      key={product.productId}
                      product={product}
                      categories={categoriesData?.categories || []}
                      brands={brandsData?.brands || []}
                      refresh={refresh}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {result && (
            <Pagination
              pageIndex={result.meta.pageIndex}
              totalCount={result.meta.totalCount}
              perPage={result.meta.perPage}
              onPageChange={handlePaginate}
            />
          )}
        </div>
      </div>
    </>
  );
}
