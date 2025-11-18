# Mode Noël - Auto-Claim

## Description

Le mode Noël est une fonctionnalité spéciale qui s'active automatiquement pendant le mois de décembre pour donner une ambiance festive à l'application Auto-Claim.

## Fonctionnalités du Mode Noël

### 🎄 Activation Automatique
- Le mode se active automatiquement quand on est en décembre (mois 11 en JavaScript)
- Vérification automatique quotidienne pour l'activation/désactivation
- Pas d'intervention manuelle requise

### 🎨 Modifications Visuelles

#### Interface Générale
- **Couleurs** : Thème rouge et vert de Noël
- **Background** : Dégradé de Noël (rouge vers vert)
- **Décorations** : Flocons de neige animés, guirlandes lumineuses
- **Éléments décoratifs** : Sapin, Père Noël, cadeaux

#### Composants Modifiés
1. **Header/Navigation** : Logo avec emojis de Noël, couleurs festives
2. **Bannières d'annonces** : Style spécial Noël avec fond rouge-vert
3. **Dashboard** : Bannière de bienvenue Noël avec animations
4. **Page d'achat de tokens** : Header spécial, packs avec décorations
5. **Landing Page** : Décorations flottantes, thème festif

### ✨ Animations Spéciales

#### Flocons de Neige
- Animation de chute naturelle
- Rotation pendant la descente
- Opacité variable
- Positionnement aléatoire

#### Guirlandes Lumineuses
- Animation de clignotement
- Changement de couleur (rouge/vert)
- Positionnées en haut de l'écran

#### Éléments Décoratifs
- Sapin animé (léger balancement)
- Père Noël qui "respire" (mouvement vertical)
- Cadeaux avec animation de rebond

### 📱 Adaptabilité

#### Responsive Design
- Optimisé pour mobile et desktop
- Décorations adaptées à la taille d'écran
- Performance préservée sur tous les appareils

#### Performance
- Animations optimisées (CSS transforms)
- Nombre limité d'éléments animés
- Utilisation de `will-change` pour de meilleures performances

## Structure des Fichiers

### Nouveaux Fichiers Créés

```
src/
├── hooks/
│   └── useChristmasMode.ts          # Hook principal pour le mode Noël
├── components/
│   ├── ChristmasDecorations.tsx     # Composant des décorations
│   └── ChristmasMode.css            # Styles spéciaux de Noël
```

### Fichiers Modifiés

```
src/
├── App.tsx                          # Ajout du hook et classe CSS
├── index.css                        # Import des styles Noël
└── components/
    ├── Layout.tsx                   # Integration décorations + header Noël
    ├── Dashboard.tsx                # Bannière de Noël + titre festif
    ├── TokenPurchase.tsx            # Header Noël + styles des packs
    ├── LandingPage.tsx              # Décorations + logo festif
    └── AnnouncementBanner.tsx       # Styles et contenus de Noël
```

## Hook useChristmasMode

### Fonctionnalités
- **Détection automatique** : Vérifie si on est en décembre
- **Vérification quotidienne** : Interval de 24h pour mise à jour
- **Styles prédéfinis** : Couleurs et gradients de Noël
- **Annonce spéciale** : Contenu personnalisé pour Noël
- **Décorations** : Configuration des éléments animés

### API du Hook
```typescript
const {
  isChristmasMode,           // Boolean - true si en décembre
  getChristmasAnnouncement,  // Function - annonce spéciale Noël
  getChristmasStyles,        // Function - styles CSS de Noël
  getChristmasDecorations    // Function - config des décorations
} = useChristmasMode();
```

## Styles CSS Personnalisés

### Classes Principales
- `.christmas-mode` : Classe racine pour le mode Noël
- `.christmas-card` : Cartes avec bordure dégradée Noël
- `.christmas-button` : Boutons avec effet lumineux animé
- `.christmas-text` : Texte avec dégradé rouge-vert
- `.christmas-snowflake` : Animation de chute des flocons

### Animations CSS
- `@keyframes snowfall` : Chute des flocons de neige
- `@keyframes christmasLights` : Clignotement des guirlandes
- `@keyframes treeShake` : Balancement du sapin
- `@keyframes bounce` : Rebond des éléments

## Configuration et Personnalisation

### Modification des Couleurs
Editez le hook `useChristmasMode.ts` :
```typescript
const getChristmasStyles = () => {
  return {
    bannerGradient: 'from-red-600 to-green-600',      // Bannières
    backgroundColor: 'bg-gradient-to-br from-red-50 to-green-50', // Background
    headerGradient: 'from-red-500 to-green-500',       // Header
    accentColor: 'text-red-600',                       // Texte d'accent
    buttonStyle: 'bg-gradient-to-r from-red-500 to-green-500', // Boutons
  };
};
```

### Modification des Décorations
Editez `ChristmasDecorations.tsx` :
- Nombre de flocons : Changez `Array.from({ length: 20 }`
- Vitesse d'animation : Modifiez `duration: Math.random() * 3 + 5`
- Position des décorations : Ajustez les styles `bottom-4 right-4`

### Modification du Contenu
Editez l'annonce dans `useChristmasMode.ts` :
```typescript
const getChristmasAnnouncement = () => {
  return {
    title: '🎄 Votre titre de Noël ! 🎄',
    description: 'Votre description personnalisée...',
    // ...autres propriétés
  };
};
```

## Tests et Développement

### Test du Mode Noël
Pour tester le mode Noël hors décembre :
1. Ouvrir `src/hooks/useChristmasMode.ts`
2. Modifier la condition : `setIsChristmasMode(true);` (forcer à true)
3. Sauvegarder et recharger l'application

### Debugging
- Console logs disponibles pour vérifier l'activation
- Inspection des classes CSS dans les DevTools
- Vérification des animations avec l'onglet Animations

## Maintenance

### Points d'Attention
- **Performance** : Limiter le nombre d'animations simultanées
- **Accessibilité** : Respecter `prefers-reduced-motion`
- **Mobile** : Optimiser pour les petits écrans
- **Mémoire** : Nettoyer les intervals à la désactivation

### Mises à Jour Futures
- Possibilité d'étendre à d'autres fêtes (Halloween, Pâques, etc.)
- Configuration admin pour activer/désactiver manuellement
- Personnalisation utilisateur des décorations
- Mode "Nouvelle Année" pour janvier

## Compatibilité

### Navigateurs Supportés
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Appareils
- Desktop : Toutes les résolutions
- Tablette : Optimisé pour iPad et Android
- Mobile : Responsive sur tous les smartphones

## Conclusion

Le mode Noël apporte une touche festive et engageante à l'application tout en préservant la fonctionnalité et les performances. L'activation automatique en décembre assure une expérience utilisateur saisonnière sans intervention manuelle.
