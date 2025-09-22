import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { Search, Package, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { Product } from '@/lib/types';
import InstantDialog from './InstantDialog';
import ProductEditDialog from './ProductEditDialog';

const ProductManagement = ({ showAddButton = false }: { showAddButton?: boolean }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editOpenId, setEditOpenId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.time('[ProductManagement] fetchProducts');
      let query = supabase
        .from('products')
        .select('*')
        .order('name');

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Normalize sizes to expected type
      const normalized: Product[] = (data || []).map((p: any) => ({
        ...p,
        sizes: Array.isArray(p.sizes)
          ? p.sizes.map(String)
          : typeof p.sizes === 'string'
            ? p.sizes
            : String(p.sizes ?? ''),
      }));

      setProducts(normalized);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Erreur lors du chargement des produits');
    } finally {
      console.timeEnd('[ProductManagement] fetchProducts');
      setLoading(false);
    }
  }, [searchQuery]);

  const brandOptions = useMemo(() => Array.from(new Set(products.map(p => p.brand).filter(Boolean))), [products]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchProducts]);

  const toggleStockStatus = async (productId: string, currentStock: string) => {
    try {
      const newStock = currentStock === '0' ? '1' : '0';
      
      // Optimistic update - update UI immediately
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.product_id === productId 
            ? { ...product, stock_quantity: newStock }
            : product
        )
      );

      // If we mark as rupture (0), also zero all per-size stocks to keep consistency
      if (newStock === '0') {
        // Get current product to read its per-size map
        const product = products.find(p => p.product_id === productId);
        let zeroMap: Record<string, number> = {};
        const raw = product && (product as any).stock_by_size;
        if (raw && typeof raw === 'object') {
          Object.keys(raw).forEach(k => { zeroMap[String(k)] = 0; });
        } else if (typeof raw === 'string') {
          try {
            const obj = JSON.parse(raw);
            Object.keys(obj || {}).forEach(k => { zeroMap[String(k)] = 0; });
          } catch {}
        } else if (product) {
          // Fallback from sizes
          const sizesCsv = Array.isArray(product.sizes) ? (product.sizes as string[]).join(',') : (product.sizes || '');
          sizesCsv.split(',').map(s => s.trim()).filter(Boolean).forEach(sz => { zeroMap[sz] = 0; });
        }

        const { error } = await supabase
          .from('products' as any)
          .update({
            stock_quantity: '0',
            stock_by_size: zeroMap,
          } as any)
          .eq('product_id', productId);

        if (error) throw error;

        // Reflect per-size zero in local state too if present
        setProducts(prevProducts => prevProducts.map(p => p.product_id === productId ? ({ ...p, stock_quantity: '0',
          stock_by_size: zeroMap,
        }) : p));
      } else {
        const { error } = await supabase
          .from('products')
          .update({ stock_quantity: newStock })
          .eq('product_id', productId);
        if (error) throw error;
      }

      setMessage(`Produit ${newStock === '0' ? 'marqué en rupture' : 'remis en stock'}`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating stock:', error);
      setMessage('Erreur lors de la mise à jour du stock');
      
      // Revert optimistic update on error
      fetchProducts();
    }
  };

  const isOutOfStock = (stock: string) => {
    if (!stock || stock === '') return true;
    const stockNum = parseInt(stock, 10);
    return isNaN(stockNum) || stockNum === 0;
  };

  const handleEditComplete = (updatedProduct?: Product) => {
    // Close any external dialogs handled by ProductEditDialog itself
    
    // If we have the updated product, update the list directly
    if (updatedProduct) {
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.product_id === updatedProduct.product_id 
            ? updatedProduct 
            : product
        )
      );
    } else {
      // Fallback to full refresh
      fetchProducts();
    }
  };

  const handleAddComplete = (newProduct?: Product) => {
    setIsAddDialogOpen(false);
    
    // If we have the new product, add it to the list directly
    if (newProduct) {
      setProducts(prevProducts => [newProduct, ...prevProducts]);
    } else {
      // Fallback to full refresh
      fetchProducts();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Gestion des stocks
            </div>
            {showAddButton && (
              <InstantDialog
                isOpen={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                trigger={
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter un produit
                  </Button>
                }
                title="Ajouter un nouveau produit"
                description="Remplissez les informations du nouveau produit ci-dessous."
                onComplete={handleAddComplete}
              />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher un produit ou une marque..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {message && (
            <Alert>
              {message}
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              {error}
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-4">Chargement...</div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {products.map((product) => {
                if (!product || !product.product_id) {
                  console.warn('Invalid product data:', product);
                  return null;
                }
                return (
                <div
                  key={product.product_id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-3 border rounded-lg gap-3"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img
                      src={product.image_url || '/placeholder.svg'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium truncate">{product.name}</h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {product.brand} • {product.price}€
                      </p>
                      <p className="text-xs text-muted-foreground md:hidden">
                        Stock: {product.stock_quantity} {parseInt(product.stock_quantity, 10) > 1 ? 'unités' : 'unité'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row md:items-center gap-2 md:gap-3 flex-shrink-0">
                    <div className="hidden md:block text-sm text-muted-foreground whitespace-nowrap">
                      Stock: {product.stock_quantity} {parseInt(product.stock_quantity, 10) > 1 ? 'unités' : 'unité'}
                    </div>
                    
                    <div className="flex items-center gap-2 justify-between sm:justify-start">
                      <Badge 
                        variant={isOutOfStock(product.stock_quantity) ? "destructive" : "default"}
                        className={`flex items-center gap-1 flex-shrink-0 ${
                          !isOutOfStock(product.stock_quantity) 
                            ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-200" 
                            : ""
                        }`}
                      >
                        {isOutOfStock(product.stock_quantity) ? (
                          <>
                            <AlertTriangle className="h-3 w-3" />
                            <span className="hidden sm:inline">Rupture</span>
                            <span className="sm:hidden">!</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            <span className="hidden sm:inline">En stock</span>
                            <span className="sm:hidden">✓</span>
                          </>
                        )}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={isOutOfStock(product.stock_quantity) ? "default" : "outline"}
                          onClick={() => toggleStockStatus(product.product_id, product.stock_quantity)}
                          className="text-xs sm:text-sm flex-shrink-0"
                        >
                          <span className="hidden lg:inline">
                            {isOutOfStock(product.stock_quantity) ? 'Remettre en stock' : 'Marquer rupture'}
                          </span>
                          <span className="lg:hidden">
                            {isOutOfStock(product.stock_quantity) ? 'Stock' : 'Rupture'}
                          </span>
                        </Button>

                        <ProductEditDialog
                          trigger={<Button size="sm" variant="outline" className="flex-shrink-0" onClick={() => { console.log('[ProductManagement] Edit click', product.product_id); setEditOpenId(product.product_id); }}>Modifier</Button>}
                          product={product}
                          brandOptions={brandOptions}
                          open={editOpenId === product.product_id}
                          onOpenChange={(open) => { console.log('[ProductManagement] Dialog open change', product.product_id, open); setEditOpenId(open ? product.product_id : null); }}
                          onUpdated={(updated) => {
                            console.log('[ProductManagement] onUpdated', updated.product_id);
                            setProducts(prev => prev.map(p => p.product_id === updated.product_id ? updated : p));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
              })}
              
              {products.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun produit trouvé
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManagement;