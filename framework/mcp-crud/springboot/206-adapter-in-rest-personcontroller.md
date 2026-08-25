# Adapter IN REST – PersonController

Sixième étape de l'architecture hexagonale pour le CRUD `Person`.

Objectif :

- exposer les cas d'usage `Person` en HTTP ;
- créer l'adapter entrant REST ;
- utiliser uniquement le port entrant `PersonUseCase` ;
- transformer les appels HTTP en appels applicatifs ;
- transformer `PersonNotFoundException` en erreur HTTP `404` ;
- conserver le domaine et l'application indépendants de REST ;
- assembler temporairement les composants avec Spring ;
- continuer à utiliser le stockage en mémoire.

---

## Architecture

À l'étape précédente :

```text
PersonUseCase
      ↑
PersonService
      ↓
PersonRepository
      ↑
InMemoryPersonRepository
```

Le CRUD fonctionne déjà en Java.

Il n'est simplement pas accessible depuis HTTP.

Nous ajoutons maintenant :

```text
PersonController
```

Architecture :

```text
HTTP
  ↓
PersonController
  ↓
PersonUseCase
  ↑
PersonService
  ↓
PersonRepository
  ↑
InMemoryPersonRepository
```

---

## Adapter entrant

`PersonController` est un adapter entrant.

Il reçoit des appels provenant de l'extérieur :

```text
HTTP
```

et les transforme en appels vers :

```text
PersonUseCase
```

Le Controller ne connaît pas :

```text
PersonService
InMemoryPersonRepository
List<Person> interne
AtomicInteger
```

Il connaît uniquement :

```text
PersonUseCase
```

---

## Package by feature

L'organisation reste basée sur la feature `person`.

```text
com.ganatan.starter
└── person
    ├── domain
    ├── application
    └── infrastructure
```

L'adapter REST appartient à :

```text
person.infrastructure.adapter.in.rest
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
│   ├── exception/
│   │   └── PersonNotFoundException.java
│   ├── port/
│   │   ├── in/
│   │   │   └── PersonUseCase.java
│   │   └── out/
│   │       └── PersonRepository.java
│   └── service/
│       └── PersonService.java
│
└── infrastructure/
    ├── adapter/
    │   ├── in/
    │   │   └── rest/
    │   │       ├── PersonController.java
    │   │       └── PersonExceptionHandler.java
    │   └── out/
    │       └── memory/
    │           └── InMemoryPersonRepository.java
    │
    └── config/
        └── PersonConfiguration.java
```

Tests :

```text
src/test/java/com/ganatan/starter/person/
├── domain/
│   └── PersonTests.java
├── application/
│   └── service/
│       └── PersonServiceTests.java
├── infrastructure/
│   └── adapter/
│       ├── in/
│       │   └── rest/
│       │       └── PersonControllerTests.java
│       └── out/
│           └── memory/
│               └── InMemoryPersonRepositoryTests.java
```

---

# Endpoints exposés

| Méthode | URL | Description | Statut succès |
|---|---|---|---|
| GET | `/persons` | Liste les personnes | `200 OK` |
| GET | `/persons/{id}` | Trouve une personne | `200 OK` |
| POST | `/persons` | Crée une personne | `201 CREATED` |
| PUT | `/persons/{id}` | Modifie une personne | `200 OK` |
| DELETE | `/persons/{id}` | Supprime une personne | `204 NO CONTENT` |

Base URL :

```text
http://localhost:3000/persons
```

---

# Code – PersonController.java

Chemin :

```text
src/main/java/com/ganatan/starter/person/infrastructure/adapter/in/rest/PersonController.java
```

Code :

```java
package com.ganatan.starter.person.infrastructure.adapter.in.rest;

import com.ganatan.starter.person.application.port.in.PersonUseCase;
import com.ganatan.starter.person.domain.Person;
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

@RestController
@RequestMapping("/persons")
public class PersonController {

  private final PersonUseCase personUseCase;

  public PersonController(
      PersonUseCase personUseCase
  ) {
    this.personUseCase = personUseCase;
  }

  @GetMapping
  public List<Person> getAll() {
    return personUseCase.getAll();
  }

  @GetMapping("/{id}")
  public Person getById(
      @PathVariable int id
  ) {
    return personUseCase.getById(
        id
    );
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Person create(
      @RequestBody Person person
  ) {
    return personUseCase.create(
        person
    );
  }

  @PutMapping("/{id}")
  public Person update(
      @PathVariable int id,
      @RequestBody Person person
  ) {
    return personUseCase.update(
        id,
        person
    );
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(
      @PathVariable int id
  ) {
    personUseCase.delete(
        id
    );
  }

}
```

