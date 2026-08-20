# Repository – Person

Refactor du CRUD `Person` avec ajout d'un `PersonRepository`.

Objectifs :

* conserver `PersonInputDto` pour le payload entrant ;
* conserver `PersonOutputDto` pour la réponse JSON ;
* conserver `Person` comme modèle interne ;
* conserver `PersonController` pour la couche HTTP ;
* conserver `PersonService` pour la logique applicative ;
* ajouter `PersonRepository` ;
* déplacer le stockage en mémoire du service vers le repository ;
* aucune base de données pour le moment.

---

# Architecture

```text
HTTP
  ↓
PersonInputDto
  ↓
PersonController
  ↓
PersonService
  ↓
PersonRepository
  ↓
List<Person>
  ↓
Person
  ↓
PersonRepository
  ↓
PersonService
  ↓
PersonController
  ↓
PersonOutputDto
  ↓
HTTP
```

---

# Responsabilités

```text
PersonController
    gestion HTTP
    validation
    codes HTTP
    mapping DTO

PersonService
    logique applicative
    appel au repository

PersonRepository
    accès aux données
    stockage mémoire
    génération des identifiants

Person
    modèle interne

PersonInputDto
    données entrantes

PersonOutputDto
    données sortantes
```

---

# Structure

Tous les fichiers utilisent le package :

```text
com.ganatan.starter.api.person
```

## Code applicatif

```text
src/main/java/com/ganatan/starter/api/person/
├── Person.java
├── PersonInputDto.java
├── PersonOutputDto.java
├── PersonRepository.java
├── PersonService.java
└── PersonController.java
```

## Tests

```text
src/test/java/com/ganatan/starter/api/person/
├── PersonRepositoryTests.java
├── PersonServiceTests.java
└── PersonControllerTests.java
```

---

# Dépendances

Aucune nouvelle dépendance n'est nécessaire.

Les dépendances utilisées précédemment restent suffisantes :

```xml
<dependency>
  <groupId>io.quarkus</groupId>
  <artifactId>quarkus-rest-jackson</artifactId>
</dependency>

<dependency>
  <groupId>io.quarkus</groupId>
  <artifactId>quarkus-hibernate-validator</artifactId>
</dependency>

<dependency>
  <groupId>io.quarkus</groupId>
  <artifactId>quarkus-junit</artifactId>
  <scope>test</scope>
</dependency>

<dependency>
  <groupId>io.rest-assured</groupId>
  <artifactId>rest-assured</artifactId>
  <scope>test</scope>
</dependency>

<dependency>
  <groupId>io.quarkus</groupId>
  <artifactId>quarkus-junit-mockito</artifactId>
  <scope>test</scope>
</dependency>
```

---

# Person

`Person` ne change pas.

```text
src/main/java/com/ganatan/starter/api/person/Person.java
```

```java
package com.ganatan.starter.api.person;

public record Person(

    int id,

    String firstName,

    String lastName,

    int cityId

) {

}
```

---

# PersonInputDto

`PersonInputDto` ne change pas.

```text
src/main/java/com/ganatan/starter/api/person/PersonInputDto.java
```

```java
package com.ganatan.starter.api.person;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record PersonInputDto(

    @NotBlank
    @Size(max = 50)
    String firstName,

    @NotBlank
    @Size(max = 50)
    String lastName,

    @NotNull
    @Positive
    Integer cityId

) {

  public PersonInputDto {

    firstName = firstName == null
        ? null
        : firstName.trim();

    lastName = lastName == null
        ? null
        : lastName.trim();

  }

}
```

---

# PersonOutputDto

`PersonOutputDto` ne change pas.

```text
src/main/java/com/ganatan/starter/api/person/PersonOutputDto.java
```

```java
package com.ganatan.starter.api.person;

public record PersonOutputDto(

    int id,

    String firstName,

    String lastName,

    int cityId

) {

  public static PersonOutputDto from(
      Person person
  ) {

    return new PersonOutputDto(
        person.id(),
        person.firstName(),
        person.lastName(),
        person.cityId()
    );

  }

}
```

