import fs from 'fs';
import Papa from 'papaparse';

// Mapping des caractères corrompus vers les caractères corrects
const encodingMap = {
  'Dcouvrez': 'Découvrez',
  'lalliance': 'l\'alliance',
  'signes': 'signées',
  'matire': 'matière',
  'respirabilit': 'respirabilité',
  'extrieure': 'extérieure',
  'Grce': 'Grâce',
  'pousent': 'épousent',
  'scuris': 'sécurisé',
  'clbres': 'célèbres',
  'quilibre': 'équilibre',
  'lgance': 'élégance',
  'modle': 'modèle',
  'conues': 'conçues',
  'matires': 'matières',
  'synthtique': 'synthétique',
  'adhrence': 'adhérence',
  'activits': 'activités',
  'languette': 'languette',
  'repliable': 'repliable',
  'contrefort': 'contrefort',
  'stabilit': 'stabilité',
  'emblmatique': 'emblématique',
  'hritage': 'héritage',
  'distinguent': 'distinguent',
  'parfaitement': 'parfaitement',
  'recherchent': 'recherchent',
  'qualit': 'qualité',
  'passionns': 'passionnés',
  'dmarquer': 'démarquer',
  'journe': 'journée',
  'clbre': 'célèbre',
  'rtro': 'rétro',
  'bnficie': 'bénéficie',
  'supplmentaire': 'supplémentaire',
  'marquante': 'marquante',
  'rpondant': 'répondant',
  'sduit': 'séduit',
  'lgante': 'élégante',
  'durabilit': 'durabilité',
  'exprience': 'expérience',
  'lñalliance': 'l\'alliance',
  'rpondre': 'répondre',
  'amateurs': 'amateurs',
  'idales': 'idéales',
  'perfection': 'perfection',
  'sportive': 'sportive',
  'moderne': 'moderne',
  'jeunes': 'jeunes',
  'football': 'football',
  'souhaitant': 'souhaitant',
  'dmarquer': 'démarquer',
  'terrain': 'terrain',
  'dehors': 'dehors',
  'conues': 'conçues',
  'mati': 'mati',
  'synth': 'synth',
  'tique': 'tique',
  'haute': 'haute',
  'qualit': 'qualité',
  'optimal': 'optimal',
  'long': 'long',
  'journe': 'journée',
  'fermeture': 'fermeture',
  'lacets': 'lacets',
  'assure': 'assure',
  'maintien': 'maintien',
  'parfait': 'parfait',
  'languette': 'languette',
  'repliable': 'repliable',
  'orne': 'ornée',
  'clbre': 'célèbre',
  'logo': 'logo',
  'apporte': 'apporte',
  'touche': 'touche',
  'rtro': 'rétro',
  'unique': 'unique',
  'contrefort': 'contrefort',
  'externe': 'externe',
  'talon': 'talon',
  'chaque': 'chaque',
  'pas': 'pas',
  'bnficie': 'bénéficie',
  'soutien': 'soutien',
  'supplmentaire': 'supplémentaire',
  'essentiel': 'essentiel',
  'activits': 'activités',
  'intenses': 'intenses',
  'salle': 'salle',
  'semelle': 'semelle',
  'extrieure': 'extérieure',
  'caoutchouc': 'caoutchouc',
  'non': 'non',
  'marquante': 'marquante',
  'garantit': 'garantit',
  'excellente': 'excellente',
  'adhrence': 'adhérence',
  'traces': 'traces',
  'rpondant': 'répondant',
  'exigences': 'exigences',
  'environnements': 'environnements',
  'indoor': 'indoor',
  'sduit': 'séduit',
  'couleur': 'couleur',
  'Zero': 'Zero',
  'Metallic': 'Metallic',
  'Core': 'Core',
  'Black': 'Black',
  'Cloud': 'Cloud',
  'White': 'White',
  'apportant': 'apportant',
  'note': 'note',
  'lgante': 'élégante',
  'dynamique': 'dynamique',
  'tenue': 'tenue',
  'Issu': 'Issu',
  'reconnue': 'reconnue',
  'mondialement': 'mondialement',
  'innovation': 'innovation',
  'produits': 'produits',
  'incontournable': 'incontournable',
  'enfants': 'enfants',
  'recherche': 'recherche',
  'performance': 'performance',
  'durabilit': 'durabilité',
  'Offrez': 'Offrez',
  'exprience': 'expérience',
  'mouvement': 'mouvement',
  'rime': 'rime',
  'confiance': 'confiance',
  'distinction': 'distinction'
};

// Fonction pour corriger l'encodage
function fixEncoding(text) {
  if (!text) return '';
  
  let result = text;
  
  // Appliquer le mapping
  for (const [corrupted, correct] of Object.entries(encodingMap)) {
    result = result.replace(new RegExp(corrupted, 'g'), correct);
  }
  
  // Nettoyer les espaces multiples et les caractères de contrôle
  result = result
    .replace(/\s+/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .trim();
  
  return result;
}

// Fonction pour améliorer les descriptions
function improveDescription(description, productName) {
  if (!description) return '';
  
  // Nettoyer l'encodage
  let cleanDesc = fixEncoding(description);
  
  // Améliorer la structure si nécessaire
  if (cleanDesc.length < 100) {
    const brand = productName.includes('Adidas') ? 'Adidas' : 
                  productName.includes('Nike') ? 'Nike' : 
                  productName.includes('Puma') ? 'Puma' : 'la marque';
    
    cleanDesc = `Découvrez ces baskets ${brand} qui allient style et confort. ${cleanDesc} Conçues avec des matériaux de qualité, elles offrent une excellente durabilité et un confort optimal pour un usage quotidien.`;
  }
  
  return cleanDesc;
}

async function fixEncoding() {
  try {
    console.log('🔄 Correction de l\'encodage des descriptions...');
    
    // Lire le fichier exporté
    const csvContent = fs.readFileSync('exported-products.csv', 'utf8');
    const parsed = Papa.parse(csvContent, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true
    });
    
    console.log(`📊 ${parsed.data.length} produits à traiter`);
    
    // Corriger chaque description
    const fixedProducts = parsed.data.map((product, index) => {
      const originalDesc = product.description;
      const fixedDesc = improveDescription(product.description, product.name);
      
      if (index < 5) {
        console.log(`\n${index + 1}. ${product.name}`);
        console.log(`   Avant: ${originalDesc.substring(0, 100)}...`);
        console.log(`   Après: ${fixedDesc.substring(0, 100)}...`);
      }
      
      return {
        ...product,
        description: fixedDesc
      };
    });
    
    // Convertir en CSV
    const fixedCsv = Papa.unparse(fixedProducts, {
      delimiter: ';',
      header: true,
      encoding: 'utf8'
    });
    
    // Sauvegarder le fichier corrigé
    const filename = 'fixed-products-clean.csv';
    fs.writeFileSync(filename, fixedCsv, 'utf8');
    
    console.log(`\n✅ Fichier corrigé sauvegardé : ${filename}`);
    console.log(`📊 ${fixedProducts.length} produits traités avec succès`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction :', error.message);
  }
}

// Exécuter la correction
fixEncoding();
