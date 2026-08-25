# Adapter OUT mémoire – InMemoryPersonRepository

Troisième étape de l'architecture hexagonale pour le CRUD `Person`.

Objectif :

- créer une première implémentation du port `PersonRepository` ;
- stocker les personnes en mémoire ;
- retrouver les sept réalisateurs du CRUD initial ;
- générer automatiquement les identifiants ;
- implémenter le CRUD sans REST ;
- ne pas utiliser de Controller ;
- ne pas utiliser JPA ;
- ne pas utiliser Hibernate ;
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
```

Nous ajoutons maintenant un adapter sortant :

```text
InMemoryPersonRepository
          │
          │ implements
          ▼
   PersonRepository
          │
          ▼
        Person
```

`PersonRepository` définit le contrat.

`InMemoryPersonRepository` fournit une implémentation concrète de ce contrat.

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

Structure de la feature :

```text
person
├── domain
│   └── Person.java
├── application
│   └── port
│       └── out
│           └── PersonRepository.java
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
│       └── out/
│           └── PersonRepository.java
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
└── infrastructure/
    └── adapter/
        └── out/
            └── memory/
                └── InMemoryPersonRepositoryTests.java
```

---

## Rappel – Port OUT

Le port défini précédemment est :

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

Le port ne connaît toujours aucune technologie de stockage.

---

## Adapter sortant

Un adapter sortant implémente un port sortant.

Dans notre cas :

```text
PersonRepository
       ↑
       │ implements
       │
InMemoryPersonRepository
```

L'application connaît :

```text
PersonRepository
```

Elle n'a pas besoin de connaître :

```text
InMemoryPersonRepository
```

C'est le principe d'inversion de dépendance.

---

## Stockage

Le stockage est réalisé avec :

```text
List<Person>
```

La génération des identifiants utilise :

```text
AtomicInteger
```

Architecture interne de l'adapter :

```text
InMemoryPersonRepository
├── AtomicInteger
└── List<Person>
```

Les données sont perdues au redémarrage de l'application.

---

## Données initiales

Sept réalisateurs sont chargés lors de la création du repository.

```json
[
  {
    "id": 1,
    "firstName": "Steven",
    "lastName": "Spielberg",
    "cityId": 1
  },
  {
    "id": 2,
    "firstName": "Martin",
    "lastName": "Scorsese",
    "cityId": 2
  },
  {
    "id": 3,
    "firstName": "Francis",
    "lastName": "Ford Coppola",
    "cityId": 3
  },
  {
    "id": 4,
    "firstName": "George",
    "lastName": "Lucas",
    "cityId": 4
  },
  {
    "id": 5,
    "firstName": "Quentin",
    "lastName": "Tarantino",
    "cityId": 5
  },
  {
    "id": 6,
    "firstName": "David",
    "lastName": "Fincher",
    "cityId": 6
  },
  {
    "id": 7,
    "firstName": "Spike",
    "lastName": "Lee",
    "cityId": 7
  }
]
```

---

## Code – InMemoryPersonRepository.java

Chemin :

```text
src/main/java/com/ganatan/starter/person/infrastructure/adapter/out/memory/InMemoryPersonRepository.java
```

Code :

```java
package com.ganatan.starter.person.infrastructure.adapter.out.memory;

import com.ganatan.starter.person.application.port.out.PersonRepository;
import com.ganatan.starter.person.domain.Person;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

public class InMemoryPersonRepository implements PersonRepository {

  private final AtomicInteger idCounter =
      new AtomicInteger(0);

  private final List<Person> personList =
      new ArrayList<>();

  public InMemoryPersonRepository() {
    createInitialPerson(
        "Steven",
        "Spielberg",
        1
    );

    createInitialPerson(
        "Martin",
        "Scorsese",
        2
    );

    createInitialPerson(
        "Francis",
        "Ford Coppola",
        3
    );

    createInitialPerson(
        "George",
        "Lucas",
        4
    );

    createInitialPerson(
        "Quentin",
        "Tarantino",
        5
    );

    createInitialPerson(
        "David",
        "Fincher",
        6
    );

    createInitialPerson(
        "Spike",
        "Lee",
        7
    );
  }

  @Override
  public List<Person> findAll() {
    return List.copyOf(
        personList
    );
  }

  @Override
  public Optional<Person> findById(
      int id
  ) {
    return personList.stream()
        .filter(
            person ->
                person.id() == id
        )
        .findFirst();
  }

