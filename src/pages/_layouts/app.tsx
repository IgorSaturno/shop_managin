import { Outlet } from "react-router-dom";

// import { Header } from "@/components/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col antialiased">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-1 flex-col gap-4 p-8 pt-6">
          <SidebarTrigger />
          <Outlet />
        </div>
      </SidebarProvider>
    </div>
  );
}
