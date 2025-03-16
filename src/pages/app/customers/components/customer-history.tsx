import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomerTableHistoryRow } from "./customer-table-history-row";

export function CustomerHistory() {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Histórico</DialogTitle>
        <DialogDescription>
          Histórico de compras do (nome do cliente)
        </DialogDescription>
      </DialogHeader>
      <div className="max-h-96 overflow-auto overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[64px]"></TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, index) => (
              <CustomerTableHistoryRow key={index} />
            ))}
          </TableBody>
        </Table>
      </div>
    </DialogContent>
  );
}
