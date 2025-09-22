# 🧪 Guide de Tests - Karnaval

Ce document décrit la stratégie de tests mise en place pour le projet Karnaval et comment les exécuter.

## 📋 Vue d'ensemble

Le projet utilise **Vitest** comme framework de test principal, avec **React Testing Library** pour les tests de composants et **Jest DOM** pour les matchers personnalisés.

## 🏗️ Structure des Tests

```
src/
├── __tests__/                    # Tests d'intégration
│   ├── integration.test.tsx      # Tests de flux complets
│   └── test-runner.ts           # Utilitaires de test
├── components/__tests__/         # Tests de composants
│   ├── UserManagement.test.tsx
│   ├── ProductManagement.test.tsx
│   ├── PromoCodeManagement.test.tsx
│   └── FavoriteButton.test.tsx
├── hooks/__tests__/              # Tests de hooks
│   ├── useAuth.test.ts
│   ├── useCart.test.ts
│   └── usePromoCode.test.ts
├── lib/__tests__/                # Tests d'utilitaires
│   ├── text-utils.test.ts
│   └── types.test.ts
├── pages/__tests__/              # Tests de pages
│   ├── About.test.tsx
│   ├── Index.test.tsx
│   └── ...
└── test/
    └── setup.ts                  # Configuration des tests
```

## 🚀 Exécution des Tests

### Commandes Disponibles

```bash
# Exécuter tous les tests
npm run test

# Exécuter les tests en mode watch
npm run test:watch

# Exécuter les tests avec couverture
npm run test:coverage

# Exécuter le script de test personnalisé
./scripts/run-tests.sh
```

### Tests par Catégorie

```bash
# Tests des hooks uniquement
npm run test src/hooks/__tests__/

# Tests des composants uniquement
npm run test src/components/__tests__/

# Tests des utilitaires uniquement
npm run test src/lib/__tests__/

# Tests d'intégration uniquement
npm run test src/__tests__/
```

## 📊 Couverture de Code

La couverture de code est configurée avec les seuils suivants :
- **Branches** : 70%
- **Functions** : 70%
- **Lines** : 70%
- **Statements** : 70%

### Rapport de Couverture

Après l'exécution des tests avec couverture, vous pouvez consulter :
- **Rapport HTML** : `coverage/index.html`
- **Rapport JSON** : `coverage/coverage-final.json`
- **Rapport texte** : Affiché dans le terminal

## 🧩 Types de Tests

### 1. Tests Unitaires

**Hooks personnalisés** (`useAuth`, `useCart`, `usePromoCode`)
- Testent la logique métier
- Vérifient les états et les transitions
- Testent les interactions avec l'API

**Utilitaires** (`text-utils`, `types`)
- Testent les fonctions pures
- Vérifient la transformation des données
- Testent la validation des entrées

### 2. Tests de Composants

**Composants de gestion** (`UserManagement`, `ProductManagement`, `PromoCodeManagement`)
- Testent le rendu des composants
- Vérifient les interactions utilisateur
- Testent les états de chargement et d'erreur

**Composants UI** (`FavoriteButton`, etc.)
- Testent le comportement des composants
- Vérifient les props et les événements
- Testent l'accessibilité

### 3. Tests de Pages

**Pages principales** (`About`, `Index`, `Cart`, `Checkout`)
- Testent le rendu des pages
- Vérifient la structure et le contenu
- Testent la navigation et les liens

### 4. Tests d'Intégration

**Flux complets** (`integration.test.tsx`)
- Testent les parcours utilisateur complets
- Vérifient l'intégration entre les composants
- Testent la persistance des données

## 🔧 Configuration

### Mocks et Stubs

Le projet utilise des mocks pour :
- **Supabase** : Client de base de données
- **React Router** : Navigation
- **localStorage** : Stockage local
- **Toast** : Notifications
- **Images** : Assets statiques

### Configuration des Tests

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
  },
});
```

## 🐛 Dépannage

### Problèmes Courants

1. **Tests qui échouent de manière intermittente**
   - Vérifiez les mocks asynchrones
   - Utilisez `waitFor` pour les opérations asynchrones
   - Vérifiez la configuration des timeouts

2. **Erreurs de couverture**
   - Vérifiez les seuils de couverture
   - Excluez les fichiers non testables
   - Ajoutez des tests pour les branches manquantes

3. **Problèmes de mocks**
   - Vérifiez la configuration des mocks
   - Assurez-vous que les mocks sont réinitialisés
   - Vérifiez les imports des modules mockés

### Commandes de Debug

```bash
# Exécuter un test spécifique
npm run test UserManagement.test.tsx

# Exécuter avec verbose
npm run test -- --reporter=verbose

# Exécuter avec debug
npm run test -- --inspect-brk
```

## 📈 Amélioration Continue

### Bonnes Pratiques

1. **Nommage des tests**
   - Utilisez des descriptions claires
   - Groupez les tests par fonctionnalité
   - Utilisez des noms qui décrivent le comportement attendu

2. **Structure des tests**
   - Arrange, Act, Assert
   - Un test, une assertion
   - Tests indépendants

3. **Mocks et stubs**
   - Mockez les dépendances externes
   - Utilisez des données de test réalistes
   - Réinitialisez les mocks entre les tests

### Métriques de Qualité

- **Couverture de code** : Maintenir au-dessus de 70%
- **Temps d'exécution** : Tests rapides (< 30s)
- **Maintenabilité** : Tests lisibles et maintenables
- **Fiabilité** : Tests stables et reproductibles

## 🔄 Intégration CI/CD

### GitHub Actions

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
```

### Pipeline de Déploiement

1. **Tests unitaires** : Exécutés à chaque commit
2. **Tests d'intégration** : Exécutés sur les pull requests
3. **Tests de régression** : Exécutés avant le déploiement
4. **Tests de performance** : Exécutés périodiquement

## 📚 Ressources

- [Documentation Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [Guide de Tests React](https://react.dev/learn/testing)

## 🤝 Contribution

Pour ajouter de nouveaux tests :

1. Créez le fichier de test dans le bon répertoire
2. Suivez la convention de nommage
3. Ajoutez des tests pour les cas d'usage principaux
4. Vérifiez que la couverture reste au-dessus des seuils
5. Documentez les tests complexes

---

**Note** : Ce guide est évolutif et sera mis à jour au fur et à mesure de l'ajout de nouvelles fonctionnalités et tests.
