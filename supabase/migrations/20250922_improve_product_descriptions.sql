-- Script SQL pour améliorer le formatage des descriptions de produits
-- Corrige l'encodage et améliore la lisibilité

-- Fonction pour corriger l'encodage mojibake et améliorer le formatage
CREATE OR REPLACE FUNCTION improve_product_description(input_text TEXT)
RETURNS TEXT AS $$
DECLARE
    cleaned_text TEXT;
BEGIN
    -- Si le texte est NULL ou vide, retourner tel quel
    IF input_text IS NULL OR LENGTH(TRIM(input_text)) = 0 THEN
        RETURN input_text;
    END IF;
    
    -- Commencer avec le texte d'entrée
    cleaned_text := input_text;
    
    -- Corrections d'encodage mojibake les plus courantes
    cleaned_text := REPLACE(cleaned_text, 'D�couvrez', 'Découvrez');
    cleaned_text := REPLACE(cleaned_text, 'l�alliance', 'l''alliance');
    cleaned_text := REPLACE(cleaned_text, 'l�', 'l''');
    cleaned_text := REPLACE(cleaned_text, 'd�', 'd''');
    cleaned_text := REPLACE(cleaned_text, 'c�', 'c''');
    cleaned_text := REPLACE(cleaned_text, 'n�', 'n''');
    cleaned_text := REPLACE(cleaned_text, 'qu�', 'qu''');
    cleaned_text := REPLACE(cleaned_text, 'j�', 'j''');
    cleaned_text := REPLACE(cleaned_text, 's�', 's''');
    cleaned_text := REPLACE(cleaned_text, 'm�', 'm''');
    cleaned_text := REPLACE(cleaned_text, '�l�gance', 'élégance');
    cleaned_text := REPLACE(cleaned_text, '�l�gant', 'élégant');
    cleaned_text := REPLACE(cleaned_text, '�l�gante', 'élégante');
    cleaned_text := REPLACE(cleaned_text, 'con�ues', 'conçues');
    cleaned_text := REPLACE(cleaned_text, 'con�u', 'conçu');
    cleaned_text := REPLACE(cleaned_text, 'con�ue', 'conçue');
    cleaned_text := REPLACE(cleaned_text, 'r�pondre', 'répondre');
    cleaned_text := REPLACE(cleaned_text, 'r�pond', 'répond');
    cleaned_text := REPLACE(cleaned_text, 's�duisent', 'séduisent');
    cleaned_text := REPLACE(cleaned_text, 's�duit', 'séduit');
    cleaned_text := REPLACE(cleaned_text, 'l�g�ret�', 'légèreté');
    cleaned_text := REPLACE(cleaned_text, 'respirabilit�', 'respirabilité');
    cleaned_text := REPLACE(cleaned_text, 'qualit�', 'qualité');
    cleaned_text := REPLACE(cleaned_text, 'activit�s', 'activités');
    cleaned_text := REPLACE(cleaned_text, 'adh�rence', 'adhérence');
    cleaned_text := REPLACE(cleaned_text, 'id�ale', 'idéale');
    cleaned_text := REPLACE(cleaned_text, 'id�al', 'idéal');
    cleaned_text := REPLACE(cleaned_text, 'gr�ce', 'grâce');
    cleaned_text := REPLACE(cleaned_text, 'fermeture', 'fermeture');
    cleaned_text := REPLACE(cleaned_text, '�pousent', 'épousent');
    cleaned_text := REPLACE(cleaned_text, 's�curis�', 'sécurisé');
    cleaned_text := REPLACE(cleaned_text, 'stabilit�', 'stabilité');
    cleaned_text := REPLACE(cleaned_text, 'c�l�bres', 'célèbres');
    cleaned_text := REPLACE(cleaned_text, 'h�ritage', 'héritage');
    cleaned_text := REPLACE(cleaned_text, '�quilibre', 'équilibre');
    cleaned_text := REPLACE(cleaned_text, 'performance', 'performance');
    cleaned_text := REPLACE(cleaned_text, 'pr�cis', 'précis');
    cleaned_text := REPLACE(cleaned_text, 'pr�cise', 'précise');
    cleaned_text := REPLACE(cleaned_text, 'sup�rieure', 'supérieure');
    cleaned_text := REPLACE(cleaned_text, 'sup�rieur', 'supérieur');
    cleaned_text := REPLACE(cleaned_text, 'durabilit�', 'durabilité');
    cleaned_text := REPLACE(cleaned_text, 'r�sistance', 'résistance');
    cleaned_text := REPLACE(cleaned_text, 'esth�tique', 'esthétique');
    cleaned_text := REPLACE(cleaned_text, 'rehauss�e', 'rehaussée');
    cleaned_text := REPLACE(cleaned_text, 'm�talliques', 'métalliques');
    cleaned_text := REPLACE(cleaned_text, 'argent�es', 'argentées');
    cleaned_text := REPLACE(cleaned_text, 'raffin�e', 'raffinée');
    cleaned_text := REPLACE(cleaned_text, 'intemporelle', 'intemporelle');
    cleaned_text := REPLACE(cleaned_text, 'mati�re', 'matière');
    cleaned_text := REPLACE(cleaned_text, 'mati�res', 'matières');
    cleaned_text := REPLACE(cleaned_text, 'int�grant', 'intégrant');
    cleaned_text := REPLACE(cleaned_text, 'contemporaine', 'contemporaine');
    cleaned_text := REPLACE(cleaned_text, 'ext�rieure', 'extérieure');
    cleaned_text := REPLACE(cleaned_text, 'personnalis�', 'personnalisé');
    cleaned_text := REPLACE(cleaned_text, 'polyvalent', 'polyvalent');
    cleaned_text := REPLACE(cleaned_text, 'authenticit�', 'authenticité');
    cleaned_text := REPLACE(cleaned_text, 'revisit�', 'revisité');
    cleaned_text := REPLACE(cleaned_text, 'pens�', 'pensé');
    cleaned_text := REPLACE(cleaned_text, 'exigeants', 'exigeants');
    cleaned_text := REPLACE(cleaned_text, 'distinguent', 'distinguent');
    cleaned_text := REPLACE(cleaned_text, 'exceptionnelle', 'exceptionnelle');
    cleaned_text := REPLACE(cleaned_text, 'caract�re', 'caractère');
    cleaned_text := REPLACE(cleaned_text, 'discr�te', 'discrète');
    cleaned_text := REPLACE(cleaned_text, 'inspir�es', 'inspirées');
    cleaned_text := REPLACE(cleaned_text, 'inspir�', 'inspiré');
    cleaned_text := REPLACE(cleaned_text, 'inspir�e', 'inspirée');
    cleaned_text := REPLACE(cleaned_text, 'incarnent', 'incarnent');
    cleaned_text := REPLACE(cleaned_text, 'fonctionnalit�', 'fonctionnalité');
    cleaned_text := REPLACE(cleaned_text, 'pr�cis', 'précis');
    cleaned_text := REPLACE(cleaned_text, 'r�pondant', 'répondant');
    cleaned_text := REPLACE(cleaned_text, 'masculine', 'masculine');
    cleaned_text := REPLACE(cleaned_text, 'distinctive', 'distinctive');
    cleaned_text := REPLACE(cleaned_text, 'tendances', 'tendances');
    cleaned_text := REPLACE(cleaned_text, 'incontournable', 'incontournable');
    
    -- Corrections spéciales pour les caractères accentués
    cleaned_text := REPLACE(cleaned_text, '�', 'à');
    cleaned_text := REPLACE(cleaned_text, '�', 'á');
    cleaned_text := REPLACE(cleaned_text, '�', 'â');
    cleaned_text := REPLACE(cleaned_text, '�', 'ä');
    cleaned_text := REPLACE(cleaned_text, '�', 'è');
    cleaned_text := REPLACE(cleaned_text, '�', 'é');
    cleaned_text := REPLACE(cleaned_text, '�', 'ê');
    cleaned_text := REPLACE(cleaned_text, '�', 'ë');
    cleaned_text := REPLACE(cleaned_text, '�', 'î');
    cleaned_text := REPLACE(cleaned_text, '�', 'ï');
    cleaned_text := REPLACE(cleaned_text, '�', 'ô');
    cleaned_text := REPLACE(cleaned_text, '�', 'ö');
    cleaned_text := REPLACE(cleaned_text, '�', 'ù');
    cleaned_text := REPLACE(cleaned_text, '�', 'ú');
    cleaned_text := REPLACE(cleaned_text, '�', 'û');
    cleaned_text := REPLACE(cleaned_text, '�', 'ü');
    cleaned_text := REPLACE(cleaned_text, '�', 'ç');
    
    -- Amélioration du formatage : ajouter des paragraphes
    -- Séparer les phrases longues en paragraphes logiques
    cleaned_text := REPLACE(cleaned_text, '. Con', '.\n\nCon');
    cleaned_text := REPLACE(cleaned_text, '. Leur', '.\n\nLeur');
    cleaned_text := REPLACE(cleaned_text, '. La ', '.\n\nLa ');
    cleaned_text := REPLACE(cleaned_text, '. Les ', '.\n\nLes ');
    cleaned_text := REPLACE(cleaned_text, '. Grâce', '.\n\nGrâce');
    cleaned_text := REPLACE(cleaned_text, '. Inspiré', '.\n\nInspiré');
    cleaned_text := REPLACE(cleaned_text, '. Parfait', '.\n\nParfait');
    cleaned_text := REPLACE(cleaned_text, '. Optez', '.\n\nOptez');
    cleaned_text := REPLACE(cleaned_text, '. Adoptez', '.\n\nAdoptez');
    cleaned_text := REPLACE(cleaned_text, '. Convient', '.\n\nConvient');
    cleaned_text := REPLACE(cleaned_text, '. Offrez', '.\n\nOffrez');
    
    -- Nettoyer les espaces multiples et les sauts de ligne excessifs
    cleaned_text := REGEXP_REPLACE(cleaned_text, '\s+', ' ', 'g');
    cleaned_text := REGEXP_REPLACE(cleaned_text, '\n\s*\n\s*\n+', '\n\n', 'g');
    cleaned_text := TRIM(cleaned_text);
    
    RETURN cleaned_text;
END;
$$ LANGUAGE plpgsql;

-- Appliquer l'amélioration à toutes les descriptions de produits
UPDATE products 
SET description = improve_product_description(description)
WHERE description IS NOT NULL 
AND description != '';

-- Ajouter un commentaire sur la fonction
COMMENT ON FUNCTION improve_product_description(TEXT) IS 'Corrige l''encodage mojibake et améliore le formatage des descriptions de produits';

-- Afficher un résumé des modifications
SELECT 
    COUNT(*) as total_products_updated,
    COUNT(CASE WHEN description LIKE '%Découvrez%' THEN 1 END) as descriptions_with_decouvrex,
    COUNT(CASE WHEN description LIKE '%\n\n%' THEN 1 END) as descriptions_with_paragraphs
FROM products 
WHERE description IS NOT NULL;
