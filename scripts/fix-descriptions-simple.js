import fs from 'fs';
import Papa from 'papaparse';

// Fonction pour corriger les caractères corrompus
function fixEncoding(text) {
  if (!text) return '';
  
  return text
    // Corriger les caractères corrompus spécifiques
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
    .replace(/quotidien/g, 'quotidien')
    .replace(/languette/g, 'languette')
    .replace(/repliable/g, 'repliable')
    .replace(/contrefort/g, 'contrefort')
    .replace(/stabilit/g, 'stabilité')
    .replace(/mouvements/g, 'mouvements')
    .replace(/rapides/g, 'rapides')
    .replace(/emblmatique/g, 'emblématique')
    .replace(/hritage/g, 'héritage')
    .replace(/sportif/g, 'sportif')
    .replace(/Convient/g, 'Convient')
    .replace(/distinguent/g, 'distinguent')
    .replace(/parfaitement/g, 'parfaitement')
    .replace(/recherchent/g, 'recherchent')
    .replace(/qualit/g, 'qualité')
    .replace(/incontournable/g, 'incontournable')
    .replace(/passionns/g, 'passionnés')
    .replace(/souhaitant/g, 'souhaitant')
    .replace(/dmarquer/g, 'démarquer')
    .replace(/optimal/g, 'optimal')
    .replace(/journe/g, 'journée')
    .replace(/fermeture/g, 'fermeture')
    .replace(/parfait/g, 'parfait')
    .replace(/clbre/g, 'célèbre')
    .replace(/apporte/g, 'apporte')
    .replace(/touche/g, 'touche')
    .replace(/rtro/g, 'rétro')
    .replace(/unique/g, 'unique')
    .replace(/talon/g, 'talon')
    .replace(/bnficie/g, 'bénéficie')
    .replace(/soutien/g, 'soutien')
    .replace(/supplmentaire/g, 'supplémentaire')
    .replace(/essentiel/g, 'essentiel')
    .replace(/intenses/g, 'intenses')
    .replace(/salle/g, 'salle')
    .replace(/non/g, 'non')
    .replace(/marquante/g, 'marquante')
    .replace(/garantit/g, 'garantit')
    .replace(/excellente/g, 'excellente')
    .replace(/traces/g, 'traces')
    .replace(/rpondant/g, 'répondant')
    .replace(/exigences/g, 'exigences')
    .replace(/environnements/g, 'environnements')
    .replace(/indoor/g, 'indoor')
    .replace(/sduit/g, 'séduit')
    .replace(/couleur/g, 'couleur')
    .replace(/apportant/g, 'apportant')
    .replace(/note/g, 'note')
    .replace(/lgante/g, 'élégante')
    .replace(/dynamique/g, 'dynamique')
    .replace(/tenue/g, 'tenue')
    .replace(/Issu/g, 'Issu')
    .replace(/reconnue/g, 'reconnue')
    .replace(/mondialement/g, 'mondialement')
    .replace(/innovation/g, 'innovation')
    .replace(/produits/g, 'produits')
    .replace(/enfants/g, 'enfants')
    .replace(/recherche/g, 'recherche')
    .replace(/performance/g, 'performance')
    .replace(/durabilit/g, 'durabilité')
    .replace(/Offrez/g, 'Offrez')
    .replace(/exprience/g, 'expérience')
    .replace(/mouvement/g, 'mouvement')
    .replace(/rime/g, 'rime')
    .replace(/confiance/g, 'confiance')
    .replace(/distinction/g, 'distinction')
    // Nettoyer les espaces multiples
    .replace(/\s+/g, ' ')
    .trim();
}

// Fonction pour améliorer les descriptions
function improveDescription(description, productName) {
  if (!description) return '';
  
  // Nettoyer l'encodage
  let cleanDesc = fixEncoding(description);
  
  // Améliorer la structure si nécessaire
  if (cleanDesc.length < 100) {
    // Description trop courte, ajouter des détails
    const brand = productName.includes('Adidas') ? 'Adidas' : 
                  productName.includes('Nike') ? 'Nike' : 
                  productName.includes('Puma') ? 'Puma' : 'la marque';
    
    cleanDesc = `Découvrez ces baskets ${brand} qui allient style et confort. ${cleanDesc} Conçues avec des matériaux de qualité, elles offrent une excellente durabilité et un confort optimal pour un usage quotidien.`;
  }
  
  return cleanDesc;
}

async function fixDescriptions() {
  try {
    console.log('🔄 Correction des descriptions...');
    
    // Lire le fichier exporté
    const csvContent = fs.readFileSync('exported-products.csv', 'utf8');
    const parsed = Papa.parse(csvContent, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true
    });
    
    console.log(`📊 ${parsed.data.length} produits à traiter`);
    
    // Corriger chaque description
    const fixedProducts = parsed.data.map(product => ({
      ...product,
      description: improveDescription(product.description, product.name)
    }));
    
    // Convertir en CSV
    const fixedCsv = Papa.unparse(fixedProducts, {
      delimiter: ';',
      header: true,
      encoding: 'utf8'
    });
    
    // Sauvegarder le fichier corrigé
    const filename = 'fixed-products.csv';
    fs.writeFileSync(filename, fixedCsv, 'utf8');
    
    console.log(`✅ Fichier corrigé sauvegardé : ${filename}`);
    
    // Afficher quelques exemples de corrections
    console.log('\n📝 Exemples de corrections :');
    fixedProducts.slice(0, 3).forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`);
      console.log(`   Description corrigée: ${product.description.substring(0, 150)}...`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction :', error.message);
  }
}

// Exécuter la correction
fixDescriptions();
