# Port OUT – PersonRepository

Deuxième étape de l'architecture hexagonale pour le CRUD `Person`.

Objectif :

- définir le contrat de stockage des personnes ;
- permettre à l'application de manipuler des `Person` sans connaître la technologie utilisée ;
- ne pas implémenter le stockage ;
- ne pas utiliser Spring Data ;
- ne pas utiliser JPA ;
- ne pas utiliser PostgreSQL ;
- ne pas utiliser de stockage en mémoire à cette étape.

---

## Architecture

À l'étape précédente :

```text
Person
```

Nous avions uniquement le domaine.

Nous ajoutons maintenant un port sortant :

```text
Person
  ↑
PersonRepository
```

Architecture actuelle :

```text
Domain
  │
  └── Person
        ↑
Application
  │
  └── Port OUT
        │
        └── PersonRepository
```

Le port définit ce dont l'application a besoin pour stocker et récupérer des personnes.

Il ne définit pas comment ces opérations sont réalisées.

---

## Package by feature

L'organisation reste basée sur les fonctionnalités.

```text
com.ganatan.starter
├── person
│   ├── domain
│   └── application
│       └── port
│           └── out
├── city
└── country
```

Pour la feature `person` :

```text
person
├── domain
│   └── Person.java
└── application
    └── port
        └── out
            └── PersonRepository.java
```

Le package principal reste donc :

```text
com.ganatan.starter.person
```

---

## Structure

Structure du projet pour la feature `person` :

```text
src/main/java/com/ganatan/starter/person/
├── domain/
│   └── Person.java
└── application/
    └── port/
        └── out/
            └── PersonRepository.java
```

Tests existants :

```text
src/test/java/com/ganatan/starter/person/
└── domain/
    └── PersonTests.java
```

Aucun nouveau test n'est nécessaire à cette étape.

`PersonRepository` est uniquement une interface.

Son comportement sera testé lorsque nous créerons son implémentation.

---

## Port sortant

Un port sortant représente un besoin de l'application vers l'extérieur.

Dans notre cas, l'application devra pouvoir :

```text
récupérer toutes les personnes
récupérer une personne par identifiant
créer une personne
modifier une personne
supprimer une personne
```

Mais elle ne doit pas savoir si les données proviennent :

```text
d'une List Java
de PostgreSQL
de JPA / Hibernate
d'une API externe
d'un fichier
```

Le port définit uniquement le contrat.

---

## Code – PersonRepository.java

Chemin :

```text
src/main/java/com/ganatan/starter/person/application/port/out/PersonRepository.java
```

Code :

```java
package com.ganatan.starter.person.application.port.out;

import com.ganatan.starter.person.domain.Person;
import java.util.List;
import java.util.Optional;

public interface PersonRepository {

  List<Person> findAll();

  Optional<Person> findById(int id);

  Person create(Person person);

  Person update(Person person);

  void deleteById(int id);

}
```

---

## Dépendances

`PersonRepository` dépend du domaine :

```text
PersonRepository
      ↓
    Person
```

Le domaine ne dépend pas du port.

```text
Person
  ✕
  ↓
PersonRepository
```

La direction de dépendance reste orientée vers le cœur.

---

## Méthodes

### findAll

```java
List<Person> findAll();
```

Retourne toutes les personnes.

Le port ne précise pas où elles sont stockées.

---

### findById

```java
Optional<Person> findById(int id);
```

Recherche une personne par identifiant.

Le résultat est un `Optional<Person>`.

```text
Person présente
      ↓
Optional<Person>

Person absente
      ↓
Optional.empty()
```

---

### create

```java
Person create(Person person);
```

Crée une personne.

L'implémentation sera responsable du stockage.

Dans notre première implémentation en mémoire, elle sera également responsable de la génération de l'identifiant.

---

### update

```java
Person update(Person person);
```

Met à jour une personne existante.

Le port ne connaît pas la technologie utilisée pour effectuer cette modification.

---

### deleteById

```java
void deleteById(int id);
```

Supprime une personne à partir de son identifiant.

---

## Ce que le port ne contient pas

Le port ne contient aucune annotation Spring :

```text
@Repository
@Component
@Service
```

Il ne contient aucune annotation JPA :

```text
@Entity
@Table
@Id
@Column
```

