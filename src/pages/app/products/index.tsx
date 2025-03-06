"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Helmet } from "react-helmet-async";
import { ProductTableFilters } from "./components/product-table-filters";
import { Pagination } from "@/components/pagination";
import { ProductTableRow } from "./components/product-table-row";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Product } from "@/types/Product";
import { getProducts } from "@/lib/localStorage";
import ProductCreateDialog from "./components/product-create-dialog.tsx";

export default function Products() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  return (
    <>
      <Helmet title="Produtos" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
        <div className="flex justify-between">
          <ProductTableFilters />
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Produto
              </Button>
            </DialogTrigger>
            <ProductCreateDialog
              onClose={() => setIsCreateOpen(false)}
              refresh={setProducts}
            />
          </Dialog>
        </div>
        <div className="space-y-2.5">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[100px]">Imagem</TableHead>
                  <TableHead className="w-[140px]">Identificador</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[180px]">Categoria</TableHead>
                  <TableHead className="w-[180px]">Sub marca</TableHead>
                  <TableHead className="w-[120px]">Estoque</TableHead>
                  <TableHead className="w-[140px]">Preço</TableHead>
                  <TableHead className="w-[164px]">Status</TableHead>
                  <TableHead className="w-[132px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <ProductTableRow
                    key={product.id}
                    product={product}
                    refresh={setProducts}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
          <Pagination pageIndex={0} totalCount={products.length} perPage={10} />
        </div>
      </div>
    </>
  );
}
