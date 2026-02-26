# Commandes Branch (local + distant)

## Local

| Action | Commandes (local) |
|---|---|
| Créer une branche | `git switch -c feature-01`<br>`git checkout -b feature-01` |
| Renommer une branche (branche courante) | `git branch -M feature-02` |
| Renommer une branche (depuis une autre branche) | `git branch -m feature-01 feature-02` |
| Supprimer une branche | `git branch -d feature-02`<br>`git branch -D feature-02` |
| Changer de branche | `git switch feature-01`<br>`git checkout feature-01` |
| Voir les branches | `git branch`<br>`git branch -a` |

---

## Distant (origin)

| Action | Commandes (distant) |
|---|---|
| Publier une branche (suivi upstream) | `git push -u origin feature-01` |
| Renommer une branche (distant) | `git push -u origin feature-02`<br>`git push origin --delete feature-01` |
| Supprimer une branche (distant) | `git push origin --delete feature-02` |
| Récupérer les refs | `git fetch origin`<br>`git fetch --all --prune` |
| Créer une branche locale depuis origin | `git switch -c feature-01 --track origin/feature-01`<br>`git checkout -b feature-01 origin/feature-01` |
| Mettre à jour une branche locale | `git pull`<br>`git pull --rebase` |

## Utilisation / Gestion

| Action | Commande |
|---|---|
| Lister branches locales | `git branch` |
| Lister branches distantes | `git branch -r` |
| Lister toutes les branches | `git branch -a` |
| Voir la branche trackée | `git branch -vv` |
| Publier la branche courante | `git push -u origin HEAD` |
| Récupérer les branches distantes | `git fetch --all --prune` |
| Créer localement depuis une branche distante | `git switch -c feature-01 --track origin/feature-01` |

---

## git fetch — combinaisons utiles

| Objectif | Commande | Effet |
|---|---|---|
| Récupérer les refs d’un remote | `git fetch origin` | Met à jour `origin/*`, ne modifie pas la branche courante |
| Récupérer toutes les refs | `git fetch --all` | Fetch de tous les remotes |
| Nettoyer les branches distantes supprimées | `git fetch --prune` | Supprime les refs `origin/*` inexistantes côté remote |
| Tout récupérer + nettoyer | `git fetch --all --prune` | Le plus utile en routine |
| Fetch d’une branche précise | `git fetch origin feature-01` | Met à jour `origin/feature-01` uniquement |
| Fetch d’un tag précis | `git fetch origin tag v1.2.0` | Récupère le tag demandé |
| Fetch de tous les tags | `git fetch --tags` | Télécharge les tags manquants |
| Forcer la mise à jour d’une ref locale (dangereux) | `git fetch origin main:main` | Écrase ta branche locale `main` avec `origin/main` |
| Fetch en profondeur limitée (shallow) | `git fetch --depth 1 origin` | Récupère un historique tronqué |
| Compléter un shallow clone | `git fetch --unshallow` | Récupère l’historique complet |
| Voir ce qui va être fetch (dry-run) | `git fetch --dry-run origin` | Liste les mises à jour sans les appliquer |
| Afficher détails (verbose) | `git fetch -v origin` | Log détaillé du fetch |
| Mettre à jour une branche de tracking | `git fetch origin` + `git branch -vv` | Vérifie la branche suivie et l’écart |

---

## git pull — combinaisons utiles

| Objectif | Commande | Effet |
|---|---|---|
| Pull simple (merge) sur la branche courante | `git pull` | `fetch` + `merge` de l’upstream |
| Pull sur un remote précis | `git pull origin` | `fetch` + `merge` depuis `origin` |
| Pull d’une branche précise (merge) | `git pull origin feature-01` | Merge de `origin/feature-01` dans ta branche courante |
| Pull avec rebase | `git pull --rebase` | `fetch` + `rebase` sur l’upstream |
| Pull d’une branche précise avec rebase | `git pull --rebase origin feature-01` | Rebase de ta branche courante sur `origin/feature-01` |
| Pull avec autostash | `git pull --rebase --autostash` | Stash auto, rebase, unstash |
| Pull avec fast-forward only | `git pull --ff-only` | Échoue si merge non fast-forward requis |
| Pull avec merge explicite (pas rebase) | `git pull --no-rebase` | Force le merge même si config rebase |
| Pull sans commit automatique (merge) | `git pull --no-commit` | Prépare le merge, laisse le commit à faire |
| Pull + squash (merge squash) | `git pull --squash` | Fusionne en squash (pas de merge commit auto) |
| Pull en vérifiant les signatures (si activé) | `git pull --verify-signatures` | Vérifie signatures des commits (si applicable) |
| Pull verbeux | `git pull -v` | Log détaillé |

### Notes rapides
- `git pull` = `git fetch` + intégration (merge ou rebase).
- `git pull origin feature-01` modifie **ta branche courante** : ce n’est pas “mettre à jour feature-01”, c’est “fusionner feature-01 dans la branche actuelle”.


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

