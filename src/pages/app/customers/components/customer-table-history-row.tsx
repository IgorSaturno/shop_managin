import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Search } from "lucide-react";
import { OrderDetails } from "../../orders/order-details";

export function CustomerTableHistoryRow() {
  return (
    <TableRow>
      <TableCell className="sm:w-[64px]">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes da compra</span>
            </Button>
          </DialogTrigger>
          <OrderDetails />
        </Dialog>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium sm:w-[100px]">
        dsf4s654fs4
      </TableCell>
      <TableCell className="font-mono text-xs font-medium sm:w-[100px]">
        01/01/2021
      </TableCell>
      <TableCell>R$ 100,00</TableCell>
    </TableRow>
  );
}
