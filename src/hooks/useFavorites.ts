import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
import { Product } from '@/lib/types';

export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuth();
  const { toast } = useToast();

  const fetchFavorites = useCallback(async () => {
    if (!authUser) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les favoris",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [authUser, toast]);

  const addToFavorites = async (product: Product) => {
    if (!authUser) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter aux favoris",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: authUser.id,
          product_id: product.product_id,
        });

      if (error) throw error;

      await fetchFavorites();
      toast({
        title: "Succès",
        description: "Produit ajouté aux favoris",
      });
      return true;
    } catch (error: unknown) {
      console.error('Error adding to favorites:', error);
      const code = (typeof error === 'object' && error && 'code' in error) ? String((error as { code?: unknown }).code) : undefined;
      if (code === '23505') {
        toast({
          title: "Information",
          description: "Ce produit est déjà dans vos favoris",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter aux favoris",
          variant: "destructive",
        });
      }
      return false;
    }
  };

  const removeFromFavorites = async (productId: string) => {
    if (!authUser) return false;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', authUser.id)
        .eq('product_id', productId);

      if (error) throw error;

      await fetchFavorites();
      toast({
        title: "Succès",
        description: "Produit retiré des favoris",
      });
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer des favoris",
        variant: "destructive",
      });
      return false;
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some(fav => fav.product_id === productId);
  };

  const toggleFavorite = async (product: Product) => {
    if (isFavorite(product.product_id)) {
      return await removeFromFavorites(product.product_id);
    } else {
      return await addToFavorites(product);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [authUser, fetchFavorites]);

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    fetchFavorites,
  };
};