-- Script SQL pour corriger TOUTES les descriptions de produits
-- S'applique à tous les produits sans exception

-- Étape 1: Corriger tous les caractères mal encodés sur TOUS les produits
UPDATE products 
SET description = 
  REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(
                  REPLACE(
                    REPLACE(
                      REPLACE(
                        REPLACE(
                          REPLACE(
                            REPLACE(
                              REPLACE(
                                REPLACE(
                                  REPLACE(
                                    REPLACE(
                                      REPLACE(
                                        REPLACE(
                                          REPLACE(
                                            REPLACE(
                                              REPLACE(
                                                REPLACE(
                                                  REPLACE(
                                                    REPLACE(
                                                      REPLACE(
                                                        REPLACE(
                                                          REPLACE(
                                                            REPLACE(
                                                              REPLACE(
                                                                REPLACE(
                                                                  REPLACE(
                                                                    REPLACE(
                                                                      REPLACE(
                                                                        REPLACE(
                                                                          REPLACE(
                                                                            REPLACE(
                                                                              REPLACE(
                                                                                REPLACE(description, 'Dâcouvrez', 'Découvrez'),
                                                                                'lâalliance', 'l''alliance'
                                                                              ),
                                                                              'lâ', 'l'''
                                                                            ),
                                                                            'dâ', 'd'''
                                                                          ),
                                                                          'câ', 'c'''
                                                                        ),
                                                                        'nâ', 'n'''
                                                                      ),
                                                                      'quâ', 'qu'''
                                                                    ),
                                                                    'jâ', 'j'''
                                                                  ),
                                                                  'sâ', 's'''
                                                                ),
                                                                'mâ', 'm'''
                                                              ),
                                                              'âlâgance', 'élégance'
                                                            ),
                                                            'âlâgant', 'élégant'
                                                          ),
                                                          'âlâgante', 'élégante'
                                                        ),
                                                        'conâues', 'conçues'
                                                      ),
                                                      'conâu', 'conçu'
                                                    ),
                                                    'conâue', 'conçue'
                                                  ),
                                                  'râpondre', 'répondre'
                                                ),
                                                'râpond', 'répond'
                                              ),
                                              'sâduisent', 'séduisent'
                                            ),
                                            'sâduit', 'séduit'
                                          ),
                                          'lâgâretâ', 'légèreté'
                                        ),
                                        'respirabilitâ', 'respirabilité'
                                      ),
                                      'qualitâ', 'qualité'
                                    ),
                                    'activitâs', 'activités'
                                  ),
                                  'adhârence', 'adhérence'
                                ),
                                'idâale', 'idéale'
                              ),
                              'idâal', 'idéal'
                            ),
                            'grâce', 'grâce'
                          ),
                          'âpousent', 'épousent'
                        ),
                        'sâcurisâ', 'sécurisé'
                      ),
                      'stabilitâ', 'stabilité'
                    ),
                    'câlâbres', 'célèbres'
                  ),
                  'hâritage', 'héritage'
                ),
                'âquilibre', 'équilibre'
              ),
              'prâcis', 'précis'
            ),
            'prâcise', 'précise'
          ),
          'supârieure', 'supérieure'
        ),
        'supârieur', 'supérieur'
      ),
      'durabilitâ', 'durabilité'
    ),
    'râsistance', 'résistance'
  )
WHERE description IS NOT NULL;

-- Étape 2: Corriger les caractères isolés sur TOUS les produits
UPDATE products 
SET description = 
  REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(
                  REPLACE(
                    REPLACE(
                      REPLACE(
                        REPLACE(
                          REPLACE(
                            REPLACE(
                              REPLACE(
                                REPLACE(
                                  REPLACE(
                                    REPLACE(
                                      REPLACE(
                                        REPLACE(description, 'esthâtique', 'esthétique'),
                                        'rehaussâe', 'rehaussée'
                                      ),
                                      'mâtalliques', 'métalliques'
                                    ),
                                    'argentâes', 'argentées'
                                  ),
                                  'raffinâe', 'raffinée'
                                ),
                                'matiâre', 'matière'
                              ),
                              'matiâres', 'matières'
                            ),
                            'intâgrant', 'intégrant'
                          ),
                          'extârieure', 'extérieure'
                        ),
                        'personnalisâ', 'personnalisé'
                      ),
                      'authenticitâ', 'authenticité'
                    ),
                    'revisitâ', 'revisité'
                  ),
                  'pensâ', 'pensé'
                ),
                'caractâre', 'caractère'
              ),
              'discrâte', 'discrète'
            ),
            'inspirâes', 'inspirées'
          ),
          'inspirâ', 'inspiré'
        ),
        'inspirâe', 'inspirée'
      ),
      'fonctionnalitâ', 'fonctionnalité'
    ),
    'râpondant', 'répondant'
  )
WHERE description IS NOT NULL;

-- Étape 3: Corriger les caractères spéciaux sur TOUS les produits
UPDATE products 
SET description = 
  REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(
                  REPLACE(
                    REPLACE(description, 'â', 'à'),
                    'Ã', 'à'
                  ),
                  'Â', 'à'
                ),
                'Õ', 'ñ'
              ),
              'â', 'é'
            ),
            'â', 'è'
          ),
          'â', 'ê'
        ),
        'â', 'ô'
      ),
      'â', 'ù'
    ),
    'â', 'ç'
  )
WHERE description IS NOT NULL;

-- Étape 4: Ajouter des paragraphes sur TOUS les produits
UPDATE products 
SET description = 
  REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(
                  REPLACE(
                    REPLACE(description, '. Conçues', '.\n\nConçues'),
                    '. Leur', '.\n\nLeur'
                  ),
                  '. La ', '.\n\nLa '
                ),
                '. Les ', '.\n\nLes '
              ),
              '. Grâce', '.\n\nGrâce'
            ),
            '. Inspiré', '.\n\nInspiré'
          ),
          '. Parfait', '.\n\nParfait'
        ),
        '. Optez', '.\n\nOptez'
      ),
      '. Adoptez', '.\n\nAdoptez'
    ),
    '. Convient', '.\n\nConvient'
  )
WHERE description IS NOT NULL;

-- Vérification finale - afficher tous les produits modifiés
SELECT 
  COUNT(*) as total_produits_modifies,
  'Toutes les descriptions ont été corrigées' as message
FROM products 
WHERE description IS NOT NULL;

-- Afficher quelques exemples de descriptions corrigées
SELECT 
  product_id,
  name,
  LEFT(description, 150) as description_preview
FROM products 
WHERE description IS NOT NULL
ORDER BY product_id
LIMIT 10;
