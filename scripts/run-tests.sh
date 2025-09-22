#!/bin/bash

# Script pour exécuter tous les tests et générer un rapport

echo "🧪 Démarrage des tests unitaires pour Karnaval..."

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
print_message() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    print_error "package.json non trouvé. Assurez-vous d'être dans le répertoire racine du projet."
    exit 1
fi

# Vérifier que les dépendances sont installées
if [ ! -d "node_modules" ]; then
    print_warning "node_modules non trouvé. Installation des dépendances..."
    npm install
fi

# Créer le répertoire de rapports s'il n'existe pas
mkdir -p reports

print_message "Exécution des tests unitaires..."

# Exécuter les tests avec couverture
npm run test:coverage

# Vérifier le statut de sortie
if [ $? -eq 0 ]; then
    print_success "Tous les tests sont passés avec succès !"
    
    # Afficher le résumé de la couverture
    if [ -f "coverage/coverage-summary.json" ]; then
        print_message "Résumé de la couverture de code :"
        cat coverage/coverage-summary.json | jq '.total' 2>/dev/null || echo "Installation de jq recommandée pour un meilleur affichage"
    fi
    
    # Ouvrir le rapport HTML de couverture
    if [ -f "coverage/index.html" ]; then
        print_message "Rapport de couverture généré : coverage/index.html"
        if command -v open &> /dev/null; then
            open coverage/index.html
        elif command -v xdg-open &> /dev/null; then
            xdg-open coverage/index.html
        fi
    fi
    
else
    print_error "Certains tests ont échoué. Vérifiez les détails ci-dessus."
    exit 1
fi

print_message "Tests terminés. Vérifiez les rapports dans le dossier 'coverage/'"

# Afficher les prochaines étapes
echo ""
print_message "Prochaines étapes recommandées :"
echo "1. Vérifiez le rapport de couverture dans coverage/index.html"
echo "2. Corrigez les tests qui ont échoué"
echo "3. Améliorez la couverture de code si nécessaire"
echo "4. Intégrez ces tests dans votre pipeline CI/CD"
echo ""

print_success "Script de test terminé !"
