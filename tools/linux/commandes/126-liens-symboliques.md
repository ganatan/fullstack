# Liens symboliques

Commandes essentielles pour gérer les liens sous Linux.

## Créer un lien symbolique

```bash
ln -s fichier.txt lien.txt
```

## Lien vers un répertoire

```bash
ln -s /opt/application ~/application
```

## Afficher les liens

```bash
ls -l
```

## Voir la cible

```bash
readlink lien.txt
```

## Voir le chemin réel

```bash
readlink -f lien.txt
```

## Supprimer un lien

```bash
rm lien.txt
```

## Créer un lien physique

```bash
ln fichier.txt lien.txt
```
