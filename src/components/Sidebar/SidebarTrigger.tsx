"use client";

import { useSidebar } from "@/context/SidebarContext";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";

export function SidebarTrigger() {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <Button onClick={toggleSidebar} variant="ghost">
      <PanelLeft className="h-6 w-6" />
      <span className="sr-only">
        {isOpen ? "Fechar Sidebar" : "Abrir Sidebar"}
      </span>
    </Button>
  );
}
