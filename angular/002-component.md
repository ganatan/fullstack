# angular-component

# Création d'un component

    ng g component components/edit
    ng g component components/table

    ng g c components/edit
    ng g c components/table

# Décorateur @Component

- @Component({...})

c'est : interface TypeDecorator

Décorateur Angular qui transforme une classe TypeScript en composant Angular.
Il permet de configurer le composant (template, styles, dépendances…).

# Liste des propriétés d'un décorateur

- Par défaut
  - selector
  - imports
  - templateUrl
  - styleUrl

# Liste

| Propriété | Type | Utilité |
| --- | --- | --- |
| selector | string | Nom de la balise HTML du composant. |
| standalone | boolean | Composant comme autonome (sans NgModule). |
| imports | Array | Liste des composants/directives/pipes |
| template | string | Template inline directement dans le code. |
| templateUrl | string | Lien vers un fichier HTML externe. |
| styles | string[] | Styles inline. |
| styleUrls | string[] | Liste de fichiers CSS externes. |
| styleUrl | string | Version simplifiée pour un seul fichier CSS. |
| encapsulation | ViewEncapsulation | Contrôle le scoping des styles. |
| changeDetection | ChangeDetectionStrategy | Stratégie de détection de changements |
| viewProviders | Provider[] | DI spécifique . |
| animations | AnimationMetadata[] | Déclaration des animations Angular. |
| preserveWhitespaces | boolean | Garde les espaces dans le template. |

# Parametres

    @Input() value = '';
