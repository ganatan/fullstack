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
