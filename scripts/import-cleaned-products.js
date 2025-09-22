import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import Papa from 'papaparse';

// Configuration Supabase
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://rjzzpxddbziuhcejqrro.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqenpweGRkYnppdWhjZWpxcnJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2Nzk4MTEsImV4cCI6MjA3MzI1NTgxMX0.Qevjx5mVk_DM-U5fqiowljtcpndced2GS51BD7w4yg4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function importCleanedProducts() {
  try {
    console.log('🔄 Import des produits nettoyés...');
    
    // Lire le fichier nettoyé
    const csvContent = fs.readFileSync('cleaned-products.csv', 'utf8');
    const parsed = Papa.parse(csvContent, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true
    });
    
    console.log(`📊 ${parsed.data.length} produits à importer`);
    
    // Préparer les données pour l'import
    const productsToImport = parsed.data.map(product => ({
      product_id: product.product_id,
      name: product.name,
      brand: product.brand,
      description: product.description,
      price: product.price,
      sizes: JSON.parse(product.sizes),
      image_url: product.image_url,
      stock_quantity: product.stock_quantity,
      category: product.category,
      colors_general: product.colors_general
    }));
    
    console.log('🔄 Mise à jour des produits dans la base de données...');
    
    // Mettre à jour les produits un par un pour éviter les erreurs
    let successCount = 0;
    let errorCount = 0;
    
    for (const product of productsToImport) {
      try {
        const { error } = await supabase
          .from('products')
          .update({
            description: product.description
          })
          .eq('product_id', product.product_id);
        
        if (error) {
          console.error(`❌ Erreur pour ${product.product_id}: ${error.message}`);
          errorCount++;
        } else {
          successCount++;
          if (successCount % 20 === 0) {
            console.log(`✅ ${successCount} produits mis à jour...`);
          }
        }
      } catch (err) {
        console.error(`❌ Erreur pour ${product.product_id}: ${err.message}`);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Résultat de l'import :`);
    console.log(`✅ ${successCount} produits mis à jour avec succès`);
    console.log(`❌ ${errorCount} erreurs`);
    
    if (errorCount === 0) {
      console.log('\n🎉 Tous les produits ont été mis à jour avec succès !');
    } else {
      console.log(`\n⚠️  ${errorCount} produits n'ont pas pu être mis à jour.`);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'import :', error.message);
  }
}

// Exécuter l'import
importCleanedProducts();
