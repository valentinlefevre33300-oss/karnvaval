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
import { supabase } from '@/integrations/supabase/client';
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

  // Simple client-side validators
  const isValidEmail = (v: string) => /.+@.+\..+/.test(v);
  const onlyDigits = (v: string) => v.replace(/\D+/g, '');
  const isDigits = (v: string) => /^\d+$/.test(v);

  // Payment fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState(''); // MM/AA
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const luhnCheck = (num: string) => {
    const arr = num.split('').reverse().map(n => parseInt(n, 10));
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      let n = arr[i];
      if (i % 2 === 1) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
    }
    return sum % 10 === 0;
  };
  const isValidCardNumber = (v: string) => {
    const d = onlyDigits(v);
    if (d.length < 13 || d.length > 19) return false;
    return luhnCheck(d);
  };
  const isValidExpiry = (v: string) => {
    const m = v.match(/^(\d{2})\/(\d{2})$/);
    if (!m) return false;
    const mm = parseInt(m[1], 10);
    const yy = parseInt(m[2], 10); // 00-99
    if (mm < 1 || mm > 12) return false;
    return true;
  };
  const isValidCVV = (v: string) => /^\d{3,4}$/.test(v);
  
  // Fonction utilitaire pour les classes de validation
  const getValidationClasses = (value: string, isValid: boolean) => {
    if (!value) return ''; // Pas de classe si le champ est vide
    if (isValid) {
      return 'border-green-500 focus-visible:ring-green-500 focus-visible:ring-1';
    } else {
      return 'border-red-500 focus-visible:ring-red-500';
    }
  };

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
      
      // Decrement per-size stocks after payment confirmation (front-only, non-atomic but sufficient here)
      try {
        console.time('[Checkout] update stocks');
        // Aggregate requested quantities per product/size
        const wanted = new Map<string, Map<string, number>>();
        for (const it of orderItems) {
          if (!it.selected_size) continue;
          const pid = it.product_id;
          const size = String(it.selected_size);
          if (!wanted.has(pid)) wanted.set(pid, new Map());
          const m = wanted.get(pid)!;
          m.set(size, (m.get(size) || 0) + (it.quantity || 1));
        }

        const productIds = Array.from(wanted.keys());
        if (productIds.length) {
        const { data: products, error: fetchErr } = await (supabase as any)
          .from('products')
          .select('product_id, stock_by_size, sizes')
          .in('product_id', productIds);
          if (fetchErr) throw fetchErr;

          for (const p of products || []) {
            const pid: string = p.product_id;
            const dec = wanted.get(pid);
            if (!dec) continue;

            // Parse current per-size stock
            let stockMap: Record<string, number> = {};
            const raw = (p as any).stock_by_size;
            if (raw && typeof raw === 'object') stockMap = Object.fromEntries(Object.entries(raw).map(([k,v]) => [String(k), Number(v) || 0]));
            else if (typeof raw === 'string') {
              try { const obj = JSON.parse(raw); stockMap = Object.fromEntries(Object.entries(obj).map(([k,v]) => [String(k), Number(v) || 0])); } catch {}
            }

            // Apply decrements
            for (const [size, q] of dec.entries()) {
              const current = stockMap[size] || 0;
              const next = Math.max(0, current - q);
              stockMap[size] = next;
              console.log('[Checkout] decrement', { product_id: pid, size, current, q, next });
            }

            const newTotal = Object.values(stockMap).reduce((a, b) => a + (Number(b) || 0), 0);
            const newSizes = Object.keys(stockMap).sort((a,b)=>Number(a)-Number(b));

            const { error: upErr } = await supabase
              .from('products' as any)
              .update({
                stock_by_size: stockMap,
                stock_quantity: String(newTotal),
                sizes: newSizes.length ? JSON.stringify(newSizes) : null,
              } as any)
              .eq('product_id', pid);
            if (upErr) throw upErr;
          }
        }
        console.timeEnd('[Checkout] update stocks');
      } catch (stockErr) {
        console.error('[Checkout] stock update error', stockErr);
        // Continue flow; in a real PSP flow, this would be retried/alerted
      }
      
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
                        className={getValidationClasses(shippingInfo.firstName, shippingInfo.firstName.trim() !== '')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                        className={getValidationClasses(shippingInfo.lastName, shippingInfo.lastName.trim() !== '')}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                      className={getValidationClasses(shippingInfo.email, isValidEmail(shippingInfo.email))}
                    />
                    {!isValidEmail(shippingInfo.email) && (
                      <p className="text-xs text-red-600">Veuillez saisir un email valide (avec @).</p>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      inputMode="numeric"
                      placeholder="0601020304"
                      value={shippingInfo.phone}
                      onChange={(e) => {
                        const v = onlyDigits(e.target.value);
                        setShippingInfo({...shippingInfo, phone: v});
                      }}
                      className={getValidationClasses(shippingInfo.phone, isDigits(shippingInfo.phone) && shippingInfo.phone.length >= 10)}
                    />
                    {shippingInfo.phone === '' && (
                      <p className="text-xs text-muted-foreground">Chiffres uniquement.</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                      placeholder="123 rue de la Paix"
                      className={getValidationClasses(shippingInfo.address, shippingInfo.address.trim() !== '')}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        className={getValidationClasses(shippingInfo.city, shippingInfo.city.trim() !== '')}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="postalCode">Code postal</Label>
                      <Input
                        id="postalCode"
                        inputMode="numeric"
                        placeholder="75001"
                        value={shippingInfo.postalCode}
                        onChange={(e) => {
                          const v = onlyDigits(e.target.value);
                          setShippingInfo({...shippingInfo, postalCode: v});
                        }}
                        className={getValidationClasses(shippingInfo.postalCode, shippingInfo.postalCode.length === 5)}
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
                disabled={!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.address || !isValidEmail(shippingInfo.email) || !isDigits(shippingInfo.phone) || shippingInfo.postalCode.length < 4}
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
                        <Input 
                          id="cardNumber" 
                          placeholder="1234 5678 9012 3456"
                          inputMode="numeric"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/[^\d ]/g, ''))}
                          className={getValidationClasses(cardNumber, isValidCardNumber(cardNumber))}
                        />
                        {cardNumber && !isValidCardNumber(cardNumber) && (
                          <p className="text-xs text-red-600">Numéro de carte invalide.</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Date d'expiration</Label>
                          <Input 
                            id="expiryDate" 
                            placeholder="MM/AA"
                            value={cardExpiry}
                            onChange={(e) => {
                              let v = e.target.value.replace(/[^\d]/g, '');
                              if (v.length > 4) v = v.slice(0,4);
                              if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2);
                              setCardExpiry(v);
                            }}
                            className={getValidationClasses(cardExpiry, isValidExpiry(cardExpiry))}
                          />
                          {cardExpiry && !isValidExpiry(cardExpiry) && (
                            <p className="text-xs text-red-600">Format attendu MM/AA.</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input 
                            id="cvv" 
                            placeholder="123" 
                            inputMode="numeric"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(onlyDigits(e.target.value).slice(0,4))}
                            className={getValidationClasses(cardCvv, isValidCVV(cardCvv))}
                          />
                          {cardCvv && !isValidCVV(cardCvv) && (
                            <p className="text-xs text-red-600">3 ou 4 chiffres.</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Nom sur la carte</Label>
                        <Input 
                          id="cardName" 
                          placeholder="John Doe" 
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className={getValidationClasses(cardName, cardName.trim() !== '')}
                        />
                        {cardName === '' && (
                          <p className="text-xs text-red-600">Nom requis.</p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button variant="outline" onClick={() => setCurrentStep(1)} className="w-full sm:flex-1">
                  Retour
                </Button>
                <Button 
                  onClick={() => setCurrentStep(3)} 
                  className="w-full sm:flex-1"
                  disabled={paymentMethod === 'card' && (!isValidCardNumber(cardNumber) || !isValidExpiry(cardExpiry) || !isValidCVV(cardCvv) || cardName === '')}
                >
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