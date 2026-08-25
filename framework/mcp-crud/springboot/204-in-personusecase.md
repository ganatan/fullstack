# Port IN – PersonUseCase

Quatrième étape de l'architecture hexagonale pour le CRUD `Person`.

Objectif :

- définir les opérations proposées par l'application ;
- créer le port entrant du CRUD `Person` ;
- permettre à un adapter entrant d'appeler l'application ;
- ne pas implémenter encore les cas d'usage ;
- ne pas utiliser de Controller ;
- ne pas utiliser REST ;
- ne pas utiliser Spring dans le port ;
- ne pas utiliser JPA ;
- ne pas utiliser PostgreSQL.

---

## Architecture

À l'étape précédente :

```text
Domain
  │
  └── Person

Application
  │
  └── Port OUT
      │
      └── PersonRepository

Infrastructure
  │
  └── Adapter OUT
      │
      └── InMemoryPersonRepository
```

Nous ajoutons maintenant un port entrant :

```text
Port IN
   │
   ▼
PersonUseCase
```

Le port entrant définit ce que l'application permet de faire.

---

## Architecture actuelle

```text
                    Port IN
                       │
                       ▼
                PersonUseCase

                       ?

                       │
                       ▼

                PersonRepository
                       │
                       ▼
          InMemoryPersonRepository
```

À cette étape, il manque encore l'implémentation entre :

```text
PersonUseCase
```

et :

```text
PersonRepository
```

Cette implémentation sera ajoutée dans l'étape suivante.

---

## Package by feature

L'organisation reste basée sur la fonctionnalité `person`.

```text
com.ganatan.starter
└── person
    ├── domain
    ├── application
    └── infrastructure
```

Le port entrant appartient à :

```text
person.application.port.in
```

Structure :

```text
person
├── domain
│   └── Person.java
│
├── application
│   └── port
│       ├── in
│       │   └── PersonUseCase.java
│       └── out
│           └── PersonRepository.java
│
└── infrastructure
    └── adapter
        └── out
            └── memory
                └── InMemoryPersonRepository.java
```

---

## Structure

Code applicatif :

```text
src/main/java/com/ganatan/starter/person/
├── domain/
│   └── Person.java
├── application/
│   └── port/
│       ├── in/
│       │   └── PersonUseCase.java
│       └── out/
│           └── PersonRepository.java
└── infrastructure/
    └── adapter/
        └── out/
            └── memory/
                └── InMemoryPersonRepository.java
```

Tests existants :

```text
src/test/java/com/ganatan/starter/person/
├── domain/
│   └── PersonTests.java
└── infrastructure/
    └── adapter/
        └── out/
            └── memory/
                └── InMemoryPersonRepositoryTests.java
```

Aucun nouveau test n'est nécessaire à cette étape.

`PersonUseCase` est uniquement un contrat.

---

## Port entrant

Un port entrant définit les opérations accessibles depuis l'extérieur de l'application.

Dans notre CRUD `Person`, l'application permet de :

```text
récupérer toutes les personnes
récupérer une personne par identifiant
créer une personne
modifier une personne
supprimer une personne
```

Le port entrant ne connaît pas celui qui l'appelle.

Il peut être utilisé plus tard par :

```text
REST
CLI
GraphQL
Messaging
Tests
```

---

## Code – PersonUseCase.java

Chemin :

```text
src/main/java/com/ganatan/starter/person/application/port/in/PersonUseCase.java
```

Code :

```java
package com.ganatan.starter.person.application.port.in;

import com.ganatan.starter.person.domain.Person;
import java.util.List;

public interface PersonUseCase {

  List<Person> getAll();

  Person getById(int id);

  Person create(Person person);

  Person update(
      int id,
      Person person
  );

  void delete(int id);

}
```

---

## Opérations

Le port entrant expose cinq opérations.

```text
getAll
getById
create
update
delete
```

Elles correspondent au CRUD métier.

À cette étape, elles ne correspondent pas encore directement à HTTP.

Il n'existe toujours aucune notion de :

```text
GET
POST
PUT
DELETE
200
201
204
404
```

Ces notions appartiendront à l'adapter REST.

---

## getAll

Signature :

```java
List<Person> getAll();
```

Cette opération demande à l'application :

```text
donne-moi toutes les personnes
```

Elle retourne :

