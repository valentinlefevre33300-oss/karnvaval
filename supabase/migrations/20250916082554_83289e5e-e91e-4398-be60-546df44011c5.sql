-- Ajouter la colonne promo_code_id à la table orders
ALTER TABLE public.orders 
ADD COLUMN promo_code_id uuid REFERENCES public.promo_codes(id);

-- Ajouter des colonnes pour stocker les informations de réduction
ALTER TABLE public.orders 
ADD COLUMN promo_code_used text,
ADD COLUMN discount_amount numeric DEFAULT 0;

-- Activer RLS sur la table promo_codes
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- Permettre à tout le monde de lire les codes promo (pour la vérification)
CREATE POLICY "Promo codes are readable by everyone" 
ON public.promo_codes 
FOR SELECT 
USING (true);

-- Seuls les admins peuvent gérer les codes promo
CREATE POLICY "Only admins can manage promo codes" 
ON public.promo_codes 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fonction pour vérifier et appliquer un code promo
CREATE OR REPLACE FUNCTION public.apply_promo_code(
  p_code text,
  p_order_total numeric
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  promo_record record;
  discount_amount numeric := 0;
  result jsonb;
BEGIN
  -- Chercher le code promo
  SELECT * INTO promo_record
  FROM public.promo_codes
  WHERE code = p_code;
  
  -- Vérifier si le code existe
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Code promo invalide'
    );
  END IF;
  
  -- Vérifier la date de début de validité
  IF promo_record.valid_from IS NOT NULL AND promo_record.valid_from > NOW() THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Ce code promo n''est pas encore actif'
    );
  END IF;
  
  -- Vérifier la date de fin de validité
  IF promo_record.valid_until IS NOT NULL AND promo_record.valid_until < NOW() THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Ce code promo a expiré'
    );
  END IF;
  
  -- Vérifier le nombre d'utilisations
  IF promo_record.max_uses IS NOT NULL AND promo_record.uses_count >= promo_record.max_uses THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Ce code promo a atteint sa limite d''utilisation'
    );
  END IF;
  
  -- Calculer la réduction
  IF promo_record.discount_type = 'percent' THEN
    discount_amount := (p_order_total * promo_record.discount_value / 100);
  ELSIF promo_record.discount_type = 'fixed' THEN
    discount_amount := promo_record.discount_value;
  END IF;
  
  -- S'assurer que la réduction ne dépasse pas le total
  discount_amount := LEAST(discount_amount, p_order_total);
  
  RETURN jsonb_build_object(
    'success', true,
    'promo_code_id', promo_record.id,
    'discount_amount', discount_amount,
    'discount_type', promo_record.discount_type,
    'discount_value', promo_record.discount_value
  );
END;
$$;

-- Fonction pour incrémenter le compteur d'utilisation d'un code promo
CREATE OR REPLACE FUNCTION public.increment_promo_code_usage(p_promo_code_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.promo_codes 
  SET uses_count = uses_count + 1 
  WHERE id = p_promo_code_id;
END;
$$;