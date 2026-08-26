# Caches et index

IntelliJ indexe les sources pour fournir recherche, navigation et complétion rapides.
Un index corrompu peut provoquer des erreurs de résolution ou des comportements incohérents.

## Symptômes

```text
Cannot resolve symbol incorrect
navigation cassée
imports non reconnus
IDE incohérent
```

## Première action

Recharger Maven ou Gradle.

## Ensuite

```text
File
→ Invalidate Caches
```

Puis redémarrer l'IDE si nécessaire.

## Important

Invalidate Caches ne doit pas être le premier réflexe pour chaque erreur.

Vérifier d'abord :

```text
build
JDK
dépendances
synchronisation
```
