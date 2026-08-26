# Evaluate Expression

Evaluate Expression permet d'exécuter une expression pendant une session de debug.
C'est utile pour tester rapidement une méthode ou inspecter une valeur calculée.

## Accès

Pendant un breakpoint :

```text
Alt + F8
```

## Exemple

```java
person.firstName()
```

ou :

```java
persons.size()
```

## Expression plus complexe

```java
persons
    .stream()
    .filter(
        person ->
            person.cityId() == 1
    )
    .toList()
```

L'expression est exécutée dans le contexte courant du debugger.
