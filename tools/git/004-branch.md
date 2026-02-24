# Commandes Branch (local + distant)

## Création / Renommage

| Action | Local | Distant (origin) |
|---|---|---|
| Créer une branche | `git switch -c feature-01` | `git push -u origin feature-01` |
| Renommer une branche | `git branch -M feature-02` | `git push -u origin feature-02` puis `git push origin --delete feature-01` |
| Supprimer une branche | `git branch -d feature-02` | `git push origin --delete feature-02` |
| Changer de branche | `git switch feature-01` | `git fetch origin` puis `git switch feature-01` |

---

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
