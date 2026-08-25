# Use Case – PersonService

Cinquième étape de l'architecture hexagonale pour le CRUD `Person`.

Objectif :

- implémenter le port entrant `PersonUseCase` ;
- créer la logique applicative du CRUD `Person` ;
- utiliser le port sortant `PersonRepository` ;
- relier le port entrant au port sortant ;
- gérer le cas d'une personne inexistante ;
- ne pas utiliser de Controller ;
- ne pas utiliser REST ;
- ne pas dépendre de l'adapter mémoire ;
- ne pas utiliser JPA ;
- ne pas utiliser PostgreSQL ;
- ne pas utiliser d'annotation Spring.

---

## Architecture

À l'étape précédente, nous avions :

```text
PersonUseCase

PersonRepository
      ↑
InMemoryPersonRepository
```

Les deux ports existaient mais ils n'étaient pas encore reliés.

Nous ajoutons maintenant :

```text
PersonService
```

Architecture :

```text
PersonUseCase
      ↑
      │ implements
      │
PersonService
      │
      ▼
PersonRepository
      ↑
      │ implements
      │
InMemoryPersonRepository
```

`PersonService` constitue l'implémentation des cas d'usage.

---

## Responsabilités

Chaque élément possède maintenant une responsabilité précise.

```text
Person
    ↓
modèle métier

PersonUseCase
    ↓
contrat entrant

PersonService
    ↓
logique applicative

PersonRepository
    ↓
contrat sortant

InMemoryPersonRepository
    ↓
stockage en mémoire
```

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

La couche application contient maintenant :

```text
application
├── port
│   ├── in
│   └── out
├── service
└── exception
```

---

## Structure

Code applicatif :

```text
src/main/java/com/ganatan/starter/person/
├── domain/
│   └── Person.java
│
├── application/
│   ├── port/
│   │   ├── in/
│   │   │   └── PersonUseCase.java
│   │   └── out/
│   │       └── PersonRepository.java
│   │
│   ├── service/
│   │   └── PersonService.java
│   │
│   └── exception/
│       └── PersonNotFoundException.java
│
└── infrastructure/
    └── adapter/
        └── out/
            └── memory/
                └── InMemoryPersonRepository.java
```

Tests :

```text
src/test/java/com/ganatan/starter/person/
├── domain/
│   └── PersonTests.java
├── application/
│   └── service/
│       └── PersonServiceTests.java
└── infrastructure/
    └── adapter/
        └── out/
            └── memory/
                └── InMemoryPersonRepositoryTests.java
```

---

# Exception – PersonNotFoundException

La couche application doit pouvoir signaler qu'une personne n'existe pas.

Cette erreur ne doit pas encore être liée à HTTP.

Elle ne doit donc pas utiliser :

```text
HttpStatus
ResponseStatusException
@ResponseStatus
```

---

## Code – PersonNotFoundException.java

Chemin :

```text
src/main/java/com/ganatan/starter/person/application/exception/PersonNotFoundException.java
```

Code :

```java
package com.ganatan.starter.person.application.exception;

public class PersonNotFoundException extends RuntimeException {

  public PersonNotFoundException(
      int id
  ) {
    super(
        "Person not found: " + id
    );
  }

}
```

---

## Principe

L'application peut maintenant signaler :

```text
Person not found: 999
```

sans savoir comment cette erreur sera représentée à l'extérieur.

Plus tard, l'adapter REST pourra transformer cette exception en :

```text
404 Not Found
```

Mais la couche application ne connaît pas cette notion HTTP.

---

# PersonService

`PersonService` implémente le port entrant :

```text
PersonUseCase
```

et utilise le port sortant :

```text
PersonRepository
```

---

## Code – PersonService.java

Chemin :

```text
src/main/java/com/ganatan/starter/person/application/service/PersonService.java
```

Code :

