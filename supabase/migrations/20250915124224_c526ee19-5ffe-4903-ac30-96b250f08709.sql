-- Suppression des anciens produits
DELETE FROM public.products;

-- Suppression des anciennes marques et création des nouvelles
DELETE FROM public.brands;
INSERT INTO public.brands (name, slug) VALUES 
('Adidas', 'adidas'),
('ASICS', 'asics'),
('New Balance', 'new-balance'),
('Nike', 'nike'),
('Converse', 'converse'),
('Vans', 'vans'),
('Puma', 'puma'),
('Dr. Martens', 'dr-martens');

-- Suppression des anciennes catégories et création des nouvelles
DELETE FROM public.categories;
INSERT INTO public.categories (name, slug) VALUES 
('Unisexe', 'unisexe'),
('Enfant', 'enfant'),
('Homme', 'homme'),
('Femme', 'femme');

-- Insertion des nouveaux produits basés sur votre fichier Excel
INSERT INTO public.products (name, slug, description, brand_id, category_id, price, original_price, condition, size_eu, images, rating, review_count) 
SELECT 
  'Predator Sala Zero Metallic', 'adidas-predator-sala-zero-metallic-unisexe', 
  'Découvrez l''alliance parfaite entre style intemporel et innovation avec ces baskets signées Adidas.',
  b.id, c.id, 120.00, 150.00, 'excellent', 39, 
  ARRAY['https://cdn.etrias.nl/media/cache/product_thumb_md/a/d/adidas_unisex_predator_sala_zero_metallic_core_black_gum_7.jpg'],
  4.8, 45
FROM public.brands b, public.categories c 
WHERE b.slug = 'adidas' AND c.slug = 'unisexe';

INSERT INTO public.products (name, slug, description, brand_id, category_id, price, original_price, condition, size_eu, images, rating, review_count) 
SELECT 
  'Predator Sala Zero Metallic Kids', 'adidas-predator-sala-zero-metallic-enfant', 
  'Baskets qui allient à la perfection performance sportive et style moderne, idéales pour les jeunes passionnés.',
  b.id, c.id, 90.00, 120.00, 'excellent', 37, 
  ARRAY['https://cdn.etrias.nl/media/cache/product_thumb_md/a/d/adidas_junior_predator_sala_zero_metallic_core_black_cloud_white_8.jpg'],
  4.7, 23
FROM public.brands b, public.categories c 
WHERE b.slug = 'adidas' AND c.slug = 'enfant';

INSERT INTO public.products (name, slug, description, brand_id, category_id, price, original_price, condition, size_eu, images, rating, review_count) 
SELECT 
  'Samba LT Legend Earth', 'adidas-samba-lt-legend-earth', 
  'Alliance parfaite entre héritage sportif et modernité avec ces baskets Adidas.',
  b.id, c.id, 130.00, 170.00, 'tres_bon', 42, 
  ARRAY['https://cdn.etrias.nl/media/cache/product_thumb_md/a/d/adidas_unisex_samba_lt_legend_earth_silver_metallic_gum_8.jpg'],
  4.9, 76
FROM public.brands b, public.categories c 
WHERE b.slug = 'adidas' AND c.slug = 'unisexe';

INSERT INTO public.products (name, slug, description, brand_id, category_id, price, original_price, condition, size_eu, images, rating, review_count) 
SELECT 
  'Montreal RM Collegiate Green', 'adidas-montreal-rm-collegiate-green', 
  'Alliance parfaite entre héritage sportif et modernité pour hommes exigeants.',
  b.id, c.id, 110.00, 140.00, 'bon', 42, 
  ARRAY['https://cdn.etrias.nl/media/cache/product_thumb_md/a/d/adidas_men_montreal_rm_collegiate_green_cloud_white_core_black_6.jpg'],
  4.6, 34
FROM public.brands b, public.categories c 
WHERE b.slug = 'adidas' AND c.slug = 'homme';

INSERT INTO public.products (name, slug, description, brand_id, category_id, price, original_price, condition, size_eu, images, rating, review_count) 
SELECT 
  'Handball Spezial Lucid Blue', 'adidas-handball-spezial-lucid-blue', 
  'Élégance intemporelle associée au confort moderne avec cette paire inspirée du style rétro.',
  b.id, c.id, 110.00, 135.00, 'excellent', 38, 
  ARRAY['https://cdn.etrias.nl/media/cache/product_thumb_md/a/d/adidas_women_handball_spezial_lucid_blue_lime_burst_lucid_pink_6.jpg'],
  4.8, 56
FROM public.brands b, public.categories c 
WHERE b.slug = 'adidas' AND c.slug = 'femme';

INSERT INTO public.products (name, slug, description, brand_id, category_id, price, original_price, condition, size_eu, images, rating, review_count) 
SELECT 
  'Handball Spezial Lucid Pink', 'adidas-handball-spezial-lucid-pink', 
  'Alliance entre héritage sportif et style contemporain avec design iconique des années 70.',
  b.id, c.id, 110.00, 135.00, 'tres_bon', 38, 
  ARRAY['https://cdn.etrias.nl/media/cache/product_thumb_md/a/d/adidas_women_handball_spezial_lucid_pink_collegiate_purple_almost_yellow_7.jpg'],
  4.7, 43
