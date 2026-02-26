
## Error suppression de branch en local
Your branch is based on 'origin/dev', but the upstream is gone.
  (use "git branch --unset-upstream" to fixup)
PS D:\demo\rosynady\frontend-admin> git status
On branch dev
Your branch is based on 'origin/dev', but the upstream is gone.
  (use "git branch --unset-upstream" to fixup)

nothing to commit, working tree clean

# Upstream gone (`origin/dev` supprimée)

Message :
> Your branch is based on 'origin/dev', but the upstream is gone.

## Signification

- Tu es sur la branche locale `dev`
- Elle est configurée pour suivre `origin/dev` (upstream)
- Mais sur le remote `origin`, la branche `dev` n’existe plus (supprimée ou renommée)
- Donc `git pull` / `git push` sans préciser la cible peut poser problème

---

## Diagnostic rapide

```bash
git fetch --all --prune
git branch -vv
git branch -r
```

- Si `origin/dev` apparaît dans `git branch -r` : c’était juste un fetch pas à jour
- Si `origin/dev` n’apparaît pas : la branche distante est bien supprimée

---

## Solutions (choisir 1)

### A) Faire suivre `dev` à `origin/main` (cas courant)

```bash
git fetch --all --prune
git branch --set-upstream-to=origin/main dev
```

### B) Recréer la branche distante `origin/dev`

```bash
git push -u origin dev
```

### C) Enlever l’upstream (branche locale “solo”)

```bash
git branch --unset-upstream
```
