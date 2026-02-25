# 002-creation-repo.md — GitLab — Création d’un repository

## Create repository

Menu :
- En haut à gauche de GitLab → bouton **Accueil**
- **Project**
- **New project**
- **Create blank project**

- https://gitlab.com/dashboard/projects

Paramètres :
- Project name: test-EXAMPLE01
- Visibility: Public
- Cocher : Initialiser le dépôt avec un README

---

```bash
git clone https://gitlab.com/user01/test001.git
```

## 2) Créer le repo local + commit + push + en SSL

Dans ton dossier clone :

```bash
cd existing_repo
git push origin main
```
