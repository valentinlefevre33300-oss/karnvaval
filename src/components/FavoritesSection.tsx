import React, { useState, useEffect } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';

export const FavoritesSection = () => {
  const { favorites, loading, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      if (favorites.length === 0) {
        setFavoriteProducts([]);
        return;
      }

      setProductsLoading(true);
      try {
        const productIds = favorites.map(fav => fav.product_id);
        const { data: products, error } = await supabase
          .from('products')
          .select('*')
          .in('product_id', productIds);

        if (error) throw error;
        setFavoriteProducts(products || []);
      } catch (error) {
        console.error('Error fetching favorite products:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchFavoriteProducts();
  }, [favorites]);

  const handleAddToCart = (product: Product) => {
    addToCart(product, "1");
    // Remove toast - notification now handled by CartNotification component
  };

  if (loading || productsLoading) {
    return <div className="text-center py-8">Chargement des favoris...</div>;
  }

  if (favoriteProducts.length === 0) {
    return (
      <div className="text-center py-8">
        <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Aucun produit dans vos favoris pour le moment</p>
        <Button asChild className="mt-4">
          <Link to="/catalogue">Découvrir nos produits</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {favoriteProducts.map((product) => (
        <Card key={product.product_id} className="group hover:shadow-lg transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="aspect-square relative overflow-hidden rounded-lg mb-3 sm:mb-4">
              <img
                src={product.image_url || '/placeholder.svg'}
                alt={product.name || ''}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-sm sm:text-base lg:text-lg line-clamp-2">{product.name}</h3>
              <p className="text-muted-foreground text-xs sm:text-sm truncate">{product.brand}</p>
              <p className="font-bold text-sm sm:text-base lg:text-lg text-primary">{product.price}€</p>
              
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 text-xs sm:text-sm"
                >
                  <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Ajouter au panier</span>
                  <span className="sm:hidden">Ajouter</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFromFavorites(product.product_id)}
                  className="text-destructive hover:text-destructive sm:flex-shrink-0"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="ml-1 sm:hidden">Retirer</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};