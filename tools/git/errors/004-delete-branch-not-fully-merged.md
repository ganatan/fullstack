# 002-delete-branch.md — Git — `git branch -d` refuse de supprimer une branche

Message :
> error: the branch 'dev' is not fully merged  
> hint: If you are sure you want to delete it, run 'git branch -D dev'

## Signification

- `git branch -d dev` supprime une branche **uniquement si** Git considère qu’elle est **déjà intégrée** (merge) dans ta branche courante (ou dans `HEAD`).
- Ici, la branche `dev` contient des commits **non mergés** ailleurs.
- Git bloque pour éviter une perte de commits.

---

## Vérifier ce qui n’est pas mergé

### Voir les commits présents dans `dev` et absents de `main`

```bash
git fetch --all --prune
git log --oneline --left-right main...dev
```

### Voir quelles branches sont mergées / non mergées

```bash
git branch --merged
git branch --no-merged
```

---

## Solutions (choisir 1)

### A) Tu veux conserver le contenu de `dev` → merge puis supprimer

```bash
git switch main
git merge dev
git branch -d dev
```

### B) Tu veux conserver le contenu de `dev` mais en historique linéaire → rebase puis merge

```bash
git switch dev
git rebase main
git switch main
git merge --ff-only dev
git branch -d dev
```

### C) Tu ne veux pas conserver `dev` (perte acceptée) → suppression forcée

```bash
git branch -D dev
```

---

## Remarque

Le hint :
```bash
git config set advice.forceDeleteBranch false
```
désactive juste le message d’aide.  
Ça ne résout pas le problème de fond (branche non mergée).
