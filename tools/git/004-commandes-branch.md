# Commandes Branch (local + distant)

## Local

### Créer une branche
```bash
git switch -c feature-01
git checkout -b feature-01
```

### Renommer une branche (branche courante)
```bash
git branch -M feature-02
```

### Renommer une branche (depuis une autre branche)
```bash
git branch -m feature-01 feature-02
```

### Supprimer une branche
```bash
git branch -d feature-02
git branch -D feature-02
```

### Changer de branche
```bash
git switch feature-01
git checkout feature-01
```

### Voir les branches
```bash
git branch
git branch -a
```

---

## Distant (origin)

### Publier une branche (suivi upstream)
```bash
git push -u origin feature-01
```

### Renommer une branche (distant)
```bash
git push -u origin feature-02
git push origin --delete feature-01
```

### Supprimer une branche (distant)
```bash
git push origin --delete feature-02
```

### Récupérer les refs
```bash
git fetch origin
git fetch --all --prune
```

### Créer une branche locale depuis origin
```bash
git switch -c feature-01 --track origin/feature-01
git checkout -b feature-01 origin/feature-01
```

### Mettre à jour une branche locale
```bash
git pull
git pull --rebase
```

---

## Utilisation / Gestion

### Lister branches locales
```bash
git branch
```

### Lister branches distantes
```bash
git branch -r
```

### Lister toutes les branches
```bash
git branch -a
```

### Voir la branche trackée
```bash
git branch -vv
```

### Publier la branche courante
```bash
git push -u origin HEAD
```

### Récupérer les branches distantes
```bash
git fetch --all --prune
```

### Créer localement depuis une branche distante
```bash
git switch -c feature-01 --track origin/feature-01
```

---

## git fetch — combinaisons utiles

### Récupérer les refs d’un remote
```bash
git fetch origin
```
Effet : met à jour `origin/*`, ne modifie pas la branche courante.

### Récupérer toutes les refs
```bash
git fetch --all
```
Effet : fetch de tous les remotes.

### Nettoyer les branches distantes supprimées
```bash
git fetch --prune
```
Effet : supprime les refs `origin/*` inexistantes côté remote.

### Tout récupérer + nettoyer
```bash
git fetch --all --prune
```
Effet : le plus utile en routine.

### Fetch d’une branche précise
```bash
git fetch origin feature-01
```
Effet : met à jour `origin/feature-01` uniquement.

### Fetch d’un tag précis
```bash
git fetch origin tag v1.2.0
```
Effet : récupère le tag demandé.

### Fetch de tous les tags
```bash
git fetch --tags
```
Effet : télécharge les tags manquants.

### Forcer la mise à jour d’une ref locale (dangereux)
```bash
git fetch origin main:main
```
Effet : écrase ta branche locale `main` avec `origin/main`.

### Fetch en profondeur limitée (shallow)
```bash
git fetch --depth 1 origin
```
Effet : récupère un historique tronqué.

### Compléter un shallow clone
```bash
git fetch --unshallow
```
Effet : récupère l’historique complet.

### Voir ce qui va être fetch (dry-run)
```bash
git fetch --dry-run origin
```
Effet : liste les mises à jour sans les appliquer.

### Afficher détails (verbose)
```bash
git fetch -v origin
```
Effet : log détaillé du fetch.

### Mettre à jour une branche de tracking
```bash
git fetch origin
git branch -vv
```
Effet : vérifie la branche suivie et l’écart.

---

## git pull — combinaisons utiles

### Pull simple (merge) sur la branche courante
```bash
git pull
```
Effet : `fetch` + `merge` de l’upstream.

### Pull sur un remote précis
```bash
git pull origin
```
Effet : `fetch` + `merge` depuis `origin`.

### Pull d’une branche précise (merge)
```bash
git pull origin feature-01
```
Effet : merge de `origin/feature-01` dans ta branche courante.

### Pull avec rebase
```bash
git pull --rebase
```
Effet : `fetch` + `rebase` sur l’upstream.

### Pull d’une branche précise avec rebase
```bash
git pull --rebase origin feature-01
```
Effet : rebase de ta branche courante sur `origin/feature-01`.

### Pull avec autostash
```bash
git pull --rebase --autostash
```
Effet : stash auto, rebase, unstash.

### Pull avec fast-forward only
```bash
git pull --ff-only
```
Effet : échoue si merge non fast-forward requis.

### Pull avec merge explicite (pas rebase)
```bash
git pull --no-rebase
```
Effet : force le merge même si config rebase.

### Pull sans commit automatique (merge)
```bash
git pull --no-commit
```
Effet : prépare le merge, laisse le commit à faire.

### Pull + squash (merge squash)
```bash
git pull --squash
```
Effet : fusionne en squash, pas de merge commit auto.

### Pull en vérifiant les signatures (si activé)
```bash
git pull --verify-signatures
```
Effet : vérifie signatures des commits si applicable.

### Pull verbeux
```bash
git pull -v
```
Effet : log détaillé.

### Notes rapides

- `git pull` = `git fetch` + intégration (merge ou rebase).
- `git pull origin feature-01` modifie **ta branche courante** : ce n’est pas “mettre à jour feature-01”, c’est “fusionner feature-01 dans la branche actuelle”.

---

## Cas pratique — Feature

```bash
git switch -c feature-01
git add -A
git commit -m "feat: x"
git push -u origin feature-01
```

---

## Cas pratique — Supprimer partout

```bash
git switch main
git branch -d feature-01
git push origin --delete feature-01
git fetch --prune
```

## Compter les branches en local

```bash
(git branch --list).Count
```

## Compter les branches en remote

```bash
(git branch -r --list).Count
```

## Compter les branches en remote sur gitlab

```bash
(git branch -r --list "gitlab/*" | Where-Object { $_ -notmatch '->' }).Count
```