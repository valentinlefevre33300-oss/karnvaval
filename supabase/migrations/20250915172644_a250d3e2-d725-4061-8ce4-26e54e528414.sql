-- Allow vendors to insert and update products
CREATE POLICY "Vendors can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Vendors can update products" 
ON public.products 
FOR UPDATE 
USING (true);