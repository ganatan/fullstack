# Liste des 10 derniers commits en local

```bash
git log -20 --oneline --decorate
```

# Liste des 10 derniers commits sur un remote

```bash
git fetch gitlab
git log -10 --oneline --decorate gitlab/main
```

# Liste des commits

- Affichage en ligne

```bash
git log --oneline --graph --decorate --all
```

- Affichage en ligne avec heure minute

```bash
git log --pretty=format:"%h %ad %s" --date=format:"%Y-%m-%d %H:%M"  
```

# Supprimer le dernier commit et pas les modifications

```bash
git reset --soft HEAD~1
git log --oneline --graph --decorate --all    
```

# Renommer le dernier commit

```bash
git commit --amend -m "Nouveau message de commit"
```

# Compter les commits sur HEAD
```bash
git rev-list --count HEAD
```

# Compter les commits sur une branche precise
```bash
git rev-list --count main
```

# Compter les commits sur une branche precise sur le remote gitlab
```bash
git fetch gitlab
git rev-list --count gitlab/main
```


# Compter les commits sur une branche precise sur le remote github
```bash
git fetch github
git rev-list --count github/main
```
