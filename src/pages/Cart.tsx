import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Check, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { usePromoCode } from "@/hooks/usePromoCode";
import { getProductSlug } from "@/lib/types";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { authUser, isClient } = useAuth();
  const { 
    loading: promoLoading, 
    appliedPromoCode, 
    validatePromoCode, 
    removePromoCode 
  } = usePromoCode();
  
  const [promoCodeInput, setPromoCodeInput] = useState("");
  
  const subtotal = getTotalPrice();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const discountAmount = appliedPromoCode?.discount_amount || 0;
  const total = subtotal + shipping - discountAmount;

  const handleApplyPromoCode = async () => {
    if (!promoCodeInput.trim()) return;
    await validatePromoCode(promoCodeInput.trim(), subtotal);
  };

  const handleRemovePromoCode = () => {
    removePromoCode();
    setPromoCodeInput("");
  };

  // Only clients can access the cart
  if (authUser && !isClient()) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Accès restreint
          </h1>
          <p className="text-muted-foreground mb-8">
            Le panier n'est accessible qu'aux clients.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
            <Link to="/catalogue">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voir le catalogue
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Votre panier est vide
          </h1>
          <p className="text-muted-foreground mb-8">
            Découvrez notre sélection de sneakers reconditionnées et ajoutez vos coups de cœur !
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
            <Link to="/catalogue">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Continuer le shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" className="mb-4" asChild>
          <Link to="/catalogue">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continuer le shopping
          </Link>
        </Button>
        <h1 className="font-display text-4xl font-bold text-foreground">
          Mon panier ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={`${item.product.product_id}-${item.selectedSize}-${item.selectedColor}`} className="border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <Link to={`/product/${getProductSlug(item.product.name)}`}>
                      <img 
                        src={item.product.image_url || '/placeholder.svg'} 
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </Link>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">{item.product.brand}</p>
                        <Link to={`/product/${getProductSlug(item.product.name)}`}>
                          <h3 className="font-display font-semibold text-foreground hover:text-primary cursor-pointer">{item.product.name}</h3>
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {item.product.category}
                          </Badge>
                          {item.selectedSize && (
                            <span className="text-sm text-muted-foreground">Taille: {item.selectedSize}</span>
                          )}
                          {item.selectedColor && (
                            <span className="text-sm text-muted-foreground">Couleur: {item.selectedColor}</span>
                          )}
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeFromCart(item.product.product_id, item.selectedSize, item.selectedColor)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-foreground">{parseFloat(item.product.price).toFixed(2)}€</span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.product_id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.product_id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Promo Code */}
          <Card className="border-0 shadow-soft">
            <CardContent className="p-6">
              <h3 className="font-display font-semibold text-foreground mb-4">
                Code promo
              </h3>
              
              {appliedPromoCode?.success ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">
                        Code "{localStorage.getItem('appliedPromoCode')}" appliqué
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleRemovePromoCode}
                      className="text-green-700 hover:text-green-900"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-green-600">
                    -{appliedPromoCode.discount_type === 'percent' ? `${appliedPromoCode.discount_value}%` : `${appliedPromoCode.discount_value}€`} 
                    • Économie : {discountAmount.toFixed(2)}€
                  </p>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input 
                    placeholder="Entrez votre code promo" 
                    className="flex-1"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                    disabled={promoLoading}
                  />
                  <Button 
                    variant="outline"
                    onClick={handleApplyPromoCode}
                    disabled={promoLoading || !promoCodeInput.trim()}
                  >
                    {promoLoading ? 'Vérification...' : 'Appliquer'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-large sticky top-4">
            <CardContent className="p-6 space-y-6">
              <h3 className="font-display text-xl font-semibold text-foreground">
                Récapitulatif
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-muted-foreground">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)}€</span>
                </div>
                
                {appliedPromoCode?.success && (
                  <div className="flex justify-between text-green-600">
                    <span>Réduction</span>
                    <span>-{discountAmount.toFixed(2)}€</span>
                  </div>
                )}
                
                <div className="flex justify-between text-muted-foreground">
                  <span>Livraison</span>
                  <span>{shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)}€`}</span>
                </div>
                
                {shipping === 0 && (
                  <p className="text-xs text-primary">
                    ✓ Livraison gratuite (commande supérieure à 100€)
                  </p>
                )}

                <Separator />
                
                <div className="flex justify-between font-semibold text-foreground text-lg">
                  <span>Total</span>
                  <span>{total.toFixed(2)}€</span>
                </div>
              </div>

              <Button 
                className="w-full bg-primary hover:bg-primary/90" 
                size="lg"
                onClick={() => {
                  console.log('[Cart] proceed to checkout click', {
                    items: cartItems.length,
                    subtotal: subtotal.toFixed(2),
                    total: total.toFixed(2)
                  });
                  navigate('/checkout');
                }}
              >
                Procéder au paiement
              </Button>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Paiement sécurisé • Retour gratuit sous 30 jours
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;