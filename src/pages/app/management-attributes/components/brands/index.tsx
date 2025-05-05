import { getBrands } from "@/api/get-brands";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CirclePlus } from "lucide-react";
import { useState } from "react";

import { BrandCreateDialog } from "./brand-create-dialog";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BrandTableFilters } from "./brand-table-filters";
import { Pagination } from "@/components/pagination";
import { z } from "zod";
import { BrandTableRow } from "./brand-table-row";

export function BrandManagin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const brandId = searchParams.get("brandId");
  const brandName = searchParams.get("brandName");

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get("page") ?? "1");

  const { data: result } = useQuery({
    queryKey: ["brands", { pageIndex, brandId, brandName }],
    queryFn: () => getBrands({ pageIndex, brandId, brandName }),
  });

  function handlePaginate(pageIndex: number) {
    setSearchParams((state) => {
      state.set("page", (pageIndex + 1).toString());
      return state;
    });
  }

  const queryClient = useQueryClient();
  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["brands"] });
  };

  return (
    <>
      <Helmet title="Brands" />
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Brands
        </h1>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <BrandTableFilters />

          <Button
            type="button"
            variant="secondary"
            size="xs"
            onClick={() => setIsDialogOpen(true)}
            className="gap-2"
          >
            <CirclePlus className="h-4 w-4" />
            Create new brand
          </Button>
          <BrandCreateDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSuccess={() =>
              queryClient.invalidateQueries({ queryKey: ["brands"] })
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
                {result?.brands.map((brand) => (
                  <BrandTableRow
                    key={brand.brand_id}
                    brand={brand}
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
