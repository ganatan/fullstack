# 007-commits.md — Git — Commits : listing + modification + suppression (local / distant)

## Liste des commits

### 20 derniers commits (local)

```bash
git log -20 --oneline --decorate
```

### 10 derniers commits sur un remote

```bash
git fetch gitlab
git log -10 --oneline --decorate gitlab/main
```

### Affichage graphique (toutes branches)

```bash
git log --oneline --graph --decorate --all
```

### Affichage avec date/heure

```bash
git log --pretty=format:"%h %ad %s" --date=format:"%Y-%m-%d %H:%M"
```

---

## Modifier le dernier commit

### Renommer le message

```bash
git commit --amend -m "Nouveau message de commit"
```

### Ajouter des fichiers oubliés au dernier commit

```bash
git add .
git commit --amend --no-edit
```

---

## Supprimer des commits en local (avant push)

### Supprimer le dernier commit, garder les modifications (staging)

```bash
git reset --soft HEAD~1
```

### Supprimer le dernier commit, garder les modifications (non staged)

```bash
git reset --mixed HEAD~1
```

### Supprimer le dernier commit + supprimer les modifications (dangereux)

```bash
git reset --hard HEAD~1
```

### Supprimer N commits d’un coup (ex : 3)

Garder les modifications (staging) :
```bash
git reset --soft HEAD~3
```

Garder les modifications (non staged) :
```bash
git reset --mixed HEAD~3
```

Tout jeter :
```bash
git reset --hard HEAD~3
```

---

## Supprimer / réécrire des commits au milieu (local)

### Rebase interactif (ex : les 10 derniers commits)

```bash
git rebase -i HEAD~10
```

Actions possibles dans l’éditeur :
- `drop` : supprimer un commit
- `reword` : changer le message
- `squash` : fusionner avec le commit précédent
- `fixup` : fusionner sans garder le message

---

## Annuler un commit sans réécrire l’historique (safe)

### Annuler le dernier commit en créant un nouveau commit "inverse"

```bash
git revert HEAD
```

### Annuler un commit précis (safe)

```bash
git revert <sha>
```

---

## Distant : supprimer des commits (si déjà push)

Deux approches :

### A) Revert (recommandé)

```bash
git revert <sha>
git push origin main
```

### B) Reset + force push (dangereux)

Revenir en arrière de 1 commit :
```bash
git reset --hard HEAD~1
git push --force-with-lease origin main
```

Revenir en arrière de N commits (ex : 3) :
```bash
git reset --hard HEAD~3
git push --force-with-lease origin main
```

Revenir à un commit précis :
```bash
git reset --hard <sha>
git push --force-with-lease origin main
```

---

## Supprimer tous les commits d’une branche (réinitialiser l’historique)

Recréer une branche vide (orphan) :
```bash
git checkout --orphan new-main
git rm -rf .
git commit --allow-empty -m "Initial commit"
git branch -M main
git push --force-with-lease origin main
```

---

## Compter les commits

Sur HEAD :
```bash
git rev-list --count HEAD
```

Sur une branche locale :
```bash
git rev-list --count main
```

Sur une branche distante :
```bash
git fetch gitlab
git rev-list --count gitlab/main
```

---

## Vérifications utiles avant de réécrire

Voir où pointe le remote :
```bash
git fetch origin
git log -5 --oneline origin/main
```

Forcer sans écraser le travail des autres :
```bash
git push --force-with-lease origin main
```
