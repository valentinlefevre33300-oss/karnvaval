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

export async function importKarnavalProducts() {
  try {
    // Fetch CSV content from the new file
    const response = await fetch('/src/data/karnaval-products.csv');
    const csvText = await response.text();
    
    console.log('CSV content length:', csvText.length);
    
    // Parse CSV with semicolon delimiter
    const result = Papa.parse<ProductRow>(csvText, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
    });
    
    if (result.errors.length > 0) {
      console.error('CSV parsing errors:', result.errors);
    }
    
    const products = result.data.filter(product => 
      product.product_id && 
      product.product_id.trim() !== '' &&
      product.name && 
      product.name.trim() !== ''
    );
    
    console.log(`Found ${products.length} valid products to import...`);
    
    if (products.length === 0) {
      console.error('No valid products found in CSV');
      return;
    }
    
    // Process products in smaller batches to avoid memory issues
    const batchSize = 25;
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      // Clean and prepare the batch data
      const cleanBatch = batch.map(product => ({
        product_id: product.product_id?.trim(),
        name: product.name?.trim(),
        brand: product.brand?.trim() || null,
        description: product.description?.trim() || null,
        price: product.price?.trim() || null,
        sizes: product.sizes ? JSON.stringify(product.sizes.split(',').map(s => s.trim())) : null,
        image_url: product.image_url?.trim() || null,
        stock_quantity: product.stock_quantity?.trim() || null,
        category: product.category?.trim() || null,
        colors_general: product.colors_general?.trim() || null,
      }));
      
      const { data, error } = await supabase
        .from('products')
        .upsert(cleanBatch, { onConflict: 'product_id' });
      
      if (error) {
        console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error);
        errorCount += batch.length;
      } else {
        console.log(`Batch ${Math.floor(i / batchSize) + 1} imported successfully (${batch.length} products)`);
        successCount += batch.length;
      }
      
      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`Import completed: ${successCount} products imported successfully, ${errorCount} errors`);
    return { successCount, errorCount, totalProducts: products.length };
    
  } catch (error) {
    console.error('Import failed:', error);
    throw error;
  }
}