```java
package com.ganatan.starter.person.application.service;

import com.ganatan.starter.person.application.exception.PersonNotFoundException;
import com.ganatan.starter.person.application.port.in.PersonUseCase;
import com.ganatan.starter.person.application.port.out.PersonRepository;
import com.ganatan.starter.person.domain.Person;
import java.util.List;

public class PersonService implements PersonUseCase {

  private final PersonRepository repository;

  public PersonService(
      PersonRepository repository
  ) {
    this.repository = repository;
  }

  @Override
  public List<Person> getAll() {
    return repository.findAll();
  }

  @Override
  public Person getById(
      int id
  ) {
    return repository.findById(
        id
    )
    .orElseThrow(
        () ->
            new PersonNotFoundException(
                id
            )
    );
  }

  @Override
  public Person create(
      Person person
  ) {
    return repository.create(
        person
    );
  }

  @Override
  public Person update(
      int id,
      Person person
  ) {
    getById(
        id
    );

    Person updated =
        new Person(
            id,
            person.firstName(),
            person.lastName(),
            person.cityId()
        );

    return repository.update(
        updated
    );
  }

  @Override
  public void delete(
      int id
  ) {
    getById(
        id
    );

    repository.deleteById(
        id
    );
  }

}
```

---

# Implémentation du port entrant

La déclaration :

```java
public class PersonService implements PersonUseCase
```

signifie que :

```text
PersonService
```

implémente le contrat défini par :

```text
PersonUseCase
```

Architecture :

```text
PersonUseCase
      ↑
PersonService
```

---

# Utilisation du port sortant

`PersonService` contient :

```java
private final PersonRepository repository;
```

Il ne contient pas :

```java
private final InMemoryPersonRepository repository;
```

C'est un point essentiel.

Le service dépend du contrat :

```text
PersonRepository
```

et non de son implémentation :

```text
InMemoryPersonRepository
```

---

## Injection par constructeur

Le repository est fourni au constructeur :

```java
public PersonService(
    PersonRepository repository
) {
  this.repository = repository;
}
```

Le service ne crée donc pas lui-même son repository.

Il ne fait pas :

```java
new InMemoryPersonRepository();
```

Cela permet de changer facilement l'implémentation.

Aujourd'hui :

```text
PersonRepository
      ↑
InMemoryPersonRepository
```

Plus tard :

```text
PersonRepository
      ↑
JpaPersonRepositoryAdapter
```

`PersonService` ne changera pas.

---

# getAll

Le port entrant définit :

```java
List<Person> getAll();
```

Le service implémente :

```java
@Override
public List<Person> getAll() {
  return repository.findAll();
}
```

Flux :

```text
getAll
  ↓
PersonService
  ↓
PersonRepository.findAll
  ↓
InMemoryPersonRepository
```

---

# getById

Implémentation :

```java
@Override
public Person getById(
    int id
) {
  return repository.findById(
      id
  )
  .orElseThrow(
      () ->
          new PersonNotFoundException(
              id
          )
  );
}
```

Le repository retourne :

```text
Optional<Person>
```

Le cas d'usage décide du comportement lorsque la personne n'existe pas.

Si elle existe :

```text
Person
```

Si elle n'existe pas :

```text
PersonNotFoundException
```

La gestion de cette règle appartient à la couche application.

---

# create

Implémentation :

```java
@Override
public Person create(
    Person person
) {
  return repository.create(
      person
  );
}
```

Flux :

```text
Person
  ↓
PersonService.create
  ↓
PersonRepository.create
  ↓
InMemoryPersonRepository.create
  ↓
Person avec identifiant généré
```

Exemple :

```java
Person person =
    new Person(
        0,
        "Clint",
        "Eastwood",
        8
    );
```

Résultat :

```json
{
  "id": 8,
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 8
}
```

---

# update

Le port entrant reçoit séparément :

```text
id
```

et :

```text
Person
```

Signature :

```java
Person update(
    int id,
    Person person
);
```

Le service vérifie d'abord que la personne existe :

```java
getById(
    id
);
```

Puis il construit une nouvelle instance :

