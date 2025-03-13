import type { Metadata } from "next";

import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";

import { SidebarTrigger } from "@/components/Sidebar/SidebarTrigger";
import { SidebarProvider } from "@/context/SidebarContext";

export const metadata: Metadata = {
  title: "shop-managin",
  description: "Sistema de gerenciamento de produtos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Substitui o Helmet */}
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>

      <body>
        <ThemeProvider storageKey="shop-managin-theme" defaultTheme="dark">
          <SidebarProvider>
            <SidebarTrigger />
            <main>{children}</main>
            <Toaster richColors position="top-right" />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
