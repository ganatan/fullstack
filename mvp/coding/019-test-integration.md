# Résumé — Tests IT avec Spring Boot et Maven

## Idée générale

Dans un projet Spring Boot avec Maven, les **tests d’intégration** ne sont pas lancés par hasard.

Ils sont lancés par :

- le **`pom.xml`**
- les **plugins Maven**
- la **phase Maven** exécutée (`test`, `verify`, `install`, etc.)
- le **nom des classes de test**

---

## Où sont les tests IT

Les tests IT sont souvent dans :

```text
src/test/java
```

Il n’y a pas forcément un dossier spécial.

Exemples :

```text
src/test/java/com/exemple/ihml/bff/ContextControllerIT.java
src/test/java/com/exemple/ihml/bff/it/ContextControllerIT.java
```

Le suffixe `IT` est souvent ce qui permet de les distinguer.

---

## Différence entre tests unitaires et tests IT

### Tests unitaires
Classes souvent nommées :

```text
*Test.java
```

Exemples :

```text
UserServiceTest.java
ContextControllerTest.java
```

### Tests d’intégration
Classes souvent nommées :

```text
*IT.java
*ITCase.java
```

Exemples :

```text
ContextControllerIT.java
UserApiIT.java
```

---

## Plugins Maven concernés

### 1. Surefire
Le plugin standard pour les tests unitaires :

```xml
<artifactId>maven-surefire-plugin</artifactId>
```

Il est utilisé principalement avec :

```text
mvn test
```

### 2. Failsafe
Le plugin standard pour les tests d’intégration :

```xml
<artifactId>maven-failsafe-plugin</artifactId>
```

Il est souvent branché sur :

- `integration-test`
- `verify`

---

## Cycle Maven simplifié

```text
validate
compile
test
package
verify
install
```

### Ce que ça signifie

- `mvn compile` : compile le code principal
- `mvn test` : lance surtout les tests unitaires
- `mvn package` : construit le jar/war
- `mvn verify` : lance les vérifications finales, souvent les IT
- `mvn install` : fait tout jusqu’à `install`

---

## Pourquoi `test` passe mais `verify` échoue

C’est le cas classique.

### Explication
`mvn test` peut passer car seuls les tests unitaires tournent.

`mvn verify` peut échouer car il lance en plus :

- les tests IT
- JaCoCo
- Checkstyle
- SpotBugs
- Enforcer
- autres plugins branchés sur `verify`

Donc :

```text
compile OK
test OK
package OK
verify KO
```

veut souvent dire :

- les tests unitaires passent
- mais un test IT ou un plugin de contrôle échoue

---

## Exemple typique de configuration Failsafe

```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-failsafe-plugin</artifactId>
  <version>3.2.5</version>
  <executions>
    <execution>
      <goals>
        <goal>integration-test</goal>
        <goal>verify</goal>
      </goals>
    </execution>
  </executions>
</plugin>
```

Avec cette config :

- les tests IT sont lancés pendant `verify`
- les classes comme `*IT` sont prises en compte

---

## Exemple typique de configuration Surefire

```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-surefire-plugin</artifactId>
  <version>3.2.5</version>
</plugin>
```

Avec ça :

- les tests unitaires tournent pendant `test`

---

## Cas vu dans les erreurs

Si tu vois un nom comme :

```text
ContextControllerIT$WithSetContext
```

ça veut dire :

- `ContextControllerIT` = classe de test principale
- `WithSetContext` = classe interne
- souvent une classe `@Nested` en JUnit 5

Exemple :

```java
class ContextControllerIT {

    @Nested
    class WithSetContext {

        @Test
        void testSetContext() {
        }
    }
}
```

Le symbole `$` désigne une classe imbriquée.

---

## Ce que le `gitlab-ci.yml` fait ou ne fait pas

Le `gitlab-ci.yml` ne décide pas en premier quels tests sont des IT.

Il fait surtout :

- lancer une commande Maven
- par exemple `mvn verify` ou `mvn install`

C’est donc :

- **Maven + `pom.xml`** qui définissent le comportement
- **GitLab CI** qui déclenche juste la commande

---

## Comment savoir ce que lance `verify`

### Regarder le `pom.xml`
Chercher :

```xml
<artifactId>maven-failsafe-plugin</artifactId>
<artifactId>maven-surefire-plugin</artifactId>
<phase>verify</phase>
```

### Lancer Maven avec détails
```bash
mvn verify -e
mvn verify -X
```

### Afficher le POM effectif
```bash
mvn help:effective-pom
```

---

## Commandes utiles

### Lancer les tests unitaires
```bash
mvn test
```

### Lancer le cycle jusqu’à verify
```bash
mvn verify
```

### Lancer jusqu’à install
```bash
mvn install
```

### Voir les dépendances
```bash
mvn dependency:tree
```

### Voir le POM final hérité
```bash
mvn help:effective-pom
```

---

## Résumé final

- Les tests IT sont souvent dans `src/test/java`
- Ils sont souvent nommés `*IT`
- `mvn test` lance surtout les tests unitaires
- `mvn verify` lance souvent les tests IT
- Le comportement est défini dans le **`pom.xml`**
- Le plugin clé pour les IT est souvent **`maven-failsafe-plugin`**
- Si `verify` échoue alors que `test` passe, il faut regarder :
  - les classes `*IT`
  - la config `failsafe`
  - les plugins branchés sur `verify`