# Service – Person

Refactor du CRUD `Person` avec ajout d'une couche `Service`.

Objectifs :

- conserver `PersonInputDto` pour le payload entrant ;
- conserver `PersonOutputDto` pour la réponse JSON ;
- conserver `Person` comme modèle interne ;
- ajouter `PersonService` ;
- déplacer le stockage en mémoire dans le service ;
- alléger le controller ;
- aucun Repository pour le moment.

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
) {}
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

- la liste des personnes ;
- le compteur d'identifiants ;
- les données initiales ;
- la recherche ;
- la création ;
- la modification ;
- la suppression.

Le service ne connaît pas HTTP.

Il ne manipule donc pas :

```text
HttpStatus
ResponseEntity
ResponseStatusException
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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.stereotype.Service;

@Service
public class PersonService {

  private final AtomicInteger idCounter =
    new AtomicInteger(0);

  private final List<Person> personList =
    new ArrayList<>();

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
    return List.copyOf(personList);
  }

  public Optional<Person> getPersonById(
    int id
  ) {
    return personList.stream()
      .filter(person -> person.id() == id)
      .findFirst();
  }

  public Person createPerson(
    String firstName,
    String lastName,
    int cityId
  ) {
    int id = idCounter.incrementAndGet();

    Person person = new Person(
      id,
      firstName,
      lastName,
      cityId
    );

    personList.add(person);

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

    return Optional.of(updated);
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

# @Service

L'annotation :

```java
@Service
```

indique à Spring que `PersonService` est un composant de la couche Service.

Spring crée automatiquement une instance de :

```text
PersonService
```

et peut ensuite l'injecter dans :

```text
PersonController
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

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/persons")
public class PersonController {

  private final PersonService personService;

  public PersonController(
    PersonService personService
  ) {
    this.personService =
      personService;
  }

  @GetMapping
  public List<PersonOutputDto> getAllPersons() {
    return personService
      .getAllPersons()
      .stream()
      .map(PersonOutputDto::from)
      .toList();
  }

