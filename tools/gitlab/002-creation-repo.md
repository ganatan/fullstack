## Create repository

Menu:
- En haut à gauche de GitLab → bouton **Accueil**
- **Project**
- **New project**
- **Create blank project**

- https://gitlab.com/dashboard/projects

Paramètres :
- Project name: test-EXAMPLE01
- Visibility: Public
- Décocher : Initialiser le dépôt avec un README

---


## 2) Créer le repo local + commit + push + en SSL

Dans ton dossier projet :

```bash
cd existing_repo
git remote add origin https://gitlab.com/user01/test001.git
git branch -M main
git push -uf origin main
```
