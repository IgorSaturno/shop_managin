"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Helmet } from "react-helmet-async";
import { ProductTableFilters } from "@/pages/app/products/components/product-table-filters";
import { Pagination } from "@/components/pagination";
import { ProductTableRow } from "@/pages/app/products/components/product-table-row";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Product } from "@/types/Product";
import { getProducts, getCategories, getSubBrands } from "@/lib/localStorage";
import ProductCreateDialog from "@/pages/app/products/components/product-create-dialog";
import { toast } from "sonner";

export default function Products() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<{
    id: string;
    name: string;
    category: string;
    subBrand: string;
    status: string;
  }>({
    id: "",
    name: "",
    category: "all",
    subBrand: "all",
    status: "all",
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [subBrands, setSubBrands] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    const fixExistingProducts = () => {
      try {
        const storedProducts = localStorage.getItem("products");
        if (!storedProducts) return;

        const parsedProducts = JSON.parse(storedProducts);

        const correctedProducts = parsedProducts.map((product: Product) => ({
          ...product,
          createdAt: product.createdAt || new Date().toISOString(),
        }));

        localStorage.setItem("products", JSON.stringify(correctedProducts));
      } catch (error) {
        console.error("Erro ao corrigir produtos:", error);
      }
    };

    fixExistingProducts();
  }, []);

  // Carrega dados iniciais
  useEffect(() => {
    const loadData = () => {
      try {
        const loadedProducts = getProducts();
        const loadedCategories = getCategories();
        const loadedSubBrands = getSubBrands();

        if (!Array.isArray(loadedProducts)) {
          console.error("Dados inválidos, resetando...");
          localStorage.removeItem("products");
          setProducts([]);
          return;
        }

        setProducts(loadedProducts);
        setCategories(loadedCategories);
        setSubBrands(loadedSubBrands);
        toast.success("Dados carregados com sucesso");
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Falha ao carregar dados");
        setProducts([]);
      }
    };

    loadData();
  }, []);

  // Filtra produtos com memoização
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesId = filters.id
        ? product.id.toLowerCase().includes(filters.id.toLowerCase())
        : true;
      const matchesName = filters.name
        ? product.name.toLowerCase().includes(filters.name.toLowerCase())
        : true;
      const matchesCategory =
        filters.category === "all" || product.category === filters.category;
      const matchesSubBrand =
        filters.subBrand === "all" || product.subBrand === filters.subBrand;
      const matchesStatus =
        filters.status === "all" || product.status === filters.status;

      return (
        matchesId &&
        matchesName &&
        matchesCategory &&
        matchesSubBrand &&
        matchesStatus
      );
    });
  }, [filters, products]);

  // Paginação
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const refreshProducts = () => {
    try {
      const updatedProducts = getProducts();
      setProducts(updatedProducts);
      toast.success("Lista de produtos atualizada");
    } catch (error) {
      console.error("Erro ao atualizar produtos:", error);
      toast.error("Falha ao atualizar produtos");
    }
  };

  return (
    <>
      <Helmet title="Produtos" />
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Produtos
        </h1>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <ProductTableFilters
            onFilter={setFilters}
            categories={categories}
            setCategories={setCategories}
            subBrands={subBrands}
            setSubBrands={setSubBrands}
          />

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Produto
              </Button>
            </DialogTrigger>

            <ProductCreateDialog
              onClose={() => {
                setIsCreateOpen(false);
                refreshProducts();
              }}
              refresh={refreshProducts}
              categories={categories}
              subBrands={subBrands}
            />
          </Dialog>
        </div>

        <div className="overflow-x-auto">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[100px]">Imagem</TableHead>
                  <TableHead className="w-[140px]">Identificador</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden w-[180px] sm:table-cell">
                    Categoria
                  </TableHead>
                  <TableHead className="hidden w-[180px] sm:table-cell">
                    Sub marca
                  </TableHead>
                  <TableHead className="w-[120px]">Estoque</TableHead>
                  <TableHead className="w-[140px]">Preço</TableHead>
                  <TableHead className="w-[164px]">Status</TableHead>
                  <TableHead className="w-[132px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProducts.map((product) => (
                  <ProductTableRow
                    key={product.id}
                    product={product}
                    refresh={refreshProducts}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-2">
            <Pagination
              pageIndex={currentPage - 1}
              totalCount={filteredProducts.length}
              perPage={productsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </>
  );
}
