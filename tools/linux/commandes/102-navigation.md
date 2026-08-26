# Navigation

Commandes essentielles pour se déplacer dans l'arborescence Linux.

## Répertoire courant

```bash
pwd
```

Affiche le chemin complet du répertoire courant.

## Lister le contenu

```bash
ls
ls -la
ls -lh
```

- `ls` : liste simple
- `ls -la` : détails et fichiers cachés
- `ls -lh` : tailles lisibles

## Changer de répertoire

```bash
cd dossier
cd ..
cd ../..
cd ~
cd -
```

- `cd dossier` : entrer dans un dossier
- `cd ..` : remonter d'un niveau
- `cd ../..` : remonter de deux niveaux
- `cd ~` : revenir au répertoire personnel
- `cd -` : revenir au répertoire précédent

## Chemins absolus et relatifs

```bash
cd /home/user/projects
cd ./projects
cd ../projects
```

- `/` : chemin absolu
- `./` : répertoire courant
- `../` : répertoire parent