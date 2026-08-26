# Mémoire IDE

IntelliJ utilise une JVM et possède donc sa propre mémoire heap.
Les gros projets peuvent nécessiter davantage de mémoire pour l'indexation et l'analyse.

## Afficher l'indicateur mémoire

```text
Settings
→ Appearance
→ Show memory indicator
```

selon la version.

## Modifier la mémoire

```text
Help
→ Change Memory Settings
```

## Exemple

```text
2048 MB
4096 MB
```

## Symptômes

```text
IDE lent
indexation très longue
OutOfMemoryError
freeze fréquent
```

Augmenter la mémoire uniquement si le diagnostic montre qu'elle est insuffisante.
