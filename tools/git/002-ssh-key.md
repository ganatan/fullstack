# 002-ssh-key.md — GitHub — 2 comptes (Windows) avec SSH (2 clés + config + remotes)

## Objectif

Utiliser 2 comptes GitHub sur la même machine via SSH :
- compte 1 : `user01` / `user01@gmail.com`
- compte 2 : `user02` / `user02@gmail.com`

---

## 1) Générer 2 clés SSH (une par compte)

PowerShell :

```powershell
ssh-keygen -t ed25519 -C "user01@gmail.com"
ssh-keygen -t ed25519 -C "user02@gmail.com"
```

Indiquer les noms de fichier :
user01
user02


Fichiers créés dans :
- `C:\Users\<toi>\`
Fichiers A deplacer dans :
- `C:\Users\<toi>\.ssh\`

---

## 2) Ajouter chaque clé publique dans le bon compte GitHub

Afficher les clés publiques :

```powershell
type $env:USERPROFILE\.ssh\user01.pub
type $env:USERPROFILE\.ssh\user02.pub
```

Sur GitHub (pour chaque compte) :
Settings → SSH and GPG keys → New SSH key → coller la clé `.pub`.

---

## 3) Créer le fichier SSH config

Fichier :
- `C:\Users\<toi>\.ssh\config`

Contenu :

```sshconfig
Host github-user01
  HostName github.com
  User git
  IdentityFile ~/.ssh/user01
  IdentitiesOnly yes

Host github-user02
  HostName github.com
  User git
  IdentityFile ~/.ssh/user02
  IdentitiesOnly yes
```

---

## 4) Tester chaque compte

PowerShell :

```powershell
ssh -T git@github-user01
ssh -T git@github-user02
```

---

## 5) Utiliser le bon compte par repo (remote SSH)

### Repo du compte `user01`

```bash
git remote add origin git@github-user01:user01/REPO.git
git remote -v
```

### Repo du compte `user02`

```bash
git remote add origin git@github-user02:user02/REPO.git
git remote -v
```

---

## 6) Définir l’identité Git par repo (recommandé)

Dans un repo du compte `user01` :

```bash
git config user.name "user01"
git config user.email "user01@gmail.com"
```

Dans un repo du compte `user02` :

```bash
git config user.name "user02"
git config user.email "user02@gmail.com"
```

Vérifier :

```bash
git config user.name
git config user.email
```

---

## 7) Si `Permission denied (publickey)`

Activer l’agent et ajouter les clés :

```powershell
Get-Service ssh-agent | Set-Service -StartupType Automatic
Start-Service ssh-agent
ssh-add $env:USERPROFILE\.ssh\id_ed25519_github_user01
ssh-add $env:USERPROFILE\.ssh\id_ed25519_github_user02
```

Re-tester :

```powershell
ssh -T git@github-user01
ssh -T git@github-user02
```