  @Override
  public Person create(
      Person person
  ) {
    int id =
        idCounter.incrementAndGet();

    Person created =
        new Person(
            id,
            person.firstName(),
            person.lastName(),
            person.cityId()
        );

    personList.add(
        created
    );

    return created;
  }

  @Override
  public Person update(
      Person person
  ) {
    Person existing =
        findById(
            person.id()
        )
        .orElseThrow(
            () ->
                new NoSuchElementException(
                    "Person not found: "
                        + person.id()
                )
        );

    int index =
        personList.indexOf(
            existing
        );

    personList.set(
        index,
        person
    );

    return person;
  }

  @Override
  public void deleteById(
      int id
  ) {
    Person existing =
        findById(
            id
        )
        .orElseThrow(
            () ->
                new NoSuchElementException(
                    "Person not found: "
                        + id
                )
        );

    personList.remove(
        existing
    );
  }

  private void createInitialPerson(
      String firstName,
      String lastName,
      int cityId
  ) {
    create(
        new Person(
            0,
            firstName,
            lastName,
            cityId
        )
    );
  }

}
```

---

## Implémentation du port

La déclaration :

```java
public class InMemoryPersonRepository
    implements PersonRepository {
}
```

signifie que l'adapter doit implémenter toutes les opérations définies par le port :

```text
findAll
findById
create
update
deleteById
```

Le contrat reste situé dans :

```text
application
```

L'implémentation est située dans :

```text
infrastructure
```

---

## findAll

Le port définit :

```java
List<Person> findAll();
```

L'adapter implémente :

```java
@Override
public List<Person> findAll() {
  return List.copyOf(
      personList
  );
}
```

`List.copyOf` retourne une liste non modifiable contenant les personnes présentes dans le repository.

Le code extérieur ne peut donc pas modifier directement la liste interne.

---

## findById

Implémentation :

```java
@Override
public Optional<Person> findById(
    int id
) {
  return personList.stream()
      .filter(
          person ->
              person.id() == id
      )
      .findFirst();
}
```

Si la personne existe :

```text
Optional<Person>
```

Sinon :

```text
Optional.empty()
```

Aucune notion HTTP n'est utilisée.

Le repository ne retourne donc pas :

```text
404 Not Found
```

Le statut HTTP sera traité beaucoup plus tard par l'adapter REST.

---

## create

Implémentation :

```java
@Override
public Person create(
    Person person
) {
  int id =
      idCounter.incrementAndGet();

  Person created =
      new Person(
          id,
          person.firstName(),
          person.lastName(),
          person.cityId()
      );

  personList.add(
      created
  );

  return created;
}
```

L'identifiant éventuellement présent dans l'objet fourni est ignoré.

Exemple :

```java
Person input =
    new Person(
        999,
        "Clint",
        "Eastwood",
        8
    );
```

Le repository génère :

```text
id = 8
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

## update

L'identifiant utilisé est celui contenu dans la `Person`.

Exemple :

```java
Person modified =
    new Person(
        1,
        "Steven",
        "Spielberg",
        10
    );
```

Le repository recherche :

```text
id = 1
```

puis remplace l'ancienne instance par la nouvelle.

Résultat :

```json
{
  "id": 1,
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 10
}
```

---

## Person absente lors d'un update

Si la personne n'existe pas :

```java
throw new NoSuchElementException(
    "Person not found: " + person.id()
);
```

Cette exception n'est pas une erreur HTTP.

L'adapter mémoire ne connaît pas :

```text
404
HttpStatus
ResponseStatusException
```

Cette responsabilité n'appartient pas au stockage.

---

## deleteById

Implémentation :

```java
@Override
public void deleteById(
    int id
) {
  Person existing =
      findById(
          id
      )
      .orElseThrow(
          () ->
              new NoSuchElementException(
                  "Person not found: "
                      + id
              )
      );

  personList.remove(
      existing
  );
}
```

La suppression est réalisée uniquement dans la liste en mémoire.

---

## Initialisation

La méthode :

```java
private void createInitialPerson(
    String firstName,
    String lastName,
    int cityId
)
```

permet de créer les données initiales en utilisant la même logique que la création normale.

Chaque appel passe par :

```java
create(...)
```

L'`AtomicInteger` génère donc automatiquement :

```text
1
2
3
4
5
6
7
```

Après l'initialisation :

```text
idCounter = 7
```

La prochaine personne créée aura :

```text
id = 8
```

---

## Test – InMemoryPersonRepositoryTests.java

Chemin :

```text
src/test/java/com/ganatan/starter/person/infrastructure/adapter/out/memory/InMemoryPersonRepositoryTests.java
```

