# Repository – Person

Refactor du CRUD `Person` avec ajout d’un `PersonRepository`.

Le `PersonRepository` devient responsable :

* du stockage des personnes ;
* de l’accès aux données ;
* de la création ;
* de la modification ;
* de la suppression ;
* de la génération des identifiants.

Le `PersonService` devient responsable :

* de la logique applicative ;
* de l’appel au repository.

Le `PersonController` reste responsable :

* des routes HTTP ;
* de la lecture des paramètres HTTP ;
* de la validation du `PersonInputDto` ;
* de l’appel au service ;
* du mapping vers `PersonOutputDto` ;
* des codes HTTP retournés.

Il n’y a toujours aucune base de données.

Les données restent stockées en mémoire dans le repository.

---

# Architecture

```text
Payload JSON
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
PersonRepository
    ↓
PersonService
    ↓
PersonController
    ↓
PersonOutputDto
    ↓
Réponse JSON
```

---

# Responsabilités

```text
PersonInputDto
    ↓
Validation des données entrantes

PersonController
    ↓
Gestion HTTP

PersonService
    ↓
Logique applicative

PersonRepository
    ↓
Accès aux données
Stockage en mémoire

Person
    ↓
Modèle interne

PersonOutputDto
    ↓
Format de sortie JSON
```

---

# Structure

Tous les fichiers liés à `Person` utilisent le package :

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

Structure :

```text
src/
├── main/
│   └── java/
│       └── com/
│           └── ganatan/
│               └── starter/
│                   ├── StarterApplication.java
│                   └── api/
│                       ├── person/
│                       │   ├── Person.java
│                       │   ├── PersonInputDto.java
│                       │   ├── PersonOutputDto.java
│                       │   ├── PersonRepository.java
│                       │   ├── PersonService.java
│                       │   └── PersonController.java
│                       └── root/
│                           └── RootController.java
│
└── test/
    └── java/
        └── com/
            └── ganatan/
                └── starter/
                    └── api/
                        └── person/
                            ├── PersonRepositoryTests.java
                            ├── PersonServiceTests.java
                            └── PersonControllerTests.java
```

---

# Dépendances

Aucune nouvelle dépendance n’est nécessaire.

Le repository utilise uniquement :

```text
java.util.ArrayList
java.util.List
java.util.Optional
java.util.concurrent.atomic.AtomicInteger
```

et l’annotation Spring :

```java
@Repository
```

---

# Person

Le modèle `Person` ne change pas.

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

Le modèle interne reste indépendant de :

```text
Spring MVC
HTTP
DTO
Service
Repository
```

---

# PersonInputDto

Le DTO d’entrée ne change pas.

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

Le DTO de sortie ne change pas.

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

# PersonRepository

Le `PersonRepository` contient maintenant toutes les données.

Le stockage qui se trouvait auparavant dans le service est déplacé dans le repository.

## Chemin

```text
src/main/java/com/ganatan/starter/api/person/PersonRepository.java
```

## Code

```java
package com.ganatan.starter.api.person;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.stereotype.Repository;

@Repository
public class PersonRepository {

  private final AtomicInteger idCounter =
    new AtomicInteger(7);

  private final List<Person> personList =
    new ArrayList<>();

  public PersonRepository() {
    personList.add(
      new Person(
        1,
        "Steven",
        "Spielberg",
        1
      )
    );

    personList.add(
      new Person(
        2,
        "Martin",
        "Scorsese",
        2
      )
    );

    personList.add(
      new Person(
        3,
        "Francis",
        "Ford Coppola",
        3
      )
    );

    personList.add(
      new Person(
        4,
        "George",
        "Lucas",
        4
      )
    );

    personList.add(
      new Person(
        5,
        "Quentin",
        "Tarantino",
        5
      )
    );

    personList.add(
      new Person(
        6,
        "David",
        "Fincher",
        6
      )
    );

    personList.add(
      new Person(
        7,
        "Spike",
        "Lee",
        7
      )
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
    return personList.stream()
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

    personList.add(person);

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

    return Optional.of(updated);
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
}
```

---

# @Repository

L’annotation :

```java
@Repository
```

indique à Spring que la classe appartient à la couche d’accès aux données.

Spring crée automatiquement une instance de :

```text
PersonRepository
```

qui peut être injectée dans :

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

---

# Rôle du Repository

Le repository représente la couche d’accès aux données.

Le reste de l’application ne doit plus savoir comment les personnes sont stockées.

Aujourd’hui :

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

Le service continuera à utiliser :

```text
PersonRepository
```

sans manipuler directement le mécanisme de stockage.

---

# Données initiales

Le repository contient les sept personnes initiales :

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

