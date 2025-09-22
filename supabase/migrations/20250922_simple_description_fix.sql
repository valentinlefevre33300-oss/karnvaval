-- Script SQL simplifié pour corriger les descriptions de produits
-- À exécuter dans l'interface Supabase SQL Editor

-- Corrections des caractères mal encodés les plus courants
UPDATE products 
SET description = REPLACE(
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
                                      REPLACE(description, 'D�couvrez', 'Découvrez'),
                                      'l�alliance', 'l''alliance'
                                    ),
                                    'l�', 'l'''
                                  ),
                                  'd�', 'd'''
                                ),
                                'c�', 'c'''
                              ),
                              'n�', 'n'''
                            ),
                            'qu�', 'qu'''
                          ),
                          's�', 's'''
                        ),
                        'm�', 'm'''
                      ),
                      '�l�gance', 'élégance'
                    ),
                    'con�ues', 'conçues'
                  ),
                  'r�pondre', 'répondre'
                ),
                's�duisent', 'séduisent'
              ),
              'qualit�', 'qualité'
            ),
            'activit�s', 'activités'
          ),
          'adh�rence', 'adhérence'
        ),
        'id�ale', 'idéale'
      ),
      'gr�ce', 'grâce'
    ),
    '�', 'à'
  ),
  '�', 'é'
)
WHERE description IS NOT NULL 
AND (description LIKE '%�%' OR description LIKE '%�%');

-- Ajouter des retours à la ligne pour améliorer la lisibilité
UPDATE products 
SET description = REPLACE(
  REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(description, '. Conçues', '.\n\nConçues'),
        '. Leur', '.\n\nLeur'
      ),
      '. La ', '.\n\nLa '
    ),
    '. Grâce', '.\n\nGrâce'
  ),
  '. Parfait', '.\n\nParfait'
)
WHERE description IS NOT NULL;

-- Vérifier les résultats
SELECT 
  product_id,
  name,
  LEFT(description, 100) as description_preview
FROM products 
WHERE description LIKE '%Découvrez%'
LIMIT 5;
