import React from 'react';
import { useCart } from '@/hooks/useCart';
import { toast } from '@/components/ui/sonner';

export const CartNotifications = () => {
  const { showNotification, lastAddedProduct, hideNotification } = useCart();

  React.useEffect(() => {
    if (showNotification) {
      toast('Produit ajouté au panier', {
        description: lastAddedProduct,
      });
      // hide flag so it doesn't retrigger
      hideNotification();
    }
  }, [showNotification, lastAddedProduct, hideNotification]);

  return null;
};
