import {
  ChevronDown,
  Home,
  List,
  ListTree,
  Notebook,
  PackageSearch,
  ShoppingBag,
} from "lucide-react";
import { ThemeToggle } from "./theme/theme-toogle";
import { AccountMenu } from "./account-menu";
import { Separator } from "./ui/separator";
import { NavLink } from "./nav-link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <Notebook className="h-6 w-6" />

        <Separator orientation="vertical" className="h-6" />

        <nav className="flex items-center space-x-4 lg:space-x-6">
          <NavLink to="/">
            <Home className="h-4 w-4" />
            Home
          </NavLink>
          <NavLink to="/orders">
            <ShoppingBag className="h-4 w-4" />
            Orders
          </NavLink>
          <NavLink to="/customers">
            <List className="h-4 w-4" />
            Clients
          </NavLink>
          <NavLink to="/products">
            <PackageSearch className="h-4 w-4" />
            Products
          </NavLink>
          {/* <NavLink to="/attributes-management">
            <ListTree className="h-4 w-4" />
            Attributes
          </NavLink> */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="xs" variant="ghost">
                <ListTree className="h-4 w-4" />
                Attributes
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Managin:</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <NavLink to="/attributes/tags" className="w-full">
                  Tags
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink to="/attributes/categories" className="w-full">
                  Categorias
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink to="/attributes/brands" className="w-full">
                  Marcas
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink to="/attributes/coupons" className="w-full">
                  Cupons
                </NavLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </div>
  );
}
