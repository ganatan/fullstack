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

