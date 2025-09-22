import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import Papa from 'papaparse';

// Configuration Supabase
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://rjzzpxddbziuhcejqrro.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqenpweGRkYnppdWhjZWpxcnJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2Nzk4MTEsImV4cCI6MjA3MzI1NTgxMX0.Qevjx5mVk_DM-U5fqiowljtcpndced2GS51BD7w4yg4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function exportProducts() {
  try {
    console.log('🔄 Export des produits depuis Supabase...');
    
    // Récupérer tous les produits
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('product_id');

    if (error) {
      throw error;
    }

    if (!products || products.length === 0) {
      console.log('❌ Aucun produit trouvé dans la base de données');
      return;
    }

    console.log(`✅ ${products.length} produits récupérés`);

    // Préparer les données pour l'export CSV
    const csvData = products.map(product => ({
      product_id: product.product_id,
      name: product.name,
      brand: product.brand,
      description: product.description,
      price: product.price,
      sizes: JSON.stringify(product.sizes),
      image_url: product.image_url,
      stock_quantity: product.stock_quantity,
      category: product.category,
      colors_general: product.colors_general
    }));

    // Convertir en CSV avec le bon séparateur
    const csv = Papa.unparse(csvData, {
      delimiter: ';',
      header: true,
      encoding: 'utf8'
    });

    // Sauvegarder le fichier
    const filename = 'exported-products.csv';
    fs.writeFileSync(filename, csv, 'utf8');
    
    console.log(`✅ Fichier exporté : ${filename}`);
    console.log(`📊 ${products.length} produits exportés avec succès`);
    
    // Afficher un échantillon des descriptions pour vérifier
    console.log('\n📝 Échantillon des descriptions :');
    products.slice(0, 3).forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`);
      console.log(`   Description: ${product.description.substring(0, 100)}...`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'export :', error.message);
  }
}

// Exécuter l'export
exportProducts();
