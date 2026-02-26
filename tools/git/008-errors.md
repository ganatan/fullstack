## Error de synchronisation entre Deux repo github et gitlab
    ! [rejected]        main -> main (fetch first)
    error: failed to push some refs to 'gitlab-ganatan:ganatan/fullstack.git'
    hint: Updates were rejected because the remote contains work that you do not
    hint: have locally. This is usually caused by another repository pushing to
    hint: the same ref. If you want to integrate the remote changes, use
    hint: 'git pull' before pushing again.
    hint: See the 'Note about fast-forwards' in 'git push --help' for details.

# Solution
```bash
git fetch --all --prune
git push --force-with-lease gitlab github/main:main
```    

## Error protected branch
Enter passphrase for key '/c/Users/chend/.ssh/ganatangitlab': 
Enumerating objects: 3117, done.
Counting objects: 100% (3117/3117), done.
Delta compression using up to 12 threads
Compressing objects: 100% (1436/1436), done.
Writing objects: 100% (3117/3117), 540.34 KiB | 2.92 MiB/s, done.
Total 3117 (delta 1770), reused 2885 (delta 1572), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (1770/1770), done.
remote: GitLab: You are not allowed to force push code to a protected branch on this project.
To gitlab-ganatan:ganatan/fullstack.git
 ! [remote rejected] github/main -> main (pre-receive hook declined)
error: failed to push some refs to 'gitlab-ganatan:ganatan/fullstack.git'

# Solution

GitLab → ton projet → **Settings** → **Repository** → **Branch rules** (ou **Protected branches**)

Sur la règle de `main` :
- **Allowed to push and merge** = `Maintainers`
- **Allow force push** = `ON`

Ensuite :
```powershell
git fetch --all --prune
git push --force-with-lease gitlab github/main:main
```



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
