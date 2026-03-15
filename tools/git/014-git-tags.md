# Git — Tags

## Objectif

Comprendre le rôle des tags Git et savoir les utiliser proprement dans un workflow de versionnement.

---

## 1) Concept

Un tag Git est un repère figé sur un commit précis.

Contrairement à une branche :
- une branche continue d’avancer
- un tag pointe toujours sur le même commit

Un tag sert en général à :
- marquer une version livrée
- identifier une release
- retrouver facilement un état exact du code
- relier un commit à une version métier ou technique

Exemples :
- `v1.0.0`
- `v1.1.0`
- `v2.0.0`
- `release-2026-03`
- `prod-2026-03-15`

---

## 2) À quoi sert un tag

Un tag permet de dire :

- ici, cette version du code correspond à une livraison
- ici, cette version est partie en production
- ici, cette version est stable
- ici, cette version correspond à un jalon fonctionnel

C’est utile pour :
- revenir à une version précise
- comparer deux versions
- déclencher un pipeline CI/CD
- générer une release GitHub ou GitLab
- garder un historique clair des livraisons

---

## 3) Différence entre branche et tag

### Branche

- mobile
- évolue avec de nouveaux commits
- utilisée pour développer

Exemple :
- `dev`
- `feature/routing`
- `release/1.0.0`

### Tag

- figé
- ne bouge pas
- utilisé pour marquer un commit important

Exemple :
- `v1.0.0`
- `v1.0.1`

---

## 4) Exemple simple

Tu as ce flux :

```text
main
 ├── commit A
 ├── commit B
 ├── commit C
 └── commit D
```

Tu livres la version 1.0.0 sur le commit C.

Tu poses alors un tag :

```text
main
 ├── commit A
 ├── commit B
 ├── commit C   <- tag v1.0.0
 └── commit D
```

Même si `main` continue ensuite d’avancer, le tag `v1.0.0` restera toujours sur le commit C.

---

## 5) Types de tags

Il existe 2 grands types de tags :

### Tag léger

- simple pointeur sur un commit
- rapide
- pas de message associé

### Tag annoté

- recommandé
- contient un nom, un message, un auteur, une date
- mieux pour les releases

En pratique :
- utiliser surtout des tags annotés

---

## 6) Convention de nommage

La convention la plus courante est :

```text
vMAJEUR.MINEUR.CORRECTIF
```

Exemples :

```text
v1.0.0
v1.0.1
v1.1.0
v2.0.0
```

---

## 7) Signification classique

### `v1.0.0`

- première version stable

### `v1.0.1`

- correctif mineur de la 1.0.0

### `v1.1.0`

- ajout de fonctionnalités compatibles

### `v2.0.0`

- changement important ou rupture de compatibilité

---

## 8) Voir les tags

Lister tous les tags :

```bash
git tag
```

Lister avec filtre :

```bash
git tag -l "v1.*"
```

---

## 9) Créer un tag léger

Créer un tag simple sur le commit courant :

```bash
git tag v1.0.0
```

---

## 10) Créer un tag annoté

Créer un tag annoté sur le commit courant :

```bash
git tag -a v1.0.0 -m "Release 1.0.0"
```

C’est la méthode recommandée.

---

## 11) Voir les informations d’un tag

Afficher le détail d’un tag :

```bash
git show v1.0.0
```

---

## 12) Tagger un commit précis

D’abord récupérer l’historique :

```bash
git log --oneline
```

Puis tagger un commit précis :

```bash
git tag -a v1.0.0 1a2b3c4 -m "Release 1.0.0"
```

Ici :
- `1a2b3c4` = hash du commit

---

## 13) Pousser un tag sur le remote

Créer un tag en local ne l’envoie pas automatiquement sur GitHub ou GitLab.

Pousser un tag précis :

```bash
git push origin v1.0.0
```

---

## 14) Pousser tous les tags

```bash
git push origin --tags
```

À utiliser avec prudence si tu as beaucoup de tags locaux.

---