---

# PersonRepository

Le stockage en mémoire quitte maintenant :

```text
PersonService
```

et est déplacé dans :

```text
PersonRepository
```

Le repository contient :

```text
List<Person>
AtomicInteger
données initiales
findAll()
findById()
create()
update()
delete()
```

---

## Chemin

```text
src/main/java/com/ganatan/starter/api/person/PersonRepository.java
```

## Code

```java
package com.ganatan.starter.api.person;

import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;

@ApplicationScoped
public class PersonRepository {

  private final AtomicInteger idCounter =
      new AtomicInteger(0);

  private final List<Person> personList =
      new CopyOnWriteArrayList<>();

  public PersonRepository() {

    addInitialPerson(
        "Steven",
        "Spielberg",
        1
    );

    addInitialPerson(
        "Martin",
        "Scorsese",
        2
    );

    addInitialPerson(
        "Francis",
        "Ford Coppola",
        3
    );

    addInitialPerson(
        "George",
        "Lucas",
        4
    );

    addInitialPerson(
        "Quentin",
        "Tarantino",
        5
    );

    addInitialPerson(
        "David",
        "Fincher",
        6
    );

    addInitialPerson(
        "Spike",
        "Lee",
        7
    );

  }

  public List<Person> findAll() {

    return List.copyOf(
        personList
    );

  }

  public Optional<Person> findById(
      int id
  ) {

    return personList
        .stream()
        .filter(
            person ->
                person.id() == id
        )
        .findFirst();

  }

  public Person create(
      String firstName,
      String lastName,
      int cityId
  ) {

    int id =
        idCounter.incrementAndGet();

    Person person = new Person(
        id,
        firstName,
        lastName,
        cityId
    );

    personList.add(
        person
    );

    return person;

  }

  public Optional<Person> update(
      int id,
      String firstName,
      String lastName,
      int cityId
  ) {

    Optional<Person> existing =
        findById(id);

    if (existing.isEmpty()) {

      return Optional.empty();

    }

    Person person =
        existing.get();

    Person updated = new Person(
        person.id(),
        firstName,
        lastName,
        cityId
    );

    int index =
        personList.indexOf(person);

    personList.set(
        index,
        updated
    );

    return Optional.of(
        updated
    );

  }

  public boolean delete(
      int id
  ) {

    Optional<Person> existing =
        findById(id);

    if (existing.isEmpty()) {

      return false;

    }

    personList.remove(
        existing.get()
    );

    return true;

  }

  private void addInitialPerson(
      String firstName,
      String lastName,
      int cityId
  ) {

    create(
        firstName,
        lastName,
        cityId
    );

  }

}
```

---

# Pourquoi `@ApplicationScoped` ?

Avec Spring Boot, nous avions :

```java
@Repository
public class PersonRepository
```

Avec Quarkus, nous utilisons CDI :

```java
@ApplicationScoped
public class PersonRepository
```

`@ApplicationScoped` indique à Quarkus que :

```text
PersonRepository
```

est un bean CDI géré par le framework.

Quarkus peut alors l'injecter automatiquement dans :

```text
PersonService
```

Architecture :

```text
PersonRepository
       ↓
PersonService
       ↓
PersonController
```

Il n'est pas nécessaire d'avoir une annotation spécifique :

```text
@Repository
```

pour notre repository mémoire.

---

# Comparaison Spring Boot / Quarkus

```text
Spring Boot

@Repository
PersonRepository

@Service
PersonService

@RestController
PersonController
```

Dans Quarkus :

```text
@ApplicationScoped
PersonRepository

@ApplicationScoped
PersonService

@Path
@ApplicationScoped
PersonController
```

`@ApplicationScoped` est une annotation CDI générale.

C'est le rôle de la classe qui détermine ici qu'il s'agit d'un repository.

---

# Rôle du Repository

Le repository représente la couche d'accès aux données.

Aujourd'hui :

```text
PersonRepository
       ↓
List<Person>
```

