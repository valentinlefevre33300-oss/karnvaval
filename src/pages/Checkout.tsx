import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, CreditCard, Truck, Shield, Check, Percent, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { usePromoCode } from '@/hooks/usePromoCode';
import { toast } from '@/hooks/use-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart, cartReady } = useCart();
  const { createOrder } = useOrders();
  const { authUser, loading: authLoading } = useAuth();
  const { loading: promoLoading, appliedPromoCode, validatePromoCode, removePromoCode, incrementPromoCodeUsage } = usePromoCode();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState(localStorage.getItem('appliedPromoCode') || '');
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: authUser?.profile?.first_name || '',
    lastName: authUser?.profile?.last_name || '',
    email: authUser?.email || '',
    phone: authUser?.profile?.phone || '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shippingMethod, setShippingMethod] = useState('standard');

  const subtotal = getTotalPrice();
  const getShippingCost = () => {
    if (subtotal > 100) return 0;
    switch (shippingMethod) {
      case 'express': return 9.99;
      case 'pickup': return 4.99;
      default: return subtotal > 100 ? 0 : 5.99;
    }
  };
  
  const shipping = getShippingCost();
  const discount = appliedPromoCode?.discount_amount || 0;
  const total = subtotal + shipping - discount;

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast({
        title: "Code promo requis",
        description: "Veuillez saisir un code promo",
        variant: "destructive",
      });
      return;
    }

    await validatePromoCode(promoCode.trim(), subtotal + shipping);
  };

  const handleProcessPayment = async () => {
    setLoading(true);
    
    try {
      console.log('[Checkout] start processing', {
        authUserId: authUser?.id,
        cartCount: cartItems.length,
        subtotal,
        shipping,
        discount,
        total,
      });
      if (!authUser) {
        throw new Error('User not authenticated');
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order in database
      const orderData = {
        status: 'confirmed' as const,
        subtotal: Number(subtotal.toFixed(2)),
        shipping_cost: Number(shipping.toFixed(2)),
        total: Number(total.toFixed(2)),
        customer_email: shippingInfo.email,
        customer_first_name: shippingInfo.firstName,
        customer_last_name: shippingInfo.lastName,
        customer_phone: shippingInfo.phone,
        shipping_address: shippingInfo.address,
        shipping_city: shippingInfo.city,
        shipping_postal_code: shippingInfo.postalCode,
        shipping_country: shippingInfo.country,
        shipping_method: shippingMethod,
        payment_method: paymentMethod,
        payment_status: 'completed',
        promo_code_id: appliedPromoCode?.promo_code_id || null,
        promo_code_used: appliedPromoCode?.success ? promoCode : null,
        discount_amount: Number(discount.toFixed(2)),
      };

      const orderItems = cartItems.map(item => ({
        product_id: item.product.product_id,
        product_name: item.product.name,
        product_brand: item.product.brand,
        product_category: item.product.category,
        product_image_url: item.product.image_url,
        price: Number(parseFloat(item.product.price).toFixed(2)),
        quantity: item.quantity,
        selected_size: item.selectedSize,
        selected_color: item.selectedColor,
        total: Number((parseFloat(item.product.price) * item.quantity).toFixed(2)),
      }));
      console.log('[Checkout] creating order with', { orderData, orderItemsCount: orderItems.length });
      const order = await createOrder(orderData, orderItems);
      console.log('[Checkout] order created', { id: order?.id, number: order?.order_number });
      
      // Incrémenter le compteur d'utilisation du code promo si utilisé
      if (appliedPromoCode?.promo_code_id) {
        console.log('[Checkout] increment promo usage', { promo_code_id: appliedPromoCode.promo_code_id });
        await incrementPromoCodeUsage(appliedPromoCode.promo_code_id);
      }
      
      // Clear cart and promo code, show success
      console.log('[Checkout] clearing cart and promo code');
      clearCart();
      localStorage.removeItem('appliedPromoCode');
      localStorage.removeItem('appliedPromoCodeData');
      
      toast({
        title: "Commande confirmée !",
        description: `Votre commande ${order.order_number} a été créée avec succès.`,
      });
      
      // Redirect to success page
      console.log('[Checkout] navigating to /order-success');
      navigate('/order-success');
    } catch (error) {
      console.error('[Checkout] error creating order:', error);
      toast({
        title: "Erreur de paiement",
        description: (error instanceof Error && error.message) ? error.message : "Une erreur est survenue lors du traitement de votre commande.",
        variant: "destructive",
      });
    } finally {
      console.log('[Checkout] end processing');
      setLoading(false);
    }
  };

  if (!cartReady || authLoading) {
    return null;
  }

  if (cartItems.length === 0) {
    console.log('[Checkout] empty cart after ready, redirecting to /cart');
    navigate('/cart');
    return null;
  }

  const steps = [
    { id: 1, title: 'Livraison', icon: Truck },
    { id: 2, title: 'Paiement', icon: CreditCard },
    { id: 3, title: 'Confirmation', icon: Check },
  ];

  return (
      <div className="container mx-auto px-4 py-4 md:py-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <Button variant="ghost" className="mb-4" onClick={() => navigate('/cart')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au panier
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Finaliser la commande</h1>
        
        {/* Progress Steps - Fully Responsive */}
        <div className="hidden sm:flex items-center justify-center space-x-4 md:space-x-8 mb-6 md:mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= step.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                <step.icon className="h-5 w-5" />
              </div>
              <span className={`ml-2 font-medium ${
                currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 md:w-12 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Mobile Progress Steps */}
        <div className="sm:hidden mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Étape {currentStep} sur {steps.length}</span>
            <span className="text-sm font-medium">{steps.find(step => step.id === currentStep)?.title}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={currentStep.toString()} className="w-full">
            <TabsContent value="1" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations de livraison</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                      placeholder="123 rue de la Paix"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Code postal</Label>
                      <Input
                        id="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mode de livraison</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                    <div className="flex items-center space-x-2 p-3 sm:p-4 border rounded-lg">
                      <RadioGroupItem value="standard" id="standard" />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="standard" className="font-medium text-sm sm:text-base">Livraison standard</Label>
                        <p className="text-xs sm:text-sm text-muted-foreground">3-5 jours ouvrés</p>
                      </div>
                      <span className="font-medium text-sm sm:text-base whitespace-nowrap">{subtotal > 100 ? 'Gratuite' : '5,99€'}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 sm:p-4 border rounded-lg">
                      <RadioGroupItem value="express" id="express" />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="express" className="font-medium text-sm sm:text-base">Livraison express</Label>
                        <p className="text-xs sm:text-sm text-muted-foreground">1-2 jours ouvrés</p>
                      </div>
                      <span className="font-medium text-sm sm:text-base whitespace-nowrap">9,99€</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 sm:p-4 border rounded-lg">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="pickup" className="font-medium text-sm sm:text-base">Point relais</Label>
                        <p className="text-xs sm:text-sm text-muted-foreground">2-4 jours ouvrés</p>
                      </div>
                      <span className="font-medium text-sm sm:text-base whitespace-nowrap">4,99€</span>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
              
              <Button 
                onClick={() => setCurrentStep(2)} 
                className="w-full"
                disabled={!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.address}
              >
                Continuer vers le paiement
              </Button>
            </TabsContent>

            <TabsContent value="2" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Méthode de paiement</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-3 sm:p-4 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="card" className="font-medium text-sm sm:text-base">Carte bancaire</Label>
                        <p className="text-xs sm:text-sm text-muted-foreground">Visa, Mastercard, American Express</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 sm:p-4 border rounded-lg">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="paypal" className="font-medium text-sm sm:text-base">PayPal</Label>
                        <p className="text-xs sm:text-sm text-muted-foreground">Paiement sécurisé avec PayPal</p>
                      </div>
                    </div>
                  </RadioGroup>

                  {paymentMethod === 'card' && (
                    <div className="mt-6 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Numéro de carte</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Date d'expiration</Label>
                          <Input id="expiryDate" placeholder="MM/AA" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Nom sur la carte</Label>
                        <Input id="cardName" placeholder="John Doe" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button variant="outline" onClick={() => setCurrentStep(1)} className="w-full sm:flex-1">
                  Retour
                </Button>
                <Button onClick={() => setCurrentStep(3)} className="w-full sm:flex-1">
                  Réviser la commande
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="3" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Récapitulatif de votre commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Adresse de livraison</h4>
                    <p className="text-sm text-muted-foreground">
                      {shippingInfo.firstName} {shippingInfo.lastName}<br />
                      {shippingInfo.address}<br />
                      {shippingInfo.postalCode} {shippingInfo.city}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Mode de paiement</h4>
                    <p className="text-sm text-muted-foreground">
                      {paymentMethod === 'card' ? 'Carte bancaire' : 'PayPal'}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Shield className="h-4 w-4" />
                    Paiement sécurisé SSL
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button variant="outline" onClick={() => setCurrentStep(2)} className="w-full sm:flex-1">
                  Retour
                </Button>
                <Button 
                  onClick={handleProcessPayment} 
                  className="w-full sm:flex-1" 
                  disabled={loading}
                >
                  {loading ? 'Traitement...' : `Payer ${total.toFixed(2)}€`}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Votre commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={`${item.product.product_id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3">
                  <img 
                    src={item.product.image_url || '/placeholder.svg'} 
                    alt={item.product.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {item.selectedSize && `Taille: ${item.selectedSize}`}
                      {item.selectedSize && item.selectedColor && ' • '}
                      {item.selectedColor && `Couleur: ${item.selectedColor}`}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs sm:text-sm">Qté: {item.quantity}</span>
                      <span className="font-medium text-sm">{(parseFloat(item.product.price) * item.quantity).toFixed(2)}€</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <Separator />
              
              {/* Code Promo Section */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Code promo</Label>
                {appliedPromoCode?.success ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        {localStorage.getItem('appliedPromoCode') || promoCode.toUpperCase()} appliqué
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removePromoCode}
                      className="h-auto p-1 text-green-700 hover:text-green-900 dark:text-green-300 dark:hover:text-green-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      placeholder="Entrez votre code promo"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyPromoCode()}
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyPromoCode}
                      disabled={promoLoading || !promoCode.trim()}
                      className="w-full sm:w-auto sm:px-4"
                    >
                      {promoLoading ? 'Vérification...' : 'Appliquer'}
                    </Button>
                  </div>
                )}
              </div>
              
              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Livraison</span>
                  <span>{shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)}€`}</span>
                </div>
                {appliedPromoCode?.success && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                    <span>Réduction ({localStorage.getItem('appliedPromoCode') || promoCode.toUpperCase()})</span>
                    <span>-{discount.toFixed(2)}€</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{total.toFixed(2)}€</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;