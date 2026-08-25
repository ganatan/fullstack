# Domain – Person

Première étape de l'architecture hexagonale pour le CRUD `Person`.

Objectif :

- créer le modèle métier `Person` ;
- isoler le domaine du framework ;
- ne pas utiliser Spring dans le domaine ;
- ne pas utiliser de Controller ;
- ne pas utiliser de Service ;
- ne pas utiliser de Repository ;
- ne pas utiliser de base de données.

---

## Architecture

À cette étape, l'application contient uniquement le modèle métier :

```text
Person
```

Le domaine constitue le cœur de l'application.

```text
Infrastructure
     ↓
Application
     ↓
Domain
```

Le domaine ne dépend d'aucune couche extérieure.

---

## Principe

En architecture hexagonale, le domaine doit rester indépendant des technologies utilisées autour de lui.

Le modèle `Person` ne connaît donc pas :

```text
Spring Boot
REST
HTTP
Controller
Service
Repository
JPA
Hibernate
PostgreSQL
```

Il représente uniquement une donnée métier.

---

## Structure

Créer le package :

```text
com.ganatan.starter.person.domain
```

Structure :

```text
src/
├── main/
│   └── java/
│       └── com/
│           └── ganatan/
│               └── starter/
│                   └── person/
│                       └── domain/
│                           └── Person.java
└── test/
    └── java/
        └── com/
            └── ganatan/
                └── starter/
                    └── person/
                        └── domain/
                            └── PersonTests.java
```

---

## Modèle Person

Une personne contient les propriétés suivantes :

```json
{
  "id": 1,
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 1
}
```

Propriétés :

```text
id        → identifiant de la personne
firstName → prénom
lastName  → nom
cityId    → identifiant de la ville
```

---

## Code – Person.java

Chemin :

```text
src/main/java/com/ganatan/starter/person/domain/Person.java
```

Code :

```java
package com.ganatan.starter.person.domain;

public record Person(
    int id,
    String firstName,
    String lastName,
    int cityId
) {
}
```

---

## Record Java

`Person` est défini sous forme de `record`.

```java
public record Person(
    int id,
    String firstName,
    String lastName,
    int cityId
) {
}
```

Java génère automatiquement les accesseurs :

```text
id()
firstName()
lastName()
cityId()
```

Exemple :

```java
Person person = new Person(
    1,
    "Steven",
    "Spielberg",
    1
);
```

Accès aux propriétés :

```java
person.id();
person.firstName();
person.lastName();
person.cityId();
```

---

## Immutabilité

Un `record` est immutable.

Une instance existante n'est pas modifiée.

Pour changer une valeur, une nouvelle instance est créée.

Exemple :

```java
Person person = new Person(
    1,
    "Steven",
    "Spielberg",
    1
);

Person modified = new Person(
    person.id(),
    person.firstName(),
    person.lastName(),
    10
);
```

La première instance reste inchangée.

---

## Test – PersonTests.java

Chemin :

```text
src/test/java/com/ganatan/starter/person/domain/PersonTests.java
```

Code :

```java
package com.ganatan.starter.person.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

class PersonTests {

  @Test
  void personShouldExposeProperties() {

    Person person = new Person(
        1,
        "Steven",
        "Spielberg",
        1
    );

    assertNotNull(person);

    assertEquals(
        1,
        person.id()
    );

    assertEquals(
        "Steven",
        person.firstName()
    );

    assertEquals(
        "Spielberg",
        person.lastName()
    );

    assertEquals(
        1,
        person.cityId()
    );

  }

  @Test
  void personShouldImplementEquality() {

    Person person1 = new Person(
        1,
        "Steven",
        "Spielberg",
        1
    );

    Person person2 = new Person(
        1,
        "Steven",
        "Spielberg",
        1
    );

    assertEquals(
        person1,
        person2
    );

  }

  @Test
  void personShouldBeDifferentWhenPropertiesDiffer() {

    Person person1 = new Person(
        1,
        "Steven",
        "Spielberg",
        1
    );

    Person person2 = new Person(
        2,
        "Martin",
        "Scorsese",
        2
    );

    assertNotEquals(
        person1,
        person2
    );

  }

}
```

---

## Exécution des tests

Avec Maven :

```bash
mvn test
```

Avec Maven Wrapper sous Windows :

```powershell
.\mvnw.cmd test
```

Avec Maven Wrapper sous Linux :

```bash
./mvnw test
```

---

## Build

Compiler et tester le projet :

```bash
mvn clean install
```

Le domaine ne nécessite aucune dépendance Spring supplémentaire.

---

## Dépendances

La classe :

```text
Person
```

ne contient aucune dépendance vers :

```text
org.springframework.*
jakarta.persistence.*
```

Elle utilise uniquement Java.

---

## Avant

Dans la première version CRUD classique, le modèle pouvait être défini directement dans le Controller :

```text
PersonController
├── HTTP
├── CRUD
├── List<Person>
├── AtomicInteger
└── Person
```

Toutes les responsabilités étaient regroupées.

---

## Maintenant

Avec l'architecture hexagonale, le modèle devient indépendant :

```text
Person
```

Le Controller n'existe pas encore pour le CRUD `Person`.

Le stockage n'existe pas encore.

La logique CRUD n'existe pas encore.

On construit progressivement l'application autour du domaine.

---

## Évolution

Architecture actuelle :

```text
Person
```

Architecture cible :

```text
HTTP
  ↓
Adapter REST
  ↓
Port IN
  ↓
Use Case
  ↓
Port OUT
  ↓
Adapter
  ↓
PostgreSQL
```

Le domaine reste au centre :

```text
             Adapter REST
                  ↓
               Port IN
                  ↓
               Use Case
                  ↓
                Person
                  ↓
               Port OUT
                  ↓
          Adapter Repository
```

---

## Règle de dépendance

La règle principale est :

```text
Les dépendances vont vers le cœur.
```

Le domaine ne doit pas connaître les éléments extérieurs.

```text
REST ────────────────┐
Spring Boot ─────────┤
JPA ─────────────────┤
Hibernate ───────────┤
PostgreSQL ──────────┤
                     ↓
                   Domain
```

Mais :

```text
Domain
  ✕
  ↓
Spring Boot
```

Le domaine ne dépend pas de Spring Boot.

---

## État du projet

À cette étape :

```text
Spring Boot
    +
RootController
    +
Person Domain
```

Le `RootController` continue de permettre de vérifier que l'application fonctionne.

Le CRUD `Person` n'est pas encore exposé en HTTP.

---

## Étape suivante

La prochaine étape consiste à définir le contrat permettant au cœur de l'application de manipuler des personnes sans connaître leur mode de stockage.

```text
Person
  ↓
PersonRepository
```

Ce contrat sera un port sortant.

Prochaine étape :

```text
004-port-out.md
```

---

## Principes clés

- `Person` appartient au domaine ;
- `Person` ne dépend pas de Spring ;
- `Person` ne dépend pas de REST ;
- `Person` ne dépend pas de JPA ;
- `Person` ne dépend pas de PostgreSQL ;
- le domaine est indépendant de l'infrastructure ;
- le domaine représente le cœur de l'application ;
- les technologies seront ajoutées autour du domaine ;
- les dépendances doivent être dirigées vers le cœur ;
- le CRUD sera construit progressivement autour de `Person`.

Architecture actuelle :

```text
Domain
  │
  └── Person
```

Étape suivante :

```text
Domain
  │
  └── Person
       ↑
Port OUT
  │
  └── PersonRepository
```