```java
Person updated =
    new Person(
        id,
        person.firstName(),
        person.lastName(),
        person.cityId()
    );
```

L'identifiant fourni séparément est donc conservé.

---

## Exemple

Entrée :

```text
id = 1
```

Objet reçu :

```json
{
  "id": 999,
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 10
}
```

Le service crée :

```json
{
  "id": 1,
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 10
}
```

L'identifiant contenu dans l'objet reçu est ignoré.

---

# delete

Implémentation :

```java
@Override
public void delete(
    int id
) {
  getById(
      id
  );

  repository.deleteById(
      id
  );
}
```

Le service vérifie d'abord que la personne existe.

Si elle n'existe pas :

```text
PersonNotFoundException
```

Sinon :

```text
PersonRepository.deleteById
```

est appelé.

---

# Logique applicative

Nous avons maintenant une véritable couche application.

```text
PersonService
```

décide :

- comment rechercher une personne ;
- quoi faire lorsqu'une personne n'existe pas ;
- quel identifiant conserver lors d'une modification ;
- quelles opérations appeler sur le repository.

Le repository reste uniquement responsable du stockage.

---

# Séparation des responsabilités

## Domain

```text
Person
```

Responsabilité :

```text
représenter une personne
```

---

## Port IN

```text
PersonUseCase
```

Responsabilité :

```text
définir ce que l'application permet de faire
```

---

## Use Case

```text
PersonService
```

Responsabilité :

```text
implémenter les opérations de l'application
```

---

## Port OUT

```text
PersonRepository
```

Responsabilité :

```text
définir les opérations nécessaires au stockage
```

---

## Adapter OUT

```text
InMemoryPersonRepository
```

Responsabilité :

```text
stocker concrètement les données
```

---

# Flux complet actuel

Pour récupérer toutes les personnes :

```text
PersonUseCase
      ↓
PersonService
      ↓
PersonRepository
      ↓
InMemoryPersonRepository
      ↓
List<Person>
```

Pour récupérer une personne :

```text
PersonUseCase
      ↓
PersonService
      ↓
PersonRepository
      ↓
InMemoryPersonRepository
      ↓
Optional<Person>
      ↓
PersonService
      ↓
Person
```

---

# Test – PersonServiceTests.java

Chemin :

```text
src/test/java/com/ganatan/starter/person/application/service/PersonServiceTests.java
```

Code :

