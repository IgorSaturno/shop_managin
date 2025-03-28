import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";

import { History, Search } from "lucide-react";
import { CustomerDetails } from "./customer-details";
import { CustomerHistory } from "./customer-history";

interface CustomerTableRowProps {
  customer: Customer;
  refresh: (customer: Customer[]) => void;
}

export function CustomerTableRow({ customer, refresh }: CustomerTableRowProps) {
  return (
    <TableRow>
      <TableCell className="sm:w-[64px]">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Informações do cliente</span>
            </Button>
          </DialogTrigger>
          <CustomerDetails />
        </Dialog>
      </TableCell>

      <TableCell className="font-mono text-xs font-medium sm:w-[100px]">
        {customer.id.slice(0, 8).toUpperCase()}
      </TableCell>

      <TableCell className="sm:w-[120px]">{customer.email}</TableCell>
      <TableCell className="font-medium">{customer.name}</TableCell>
      <TableCell className="sm:w-[100px]">{customer.phone || "N/A"}</TableCell>
      <TableCell className="sm:w-[100px]">
        {/* {client.cep} */}
        03534-190
      </TableCell>
      <TableCell className="sm:w-[100px]">{customer.orderCount}</TableCell>
      <TableCell className="sm:w-[100px]">
        <div className="flex items-center gap-2">
          {/* <span
            className={`h-2 w-2 rounded-full ${
              client.status === "Ativo" ? "bg-green-500" : "bg-red-500"
            }`}
          /> */}
          <span className="font-medium text-muted-foreground">
            {/* {client.status} */}
            Ativo
          </span>
        </div>
      </TableCell>
      <TableCell className="sm:w-[132px]">
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="xs"
                // onClick={() => {
                // deleteClient(client.id);
                //   refresh([]);
                // }}
              >
                <History className="mr-2 h-3 w-3" />
                Histórico
              </Button>
            </DialogTrigger>
            <CustomerHistory />
          </Dialog>
        </div>
      </TableCell>
    </TableRow>
  );
}
