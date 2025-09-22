import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://rjzzpxddbziuhcejqrro.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqenpweGRkYnppdWhjZWpxcnJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2Nzk4MTEsImV4cCI6MjA3MzI1NTgxMX0.Qevjx5mVk_DM-U5fqiowljtcpndced2GS51BD7w4yg4';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const csvPath = process.argv[2] || path.resolve('src/data/karnaval-products.csv');

function range(start, end) {
  const arr = [];
  for (let i = start; i <= end; i++) arr.push(String(i));
  return arr;
}

function sizesForCategory(cat) {
  const c = (cat || '').trim().toLowerCase();
  if (c === 'enfant') return range(16, 37);
  if (c === 'femme') return range(35, 42);
  if (c === 'homme') return range(38, 47);
  if (c === 'unisexe' || c === 'unisex' || c === 'unissex') return range(35, 47);
  return [];
}

async function main() {
  if (!fs.existsSync(csvPath)) {
    console.error('CSV not found:', csvPath);
    process.exit(1);
  }

  // Decode CSV as Windows-1252 to avoid � in French punctuation, then to UTF-8
  const raw = fs.readFileSync(csvPath);
  const decoder = new TextDecoder('windows-1252');
  const csvText = decoder.decode(raw);
  const { data, errors } = Papa.parse(csvText, { header: true, delimiter: ';', skipEmptyLines: true, transformHeader: h => h.trim() });
  if (errors?.length) {
    console.error('CSV parse errors:', errors.slice(0, 3));
  }

  const rows = data.filter(r => r.product_id && r.name);
  console.log('Rows to import:', rows.length);

  const batchSize = 50;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize).map(p => {
      // FORCE sizes based on category rules
      let sizesArr = sizesForCategory(p.category);

      // Random per-size stock 1..20
      const stock_by_size = Object.fromEntries((sizesArr.length ? sizesArr : sizesForCategory(p.category)).map(sz => [sz, Math.floor(Math.random() * 20) + 1]));
      const stock_quantity = Object.values(stock_by_size).reduce((a, b) => a + b, 0);

      return {
        product_id: String(p.product_id).trim(),
        name: p.name?.trim() || null,
        brand: p.brand?.trim() || null,
        description: p.description?.trim() || null,
        price: p.price?.trim() || null,
        sizes: sizesArr.length ? JSON.stringify(sizesArr) : null,
        image_url: p.image_url?.trim() || null,
        stock_quantity: String(stock_quantity),
        stock_by_size,
        category: p.category?.trim() || null,
        colors_general: p.colors_general?.trim() || null,
      };
    });

    const { error } = await supabase.from('products').upsert(batch, { onConflict: 'product_id' });
    if (error) {
      console.error('Upsert error (batch', (i / batchSize) + 1, '):', error);
      process.exitCode = 1;
      break;
    } else {
      console.log('Imported batch', (i / batchSize) + 1, '/', Math.ceil(rows.length / batchSize));
    }
  }

  console.log('Done.');
}

main().catch(err => { console.error(err); process.exit(1); });


