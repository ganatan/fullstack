# GitFlow — branches `main`, `dev`, `feature`, `fix`, `hotfix`, `release`

## Objectif

Mettre en place un workflow Git clair avec plusieurs branches :
- `main` : production
- `dev` : intégration continue
- `feature/*` : nouvelles fonctionnalités
- `fix/*` : corrections non urgentes
- `hotfix/*` : corrections urgentes en production
- `release/*` : préparation d’une livraison
- `staging` : préproduction si besoin

---

## 1) Rôle des branches

### `main`

- branche stable
- reflète la production
- on ne développe pas directement dessus

### `dev`

- branche de travail principale
- regroupe les développements validés
- base de départ des `feature/*` et `fix/*`

### `feature/*`

- pour une nouvelle fonctionnalité
- créée à partir de `dev`
- fusionnée dans `dev`

Exemples :
- `feature/routing`
- `feature/lazy-loading`
- `feature/login`

### `fix/*`

- pour une correction classique
- créée à partir de `dev`
- fusionnée dans `dev`

Exemples :
- `fix/header-overflow`
- `fix/api-timeout`

### `hotfix/*`

- pour corriger un bug critique en production
- créée à partir de `main`
- fusionnée dans `main`
- puis reportée dans `dev`

Exemples :
- `hotfix/login-500`
- `hotfix/payment-crash`

### `release/*`

- branche temporaire pour préparer une version
- créée à partir de `dev`
- permet de figer une livraison
- fusionnée dans `main`
- puis reportée dans `dev`

Exemples :
- `release/1.0.0`
- `release/1.1.0`

### `staging`

- optionnelle
- branche représentant la préproduction
- utile si tu veux un environnement intermédiaire entre `dev` et `main`

---

## 2) Schéma simple

```text
main
 └── hotfix/*
      ↑
release/*
      ↑
staging
      ↑
dev
 ├── feature/*
 └── fix/*
```

---

## 3) Création des branches principales

### Créer `main`

```bash
git checkout -b main
git push -u origin main
```

### Créer `dev`

```bash
git checkout -b dev
git push -u origin dev
```

### Créer `staging` si besoin

```bash
git checkout -b staging
git push -u origin staging
```

---

## 4) Développer une fonctionnalité

Créer une feature depuis `dev` :

```bash
git checkout dev
git pull origin dev
git checkout -b feature/routing
```

Travailler puis commit :

```bash
git add .
git commit -m "feat: add routing"
```

Pousser la branche :

```bash
git push -u origin feature/routing
```

Quand la feature est terminée :
- ouvrir une PR de `feature/routing` vers `dev`

Après merge :

```bash
git checkout dev
git pull origin dev
git branch -d feature/routing
git push origin --delete feature/routing
```

---

## 5) Corriger un bug classique avec `fix/*`

Créer une branche depuis `dev` :

```bash
git checkout dev
git pull origin dev
git checkout -b fix/header-overflow
```

Commit :

```bash
git add .
git commit -m "fix: header overflow on mobile"
git push -u origin fix/header-overflow
```

Créer une PR de `fix/header-overflow` vers `dev`.

---

## 6) Préparer une release

Créer une branche `release/*` depuis `dev` :

```bash
git checkout dev
git pull origin dev
git checkout -b release/1.0.0
git push -u origin release/1.0.0
```

Sur cette branche :
- corrections finales
- tests
- versionning
- validation QA

Exemple de commit :

```bash
git add .
git commit -m "chore: prepare release 1.0.0"
```

---

## 7) Déployer via `staging` si besoin

Si tu utilises `staging`, tu peux fusionner la release dans `staging` avant `main`.

```bash
git checkout staging
git pull origin staging
git merge release/1.0.0
git push origin staging
```

But :
- tester en préproduction
- valider avant prod

---

## 8) Passer la release en production

Fusionner la release dans `main` :

```bash
git checkout main
git pull origin main
git merge release/1.0.0
git push origin main
```

