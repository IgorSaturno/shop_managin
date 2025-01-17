import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowDownUp } from "lucide-react";
import { useState } from "react";

export default function AddProductButton() {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="rounded-full font-bold"
              onClick={() => setDialogIsOpen(true)}
            >
              Adicionar Produto <ArrowDownUp />
            </Button>
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
