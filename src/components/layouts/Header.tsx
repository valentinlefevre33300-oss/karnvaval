import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Menu, ShoppingCart, User, Search } from "lucide-react";
import { HeaderActions } from "./HeaderActions";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { SearchDialog } from "@/components/SearchDialog";

import logo from "@/assets/logo.svg";
export const Header = () => {
  const location = useLocation();
  const { isAdmin, isVendor, isClient } = useAuth();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  // Determine cart/orders link based on user role
  const getCartLink = () => {
    if (isAdmin()) return "/profile/admin";
    if (isVendor()) return "/profile/vendor";
    return "/cart"; // Regular cart for clients
  };

  const getCartLabel = () => {
    if (isAdmin() || isVendor()) {
      return "Commandes";
    }
    return "Panier";
  };
  const navItems = [{
    name: "Accueil",
    href: "/"
  }, {
    name: "Catalogue",
    href: "/catalogue"
  }, {
    name: "À propos",
    href: "/about"
  }, {
    name: "Contact",
    href: "/contact"
  }];
  return <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 interactive-scale">
          <img src={logo} alt="Karnaval" className="h-8 w-auto" />
          
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map(item => <Link key={item.name} to={item.href} className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === item.href ? "text-primary" : "text-muted-foreground"}`}>
              {item.name}
            </Link>)}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to={getCartLink()}>
            <Button variant="ghost" size="icon" className="relative" title={getCartLabel()}>
              <ShoppingCart className="h-5 w-5" />
              {isClient() && totalItems > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>
          <HeaderActions />
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col space-y-4">
              {navItems.map(item => <Link key={item.name} to={item.href} className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === item.href ? "text-primary" : "text-muted-foreground"}`}>
                  {item.name}
                </Link>)}
            </nav>
            
            <div className="flex items-center space-x-4 pt-4 border-t border-border">
              <Link to={getCartLink()}>
                <Button variant="ghost" size="icon" className="relative" title={getCartLabel()}>
                  <ShoppingCart className="h-5 w-5" />
                  {isClient() && totalItems > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>
              <HeaderActions />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>;
};