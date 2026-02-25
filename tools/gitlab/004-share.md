# Donner accès à un repo `test001` à un 2ᵉ compte `user02`

## Contexte

- Compte propriétaire : `user01`
- Repo : `test001` (dans le namespace `user01`, donc URL du type `https://gitlab.com/user01/test001`)
- Compte collaborateur : `user02`
- Objectif : `user02` peut cloner, créer une branche, push, et ouvrir une MR sur `test001`.

---

## 1) Donner les droits à `user02` (côté GitLab UI)

Connecté en `user01` :

1. Ouvrir le projet `test001`
2. Menu gauche : **Project information → Members** (ou **Manage → Members** selon version)
3. **Invite members**
4. Chercher `user02` (username GitLab) et l’ajouter
5. Choisir un rôle :
   - **Developer** : push sur branches non protégées + création de MR (recommandé)
   - **Maintainer** : admin du projet (à éviter si tu veux rester maître)
6. Valider l’invitation

Côté `user02` :
- accepter l’invitation (notification / email)
- vérifier l’accès : le projet apparaît dans **Projects**.

---

## 2) Cas des branches protégées (si `main` est protégée)

Si `main` est protégée, `user02` ne pourra pas push directement dessus (ce qui est normal).

Connecté en `user01` :
1. **Settings → Repository → Protected branches**
2. Vérifier `main`
3. Laisser `main` protégée
4. Workflow recommandé :
   - `user02` pousse une branche
   - `user02` ouvre une Merge Request vers `main`
   - `user01` merge

Option (si tu veux autoriser `user02` à push sur `main`) :
- Dans la règle de protection, autoriser **Developers** à push sur `main`
- Recommandé uniquement pour des repos de test.

---

## 3) Travailler en HTTPS (SSL) avec `user02`

### 3.1 Cloner

Connecté en `user02` sur la machine :

```bash
git clone https://gitlab.com/user01/test001.git
cd test001
```

### 3.2 Authentification HTTPS

GitLab demande une authentification.
Sur GitLab, HTTPS utilise souvent un **Personal Access Token (PAT)** à la place du mot de passe.

Créer un token (côté `user02`) :
1. Avatar → **Edit profile**
2. **Access Tokens**
3. Créer un token avec scopes :
   - `read_repository` (cloner)
   - `write_repository` (push)
4. Copier le token (une seule fois)

Au premier `git push`, Git demandera :
- username : `user02`
- password : coller le PAT

---

## 4) Travailler en SSH (recommandé si tu as plusieurs comptes)

SSH évite les prompts de mot de passe/PAT et se gère proprement avec des clés.

### 4.1 Ajouter la clé SSH de `user02`

Sur la machine (pour `user02`) :

```bash
ssh-keygen -t ed25519 -C "user02@gmail.com"
```

Ajouter la clé publique dans GitLab (`user02`) :
1. Avatar → **Edit profile**
2. **SSH Keys**
3. Coller le contenu du fichier `.pub`

Tester :

```bash
ssh -T git@gitlab.com
```

### 4.2 Cloner en SSH

```bash
git clone git@gitlab.com:user01/test001.git
cd test001
```

---

## 5) Configurer `user.name` / `user.email` au niveau du repo

Pour éviter de committer avec l’identité du mauvais compte :

```bash
git config user.name "user02"
git config user.email "user02@gmail.com"
```

Vérifier :

```bash
git config --list --local
```

---

## 6) Workflow recommandé (branche + MR)

Dans le clone `user02` :

```bash
git checkout -b feature/ma-modif
git add .
git commit -m "ma modif"
git push -u origin feature/ma-modif
```

Ensuite dans GitLab :
- `user02` ouvre une **Merge Request** de `feature/ma-modif` vers `main`
- `user01` review + merge

---

## 7) Alternative : fork (si tu ne veux pas donner accès direct)

Si tu ne veux pas inviter `user02` comme membre :
- `user02` fork le projet
- `user02` travaille dans son fork
- `user02` ouvre une MR vers le repo original (si autorisé) ou tu récupères via remote

C’est plus lourd, mais utile pour un projet public ouvert.

---

## Checklist rapide

- `user01` a ajouté `user02` en **Developer** dans **Members**
- `user02` accepte l’invitation
- `user02` clone (HTTPS + PAT ou SSH)
- `user02` configure `user.name` / `user.email` en local
- `user02` pousse une branche + MR (main protégée)
