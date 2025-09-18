-- Drop existing products table and recreate with exact CSV structure
DROP TABLE IF EXISTS public.products;

-- Create products table with exact CSV structure
CREATE TABLE public.products (
  product_id TEXT PRIMARY KEY,
  name TEXT,
  brand TEXT,
  description TEXT,
  price TEXT,
  sizes TEXT,
  image_url TEXT,
  stock_quantity TEXT,
  category TEXT,
  colors_general TEXT
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Insert all products from CSV
INSERT INTO public.products (product_id, name, brand, description, price, sizes, image_url, stock_quantity, category, colors_general) VALUES
('KVP001', 'Baskets Adidas Unisexe Predator Sala Zero Metallic', ' Adidas', 'Découvrez l''alliance parfaite entre style intemporel et innovation avec ces baskets signées Adidas. Conçues pour répondre aux exigences des amateurs de sport comme des passionnés de mode, elles séduisent par leur design moderne et leurs finitions soignées. Leur dessus en matière synthétique assure légèreté et respirabilité, tandis que la doublure textile procure un confort durable tout au long de la journée. La semelle extérieure en caoutchouc offre une adhérence optimale sur différentes surfaces, idéale pour les activités sportives ou un usage quotidien. Grâce à la fermeture à lacets et à la languette repliable, ces baskets épousent parfaitement la forme du pied pour un maintien sécurisé. Le contrefort externe garantit une stabilité accrue lors des mouvements rapides. Les célèbres bandes et le logo emblématique soulignent l''héritage sportif de la marque. Convient à tous, ce modèle se distingue par son équilibre entre performance, élégance et confort, faisant de ces baskets un choix incontournable pour ceux qui recherchent la qualité et le style au quotidien.', '120', '["37 1/3", "38 2/3", "39 1/3", "40 2/3", "41 1/3", "42 2/3", "43 1/3", "44 2/3", "45 1/3", "38", "40"]', 'https://cdn.etrias.nl/media/cache/product_thumb_md/a/d/adidas_unisex_predator_sala_zero_metallic_core_black_gum_7.jpg', '1', 'Unisexe', '[''rouge'', ''noir'']'),
('KVP002', 'Baskets Adidas Enfant Predator Sala Zero Metallic', ' Adidas', 'Découvrez des baskets qui allient à la perfection performance sportive et style moderne, idéales pour les jeunes passionnés de football souhaitant se démarquer aussi bien sur le terrain qu''en dehors. Conçues avec un dessus en matière synthétique de haute qualité et une doublure textile, elles offrent un confort optimal tout au long de la journée. La fermeture à lacets assure un maintien parfait, tandis que la languette repliable ornée du célèbre logo apporte une touche rétro unique. Grâce au contrefort externe au talon, chaque pas bénéficie d''un soutien supplémentaire, essentiel pour les activités intenses en salle. La semelle extérieure en caoutchouc non marquante garantit une excellente adhérence sans laisser de traces, répondant ainsi aux exigences des environnements indoor. Ce modèle séduit par sa couleur Zero Metallic / Core Black / Cloud White, apportant une note élégante et dynamique à chaque tenue. Issu de la marque Adidas, reconnue mondialement pour son innovation et la qualité de ses produits, ce modèle est un choix incontournable pour les enfants à la recherche de performance, de durabilité et de style. Offrez-leur une expérience unique où chaque mouvement rime avec confiance et distinction.', '90', '["36 2/3", "37 1/3", "38 2/3", "39 1/3", "35,5", "36", "38", "40"]', 'https://cdn.etrias.nl/media/cache/product_thumb_md/a/d/adidas_junior_predator_sala_zero_metallic_core_black_cloud_white_8.jpg', '10', 'Enfant', '[''rouge'', ''noir'', ''blanc'']'),
('KVP003', 'Baskets Adidas Unisexe Samba LT Legend Earth', ' Adidas', 'Découvrez l''alliance parfaite entre héritage sportif et modernité avec ces baskets signées par la marque Adidas. Arborant une couleur élégante « Legend Earth » rehaussée de touches métalliques argentées et d''une semelle en gomme, ce modèle séduit par son esthétique raffinée et intemporelle. La matière principale, un cuir souple de qualité supérieure, assure une grande durabilité tandis que la doublure synthétique offre un confort optimal tout au long de la journée. Inspirée des chaussures de football vintage, la languette repliable et les lignes de couture apportent une touche rétro qui rappelle les classiques du passé, tout en s''intégrant parfaitement à une garde-robe contemporaine. La semelle extérieure en caoutchouc garantit une adhérence fiable sur toutes les surfaces, idéale pour une utilisation quotidienne. Grâce à la fermeture à lacets, chaque utilisateur bénéficie d''un ajustement personnalisé et sécurisé. Ces baskets conviennent aussi bien aux hommes qu''aux femmes, ce qui en fait un choix polyvalent pour toutes les occasions. Opter pour ce modèle, c''est choisir la combinaison parfaite entre style, confort et qualité, fidèle à la réputation d''Adidas. Ajoutez une touche d''authenticité et de performance à votre look avec ce classique revisité, pensé pour ceux qui recherchent l''excellence à chaque pas.', '130', '["36 2/3", "37 1/3", "38 2/3", "39 1/3", "40 2/3", "41 1/3", "42 2/3", "43 1/3", "44 2/3", "45 1/3", "36"]', 'https://cdn.etrias.nl/media/cache/product_thumb_md/a/d/adidas_unisex_samba_lt_legend_earth_silver_metallic_gum_8.jpg', '26', 'Unisexe', '[''noir'', ''argent'']');