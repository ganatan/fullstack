# Git — Remotes (toutes les commandes utiles)

## Lister / inspecter

### Lister les remotes
```bash
git remote
```

### Lister avec les URLs (fetch/push)
```bash
git remote -v
```

### Détails d’un remote (branches suivies, HEAD, URLs)
```bash
git remote show origin
```

### Obtenir l’URL d’un remote
```bash
git remote get-url origin
```

### Obtenir l’URL push d’un remote (si différente)
```bash
git remote get-url --push origin
```

---

## Ajouter / supprimer / renommer

### Ajouter un remote
```bash
git remote add origin git@github.com:USER/REPO.git
```

### Ajouter un remote avec un nom explicite
```bash
git remote add github git@github.com:USER/REPO.git
git remote add gitlab  git@gitlab.com:GROUP/REPO.git
```

### Renommer un remote
```bash
git remote rename origin github
```

### Supprimer un remote
```bash
git remote remove github
```

---

## Changer les URLs

### Changer l’URL (fetch + push)
```bash
git remote set-url origin git@github.com:USER/REPO.git
```

### Changer uniquement l’URL de push
```bash
git remote set-url --push origin git@github.com:USER/REPO.git
```

### Ajouter une 2e URL de push (push vers plusieurs remotes avec le même nom)
```bash
git remote set-url --add --push origin git@github.com:USER/REPO.git
git remote set-url --add --push origin git@gitlab.com:GROUP/REPO.git
```

### Supprimer une URL de push (si multiple)
```bash
git remote set-url --delete --push origin git@gitlab.com:GROUP/REPO.git
```

---

## Branches suivies par un remote

### Fixer les branches suivies (au lieu de tout suivre)
```bash
git remote set-branches origin main
```

### Ajouter une branche suivie
```bash
git remote set-branches --add origin develop
```

---

## HEAD du remote

### Définir le HEAD du remote (main/master) automatiquement
```bash
git remote set-head origin -a
```

### Définir le HEAD du remote sur une branche précise
```bash
git remote set-head origin main
```

---

## Nettoyage / synchronisation

### Récupérer toutes les refs d’un remote
```bash
git fetch origin
```

### Récupérer toutes les branches + tags, et supprimer les refs supprimées côté remote
```bash
git fetch --prune origin
```

### Mettre à jour tous les remotes
```bash
git remote update
```

### Mettre à jour tous les remotes + nettoyage
```bash
git remote update --prune
```

### Nettoyer un remote (supprimer les branches distantes locales qui n’existent plus)
```bash
git remote prune origin
```

---

## Pousser / tirer en ciblant un remote

### Push explicite
```bash
git push origin main
```

### Pull explicite
```bash
git pull origin main
```

### Pull avec rebase
```bash
git pull --rebase origin main
```

### Push d’un tag
```bash
git push origin v1.0.0
```

### Push de tous les tags
```bash
git push origin --tags
```

---

## Upstream (tracking) d’une branche locale

### Voir l’upstream
```bash
git branch -vv
```

### Définir l’upstream lors du 1er push
```bash
git push -u origin main
```

### Changer l’upstream d’une branche existante
```bash
git branch --set-upstream-to=origin/main main
```

---

## Config liée aux remotes

### Windows PowerShell (filtrer remote.*)
```powershell
git config --list | Select-String "remote\."
```

### Définir le remote par défaut pour push (sécurité)
```bash
git config remote.pushDefault origin
```

### Push vers le remote upstream uniquement
```bash
git config push.default upstream
```

---

## Comptages (PowerShell)

### Compter les remotes
```powershell
(git remote).Count
```

### Compter les branches distantes (tous remotes)
```powershell
(git branch -r --list | Where-Object { $_ -notmatch '->' }).Count
```

### Compter les branches distantes d’un remote (ex: gitlab)
```powershell
(git branch -r --list "gitlab/*" | Where-Object { $_ -notmatch '->' }).Count
```