Plus tard :

```text
PersonRepository
       ↓
PostgreSQL
```

Le service continuera à appeler :

```text
PersonRepository
```

sans manipuler directement le mécanisme de stockage.

---

# Génération des identifiants

Le repository possède :

```java
private final AtomicInteger idCounter =
    new AtomicInteger(0);
```

Les sept personnes initiales sont créées avec :

```java
create(...)
```

Le compteur évolue donc automatiquement :

```text
0
↓
1
↓
2
↓
3
↓
4
↓
5
↓
6
↓
7
```

Lors du premier `POST`, l'appel :

```java
idCounter.incrementAndGet()
```

retourne :

```text
8
```

Le premier nouvel utilisateur possède donc :

```json
{
  "id": 8
}
```

---

# Pourquoi CopyOnWriteArrayList ?

Le repository utilise :

```java
CopyOnWriteArrayList<Person>
```

au lieu de :

```java
ArrayList<Person>
```

Notre application HTTP peut recevoir plusieurs requêtes simultanément.

`CopyOnWriteArrayList` permet ici de conserver un stockage mémoire simple tout en permettant des accès concurrents plus sûrs.

```text
plusieurs requêtes HTTP
        ↓
PersonRepository
        ↓
CopyOnWriteArrayList<Person>
```

Ce stockage reste uniquement temporaire.

Il disparaîtra lorsque PostgreSQL sera ajouté.

---

# PersonService

Le service ne contient maintenant plus :

```text
AtomicInteger
List<Person>
données initiales
```

Il possède uniquement :

```text
PersonRepository
```

---

## Chemin

```text
src/main/java/com/ganatan/starter/api/person/PersonService.java
```

## Code

```java
package com.ganatan.starter.api.person;

import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class PersonService {

  private final PersonRepository personRepository;

  public PersonService(
      PersonRepository personRepository
  ) {

    this.personRepository =
        personRepository;

  }

  public List<Person> getAllPersons() {

    return personRepository
        .findAll();

  }

  public Optional<Person> getPersonById(
      int id
  ) {

    return personRepository
        .findById(id);

  }

  public Person createPerson(
      String firstName,
      String lastName,
      int cityId
  ) {

    return personRepository
        .create(
            firstName,
            lastName,
            cityId
        );

  }

  public Optional<Person> updatePerson(
      int id,
      String firstName,
      String lastName,
      int cityId
  ) {

    return personRepository
        .update(
            id,
            firstName,
            lastName,
            cityId
        );

  }

  public boolean deletePerson(
      int id
  ) {

    return personRepository
        .delete(id);

  }

}
```

---

# Évolution du Service

Avant :

```text
PersonService
├── AtomicInteger
├── List<Person>
├── données initiales
├── get
├── create
├── update
└── delete
```

Maintenant :

```text
PersonService
└── PersonRepository
```

Le stockage a complètement quitté le service.

---

# Injection du Repository

Le service possède :

```java
private final PersonRepository personRepository;
```

Le repository est injecté par constructeur :

```java
public PersonService(
    PersonRepository personRepository
) {

  this.personRepository =
      personRepository;

}
```

Quarkus détecte :

```java
@ApplicationScoped
public class PersonRepository
```

et :

```java
@ApplicationScoped
public class PersonService
```

Il construit automatiquement :

```text
PersonRepository
       ↓
PersonService
```

Avec un constructeur unique, il n'est pas nécessaire d'utiliser :

```java
@Inject
```

---

# Pourquoi conserver PersonService ?

Pour le moment :

```text
PersonService
```

délègue presque directement les appels au repository.

C'est volontaire.

```text
Controller
    ↓
Service
    ↓
Repository
```

Le service pourra plus tard contenir :

```text
règles métier
contrôles
calculs
transactions
vérifications
appels à plusieurs repositories
```

Ces responsabilités ne devront pas être placées dans le controller ni dans le repository.

---

# PersonController

Le controller ne change pas.

Il continue de dépendre uniquement de :

```text
PersonService
```