Il n'étend pas :

```text
JpaRepository
CrudRepository
PagingAndSortingRepository
```

Il reste indépendant de l'infrastructure.

---

## Mauvais exemple

Le port ne doit pas être :

```java
public interface PersonRepository
    extends JpaRepository<Person, Integer> {
}
```

Dans ce cas :

```text
PersonRepository
      ↓
Spring Data JPA
```

Le cœur de l'application dépendrait directement d'une technologie extérieure.

Ce n'est pas ce que nous voulons dans cette architecture.

---

## Bon principe

Nous définissons notre propre contrat :

```java
public interface PersonRepository {
}
```

Puis une technologie extérieure viendra l'implémenter.

Plus tard :

```text
                   PersonRepository
                         ↑
             ┌───────────┴───────────┐
             │                       │
InMemoryPersonRepository     JpaPersonRepositoryAdapter
             │                       │
          mémoire                 PostgreSQL
```

Le port reste identique.

Seule l'implémentation change.

---

## Avant

Dans le CRUD simple, le stockage était directement dans le Controller :

```text
PersonController
├── List<Person>
├── AtomicInteger
├── find
├── create
├── update
└── delete
```

Le Controller connaissait directement la manière dont les données étaient stockées.

---

## Maintenant

Nous séparons le besoin de son implémentation.

```text
Person
  ↑
PersonRepository
```

`PersonRepository` dit :

```text
j'ai besoin de stocker et récupérer des Person
```

mais il ne dit pas :

```text
comment
```

---

## Port et Adapter

À cette étape, nous avons uniquement le port :

```text
Application
    │
    ▼
PersonRepository
```

Il manque encore l'adapter :

```text
Application
    │
    ▼
PersonRepository
    ▲
    │
Adapter
```

Le port est une interface.

L'adapter sera une classe qui implémente cette interface.

---

## Architecture actuelle

```text
com.ganatan.starter.person

domain
  │
  └── Person

application
  │
  └── port
      │
      └── out
          │
          └── PersonRepository
```

Dépendance :

```text
PersonRepository
      ↓
    Person
```

---

## Architecture cible

Plus tard :

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
Adapter Memory
```

Puis :

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
Adapter JPA
  ↓
Hibernate
  ↓
PostgreSQL
```

Le même port sortant sera utilisé dans les deux cas.

---

## Build

Compiler et tester le projet :

```bash
mvn clean install
```

Le projet doit toujours compiler.

Aucune nouvelle dépendance Maven n'est nécessaire.

---

## État du projet

À cette étape :

```text
Spring Boot
    +
RootController
    +
Person
    +
PersonRepository
```

Pour la feature `Person` :

```text
Domain
  │
  └── Person
        ↑
Application
  │
  └── Port OUT
        │
        └── PersonRepository
```

Il n'existe toujours pas :

```text
PersonController
PersonService
Adapter REST
Adapter Memory
JPA
Hibernate
PostgreSQL
```

---

## Étape suivante

Nous allons maintenant créer la première implémentation de `PersonRepository`.

Elle utilisera :

```text
List<Person>
AtomicInteger
```

Les sept réalisateurs seront stockés en mémoire.

Architecture suivante :

```text
Person
  ↑
PersonRepository
  ↑
InMemoryPersonRepository
```

Le port restera indépendant de l'implémentation.

Prochaine étape :

```text
005-adapter-memory.md
```

---

## Principes clés

- `PersonRepository` est un port sortant ;
- le port appartient à l'application ;
- le port utilise le modèle `Person` du domaine ;
- le domaine ne dépend pas du port ;
- le port définit un contrat ;
- le port ne définit pas la technologie utilisée ;
- le port ne dépend pas de Spring Data ;
- le port ne dépend pas de JPA ;
- le port ne dépend pas de PostgreSQL ;
- plusieurs adapters peuvent implémenter le même port ;
- l'organisation reste en package by feature.

Architecture actuelle :

```text
person
├── domain
│   └── Person
└── application
    └── port
        └── out
            └── PersonRepository
```

Étape suivante :

```text
person
├── domain
│   └── Person
├── application
│   └── port
│       └── out
│           └── PersonRepository
└── infrastructure
    └── adapter
        └── out
            └── memory
                └── InMemoryPersonRepository
