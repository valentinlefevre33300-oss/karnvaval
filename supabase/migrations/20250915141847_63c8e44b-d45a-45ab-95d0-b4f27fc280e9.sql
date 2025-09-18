-- Fix security issue: Update function with proper search_path
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  order_num TEXT;
  counter INTEGER;
BEGIN
  -- Get the current date in YYYYMMDD format
  SELECT 'KRN' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' INTO order_num;
  
  -- Get the count of orders created today
  SELECT COUNT(*) + 1 INTO counter
  FROM public.orders 
  WHERE DATE(created_at) = CURRENT_DATE;
  
  -- Append the counter with zero padding
  order_num := order_num || LPAD(counter::TEXT, 4, '0');
  
  RETURN order_num;
END;
$$;