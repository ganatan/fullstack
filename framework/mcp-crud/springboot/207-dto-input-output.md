# DTO Input / Output – Adapter REST

Septième étape de l'architecture hexagonale pour le CRUD `Person`.

Objectif :

- ne plus exposer directement le domaine `Person` en HTTP ;
- créer un DTO d'entrée ;
- créer un DTO de sortie ;
- conserver `Person` comme modèle interne ;
- effectuer la conversion dans l'adapter REST ;
- conserver les ports et les cas d'usage indépendants de HTTP ;
- continuer à utiliser le stockage en mémoire.

---

## Architecture

À l'étape précédente :

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
```

Le problème est que :

```text
Person
```

est utilisé directement comme contrat HTTP.

Le domaine est donc directement exposé à l'extérieur.

Nous allons maintenant introduire :

```text
PersonInputDto
PersonOutputDto
```

---

## Nouvelle architecture

```text
JSON
 ↓
PersonInputDto
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
Person
 ↓
PersonController
 ↓
PersonOutputDto
 ↓
JSON
```

Les DTO appartiennent uniquement à l'adapter REST.

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

Les DTO étant spécifiques à HTTP, ils sont placés dans :

```text
person.infrastructure.adapter.in.rest.dto
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
    │   │       ├── dto/
    │   │       │   ├── PersonInputDto.java
    │   │       │   └── PersonOutputDto.java
    │   │       ├── PersonController.java
    │   │       └── PersonExceptionHandler.java
    │   │
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
└── infrastructure/
    └── adapter/
        ├── in/
        │   └── rest/
        │       └── PersonControllerTests.java
        └── out/
            └── memory/
                └── InMemoryPersonRepositoryTests.java
```

---

# PersonInputDto

`PersonInputDto` représente les données reçues depuis HTTP.

Pour créer ou modifier une personne, le client fournit :

```json
{
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 8
}
```

L'identifiant n'est pas présent.

Il est géré par l'application et le système de persistence.

---

## Code – PersonInputDto.java

Chemin :

```text
src/main/java/com/ganatan/starter/person/infrastructure/adapter/in/rest/dto/PersonInputDto.java
```

Code :

```java
package com.ganatan.starter.person.infrastructure.adapter.in.rest.dto;

import com.ganatan.starter.person.domain.Person;

public record PersonInputDto(
    String firstName,
    String lastName,
    int cityId
) {

  public Person toDomain() {
    return new Person(
        0,
        firstName,
        lastName,
        cityId
    );
  }

}
```

---

## Conversion vers le domaine

Le DTO reçoit :

```json
{
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 8
}
```

Puis :

```java
input.toDomain();
```

produit :

```java
new Person(
    0,
    "Clint",
    "Eastwood",
    8
);
```

Le DTO connaît le domaine :

```text
PersonInputDto
      ↓
    Person
```

C'est autorisé.

L'adapter extérieur peut dépendre du cœur.

---

# PersonOutputDto

`PersonOutputDto` représente les données retournées par HTTP.

Exemple :

```json
{
  "id": 1,
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 1
}
```

---

## Code – PersonOutputDto.java

Chemin :

```text
src/main/java/com/ganatan/starter/person/infrastructure/adapter/in/rest/dto/PersonOutputDto.java
```

Code :

```java
package com.ganatan.starter.person.infrastructure.adapter.in.rest.dto;

import com.ganatan.starter.person.domain.Person;

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

## Conversion depuis le domaine

Une instance :

```java
Person person = new Person(
    1,
    "Steven",
    "Spielberg",
    1
);
```

est transformée avec :

```java
PersonOutputDto.from(
    person
);
```

Résultat :

```json
{
  "id": 1,
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 1
}
```

---

# Refactor – PersonController

Le Controller ne reçoit plus directement :

```text
Person
```

Il reçoit maintenant :

```text
PersonInputDto
```

et retourne :

```text
PersonOutputDto
```

---

## Code – PersonController.java

Chemin :

```text
src/main/java/com/ganatan/starter/person/infrastructure/adapter/in/rest/PersonController.java
```

Code :

```java
package com.ganatan.starter.person.infrastructure.adapter.in.rest;

import com.ganatan.starter.person.application.port.in.PersonUseCase;
import com.ganatan.starter.person.domain.Person;
import com.ganatan.starter.person.infrastructure.adapter.in.rest.dto.PersonInputDto;
import com.ganatan.starter.person.infrastructure.adapter.in.rest.dto.PersonOutputDto;
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
  public List<PersonOutputDto> getAll() {
    return personUseCase.getAll()
        .stream()
        .map(
            PersonOutputDto::from
        )
        .toList();
  }

  @GetMapping("/{id}")
  public PersonOutputDto getById(
      @PathVariable int id
  ) {
    Person person =
        personUseCase.getById(
            id
        );

    return PersonOutputDto.from(
        person
    );
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public PersonOutputDto create(
      @RequestBody PersonInputDto input
  ) {
    Person person =
        personUseCase.create(
            input.toDomain()
        );

    return PersonOutputDto.from(
        person
    );
  }

  @PutMapping("/{id}")
  public PersonOutputDto update(
      @PathVariable int id,
      @RequestBody PersonInputDto input
  ) {
    Person person =
        personUseCase.update(
            id,
            input.toDomain()
        );

    return PersonOutputDto.from(
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

# GET /persons

Le Controller reçoit :

```text
List<Person>
```

depuis le cas d'usage.

Il transforme chaque élément :

```java
.map(
    PersonOutputDto::from
)
```

Flux :

```text
PersonUseCase
      ↓
