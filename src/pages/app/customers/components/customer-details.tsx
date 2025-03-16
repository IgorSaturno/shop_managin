import {
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export function CustomerDetails() {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Detalhes do Cliente</DialogTitle>
        <DialogDescription>Informações detalhadas do cliente</DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-muted-foreground">ID</TableCell>
              <TableCell className="text-right">s5g46fd4f6</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">E-mail</TableCell>
              <TableCell className="text-right">
                customer@customer.com
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Nome</TableCell>
              <TableCell className="text-right">Teste1</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Endereço</TableCell>
              <TableCell className="text-right">
                Rua Eng. Saturnino de Brito
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Numero</TableCell>
              <TableCell className="text-right">278</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">CEP</TableCell>
              <TableCell className="text-right">03534-190</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Telefone</TableCell>
              <TableCell className="text-right">(11) 99999-9999</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">
                Ultima Compra
              </TableCell>
              <TableCell className="text-right">18/07/2025</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">
                Total Gasto
              </TableCell>
              <TableCell className="text-right">R$ 1.200,00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">N.Compras</TableCell>
              <TableCell className="text-right">120</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">
                Conta criada
              </TableCell>
              <TableCell className="text-right">20/10/2024</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Status</TableCell>
              <TableCell className="text-right">
                <span className="font-medium text-muted-foreground">Ativo</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </DialogContent>
  );
}
