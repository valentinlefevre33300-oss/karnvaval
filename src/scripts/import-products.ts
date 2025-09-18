import { supabase } from '@/integrations/supabase/client';
import Papa from 'papaparse';

interface ProductRow {
  product_id: string;
  name: string;
  brand: string;
  description: string;
  price: string;
  sizes: string;
  image_url: string;
  stock_quantity: string;
  category: string;
  colors_general: string;
}

export async function importProductsFromCSV() {
  try {
    // Fetch CSV content
    const response = await fetch('/src/data/products.csv');
    const csvText = await response.text();
    
    // Parse CSV
    const result = Papa.parse<ProductRow>(csvText, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true,
    });
    
    if (result.errors.length > 0) {
      console.error('CSV parsing errors:', result.errors);
      return;
    }
    
    const products = result.data;
    console.log(`Importing ${products.length} products...`);
    
    // Batch insert products
    const batchSize = 50;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('products')
        .upsert(batch, { onConflict: 'product_id' });
      
      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
      } else {
        console.log(`Batch ${i / batchSize + 1} imported successfully`);
      }
    }
    
    console.log('All products imported successfully!');
  } catch (error) {
    console.error('Import failed:', error);
  }
}