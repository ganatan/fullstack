# CRUD REST – PersonController

Implémentation simple :

- un seul fichier ;
- aucun Service ;
- aucun Repository ;
- stockage en mémoire.

---

## Structure

```text
com.ganatan.starter.api.person
├── PersonController.java
└── PersonControllerTests.java
```

---

## Endpoints exposés

| Méthode | URL           | Description               | Statut succès  |
|---------|---------------|---------------------------|----------------|
| GET     | /persons      | Liste les personnes       | 200 OK         |
| GET     | /persons/{id} | Trouve par identifiant    | 200 OK         |
| POST    | /persons      | Crée une personne         | 201 CREATED    |
| PUT     | /persons/{id} | Modifie une personne      | 200 OK         |
| DELETE  | /persons/{id} | Supprime une personne     | 204 NO CONTENT |

Base URL :

```text
http://localhost:3000/persons
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

- `id` : identifiant généré automatiquement ;
- `firstName` : prénom de la personne ;
- `lastName` : nom de la personne ;
- `cityId` : identifiant de la ville associée.

---

## Principe

- Le controller expose les endpoints REST.
- Les données sont stockées en mémoire dans une `List`.
- Un identifiant est généré automatiquement avec `AtomicInteger`.
- Le modèle `Person` est un `record` défini dans le controller.
- Sept réalisateurs américains sont chargés au démarrage.
- `@ApplicationScoped` conserve une seule instance du controller.
- `CopyOnWriteArrayList` permet un accès concurrent sécurisé à la liste.
- Aucune logique externe.
- Les données sont perdues au redémarrage de l’application.

---

## Données initiales

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

## Code – PersonController.java

Chemin :

```text
src/main/java/com/ganatan/starter/api/person/PersonController.java
```

```java
package com.ganatan.starter.api.person;

import jakarta.enterprise.context.ApplicationScoped;
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
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;
import org.jboss.resteasy.reactive.ResponseStatus;

@Path("/persons")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PersonController {

  private final AtomicInteger idCounter = new AtomicInteger(0);
  private final List<Person> personList = new CopyOnWriteArrayList<>();

  public record Person(
    int id,
    String firstName,
    String lastName,
    int cityId
  ) {}

  public PersonController() {
    createPerson(new Person(0, "Steven", "Spielberg", 1));
    createPerson(new Person(0, "Martin", "Scorsese", 2));
    createPerson(new Person(0, "Francis", "Ford Coppola", 3));
    createPerson(new Person(0, "George", "Lucas", 4));
    createPerson(new Person(0, "Quentin", "Tarantino", 5));
    createPerson(new Person(0, "David", "Fincher", 6));
    createPerson(new Person(0, "Spike", "Lee", 7));
  }

  @GET
  public List<Person> getAllPersons() {
    return personList;
  }

  @GET
  @Path("/{id}")
  public Person getPersonById(@PathParam("id") int id) {
    return findPersonById(id)
      .orElseThrow(NotFoundException::new);
  }

  @POST
  @ResponseStatus(201)
  public Person createPerson(Person newPerson) {
    int newId = idCounter.incrementAndGet();

    Person created = new Person(
      newId,
      newPerson.firstName(),
      newPerson.lastName(),
      newPerson.cityId()
    );

    personList.add(created);

    return created;
  }

  @PUT
  @Path("/{id}")
  public Person updatePerson(
    @PathParam("id") int id,
    Person modified
  ) {
    Person existing = findPersonById(id)
      .orElseThrow(NotFoundException::new);

    Person updated = new Person(
      existing.id(),
      modified.firstName(),
      modified.lastName(),
      modified.cityId()
    );

    personList.set(personList.indexOf(existing), updated);

    return updated;
  }

  @DELETE
  @Path("/{id}")
  @ResponseStatus(204)
  public void deletePerson(@PathParam("id") int id) {
    Person existing = findPersonById(id)
      .orElseThrow(NotFoundException::new);

    personList.remove(existing);
  }

  private Optional<Person> findPersonById(int id) {
    return personList.stream()
      .filter(person -> person.id() == id)
      .findFirst();
  }
}
```

---

## Payloads HTTP

### GET /persons

Aucun payload en entrée.

Réponse :

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
  }
]
```

---

### GET /persons/{id}

Exemple :

```text
GET /persons/1
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

Personne inexistante :

```text
404 Not Found
```

---

### POST /persons

Payload en entrée :

```json
{
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 8
}
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

Statut HTTP :

```text
201 Created
```

