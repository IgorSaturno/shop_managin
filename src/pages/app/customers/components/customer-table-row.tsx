import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { Customer } from "@/types/Customer";
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
        {/* {client.id} */}
        s5g46fd4f6
      </TableCell>

      <TableCell className="sm:w-[120px]">
        {/* {client.email} */}
        client@client.com
      </TableCell>
      <TableCell className="font-medium">
        {/* {client.name} */}
        Teste1
      </TableCell>
      <TableCell className="sm:w-[100px]">
        {/* {client.phone} */}
        (11) 99999-9999
      </TableCell>
      <TableCell className="sm:w-[100px]">
        {/* {client.cep} */}
        03534-190
      </TableCell>
      <TableCell className="sm:w-[100px]">
        {/* {client.purchases} */}
        120
      </TableCell>
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
