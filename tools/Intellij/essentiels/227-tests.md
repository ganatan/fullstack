# Tests

IntelliJ permet d'exécuter directement les tests depuis l'éditeur.
Il reconnaît notamment JUnit, TestNG et les frameworks de test intégrés aux builds.

## Exécuter un test

Cliquer sur l'icône verte à côté de :

```java
@Test
```

## Exécuter une classe

Cliquer sur l'icône à côté du nom de classe.

## Relancer

```text
Ctrl + F5
```

selon la configuration des raccourcis.

## Maven

```bash
mvn test
```

## Résultats

La fenêtre de test affiche :

```text
passed
failed
ignored
duration
stack trace
```
