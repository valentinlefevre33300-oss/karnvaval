import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Menu, ShoppingCart, User, Search, LayoutDashboard } from "lucide-react";
import { HeaderActions } from "./HeaderActions";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { SearchDialog } from "@/components/SearchDialog";

import logo from "@/assets/Mask group.svg";
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

  const getDashboardLink = () => {
    if (isAdmin()) return "/profile/admin";
    if (isVendor()) return "/profile/vendor";
    return null;
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
            <img src={logo} alt="Karnaval" className="h-14 w-auto object-contain" />
          
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map(item => <Link key={item.name} to={item.href} className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === item.href ? "text-primary" : "text-muted-foreground"}`}>
              {item.name}
            </Link>)}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Only show cart/orders for clients (not for admins or vendors) */}
          {isClient() && !isAdmin() && !isVendor() && (
            <Link to={getCartLink()}>
              <Button variant="ghost" size="icon" className="relative" title={getCartLabel()}>
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
          )}
          
          {/* Dashboard button for admins and vendors */}
          {(isAdmin() || isVendor()) && getDashboardLink() && (
            <Link to={getDashboardLink()!}>
              <Button variant="ghost" size="icon" title="Tableau de bord">
                <LayoutDashboard className="h-5 w-5" />
              </Button>
            </Link>
          )}
          
          <HeaderActions />
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col h-full">
              {/* Navigation */}
              <nav className="flex flex-col space-y-4 mb-6">
                {navItems.map(item => (
                  <Link 
                    key={item.name} 
                    to={item.href} 
                    className={`text-sm font-medium transition-colors hover:text-primary p-2 rounded-md ${
                      location.pathname === item.href 
                        ? "text-primary bg-primary/10" 
                        : "text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              
              {/* Cart Button - Only for clients (not for admins or vendors) */}
              {isClient() && !isAdmin() && !isVendor() && (
                <div className="mb-6">
                  <Link to={getCartLink()}>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {getCartLabel()}
                      {totalItems > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="ml-auto h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                          {totalItems}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                </div>
              )}

              {/* Dashboard Button - Only for admins and vendors */}
              {(isAdmin() || isVendor()) && getDashboardLink() && (
                <div className="mb-6">
                  <Link to={getDashboardLink()!}>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Tableau de bord
                    </Button>
                  </Link>
                </div>
              )}
              
              {/* Separator */}
              <div className="border-t border-border mb-6"></div>
              
              {/* Auth Actions */}
              <div className="mt-auto">
                <HeaderActions isMobile={true} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>;
};