List<Person>
      ↓
PersonController
      ↓
List<PersonOutputDto>
      ↓
JSON
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

Flux :

```text
GET /persons/1
      ↓
PersonController
      ↓
PersonUseCase.getById
      ↓
Person
      ↓
PersonOutputDto.from
      ↓
JSON
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

Payload :

```json
{
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 8
}
```

Spring crée :

```text
PersonInputDto
```

Le Controller transforme :

```text
PersonInputDto
      ↓
Person
```

avec :

```java
input.toDomain();
```

Puis appelle :

```java
personUseCase.create(
    person
);
```

Flux complet :

```text
JSON
 ↓
PersonInputDto
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
Person
 ↓
PersonOutputDto
 ↓
JSON
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

Le Controller reçoit :

```text
id = 1
```

et :

```text
PersonInputDto
```

Le DTO produit :

```java
new Person(
    0,
    "Steven",
    "Spielberg",
    10
);
```

Puis :

```java
personUseCase.update(
    1,
    person
);
```

Le cas d'usage reconstruit :

```java
new Person(
    1,
    "Steven",
    "Spielberg",
    10
);
```

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

# DELETE /persons/{id}

Aucun DTO n'est nécessaire.

Le Controller transmet uniquement :

```text
id
```

au port entrant.

```java
personUseCase.delete(
    id
);
```

Réponse :

```text
204 No Content
```

---

# Pourquoi deux DTO

Nous utilisons :

```text
PersonInputDto
```

et :

```text
PersonOutputDto
```

car les données d'entrée et de sortie n'ont pas exactement la même responsabilité.

Entrée :

```json
{
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 8
}
```

Sortie :

```json
{
  "id": 8,
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 8
}
```

La différence principale est :

```text
Input  → pas d'id
Output → id présent
```

---

# Domaine

Le domaine reste :

```java
package com.ganatan.starter.person.domain;

public record Person(
    int id,
    String firstName,
    String lastName,
    int cityId
) {
}
```

Il ne connaît toujours pas :

```text
PersonInputDto
PersonOutputDto
PersonController
HTTP
JSON
Spring MVC
```

---

# Direction des dépendances

Les DTO dépendent du domaine :

```text
PersonInputDto
      ↓
    Person

PersonOutputDto
      ↓
    Person
```

Le domaine ne dépend pas des DTO.

Incorrect :

```text
Person
  ↓
PersonInputDto
```

Correct :

```text
PersonInputDto
      ↓
    Person
```

La dépendance reste dirigée vers le cœur.

---

# Responsabilités

## PersonInputDto

Responsabilité :

```text
représenter les données HTTP entrantes
```

et :

```text
convertir les données HTTP vers le domaine
```

---

## PersonOutputDto

Responsabilité :

```text
représenter les données HTTP sortantes
```

et :

```text
convertir le domaine vers la représentation HTTP
```

---

## PersonController

Responsabilité :

```text
HTTP
+
conversion DTO
+
appel du port entrant
```

Il ne contient aucune logique de persistence.

---

## PersonService

Responsabilité :

```text
logique applicative
```

Il ne connaît aucun DTO.

---

## PersonRepository

Responsabilité :

```text
contrat de persistence
```

Il ne connaît aucun DTO.

---

# Séparation obtenue

Nous avons maintenant une frontière claire.

```text
              EXTÉRIEUR

                  JSON
                   ↓
            PersonInputDto
                   ↓
            PersonController
                   ↓
--------------- frontière ---------------
                   ↓
             PersonUseCase
                   ↓
             PersonService
                   ↓
                Person
                   ↓
            PersonRepository
--------------- frontière ---------------
                   ↓
       InMemoryPersonRepository
```

Pour la réponse :

```text
Person
  ↓
PersonController
  ↓
PersonOutputDto
  ↓
JSON
```

---

# Test – PersonControllerTests.java

Les endpoints restent identiques.

Seul le format d'entrée change :

```text
id
```