---

# Dépendance du Controller

Le Controller contient :

```java
private final PersonUseCase personUseCase;
```

Il ne contient pas :

```java
private final PersonService personService;
```

et encore moins :

```java
private final InMemoryPersonRepository repository;
```

La dépendance est donc :

```text
PersonController
      ↓
PersonUseCase
```

Le Controller dépend du port entrant.

---

# Injection par constructeur

Le port entrant est fourni au Controller :

```java
public PersonController(
    PersonUseCase personUseCase
) {
  this.personUseCase = personUseCase;
}
```

Le Controller ne crée pas lui-même :

```text
PersonService
```

Il ne fait pas :

```java
new PersonService(...);
```

Spring sera responsable de fournir l'implémentation.

---

# GET /persons

Méthode :

```java
@GetMapping
public List<Person> getAll() {
  return personUseCase.getAll();
}
```

Flux :

```text
GET /persons
      ↓
PersonController
      ↓
PersonUseCase.getAll
      ↓
PersonService
      ↓
PersonRepository.findAll
      ↓
InMemoryPersonRepository
```

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

# GET /persons/{id}

Méthode :

```java
@GetMapping("/{id}")
public Person getById(
    @PathVariable int id
) {
  return personUseCase.getById(
      id
  );
}
```

Exemple :

```text
GET /persons/1
```

Flux :

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

# POST /persons

Méthode :

```java
@PostMapping
@ResponseStatus(HttpStatus.CREATED)
public Person create(
    @RequestBody Person person
) {
  return personUseCase.create(
      person
  );
}
```

Payload :

```json
{
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 8
}
```

Spring transforme le JSON en :

```text
Person
```

Le Controller transmet ensuite cette instance au port entrant.

Flux :

```text
JSON
 ↓
PersonController
 ↓
Person
 ↓
PersonUseCase.create
 ↓
PersonService
 ↓
PersonRepository.create
 ↓
InMemoryPersonRepository
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

Méthode :

```java
@PutMapping("/{id}")
public Person update(
    @PathVariable int id,
    @RequestBody Person person
) {
  return personUseCase.update(
      id,
      person
  );
}
```

Exemple :

```text
PUT /persons/1
```

Payload :

```json
{
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 10
}
```

Le Controller transmet :

```text
id = 1
```

et :

```text
Person
```

au cas d'usage.

Le cas d'usage conserve l'identifiant provenant de l'URL.

Réponse :

```json
{
  "id": 1,
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 10
}
```

---

# DELETE /persons/{id}

Méthode :

```java
@DeleteMapping("/{id}")
@ResponseStatus(HttpStatus.NO_CONTENT)
public void delete(
    @PathVariable int id
) {
  personUseCase.delete(
      id
  );
}
```

Exemple :

```text
DELETE /persons/1
```

Flux :

```text
DELETE /persons/1
        ↓
PersonController
        ↓
PersonUseCase.delete
        ↓
PersonService
        ↓
PersonRepository.deleteById
        ↓
InMemoryPersonRepository
```

Réponse :

```text
204 No Content
```

---

# Gestion des erreurs

La couche application utilise :

```text
PersonNotFoundException
```

Elle ne connaît pas HTTP.

Nous devons maintenant transformer cette exception applicative en réponse HTTP.

Cette transformation appartient à l'adapter REST.

---

# Code – PersonExceptionHandler.java

Chemin :

```text
src/main/java/com/ganatan/starter/person/infrastructure/adapter/in/rest/PersonExceptionHandler.java
```

Code :

```java
package com.ganatan.starter.person.infrastructure.adapter.in.rest;

import com.ganatan.starter.person.application.exception.PersonNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(
    assignableTypes = PersonController.class
)
public class PersonExceptionHandler {