```text
List<Person>
```

---

## getById

Signature :

```java
Person getById(int id);
```

Cette opération demande à l'application :

```text
donne-moi la personne correspondant à cet identifiant
```

Exemple :

```text
id = 1
```

Résultat attendu :

```json
{
  "id": 1,
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 1
}
```

La gestion d'une personne inexistante sera implémentée dans le cas d'usage.

---

## create

Signature :

```java
Person create(Person person);
```

Cette opération demande à l'application de créer une personne.

Exemple d'entrée :

```json
{
  "id": 0,
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 8
}
```

L'identifiant réel sera généré par le stockage.

Résultat attendu :

```json
{
  "id": 8,
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 8
}
```

---

## update

Signature :

```java
Person update(
    int id,
    Person person
);
```

L'identifiant à modifier est fourni séparément.

Exemple :

```text
id = 1
```

Personne reçue :

```json
{
  "id": 0,
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 10
}
```

Le cas d'usage devra conserver :

```text
id = 1
```

Résultat attendu :

```json
{
  "id": 1,
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 10
}
```

Le port entrant ne dépend donc pas d'un identifiant éventuellement présent dans l'objet reçu.

---

## delete

Signature :

```java
void delete(int id);
```

Cette opération demande à l'application de supprimer la personne correspondant à :

```text
id
```

Aucune notion HTTP n'est présente.

Le port ne connaît pas :

```text
204 No Content
```

Ce statut sera décidé par l'adapter REST.

---

## Port IN et Port OUT

Nous avons maintenant deux types de ports.

### Port IN

```text
PersonUseCase
```

Il définit ce que l'application permet de faire.

```text
extérieur
   ↓
Port IN
   ↓
application
```

### Port OUT

```text
PersonRepository
```

Il définit ce dont l'application a besoin pour fonctionner.

```text
application
   ↓
Port OUT
   ↓
extérieur
```

---

## Différence

```text
Port IN
   ↓
ce que l'application propose
```

```text
Port OUT
   ↓
ce dont l'application a besoin
```

Dans notre cas :

```text
PersonUseCase
   ↓
CRUD proposé par l'application
```

et :

```text
PersonRepository
   ↓
stockage nécessaire à l'application
```

---

## Vue globale

```text
                 EXTÉRIEUR
                     │
                     ▼
                  Port IN
                     │
                     ▼
              PersonUseCase
                     │
                     ▼
                 APPLICATION
                     │
                     ▼
             PersonRepository
                     │
                  Port OUT
                     │
                     ▼
          InMemoryPersonRepository
                     │
                     ▼
                  Mémoire
```

Pour l'instant, il manque encore une classe entre les deux ports.

---

## Ce que le port IN ne contient pas

`PersonUseCase` ne contient aucune annotation Spring.

Il n'utilise pas :

```text
@RestController
@RequestMapping
@GetMapping
@PostMapping
@PutMapping
@DeleteMapping
@Service
@Component
```

Il n'utilise pas non plus :

```text
HttpStatus
ResponseEntity
ResponseStatusException
```

Le port entrant n'est pas un Controller REST.

---

## Mauvais exemple

Le port entrant ne doit pas contenir :

```java
@GetMapping("/persons")
List<Person> getAll();
```

Cette annotation introduirait une dépendance vers HTTP et Spring MVC.

Le port deviendrait lié à une technologie particulière.

---

## Bon exemple

Le port reste une interface Java simple :

```java
public interface PersonUseCase {

  List<Person> getAll();

}
```

Un adapter REST pourra plus tard appeler cette interface.

---

## Dépendances

`PersonUseCase` dépend uniquement du domaine :

```text
PersonUseCase
     │
     ▼
   Person
```

Il ne dépend pas :

```text
de PersonRepository
de InMemoryPersonRepository
de Spring
de REST
de JPA
de PostgreSQL
```

À cette étape, les deux ports restent indépendants.

```text
PersonUseCase          PersonRepository
      │                      │
      └──────────┬───────────┘
                 ▼
               Person
```

---

## Pourquoi PersonUseCase ne dépend pas directement de PersonRepository

Le port entrant définit uniquement le contrat proposé à l'extérieur.

Il ne contient aucune implémentation.

Il ne sait donc pas encore comment les opérations seront réalisées.

La liaison entre :

