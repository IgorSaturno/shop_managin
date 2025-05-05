import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategories, GetCategoryResponse } from "@/api/get-categories";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CirclePlus } from "lucide-react";
import { useState } from "react";

import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { Pagination } from "@/components/pagination";
import { CategoryTableRow } from "./category-table-row";
import { CategoryTableFilters } from "./category-table-filters";
import { CategoryCreateDialog } from "./category-create-dialog";

export function CategoriesManagin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const categoryId = searchParams.get("categoryId");
  const categoryName = searchParams.get("categoryName");

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get("page") ?? "1");

  const { data: result } = useQuery<GetCategoryResponse>({
    queryKey: ["categories", { pageIndex, categoryId, categoryName }],
    queryFn: () => getCategories({ pageIndex, categoryId, categoryName }),
  });

  function handlePaginate(pageIndex: number) {
    setSearchParams((state) => {
      state.set("page", (pageIndex + 1).toString());
      return state;
    });
  }

  const queryClient = useQueryClient();
  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["categories"] });
  };

  return (
    <>
      <Helmet title="Categories" />
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Categories
        </h1>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <CategoryTableFilters />

          <Button
            type="button"
            variant="secondary"
            size="xs"
            onClick={() => setIsDialogOpen(true)}
            className="gap-2"
          >
            <CirclePlus className="h-4 w-4" />
            Create new category
          </Button>
          <CategoryCreateDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSuccess={() =>
              queryClient.invalidateQueries({ queryKey: ["categories"] })
            }
          />
        </div>

        <div className="overflow-x-auto">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">ID</TableHead>
                  <TableHead className="w-[50%]">Nome</TableHead>
                  <TableHead className="w-[20%]"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {result?.categories.map((category) => (
                  <CategoryTableRow
                    key={category.category_id}
                    category={category}
                    refresh={refresh}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
          {result && (
            <Pagination
              onPageChange={handlePaginate}
              pageIndex={result.meta.pageIndex}
              totalCount={result.meta.totalCount}
              perPage={result.meta.perPage}
            />
          )}
        </div>
      </div>
    </>
  );
}
