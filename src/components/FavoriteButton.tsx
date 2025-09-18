import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  product: Product;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  product,
  size = 'sm',
  variant = 'ghost',
  className
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isProductFavorite = isFavorite(product.product_id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      className={cn(
        "p-2",
        isProductFavorite && "text-red-500 hover:text-red-600",
        className
      )}
    >
      <Heart 
        className={cn(
          "h-4 w-4",
          isProductFavorite && "fill-current"
        )} 
      />
    </Button>
  );
};