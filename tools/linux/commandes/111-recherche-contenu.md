# Recherche dans les fichiers

Commandes essentielles pour rechercher du texte dans les fichiers.

## Rechercher un texte

```bash
grep "Hello" fichier.txt
```

## Ignorer la casse

```bash
grep -i "hello" fichier.txt
```

## Afficher les numéros de ligne

```bash
grep -n "Hello" fichier.txt
```

## Recherche récursive

```bash
grep -r "Hello" .
grep -rn "Hello" .
```

## Exclure des lignes

```bash
grep -v "DEBUG" application.log
```

## Rechercher dans les processus

```bash
ps -ef | grep java
```

## Rechercher dans l'historique

```bash
history | grep mvn
```
