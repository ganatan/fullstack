# Maven

IntelliJ intègre Maven pour importer, compiler, tester et exécuter les goals.
Le `pom.xml` reste la source de vérité du projet Maven.

## Fenêtre Maven

```text
View
→ Tool Windows
→ Maven
```

## Recharger le projet

```text
Reload All Maven Projects
```

## Goals utiles

```text
clean
compile
test
package
install
```

## Terminal

```bash
mvn clean install
```

## Dépendances

```bash
mvn dependency:tree
```

En cas de modification du `pom.xml`, recharger Maven dans IntelliJ.
