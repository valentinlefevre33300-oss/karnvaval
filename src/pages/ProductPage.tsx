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
import { Product, parseProductSizes, parseProductColors, getProductSlug } from '@/lib/types';
import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/hooks/useCart';
import { toast } from '@/hooks/use-toast';
const ProductPage = () => {
  const {
    slug
  } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
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
          setProduct(foundProduct);
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
        {/* Image Section */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img src={product.image_url || '/placeholder.svg'} alt={product.name} className="w-full h-full object-cover" onError={e => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }} />
          </div>
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
              {!isInStock && <Badge variant="destructive">Stock épuisé</Badge>}
            </div>
            
            {/* Stock Information */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Stock disponible:</span>
              <Badge variant={isInStock ? "secondary" : "destructive"}>
                {product.stock_quantity} {parseInt(product.stock_quantity) > 1 ? 'unités' : 'unité'}
              </Badge>
            </div>

            {/* Size Selection */}
            {availableSizes.length > 0 && <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">
                  Taille
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map(size => <Button key={size} variant={selectedSize === size ? 'default' : 'outline'} onClick={() => setSelectedSize(size)} className={`px-4 py-2 rounded-lg transition-all ${selectedSize === size ? 'bg-primary text-primary-foreground shadow-md scale-105' : 'hover:scale-105 hover:border-primary'}`} disabled={!isInStock}>
                      {size}
                    </Button>)}
                </div>
              </div>}

            {/* Colors */}
            {(() => {
              const allColors = [...colors];
              if (product.colors_general?.toLowerCase().includes('noir') && !allColors.some(c => c.toLowerCase() === 'noir')) {
                allColors.push('Noir');
              }
              if (product.colors_general?.toLowerCase().includes('blanc') && !allColors.some(c => c.toLowerCase() === 'blanc')) {
                allColors.push('Blanc');
              }
              const uniqueColors = Array.from(new Set(allColors.map(c => c.toLowerCase()))).map(c => 
                allColors.find(color => color.toLowerCase() === c) || c
              );
              
              return uniqueColors.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground">
                    Couleur
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {uniqueColors.map(color => (
                      <Button 
                        key={color} 
                        variant={selectedColor === color ? 'default' : 'outline'} 
                        onClick={() => setSelectedColor(color)} 
                        className={`px-4 py-2 rounded-lg transition-all capitalize ${selectedColor === color ? 'bg-primary text-primary-foreground shadow-md scale-105' : 'hover:scale-105 hover:border-primary'}`} 
                        disabled={!isInStock}
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                className={`w-full transition-transform duration-150 ${isPressed ? 'scale-95' : 'scale-100'}`} 
                size="lg" 
                disabled={!isInStock || availableSizes.length > 0 && !selectedSize} 
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
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
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