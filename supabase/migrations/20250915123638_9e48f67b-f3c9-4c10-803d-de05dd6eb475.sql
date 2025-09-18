-- Create brands table
CREATE TABLE public.brands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create conditions enum
CREATE TYPE product_condition AS ENUM ('excellent', 'tres_bon', 'bon', 'correct');

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  brand_id UUID NOT NULL REFERENCES public.brands(id),
  category_id UUID NOT NULL REFERENCES public.categories(id),
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2) NOT NULL,
  condition product_condition NOT NULL,
  size_eu INTEGER NOT NULL,
  size_us DECIMAL(3,1),
  size_uk DECIMAL(3,1),
  images TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (products are public)
CREATE POLICY "Brands are viewable by everyone" 
ON public.brands FOR SELECT USING (true);

CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT USING (true);

CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT USING (true);

-- Insert initial brands
INSERT INTO public.brands (name, slug) VALUES 
('Asics', 'asics'),
('Salomon', 'salomon'),
('Adidas', 'adidas');

-- Insert initial categories
INSERT INTO public.categories (name, slug) VALUES 
('Running', 'running'),
('Basketball', 'basketball'),
('Lifestyle', 'lifestyle'),
('Trail', 'trail'),
('Football', 'football');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON public.brands
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (name, slug, description, brand_id, category_id, price, original_price, condition, size_eu, images, rating, review_count) 
SELECT 
  'Gel-Kayano 30', 'asics-gel-kayano-30-42', 'Chaussure de running premium avec technologie GEL', 
  b.id, c.id, 89.99, 140.00, 'excellent', 42, 
  ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'],
  4.8, 124
FROM public.brands b, public.categories c 
WHERE b.slug = 'asics' AND c.slug = 'running';

INSERT INTO public.products (name, slug, description, brand_id, category_id, price, original_price, condition, size_eu, images, rating, review_count) 
SELECT 
  'Ultraboost 23', 'adidas-ultraboost-23-43', 'Chaussure de running avec technologie Boost', 
  b.id, c.id, 95.99, 180.00, 'tres_bon', 43, 
  ARRAY['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop'],
  4.9, 87
FROM public.brands b, public.categories c 
WHERE b.slug = 'adidas' AND c.slug = 'running';

INSERT INTO public.products (name, slug, description, brand_id, category_id, price, original_price, condition, size_eu, images, rating, review_count) 
SELECT 
  'Speedcross 5', 'salomon-speedcross-5-41', 'Chaussure de trail running technique', 
  b.id, c.id, 75.99, 130.00, 'bon', 41, 
  ARRAY['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop'],
  4.7, 156
FROM public.brands b, public.categories c 
WHERE b.slug = 'salomon' AND c.slug = 'trail';

INSERT INTO public.products (name, slug, description, brand_id, category_id, price, original_price, condition, size_eu, images, rating, review_count) 
SELECT 
  'Stan Smith', 'adidas-stan-smith-40', 'Sneaker lifestyle iconique', 
  b.id, c.id, 45.99, 85.00, 'excellent', 40, 
  ARRAY['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop'],
  4.6, 203
FROM public.brands b, public.categories c 
WHERE b.slug = 'adidas' AND c.slug = 'lifestyle';

INSERT INTO public.products (name, slug, description, brand_id, category_id, price, original_price, condition, size_eu, images, rating, review_count) 
SELECT 
  'Gel-Nimbus 25', 'asics-gel-nimbus-25-44', 'Chaussure de running confort maximum', 
  b.id, c.id, 110.99, 160.00, 'excellent', 44, 
  ARRAY['https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop'],
  4.9, 89
FROM public.brands b, public.categories c 
WHERE b.slug = 'asics' AND c.slug = 'running';

INSERT INTO public.products (name, slug, description, brand_id, category_id, price, original_price, condition, size_eu, images, rating, review_count) 
SELECT 
  'XA Pro 3D', 'salomon-xa-pro-3d-42', 'Chaussure de trail polyvalente', 
  b.id, c.id, 65.99, 120.00, 'tres_bon', 42, 
  ARRAY['https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=400&fit=crop'],
  4.4, 167
FROM public.brands b, public.categories c 
WHERE b.slug = 'salomon' AND c.slug = 'trail';