```java
package com.ganatan.starter.person.application.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.ganatan.starter.person.application.exception.PersonNotFoundException;
import com.ganatan.starter.person.application.port.out.PersonRepository;
import com.ganatan.starter.person.domain.Person;
import com.ganatan.starter.person.infrastructure.adapter.out.memory.InMemoryPersonRepository;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PersonServiceTests {

  private PersonService service;

  @BeforeEach
  void setUp() {
    PersonRepository repository =
        new InMemoryPersonRepository();

    service =
        new PersonService(
            repository
        );
  }

  @Test
  void getAllShouldReturnSevenPersons() {
    List<Person> persons =
        service.getAll();

    assertNotNull(
        persons
    );

    assertEquals(
        7,
        persons.size()
    );
  }

  @Test
  void getByIdShouldReturnPersonWhenIdExists() {
    Person person =
        service.getById(
            1
        );

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
  void getByIdShouldThrowWhenIdDoesNotExist() {
    PersonNotFoundException exception =
        assertThrows(
            PersonNotFoundException.class,
            () ->
                service.getById(
                    999
                )
        );

    assertEquals(
        "Person not found: 999",
        exception.getMessage()
    );
  }

  @Test
  void createShouldReturnGeneratedId() {
    Person input =
        new Person(
            0,
            "Clint",
            "Eastwood",
            8
        );

    Person result =
        service.create(
            input
        );

    assertEquals(
        8,
        result.id()
    );

    assertEquals(
        "Clint",
        result.firstName()
    );

    assertEquals(
        "Eastwood",
        result.lastName()
    );

    assertEquals(
        8,
        result.cityId()
    );
  }

  @Test
  void createShouldIgnoreInputId() {
    Person input =
        new Person(
            999,
            "Clint",
            "Eastwood",
            8
        );

    Person result =
        service.create(
            input
        );

    assertNotEquals(
        999,
        result.id()
    );

    assertEquals(
        8,
        result.id()
    );
  }

  @Test
  void createShouldIncreaseSizeByOne() {
    int before =
        service.getAll()
            .size();

    service.create(
        new Person(
            0,
            "Clint",
            "Eastwood",
            8
        )
    );

    assertEquals(
        before + 1,
        service.getAll()
            .size()
    );
  }

  @Test
  void updateShouldModifyPerson() {
    Person input =
        new Person(
            0,
            "Steven",
            "Spielberg",
            10
        );

    Person result =
        service.update(
            1,
            input
        );

    assertEquals(
        1,
        result.id()
    );

    assertEquals(
        "Steven",
        result.firstName()
    );

    assertEquals(
        "Spielberg",
        result.lastName()
    );

    assertEquals(
        10,
        result.cityId()
    );
  }

  @Test
  void updateShouldPreserveIdFromParameter() {
    Person input =
        new Person(
            999,
            "Steven",
            "Spielberg",
            10
        );

    Person result =
        service.update(
            1,
            input
        );

    assertEquals(
        1,
        result.id()
    );
  }

  @Test
  void updateShouldReflectChange() {
    service.update(
        1,
        new Person(
            0,
            "Steven",
            "Spielberg",
            10
        )
    );

    Person result =
        service.getById(
            1
        );

    assertEquals(
        10,
        result.cityId()
    );
  }

  @Test
  void updateShouldThrowWhenIdDoesNotExist() {
    assertThrows(
        PersonNotFoundException.class,
        () ->
            service.update(
                999,
                new Person(
                    0,
                    "Unknown",
                    "Person",
                    1
                )
            )
    );
  }

  @Test
  void deleteShouldRemovePerson() {
    int before =
        service.getAll()
            .size();

    service.delete(
        1
    );

    assertEquals(
        before - 1,
        service.getAll()
            .size()
    );
  }

  @Test
  void deleteShouldRemoveCorrectPerson() {
    service.delete(
        1
    );

    boolean exists =
        service.getAll()
            .stream()
            .anyMatch(
                person ->
                    person.id() == 1
            );

    assertFalse(
        exists
    );
  }

  @Test
  void deleteShouldMakePersonUnavailable() {
    service.delete(
        1
    );

    assertThrows(
        PersonNotFoundException.class,
        () ->
            service.getById(
                1
            )
    );
  }

  @Test
  void deleteShouldThrowWhenIdDoesNotExist() {
    assertThrows(
        PersonNotFoundException.class,
        () ->
            service.delete(
                999
            )
    );
  }

}
```

---

# Exécution des tests

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

# Build

Compiler et tester le projet :

```bash
mvn clean install
```

Aucune nouvelle dépendance Maven n'est nécessaire.

---

# Spring Boot

À cette étape, `PersonService` reste une classe Java classique.

Il n'utilise pas :

```text
@Service
@Component
@Autowired
```

Nous avons donc :

```java
public class PersonService implements PersonUseCase
```

et non :

```java
@Service
public class PersonService implements PersonUseCase
```

La création et l'assemblage des objets seront traités séparément.

---

# Création manuelle

À cette étape, l'ensemble du CRUD peut déjà fonctionner sans Spring.

Exemple :

```java
PersonRepository repository =
    new InMemoryPersonRepository();

PersonUseCase useCase =
    new PersonService(
        repository
    );

List<Person> persons =
    useCase.getAll();
```

Assemblage :

```text
InMemoryPersonRepository
          ↓
   PersonRepository
          ↓
    PersonService
          ↓
    PersonUseCase
```

---

# Inversion de dépendance

Le point important est que :

```text
PersonService
```

ne dépend pas de :

