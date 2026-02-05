# Creation repo sur github

  Profile /Repositories / New

  Commande à executer
    echo "# nx-angular-node-electron" >> README.md
    git init
    git add README.md
    git commit -m "first commit"
    git branch -M main
    git remote add origin https://github.com/ganatan/nx-angular-node-electron.git
  
  Copier le fichier de Config    

  Push executer
    git push -u github main

  
  - Vérifier les remotes
    git remote -v
  - Vérifier les branches locales
    git branch
  - Vérifier les branches distantes
    git branch -r
  - Vérifier le lien local ↔ remote (tracking)
    git branch -vv
  - Vérifier la configuration précise d’une branche
    git config --get branch.main.remote
    git config --get branch.main.merge
  - Vérifier toute la config Git
    git config --list --local
      On check
        remote.github.url=git@github.com:ganatan/nx-angular-node-electron.git
        branch.main.remote=github
        branch.main.merge=refs/heads/main
  - Vérifier si tu peux push vers le bon remote
    git push --dry-run github main        



# Creation d'un repo
  git init -b main
  echo "# mon-repo" > README.md
  git add README.md
  git commit -m "init Repo"
  git branch --show-current

# Renommer une branche
  git branch -M main
  
# Selection d'une branche
  git checkout feature-001  

# Creation d'une branche
  git checkout -b feature-001  

# Suppression d'une branche
  git branch -d feature-001  

# Liste des branches
  - Branches locales
  git branch -a
  
  - Branches distantes
  git branch -r     # affiche les branches distantes

# Liste des remote
  git remote -v

# Liste des commits
  
  - Affichage en ligne
    git log --oneline --graph --decorate --all

  - Affichage en ligne avec heure minute
    git log --pretty=format:"%h %ad %s" --date=format:"%Y-%m-%d %H:%M"  

# Supprimer le dernier commit et pas les modifications
  git reset --soft HEAD~1
  git log --oneline --graph --decorate --all    

# Renommer le dernier commit
  
  git commit --amend -m "Nouveau message de commit"

# Ajouter un remote
  - Creer 
    remote_name         nom du remote
    user_name           nom de l'utilisateur
    repo_name           nom du repo
  
    git remote add remote_name https://gitlab.com/user_name/repo_name.git

  Example    
    git remote add gitlab https://gitlab.com/ganatan/repo001.git

# Renommer un remote
  - Renommer origin en github
    git remote rename origin github
    git remote rename origin gitlab

# Infos sur le remote
  git remote show github
  git remote show gitlab


# Push
  git fetch github main
  git pull github main

# Effacer historiques des repo local
  git remote remove github
  git remote remove gitlab

# Changer nom du dernier commit
  git commit --amend -m "Nouveau message du commit"  
  