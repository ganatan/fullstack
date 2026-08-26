# Fichiers

Commandes essentielles pour créer, lire et supprimer des fichiers sous Linux.

## Créer un fichier

```bash
touch fichier.txt
```

## Afficher le contenu

```bash
cat fichier.txt
```

## Lire page par page

```bash
less fichier.txt
```

## Afficher le début et la fin

```bash
head -n 20 fichier.txt
tail -n 100 fichier.txt
```

## Suivre un fichier en temps réel

```bash
tail -f application.log
```

## Informations et suppression

```bash
file fichier.txt
stat fichier.txt
rm fichier.txt
rm -f fichier.txt
```
