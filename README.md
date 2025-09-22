# 👟 Karnaval - Plateforme E-commerce de Sneakers Reconditionnées

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **Karnaval** est une plateforme e-commerce révolutionnaire spécialisée dans la vente de sneakers reconditionnées. Fondée par **Philippine Pujol**, notre mission est de donner une seconde vie aux sneakers tout en offrant des prix accessibles et un impact environnemental positif.

## 🌟 Aperçu du Projet

Karnaval transforme l'industrie de la mode en proposant :
- **Sneakers reconditionnées** de qualité "comme neuve"
- **Sourcing responsable** depuis l'Europe (Berlin, Amsterdam, Milan)
- **Reconditionnement en France** avec un protocole strict
- **Impact positif** : 12 000+ paires sauvées, 140 tonnes de CO₂ évitées
- **Économies** : 18€ d'économie moyenne par paire

## 📋 Table des matières

- [🚀 Fonctionnalités](#-fonctionnalités)
- [🛠️ Technologies](#️-technologies)
- [📦 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [📁 Structure du projet](#-structure-du-projet)
- [👥 Gestion des utilisateurs](#-gestion-des-utilisateurs)
- [🛒 E-commerce](#-e-commerce)
- [📊 Administration](#-administration)
- [🧪 Tests](#-tests)
- [🚀 Déploiement](#-déploiement)
- [🤝 Contribution](#-contribution)
- [📞 Support](#-support)

## 🚀 Fonctionnalités

### 🛍️ **E-commerce Complet**
- **Catalogue interactif** avec filtres avancés et recherche
- **Pages produit détaillées** avec visualisation 3D (Sketchfab)
- **Panier intelligent** avec gestion des tailles et quantités
- **Système de commandes** complet avec suivi
- **Codes promotionnels** et réductions automatiques
- **Favoris utilisateur** avec synchronisation
- **Notifications en temps réel** pour les mises à jour

### 👥 **Gestion Multi-Rôles**
- **Clients** : Achat, favoris, historique des commandes
- **Vendeurs** : Gestion des produits, suivi des ventes
- **Administrateurs** : Gestion complète, analytics, utilisateurs

### 🎨 **Interface Moderne**
- **Design responsive** mobile-first
- **Mode sombre/clair** automatique
- **Animations fluides** et micro-interactions
- **Accessibilité** optimisée (WCAG 2.1)
- **Performance** optimisée avec lazy loading

### 📊 **Analytics et Insights**
- **Dashboard administrateur** avec métriques clés
- **Suivi des ventes** et performance des produits
- **Analytics utilisateur** et comportement d'achat
- **Rapports** de performance et tendances

## 🛠️ Technologies

### **Frontend**
- **React 18** - Bibliothèque UI avec hooks modernes
- **TypeScript** - Typage statique pour la robustesse
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utilitaire
- **Shadcn/ui** - Composants UI réutilisables et accessibles
- **React Router DOM** - Routing côté client
- **React Hook Form** - Gestion des formulaires performante
- **Zod** - Validation de schémas type-safe
- **TanStack Query** - Gestion d'état serveur
- **Lucide React** - Icônes modernes et cohérentes
- **React Three Fiber** - Visualisation 3D des produits
- **Recharts** - Graphiques et analytics

### **Backend et Base de données**
- **Supabase** - Backend as a Service complet
- **PostgreSQL** - Base de données relationnelle robuste
- **Row Level Security (RLS)** - Sécurité au niveau des lignes
- **Supabase Auth** - Authentification sécurisée
- **Supabase Storage** - Stockage de fichiers optimisé
- **Edge Functions** - Fonctions serverless pour la logique métier

### **Outils de développement**
- **Vitest** - Framework de tests moderne
- **Testing Library** - Tests des composants React
- **ESLint** - Linting du code avec règles strictes
- **Papa Parse** - Parsing CSV pour l'import de données
- **Date-fns** - Manipulation des dates
- **Class Variance Authority** - Gestion des variantes CSS

## 📦 Installation

### **Prérequis**
- Node.js 18+ et npm
- Compte Supabase (gratuit)
- Git
 
### **Étapes d'installation**

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/karnaval-reborn.git
cd karnaval-reborn
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration des variables d'environnement**
```bash
cp .env.example .env
```

4. **Configurer Supabase**
   - Créer un projet Supabase
   - Exécuter les migrations (voir section Configuration)
   - Configurer les politiques RLS

5. **Démarrer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:8080` (ou le port suivant disponible)

## ⚙️ Configuration

### **Variables d'environnement**
Créez un fichier `.env` avec les variables suivantes :

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Development settings
VITE_APP_ENV=development
VITE_APP_VERSION=1.0.0
```

### **Configuration Supabase**

1. **Créer un projet Supabase**
   - Aller sur [supabase.com](https://supabase.com)
   - Créer un nouveau projet
   - Noter l'URL et la clé anonyme

2. **Exécuter les migrations**
```bash
# Les migrations sont dans le dossier supabase/migrations/
# Elles seront exécutées automatiquement lors du déploiement
```

3. **Configurer les politiques RLS**
   - Les politiques sont définies dans les fichiers de migration
   - Vérifier que toutes les tables ont RLS activé

4. **Configurer l'authentification**
   - Activer l'authentification par email
   - Configurer les templates d'email
   - Définir les règles de mot de passe

## 📁 Structure du projet

```
karnaval-reborn/
├── src/
│   ├── components/              # Composants réutilisables
│   │   ├── 3d/                 # Composants de visualisation 3D
│   │   │   └── SketchfabViewer.tsx
│   │   ├── layouts/            # Layouts (Header, Footer, etc.)
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── PublicLayout.tsx
│   │   ├── ui/                 # Composants UI Shadcn
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── UserManagement.tsx  # Gestion des utilisateurs
│   │   ├── ProductManagement.tsx # Gestion des produits
│   │   ├── PromoCodeManagement.tsx # Gestion des codes promo
│   │   └── ...
│   ├── pages/                  # Pages de l'application
│   │   ├── auth/              # Pages d'authentification
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── profile/           # Pages de profil par rôle
│   │   │   ├── AdminProfile.tsx
│   │   │   ├── VendorProfile.tsx
│   │   │   └── ClientProfile.tsx
│   │   ├── About.tsx          # Page À propos
│   │   ├── Index.tsx          # Page d'accueil
│   │   ├── Catalogue.tsx      # Catalogue produits
│   │   ├── ProductPage.tsx    # Page produit détaillée
│   │   ├── Cart.tsx           # Panier
│   │   ├── Checkout.tsx       # Checkout
│   │   └── ...
│   ├── hooks/                 # Hooks personnalisés
│   │   ├── useAuth.ts         # Authentification
│   │   ├── useCart.ts         # Gestion du panier
│   │   ├── usePromoCode.ts    # Codes promotionnels
│   │   ├── useOrders.ts       # Gestion des commandes
│   │   └── ...
│   ├── lib/                   # Utilitaires et helpers
│   │   ├── types.ts           # Types TypeScript
│   │   ├── text-utils.ts      # Utilitaires de texte
│   │   ├── utils.ts           # Utilitaires généraux
│   │   └── api-utils.ts       # Utilitaires API
│   ├── integrations/          # Intégrations externes
│   │   └── supabase/
│   │       ├── client.ts      # Client Supabase
│   │       └── types.ts       # Types Supabase
│   ├── data/                  # Données statiques
│   │   └── karnaval-products.csv
│   ├── scripts/               # Scripts d'importation
│   │   └── import-karnaval-products.ts
│   └── test/                  # Configuration des tests
│       └── setup.ts
├── supabase/                  # Configuration Supabase
│   └── migrations/            # Migrations de base de données
├── scripts/                   # Scripts utilitaires
│   └── run-tests.sh          # Script de tests
├── public/                    # Assets statiques
├── docs/                      # Documentation
│   ├── TESTING.md            # Guide des tests
│   └── TEST_SUMMARY.md       # Résumé des tests
├── vitest.config.ts          # Configuration Vitest
├── tailwind.config.js        # Configuration Tailwind
├── tsconfig.json             # Configuration TypeScript
└── package.json              # Dépendances et scripts
```

## 👥 Gestion des utilisateurs

### **Système de rôles**

#### **👤 Client**
- **Fonctionnalités** : Achat, favoris, historique des commandes
- **Accès** : Catalogue, panier, profil personnel
- **Permissions** : Lecture des produits, création de commandes

#### **🏪 Vendeur**
- **Fonctionnalités** : Gestion des produits, suivi des ventes
- **Accès** : Dashboard vendeur, gestion des stocks
- **Permissions** : CRUD sur ses produits, lecture de ses commandes

#### **👑 Administrateur**
- **Fonctionnalités** : Gestion complète, analytics, utilisateurs
- **Accès** : Dashboard admin, gestion des utilisateurs, codes promo
- **Permissions** : Accès complet à toutes les fonctionnalités

### **Authentification**
- **Inscription/Connexion** par email et mot de passe
- **Réinitialisation** de mot de passe par email
- **Sessions** persistantes avec tokens JWT
- **Sécurité** avec Row Level Security (RLS)

## 🛒 E-commerce

### **Catalogue Produits**
- **Filtres avancés** : Marque, taille, couleur, prix
- **Recherche intelligente** avec suggestions
- **Tri dynamique** : Prix, popularité, nouveauté
- **Pagination** et chargement infini
- **Vue grille/liste** avec préférences utilisateur

### **Pages Produit**
- **Galerie d'images** haute résolution
- **Visualisation 3D** intégrée (Sketchfab)
- **Informations détaillées** : Description, tailles, stock
- **Recommandations** de produits similaires
- **Avis et notes** (à venir)

### **Panier et Checkout**
- **Gestion des quantités** et tailles
- **Codes promotionnels** avec validation en temps réel
- **Calcul automatique** des totaux et taxes
- **Sauvegarde** automatique dans localStorage
- **Processus de commande** en étapes

### **Système de Commandes**
- **Suivi en temps réel** du statut
- **Notifications** par email
- **Historique complet** des commandes
- **Gestion des retours** et remboursements

## 📊 Administration

### **Dashboard Administrateur**
- **Métriques clés** : Ventes, utilisateurs, produits
- **Graphiques** de performance et tendances
- **Alertes** et notifications importantes
- **Accès rapide** aux fonctionnalités principales

### **Gestion des Utilisateurs**
- **Création** de nouveaux utilisateurs (vendeurs/admins)
- **Réinitialisation** de mots de passe
- **Attribution** et modification des rôles
- **Suppression** et désactivation de comptes
- **Filtres** et recherche d'utilisateurs

### **Gestion des Produits**
- **Import en masse** via fichiers CSV
- **CRUD complet** des produits
- **Gestion des stocks** par taille
- **Images** et médias
- **Catégorisation** et tags

### **Gestion des Codes Promo**
- **Création** de codes promotionnels
- **Types de réduction** : Pourcentage ou montant fixe
- **Limites** d'utilisation et dates de validité
- **Suivi** des utilisations et performance

## 🧪 Tests

### **Suite de Tests Complète**

#### **Tests Unitaires**
- **Hooks personnalisés** : `useAuth`, `useCart`, `usePromoCode`
- **Utilitaires** : `text-utils`, `types`
- **Composants** : `UserManagement`, `ProductManagement`, `PromoCodeManagement`

#### **Tests d'Intégration**
- **Flux complets** : Authentification, panier, commandes
- **Interactions** entre composants
- **Persistance** des données

#### **Tests de Pages**
- **Rendu** des pages principales
- **Navigation** et routing
- **Contenu** et structure

### **Exécution des Tests**

```bash
# Exécuter tous les tests
npm run test

# Tests en mode watch
npm run test:watch

# Tests avec couverture de code
npm run test:coverage

# Script personnalisé avec rapport
./scripts/run-tests.sh
```

### **Métriques de Qualité**
- **Couverture de code** : 70%+ sur tous les métriques
- **Tests stables** : Pas de tests flaky
- **Performance** : Temps d'exécution < 30 secondes
- **Maintenabilité** : Tests lisibles et documentés

## 🚀 Déploiement

### **Déploiement avec Lovable (Recommandé)**

1. **Connecter le repository GitHub**
   - Aller sur [lovable.dev](https://lovable.dev)
   - Connecter votre compte GitHub
   - Sélectionner le repository Karnaval Kicks

2. **Configuration automatique**
   - Lovable détecte automatiquement la configuration
   - Déploiement automatique à chaque push
   - Variables d'environnement configurées

3. **Domaine personnalisé**
   - Configurer un domaine personnalisé si nécessaire
   - SSL automatique et CDN global

### **Déploiement Manuel**

#### **Avec Vercel**
```bash
# Installation de Vercel CLI
npm i -g vercel

# Déploiement
vercel --prod

# Configuration des variables d'environnement
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

#### **Avec Netlify**
```bash
# Installation de Netlify CLI
npm i -g netlify-cli

# Build et déploiement
npm run build
netlify deploy --prod --dir=dist
```

#### **Avec Docker**
```dockerfile
# Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### **Variables d'environnement en production**
Assurez-vous de configurer toutes les variables d'environnement sur votre plateforme de déploiement :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🤝 Contribution

### **Workflow de développement**

1. **Fork** le repository
2. **Créer** une branche feature (`git checkout -b feature/amazing-feature`)
3. **Développer** avec les standards de code
4. **Tester** vos modifications (`npm run test`)
5. **Commiter** avec un message descriptif
6. **Pousser** vers la branche (`git push origin feature/amazing-feature`)
7. **Ouvrir** une Pull Request

### **Standards de code**

- **TypeScript** obligatoire pour tout nouveau code
- **ESLint** : Suivre les règles configurées
- **Tests** : Écrire des tests pour les nouvelles fonctionnalités
- **Documentation** : Documenter les fonctions complexes
- **Commits** : Utiliser le format conventional commits

### **Structure des commits**
```
type(scope): description

feat(auth): add social login functionality
fix(cart): resolve quantity update bug
docs(readme): update installation instructions
test(components): add unit tests for UserManagement
refactor(utils): improve text formatting functions
```

### **Code Review**
- **Revue** obligatoire pour toutes les PR
- **Tests** doivent passer avant merge
- **Couverture** de code maintenue
- **Documentation** mise à jour si nécessaire

## 📞 Support

### **Documentation**
- **Guide des tests** : [TESTING.md](./docs/TESTING.md)
- **Résumé des tests** : [TEST_SUMMARY.md](./docs/TEST_SUMMARY.md)
- **API Documentation** : Documentation Supabase intégrée

### **Communauté**
- **Issues GitHub** : Pour les bugs et demandes de fonctionnalités
- **Discussions** : Pour les questions et idées
- **Discord** : Communauté active (lien à venir)

### **Contact**
- **Email** : support@karnaval.com
- **Twitter** : [@Karnaval](https://twitter.com/karnaval)
- **LinkedIn** : [Karnaval](https://linkedin.com/company/karnaval)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

## 🙏 Remerciements

- **Philippine Pujol** - Fondatrice et visionnaire
- **L'équipe de développement** - Pour leur travail exceptionnel
- **La communauté Supabase** - Pour l'excellent backend
- **Les contributeurs open source** - Pour les outils utilisés

---

## 🌱 Impact Environnemental

**Karnaval** s'engage pour un avenir plus durable :

- **12 000+ paires** de sneakers sauvées de la décharge
- **140 tonnes de CO₂** évitées
- **18€ d'économie** moyenne par paire
- **Reconditionnement local** en France
- **Sourcing responsable** depuis l'Europe

*Ensemble, créons une mode plus responsable ! 👟🌍*

---

**URL du projet Lovable** : https://lovable.dev/projects/3701b895-9692-4e0a-9c28-c60d2f51eed0

**Développé avec ❤️ par l'équipe Karnaval**

*Dernière mise à jour : Janvier 2025*