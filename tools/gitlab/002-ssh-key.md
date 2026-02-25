# GitLab — 2 comptes avec SSH (2 clés + config + remotes)

## Résumé

```bash
ssh-keygen -t ed25519 -C "user01@gmail.com"

Preferences → SSH Keys → Add new key → coller la clé `.pub`.

Host gitlab-user01
  HostName gitlab.com
  User git
  IdentityFile ~/.ssh/user01
  IdentitiesOnly yes

ssh -T git@gitlab-user01
```

## Résumé
```powershell
ssh-keygen -t ed25519 -C "user01@gmail.com"
```

```sshconfig
Host gitlab-user01
  HostName gitlab.com
  User git
  IdentityFile ~/.ssh/user01
  IdentitiesOnly yes
```

```powershell
ssh -T git@gitlab-user01
ssh -T git@gitlab-user02
```

```bash
git remote rename origin gitlab
git remote add gitlab git@gitlab-user01:user01/REPO.git
git remote -v
```

```bash
git config user.name "user01"
git config user.email "user01@gmail.com"
git config --global --list
```



## Objectif

Utiliser 2 comptes GitLab sur la même machine via SSH :
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

Fichiers à déplacer dans :
- `C:\Users\<toi>\.ssh\`

---

## 2) Ajouter chaque clé publique dans le bon compte GitLab

Afficher les clés publiques :

```powershell
type $env:USERPROFILE\.ssh\user01.pub
type $env:USERPROFILE\.ssh\user02.pub
```

Sur GitLab (pour chaque compte) :
Preferences → SSH Keys → Add new key → coller la clé `.pub`.

---

## 3) Créer le fichier SSH config

Fichier :
- `C:\Users\<toi>\.ssh\config`

Contenu :

```sshconfig
Host gitlab-user01
  HostName gitlab.com
  User git
  IdentityFile ~/.ssh/user01
  IdentitiesOnly yes

Host gitlab-user02
  HostName gitlab.com
  User git
  IdentityFile ~/.ssh/user02
  IdentitiesOnly yes
```

---

## 4) Tester chaque compte

PowerShell :

```powershell
ssh -T git@gitlab-user01
ssh -T git@gitlab-user02
```

---

## 5) Utiliser le bon compte par repo (remote SSH)

### Repo du compte `user01`

```bash
git remote rename origin gitlab
git remote add gitlab git@gitlab-user01:user01/REPO.git
git remote -v
```

### Repo du compte `user02`

```bash
git remote rename origin gitlab
git remote add gitlab git@gitlab-user02:user02/REPO.git
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
ssh-add $env:USERPROFILE\.ssh\user01
ssh-add $env:USERPROFILE\.ssh\user02
```

Re-tester :

```powershell
ssh -T git@gitlab-user01
ssh -T git@gitlab-user02
```