Il ne connaît pas :

```text
PersonRepository
```

L'architecture reste :

```text
PersonController
       ↓
PersonService
       ↓
PersonRepository
```

Le code de `PersonController` de l'étape précédente peut donc être conservé sans modification.

---

# Tests du Repository

Le repository peut maintenant être testé directement sans démarrer Quarkus.

---

## Chemin

```text
src/test/java/com/ganatan/starter/api/person/PersonRepositoryTests.java
```

## Code

```java
package com.ganatan.starter.api.person;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PersonRepositoryTests {

  private PersonRepository repository;

  @BeforeEach
  void setUp() {

    repository =
        new PersonRepository();

  }

  @Test
  void findAll_shouldReturnSevenPersons() {

    List<Person> persons =
        repository.findAll();

    assertEquals(
        7,
        persons.size()
    );

  }

  @Test
  void findById_shouldReturnPerson() {

    Person person = repository
        .findById(1)
        .orElseThrow();

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
  void findById_shouldReturnEmpty() {

    Optional<Person> person =
        repository.findById(999);

    assertTrue(
        person.isEmpty()
    );

  }

  @Test
  void create_shouldAddPerson() {

    Person person =
        repository.create(
            "Clint",
            "Eastwood",
            8
        );

    assertEquals(
        8,
        person.id()
    );

    assertEquals(
        "Clint",
        person.firstName()
    );

    assertEquals(
        "Eastwood",
        person.lastName()
    );

    assertEquals(
        8,
        person.cityId()
    );

    assertEquals(
        8,
        repository
            .findAll()
            .size()
    );

  }

  @Test
  void update_shouldModifyPerson() {

    Person person = repository
        .update(
            1,
            "Steven",
            "Spielberg Updated",
            10
        )
        .orElseThrow();

    assertEquals(
        1,
        person.id()
    );

    assertEquals(
        "Steven",
        person.firstName()
    );

    assertEquals(
        "Spielberg Updated",
        person.lastName()
    );

    assertEquals(
        10,
        person.cityId()
    );

  }

  @Test
  void update_shouldReturnEmpty() {

    Optional<Person> person =
        repository.update(
            999,
            "Unknown",
            "Person",
            1
        );

    assertTrue(
        person.isEmpty()
    );

  }

  @Test
  void delete_shouldRemovePerson() {

    boolean deleted =
        repository.delete(1);

    assertTrue(
        deleted
    );

    Optional<Person> person =
        repository.findById(1);

    assertTrue(
        person.isEmpty()
    );

  }

  @Test
  void delete_shouldDecreaseSize() {

    repository.delete(1);

    assertEquals(
        6,
        repository
            .findAll()
            .size()
    );

  }

  @Test
  void delete_shouldReturnFalse() {

    boolean deleted =
        repository.delete(999);

    assertFalse(
        deleted
    );

  }

}
```

---

# Tests du Service

Le service doit maintenant être construit avec :

```text
PersonRepository
```

---

## Chemin

```text
src/test/java/com/ganatan/starter/api/person/PersonServiceTests.java
```

## Code

