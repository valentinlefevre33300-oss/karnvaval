import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface PromoCodeResult {
  success: boolean;
  error?: string;
  promo_code_id?: string;
  discount_amount?: number;
  discount_type?: string;
  discount_value?: number;
}

export const usePromoCode = () => {
  const [loading, setLoading] = useState(false);
  const [appliedPromoCode, setAppliedPromoCode] = useState<PromoCodeResult | null>(() => {
    const stored = localStorage.getItem('appliedPromoCodeData');
    return stored ? JSON.parse(stored) : null;
  });

  const validatePromoCode = async (code: string, orderTotal: number): Promise<PromoCodeResult> => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.rpc('apply_promo_code', {
        p_code: code.toUpperCase(),
        p_order_total: orderTotal
      });

      if (error) {
        throw error;
      }

      const result = data as unknown as PromoCodeResult;
      
      if (result.success) {
        setAppliedPromoCode(result);
        localStorage.setItem('appliedPromoCode', code);
        localStorage.setItem('appliedPromoCodeData', JSON.stringify(result));
        toast({
          title: "Code promo appliqué !",
          description: `Vous économisez ${result.discount_amount?.toFixed(2)}€`,
        });
      } else {
        toast({
          title: "Code promo invalide",
          description: result.error,
          variant: "destructive",
        });
      }

      return result;
    } catch (error) {
      console.error('Error validating promo code:', error);
      const errorResult = { success: false, error: 'Erreur lors de la validation du code promo' };
      toast({
        title: "Erreur",
        description: errorResult.error,
        variant: "destructive",
      });
      return errorResult;
    } finally {
      setLoading(false);
    }
  };

  const removePromoCode = () => {
    setAppliedPromoCode(null);
    localStorage.removeItem('appliedPromoCode');
    localStorage.removeItem('appliedPromoCodeData');
    toast({
      title: "Code promo retiré",
      description: "Le code promo a été retiré de votre commande",
    });
  };

  const incrementPromoCodeUsage = async (promoCodeId: string) => {
    try {
      const { error } = await supabase.rpc('increment_promo_code_usage', {
        p_promo_code_id: promoCodeId
      });

      if (error) {
        console.error('Error incrementing promo code usage:', error);
      }
    } catch (error) {
      console.error('Error incrementing promo code usage:', error);
    }
  };

  return {
    loading,
    appliedPromoCode,
    validatePromoCode,
    removePromoCode,
    incrementPromoCodeUsage,
  };
};