# Arguments JVM

Les VM options permettent de modifier le comportement de la JVM au lancement.
Elles sont configurées dans la Run Configuration IntelliJ.

## Accès

```text
Run
→ Edit Configurations
→ VM options
```

## Exemple mémoire

```text
-Xms256m
-Xmx1024m
```

## Propriété système

```text
-Dspring.profiles.active=dev
```

## Java

```java
String profile =
    System.getProperty(
        "spring.profiles.active"
    );
```

## Diagnostic GC

```text
-Xlog:gc
```

Les VM options sont différentes des Program arguments.