```text
InMemoryPersonRepository
```

Il dépend de :

```text
PersonRepository
```

Donc :

```text
PersonService
      ↓
PersonRepository
      ↑
InMemoryPersonRepository
```

L'implémentation extérieure dépend du contrat défini à l'intérieur.

---

# Avant

Dans le CRUD classique :

```text
PersonController
├── HTTP
├── logique CRUD
├── stockage
└── données
```

Toutes les responsabilités étaient regroupées.

---

# Maintenant

```text
Person
  ↑
PersonUseCase
  ↑
PersonService
  ↓
PersonRepository
  ↑
InMemoryPersonRepository
```

Les responsabilités sont séparées.

---

# Architecture actuelle

```text
person
├── domain
│   └── Person.java
│
├── application
│   ├── exception
│   │   └── PersonNotFoundException.java
│   │
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

---

# Dépendances

```text
PersonService
      │
      ├───────────────► PersonUseCase
      │
      ├───────────────► PersonRepository
      │
      └───────────────► Person
```

L'adapter mémoire :

```text
InMemoryPersonRepository
          │
          ├────────────► PersonRepository
          │
          └────────────► Person
```

Le domaine :

```text
Person
```

ne dépend toujours de rien.

---

# Flux actuel

Nous avons maintenant :

```text
Port IN
   ↓
Use Case
   ↓
Port OUT
   ↓
Adapter OUT
```

Concrètement :

```text
PersonUseCase
      ↓
PersonService
      ↓
PersonRepository
      ↓
InMemoryPersonRepository
```

Il manque maintenant uniquement une entrée extérieure.

---

# Étape suivante

Nous allons exposer les cas d'usage en HTTP.

Nous ajouterons un adapter entrant REST :

```text
PersonController
```

Le Controller ne contiendra plus :

```text
List<Person>
AtomicInteger
logique CRUD
```

Il appellera uniquement :

```text
PersonUseCase
```

Architecture suivante :

```text
HTTP
  ↓
PersonController
  ↓
PersonUseCase
  ↓
PersonService
  ↓
PersonRepository
  ↓
InMemoryPersonRepository
```

Le Controller sera placé dans :

```text
person.infrastructure.adapter.in.rest
```

Structure suivante :

```text
person
├── domain
│   └── Person.java
│
├── application
│   ├── exception
│   │   └── PersonNotFoundException.java
│   ├── port
│   │   ├── in
│   │   │   └── PersonUseCase.java
│   │   └── out
│   │       └── PersonRepository.java
│   └── service
│       └── PersonService.java
│
└── infrastructure
    └── adapter
        ├── in
        │   └── rest
        │       └── PersonController.java
        └── out
            └── memory
                └── InMemoryPersonRepository.java
```

Prochaine étape :

```text
008-adapter-rest.md
```

---

# Principes clés

- `PersonService` implémente le port entrant `PersonUseCase` ;
- `PersonService` représente les cas d'usage de l'application ;
- `PersonService` utilise le port sortant `PersonRepository` ;
- `PersonService` ne connaît pas `InMemoryPersonRepository` ;
- `PersonService` ne connaît pas REST ;
- `PersonService` ne connaît pas HTTP ;
- `PersonService` ne connaît pas JPA ;
- `PersonService` ne connaît pas PostgreSQL ;
- `PersonNotFoundException` appartient à la couche application ;
- aucune exception HTTP n'est utilisée ;
- le repository reste responsable du stockage ;
- le service reste responsable de la logique applicative ;
- le domaine reste indépendant ;
- l'organisation reste en package by feature.

Architecture obtenue :

```text
PersonController
      ?

      ↓

PersonUseCase
      ↑
PersonService
      ↓
PersonRepository
      ↑
InMemoryPersonRepository
```

Étape suivante :

```text
HTTP
  ↓
PersonController
  ↓
PersonUseCase
  ↓
PersonService
  ↓
PersonRepository
  ↓
InMemoryPersonRepository
```