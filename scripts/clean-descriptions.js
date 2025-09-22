import fs from 'fs';
import Papa from 'papaparse';

// Fonction pour nettoyer les descriptions
function cleanDescription(text) {
  if (!text) return '';
  
  return text
    // Corriger les caractères corrompus les plus courants
    .replace(/Dcouvrez/g, 'Découvrez')
    .replace(/lalliance/g, 'l\'alliance')
    .replace(/signes/g, 'signées')
    .replace(/matire/g, 'matière')
    .replace(/respirabilit/g, 'respirabilité')
    .replace(/extrieure/g, 'extérieure')
    .replace(/Grce/g, 'Grâce')
    .replace(/pousent/g, 'épousent')
    .replace(/scuris/g, 'sécurisé')
    .replace(/clbres/g, 'célèbres')
    .replace(/quilibre/g, 'équilibre')
    .replace(/lgance/g, 'élégance')
    .replace(/modle/g, 'modèle')
    .replace(/conues/g, 'conçues')
    .replace(/matires/g, 'matières')
    .replace(/synthtique/g, 'synthétique')
    .replace(/adhrence/g, 'adhérence')
    .replace(/activits/g, 'activités')
    .replace(/stabilit/g, 'stabilité')
    .replace(/emblmatique/g, 'emblématique')
    .replace(/hritage/g, 'héritage')
    .replace(/qualit/g, 'qualité')
    .replace(/passionns/g, 'passionnés')
    .replace(/dmarquer/g, 'démarquer')
    .replace(/journe/g, 'journée')
    .replace(/clbre/g, 'célèbre')
    .replace(/rtro/g, 'rétro')
    .replace(/bnficie/g, 'bénéficie')
    .replace(/supplmentaire/g, 'supplémentaire')
    .replace(/rpondant/g, 'répondant')
    .replace(/sduit/g, 'séduit')
    .replace(/lgante/g, 'élégante')
    .replace(/durabilit/g, 'durabilité')
    .replace(/exprience/g, 'expérience')
    .replace(/lñalliance/g, 'l\'alliance')
    .replace(/rpondre/g, 'répondre')
    .replace(/idales/g, 'idéales')
    .replace(/conues/g, 'conçues')
    .replace(/mati/g, 'mati')
    .replace(/synth/g, 'synth')
    .replace(/tique/g, 'tique')
    .replace(/orne/g, 'ornée')
    .replace(/extrieure/g, 'extérieure')
    .replace(/marquante/g, 'marquante')
    .replace(/excellente/g, 'excellente')
    .replace(/traces/g, 'traces')
    .replace(/exigences/g, 'exigences')
    .replace(/environnements/g, 'environnements')
    .replace(/couleur/g, 'couleur')
    .replace(/apportant/g, 'apportant')
    .replace(/note/g, 'note')
    .replace(/dynamique/g, 'dynamique')
    .replace(/tenue/g, 'tenue')
    .replace(/reconnue/g, 'reconnue')
    .replace(/mondialement/g, 'mondialement')
    .replace(/innovation/g, 'innovation')
    .replace(/produits/g, 'produits')
    .replace(/incontournable/g, 'incontournable')
    .replace(/enfants/g, 'enfants')
    .replace(/recherche/g, 'recherche')
    .replace(/performance/g, 'performance')
    .replace(/Offrez/g, 'Offrez')
    .replace(/mouvement/g, 'mouvement')
    .replace(/rime/g, 'rime')
    .replace(/confiance/g, 'confiance')
    .replace(/distinction/g, 'distinction')
    // Nettoyer les espaces et caractères de contrôle
    .replace(/\s+/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .trim();
}

async function cleanDescriptions() {
  try {
    console.log('🔄 Nettoyage des descriptions...');
    
    // Lire le fichier exporté
    const csvContent = fs.readFileSync('exported-products.csv', 'utf8');
    const parsed = Papa.parse(csvContent, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true
    });
    
    console.log(`📊 ${parsed.data.length} produits à traiter`);
    
    // Nettoyer chaque description
    const cleanedProducts = parsed.data.map((product, index) => {
      const originalDesc = product.description;
      const cleanedDesc = cleanDescription(product.description);
      
      if (index < 3) {
        console.log(`\n${index + 1}. ${product.name}`);
        console.log(`   Avant: ${originalDesc.substring(0, 80)}...`);
        console.log(`   Après: ${cleanedDesc.substring(0, 80)}...`);
      }
      
      return {
        ...product,
        description: cleanedDesc
      };
    });
    
    // Convertir en CSV
    const cleanedCsv = Papa.unparse(cleanedProducts, {
      delimiter: ';',
      header: true,
      encoding: 'utf8'
    });
    
    // Sauvegarder le fichier nettoyé
    const filename = 'cleaned-products.csv';
    fs.writeFileSync(filename, cleanedCsv, 'utf8');
    
    console.log(`\n✅ Fichier nettoyé sauvegardé : ${filename}`);
    console.log(`📊 ${cleanedProducts.length} produits traités avec succès`);
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage :', error.message);
  }
}

// Exécuter le nettoyage
cleanDescriptions();
