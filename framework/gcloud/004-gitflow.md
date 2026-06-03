# Workflow Git Simple et Moderne

## Objectif

Mettre en place un workflow Git simple, lisible et facile à expliquer en entretien.

Branches principales :

```text
main
 ^
 |
dev
```

Branches temporaires :

```text
feature/*
release/*
hotfix/*
```

---

# 1. Développement d'une fonctionnalité

Création :

```text
dev
 |
 +--> feature/login
```

Développement :

```bash
git checkout -b feature/login
```

Une fois terminé :

```text
feature/login
      |
      v
      dev
```

---

## Pipeline déclenché sur dev

```text
Lint

Unit Tests

Integration Tests

Coverage

SonarQube

Build

Docker Build

Docker Push

Deploy DEV
```

Objectif :

Valider rapidement les développements.

---

# 2. Préparation d'une release

Lorsque plusieurs fonctionnalités sont validées :

```text
dev
 |
 +--> release/1.4.0
```

ou simplement :

```text
Tag v1.4.0
```

---

## Pipeline STAGING

```text
Deploy STAGING

Tests E2E

Smoke Tests

Validation métier
```

Objectif :

Tester l'application complète dans un environnement proche de la production.

---

# 3. Mise en production

Une fois la recette validée :

```text
dev
 |
 v
main
```

---

## Pipeline PROD

```text
Deploy Production
```

Optionnel :

```text
Validation manuelle

Rollback automatique

Smoke Tests
```

---

# 4. Gestion des hotfix

Correction urgente en production :

```text
main
 |
 +--> hotfix/security-fix
```

Développement :

```bash
git checkout -b hotfix/security-fix
```

---

Une fois validé :

```text
hotfix/security-fix
          |
          v
         main
```

Puis :

```text
main
 |
 v
dev
```

afin de conserver les branches synchronisées.

---

# 5. Gestion des versions

Utilisation du versioning sémantique.

Format :

```text
MAJOR.MINOR.PATCH
```

Exemples :

```text
v1.0.0
v1.0.1
v1.0.2
```

Correction :

```text
PATCH
```

---

```text
v1.1.0
```

Nouvelle fonctionnalité compatible :

```text
MINOR
```

---

```text
v2.0.0
```

Rupture de compatibilité :

```text
MAJOR
```

---

# 6. Déploiements basés sur les tags

Exemple :

```text
Tag v1.4.0
      |
      v
Deploy STAGING
```

ou :

```text
Tag v1.4.0
      |
      v
Deploy PROD
```

Très courant dans GitLab CI/CD.

---

# 7. CHANGELOG

Un fichier unique :

```text
CHANGELOG.md
```

Exemple :

```md
## v1.4.0

### Added

- création document
- suppression document

### Fixed

- correction authentification JWT

### Changed

- optimisation RabbitMQ
```

Objectif :

- Historiser les évolutions
- Faciliter les releases
- Simplifier les audits
- Communiquer avec les équipes

---

# 8. Vision globale

```text
feature/*
      |
      v

     dev

      |
      +----------------------+
      |                      |
      v                      v

Tests               Deploy DEV

      |
      v

Release / Tag

      |
      v

Deploy STAGING

      |
      v

Tests E2E

      |
      v

Validation

      |
      v

Merge vers main

      |
      v

Deploy PROD
```

---

# Réponse entretien

Nous utilisons une branche `main` représentant la production et une branche `dev` représentant l'intégration. Les développements sont réalisés sur des branches `feature/*`. Le merge vers `dev` déclenche les tests, SonarQube, la construction des images Docker et le déploiement de l'environnement de développement. Les versions sont identifiées par des tags SemVer et déployées sur l'environnement de staging avec exécution des tests E2E. Le passage en production s'effectue par merge de `dev` vers `main`. Les corrections urgentes utilisent des branches `hotfix/*` créées depuis `main`, puis réintégrées dans `main` et `dev`. Un fichier `CHANGELOG.md` permet de tracer les évolutions de chaque version.