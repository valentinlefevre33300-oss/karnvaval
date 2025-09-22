import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Share2, Shield, Truck, RotateCcw, ArrowLeft, Check } from 'lucide-react';
import { Product, parseProductSizes, parseProductColors, getProductSlug, parseStockBySize } from '@/lib/types';
import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/hooks/useCart';
import { toast } from '@/hooks/use-toast';
import { Product3DViewer } from '@/components/3d/SketchfabViewer';
import { formatWithParagraphs } from '@/lib/text-utils';
const ProductPage = () => {
  const {
    slug
  } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [stockBySize, setStockBySize] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<string>('description');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isPressed, setIsPressed] = useState(false);
  const {
    toggleFavorite,
    isFavorite
  } = useFavorites();
  const {
    addToCart
  } = useCart();
  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        setLoading(true);

        // Search by matching the generated slug with the product name
        const {
          data,
          error
        } = await supabase.from('products').select('*');
        if (error) throw error;

        // Find product by matching slug
        const foundProduct = data?.find(p => getProductSlug(p.name) === slug);
        if (foundProduct) {
          const normalized: Product = {
            ...foundProduct,
            sizes: Array.isArray(foundProduct.sizes)
              ? foundProduct.sizes.map(String)
              : typeof foundProduct.sizes === 'string'
                ? foundProduct.sizes
                : String(foundProduct.sizes ?? ''),
          };
          setProduct(normalized);
          // parse per-size stock if present
          // @ts-expect-error DB may return any for JSONB
          setStockBySize(parseStockBySize(foundProduct.stock_by_size));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);
  if (loading) {
    return <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="aspect-square" />)}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-12 w-1/3" />
          </div>
        </div>
      </div>;
  }
  if (!product) {
    return <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
        <p className="text-muted-foreground mb-8">
          Le produit que vous recherchez n'existe pas ou n'est plus disponible.
        </p>
        <Button asChild>
          <Link to="/catalogue">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au catalogue
          </Link>
        </Button>
      </div>;
  }
  const availableSizes = parseProductSizes(product.sizes).sort((a, b) => {
    // Try to parse as numbers first
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    // If not numbers, sort alphabetically
    return a.localeCompare(b);
  });
  const colors = parseProductColors(product.colors_general);
  const normalizedColors = Array.from(new Set(
    colors
      .map((c) => (c ? String(c).trim() : ''))
      .filter(Boolean)
      .map((c) => c.toLowerCase())
  ))
    .map((lc) => lc.charAt(0).toUpperCase() + lc.slice(1));
  const isInStock = parseInt(product.stock_quantity) > 0;
  const handleAddToCart = () => {
    if (!product) return;
    
    // Add press animation
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    
    addToCart(product, selectedSize, selectedColor);
  };
  const handleToggleFavorite = () => {
    if (!product) return;
    toggleFavorite(product);
    const isNowFavorite = !isFavorite(product.product_id);
    toast({
      title: isNowFavorite ? "Ajouté aux favoris" : "Retiré des favoris",
      description: isNowFavorite ? `${product.name} a été ajouté à vos favoris.` : `${product.name} a été retiré de vos favoris.`
    });
  };
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié",
        description: "Le lien du produit a été copié dans le presse-papiers."
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien.",
        variant: "destructive"
      });
    }
  };
  return <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground">Accueil</Link>
        <span>/</span>
        <Link to="/catalogue" className="hover:text-foreground">Catalogue</Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image/3D Section */}
        <div className="space-y-4">
          <Product3DViewer
            modelId={product.model_3d_id}
            productName={product.name}
            imageUrl={product.image_url}
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.category || 'Général'}
            </Badge>
            <p className="text-sm text-muted-foreground mb-2">
              {product.brand?.trim() || 'Marque inconnue'}
            </p>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary">
                    {product.price}€
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    {(parseFloat(product.price) * 1.2).toFixed(2)}€
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Prix barré: prix neuf
                </span>
              </div>
            </div>
            
            {/* Stock Information: per selected size or total (number only) */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Stock disponible:</span>
              <Badge variant={(() => {
                const qty = selectedSize ? stockBySize[selectedSize] ?? 0 : parseInt(product.stock_quantity);
                return qty > 0 ? 'secondary' : 'destructive';
              })() as any}>
                {selectedSize ? (stockBySize[selectedSize] ?? 0) : parseInt(product.stock_quantity)}
              </Badge>
            </div>

            {/* Colors (tags, non-clickable) */}
            {normalizedColors.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">
                  Couleurs
                </label>
                <div className="flex flex-wrap gap-2">
                  {normalizedColors.map((color) => (
                    <Badge key={color} variant="secondary" className="capitalize">
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection (clean pills, no brackets/quotes) */}
            {availableSizes.length > 0 && <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">
                  Taille
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map(size => {
                    const label = String(size).replace(/["'\[\]]/g, '').trim();
                    const qty = stockBySize[size];
                    const disabled = qty !== undefined ? qty <= 0 : !isInStock;
                    return (
                      <button
                        key={label}
                        onClick={() => setSelectedSize(String(size))}
                        className={`px-3 py-1.5 rounded-full border text-sm transition
                          ${disabled
                            ? 'bg-muted text-muted-foreground border-muted opacity-70 saturate-0 cursor-not-allowed'
                            : selectedSize === size
                              ? 'bg-primary text-primary-foreground border-primary cursor-pointer'
                              : 'bg-background text-foreground hover:border-primary cursor-pointer'}`}
                        disabled={disabled}
                        aria-label={`Taille ${label}${qty !== undefined ? `, stock ${qty}` : ''}`}
                        title={disabled ? 'Rupture' : `Stock: ${qty ?? 'n/a'}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                className={`w-full transition-transform duration-150 ${isPressed ? 'scale-95' : 'scale-100'}`} 
                size="lg" 
                disabled={!isInStock || (availableSizes.length > 0 && !selectedSize) || (selectedSize && (stockBySize[selectedSize] ?? 0) <= 0)} 
                onClick={handleAddToCart}
              >
                {!isInStock ? 'Stock épuisé' : 'Ajouter au panier'}
              </Button>
              
              <div className="flex gap-3">
                <Button variant="outline" size="lg" className="flex-1" onClick={handleToggleFavorite}>
                  <Heart className={`mr-2 h-4 w-4 ${isFavorite(product.product_id) ? 'fill-current text-red-500' : ''}`} />
                  {isFavorite(product.product_id) ? 'Dans les favoris' : 'Ajouter aux favoris'}
                </Button>
                
              </div>
            </div>
          </div>

          {/* Guarantees */}
          <div className="space-y-4 pt-6 border-t">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm">Authenticité garantie</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-blue-600" />
              <span className="text-sm">Livraison gratuite dès 100€</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-5 w-5 text-orange-600" />
              <span className="text-sm">Retour gratuit sous 30 jours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        {/* Mobile Select */}
        <div className="block md:hidden mb-6">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner une section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="description">Description</SelectItem>
              <SelectItem value="specs">Caractéristiques</SelectItem>
              <SelectItem value="delivery">Livraison & Retours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="hidden md:grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specs">Caractéristiques</TabsTrigger>
            <TabsTrigger value="delivery">Livraison & Retours</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <p className="text-foreground text-base leading-7 whitespace-pre-line">
                  {formatWithParagraphs(product.description || '')}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="specs" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Marque</h4>
                      <p className="text-muted-foreground">{product.brand?.trim()}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Catégorie</h4>
                      <p className="text-muted-foreground">{product.category}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Tailles disponibles</h4>
                      <p className="text-muted-foreground">
                        {availableSizes.join(', ')}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Stock</h4>
                      <p className="text-muted-foreground">
                        {product.stock_quantity} {parseInt(product.stock_quantity) > 1 ? 'pièces' : 'pièce'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="delivery" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Livraison</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Livraison standard : 3-5 jours ouvrés (gratuite dès 100€)</li>
                      <li>• Livraison express : 1-2 jours ouvrés (9,99€)</li>
                      <li>• Point relais : 2-4 jours ouvrés (4,99€)</li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">Retours</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Retour gratuit sous 30 jours</li>
                      <li>• Produits dans leur état d'origine</li>
                      <li>• Remboursement sous 5-7 jours ouvrés</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};
export default ProductPage;