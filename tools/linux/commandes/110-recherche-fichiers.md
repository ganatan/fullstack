# Recherche de fichiers

Commandes essentielles pour rechercher des fichiers sous Linux.

## Rechercher par nom

```bash
find . -name "fichier.txt"
```

## Rechercher des fichiers Java

```bash
find . -name "*.java"
```

## Recherche insensible à la casse

```bash
find . -iname "*.java"
```

## Rechercher fichiers ou répertoires

```bash
find . -type f
find . -type d
```

## Rechercher des JAR

```bash
find . -name "*.jar"
```

## Localiser une commande

```bash
which java
command -v java
whereis java
```

## Recherche rapide indexée

```bash
locate fichier.txt
```
