# Service – Person

Refactor du CRUD `Person` avec ajout d'une couche `Service`.

Objectifs :

* conserver `PersonInputDto` pour le payload entrant ;
* conserver `PersonOutputDto` pour la réponse JSON ;
* conserver `Person` comme modèle interne ;
* ajouter `PersonService` ;
* déplacer le stockage en mémoire dans le service ;
* alléger le controller ;
* aucun Repository pour le moment.

---

## Architecture

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
Person
  ↓
PersonOutputDto
  ↓
HTTP
```

Responsabilités :

```text
PersonController
    gestion HTTP
    validation des payloads
    conversion DTO
    statuts HTTP

PersonService
    logique applicative
    gestion des personnes
    stockage temporaire en mémoire

Person
    modèle interne

PersonInputDto
    données entrantes

PersonOutputDto
    données sortantes
```

---

## Structure

Tous les fichiers utilisent le package :

```text
com.ganatan.starter.api.person
```

### Code applicatif

```text
src/main/java/com/ganatan/starter/api/person/
├── Person.java
├── PersonInputDto.java
├── PersonOutputDto.java
├── PersonService.java
└── PersonController.java
```

### Tests

```text
src/test/java/com/ganatan/starter/api/person/
├── PersonServiceTests.java
└── PersonControllerTests.java
```

---

# Dépendances

Vérifier la présence des dépendances REST et validation dans `pom.xml` :

```xml
<dependency>
  <groupId>io.quarkus</groupId>
  <artifactId>quarkus-rest-jackson</artifactId>
</dependency>

<dependency>
  <groupId>io.quarkus</groupId>
  <artifactId>quarkus-hibernate-validator</artifactId>
</dependency>
```

Pour les tests HTTP :

```xml
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
```

Pour mocker le service dans les tests du controller :

```xml
<dependency>
  <groupId>io.quarkus</groupId>
  <artifactId>quarkus-junit-mockito</artifactId>
  <scope>test</scope>
</dependency>
```

---

# Person

Le modèle interne reste inchangé.

## Chemin

```text
src/main/java/com/ganatan/starter/api/person/Person.java
```

## Code

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

Le DTO d'entrée reste inchangé.

Il est utilisé pour :

```text
POST /persons
PUT /persons/{id}
```

## Chemin

```text
src/main/java/com/ganatan/starter/api/person/PersonInputDto.java
```

## Code

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

Le DTO de sortie reste inchangé.

## Chemin

```text
src/main/java/com/ganatan/starter/api/person/PersonOutputDto.java
```

## Code

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

# PersonService

Le service contient maintenant :

* la liste des personnes ;
* le compteur d'identifiants ;
* les données initiales ;
* la recherche ;
* la création ;
* la modification ;
* la suppression.

Le service ne connaît pas HTTP.

Il ne manipule donc pas :

```text
NotFoundException
ResponseStatus
HTTP 200
HTTP 201
HTTP 204
HTTP 404
```

Ces éléments restent dans le controller.

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
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;

@ApplicationScoped
public class PersonService {

  private final AtomicInteger idCounter =
      new AtomicInteger(0);

  private final List<Person> personList =
      new CopyOnWriteArrayList<>();

  public PersonService() {

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

  public List<Person> getAllPersons() {

    return List.copyOf(
        personList
    );

  }

  public Optional<Person> getPersonById(
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

  public Person createPerson(
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

  public Optional<Person> updatePerson(
      int id,
      String firstName,
      String lastName,
      int cityId
  ) {

    Optional<Person> existing =
        getPersonById(id);

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

  public boolean deletePerson(
      int id
  ) {

    Optional<Person> existing =
        getPersonById(id);

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

    createPerson(
        firstName,
        lastName,
        cityId
    );

  }

}
```

---

# @ApplicationScoped

Quarkus utilise CDI pour gérer les composants.

L'annotation :

```java
@ApplicationScoped
```

indique que `PersonService` est un bean CDI partagé dans l'application.

Quarkus crée et gère automatiquement une instance de :

```text
PersonService
```

Cette instance peut ensuite être injectée dans :

```text
PersonController
```

