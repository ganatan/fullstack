# ssh-github-gitlab.md

## SSH GitHub + GitLab — Résumé complet (Windows)

Username utilisé : `usernameexample`

---

## 1. Création des clés SSH

### Clé SSH pour GitHub

```bat
ssh-keygen -t ed25519 -C "usernameexample@github" -f %USERPROFILE%\.ssh\id_ed25519_github
```

Fichiers générés :
```
id_ed25519_github
id_ed25519_github.pub
```

---

### Clé SSH pour GitLab

```bat
ssh-keygen -t ed25519 -C "usernameexample@gitlab" -f %USERPROFILE%\.ssh\id_ed25519_gitlab
```

Fichiers générés :
```
id_ed25519_gitlab
id_ed25519_gitlab.pub
```

---

## 2. Ajout des clés publiques

### GitHub

```bat
type %USERPROFILE%\.ssh\id_ed25519_github.pub
```

Puis :
```
GitHub
→ Settings
→ SSH and GPG keys
→ New SSH key
```

---

### GitLab

```bat
type %USERPROFILE%\.ssh\id_ed25519_gitlab.pub
```

Puis :
```
GitLab
→ Avatar
→ Preferences
→ SSH Keys
→ Add new key
```

---

## 3. Création du fichier SSH config

Créer le fichier :

```
C:\Users\usernameexample\.ssh\config
```

Contenu exact :

```text
# GitHub
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_github
  IdentitiesOnly yes

# GitLab
Host gitlab.com
  HostName gitlab.com
  User git
  IdentityFile ~/.ssh/id_ed25519_gitlab
  IdentitiesOnly yes
```

---

## 4. Tests de connexion SSH

Ouvrir un nouveau terminal.

### Test GitHub

```bat
ssh -T git@github.com
```

Résultat attendu :
```
Hi usernameexample! You've successfully authenticated, but GitHub does not provide shell access.
```

---

### Test GitLab

```bat
ssh -T git@gitlab.com
```

Résultat attendu :
```
Welcome to GitLab, @usernameexample!
```

---

## 5. Test détaillé (optionnel)

```bat
ssh -vT git@github.com
ssh -vT git@gitlab.com
```

Chercher la ligne :
```
Offering public key: ...
```

---

## 6. Utilisation avec Git

### GitHub

```bat
git clone git@github.com:usernameexample/repo.git
```

### GitLab

```bat
git clone git@gitlab.com:usernameexample/repo.git
```

---

## Résumé final

```
2 services → 2 clés
~/.ssh/config → routage automatique
ssh -T → validation
SSH only → comportement prévisible
```