  @ExceptionHandler(
      PersonNotFoundException.class
  )
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public void handlePersonNotFound() {
  }

}
```

---

# Transformation de l'erreur

La couche application produit :

```text
PersonNotFoundException
```

L'adapter REST transforme cette exception en :

```text
404 Not Found
```

Flux :

```text
PersonService
      ↓
PersonNotFoundException
      ↓
PersonExceptionHandler
      ↓
404 Not Found
```

La couche application ne connaît toujours pas :

```text
HttpStatus.NOT_FOUND
```

---

# Assemblage Spring

Nous avons volontairement conservé :

```text
PersonService
```

et :

```text
InMemoryPersonRepository
```

sans annotation Spring.

Il faut donc indiquer à Spring comment créer les objets.

Nous ajoutons une configuration technique.

---

# Code – PersonConfiguration.java

Chemin :

```text
src/main/java/com/ganatan/starter/person/infrastructure/config/PersonConfiguration.java
```

Code :

```java
package com.ganatan.starter.person.infrastructure.config;

import com.ganatan.starter.person.application.port.in.PersonUseCase;
import com.ganatan.starter.person.application.port.out.PersonRepository;
import com.ganatan.starter.person.application.service.PersonService;
import com.ganatan.starter.person.infrastructure.adapter.out.memory.InMemoryPersonRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PersonConfiguration {

  @Bean
  public PersonRepository personRepository() {
    return new InMemoryPersonRepository();
  }

  @Bean
  public PersonUseCase personUseCase(
      PersonRepository repository
  ) {
    return new PersonService(
        repository
    );
  }

}
```

---

# Création des objets

Spring crée d'abord :

```text
InMemoryPersonRepository
```

et l'expose comme :

```text
PersonRepository
```

Grâce à :

```java
@Bean
public PersonRepository personRepository() {
  return new InMemoryPersonRepository();
}
```

Puis Spring crée :

```text
PersonService
```

et l'expose comme :

```text
PersonUseCase
```

Grâce à :

```java
@Bean
public PersonUseCase personUseCase(
    PersonRepository repository
) {
  return new PersonService(
      repository
  );
}
```

Enfin Spring injecte :

```text
PersonUseCase
```

dans :

```text
PersonController
```

---

# Assemblage complet

```text
Spring
  │
  ├── crée InMemoryPersonRepository
  │
  ▼
PersonRepository
  │
  │ injecté dans
  ▼
PersonService
  │
  ▼
PersonUseCase
  │
  │ injecté dans
  ▼
PersonController
```

---

# Pourquoi utiliser une configuration Spring

Nous aurions pu écrire :

```java
@Service
public class PersonService {
}
```

et :

```java
@Repository
public class InMemoryPersonRepository {
}
```

Mais nous voulons conserver le cœur de l'application indépendant du framework.

Nous gardons donc :

```text
Person
PersonUseCase
PersonRepository
PersonService
```

sans annotation Spring.

La dépendance à Spring reste principalement dans :

```text
infrastructure
```

---

# Dépendances

Le Controller dépend de :

```text
Spring MVC
PersonUseCase
Person
```

C'est acceptable car le Controller appartient à l'infrastructure.

```text
Infrastructure
      ↓
Application
      ↓
Domain
```

---

# Direction des dépendances

```text
PersonController
      ↓
PersonUseCase
      ↑
PersonService
      ↓
PersonRepository
      ↑
InMemoryPersonRepository
```

La configuration connaît les implémentations :

```text
PersonConfiguration
      ├── PersonService
      └── InMemoryPersonRepository