n'est plus nécessaire dans les payloads `POST` et `PUT`.

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
        jsonPath("$[0].id")
            .value(1)
    )
    .andExpect(
        jsonPath("$[0].firstName")
            .value("Steven")
    )
    .andExpect(
        jsonPath("$[0].lastName")
            .value("Spielberg")
    )
    .andExpect(
        jsonPath("$[0].cityId")
            .value(1)
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
  void updateShouldReturnNotFound()
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

# Tests des autres couches

Les tests suivants ne changent pas :

```text
PersonTests
PersonServiceTests
InMemoryPersonRepositoryTests
```

C'est important.

L'ajout des DTO concerne uniquement :

```text
Adapter IN REST
```

Les autres couches sont indépendantes de cette modification.

---

# Test manuel avec curl

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

# Build

Compiler et exécuter les tests :

```bash
mvn clean install
```

Lancer l'application :

```bash
mvn spring-boot:run
```

URL :

```text
http://localhost:3000/persons
```

---

# Avant

L'adapter REST utilisait directement le domaine :

```text
JSON
 ↓
Person
 ↓
PersonController
 ↓
PersonUseCase
```

et pour la réponse :

```text
Person
 ↓
JSON
```

Le modèle métier faisait également office de contrat HTTP.

---

# Maintenant

Entrée :

```text
JSON
 ↓
PersonInputDto
 ↓
Person
 ↓
PersonUseCase
```

Sortie :

```text
PersonUseCase
 ↓
Person
 ↓
PersonOutputDto
 ↓
JSON
```

Le contrat HTTP et le modèle métier sont séparés.

---

# Architecture actuelle

```text
                        HTTP
                         │
                         ▼
                  PersonInputDto
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
                       Memory
```

Réponse :

```text
Person
  ↓
PersonOutputDto
  ↓
JSON
```

---

# Architecture par packages

```text
person
│
├── domain
│   └── Person
│
├── application
│   ├── exception
│   │   └── PersonNotFoundException
│   │
│   ├── port
│   │   ├── in
│   │   │   └── PersonUseCase
│   │   └── out
│   │       └── PersonRepository
│   │
│   └── service
│       └── PersonService
│
└── infrastructure
    ├── adapter
    │   ├── in
    │   │   └── rest
    │   │       ├── dto
    │   │       │   ├── PersonInputDto
    │   │       │   └── PersonOutputDto
    │   │       ├── PersonController
    │   │       └── PersonExceptionHandler
    │   │
    │   └── out
    │       └── memory
    │           └── InMemoryPersonRepository
    │
    └── config
        └── PersonConfiguration
```

---

# Package by feature avec plusieurs domaines

La même organisation pourra être reproduite pour :

```text
person
city
country
```

Exemple :

```text
com.ganatan.starter
├── person
│   ├── domain
│   ├── application
│   └── infrastructure
│
├── city
│   ├── domain
│   ├── application
│   └── infrastructure
│
└── country
    ├── domain
    ├── application
    └── infrastructure
```

Chaque fonctionnalité contient ses propres :

```text
Domain
Ports
Use Cases
Adapters
DTO
Configuration
```

---

# État du projet

Nous avons maintenant un CRUD REST complet :

```text
HTTP
 ↓
DTO
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
Memory
```

Concrètement :

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
```

Pour la réponse :

```text
InMemoryPersonRepository
 ↓
Person
 ↓
PersonService
 ↓
PersonController
 ↓
PersonOutputDto
 ↓
JSON
```

---

# Limite actuelle

Le stockage reste :

```text
List<Person>
```

dans :

```text
InMemoryPersonRepository
```

Les données sont perdues lorsque l'application redémarre.

L'architecture permet maintenant de remplacer cet adapter sans modifier :

```text
Person
PersonUseCase
PersonService
PersonRepository
PersonController
PersonInputDto
PersonOutputDto
```

---

# Étape suivante

Nous allons remplacer le stockage mémoire par PostgreSQL.

Nous conserverons le même port :

```text
PersonRepository
```

L'objectif sera de passer de :

```text
PersonRepository
      ↑
InMemoryPersonRepository
      ↓
List<Person>
```

à :

```text
PersonRepository
      ↑
PostgreSqlPersonRepositoryAdapter
      ↓
PostgreSQL
```

Le cœur de l'application ne changera pas.

Prochaine étape :

```text
010-postgresql.md
```

---

# Principes clés

- `PersonInputDto` représente l'entrée HTTP ;
- `PersonOutputDto` représente la sortie HTTP ;
- les DTO appartiennent à l'adapter REST ;
- les DTO ne font pas partie du domaine ;
- `Person` reste le modèle métier ;
- le Controller convertit les DTO vers le domaine et inversement ;
- le port entrant utilise toujours `Person` ;
- le service ne connaît aucun DTO ;
- le repository ne connaît aucun DTO ;
- le domaine ne connaît aucun DTO ;
- les contrats HTTP peuvent évoluer sans modifier le domaine ;
- le domaine peut évoluer indépendamment de la représentation HTTP ;
- les dépendances restent dirigées vers le cœur ;
- l'organisation reste en package by feature.

Architecture obtenue :

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
```

Étape suivante :

```text
PostgreSQL
```