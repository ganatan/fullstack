# Sources et dépendances

IntelliJ peut afficher le code source des dépendances externes lorsque les sources sont disponibles.
C'est très utile pour comprendre une API ou un comportement de framework.

## Aller à une classe

```text
Ctrl + N
```

Puis saisir une classe externe :

```text
ArrayList
JpaRepository
KafkaTemplate
```

## Maven Sources

IntelliJ peut télécharger :

```text
sources
documentation
```

## Navigation

```text
Ctrl + B
```

sur une méthode externe.

## Maven

```bash
mvn dependency:sources
```

Lire les sources d'une bibliothèque est souvent plus précis qu'une simple recherche web.