Code :

```java
package com.ganatan.starter.person.infrastructure.adapter.out.memory;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.ganatan.starter.person.domain.Person;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class InMemoryPersonRepositoryTests {

  private InMemoryPersonRepository repository;

  @BeforeEach
  void setUp() {
    repository =
        new InMemoryPersonRepository();
  }

  @Test
  void findAllShouldReturnSevenPersons() {
    List<Person> persons =
        repository.findAll();

    assertNotNull(
        persons
    );

    assertEquals(
        7,
        persons.size()
    );
  }

  @Test
  void findAllShouldContainStevenSpielberg() {
    List<Person> persons =
        repository.findAll();

    assertTrue(
        persons.stream()
            .anyMatch(
                person ->
                    person.firstName()
                        .equals("Steven")
                        && person.lastName()
                            .equals("Spielberg")
            )
    );
  }

  @Test
  void findAllShouldHaveSequentialIds() {
    List<Person> persons =
        repository.findAll();

    for (
        int index = 0;
        index < persons.size();
        index++
    ) {
      assertEquals(
          index + 1,
          persons.get(index).id()
      );
    }
  }

  @Test
  void findByIdShouldReturnPersonWhenIdExists() {
    Optional<Person> result =
        repository.findById(
            1
        );

    assertTrue(
        result.isPresent()
    );

    Person person =
        result.orElseThrow();

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
  void findByIdShouldReturnEmptyWhenIdDoesNotExist() {
    Optional<Person> result =
        repository.findById(
            999
        );

    assertTrue(
        result.isEmpty()
    );
  }

  @Test
  void createShouldAddPersonAndGenerateId() {
    Person input =
        new Person(
            0,
            "Clint",
            "Eastwood",
            8
        );

    Person result =
        repository.create(
            input
        );

    assertNotNull(
        result
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
  void createShouldIncreaseSizeByOne() {
    int before =
        repository.findAll()
            .size();

    repository.create(
        new Person(
            0,
            "Clint",
            "Eastwood",
            8
        )
    );

    assertEquals(
        before + 1,
        repository.findAll()
            .size()
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
        repository.create(
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
  void updateShouldModifyPersonWhenIdExists() {
    Person modified =
        new Person(
            1,
            "Steven",
            "Spielberg",
            10
        );

    Person result =
        repository.update(
            modified
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
  void updateShouldReflectChangeInRepository() {
    repository.update(
        new Person(
            1,
            "Steven",
            "Spielberg",
            10
        )
    );

    Person person =
        repository.findById(
            1
        )
        .orElseThrow();

    assertEquals(
        10,
        person.cityId()
    );
  }

  @Test
  void updateShouldThrowWhenIdDoesNotExist() {
    assertThrows(
        NoSuchElementException.class,
        () ->
            repository.update(
                new Person(
                    999,
                    "Unknown",
                    "Person",
                    1
                )
            )
    );
  }

  @Test
  void deleteByIdShouldRemovePerson() {
    int before =
        repository.findAll()
            .size();

    repository.deleteById(
        1
    );

    assertEquals(
        before - 1,
        repository.findAll()
            .size()
    );
  }

  @Test
  void deleteByIdShouldRemoveCorrectPerson() {
    repository.deleteById(
        1
    );

    boolean exists =
        repository.findAll()
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
  void deleteByIdShouldMakeIdUnavailable() {
    repository.deleteById(
        1
    );

    Optional<Person> result =
        repository.findById(
            1
        );

    assertTrue(
        result.isEmpty()
    );
  }

  @Test
  void deleteByIdShouldThrowWhenIdDoesNotExist() {
    assertThrows(
        NoSuchElementException.class,
        () ->
            repository.deleteById(
                999
            )
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

Aucune nouvelle dépendance Maven n'est nécessaire.

---

## Spring Boot

À cette étape, `InMemoryPersonRepository` n'utilise volontairement aucune annotation Spring.

Il n'y a donc pas :

```text
@Component
@Repository
@Service
```

La classe est une classe Java classique :

```java
public class InMemoryPersonRepository
    implements PersonRepository {
}
```

L'assemblage avec Spring sera réalisé séparément.

Cela permet de conserver une séparation claire entre :

```text
logique applicative
```

et :

```text
configuration du framework
```

---

## Dépendances

`InMemoryPersonRepository` dépend de :

```text
PersonRepository
Person
Java
```

Il ne dépend pas de :

```text
Spring Data
JPA
Hibernate
PostgreSQL
REST
HTTP
```

Direction des dépendances :

```text
Infrastructure
      │
      ▼