L’identifiant éventuellement envoyé par le client est ignoré.

---

### PUT /persons/{id}

Exemple :

```text
PUT /persons/1
```

Payload en entrée :

```json
{
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 10
}
```

Réponse :

```json
{
  "id": 1,
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 10
}
```

L’identifiant présent dans l’URL est conservé.

---

### DELETE /persons/{id}

Exemple :

```text
DELETE /persons/1
```

Réponse :

```text
204 No Content
```

---

## Test – PersonControllerTests.java

Chemin :

```text
src/test/java/com/ganatan/starter/api/person/PersonControllerTests.java
```

```java
package com.ganatan.starter.api.person;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import jakarta.ws.rs.NotFoundException;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PersonControllerTests {

  private PersonController controller;

  @BeforeEach
  void setUp() {
    controller = new PersonController();
  }

  @Test
  void getAllPersons_shouldReturnSevenPersons() {
    List<PersonController.Person> result = controller.getAllPersons();

    assertNotNull(result);
    assertEquals(7, result.size());
  }

  @Test
  void getAllPersons_shouldContainStevenSpielberg() {
    List<PersonController.Person> result = controller.getAllPersons();

    assertTrue(
      result.stream().anyMatch(
        person ->
          person.firstName().equals("Steven")
            && person.lastName().equals("Spielberg")
      )
    );
  }

  @Test
  void getAllPersons_shouldHaveSequentialIds() {
    List<PersonController.Person> result = controller.getAllPersons();

    for (int index = 0; index < result.size(); index++) {
      assertEquals(index + 1, result.get(index).id());
    }
  }

  @Test
  void getPersonById_shouldReturnPerson_whenIdExists() {
    PersonController.Person result = controller.getPersonById(1);

    assertNotNull(result);
    assertEquals(1, result.id());
    assertEquals("Steven", result.firstName());
    assertEquals("Spielberg", result.lastName());
    assertEquals(1, result.cityId());
  }

  @Test
  void getPersonById_shouldThrowNotFound_whenIdDoesNotExist() {
    NotFoundException exception = assertThrows(
      NotFoundException.class,
      () -> controller.getPersonById(999)
    );

    assertEquals(404, exception.getResponse().getStatus());
  }

  @Test
  void createPerson_shouldAddPerson_andReturnGeneratedId() {
    PersonController.Person input = new PersonController.Person(
      0,
      "Clint",
      "Eastwood",
      8
    );

    PersonController.Person result = controller.createPerson(input);

    assertNotNull(result);
    assertEquals(8, result.id());
    assertEquals("Clint", result.firstName());
    assertEquals("Eastwood", result.lastName());
    assertEquals(8, result.cityId());
  }

  @Test
  void createPerson_shouldIncreaseSizeByOne() {
    int before = controller.getAllPersons().size();

    controller.createPerson(
      new PersonController.Person(
        0,
        "Clint",
        "Eastwood",
        8
      )
    );

    assertEquals(
      before + 1,
      controller.getAllPersons().size()
    );
  }

  @Test
  void createPerson_shouldIgnoreInputId_andGenerateNewOne() {
    PersonController.Person input = new PersonController.Person(
      999,
      "Clint",
      "Eastwood",
      8
    );

    PersonController.Person result = controller.createPerson(input);

    assertNotEquals(999, result.id());
    assertEquals(8, result.id());
  }

  @Test
  void updatePerson_shouldModifyPerson_whenIdExists() {
    PersonController.Person modified = new PersonController.Person(
      0,
      "Steven",
      "Spielberg",
      10
    );

    PersonController.Person result = controller.updatePerson(1, modified);

    assertEquals(1, result.id());
    assertEquals("Steven", result.firstName());
    assertEquals("Spielberg", result.lastName());
    assertEquals(10, result.cityId());
  }

  @Test
  void updatePerson_shouldModifyFirstNameAndLastName() {
    PersonController.Person modified = new PersonController.Person(
      0,
      "Steve",
      "Spielberg Junior",
      1
    );

    PersonController.Person result = controller.updatePerson(1, modified);

    assertEquals("Steve", result.firstName());
    assertEquals("Spielberg Junior", result.lastName());
  }

  @Test
  void updatePerson_shouldPreserveId_afterUpdate() {
    PersonController.Person modified = new PersonController.Person(
      999,
      "Steven",
      "Spielberg",
      10
    );

    PersonController.Person result = controller.updatePerson(1, modified);

    assertEquals(1, result.id());
  }

  @Test
  void updatePerson_shouldReflectChange_inGetAll() {
    controller.updatePerson(
      1,
      new PersonController.Person(
        0,
        "Steven",
        "Spielberg",
        10
      )
    );

    PersonController.Person found = controller.getPersonById(1);

    assertEquals(10, found.cityId());
  }

  @Test
  void updatePerson_shouldThrowNotFound_whenIdDoesNotExist() {
    NotFoundException exception = assertThrows(
      NotFoundException.class,
      () -> controller.updatePerson(
        999,
        new PersonController.Person(
          0,
          "Unknown",
          "Person",
          1
        )
      )
    );

    assertEquals(404, exception.getResponse().getStatus());
  }

  @Test
  void deletePerson_shouldRemovePerson_whenIdExists() {
    int before = controller.getAllPersons().size();

    controller.deletePerson(1);

    assertEquals(
      before - 1,
      controller.getAllPersons().size()
    );
  }

  @Test
  void deletePerson_shouldMakeIdUnavailable_afterDeletion() {
    controller.deletePerson(1);

    NotFoundException exception = assertThrows(
      NotFoundException.class,
      () -> controller.getPersonById(1)
    );

    assertEquals(404, exception.getResponse().getStatus());
  }

  @Test
  void deletePerson_shouldRemoveCorrectPerson() {
    controller.deletePerson(1);

    boolean exists = controller.getAllPersons()
      .stream()
      .anyMatch(person -> person.id() == 1);

    assertFalse(exists);
  }

  @Test
  void deletePerson_shouldThrowNotFound_whenIdDoesNotExist() {
    NotFoundException exception = assertThrows(
      NotFoundException.class,
      () -> controller.deletePerson(999)
    );

    assertEquals(404, exception.getResponse().getStatus());
  }

  @Test
  void personRecord_shouldExposeProperties() {
    PersonController.Person person = new PersonController.Person(
      42,
      "John",
      "Doe",
      5
    );

    assertEquals(42, person.id());
    assertEquals("John", person.firstName());
    assertEquals("Doe", person.lastName());
    assertEquals(5, person.cityId());
  }

  @Test
  void personRecord_shouldImplementEquality() {
    PersonController.Person person1 = new PersonController.Person(
      1,
      "Steven",
      "Spielberg",
      1
    );

    PersonController.Person person2 = new PersonController.Person(
      1,
      "Steven",
      "Spielberg",
      1
    );

    assertEquals(person1, person2);
  }
}
```

