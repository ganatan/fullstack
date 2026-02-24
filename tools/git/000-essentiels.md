## 1) Résumé

```bash
git branch -a
git remote -v
git checkout -b feature/x
git push -u origin main
git push -u origin feature/x
git log -20 --oneline --decorate
git fetch gitlab
git log -10 --oneline --decorate gitlab/main
```

Verifier la synchronisation entre deux remotes
```bash
git fetch --all --prune
git log -5 --oneline --decorate github/main
git log -5 --oneline --decorate gitlab/main
```

---

## 1) Générer une clé (ed25519)

PowerShell :

```powershell
ssh-keygen -t ed25519 -C "ton@email"
```

## 2) Copier la clé publique

```powershell
type $env:USERPROFILE\.ssh\id_ed25519.pub
```

Copier la ligne complète `ssh-ed25519 ...`.

---

## 3) Ajouter la clé dans GitHub

GitHub → Settings → SSH and GPG keys → New SSH key  
Coller la clé publique → Add SSH key.

---


## 3) Config minimale (obligatoire)

```bash
git config --global user.name "Ton Nom"
git config --global user.email "ton@email"
git config --global init.defaultBranch main
```

Vérifier :

```bash
git config --global --list
```

---

