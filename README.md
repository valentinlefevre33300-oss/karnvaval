# 🛍️ Karnaval E-commerce

Une plateforme e-commerce moderne spécialisée dans la vente de chaussures et sneakers, développée avec React, TypeScript et Supabase.

## 📋 Table des matières

- [Aperçu du projet](#aperçu-du-projet)
- [Technologies utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Configuration](#configuration)
- [Structure du projet](#structure-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Authentification et rôles](#authentification-et-rôles)
- [Base de données](#base-de-données)
- [API et intégrations](#api-et-intégrations)
- [Tests](#tests)
- [Déploiement](#déploiement)
- [Contribution](#contribution)

## 🎯 Aperçu du projet

Karnaval est une plateforme e-commerce complète qui permet :
- La vente en ligne de chaussures et sneakers
- La gestion multi-rôles (clients, vendeurs, administrateurs)
- Un système de panier et commandes complet
- La gestion des favoris et codes promo
- Une interface responsive et moderne

## 🚀 Technologies utilisées

### Frontend
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite** - Build tool et serveur de développement
- **Tailwind CSS** - Framework CSS utilitaire
- **Shadcn/ui** - Composants UI réutilisables
- **React Router DOM** - Routing côté client
- **React Hook Form** - Gestion des formulaires
- **Zod** - Validation de schémas
- **React Query** - Gestion d'état serveur
- **Lucide React** - Icônes
- **React Three Fiber** - Visualisation 3D
- **Recharts** - Graphiques et analytics

### Backend et Base de données
- **Supabase** - Backend as a Service
- **PostgreSQL** - Base de données relationnelle
- **Row Level Security (RLS)** - Sécurité au niveau des lignes
- **Supabase Auth** - Authentification
- **Supabase Storage** - Stockage de fichiers
- **Edge Functions** - Fonctions serverless

### Outils de développement
- **Vitest** - Framework de tests
- **Testing Library** - Tests des composants React
- **ESLint** - Linting du code
- **Papa Parse** - Parsing CSV

## 📦 Installation

### Prérequis
- Node.js 18+ et npm
- Compte Supabase (pour la base de données)
 

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration des variables d'environnement**
```bash
cp .env.example .env
```

4. **Démarrer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:8080`

## ⚙️ Configuration

### Variables d'environnement
Créez un fichier `.env` avec les variables suivantes :

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Configuration Supabase
1. Créez un projet Supabase
2. Exécutez les migrations de base de données
3. Configurez les politiques RLS
4. Ajoutez les tables et fonctions nécessaires

## 📁 Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── 3d/             # Composants de visualisation 3D
│   ├── layouts/        # Layouts (Header, Footer, etc.)
│   ├── ui/             # Composants UI Shadcn
│   └── ...             # Autres composants
├── pages/              # Pages de l'application
│   ├── auth/           # Pages d'authentification
│   ├── profile/        # Pages de profil par rôle
│   └── ...             # Autres pages
├── hooks/              # Hooks personnalisés
├── lib/                # Utilitaires et helpers
├── integrations/       # Intégrations externes (Supabase)
├── data/               # Données statiques et CSV
└── scripts/            # Scripts d'importation
```

## ✨ Fonctionnalités

### 🛒 E-commerce
- **Catalogue produits** avec filtres et recherche
- **Pages produit détaillées** avec images et descriptions
- **Panier d'achat** avec gestion des quantités
- **Système de commandes** complet
- **Codes promotionnels** et réductions
- **Gestion des favoris** utilisateur

### 👥 Gestion des utilisateurs
- **Authentification** (inscription/connexion)
- **Profils utilisateurs** personnalisables
- **Système de rôles** (Client, Vendeur, Admin)
- **Gestion des commandes** par utilisateur

### 📊 Administration
- **Dashboard administrateur** avec analytics
- **Gestion des produits** (CRUD)
- **Gestion des commandes** et statuts
- **Import en masse** via fichiers CSV
- **Gestion des codes promo**

### 🎨 Interface utilisateur
- **Design responsive** mobile-first
- **Mode sombre/clair** automatique
- **Animations fluides** et transitions
- **Visualisation 3D** des produits
- **Notifications toast** en temps réel

## 🔐 Authentification et rôles

### Rôles disponibles
- **Client** : Achat, favoris, gestion du profil
- **Vendeur** : Gestion des produits, commandes
- **Admin** : Accès complet, analytics, gestion système

### Sécurité
- **Row Level Security (RLS)** pour toutes les tables
- **Politiques d'accès** granulaires par rôle
- **Validation côté client et serveur**
- **Tokens JWT** sécurisés

## 🗄️ Base de données

### Tables principales
- `profiles` - Profils utilisateurs
- `user_roles` - Attribution des rôles
- `vendor_profiles` - Profils vendeurs
- `products` - Catalogue produits
- `orders` - Commandes
- `order_items` - Articles des commandes
- `favorites` - Favoris utilisateurs
- `promo_codes` - Codes promotionnels

### Fonctions et triggers
- Mise à jour automatique des timestamps
- Calculs de totaux de commandes
- Notifications en temps réel
- Validation des données

## 🔌 API et intégrations

### Supabase
- **API REST** automatique
- **Subscriptions temps réel**
- **Authentification** intégrée
- **Stockage de fichiers**
- **Edge Functions** pour la logique métier

### Services externes
- **Email** via Supabase (confirmations de commande)

## 🧪 Tests

### Exécution des tests
```bash
npm run test          # Tests unitaires
npm run test:watch    # Mode watch
npm run test:coverage # Couverture de code
```

### Types de tests
- **Tests unitaires** des composants
- **Tests d'intégration** des hooks
- **Tests de validation** des types
- **Tests des utilitaires**

## 🚀 Déploiement

### Avec Lovable (recommandé)
1. Connectez votre compte GitHub
2. Cliquez sur "Publish" dans l'interface Lovable
3. Configurez votre domaine personnalisé si nécessaire

### Déploiement manuel
1. **Build de production**
```bash
npm run build
```

2. **Déploiement sur Vercel/Netlify**
```bash
# Avec Vercel CLI
vercel --prod

# Avec Netlify CLI
netlify deploy --prod
```

### Variables d'environnement en production
Assurez-vous de configurer toutes les variables d'environnement sur votre plateforme de déploiement.

## 🤝 Contribution

### Workflow de développement
1. Forkez le repository
2. Créez une branche feature (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

### Standards de code
- Utilisez TypeScript pour tout nouveau code
- Suivez les conventions ESLint configurées
- Écrivez des tests pour les nouvelles fonctionnalités
- Documentez les fonctions complexes

### Structure des commits
```
type(scope): description

feat(auth): add social login functionality
fix(cart): resolve quantity update bug
docs(readme): update installation instructions
```

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Consultez la documentation Lovable
- Rejoignez notre Discord communautaire

---

**URL du projet Lovable** : https://lovable.dev/projects/3701b895-9692-4e0a-9c28-c60d2f51eed0

Développé avec ❤️ using Lovable