```text
PersonUseCase
```

et :

```text
PersonRepository
```

sera réalisée dans une classe applicative.

Cette classe sera le cas d'usage.

---

## Avant

Nous avions :

```text
Person
  ↑
PersonRepository
  ↑
InMemoryPersonRepository
```

Nous pouvions manipuler directement le repository :

```java
PersonRepository repository =
    new InMemoryPersonRepository();

repository.findAll();
```

Mais cela expose directement le mécanisme de persistence à celui qui utilise l'application.

---

## Maintenant

Nous ajoutons une entrée officielle dans l'application :

```text
PersonUseCase
```

L'objectif final sera :

```text
extérieur
   ↓
PersonUseCase
   ↓
Use Case
   ↓
PersonRepository
   ↓
Adapter
```

L'extérieur n'aura donc plus besoin d'utiliser directement :

```text
PersonRepository
```

---

## Architecture actuelle

```text
person
├── domain
│   └── Person
│
├── application
│   └── port
│       ├── in
│       │   └── PersonUseCase
│       │
│       └── out
│           └── PersonRepository
│
└── infrastructure
    └── adapter
        └── out
            └── memory
                └── InMemoryPersonRepository
```

Dépendances du code :

```text
PersonUseCase
      ↓
    Person

PersonRepository
      ↓
    Person

InMemoryPersonRepository
      ↓
PersonRepository
      ↓
    Person
```

---

## Package by feature

Avec plusieurs fonctionnalités, la même structure pourra être reproduite.

```text
com.ganatan.starter
├── person
│   ├── domain
│   ├── application
│   │   └── port
│   │       ├── in
│   │       └── out
│   └── infrastructure
│
├── city
│   ├── domain
│   ├── application
│   │   └── port
│   │       ├── in
│   │       └── out
│   └── infrastructure
│
└── country
    ├── domain
    ├── application
    │   └── port
    │       ├── in
    │       └── out
    └── infrastructure
```

Chaque feature possède son propre hexagone.

---

## Build

Compiler et tester le projet :

```bash
mvn clean install
```

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
PersonUseCase
    +
PersonRepository
    +
InMemoryPersonRepository
```

Nous avons maintenant :

```text
Domain
+
Port IN
+
Port OUT
+
Adapter OUT
```

Il manque encore :

```text
Use Case
Adapter IN REST
Configuration Spring
```

---

## Étape suivante

Nous allons maintenant implémenter `PersonUseCase`.

La classe applicative recevra un :

```text
PersonRepository
```

et réalisera les opérations :

```text
getAll
getById
create
update
delete
```

Architecture suivante :

```text
PersonUseCase
      ↑
      │ implements
      │
PersonService
      │
      ▼
PersonRepository
      │
      ▼
InMemoryPersonRepository
```

Le cas d'usage sera placé dans :

```text
person.application.service
```

Structure suivante :

```text
person
├── domain
│   └── Person.java
│
├── application
│   ├── port
│   │   ├── in
│   │   │   └── PersonUseCase.java
│   │   └── out
│   │       └── PersonRepository.java
│   │
│   └── service
│       └── PersonService.java
│
└── infrastructure
    └── adapter
        └── out
            └── memory
                └── InMemoryPersonRepository.java
```

Prochaine étape :

```text
007-use-case.md
```

---

## Principes clés

- `PersonUseCase` est un port entrant ;
- le port entrant définit ce que l'application permet de faire ;
- le port entrant appartient à la couche application ;
- il utilise uniquement le modèle du domaine ;
- il ne connaît pas REST ;
- il ne connaît pas Spring MVC ;
- il ne connaît pas le stockage ;
- il ne connaît pas `PersonRepository` ;
- il ne connaît pas `InMemoryPersonRepository` ;
- `PersonRepository` reste le port sortant ;
- les ports sont des contrats ;
- les adapters et les cas d'usage implémenteront ou utiliseront ces contrats ;
- l'organisation reste en package by feature.

Architecture obtenue :

```text
          PersonUseCase
                │
                ▼
              Person

          PersonRepository
                │
                ▼
              Person

InMemoryPersonRepository
                │
                ▼
         PersonRepository
```

Étape suivante :

```text
PersonUseCase
      ↑
PersonService
      ↓
PersonRepository
      ↓
InMemoryPersonRepository
```