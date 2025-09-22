-- Add model_3d_id column to products table for Sketchfab 3D model integration
ALTER TABLE products 
ADD COLUMN model_3d_id text;

-- Add comment to document the column
COMMENT ON COLUMN products.model_3d_id IS 'Sketchfab 3D model ID for product visualization';

-- Update the runfalcon product with the provided 3D model ID
UPDATE products 
SET model_3d_id = '86a4efb5412f4eb5b03e2c1d0ad4ceb9'
WHERE LOWER(name) LIKE '%runfalcon%' OR LOWER(name) LIKE '%adidas runfalcon%';
