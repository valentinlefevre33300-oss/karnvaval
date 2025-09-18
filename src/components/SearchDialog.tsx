import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Product, getProductSlug } from '@/lib/types';

interface SearchDialogProps {
  children: React.ReactNode;
}

export const SearchDialog = ({ children }: SearchDialogProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const searchProducts = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .limit(10);

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Error searching products:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchProducts(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleProductClick = (product: Product) => {
    setOpen(false);
    setQuery('');
    setResults([]);
    navigate(`/product/${getProductSlug(product.name)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && results.length > 0) {
      handleProductClick(results[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <div className="flex items-center border-b p-4">
          <Search className="h-5 w-5 text-muted-foreground mr-2" />
          <Input
            placeholder="Rechercher des produits..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 focus-visible:ring-0 text-lg"
            autoFocus
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="overflow-y-auto max-h-96">
          {loading && (
            <div className="p-4 text-center text-muted-foreground">
              Recherche en cours...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              Aucun produit trouvé pour "{query}"
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="p-2">
              {results.map((product) => (
                <div
                  key={product.product_id}
                  onClick={() => handleProductClick(product)}
                  className="flex items-center gap-4 p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                >
                  <img
                    src={product.image_url || '/placeholder.svg'}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{product.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {product.brand}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{product.price}€</div>
                    <div className="text-xs text-muted-foreground">
                      Stock: {product.stock_quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!query && (
            <div className="p-4 text-center text-muted-foreground">
              Tapez pour rechercher des produits...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};