L'équivalent conceptuel de :

```java
@Service
```

dans Spring Boot est donc ici :

```java
@ApplicationScoped
```

---

# PersonController

Le controller ne contient plus :

```text
List<Person>
AtomicInteger
findPersonById()
addInitialPerson()
```

Il délègue maintenant ces opérations à :

```text
PersonService
```

---

## Chemin

```text
src/main/java/com/ganatan/starter/api/person/PersonController.java
```

## Code

```java
package com.ganatan.starter.api.person;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.util.List;
import org.jboss.resteasy.reactive.ResponseStatus;

@Path("/persons")
@ApplicationScoped
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class PersonController {

  private final PersonService personService;

  public PersonController(
      PersonService personService
  ) {

    this.personService =
        personService;

  }

  @GET
  public List<PersonOutputDto> getAllPersons() {

    return personService
        .getAllPersons()
        .stream()
        .map(PersonOutputDto::from)
        .toList();

  }

  @GET
  @Path("/{id}")
  public PersonOutputDto getPersonById(
      @PathParam("id") int id
  ) {

    Person person = personService
        .getPersonById(id)
        .orElseThrow(
            NotFoundException::new
        );

    return PersonOutputDto.from(
        person
    );

  }

  @POST
  @ResponseStatus(201)
  public PersonOutputDto createPerson(
      @Valid PersonInputDto input
  ) {

    Person person = personService
        .createPerson(
            input.firstName(),
            input.lastName(),
            input.cityId()
        );

    return PersonOutputDto.from(
        person
    );

  }

  @PUT
  @Path("/{id}")
  public PersonOutputDto updatePerson(
      @PathParam("id") int id,
      @Valid PersonInputDto input
  ) {

    Person person = personService
        .updatePerson(
            id,
            input.firstName(),
            input.lastName(),
            input.cityId()
        )
        .orElseThrow(
            NotFoundException::new
        );

    return PersonOutputDto.from(
        person
    );

  }

  @DELETE
  @Path("/{id}")
  @ResponseStatus(204)
  public void deletePerson(
      @PathParam("id") int id
  ) {

    boolean deleted =
        personService.deletePerson(id);

    if (!deleted) {
      throw new NotFoundException();
    }

  }

}
```

---

# Injection de dépendance

Le controller possède :

```java
private final PersonService personService;
```

Le service est injecté par constructeur :

```java
public PersonController(
    PersonService personService
) {

  this.personService =
      personService;

}
```

Quarkus détecte :

```java
@ApplicationScoped
public class PersonService
```

et :

```java
@ApplicationScoped
public class PersonController
```

Puis réalise l'injection :

```text
PersonService
      ↓
PersonController
```

Avec un seul constructeur, il n'est pas nécessaire d'ajouter :

```java
@Inject
```

---

# Responsabilités

Avant le refactor :

```text
PersonController
├── HTTP
├── validation
├── stockage
├── création
├── modification
├── suppression
├── recherche
└── mapping DTO
```

Après le refactor :

```text
PersonController
├── HTTP
├── validation
├── statuts HTTP
└── mapping DTO

PersonService
├── stockage
├── recherche
├── création
├── modification
└── suppression
```

---

# GET /persons

Le controller appelle :

```java
personService.getAllPersons()
```

Le service retourne :

```text
List<Person>
```

Puis le controller transforme chaque `Person` en :

```text
PersonOutputDto
```

avec :

```java
.map(PersonOutputDto::from)
```

Architecture :

```text
GET /persons
     ↓
PersonController
     ↓
PersonService.getAllPersons()
     ↓
List<Person>
     ↓
PersonOutputDto
     ↓
JSON
```

---

# GET /persons/{id}

Le service retourne :

```java
Optional<Person>
```

Exemple :

```java
personService.getPersonById(1)
```

Si la personne existe :

```text
Optional<Person>
```

Si elle n'existe pas :

```text
Optional.empty()
```

Le controller transforme l'absence en :

```text
404 Not Found
```

avec :

```java
.orElseThrow(
    NotFoundException::new
);
```

Le service reste indépendant du protocole HTTP.

