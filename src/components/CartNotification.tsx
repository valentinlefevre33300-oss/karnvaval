import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';

interface CartNotificationProps {
  show: boolean;
  productName: string;
  onComplete: () => void;
}

export const CartNotification: React.FC<CartNotificationProps> = ({ 
  show, 
  productName, 
  onComplete 
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className="bg-primary text-primary-foreground px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-sm">
        <div className="animate-scale-in">
          <ShoppingCart className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium text-sm">Ajouté au panier !</p>
          <p className="text-xs opacity-90">{productName}</p>
        </div>
        <div className="ml-2 bg-primary-foreground text-primary rounded-full px-2 py-1 text-xs font-bold animate-pulse">
          +1
        </div>
      </div>
    </div>
  );
};