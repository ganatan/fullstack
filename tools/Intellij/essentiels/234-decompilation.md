# Decompilation

IntelliJ peut afficher une représentation Java d'une classe compilée `.class`.
Cela permet d'inspecter une bibliothèque même lorsque les sources ne sont pas disponibles.

## Ouvrir une classe externe

```text
Ctrl + N
```

Rechercher par exemple :

```text
String
ArrayList
```

Si les sources sont absentes, IntelliJ affiche une version décompilée.

## Utilité

```text
comprendre une implémentation
voir les signatures
inspecter un ancien JAR
diagnostiquer une dépendance
```

## Limite

Le code décompilé n'est pas forcément identique au code source original.