---

# POST /persons

Payload :

```json
{
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 8
}
```

Le controller reçoit :

```text
PersonInputDto
```

Puis appelle :

```java
personService.createPerson(
    input.firstName(),
    input.lastName(),
    input.cityId()
);
```

Le service crée :

```text
Person
```

Le controller transforme ensuite le résultat en :

```text
PersonOutputDto
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

# PUT /persons/{id}

Payload :

```json
{
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 10
}
```

Le controller appelle :

```java
personService.updatePerson(
    id,
    input.firstName(),
    input.lastName(),
    input.cityId()
);
```

Si la personne existe, le service retourne :

```text
Optional<Person>
```

contenant la personne modifiée.

Sinon :

```text
Optional.empty()
```

Le controller transforme cette absence en :

```text
404 Not Found
```

---

# DELETE /persons/{id}

Le service retourne un booléen :

```java
boolean deleted =
    personService.deletePerson(id);
```

Deux possibilités :

```text
true
```

La personne a été supprimée.

Réponse HTTP :

```text
204 No Content
```

ou :

```text
false
```

La personne n'existe pas.

Réponse HTTP :

```text
404 Not Found
```

---

# Tests du Service

Les tests du service ne nécessitent pas le démarrage de Quarkus.

On instancie directement :

```java
new PersonService()
```

Ce sont des tests unitaires simples.

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
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PersonServiceTests {

  private PersonService service;

  @BeforeEach
  void setUp() {

    service =
        new PersonService();

  }

  @Test
  void getAllPersons_shouldReturnSevenPersons() {

    List<Person> persons =
        service.getAllPersons();

    assertNotNull(
        persons
    );

    assertEquals(
        7,
        persons.size()
    );

  }

  @Test
  void getPersonById_shouldReturnPerson() {

    Optional<Person> result =
        service.getPersonById(1);

    assertTrue(
        result.isPresent()
    );

    Person person =
        result.get();

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
  void getPersonById_shouldReturnEmpty_whenNotFound() {

    Optional<Person> result =
        service.getPersonById(999);

    assertTrue(
        result.isEmpty()
    );

  }

  @Test
  void createPerson_shouldCreatePerson() {

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
  void createPerson_shouldIncreaseSize() {

    service.createPerson(
        "Clint",
        "Eastwood",
        8
    );

    assertEquals(
        8,
        service
            .getAllPersons()
            .size()
    );

  }

  @Test
  void updatePerson_shouldUpdatePerson() {

    Optional<Person> result =
        service.updatePerson(
            1,
            "Steven",
            "Spielberg",
            10
        );

    assertTrue(
        result.isPresent()
    );

    Person person =
        result.get();

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
        10,
        person.cityId()
    );

  }

  @Test
  void updatePerson_shouldReturnEmpty_whenNotFound() {

    Optional<Person> result =
        service.updatePerson(
            999,
            "Unknown",
            "Person",
            1
        );

    assertTrue(
        result.isEmpty()
    );

  }

  @Test
  void deletePerson_shouldDeletePerson() {

    boolean deleted =
        service.deletePerson(1);

    assertTrue(
        deleted
    );

    Optional<Person> result =
        service.getPersonById(1);

    assertTrue(
        result.isEmpty()
    );

  }

  @Test
  void deletePerson_shouldDecreaseSize() {

    service.deletePerson(1);

    assertEquals(
        6,
        service
            .getAllPersons()
            .size()
    );

  }

  @Test
  void deletePerson_shouldReturnFalse_whenNotFound() {

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

Les tests du controller vérifient les routes HTTP.

Le `PersonService` est remplacé par un mock afin de tester uniquement :

```text
HTTP
    ↓
PersonController
    ↓
PersonService mocké
```

Cela évite que les tests du controller dépendent du stockage mémoire du service.

---

## Dépendance Mockito

Ajouter :

```xml
<dependency>
  <groupId>io.quarkus</groupId>
  <artifactId>quarkus-junit-mockito</artifactId>
  <scope>test</scope>
</dependency>
```

---

## Chemin

```text
src/test/java/com/ganatan/starter/api/person/PersonControllerTests.java
```

## Code

```java
package com.ganatan.starter.api.person;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;