```

C'est son rôle.

---

# Test – PersonControllerTests.java

Chemin :

```text
src/test/java/com/ganatan/starter/person/infrastructure/adapter/in/rest/PersonControllerTests.java
```

Code :

```java
package com.ganatan.starter.person.infrastructure.adapter.in.rest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.ganatan.starter.person.application.port.in.PersonUseCase;
import com.ganatan.starter.person.application.port.out.PersonRepository;
import com.ganatan.starter.person.application.service.PersonService;
import com.ganatan.starter.person.infrastructure.adapter.out.memory.InMemoryPersonRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class PersonControllerTests {

  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    PersonRepository repository =
        new InMemoryPersonRepository();

    PersonUseCase useCase =
        new PersonService(
            repository
        );

    PersonController controller =
        new PersonController(
            useCase
        );

    mockMvc =
        MockMvcBuilders
            .standaloneSetup(
                controller
            )
            .setControllerAdvice(
                new PersonExceptionHandler()
            )
            .build();
  }

  @Test
  void getAllShouldReturnSevenPersons()
      throws Exception {

    mockMvc.perform(
        get("/persons")
    )
    .andExpect(
        status().isOk()
    )
    .andExpect(
        jsonPath("$.length()")
            .value(7)
    )
    .andExpect(
        jsonPath("$[0].firstName")
            .value("Steven")
    )
    .andExpect(
        jsonPath("$[0].lastName")
            .value("Spielberg")
    );
  }

  @Test
  void getByIdShouldReturnPerson()
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
  void getByIdShouldReturnNotFound()
      throws Exception {

    mockMvc.perform(
        get("/persons/999")
    )
    .andExpect(
        status().isNotFound()
    );
  }

  @Test
  void createShouldReturnCreated()
      throws Exception {

    String payload = """
        {
          "id": 0,
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
            .content(
                payload
            )
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
  void updateShouldReturnUpdatedPerson()
      throws Exception {

    String payload = """
        {
          "id": 0,
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
            .content(
                payload
            )
    )
    .andExpect(
        status().isOk()
    )
    .andExpect(
        jsonPath("$.id")
            .value(1)
    )
    .andExpect(
        jsonPath("$.cityId")
            .value(10)
    );
  }

  @Test
  void updateShouldReturnNotFound()
      throws Exception {

    String payload = """
        {
          "id": 0,
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
            .content(
                payload
            )
    )
    .andExpect(
        status().isNotFound()
    );
  }

  @Test
  void deleteShouldReturnNoContent()
      throws Exception {

    mockMvc.perform(
        delete("/persons/1")
    )
    .andExpect(
        status().isNoContent()
    )
    .andExpect(
        content().string("")
    );
  }

  @Test
  void deleteShouldReturnNotFound()
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

# Exécution

Lancer l'application :

```bash
mvn spring-boot:run
```

L'application démarre sur :

```text
http://localhost:3000
```

Le CRUD est maintenant disponible sur :

```text
http://localhost:3000/persons
```

---

# Tests manuels avec curl

## Liste

```bash
curl http://localhost:3000/persons
```

---

## Recherche par identifiant

```bash
curl http://localhost:3000/persons/1
```

---

## Création

```bash
curl -X POST http://localhost:3000/persons \
  -H "Content-Type: application/json" \
  -d "{\"id\":0,\"firstName\":\"Clint\",\"lastName\":\"Eastwood\",\"cityId\":8}"
```

---

## Modification

```bash
curl -X PUT http://localhost:3000/persons/1 \
  -H "Content-Type: application/json" \
  -d "{\"id\":0,\"firstName\":\"Steven\",\"lastName\":\"Spielberg\",\"cityId\":10}"
```

---

## Suppression

```bash
curl -X DELETE http://localhost:3000/persons/1
```

---

# Flux GET

```text
Client HTTP
    ↓
GET /persons
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
    ↓
List<Person>
    ↑
PersonService
    ↑
PersonController
    ↑
JSON
```

---

# Flux POST

```text
JSON
 ↓
PersonController
 ↓
Person
 ↓
PersonUseCase
 ↓
PersonService
 ↓
PersonRepository
 ↓
InMemoryPersonRepository
 ↓
Person créée
 ↑
PersonService
 ↑
PersonController
 ↑
JSON
```

---

# Flux erreur

Exemple :

```text
GET /persons/999
```

Flux :

```text
PersonController
      ↓
PersonUseCase
      ↓
PersonService
      ↓
PersonRepository.findById
      ↓
Optional.empty
      ↓
PersonNotFoundException
      ↓
PersonExceptionHandler
      ↓
404 Not Found
```

---

# Avant

Dans le CRUD classique :

```text
PersonController
├── endpoints HTTP
├── modèle Person
├── logique CRUD
├── List<Person>
├── AtomicInteger
└── gestion des erreurs
```

Le Controller possédait toutes les responsabilités.

---

# Maintenant

```text
PersonController
      ↓
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

# Responsabilités

## PersonController

```text
HTTP
```

Il gère :

```text
GET
POST
PUT
DELETE
payload JSON
statuts HTTP
```

---

## PersonUseCase

```text
contrat entrant
```

Il définit :

```text
getAll
getById
create
update
delete
```

---

## PersonService

```text
logique applicative
```

Il implémente les cas d'usage.

---

## PersonRepository

```text
contrat sortant
```

Il définit les besoins de persistence.

---

## InMemoryPersonRepository

```text
stockage
```

Il utilise :

```text
List<Person>
AtomicInteger
```

---

## PersonExceptionHandler

```text
traduction application → HTTP
```

Il transforme :

```text
PersonNotFoundException
```

en :

```text
404 Not Found
```

---

## PersonConfiguration

```text
assemblage
```

Elle relie :

```text
PersonController
PersonUseCase
PersonService
PersonRepository
InMemoryPersonRepository
```

---

# Architecture complète actuelle

```text
                    HTTP
                     │
                     ▼
             PersonController
                     │
                     ▼
                Port IN
                     │
                     ▼
              PersonUseCase
                     ▲
                     │
              PersonService
                     │
                     ▼
                Port OUT
                     │
                     ▼
             PersonRepository
                     ▲
                     │
        InMemoryPersonRepository
                     │
                     ▼
                   Mémoire
```

---

# Vue hexagonale

```text
                    EXTÉRIEUR

                       HTTP
                        │
                        ▼
                Adapter IN REST
                        │
                        ▼
                   Port IN
                        │
                        ▼

              ┌─────────────────┐
              │                 │
              │   APPLICATION   │
              │                 │
              │  PersonService  │
              │                 │
              │     DOMAIN      │
              │      Person     │
              │                 │
              └─────────────────┘

                        │
                        ▼
                   Port OUT
                        │
                        ▼
              Adapter OUT Memory
                        │
                        ▼
                     Mémoire
```

---

# Dépendances

Les dépendances du code restent dirigées vers l'intérieur.

```text
PersonController
      ↓
PersonUseCase
      ↓
Person

PersonService
      ↓
PersonUseCase
PersonRepository
Person

InMemoryPersonRepository
      ↓
PersonRepository
Person
```

Le domaine reste :

```text
Person
```

sans dépendance Spring.

---

# État du projet

À cette étape, nous avons un CRUD REST complet fonctionnant en mémoire.

```text
HTTP
 ↓
Adapter IN
 ↓
Port IN
 ↓
Use Case
 ↓
Port OUT
 ↓
Adapter OUT
 ↓
Mémoire
```

Concrètement :

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

---

# Limite actuelle

Le Controller utilise directement :

```text
Person
```

comme :

```text
payload HTTP
```

et comme :

```text
réponse HTTP
```

Nous avons donc encore :

```text
HTTP
 ↓
Person
```

Le modèle du domaine est exposé directement à l'extérieur.

---

# Étape suivante

Nous allons isoler complètement HTTP du domaine avec :

```text
PersonInputDto
PersonOutputDto
```

Architecture suivante :

```text
JSON
 ↓
PersonInputDto
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
 ↓
Person
 ↓
PersonOutputDto
 ↓
JSON
```

Le domaine ne sera plus utilisé directement comme contrat HTTP.

Prochaine étape :

```text
009-dto.md
```

---

# Principes clés

- `PersonController` est un adapter entrant ;
- le Controller appartient à l'infrastructure ;
- le Controller dépend du port entrant `PersonUseCase` ;
- le Controller ne dépend pas de `PersonService` ;
- le Controller ne dépend pas de `PersonRepository` ;
- le Controller ne dépend pas de `InMemoryPersonRepository` ;
- `PersonService` reste indépendant de Spring ;
- `PersonRepository` reste indépendant de Spring Data ;
- `PersonNotFoundException` reste indépendant de HTTP ;
- `PersonExceptionHandler` traduit l'erreur applicative en erreur HTTP ;
- `PersonConfiguration` réalise l'assemblage Spring ;
- les sept réalisateurs sont toujours stockés en mémoire ;
- le CRUD REST est maintenant fonctionnel ;
- l'organisation reste en package by feature.

Architecture obtenue :

```text
HTTP
 ↓
PersonController
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
DTO
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