# Creation repo — GitLab

## Resume

```bash
git clone git@gitlab-user01:user01/test001.git
git config user.name "user01"
git config user.email "user01@gmail.com"
git config --global --list
git push origin main
```


## Create repository

Menu :
- En haut à gauche de GitLab → bouton **Accueil** ou **Home**
- **Project**
- **New project**
- **Create blank project**

- https://gitlab.com/dashboard/projects

Paramètres :
- Project name: test001
- Visibility: Public
- Cocher : Initialiser le dépôt avec un README

Project URL (namespace) :
- **Users** : repo sous ton compte (ex: `https://gitlab.com/user01/test001`)
- **Groups** : repo sous un groupe (ex: `https://gitlab.com/mon-groupe/test001`)
- Règle simple : solo/test → **Users** ; équipe/organisation/plusieurs repos → **Groups**

Paramètres compte:
- nom "user01"
- email  "user01@gmail.com"

---

```bash
git clone https://gitlab.com/user01/test001.git
```

```bash
git clone git@gitlab-user01:user01/test001.git
```

## 2) Créer le repo local + commit + push + en SSL

Dans ton dossier clone :


```bash
git config user.name "user01"
git config user.email "user01@gmail.com"
git config --global --list
```

```bash
cd existing_repo
git push origin main
```
