import { Helmet } from "react-helmet-async";
import { TagCreateDialog } from "./tag-create-dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { getTags, GetTagsResponse } from "@/api/get-tags";
import { TagTableRow } from "./tag-table-row";
import { Pagination } from "@/components/pagination";
import { TagTableFilters } from "./tag-table-filters";

export function TagsManagin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const tagId = searchParams.get("tagId");
  const tagName = searchParams.get("tagName");

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get("page") ?? "1");

  const { data: result } = useQuery<GetTagsResponse>({
    queryKey: ["tags", { pageIndex, tagId, tagName }],
    queryFn: () => getTags({ pageIndex, tagId, tagName }),
  });

  function handlePaginate(pageIndex: number) {
    setSearchParams((state) => {
      state.set("page", (pageIndex + 1).toString());
      return state;
    });
  }

  const queryClient = useQueryClient();
  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["tags"] });
  };

  return (
    <>
      <Helmet title="Tags" />

      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Tags</h1>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <TagTableFilters />

          <Button
            type="button"
            variant="secondary"
            size="xs"
            onClick={() => setIsDialogOpen(true)}
            className="gap-2"
          >
            Create new tag
          </Button>
          <TagCreateDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSuccess={() =>
              queryClient.invalidateQueries({ queryKey: ["tags"] })
            }
          />
        </div>

        <div className="overflow-x-auto">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {result?.tags.map((tag) => (
                  <TagTableRow key={tag.tag_id} tag={tag} refresh={refresh} />
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