@QuarkusTest
class PersonControllerTests {

  @InjectMock
  PersonService personService;

  @Test
  void getAllPersons_shouldReturnSevenPersons() {

    when(
        personService.getAllPersons()
    ).thenReturn(
        List.of(
            new Person(
                1,
                "Steven",
                "Spielberg",
                1
            ),
            new Person(
                2,
                "Martin",
                "Scorsese",
                2
            ),
            new Person(
                3,
                "Francis",
                "Ford Coppola",
                3
            ),
            new Person(
                4,
                "George",
                "Lucas",
                4
            ),
            new Person(
                5,
                "Quentin",
                "Tarantino",
                5
            ),
            new Person(
                6,
                "David",
                "Fincher",
                6
            ),
            new Person(
                7,
                "Spike",
                "Lee",
                7
            )
        )
    );

    given()
        .when()
        .get("/persons")
        .then()
        .statusCode(200)
        .body("$", hasSize(7));

  }

  @Test
  void getPersonById_shouldReturnPerson() {

    when(
        personService.getPersonById(1)
    ).thenReturn(
        Optional.of(
            new Person(
                1,
                "Steven",
                "Spielberg",
                1
            )
        )
    );

    given()
        .when()
        .get("/persons/1")
        .then()
        .statusCode(200)
        .body("id", is(1))
        .body(
            "firstName",
            is("Steven")
        )
        .body(
            "lastName",
            is("Spielberg")
        )
        .body(
            "cityId",
            is(1)
        );

  }

  @Test
  void getPersonById_shouldReturnNotFound() {

    when(
        personService.getPersonById(999)
    ).thenReturn(
        Optional.empty()
    );

    given()
        .when()
        .get("/persons/999")
        .then()
        .statusCode(404);

  }

  @Test
  void createPerson_shouldReturnCreatedPerson() {

    when(
        personService.createPerson(
            anyString(),
            anyString(),
            anyInt()
        )
    ).thenReturn(
        new Person(
            8,
            "Clint",
            "Eastwood",
            8
        )
    );

    String payload = """
      {
        "firstName": "Clint",
        "lastName": "Eastwood",
        "cityId": 8
      }
      """;

    given()
        .contentType(
            ContentType.JSON
        )
        .body(payload)
        .when()
        .post("/persons")
        .then()
        .statusCode(201)
        .body("id", is(8))
        .body(
            "firstName",
            is("Clint")
        )
        .body(
            "lastName",
            is("Eastwood")
        )
        .body(
            "cityId",
            is(8)
        );

  }

  @Test
  void createPerson_shouldRejectInvalidPayload() {

    String payload = """
      {
        "firstName": "",
        "lastName": "Eastwood",
        "cityId": 0
      }
      """;

    given()
        .contentType(
            ContentType.JSON
        )
        .body(payload)
        .when()
        .post("/persons")
        .then()
        .statusCode(400);

  }

  @Test
  void updatePerson_shouldReturnUpdatedPerson() {

    when(
        personService.updatePerson(
            anyInt(),
            anyString(),
            anyString(),
            anyInt()
        )
    ).thenReturn(
        Optional.of(
            new Person(
                1,
                "Steven",
                "Spielberg",
                10
            )
        )
    );

    String payload = """
      {
        "firstName": "Steven",
        "lastName": "Spielberg",
        "cityId": 10
      }
      """;

    given()
        .contentType(
            ContentType.JSON
        )
        .body(payload)
        .when()
        .put("/persons/1")
        .then()
        .statusCode(200)
        .body("id", is(1))
        .body(
            "firstName",
            is("Steven")
        )
        .body(
            "lastName",
            is("Spielberg")
        )
        .body(
            "cityId",
            is(10)
        );

  }

  @Test
  void updatePerson_shouldReturnNotFound() {

    when(
        personService.updatePerson(
            anyInt(),
            anyString(),
            anyString(),
            anyInt()
        )
    ).thenReturn(
        Optional.empty()
    );

    String payload = """
      {
        "firstName": "Unknown",
        "lastName": "Person",
        "cityId": 1
      }
      """;

    given()
        .contentType(
            ContentType.JSON
        )
        .body(payload)
        .when()
        .put("/persons/999")
        .then()
        .statusCode(404);

  }

