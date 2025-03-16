import { Helmet } from "react-helmet-async";
import { CustomerFilters } from "./components/customer-filters";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomerTableRow } from "./components/customer-table-row";

export function Customers() {
  return (
    <>
      <Helmet title="Customers" />
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Customers
        </h1>

        <CustomerFilters />
        <div className="overflow-x-auto">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[100px]">Identificador</TableHead>
                  <TableHead className="w-[120px]">E-mail</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[164px]">Telefone</TableHead>
                  <TableHead className="w-[100px]">CEP</TableHead>
                  <TableHead className="w-[100px]">N.Compras</TableHead>

                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[132px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <CustomerTableRow />
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
