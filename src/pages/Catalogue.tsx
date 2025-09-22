import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Grid, List, Filter } from 'lucide-react';
import { Product, parseProductSizes, getProductSlug } from '@/lib/types';
import { FavoriteButton } from '@/components/FavoriteButton';
import { OptimizedImage } from '@/components/OptimizedImage';
import { withRetry, handleApiError } from '@/lib/api-utils';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { cleanTextSimple } from '@/lib/text-utils';
interface Brand {
  id: string;
  name: string;
  slug: string;
}
interface Category {
  id: string;
  name: string;
  slug: string;
}
const Catalogue = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 20;
  const fetchProducts = useCallback(async (reset = false, currentProductsLength = 0, filters = { searchQuery, selectedBrand, selectedCondition, priceRange }) => {
    try {
      setLoading(true);
      
      const queryFn = async () => {
        let query = supabase.from('products').select('*');

        // Apply search filter
        if (filters.searchQuery) {
          query = query.or(`name.ilike.%${filters.searchQuery}%,brand.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
        }

        // Apply brand filter
        if (filters.selectedBrand && filters.selectedBrand !== 'all') {
          query = query.eq('brand', filters.selectedBrand);
        }

        // Apply category filter  
        if (filters.selectedCondition && filters.selectedCondition !== 'all') {
          query = query.eq('category', filters.selectedCondition);
        }

        // Apply price range filter
        if (filters.priceRange !== 'all') {
          const [min, max] = filters.priceRange.split('-').map(Number);
          if (max === 999) {
            query = query.gte('price::numeric', min);
          } else {
            query = query.gte('price::numeric', min).lte('price::numeric', max);
          }
        }

        // Add pagination
        const from = reset ? 0 : currentProductsLength;
        const to = from + ITEMS_PER_PAGE - 1;
        query = query.range(from, to);
        
        const { data, error } = await query;
        if (error) throw error;
        return (data || []) as Product[];
      };

      const processedProducts = await withRetry(queryFn, 2, 500);
      
      if (reset) {
        setProducts(processedProducts);
      } else {
        setProducts(prev => [...prev, ...processedProducts]);
      }
      setHasMore(processedProducts.length === ITEMS_PER_PAGE);
    } catch (error) {
      const apiError = handleApiError(error);
      console.error('Error fetching products:', apiError);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedBrand, selectedCondition, priceRange]);
  const fetchBrandsAndCategories = useCallback(async () => {
    try {
      // Get unique brands
      const {
        data: brandsData
      } = await supabase.from('products').select('brand').not('brand', 'is', null);

      // Get unique categories
      const {
        data: categoriesData
      } = await supabase.from('products').select('category').not('category', 'is', null);
      if (brandsData) {
        const uniqueBrands = [...new Set(brandsData.map(item => item.brand?.trim()))].filter(Boolean).map(name => ({
          id: name,
          name,
          slug: name.toLowerCase()
        }));
        setBrands(uniqueBrands);
      }
      if (categoriesData) {
        const uniqueCategories = [...new Set(categoriesData.map(item => item.category?.trim()))].filter(Boolean).map(name => ({
          id: name,
          name,
          slug: name.toLowerCase()
        }));
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching brands and categories:', error);
    }
  }, []);
  // Initial load
  useEffect(() => {
    fetchBrandsAndCategories();
  }, [fetchBrandsAndCategories]);
  
  // Debounced search effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProducts(true, 0, { searchQuery, selectedBrand, selectedCondition, priceRange });
    }, searchQuery ? 300 : 0); // 300ms debounce for search, immediate for other filters
    
    return () => {
      clearTimeout(timeout);
    };
  }, [searchQuery, selectedBrand, selectedCondition, priceRange, fetchProducts]);
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchProducts(false, products.length, { searchQuery, selectedBrand, selectedCondition, priceRange });
    }
  }, [loading, hasMore, fetchProducts, products.length, searchQuery, selectedBrand, selectedCondition, priceRange]);

  // Infinite scroll hook
  const { loadMoreRef } = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: handleLoadMore,
    threshold: 200
  });
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedBrand('all');
    setSelectedCondition('all');
    setPriceRange('all');
  }, []);

  // Memoize filtered products to prevent unnecessary re-renders
  const filteredProducts = useMemo(() => {
    return products;
  }, [products]);
  if (loading && products.length === 0) {
    return <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <Card key={i}>
              <Skeleton className="aspect-square w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-6 w-1/3" />
              </CardContent>
            </Card>)}
        </div>
      </div>;
  }
  return <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Catalogue</h1>
        <p className="text-muted-foreground">
          Découvrez notre collection complète de sneakers
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
        <Input 
          placeholder="Rechercher..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
          className="w-full" 
        />
        
        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
          <SelectTrigger>
            <SelectValue placeholder="Marque" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les marques</SelectItem>
            {brands.map(brand => <SelectItem key={brand.id} value={brand.name}>
                {brand.name}
              </SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={selectedCondition} onValueChange={setSelectedCondition}>
          <SelectTrigger>
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map(category => <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={priceRange} onValueChange={setPriceRange}>
          
          <SelectContent>
            <SelectItem value="0-50">0€ - 50€</SelectItem>
            <SelectItem value="50-100">50€ - 100€</SelectItem>
            <SelectItem value="100-150">100€ - 150€</SelectItem>
            <SelectItem value="150-200">150€ - 200€</SelectItem>
            <SelectItem value="200-999">200€+</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={resetFilters} className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Reset
        </Button>
      </div>

      {/* View Mode Toggle */}
      

      {/* Products */}
      {products.length === 0 ? <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun produit trouvé</p>
        </div> : <div className="space-y-6">
          {viewMode === 'grid' ? <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map(product => <Link key={product.product_id} to={`/product/${getProductSlug(product.name)}`} className="group">
                  <Card className="group-hover:shadow-lg transition-shadow duration-300">
                    <div className="aspect-square relative overflow-hidden">
                      <OptimizedImage 
                        src={product.image_url || '/placeholder.svg'} 
                        alt={product.name} 
                        className="w-full h-full group-hover:scale-105 transition-transform duration-300" 
                      />
                      <Badge variant="secondary" className="absolute top-2 right-2">
                        {product.category || 'Général'}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {product.brand?.trim() || 'Marque inconnue'}
                        </p>
                        <h3 className="font-semibold text-lg line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-primary">
                              {product.price}€
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {parseProductSizes(product.sizes).slice(0, 4).map((size, index) => <Badge key={index} variant="outline" className="text-xs">
                                {size}
                              </Badge>)}
                            {parseProductSizes(product.sizes).length > 4 && <Badge variant="outline" className="text-xs">
                                +{parseProductSizes(product.sizes).length - 4}
                              </Badge>}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>)}
            </div> : <div className="space-y-4">
              {filteredProducts.map(product => <Link key={product.product_id} to={`/product/${getProductSlug(product.name)}`} className="group">
                  <Card className="group-hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <div className="w-32 h-32 flex-shrink-0">
                          <OptimizedImage 
                            src={product.image_url || '/placeholder.svg'} 
                            alt={product.name} 
                            className="w-full h-full rounded-lg group-hover:scale-105 transition-transform duration-300" 
                          />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {product.brand?.trim() || 'Marque inconnue'}
                            </p>
                            <h3 className="font-semibold text-xl">
                              {product.name}
                            </h3>
                            <Badge variant="secondary" className="mt-2">
                              {product.category || 'Général'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {cleanTextSimple(product.description || '')}
                          </p>
                           <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                               <span className="text-2xl font-bold text-primary">
                                 {product.price}€
                               </span>
                               {product.stock_quantity && <span className="text-sm text-muted-foreground">
                                   Stock: {product.stock_quantity}
                                 </span>}
                             </div>
                             <div className="flex items-center gap-2">
                               <div className="flex flex-wrap gap-1">
                                 {parseProductSizes(product.sizes).slice(0, 6).map((size, index) => <Badge key={index} variant="outline" className="text-xs">
                                     {size}
                                   </Badge>)}
                                 {parseProductSizes(product.sizes).length > 6 && <Badge variant="outline" className="text-xs">
                                     +{parseProductSizes(product.sizes).length - 6}
                                   </Badge>}
                               </div>
                               <FavoriteButton product={product} />
                             </div>
                           </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>)}
            </div>}

          {/* Infinite Scroll Trigger */}
          {hasMore && (
            <div ref={loadMoreRef} className="text-center py-8">
              {loading && (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span>Chargement...</span>
                </div>
              )}
            </div>
          )}
        </div>}
    </div>;
};
export default Catalogue;