```java
package com.ganatan.starter.api.person;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PersonServiceTests {

  private PersonService service;

  @BeforeEach
  void setUp() {

    PersonRepository repository =
        new PersonRepository();

    service =
        new PersonService(
            repository
        );

  }

  @Test
  void getAllPersons_shouldReturnSevenPersons() {

    List<Person> persons =
        service.getAllPersons();

    assertEquals(
        7,
        persons.size()
    );

  }

  @Test
  void getPersonById_shouldReturnPerson() {

    Person person = service
        .getPersonById(1)
        .orElseThrow();

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
  void getPersonById_shouldReturnEmpty() {

    Optional<Person> person =
        service.getPersonById(999);

    assertTrue(
        person.isEmpty()
    );

  }

  @Test
  void createPerson_shouldAddPerson() {

    Person person =
        service.createPerson(
            "Clint",
            "Eastwood",
            8
        );

    assertEquals(
        8,
        person.id()
    );

    assertEquals(
        "Clint",
        person.firstName()
    );

    assertEquals(
        "Eastwood",
        person.lastName()
    );

    assertEquals(
        8,
        person.cityId()
    );

  }

  @Test
  void updatePerson_shouldModifyPerson() {

    Person person = service
        .updatePerson(
            1,
            "Steven",
            "Spielberg Updated",
            10
        )
        .orElseThrow();

    assertEquals(
        1,
        person.id()
    );

    assertEquals(
        "Steven",
        person.firstName()
    );

    assertEquals(
        "Spielberg Updated",
        person.lastName()
    );

    assertEquals(
        10,
        person.cityId()
    );

  }

  @Test
  void updatePerson_shouldReturnEmpty() {

    Optional<Person> person =
        service.updatePerson(
            999,
            "Unknown",
            "Person",
            1
        );

    assertTrue(
        person.isEmpty()
    );

  }

  @Test
  void deletePerson_shouldRemovePerson() {

    boolean deleted =
        service.deletePerson(1);

    assertTrue(
        deleted
    );

    Optional<Person> person =
        service.getPersonById(1);

    assertTrue(
        person.isEmpty()
    );

  }

  @Test
  void deletePerson_shouldReturnFalse() {

    boolean deleted =
        service.deletePerson(999);

    assertFalse(
        deleted
    );

  }

}
```

---

# Tests du Controller

Les tests du controller de l'étape précédente ne changent pas.

Le controller dépend toujours uniquement de :

```text
PersonService
```

et le service est toujours remplacé par :

```java
@InjectMock
PersonService personService;
```

Le test reste donc :

```text
HTTP
   ↓
PersonController
   ↓
PersonService mocké
```

Le repository n'intervient pas dans les tests du controller.

C'est volontaire.

Chaque couche possède ainsi son niveau de test :

```text
PersonRepositoryTests
        ↓
PersonRepository réel

PersonServiceTests
        ↓
PersonService
        ↓
PersonRepository réel

PersonControllerTests
        ↓
PersonController
        ↓
PersonService mocké
```

---

# Construction des couches par Quarkus

Quarkus détecte :

```java
@ApplicationScoped
public class PersonRepository
```

Puis :

```java
@ApplicationScoped
public class PersonService
```

Puis :

```java
@Path("/persons")
@ApplicationScoped
public class PersonController
```

Les constructeurs permettent à Quarkus de construire automatiquement :

```text
PersonRepository
       ↓
PersonService
       ↓
PersonController
```

Conceptuellement, Quarkus réalise :

```java
PersonRepository repository =
    new PersonRepository();

PersonService service =
    new PersonService(
        repository
    );

PersonController controller =
    new PersonController(
        service
    );
```

Cette construction est réalisée automatiquement par CDI.

---

# Dépendances entre les couches

Le controller connaît :

```text
PersonService
```

Le service connaît :

```text
PersonRepository
```

Le repository connaît :

```text
Person
```

Donc :

```text
PersonController
       ↓
PersonService
       ↓
PersonRepository
       ↓
Person
```

Le sens inverse n'existe pas.

`PersonRepository` ne connaît pas :

```text
PersonService
PersonController
PersonInputDto
PersonOutputDto
HTTP
NotFoundException
ResponseStatus
REST
```

---

# Vérification

Exécuter les tests.

## Windows

```powershell
.\mvnw.cmd test
```

## Linux

```bash
./mvnw test
```

Ou :

```bash
mvn test
```

Résultat attendu :

```text
BUILD SUCCESS
```

---

# Lancement

## Windows

```powershell
.\mvnw.cmd quarkus:dev
```

## Linux

```bash
./mvnw quarkus:dev
```

Ou :

```bash
mvn quarkus:dev
```

---

# Endpoints

Les endpoints ne changent pas :

```text
GET    /persons
GET    /persons/{id}
POST   /persons
PUT    /persons/{id}
DELETE /persons/{id}
```

Avec le port configuré à `3000` :

```text
http://localhost:3000/persons
```

