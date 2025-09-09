import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { ShoppingCart, Package, BarChart3, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Place Order", href: "/", icon: ShoppingCart },
  { name: "My Orders", href: "/orders", icon: Package },
  { name: "Stock Update", href: "/stock", icon: BarChart3 },
];

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary"></div>
            <span className="text-xl font-bold">StorePro</span>
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      "hover:bg-accent hover:text-accent-foreground",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "text-muted-foreground",
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="container py-4 space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground",
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
