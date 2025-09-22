// Utilitaires pour le nettoyage et formatage des textes

/**
 * Corrige les problèmes d'encodage mojibake et améliore le formatage
 */
export const cleanAndFormatText = (text: string): string => {
  if (!text) return '';

  let cleaned = text;

  // Corrections d'encodage mojibake les plus courantes
  const mojibakeReplacements: Record<string, string> = {
    'Dâcouvrez': 'Découvrez',
    'Découvrez': 'Découvrez', // déjà correct
    'lâalliance': "l'alliance",
    "l'alliance": "l'alliance", // déjà correct
    'lâ': "l'",
    'dâ': "d'",
    'câ': "c'",
    'nâ': "n'",
    'quâ': "qu'",
    'jâ': "j'",
    'sâ': "s'",
    'mâ': "m'",
    'âlâgance': 'élégance',
    'âlâgant': 'élégant',
    'âlâgante': 'élégante',
    'conâues': 'conçues',
    'conâu': 'conçu',
    'conâue': 'conçue',
    'râpondre': 'répondre',
    'râpond': 'répond',
    'sâduisent': 'séduisent',
    'sâduit': 'séduit',
    'lâgâretâ': 'légèreté',
    'respirabilitâ': 'respirabilité',
    'qualitâ': 'qualité',
    'activitâs': 'activités',
    'adhârence': 'adhérence',
    'idâale': 'idéale',
    'idâal': 'idéal',
    'grâce': 'grâce',
    'âpousent': 'épousent',
    'sâcurisâ': 'sécurisé',
    'stabilitâ': 'stabilité',
    'câlâbres': 'célèbres',
    'hâritage': 'héritage',
    'âquilibre': 'équilibre',
    'prâcis': 'précis',
    'prâcise': 'précise',
    'supârieure': 'supérieure',
    'supârieur': 'supérieur',
    'durabilitâ': 'durabilité',
    'râsistance': 'résistance',
    'esthâtique': 'esthétique',
    'rehaussâe': 'rehaussée',
    'mâtalliques': 'métalliques',
    'argentâes': 'argentées',
    'raffinâe': 'raffinée',
    'matiâre': 'matière',
    'matiâres': 'matières',
    'intâgrant': 'intégrant',
    'extârieure': 'extérieure',
    'personnalisâ': 'personnalisé',
    'authenticitâ': 'authenticité',
    'revisitâ': 'revisité',
    'pensâ': 'pensé',
    'distinguent': 'distinguent',
    'caractâre': 'caractère',
    'discrâte': 'discrète',
    'inspirâes': 'inspirées',
    'inspirâ': 'inspiré',
    'inspirâe': 'inspirée',
    'fonctionnalitâ': 'fonctionnalité',
    'râpondant': 'répondant',
    'incontournable': 'incontournable',
    
    // Caractères isolés
    'â': 'à',
    'Ã': 'à',
    'Ã¡': 'á',
    'Ã¢': 'â',
    'Ã¤': 'ä',
    'Ã¨': 'è',
    'Ã©': 'é',
    'Ãª': 'ê',
    'Ã«': 'ë',
    'Ã®': 'î',
    'Ã¯': 'ï',
    'Ã´': 'ô',
    'Ã¶': 'ö',
    'Ã¹': 'ù',
    'Ãº': 'ú',
    'Ã»': 'û',
    'Ã¼': 'ü',
    'Ã§': 'ç',
    'Ã±': 'ñ',
  };

  // Appliquer les corrections
  Object.entries(mojibakeReplacements).forEach(([wrong, correct]) => {
    cleaned = cleaned.replaceAll(wrong, correct);
  });

  // Corrections supplémentaires pour les caractères spéciaux
  cleaned = cleaned
    .replace(/â/g, 'à')
    .replace(/Ã/g, 'à')
    .replace(/Â/g, 'à')
    .replace(/Õ/g, 'ñ')
    .replace(/\uFFFD/g, '') // Caractère de remplacement Unicode
    
    // Nettoyer les espaces
    .replace(/\u00A0/g, ' ') // NBSP -> space
    .replace(/\u00AD/g, '') // soft hyphen
    .replace(/[\u200B\u200C\u200D\u2060]/g, '') // zero-width
    .replace(/[\u2000-\u200A\u202F\u205F\u3000]/g, ' ') // other unicode spaces to normal space
    .replace(/\r\n|\r/g, '\n') // normalize newlines
    .replace(/[\t ]{2,}/g, ' ') // collapse spaces
    .trim();

  return cleaned;
};

/**
 * Formate le texte avec des paragraphes pour une meilleure lisibilité
 */
export const formatWithParagraphs = (text: string): string => {
  if (!text) return '';

  let formatted = cleanAndFormatText(text);

  // Ajouter des paragraphes aux endroits logiques
  const paragraphBreaks = [
    '. Con',
    '. Leur',
    '. La ',
    '. Les ',
    '. Grâce',
    '. Inspiré',
    '. Parfait',
    '. Optez',
    '. Adoptez',
    '. Convient',
    '. Offrez',
    '. Avec',
    '. Issue',
    '. Dotée',
  ];

  paragraphBreaks.forEach(breakPoint => {
    formatted = formatted.replace(
      new RegExp(breakPoint.replace('.', '\\.'), 'g'),
      breakPoint.replace('. ', '.\n\n')
    );
  });

  // Nettoyer les sauts de ligne excessifs
  formatted = formatted
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return formatted;
};

/**
 * Version simple pour les descriptions courtes (catalogue)
 */
export const cleanTextSimple = (text: string): string => {
  if (!text) return '';
  return cleanAndFormatText(text);
};