---

# GET

```bash
curl http://localhost:3000/persons
```

---

# GET par identifiant

```bash
curl http://localhost:3000/persons/1
```

Réponse :

```json
{
  "id": 1,
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 1
}
```

---

# POST

```bash
curl -X POST http://localhost:3000/persons \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"Clint\",\"lastName\":\"Eastwood\",\"cityId\":8}"
```

Réponse :

```json
{
  "id": 8,
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 8
}
```

Statut :

```text
201 Created
```

---

# PUT

```bash
curl -X PUT http://localhost:3000/persons/1 \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"Steven\",\"lastName\":\"Spielberg Updated\",\"cityId\":10}"
```

Réponse :

```json
{
  "id": 1,
  "firstName": "Steven",
  "lastName": "Spielberg Updated",
  "cityId": 10
}
```

---

# DELETE

```bash
curl -X DELETE http://localhost:3000/persons/1
```

Réponse :

```text
204 No Content
```

---

# Principes clés

* `PersonController` gère HTTP.
* `PersonService` gère la logique applicative.
* `PersonRepository` gère l'accès aux données.
* `PersonRepository` est un bean CDI `@ApplicationScoped`.
* Quarkus n'a pas besoin de `@Repository` pour ce repository mémoire.
* `PersonRepository` contient maintenant `List<Person>`.
* `PersonRepository` contient maintenant `AtomicInteger`.
* `PersonService` ne stocke plus aucune personne.
* `PersonService` dépend uniquement du repository.
* `PersonController` dépend uniquement du service.
* `PersonController` ne connaît pas directement le repository.
* `PersonRepository` manipule uniquement `Person`.
* `PersonRepository` ne connaît pas les DTO.
* `PersonRepository` ne connaît pas HTTP.
* `Optional<Person>` représente une donnée éventuellement absente.
* Le repository ne transforme jamais une absence en `404`.
* Le controller reste responsable du `404`.
* `CopyOnWriteArrayList` fournit un stockage mémoire adapté aux accès concurrents simples.
* `AtomicInteger` génère temporairement les identifiants.
* Les données restent perdues au redémarrage de l'application.
* Le repository pourra ensuite être remplacé par une implémentation PostgreSQL.

---

# Architecture actuelle

```text
HTTP
  ↓
PersonInputDto
  ↓
PersonController
  ↓
PersonService
  ↓
PersonRepository
  ↓
CopyOnWriteArrayList<Person>
  ↓
Person
  ↓
PersonRepository
  ↓
PersonService
  ↓
PersonController
  ↓
PersonOutputDto
  ↓
HTTP
```

---

# Évolution de l'architecture

## CRUD initial

```text
HTTP
  ↓
PersonController
  ↓
List<Person>
```

## Avec DTO

```text
HTTP
  ↓
PersonInputDto
  ↓
PersonController
  ↓
List<Person>
  ↓
PersonOutputDto
  ↓
HTTP
```

## Avec Service

```text
HTTP
  ↓
PersonInputDto
  ↓
PersonController
  ↓
PersonService
  ↓
List<Person>
  ↓
PersonOutputDto
  ↓
HTTP
```

## Avec Repository

```text
HTTP
  ↓
PersonInputDto
  ↓
PersonController
  ↓
PersonService
  ↓
PersonRepository
  ↓
List<Person>
  ↓
PersonOutputDto
  ↓
HTTP
```

---

# Séparation finale

```text
Controller
    │
    │ HTTP / DTO
    ↓
Service
    │
    │ logique applicative
    ↓
Repository
    │
    │ accès aux données
    ↓
List<Person>
```

Le stockage en dur est maintenant complètement isolé dans :

```text
PersonRepository
```

Le `PersonService` ne contient plus aucune donnée.

La prochaine étape pourra remplacer :

```text
List<Person>
```

par :

```text
PostgreSQL
```

sans modifier l'architecture générale :

```text
PersonController
       ↓
PersonService
       ↓
PersonRepository
       ↓
PostgreSQL
```