  @Test
  void deletePerson_shouldReturnNoContent() {

    when(
        personService.deletePerson(1)
    ).thenReturn(
        true
    );

    given()
        .when()
        .delete("/persons/1")
        .then()
        .statusCode(204);

  }

  @Test
  void deletePerson_shouldReturnNotFound() {

    when(
        personService.deletePerson(999)
    ).thenReturn(
        false
    );

    given()
        .when()
        .delete("/persons/999")
        .then()
        .statusCode(404);

  }

}
```

---

# Tests

Exécuter tous les tests.

### Windows

```powershell
.\mvnw.cmd test
```

### Linux

```bash
./mvnw test
```

Ou compiler, tester et installer l'artefact :

### Windows

```powershell
.\mvnw.cmd clean install
```

### Linux

```bash
./mvnw clean install
```

Résultat attendu :

```text
BUILD SUCCESS
```

---

# Test manuel

Démarrer l'application.

### Windows

```powershell
.\mvnw.cmd quarkus:dev
```

### Linux

```bash
./mvnw quarkus:dev
```

---

## GET

```bash
curl http://localhost:3000/persons
```

---

## GET par identifiant

```bash
curl http://localhost:3000/persons/1
```

---

## POST

```bash
curl -X POST http://localhost:3000/persons \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"Clint\",\"lastName\":\"Eastwood\",\"cityId\":8}"
```

---

## PUT

```bash
curl -X PUT http://localhost:3000/persons/1 \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"Steven\",\"lastName\":\"Spielberg\",\"cityId\":10}"
```

---

## DELETE

```bash
curl -X DELETE http://localhost:3000/persons/1
```

---

# Principes clés

* `@ApplicationScoped` déclare un bean CDI Quarkus.
* Quarkus crée et gère automatiquement l'instance de `PersonService`.
* Le service est injecté dans `PersonController`.
* L'injection se fait par constructeur.
* Un constructeur unique ne nécessite pas `@Inject` avec Quarkus.
* `PersonController` ne stocke plus les données.
* `PersonController` gère les aspects HTTP.
* `PersonService` contient la logique applicative.
* `PersonService` ne dépend pas de HTTP.
* `PersonService` manipule directement `Person`.
* `PersonInputDto` reste limité aux entrées HTTP.
* `PersonOutputDto` reste limité aux sorties HTTP.
* `Optional<Person>` permet de représenter une recherche sans résultat.
* Le controller transforme une absence en erreur HTTP `404`.
* `boolean` permet au service d'indiquer si une suppression a réussi.
* `List.copyOf()` protège la liste interne du service.
* `CopyOnWriteArrayList` permet un accès concurrent sécurisé au stockage mémoire.
* `AtomicInteger` génère les identifiants.
* `@Valid` déclenche la validation du DTO.
* `NotFoundException` produit une réponse HTTP `404`.
* `@ResponseStatus(201)` produit une réponse HTTP `201`.
* `@ResponseStatus(204)` produit une réponse HTTP `204`.
* `@InjectMock` permet de remplacer `PersonService` par un mock dans les tests HTTP.
* Les données restent stockées temporairement en mémoire.
* Les données sont perdues au redémarrage de l'application.

---

# Architecture actuelle

```text
Client HTTP
    ↓
PersonInputDto
    ↓
PersonController
    ↓
PersonService
    ↓
List<Person>
    ↓
Person
    ↓
PersonController
    ↓
PersonOutputDto
    ↓
Client HTTP
```

On possède maintenant trois niveaux fonctionnels :

```text
DTO
Controller
Service
```

La prochaine étape sera l'ajout du `PersonRepository` :

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
PersonOutputDto
  ↓
HTTP
```

À cette étape, le stockage mémoire quittera `PersonService` pour être placé dans :

```text
PersonRepository
```

Le `PersonService` ne conservera alors plus directement aucune donnée.