## 15) Supprimer un tag local

```bash
git tag -d v1.0.0
```

---

## 16) Supprimer un tag distant

```bash
git push origin --delete v1.0.0
```

---

## 17) Supprimer local + distant

### Local

```bash
git tag -d v1.0.0
```

### Distant

```bash
git push origin --delete v1.0.0
```

---

## 18) Récupérer les tags du remote

```bash
git fetch --tags
```

Ou :

```bash
git fetch --all --prune --tags
```

---

## 19) Basculer sur un tag

```bash
git checkout v1.0.0
```

Attention :
- tu arrives en `detached HEAD`
- tu n’es pas sur une branche de travail normale

---

## 20) Créer une branche à partir d’un tag

Si tu veux repartir d’une ancienne version :

```bash
git checkout -b fix/from-v1.0.0 v1.0.0
```

---

## 21) Utilisation typique dans un workflow

### Cas simple

- tu développes sur `dev`
- tu prépares une `release/1.0.0`
- tu merges dans `main`
- tu poses un tag `v1.0.0`

Exemple :

```bash
git checkout main
git pull origin main
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0
```

---

## 22) Exemple avec GitFlow

Flux typique :

```text
dev
  -> feature/*
  -> fix/*
  -> release/1.0.0
  -> main
  -> tag v1.0.0
```

Le tag est posé sur `main` après la livraison validée.

---

## 23) Tag sur hotfix

Après un correctif de production, on peut poser un nouveau tag :

```text
main
  -> hotfix/login-500
  -> merge dans main
  -> tag v1.0.1
```

Commande :

```bash
git checkout main
git pull origin main
git tag -a v1.0.1 -m "Hotfix 1.0.1"
git push origin v1.0.1
```

---

## 24) Bonnes pratiques

- utiliser des tags annotés
- tagger uniquement des commits propres et stables
- tagger sur `main` après validation
- garder une convention cohérente
- éviter les noms flous comme `test`, `final`, `ok`
- associer un tag à une vraie version
- ne pas déplacer un tag déjà publié sauf cas exceptionnel

---

## 25) Mauvaises pratiques

- tagger n’importe quel commit
- créer des tags non poussés sur le remote
- avoir plusieurs conventions différentes
- modifier une version déjà publiée sans changer le numéro
- utiliser les tags comme des branches

---

## 26) Exemple complet

### Voir l’historique

```bash
git log --oneline
```

### Créer le tag

```bash
git tag -a v1.2.0 -m "Release 1.2.0"
```

### Vérifier

```bash
git tag
git show v1.2.0
```

### Envoyer sur le remote

```bash
git push origin v1.2.0
```

---

## 27) Exemple de versions

```text
v1.0.0   première version stable
v1.0.1   correction mineure
v1.0.2   autre correction
v1.1.0   nouvelles fonctionnalités
v1.2.0   évolution compatible
v2.0.0   rupture majeure
```

---

## 28) Tags et CI/CD

Beaucoup de pipelines utilisent les tags pour :
- construire une image Docker versionnée
- publier une release
- déployer en recette ou prod
- générer des artefacts figés

Exemple d’idée :
- push sur `main` = build simple
- push sur `v1.2.0` = release officielle

---

## 29) Résumé ultra simple

- un tag = un repère figé sur un commit
- il sert à marquer une version
- il ne bouge pas comme une branche
- il est souvent posé sur `main`
- il est idéal pour les releases
- préférer `git tag -a`
- ne pas oublier `git push origin <tag>`

---

## 30) Commandes utiles

Voir les tags :

```bash
git tag
```

Créer un tag annoté :

```bash
git tag -a v1.0.0 -m "Release 1.0.0"
```

Pousser un tag :

```bash
git push origin v1.0.0
```

Pousser tous les tags :

```bash
git push origin --tags
```

Voir le détail :

```bash
git show v1.0.0
```

Supprimer localement :

```bash
git tag -d v1.0.0
```

Supprimer à distance :

```bash
git push origin --delete v1.0.0
```