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
  // Optional CSV columns for per-size stock
  stock_by_size?: string;       // e.g. "33:4,34:2,35:1"
  stocks?: string;              // e.g. "4,2,1" aligned with sizes
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
      const cleanBatch = batch.map(product => {
        // Helper: size ranges per category
        const cat = (product.category || '').trim().toLowerCase();
        const rangeFor = (start: number, end: number) => {
          const arr: string[] = [];
          for (let s = start; s <= end; s++) arr.push(String(s));
          return arr;
        };
        let categorySizes: string[] = [];
        if (cat === 'enfant') categorySizes = rangeFor(16, 37);
        else if (cat === 'femme') categorySizes = rangeFor(35, 42);
        else if (cat === 'homme') categorySizes = rangeFor(38, 47);
        else if (cat === 'unisexe' || cat === 'unisex' || cat === 'unissex') categorySizes = rangeFor(25, 47);

        // If CSV provides explicit sizes, keep them; otherwise use category range
        let sizesArr = product.sizes
          ? product.sizes.split(',').map(s => s.trim()).filter(Boolean)
          : categorySizes;

        // Build per-size stock map
        const stockMap: Record<string, number> = {};
        if (product.stock_by_size) {
          product.stock_by_size.split(',').forEach(pair => {
            const [sz, qty] = pair.split(':').map(s => s.trim());
            if (sz && qty && !isNaN(Number(qty))) stockMap[sz] = Number(qty);
          });
        } else if (product.stocks) {
          const qtys = product.stocks.split(',').map(s => s.trim()).filter(Boolean);
          sizesArr.forEach((sz, i) => {
            const q = Number(qtys[i]);
            if (!isNaN(q)) stockMap[sz] = q;
          });
        } else {
          // Generate random stock 1..20 for each size
          sizesArr.forEach(sz => {
            stockMap[sz] = Math.floor(Math.random() * 20) + 1;
          });
        }

        // Ensure sizesArr matches stockMap keys (sorted numerically if possible)
        sizesArr = Object.keys(stockMap).sort((a, b) => Number(a) - Number(b));

        const totalStock = Object.values(stockMap).reduce((a, b) => a + b, 0);

        return {
          product_id: product.product_id?.trim(),
          name: product.name?.trim(),
          brand: product.brand?.trim() || null,
          description: product.description?.trim() || null,
          price: product.price?.trim() || null,
          sizes: sizesArr.length ? JSON.stringify(sizesArr) : null,
          image_url: product.image_url?.trim() || null,
          // Keep numeric total for compatibility, and write JSON map to a new column if present
          stock_quantity: String(totalStock),
          // @ts-expect-error: backend table should have a JSONB column `stock_by_size`
          stock_by_size: stockMap,
          category: product.category?.trim() || null,
          colors_general: product.colors_general?.trim() || null,
        } as any;
      });
      
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