---

## Exécution des tests

### Windows

```powershell
.\mvnw.cmd test
```

### Linux

```bash
./mvnw test
```

---

## Test manuel avec curl

### Liste des personnes

```bash
curl http://localhost:3000/persons
```

---

### Personne par identifiant

```bash
curl http://localhost:3000/persons/1
```

---

### Création

```bash
curl -X POST http://localhost:3000/persons \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"Clint\",\"lastName\":\"Eastwood\",\"cityId\":8}"
```

---

### Modification

```bash
curl -X PUT http://localhost:3000/persons/1 \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"Steven\",\"lastName\":\"Spielberg\",\"cityId\":10}"
```

---

### Suppression

```bash
curl -X DELETE http://localhost:3000/persons/1
```

---

## Principes clés

- `@Path("/persons")` définit la base URL du controller.
- `@GET` expose une route HTTP `GET`.
- `@POST` expose une route HTTP `POST`.
- `@PUT` expose une route HTTP `PUT`.
- `@DELETE` expose une route HTTP `DELETE`.
- `@Path("/{id}")` définit un paramètre dans l’URL.
- `@PathParam("id")` récupère l’identifiant présent dans l’URL.
- `@Consumes(MediaType.APPLICATION_JSON)` accepte les payloads JSON.
- `@Produces(MediaType.APPLICATION_JSON)` retourne des réponses JSON.
- `@ResponseStatus(201)` retourne le statut HTTP `201`.
- `@ResponseStatus(204)` retourne le statut HTTP `204`.
- `NotFoundException` retourne le statut HTTP `404`.
- `@ApplicationScoped` conserve une instance unique du controller.
- `AtomicInteger` génère des identifiants uniques en mémoire.
- `CopyOnWriteArrayList` sécurise les accès concurrents à la liste.
- `record` crée un modèle immutable.
- `Optional` représente une personne éventuellement absente.
- `stream().filter().findFirst()` recherche une personne par identifiant.
- Le stockage en mémoire est réinitialisé à chaque redémarrage.