  @GetMapping("/{id}")
  public PersonOutputDto getPersonById(
    @PathVariable int id
  ) {
    Person person = personService
      .getPersonById(id)
      .orElseThrow(
        () -> new ResponseStatusException(
          HttpStatus.NOT_FOUND
        )
      );

    return PersonOutputDto.from(person);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public PersonOutputDto createPerson(
    @Valid @RequestBody PersonInputDto input
  ) {
    Person person = personService
      .createPerson(
        input.firstName(),
        input.lastName(),
        input.cityId()
      );

    return PersonOutputDto.from(person);
  }

  @PutMapping("/{id}")
  public PersonOutputDto updatePerson(
    @PathVariable int id,
    @Valid @RequestBody PersonInputDto input
  ) {
    Person person = personService
      .updatePerson(
        id,
        input.firstName(),
        input.lastName(),
        input.cityId()
      )
      .orElseThrow(
        () -> new ResponseStatusException(
          HttpStatus.NOT_FOUND
        )
      );

    return PersonOutputDto.from(person);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deletePerson(
    @PathVariable int id
  ) {
    boolean deleted =
      personService.deletePerson(id);

    if (!deleted) {
      throw new ResponseStatusException(
        HttpStatus.NOT_FOUND
      );
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

Spring détecte :

```java
@Service
public class PersonService
```

et :

```java
@RestController
public class PersonController
```

Puis réalise l'injection :

```text
PersonService
      ↓
PersonController
```

Il n'est pas nécessaire d'utiliser :

```java
@Autowired
```

lorsqu'une classe possède un seul constructeur.

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
404 NOT FOUND
```

avec :

```java
.orElseThrow(
  () -> new ResponseStatusException(
    HttpStatus.NOT_FOUND
  )
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
201 CREATED
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
404 NOT FOUND
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
204 NO CONTENT
```

ou :

```text
false
```

La personne n'existe pas.

Réponse HTTP :

```text
404 NOT FOUND
```

---

# Tests du Service

Les tests du service ne nécessitent pas Spring.

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

    assertNotNull(persons);

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

    assertTrue(deleted);

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

    assertFalse(deleted);
  }
}
```

---

# Tests du Controller

Les tests HTTP sont conservés.

La principale différence est que le controller nécessite maintenant :

```text
PersonService
```

Il faut donc créer le service avant le controller.

---

## Chemin

```text
src/test/java/com/ganatan/starter/api/person/PersonControllerTests.java
```

## Code

```java
package com.ganatan.starter.api.person;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.SpringValidatorAdapter;

class PersonControllerTests {

  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    Validator validator = Validation
      .buildDefaultValidatorFactory()
      .getValidator();

    PersonService service =
      new PersonService();

    PersonController controller =
      new PersonController(service);

    mockMvc = MockMvcBuilders
      .standaloneSetup(controller)
      .setValidator(
        new SpringValidatorAdapter(
          validator
        )
      )
      .build();
  }

  @Test
  void getAllPersons_shouldReturnSevenPersons()
    throws Exception {

    mockMvc.perform(
        get("/persons")
      )
      .andExpect(
        status().isOk()
      )
      .andExpect(
        jsonPath("$", hasSize(7))
      );
  }

  @Test
  void getPersonById_shouldReturnPerson()
    throws Exception {

    mockMvc.perform(
        get("/persons/1")
      )
      .andExpect(
        status().isOk()
      )
      .andExpect(
        jsonPath("$.id")
          .value(1)
      )
      .andExpect(
        jsonPath("$.firstName")
          .value("Steven")
      )
      .andExpect(
        jsonPath("$.lastName")
          .value("Spielberg")
      )
      .andExpect(
        jsonPath("$.cityId")
          .value(1)
      );
  }

  @Test
  void getPersonById_shouldReturnNotFound()
    throws Exception {

    mockMvc.perform(
        get("/persons/999")
      )
      .andExpect(
        status().isNotFound()
      );
  }

  @Test
  void createPerson_shouldCreatePerson()
    throws Exception {

    String payload = """
      {
        "firstName": "Clint",
        "lastName": "Eastwood",
        "cityId": 8
      }
      """;

    mockMvc.perform(
        post("/persons")
          .contentType(
            MediaType.APPLICATION_JSON
          )
          .content(payload)
      )
      .andExpect(
        status().isCreated()
      )
      .andExpect(
        jsonPath("$.id")
          .value(8)
      )
      .andExpect(
        jsonPath("$.firstName")
          .value("Clint")
      )
      .andExpect(
        jsonPath("$.lastName")
          .value("Eastwood")
      )
      .andExpect(
        jsonPath("$.cityId")
          .value(8)
      );
  }

  @Test
  void createPerson_shouldRejectInvalidPayload()
    throws Exception {

    String payload = """
      {
        "firstName": "",
        "lastName": "Eastwood",
        "cityId": 0
      }
      """;

    mockMvc.perform(
        post("/persons")
          .contentType(
            MediaType.APPLICATION_JSON
          )
          .content(payload)
      )
      .andExpect(
        status().isBadRequest()
      );
  }

  @Test
  void updatePerson_shouldUpdatePerson()
    throws Exception {

    String payload = """
      {
        "firstName": "Steven",
        "lastName": "Spielberg",
        "cityId": 10
      }
      """;

    mockMvc.perform(
        put("/persons/1")
          .contentType(
            MediaType.APPLICATION_JSON
          )
          .content(payload)
      )
      .andExpect(
        status().isOk()
      )
      .andExpect(
        jsonPath("$.id")
          .value(1)
      )
      .andExpect(
        jsonPath("$.firstName")
          .value("Steven")
      )
      .andExpect(
        jsonPath("$.lastName")
          .value("Spielberg")
      )
      .andExpect(
        jsonPath("$.cityId")
          .value(10)
      );
  }

  @Test
  void updatePerson_shouldReturnNotFound()
    throws Exception {

    String payload = """
      {
        "firstName": "Unknown",
        "lastName": "Person",
        "cityId": 1
      }
      """;

    mockMvc.perform(
        put("/persons/999")
          .contentType(
            MediaType.APPLICATION_JSON
          )
          .content(payload)
      )
      .andExpect(
        status().isNotFound()
      );
  }

  @Test
  void deletePerson_shouldDeletePerson()
    throws Exception {

    mockMvc.perform(
        delete("/persons/1")
      )
      .andExpect(
        status().isNoContent()
      );

    mockMvc.perform(
        get("/persons/1")
      )
      .andExpect(
        status().isNotFound()
      );
  }

  @Test
  void deletePerson_shouldReturnNotFound()
    throws Exception {

    mockMvc.perform(
        delete("/persons/999")
      )
      .andExpect(
        status().isNotFound()
      );
  }
}
```

---

# Tests

Exécuter tous les tests :

```bash
mvn test
```

Ou compiler, tester et créer l'artefact :

```bash
mvn clean install
```

Résultat attendu :

```text
BUILD SUCCESS
```

---

# Test manuel

Démarrer l'application :

```bash
mvn spring-boot:run
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

- `@Service` déclare un composant de la couche Service.
- Spring crée automatiquement l'instance de `PersonService`.
- Le service est injecté dans `PersonController`.
- L'injection se fait par constructeur.
- `PersonController` ne stocke plus les données.
- `PersonController` gère les aspects HTTP.
- `PersonService` contient la logique applicative.
- `PersonService` ne dépend pas de HTTP.
- `PersonService` manipule directement `Person`.
- `PersonInputDto` reste limité aux entrées HTTP.
- `PersonOutputDto` reste limité aux sorties HTTP.
- `Optional<Person>` permet de représenter une recherche sans résultat.
- Le controller transforme une absence en erreur HTTP `404`.
- `boolean` permet au service d'indiquer si une suppression a réussi.
- `List.copyOf()` protège la liste interne du service.
- Les données restent stockées temporairement en mémoire.
- Les données sont perdues au redémarrage de l'application.

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