Application
      │
      ▼
Domain
```

Concrètement :

```text
InMemoryPersonRepository
          │
          ▼
   PersonRepository
          │
          ▼
        Person
```

Le domaine ne connaît toujours rien de l'infrastructure.

---

## Dépendance et exécution

Il faut distinguer deux notions.

### Dépendance du code

```text
InMemoryPersonRepository
          ↓
   PersonRepository
```

L'adapter dépend de l'interface.

### Appel à l'exécution

Plus tard, le cas d'usage appellera :

```text
Use Case
   ↓
PersonRepository
   ↓
InMemoryPersonRepository
```

Le cas d'usage manipulera l'interface.

L'instance réellement utilisée pourra être :

```text
InMemoryPersonRepository
```

ou plus tard :

```text
JpaPersonRepositoryAdapter
```

sans modifier le cas d'usage.

---

## Avant

Dans le CRUD simple :

```text
PersonController
├── Person
├── List<Person>
├── AtomicInteger
├── findAll
├── findById
├── create
├── update
└── delete
```

Le Controller faisait tout.

---

## Maintenant

Les responsabilités commencent à être séparées.

```text
Domain
  │
  └── Person

Application
  │
  └── PersonRepository

Infrastructure
  │
  └── InMemoryPersonRepository
```

Le stockage mémoire a quitté le Controller.

Il est maintenant un adapter indépendant.

---

## Comparaison

### CRUD classique

```text
PersonController
      │
      ├── List<Person>
      └── AtomicInteger
```

### Architecture hexagonale

```text
Person
  ↑
PersonRepository
  ↑
InMemoryPersonRepository
  │
  ├── List<Person>
  └── AtomicInteger
```

Le stockage est désormais situé à l'extérieur du cœur de l'application.

---

## Architecture actuelle

```text
person
├── domain
│   └── Person
│
├── application
│   └── port
│       └── out
│           └── PersonRepository
│
└── infrastructure
    └── adapter
        └── out
            └── memory
                └── InMemoryPersonRepository
```

Dépendances :

```text
InMemoryPersonRepository
          ↓
   PersonRepository
          ↓
        Person
```

---

## Ce qui fonctionne maintenant

Nous pouvons désormais effectuer :

```text
findAll
findById
create
update
deleteById
```

directement sur le repository.

Exemple :

```java
PersonRepository repository =
    new InMemoryPersonRepository();

List<Person> persons =
    repository.findAll();
```

Mais aucune route HTTP n'existe encore pour `Person`.

---

## Ce qui manque

Nous avons maintenant :

```text
Domain
+
Port OUT
+
Adapter OUT
```

Il manque la partie permettant à l'extérieur de demander à l'application d'exécuter des opérations.

```text
?
↓
Application
↓
PersonRepository
↓
InMemoryPersonRepository
```

Nous allons donc définir les opérations proposées par l'application.

---

## Étape suivante

La prochaine étape consiste à créer le port entrant.

Il définira les opérations disponibles pour le CRUD `Person`.

Architecture suivante :

```text
              Port IN
                 │
                 ▼
              Use Case
                 │
                 ▼
             Port OUT
                 │
                 ▼
       InMemoryPersonRepository
```

À l'étape suivante, nous commencerons uniquement par définir le contrat entrant.

```text
PersonUseCase
```

Prochaine étape :

```text
006-port-in.md
```

---

## Principes clés

- `InMemoryPersonRepository` est un adapter sortant ;
- il implémente `PersonRepository` ;
- `PersonRepository` reste le port sortant ;
- l'adapter appartient à l'infrastructure ;
- le stockage est réalisé avec `List<Person>` ;
- les identifiants sont générés avec `AtomicInteger` ;
- les sept réalisateurs sont chargés au démarrage du repository ;
- aucune notion HTTP n'est présente ;
- aucune annotation Spring n'est nécessaire ;
- aucune dépendance JPA n'est présente ;
- aucune base PostgreSQL n'est présente ;
- l'organisation reste en package by feature ;
- l'infrastructure dépend de l'application ;
- l'application dépend du domaine ;
- le domaine ne dépend ni de l'application ni de l'infrastructure.

Architecture obtenue :

```text
Person
  ↑
PersonRepository
  ↑
InMemoryPersonRepository
```

Étape suivante :

```text
Port IN
   ↓
Use Case
   ↓
PersonRepository
   ↓
InMemoryPersonRepository
```