import { Outlet } from "react-router-dom";

// import { Header } from "@/components/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/theme/theme-toogle";
import { AccountMenu } from "@/components/account-menu";

export function AppLayout() {
  return (
    <div className="relative flex min-h-screen flex-col antialiased">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-1 flex-col gap-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <SidebarTrigger />
            <div className="fixed right-8 top-6 z-50 flex gap-2">
              <AccountMenu />
              <ThemeToggle />
            </div>
          </div>
          <Outlet />
        </div>
      </SidebarProvider>
    </div>
  );
}