Créer un tag :

```bash
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0
```

---

## 9) Reporter la release dans `dev`

Important : `main` et `dev` doivent rester synchronisés.

```bash
git checkout dev
git pull origin dev
git merge release/1.0.0
git push origin dev
```

Supprimer la branche release :

```bash
git branch -d release/1.0.0
git push origin --delete release/1.0.0
```

---

## 10) Gérer un hotfix de production

Créer un hotfix depuis `main` :

```bash
git checkout main
git pull origin main
git checkout -b hotfix/login-500
```

Faire la correction :

```bash
git add .
git commit -m "fix: resolve login 500 in production"
git push -u origin hotfix/login-500
```

Créer une PR de `hotfix/login-500` vers `main`.

Après validation :
- merger dans `main`
- tagger si besoin
- reporter aussi dans `dev`

### Fusion dans `main`

```bash
git checkout main
git pull origin main
git merge hotfix/login-500
git push origin main
```

### Report dans `dev`

```bash
git checkout dev
git pull origin dev
git merge hotfix/login-500
git push origin dev
```

Supprimer la branche :

```bash
git branch -d hotfix/login-500
git push origin --delete hotfix/login-500
```

---

## 11) Règles pratiques

- jamais de développement direct sur `main`
- éviter de développer directement sur `dev`
- toujours partir de la bonne branche
- toujours faire une PR
- supprimer les branches terminées
- synchroniser souvent avec `dev`
- un hotfix part de `main`, pas de `dev`
- une feature revient dans `dev`, pas dans `main`

---

## 12) Convention de nommage

Exemples :

```text
main
dev
staging
feature/routing
feature/lazy-loading
feature/auth-jwt
fix/css-header
fix/api-timeout
release/1.0.0
release/1.1.0
hotfix/login-500
hotfix/payment-nullpointer
```

---

## 13) Cycle typique complet

### Nouvelle fonctionnalité

```text
dev
  -> feature/routing
  -> PR vers dev
  -> merge dans dev
```

### Préparation de version

```text
dev
  -> release/1.0.0
  -> tests
  -> staging
  -> main
  -> merge retour dans dev
```

### Bug urgent en prod

```text
main
  -> hotfix/login-500
  -> main
  -> merge retour dans dev
```

---

## 14) Commandes utiles

Voir toutes les branches :

```bash
git branch
git branch -a
```

Récupérer les branches distantes :

```bash
git fetch --all --prune
```

Changer de branche :

```bash
git checkout dev
git checkout feature/routing
```

Créer une branche :

```bash
git checkout -b feature/routing
```

Voir les remotes :

```bash
git remote -v
```

Voir l’historique :

```bash
git log --oneline --graph --decorate --all
```

---

## 15) Workflow simple recommandé

### Cas standard

```text
main      = production
staging   = préproduction
dev       = intégration
feature/* = nouvelles fonctionnalités
fix/*     = corrections
release/* = préparation livraison
hotfix/*  = urgence production
```

---

## 16) Résumé ultra simple

- `main` = prod
- `dev` = branche principale de dev
- `feature/*` = nouvelle feature depuis `dev`
- `fix/*` = correction normale depuis `dev`
- `release/*` = préparation d’une version depuis `dev`
- `staging` = préprod optionnelle
- `hotfix/*` = correctif urgent depuis `main`

---

## 17) Exemple concret

Tu veux ajouter du routing :

```bash
git checkout dev
git pull origin dev
git checkout -b feature/routing
```

Tu veux corriger un bug CSS :

```bash
git checkout dev
git pull origin dev
git checkout -b fix/header-mobile
```

Tu veux préparer la version 1.2.0 :

```bash
git checkout dev
git pull origin dev
git checkout -b release/1.2.0
```

Tu veux corriger un bug critique en prod :

```bash
git checkout main
git pull origin main
git checkout -b hotfix/login-500
```