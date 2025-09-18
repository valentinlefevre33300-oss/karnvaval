-- Create function to reduce product stock when an order is created
CREATE OR REPLACE FUNCTION public.reduce_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Update product stock for each order item
  UPDATE public.products 
  SET stock_quantity = CAST(
    GREATEST(
      0, 
      CAST(stock_quantity AS INTEGER) - NEW.quantity
    ) AS TEXT
  )
  WHERE product_id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to automatically reduce stock when order items are inserted
CREATE TRIGGER reduce_stock_on_order_item_insert
  AFTER INSERT ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.reduce_product_stock();