# Génération des identifiants

La génération des identifiants appartient maintenant au repository.

```java
private final AtomicInteger idCounter =
  new AtomicInteger(7);
```

La valeur initiale est :

```text
7
```

Lors d’une création :

```java
int id =
  idCounter.incrementAndGet();
```

Le premier nouvel identifiant sera donc :

```text
8
```

---

# Lecture de toutes les personnes

La méthode :

```java
public List<Person> findAll()
```

retourne :

```text
List<Person>
```

Le repository travaille uniquement avec le modèle interne.

Il ne retourne jamais :

```text
PersonOutputDto
```

Implémentation :

```java
public List<Person> findAll() {
  return List.copyOf(
    personList
  );
}
```

`List.copyOf()` empêche le code extérieur de modifier directement la liste interne.

---

# Lecture par identifiant

La méthode :

```java
public Optional<Person> findById(
  int id
)
```

retourne :

```text
Optional<Person>
```

si la personne existe.

Sinon :

```text
Optional.empty()
```

Le repository ne connaît pas :

```text
404 NOT FOUND
```

Il indique uniquement si une donnée existe ou non.

---

# Création

La méthode :

```java
public Person create(
  String firstName,
  String lastName,
  int cityId
)
```

effectue :

```text
génération de l'identifiant
    ↓
création du Person
    ↓
stockage dans List<Person>
    ↓
retour du Person
```

---

# Modification

La méthode :

```java
public Optional<Person> update(
  int id,
  String firstName,
  String lastName,
  int cityId
)
```

retourne :

```text
Optional<Person>
```

contenant la personne modifiée si elle existe.

Sinon :

```text
Optional.empty()
```

---

# Suppression

La méthode :

```java
public boolean delete(
  int id
)
```

retourne :

```text
true
```

si la personne a été supprimée.

Sinon :

```text
false
```

---

# PersonService

Le service ne contient maintenant plus aucune donnée.

Il contient uniquement :

```text
PersonRepository
```

## Chemin

```text
src/main/java/com/ganatan/starter/api/person/PersonService.java
```

## Code

```java
package com.ganatan.starter.api.person;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class PersonService {

  private final PersonRepository personRepository;

  public PersonService(
    PersonRepository personRepository
  ) {
    this.personRepository =
      personRepository;
  }

  public List<Person> getAllPersons() {
    return personRepository.findAll();
  }

  public Optional<Person> getPersonById(
    int id
  ) {
    return personRepository.findById(id);
  }

  public Person createPerson(
    String firstName,
    String lastName,
    int cityId
  ) {
    return personRepository.create(
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
    return personRepository.update(
      id,
      firstName,
      lastName,
      cityId
    );
  }

  public boolean deletePerson(
    int id
  ) {
    return personRepository.delete(id);
  }
}
```

---

# Évolution du Service

Avant :

```text
PersonService
├── idCounter
└── personList
```

Maintenant :

```text
PersonService
└── PersonRepository
```

Le service ne connaît plus :

```text
ArrayList
AtomicInteger
List interne
```

Il demande simplement au repository :

```text
findAll
findById
create
update
delete
```

---

# Injection du Repository

Le service possède :

```java
private final PersonRepository personRepository;
```

Le repository est injecté dans le constructeur :

```java
public PersonService(
  PersonRepository personRepository
) {
  this.personRepository =
    personRepository;
}
```

Spring détecte :

```java
@Repository
public class PersonRepository
```

et :

```java
@Service
public class PersonService
```

Spring construit alors automatiquement :

```text
PersonRepository
       ↓
PersonService
```

---

# Pourquoi conserver le Service ?

Pour le moment, le service délègue presque directement les appels au repository.

C’est volontaire.

Aujourd’hui :

```text
Controller
    ↓
Service
    ↓
Repository
```

Plus tard, le service pourra contenir des règles métier.

Par exemple :

```text
vérification d'une ville
contrôle métier
calcul
autorisation
appel de plusieurs repositories
transaction
```

Ces règles ne devront pas être placées dans :

```text
PersonController
```

ni dans :

```text
PersonRepository
```

---

# PersonController

Le controller continue de dépendre uniquement du service.

Il ne connaît pas directement le repository.

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

# Construction des couches

Spring construit maintenant automatiquement les différentes couches.

Le repository :

```java
@Repository
public class PersonRepository
```

est injecté dans :

```java
@Service
public class PersonService
```

qui est lui-même injecté dans :

```java
@RestController
public class PersonController
```

Cela produit :

```text
PersonRepository
    ↓
PersonService
    ↓
PersonController
```

Contrairement à une construction manuelle :