FROM public.brands b, public.categories c 
WHERE b.slug = 'adidas' AND c.slug = 'femme';

INSERT INTO public.products (name, slug, description, brand_id, category_id, price, original_price, condition, size_eu, images, rating, review_count) 
SELECT 
  'Handball Spezial Focus Olive', 'adidas-handball-spezial-focus-olive', 
  'Alliance entre héritage sportif et style contemporain inspirée des modèles emblématiques des années 70.',
  b.id, c.id, 110.00, 140.00, 'bon', 42, 
  ARRAY['https://cdn.etrias.nl/media/cache/product_thumb_md/a/d/adidas_men_handball_spezial_focus_olive_fox_brown_gum_12.jpg'],
  4.6, 29
FROM public.brands b, public.categories c 
WHERE b.slug = 'adidas' AND c.slug = 'homme';

INSERT INTO public.products (name, slug, description, brand_id, category_id, price, original_price, condition, size_eu, images, rating, review_count) 
SELECT 
  'Gazelle Indoor Pure Teal', 'adidas-gazelle-indoor-pure-teal', 
  'Alliance entre élégance rétro et innovation moderne avec couleur Pure Teal audacieuse.',
  b.id, c.id, 120.00, 150.00, 'excellent', 38, 
  ARRAY['https://cdn.etrias.nl/media/cache/product_thumb_md/a/d/adidas_women_gazelle_indoor_pure_teal_off_white_gold_metallic_7.jpg'],
  4.9, 67
FROM public.brands b, public.categories c 
WHERE b.slug = 'adidas' AND c.slug = 'femme';

INSERT INTO public.products (name, slug, description, brand_id, category_id, price, original_price, condition, size_eu, images, rating, review_count) 
SELECT 
  'Gazelle Bold Ash Green', 'adidas-gazelle-bold-ash-green', 
  'Alliance parfaite entre héritage et modernité avec design rétro inspiré des années 70.',
  b.id, c.id, 120.00, 155.00, 'tres_bon', 38, 
  ARRAY['https://cdn.etrias.nl/media/cache/product_thumb_md/a/d/adidas_women_gazelle_bold_ash_green_off_white_gum_16.jpg'],
  4.7, 38
FROM public.brands b, public.categories c 
WHERE b.slug = 'adidas' AND c.slug = 'femme';

INSERT INTO public.products (name, slug, description, brand_id, category_id, price, original_price, condition, size_eu, images, rating, review_count) 
SELECT 
  'Gazelle Bold Trace Brown', 'adidas-gazelle-bold-trace-brown', 
  'Alliance entre style rétro et confort moderne avec triple semelle plateforme tendance.',
  b.id, c.id, 120.00, 155.00, 'excellent', 38, 
  ARRAY['https://cdn.etrias.nl/media/cache/product_thumb_md/a/d/adidas_women_gazelle_bold_trace_brown_clear_pink_earth_strata_7.jpg'],
  4.8, 51
FROM public.brands b, public.categories c 
WHERE b.slug = 'adidas' AND c.slug = 'femme';

INSERT INTO public.products (name, slug, description, brand_id, category_id, price, original_price, condition, size_eu, images, rating, review_count) 
SELECT 
  'Superstar II Off White', 'adidas-superstar-ii-off-white', 
  'Élégance intemporelle alliée à la performance inspirée par l''héritage du basketball des années 70.',
  b.id, c.id, 120.00, 160.00, 'excellent', 38, 
  ARRAY['https://cdn.etrias.nl/media/cache/product_thumb_md/a/d/adidas_women_superstar_ii_off_white_core_black_off_white_8.jpg'],
  4.9, 84
FROM public.brands b, public.categories c 
WHERE b.slug = 'adidas' AND c.slug = 'femme';

INSERT INTO public.products (name, slug, description, brand_id, category_id, price, original_price, condition, size_eu, images, rating, review_count) 
SELECT 
  'JOG 100S White', 'asics-jog-100s-white', 
  'Confort ultime et style intemporel inspirés des modèles emblématiques d''archives ASICS.',
  b.id, c.id, 110.00, 140.00, 'tres_bon', 39, 
  ARRAY['https://cdn.etrias.nl/media/cache/product_thumb_md/a/s/asics_women_jog_100s_whitecream_6.jpg'],
  4.6, 32
FROM public.brands b, public.categories c 
WHERE b.slug = 'asics' AND c.slug = 'femme';

INSERT INTO public.products (name, slug, description, brand_id, category_id, price, original_price, condition, size_eu, images, rating, review_count) 
SELECT 
  'JOG 100S Black', 'asics-jog-100s-black', 
  'Confort ultime et style intemporel avec technologies modernes et matériaux recyclés.',
  b.id, c.id, 110.00, 140.00, 'bon', 39, 
  ARRAY['https://cdn.etrias.nl/media/cache/product_thumb_md/a/s/asics_women_jog_100s_blackblack_6.jpg'],
  4.7, 41
FROM public.brands b, public.categories c 
WHERE b.slug = 'asics' AND c.slug = 'femme';