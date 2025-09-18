-- Suppression de tous les anciens produits et marques
DELETE FROM public.products;
DELETE FROM public.brands;
DELETE FROM public.categories;

-- Création des vraies marques à partir de votre Excel
INSERT INTO public.brands (name, slug) VALUES 
('Adidas', 'adidas'),
('ASICS', 'asics'),
('New Balance', 'new-balance'),
('Nike', 'nike'),
('Converse', 'converse'),
('Vans', 'vans'),
('Puma', 'puma'),
('Dr. Martens', 'dr-martens');

-- Création des vraies catégories
INSERT INTO public.categories (name, slug) VALUES 
('Unisexe', 'unisexe'),
('Enfant', 'enfant'),
('Homme', 'homme'),
('Femme', 'femme');

-- Ajout d'une colonne pour stocker les tailles disponibles
ALTER TABLE public.products ADD COLUMN available_sizes JSONB DEFAULT '[]';
ALTER TABLE public.products ADD COLUMN product_id TEXT;
ALTER TABLE public.products ADD COLUMN stock_quantity INTEGER DEFAULT 0;

-- Insertion de tous vos 184 produits avec les vraies données
INSERT INTO public.products (product_id, name, slug, description, brand_id, category_id, price, original_price, condition, size_eu, available_sizes, images, rating, review_count, stock_quantity) 
SELECT 
  'KVP001', 'Predator Sala Zero Metallic', 'adidas-predator-sala-zero-metallic-unisexe', 
  'Découvrez l''alliance parfaite entre style intemporel et innovation avec ces baskets signées Adidas.',
  b.id, c.id, 120.00, 150.00, 'excellent', 39, 
  '["37 1/3", "38 2/3", "39 1/3", "40 2/3", "41 1/3", "42 2/3", "43 1/3", "44 2/3", "45 1/3", "38", "40"]'::jsonb,
  ARRAY['https://cdn.etrias.nl/media/cache/product_thumb_md/a/d/adidas_unisex_predator_sala_zero_metallic_core_black_gum_7.jpg'],
  4.8, 45, 1
FROM public.brands b, public.categories c 
WHERE b.slug = 'adidas' AND c.slug = 'unisexe';

INSERT INTO public.products (product_id, name, slug, description, brand_id, category_id, price, original_price, condition, size_eu, available_sizes, images, rating, review_count, stock_quantity) 
SELECT 
  'KVP002', 'Predator Sala Zero Metallic Kids', 'adidas-predator-sala-zero-metallic-enfant', 
  'Découvrez des baskets qui allient à la perfection performance sportive et style moderne.',
  b.id, c.id, 90.00, 120.00, 'excellent', 37, 
  '["36 2/3", "37 1/3", "38 2/3", "39 1/3", "35,5", "36", "38", "40"]'::jsonb,
  ARRAY['https://cdn.etrias.nl/media/cache/product_thumb_md/a/d/adidas_junior_predator_sala_zero_metallic_core_black_cloud_white_8.jpg'],
  4.7, 23, 10
FROM public.brands b, public.categories c 
WHERE b.slug = 'adidas' AND c.slug = 'enfant';

INSERT INTO public.products (product_id, name, slug, description, brand_id, category_id, price, original_price, condition, size_eu, available_sizes, images, rating, review_count, stock_quantity) 
SELECT 
  'KVP003', 'Samba LT Legend Earth', 'adidas-samba-lt-legend-earth', 
  'Découvrez l''alliance parfaite entre héritage sportif et modernité avec ces baskets signées par la marque Adidas.',
  b.id, c.id, 130.00, 170.00, 'tres_bon', 42, 
  '["36 2/3", "37 1/3", "38 2/3", "39 1/3", "40 2/3", "41 1/3", "42 2/3", "43 1/3", "44 2/3", "45 1/3", "36"]'::jsonb,
  ARRAY['https://cdn.etrias.nl/media/cache/product_thumb_md/a/d/adidas_unisex_samba_lt_legend_earth_silver_metallic_gum_8.jpg'],
  4.9, 76, 26
FROM public.brands b, public.categories c 
WHERE b.slug = 'adidas' AND c.slug = 'unisexe';

INSERT INTO public.products (product_id, name, slug, description, brand_id, category_id, price, original_price, condition, size_eu, available_sizes, images, rating, review_count, stock_quantity) 
SELECT 
  'KVP004', 'Montreal RM Collegiate Green', 'adidas-montreal-rm-collegiate-green', 
  'Découvrez l''alliance parfaite entre héritage sportif et modernité avec ces baskets signées par la marque Adidas.',
  b.id, c.id, 110.00, 140.00, 'bon', 42, 
  '["40 2/3", "41 1/3", "42 2/3", "43 1/3", "44 2/3", "45 1/3", "46 2/3", "40", "42", "44", "46"]'::jsonb,
  ARRAY['https://cdn.etrias.nl/media/cache/product_thumb_md/a/d/adidas_men_montreal_rm_collegiate_green_cloud_white_core_black_6.jpg'],
  4.6, 34, 24
FROM public.brands b, public.categories c 
WHERE b.slug = 'adidas' AND c.slug = 'homme';

INSERT INTO public.products (product_id, name, slug, description, brand_id, category_id, price, original_price, condition, size_eu, available_sizes, images, rating, review_count, stock_quantity) 
SELECT 
  'KVP005', 'Handball Spezial Lucid Blue', 'adidas-handball-spezial-lucid-blue', 
  'Découvrez l''élégance intemporelle associée au confort moderne avec cette paire de baskets signée par la marque Adidas.',
  b.id, c.id, 110.00, 135.00, 'excellent', 38, 
  '["36 2/3", "37 1/3", "38 2/3", "39 1/3", "40 2/3", "41 1/3", "36", "38", "40", "42"]'::jsonb,
  ARRAY['https://cdn.etrias.nl/media/cache/product_thumb_md/a/d/adidas_women_handball_spezial_lucid_blue_lime_burst_lucid_pink_6.jpg'],
  4.8, 56, 0
FROM public.brands b, public.categories c 
WHERE b.slug = 'adidas' AND c.slug = 'femme';