```java
PersonRepository repository =
  new PersonRepository();

PersonService service =
  new PersonService(repository);

PersonController controller =
  new PersonController(service);
```

Spring réalise automatiquement ce travail au démarrage de l’application.

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

Les dépendances sont :

```text
PersonController
       ↓
PersonService
       ↓
PersonRepository
       ↓
Person
```

Le sens inverse n’existe pas.

`PersonRepository` ne connaît pas :

```text
PersonService
PersonController
PersonInputDto
PersonOutputDto
HttpStatus
ResponseStatusException
Spring MVC
```

---

# Tests du Repository

Le repository peut maintenant être testé indépendamment du service et du controller.

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

    assertTrue(deleted);

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

    assertFalse(deleted);
  }
}
```

---

# Tests du Service

Le service utilise maintenant un repository.

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
      new PersonService(repository);
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

    assertTrue(deleted);

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

    assertFalse(deleted);
  }
}
```

---

# Tests du Controller

Les tests HTTP restent identiques dans leur principe.

Ils testent maintenant toute la chaîne :

```text
HTTP
    ↓
PersonController
    ↓
PersonService
    ↓
PersonRepository
    ↓
List<Person>
```

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

    PersonRepository repository =
      new PersonRepository();

    PersonService service =
      new PersonService(repository);

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
  void getPersonById_shouldReturnPersonOutput()
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
  void createPerson_shouldReturnCreatedPerson()
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
  void updatePerson_shouldReturnUpdatedPerson()
    throws Exception {

    String payload = """
      {
        "firstName": "Steven",
        "lastName": "Spielberg Updated",
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
          .value("Spielberg Updated")
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
  void deletePerson_shouldReturnNoContent()
    throws Exception {

    mockMvc.perform(
        delete("/persons/1")
      )
      .andExpect(
        status().isNoContent()
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
}
```

---

# Vérification

Compiler le projet :

```bash
mvn compile
```

Lancer tous les tests :

```bash
mvn test
```

Compiler, tester et packager :

```bash
mvn clean install
```

Lancer l’application :

```bash
mvn spring-boot:run
```

Ou :

```bash
java -jar target/springboot-starter-1.0.0.jar
```

---

# Endpoints

Les endpoints ne changent pas.

```text
GET    /persons
GET    /persons/{id}
POST   /persons
PUT    /persons/{id}
DELETE /persons/{id}
```

Base URL :

```text
http://localhost:3000/persons
```

---

# Exemple GET

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

---

# Exemple POST

```text
POST /persons
```

Payload :

```json
{
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 8
}
```

Réponse :

```text
201 CREATED
```

```json
{
  "id": 8,
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 8
}
```

---

# Exemple PUT

```text
PUT /persons/1
```

Payload :

```json
{
  "firstName": "Steven",
  "lastName": "Spielberg Updated",
  "cityId": 10
}
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

# Exemple DELETE

```text
DELETE /persons/1
```

Réponse :

```text
204 NO CONTENT
```

---

# Principes clés

* `PersonController` gère la couche HTTP.
* `PersonService` gère la logique applicative.
* `PersonRepository` gère l’accès aux données.
* `@Repository` déclare un composant Spring d’accès aux données.
* `PersonRepository` contient temporairement les données en mémoire.
* `PersonRepository` manipule des `Person`.
* `PersonRepository` ne connaît pas les DTO.
* `PersonRepository` ne connaît pas les codes HTTP.
* `PersonRepository` ne connaît pas `PersonController`.
* `PersonRepository` ne connaît pas `PersonService`.
* `PersonService` ne contient plus directement `List<Person>`.
* `PersonService` ne contient plus `AtomicInteger`.
* `PersonService` dépend du `PersonRepository`.
* `PersonController` dépend du `PersonService`.
* `PersonController` ne dépend pas directement du repository.
* `PersonInputDto` contrôle les données entrantes.
* `PersonOutputDto` contrôle les données sortantes.
* `Person` reste le modèle interne.
* `ArrayList<Person>` simule temporairement la persistance.
* `AtomicInteger` simule temporairement la génération des identifiants.
* `Optional<Person>` représente une donnée éventuellement absente.
* Le repository ne transforme jamais une absence en erreur HTTP.
* Le controller transforme l’absence en `404 NOT FOUND`.
* Chaque couche peut maintenant être testée séparément.

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
List<Person>
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

La donnée en dur est maintenant complètement isolée dans :

```text
PersonRepository
```

La prochaine étape naturelle sera de remplacer :

```text
List<Person>
```

par une vraie base de données :

```text
PostgreSQL
```

sans modifier l’architecture générale :

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
PostgreSQL
```
