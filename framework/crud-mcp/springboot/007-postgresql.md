# Database – Person

Intégration de PostgreSQL dans le CRUD `Person`.

L’architecture reste :

```text
PersonController
    ↓
PersonService
    ↓
PersonRepository
    ↓
PostgreSQL
```

Le stockage en mémoire disparaît complètement.

Le changement principal concerne essentiellement :

```text
PersonRepository
```

Le `PersonController` et le `PersonService` conservent la même architecture.

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
JdbcTemplate
  ↓
PostgreSQL
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
Requêtes SQL
Accès aux données

JdbcTemplate
    ↓
Communication JDBC

PostgreSQL
    ↓
Persistance

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

Structure générale :

```text
src/
├── main/
│   ├── java/
│   │   └── com/
│   │       └── ganatan/
│   │           └── starter/
│   │               ├── StarterApplication.java
│   │               └── api/
│   │                   ├── person/
│   │                   │   ├── Person.java
│   │                   │   ├── PersonInputDto.java
│   │                   │   ├── PersonOutputDto.java
│   │                   │   ├── PersonRepository.java
│   │                   │   ├── PersonService.java
│   │                   │   └── PersonController.java
│   │                   └── root/
│   │                       └── RootController.java
│   │
│   └── resources/
│       ├── application.properties
│       └── application.yml
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

Ajouter le support JDBC et PostgreSQL.

## pom.xml

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>

<dependency>
  <groupId>org.postgresql</groupId>
  <artifactId>postgresql</artifactId>
  <scope>runtime</scope>
</dependency>
```

Les dépendances utilisées pour l’API et les tests restent présentes :

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-validation</artifactId>
</dependency>

<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-test</artifactId>
  <scope>test</scope>
</dependency>
```

`spring-boot-starter-test` fournit notamment :

```text
JUnit
Mockito
MockMvc
Hamcrest
```

---

# Configuration PostgreSQL

Pour cette étape, la configuration reste volontairement simple.

Aucune variable d’environnement n’est utilisée.

Aucun fichier `.env` n’est nécessaire.

Utiliser soit :

```text
application.properties
```

soit :

```text
application.yml
```

Il n’est pas nécessaire de conserver les deux fichiers actifs avec la même configuration.

---

## application.properties

Chemin :

```text
src/main/resources/application.properties
```

Configuration :

```properties
spring.application.name=springboot-starter
server.port=3000

spring.datasource.url=jdbc:postgresql://localhost:5432/springboot_starter
spring.datasource.username=postgres
spring.datasource.password=password
```

---

## application.yml

Chemin :

```text
src/main/resources/application.yml
```

Configuration équivalente :

```yaml
spring:
  application:
    name: springboot-starter

  datasource:
    url: jdbc:postgresql://localhost:5432/springboot_starter
    username: postgres
    password: password

server:
  port: 3000
```

Les deux configurations sont équivalentes.

Pour le projet, utiliser l’une ou l’autre :

```text
application.properties
```

ou :

```text
application.yml
```

---

# Configuration automatique Spring Boot

À partir de :

```text
spring.datasource.url
spring.datasource.username
spring.datasource.password
```

Spring Boot configure automatiquement :

```text
DataSource
    ↓
Pool de connexions
    ↓
JdbcTemplate
    ↓
PostgreSQL
```

Le code applicatif ne crée donc pas manuellement :

```text
connexion JDBC
pool
JdbcTemplate
```

Spring gère ces composants.

---

# Base de données

Créer la base PostgreSQL :

```sql
CREATE DATABASE springboot_starter;
```

Configuration utilisée :

```text
host     : localhost
port     : 5432
database : springboot_starter
user     : postgres
password : password
```

---

# Table Person

Créer la table :

```sql
CREATE TABLE person (
  id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  city_id INTEGER NOT NULL CHECK (city_id > 0)
);
```

Structure :

```text
person
├── id
├── first_name
├── last_name
└── city_id
```

Correspondance PostgreSQL / Java :

```text
PostgreSQL          Java

INTEGER             int
VARCHAR             String
```

---

# Données initiales

Insérer les sept personnes :

```sql
INSERT INTO person (
  first_name,
  last_name,
  city_id
)
VALUES
  ('Steven', 'Spielberg', 1),
  ('Martin', 'Scorsese', 2),
  ('Francis', 'Ford Coppola', 3),
  ('George', 'Lucas', 4),
  ('Quentin', 'Tarantino', 5),
  ('David', 'Fincher', 6),
  ('Spike', 'Lee', 7);
```

Vérification :

```sql
SELECT
  id,
  first_name,
  last_name,
  city_id
FROM person
ORDER BY id;
```

Résultat attendu :

```text
1 Steven   Spielberg       1
2 Martin   Scorsese        2
3 Francis  Ford Coppola    3
4 George   Lucas           4
5 Quentin  Tarantino       5
6 David    Fincher         6
7 Spike    Lee             7
```

---

# Person

Le modèle interne ne change pas.

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

`Person` reste indépendant de :

```text
HTTP
Spring MVC
DTO
PostgreSQL
JdbcTemplate
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

Le repository ne contient maintenant plus aucune donnée en mémoire.

Avant :

```text
PersonRepository
    ↓
List<Person>
```

Maintenant :

```text
PersonRepository
    ↓
JdbcTemplate
    ↓
PostgreSQL
```

Il ne contient plus :

```text
ArrayList<Person>
AtomicInteger
idCounter
personList
```

---

## Chemin

```text
src/main/java/com/ganatan/starter/api/person/PersonRepository.java
```

## Code

```java
package com.ganatan.starter.api.person;

import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class PersonRepository {

  private final JdbcTemplate jdbcTemplate;

  private final RowMapper<Person> personRowMapper =
    (resultSet, rowNum) ->
      new Person(
        resultSet.getInt("id"),
        resultSet.getString("first_name"),
        resultSet.getString("last_name"),
        resultSet.getInt("city_id")
      );

  public PersonRepository(
    JdbcTemplate jdbcTemplate
  ) {
    this.jdbcTemplate =
      jdbcTemplate;
  }

  public List<Person> findAll() {
    String sql = """
      SELECT
        id,
        first_name,
        last_name,
        city_id
      FROM person
      ORDER BY id
      """;

    return jdbcTemplate.query(
      sql,
      personRowMapper
    );
  }

  public Optional<Person> findById(
    int id
  ) {
    String sql = """
      SELECT
        id,
        first_name,
        last_name,
        city_id
      FROM person
      WHERE id = ?
      """;

    List<Person> persons =
      jdbcTemplate.query(
        sql,
        personRowMapper,
        id
      );

    return persons.stream()
      .findFirst();
  }

  public Person create(
    String firstName,
    String lastName,
    int cityId
  ) {
    String sql = """
      INSERT INTO person (
        first_name,
        last_name,
        city_id
      )
      VALUES (
        ?,
        ?,
        ?
      )
      RETURNING
        id,
        first_name,
        last_name,
        city_id
      """;

    return jdbcTemplate.queryForObject(
      sql,
      personRowMapper,
      firstName,
      lastName,
      cityId
    );
  }

  public Optional<Person> update(
    int id,
    String firstName,
    String lastName,
    int cityId
  ) {
    String sql = """
      UPDATE person
      SET
        first_name = ?,
        last_name = ?,
        city_id = ?
      WHERE id = ?
      RETURNING
        id,
        first_name,
        last_name,
        city_id
      """;

    List<Person> persons =
      jdbcTemplate.query(
        sql,
        personRowMapper,
        firstName,
        lastName,
        cityId,
        id
      );

    return persons.stream()
      .findFirst();
  }

  public boolean delete(
    int id
  ) {
    String sql = """
      DELETE FROM person
      WHERE id = ?
      """;

    int rows =
      jdbcTemplate.update(
        sql,
        id
      );

    return rows > 0;
  }
}
```

---

# JdbcTemplate

`JdbcTemplate` représente l’accès JDBC fourni par Spring.

Architecture :

```text
PersonRepository
      ↓
JdbcTemplate
      ↓
DataSource
      ↓
Pool de connexions
      ↓
PostgreSQL
```

Spring injecte automatiquement :

```java
JdbcTemplate jdbcTemplate
```

dans le repository.

---

# Injection de JdbcTemplate

Le repository possède :

```java
private final JdbcTemplate jdbcTemplate;
```

Injection par constructeur :

```java
public PersonRepository(
  JdbcTemplate jdbcTemplate
) {
  this.jdbcTemplate =
    jdbcTemplate;
}
```

Spring construit donc automatiquement :

```text
DataSource
    ↓
JdbcTemplate
    ↓
PersonRepository
```

---

# RowMapper

PostgreSQL retourne des lignes SQL.

Il faut transformer chaque ligne en :

```text
Person
```

Le `RowMapper` réalise ce mapping :

```java
private final RowMapper<Person> personRowMapper =
  (resultSet, rowNum) ->
    new Person(
      resultSet.getInt("id"),
      resultSet.getString("first_name"),
      resultSet.getString("last_name"),
      resultSet.getInt("city_id")
    );
```

Flux :

```text
Ligne PostgreSQL
      ↓
ResultSet
      ↓
RowMapper<Person>
      ↓
Person
```

Le reste de l’application ne manipule jamais directement :

```text
ResultSet
```

---

# Lecture de toutes les personnes

La méthode :

```java
public List<Person> findAll()
```

exécute :

```sql
SELECT
  id,
  first_name,
  last_name,
  city_id
FROM person
ORDER BY id
```

Flux :

```text
PersonRepository.findAll()
        ↓
JdbcTemplate
        ↓
SELECT
        ↓
PostgreSQL
        ↓
ResultSet
        ↓
RowMapper
        ↓
List<Person>
```

---

# Lecture par identifiant

La méthode :

```java
public Optional<Person> findById(
  int id
)
```

exécute :

```sql
SELECT
  id,
  first_name,
  last_name,
  city_id
FROM person
WHERE id = ?
```

Le caractère :

```text
?
```

représente un paramètre JDBC.

L’identifiant est transmis séparément :

```java
jdbcTemplate.query(
  sql,
  personRowMapper,
  id
);
```

Si la personne existe :

```text
Optional<Person>
```

Sinon :

```text
Optional.empty()
```

Le repository ne connaît pas :

```text
404 NOT FOUND
```

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

exécute :

```sql
INSERT INTO person (
  first_name,
  last_name,
  city_id
)
VALUES (
  ?,
  ?,
  ?
)
RETURNING
  id,
  first_name,
  last_name,
  city_id
```

PostgreSQL génère maintenant l’identifiant.

Avant :

```text
AtomicInteger
    ↓
id
```

Maintenant :

```text
PostgreSQL
    ↓
IDENTITY
    ↓
id
```

Le repository récupère directement la ligne insérée grâce à :

```sql
RETURNING
```

Flux :

```text
PersonRepository.create()
        ↓
INSERT
        ↓
PostgreSQL
        ↓
génération id
        ↓
RETURNING
        ↓
RowMapper
        ↓
Person
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

exécute :

```sql
UPDATE person
SET
  first_name = ?,
  last_name = ?,
  city_id = ?
WHERE id = ?
RETURNING
  id,
  first_name,
  last_name,
  city_id
```

Si la personne existe :

```text
Optional<Person>
```

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

exécute :

```sql
DELETE FROM person
WHERE id = ?
```

`JdbcTemplate.update()` retourne le nombre de lignes supprimées.

```java
int rows =
  jdbcTemplate.update(
    sql,
    id
  );
```

Si :

```text
rows > 0
```

le repository retourne :

```text
true
```

Sinon :

```text
false
```

---

# PersonService

Le service ne connaît pas PostgreSQL.

Il ne connaît pas :

```text
JdbcTemplate
DataSource
ResultSet
SQL
PostgreSQL
```

Il dépend uniquement de :

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

Avant PostgreSQL :

```text
PersonService
    ↓
PersonRepository
    ↓
List<Person>
```

Après PostgreSQL :

```text
PersonService
    ↓
PersonRepository
    ↓
JdbcTemplate
    ↓
PostgreSQL
```

Le code du service ne change pratiquement pas.

Il ne dépend pas du mécanisme réel de stockage.

---

# PersonController

Le controller continue à dépendre uniquement du service.

Il ne connaît pas directement :

```text
PersonRepository
JdbcTemplate
PostgreSQL
SQL
```

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

# Point important

Le `PersonController` reste identique à l’étape Repository en mémoire.

Le `PersonService` reste également identique.

Le changement est principalement concentré dans :

```text
PersonRepository
```

Avant :

```java
private final List<Person> personList;
```

Maintenant :

```java
private final JdbcTemplate jdbcTemplate;
```

L’architecture permet donc de remplacer :

```text
List<Person>
```

par :

```text
PostgreSQL
```

sans réécrire les couches supérieures.

---

# Gestion des erreurs Database

`JdbcTemplate` utilise les exceptions Spring de la famille :

```text
DataAccessException
```

Cela peut représenter notamment :

```text
connexion PostgreSQL impossible
requête SQL invalide
contrainte SQL violée
erreur JDBC
```

Sans gestion spécifique supplémentaire, une erreur technique remonte jusqu’à Spring et produit généralement :

```text
500 Internal Server Error
```

Une personne inexistante reste un cas différent.

Le repository retourne :

```text
Optional.empty()
```

Le controller transforme ensuite cette absence en :

```text
404 NOT FOUND
```

---

# Construction des couches

Spring construit automatiquement :

```text
DataSource
    ↓
JdbcTemplate
    ↓
PersonRepository
    ↓
PersonService
    ↓
PersonController
```

Grâce aux composants :

```text
@Repository
@Service
@RestController
```

et à l’injection par constructeur.

Le code applicatif n’a pas besoin de faire :

```java
new PersonRepository(...)
```

ni :

```java
new PersonService(...)
```

ni :

```java
new PersonController(...)
```

Spring construit automatiquement le graphe des dépendances.

---

# StarterApplication

La classe principale ne change pas.

## Chemin

```text
src/main/java/com/ganatan/starter/StarterApplication.java
```

## Code

```java
package com.ganatan.starter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StarterApplication {

  public static void main(
    String[] args
  ) {
    SpringApplication.run(
      StarterApplication.class,
      args
    );
  }
}
```

Contrairement au projet Rust, le pool PostgreSQL n’est pas créé manuellement dans le `main`.

Spring Boot configure automatiquement :

```text
DataSource
    ↓
pool de connexions
    ↓
JdbcTemplate
```

---

# Tests

À partir de cette étape, les tests unitaires ne doivent plus instancier toute la chaîne réelle.

Avant PostgreSQL :

```text
PersonControllerTests
    ↓
PersonService réel
    ↓
PersonRepository réel
    ↓
List<Person>
```

Cela fonctionnait parce que le repository n’avait aucune dépendance externe.

Maintenant :

```text
PersonRepository
    ↓
JdbcTemplate
    ↓
PostgreSQL
```

Le constructeur du repository est devenu :

```java
public PersonRepository(
  JdbcTemplate jdbcTemplate
)
```

Il n’existe donc plus de :

```java
new PersonRepository()
```

Les tests sont maintenant séparés par couche.

---

# Architecture des tests

```text
PersonControllerTests
        ↓
PersonService mocké


PersonServiceTests
        ↓
PersonRepository mocké


PersonRepositoryTests
        ↓
JdbcTemplate mocké
```

Chaque test vérifie uniquement la responsabilité de sa propre couche.

Les tests unitaires restent ainsi :

```text
rapides
indépendants
sans PostgreSQL
sans connexion réseau
```

---

# PersonControllerTests

Le controller dépend normalement de :

```text
PersonService
```

Dans les tests du controller, le service est remplacé par un mock Mockito.

Le test vérifie :

```text
routes HTTP
validation
codes HTTP
JSON retourné
mapping vers PersonOutputDto
```

Il ne vérifie pas :

```text
SQL
JdbcTemplate
PostgreSQL
```

## Chemin

```text
src/test/java/com/ganatan/starter/api/person/PersonControllerTests.java
```

## Code

```java
package com.ganatan.starter.api.person;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.SpringValidatorAdapter;

class PersonControllerTests {

  private MockMvc mockMvc;
  private PersonService service;

  @BeforeEach
  void setUp() {
    Validator validator = Validation
      .buildDefaultValidatorFactory()
      .getValidator();

    service =
      Mockito.mock(PersonService.class);

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

    when(
      service.getAllPersons()
    ).thenReturn(
      List.of(
        new Person(1, "Steven", "Spielberg", 1),
        new Person(2, "Martin", "Scorsese", 2),
        new Person(3, "Francis", "Ford Coppola", 3),
        new Person(4, "George", "Lucas", 4),
        new Person(5, "Quentin", "Tarantino", 5),
        new Person(6, "David", "Fincher", 6),
        new Person(7, "Spike", "Lee", 7)
      )
    );

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

    when(
      service.getPersonById(1)
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

    when(
      service.getPersonById(999)
    ).thenReturn(
      Optional.empty()
    );

    mockMvc.perform(
        get("/persons/999")
      )
      .andExpect(
        status().isNotFound()
      );
  }

  @Test
  void createPerson_shouldReturnCreatedPerson()
    throws Exception {

    when(
      service.createPerson(
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

    when(
      service.updatePerson(
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
          "Spielberg Updated",
          10
        )
      )
    );

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

    when(
      service.updatePerson(
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

    when(
      service.deletePerson(1)
    ).thenReturn(true);

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

    when(
      service.deletePerson(999)
    ).thenReturn(false);

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

# PersonServiceTests

Le service dépend normalement de :

```text
PersonRepository
```

Dans les tests du service, le repository est remplacé par un mock.

Le test vérifie :

```text
appels au repository
valeurs retournées
propagation des résultats
```

Il ne vérifie pas :

```text
JdbcTemplate
SQL
PostgreSQL
```

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
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class PersonServiceTests {

  private PersonRepository repository;
  private PersonService service;

  @BeforeEach
  void setUp() {
    repository =
      Mockito.mock(PersonRepository.class);

    service =
      new PersonService(repository);
  }

  @Test
  void getAllPersons_shouldReturnPersons() {
    when(
      repository.findAll()
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
        )
      )
    );

    List<Person> persons =
      service.getAllPersons();

    assertEquals(
      2,
      persons.size()
    );

    verify(
      repository
    ).findAll();
  }

  @Test
  void getPersonById_shouldReturnPerson() {
    when(
      repository.findById(1)
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

    verify(
      repository
    ).findById(1);
  }

  @Test
  void getPersonById_shouldReturnEmpty() {
    when(
      repository.findById(999)
    ).thenReturn(
      Optional.empty()
    );

    Optional<Person> person =
      service.getPersonById(999);

    assertTrue(
      person.isEmpty()
    );

    verify(
      repository
    ).findById(999);
  }

  @Test
  void createPerson_shouldReturnCreatedPerson() {
    when(
      repository.create(
        "Clint",
        "Eastwood",
        8
      )
    ).thenReturn(
      new Person(
        8,
        "Clint",
        "Eastwood",
        8
      )
    );

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

    verify(
      repository
    ).create(
      "Clint",
      "Eastwood",
      8
    );
  }

  @Test
  void updatePerson_shouldReturnUpdatedPerson() {
    when(
      repository.update(
        1,
        "Steven",
        "Spielberg Updated",
        10
      )
    ).thenReturn(
      Optional.of(
        new Person(
          1,
          "Steven",
          "Spielberg Updated",
          10
        )
      )
    );

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

    verify(
      repository
    ).update(
      1,
      "Steven",
      "Spielberg Updated",
      10
    );
  }

  @Test
  void updatePerson_shouldReturnEmpty() {
    when(
      repository.update(
        999,
        "Unknown",
        "Person",
        1
      )
    ).thenReturn(
      Optional.empty()
    );

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

    verify(
      repository
    ).update(
      999,
      "Unknown",
      "Person",
      1
    );
  }

  @Test
  void deletePerson_shouldReturnTrue() {
    when(
      repository.delete(1)
    ).thenReturn(true);

    boolean deleted =
      service.deletePerson(1);

    assertTrue(deleted);

    verify(
      repository
    ).delete(1);
  }

  @Test
  void deletePerson_shouldReturnFalse() {
    when(
      repository.delete(999)
    ).thenReturn(false);

    boolean deleted =
      service.deletePerson(999);

    assertFalse(deleted);

    verify(
      repository
    ).delete(999);
  }
}
```

---

# PersonRepositoryTests

Le repository dépend normalement de :

```text
JdbcTemplate
```

Dans les tests unitaires du repository, `JdbcTemplate` est remplacé par un mock.

Le test vérifie :

```text
comportement du repository
résultats retournés
gestion d'un résultat absent
gestion du nombre de lignes supprimées
```

Il ne démarre pas PostgreSQL.

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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

class PersonRepositoryTests {

  private JdbcTemplate jdbcTemplate;
  private PersonRepository repository;

  @BeforeEach
  void setUp() {
    jdbcTemplate =
      Mockito.mock(JdbcTemplate.class);

    repository =
      new PersonRepository(
        jdbcTemplate
      );
  }

  @Test
  void findAll_shouldReturnPersons() {
    when(
      jdbcTemplate.query(
        anyString(),
        any(RowMapper.class)
      )
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
        )
      )
    );

    List<Person> persons =
      repository.findAll();

    assertEquals(
      2,
      persons.size()
    );

    assertEquals(
      "Steven",
      persons.get(0).firstName()
    );

    assertEquals(
      "Spielberg",
      persons.get(0).lastName()
    );
  }

  @Test
  void findById_shouldReturnPerson() {
    when(
      jdbcTemplate.query(
        anyString(),
        any(RowMapper.class),
        eq(1)
      )
    ).thenReturn(
      List.of(
        new Person(
          1,
          "Steven",
          "Spielberg",
          1
        )
      )
    );

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
    when(
      jdbcTemplate.query(
        anyString(),
        any(RowMapper.class),
        eq(999)
      )
    ).thenReturn(
      List.of()
    );

    Optional<Person> person =
      repository.findById(999);

    assertTrue(
      person.isEmpty()
    );
  }

  @Test
  void create_shouldReturnCreatedPerson() {
    Person expected =
      new Person(
        8,
        "Clint",
        "Eastwood",
        8
      );

    when(
      jdbcTemplate.queryForObject(
        anyString(),
        any(RowMapper.class),
        eq("Clint"),
        eq("Eastwood"),
        eq(8)
      )
    ).thenReturn(
      expected
    );

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
  }

  @Test
  void update_shouldReturnUpdatedPerson() {
    Person expected =
      new Person(
        1,
        "Steven",
        "Spielberg Updated",
        10
      );

    when(
      jdbcTemplate.query(
        anyString(),
        any(RowMapper.class),
        eq("Steven"),
        eq("Spielberg Updated"),
        eq(10),
        eq(1)
      )
    ).thenReturn(
      List.of(expected)
    );

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
    when(
      jdbcTemplate.query(
        anyString(),
        any(RowMapper.class),
        eq("Unknown"),
        eq("Person"),
        eq(1),
        eq(999)
      )
    ).thenReturn(
      List.of()
    );

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
  void delete_shouldReturnTrue() {
    when(
      jdbcTemplate.update(
        anyString(),
        eq(1)
      )
    ).thenReturn(1);

    boolean deleted =
      repository.delete(1);

    assertTrue(deleted);
  }

  @Test
  void delete_shouldReturnFalse() {
    when(
      jdbcTemplate.update(
        anyString(),
        eq(999)
      )
    ).thenReturn(0);

    boolean deleted =
      repository.delete(999);

    assertFalse(deleted);
  }
}
```

---

# Pourquoi utiliser des mocks ?

Sans mock, un test du controller construirait :

```text
PersonController
    ↓
PersonService
    ↓
PersonRepository
    ↓
JdbcTemplate
    ↓
PostgreSQL
```

Le test du controller dépendrait alors :

```text
du service
du repository
de JDBC
de PostgreSQL
de la configuration de la base
des données présentes dans la base
```

Ce n’est plus un test unitaire du controller.

Avec les mocks :

```text
PersonControllerTests
    ↓
mock PersonService
```

le test vérifie seulement le comportement HTTP.

Même principe pour le service :

```text
PersonServiceTests
    ↓
mock PersonRepository
```

et pour le repository :

```text
PersonRepositoryTests
    ↓
mock JdbcTemplate
```

Chaque couche est testée indépendamment.

---

# Mockito

Mockito permet de créer un faux composant.

Exemple :

```java
PersonRepository repository =
  Mockito.mock(
    PersonRepository.class
  );
```

On peut ensuite définir son comportement :

```java
when(
  repository.findById(1)
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
```

Le service pense utiliser un vrai repository.

Mais aucun accès PostgreSQL n’est réalisé.

---

# verify

Mockito permet également de vérifier qu’une méthode a été appelée.

Exemple :

```java
verify(
  repository
).findById(1);
```

Le test vérifie ainsi que :

```text
PersonService
```

a correctement délégué l’appel à :

```text
PersonRepository
```

---

# Limite des tests unitaires du Repository

Le test :

```text
PersonRepositoryTests
```

utilise un :

```text
JdbcTemplate mocké
```

Il vérifie donc la logique Java du repository.

Mais il ne vérifie pas réellement que :

```sql
SELECT
INSERT
UPDATE
DELETE
RETURNING
```

fonctionnent avec PostgreSQL.

Pour vérifier cela, il faudra plus tard ajouter des tests d’intégration :

```text
PersonRepositoryIntegrationTests
        ↓
JdbcTemplate réel
        ↓
PostgreSQL réel
```

ou éventuellement :

```text
Testcontainers
        ↓
PostgreSQL temporaire
```

Cette étape n’est pas nécessaire pour le CRUD actuel.

---

# Flux GET

```text
GET /persons/1
        ↓
PersonController
        ↓
PersonService.getPersonById()
        ↓
PersonRepository.findById()
        ↓
JdbcTemplate
        ↓
SELECT
        ↓
PostgreSQL
        ↓
ResultSet
        ↓
RowMapper
        ↓
Person
        ↓
PersonOutputDto
        ↓
JSON
```

---

# Flux GET ALL

```text
GET /persons
        ↓
PersonController
        ↓
PersonService.getAllPersons()
        ↓
PersonRepository.findAll()
        ↓
JdbcTemplate
        ↓
SELECT
        ↓
PostgreSQL
        ↓
List<Person>
        ↓
List<PersonOutputDto>
        ↓
JSON
```

---

# Flux POST

```text
POST /persons
        ↓
JSON
        ↓
PersonInputDto
        ↓
@Valid
        ↓
PersonController
        ↓
PersonService.createPerson()
        ↓
PersonRepository.create()
        ↓
JdbcTemplate
        ↓
INSERT
        ↓
PostgreSQL
        ↓
RETURNING
        ↓
Person
        ↓
PersonOutputDto
        ↓
JSON
```

---

# Flux PUT

```text
PUT /persons/1
        ↓
PersonInputDto
        ↓
@Valid
        ↓
PersonController
        ↓
PersonService.updatePerson()
        ↓
PersonRepository.update()
        ↓
JdbcTemplate
        ↓
UPDATE
        ↓
PostgreSQL
        ↓
RETURNING
        ↓
Optional<Person>
        ↓
PersonOutputDto
        ↓
JSON
```

---

# Flux DELETE

```text
DELETE /persons/1
        ↓
PersonController
        ↓
PersonService.deletePerson()
        ↓
PersonRepository.delete()
        ↓
JdbcTemplate
        ↓
DELETE
        ↓
PostgreSQL
        ↓
nombre de lignes supprimées
        ↓
boolean
        ↓
204 ou 404
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

# Vérification PostgreSQL

Vérifier directement le contenu de la table :

```sql
SELECT
  id,
  first_name,
  last_name,
  city_id
FROM person
ORDER BY id;
```

---

# Vérification Maven

Compiler :

```bash
mvn compile
```

Lancer les tests :

```bash
mvn test
```

Compiler, tester et packager :

```bash
mvn clean install
```

Résultat attendu :

```text
BUILD SUCCESS
```

Les tests unitaires peuvent être exécutés sans démarrer PostgreSQL car :

```text
PersonControllerTests
    ↓
mock PersonService

PersonServiceTests
    ↓
mock PersonRepository

PersonRepositoryTests
    ↓
mock JdbcTemplate
```

---

# Lancement

PostgreSQL doit être démarré pour lancer réellement l’application.

Lancer Spring Boot :

```bash
mvn spring-boot:run
```

Ou :

```bash
java -jar target/springboot-starter-1.0.0.jar
```

Application :

```text
http://localhost:3000
```

API :

```text
http://localhost:3000/persons
```

---

# Test avec curl

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
  -d "{\"firstName\":\"Steven\",\"lastName\":\"Spielberg Updated\",\"cityId\":10}"
```

---

## DELETE

```bash
curl -X DELETE http://localhost:3000/persons/1
```

---

# Architecture finale

```text
HTTP
    ↓
DTO
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
JdbcTemplate
    ↓
PostgreSQL
```

Chaque couche possède une responsabilité précise :

```text
Controller    → HTTP
Service       → logique applicative
Repository    → SQL et accès aux données
JdbcTemplate  → communication JDBC
PostgreSQL    → persistance
```

---

# Architecture finale des tests

```text
Production

PersonController
      ↓
PersonService
      ↓
PersonRepository
      ↓
JdbcTemplate
      ↓
PostgreSQL
```

```text
Test Controller

PersonController
      ↓
mock PersonService
```

```text
Test Service

PersonService
      ↓
mock PersonRepository
```

```text
Test Repository

PersonRepository
      ↓
mock JdbcTemplate
```

Chaque couche est donc testée indépendamment de ses dépendances.

---

# Évolution du Repository

## Repository en mémoire

```text
PersonRepository
    ↓
List<Person>
```

Le repository contenait :

```text
ArrayList<Person>
AtomicInteger
```

---

## Repository PostgreSQL

```text
PersonRepository
    ↓
JdbcTemplate
    ↓
PostgreSQL
```

Le repository contient maintenant :

```text
SELECT
INSERT
UPDATE
DELETE
mapping SQL → Person
```

Il ne contient plus directement les données.

---

# Évolution complète de l'architecture

## CRUD initial

```text
HTTP
  ↓
PersonController
  ↓
List<Person>
```

---

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

---

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

---

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

## Avec PostgreSQL

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
JdbcTemplate
  ↓
PostgreSQL
  ↓
Person
  ↓
PersonOutputDto
  ↓
HTTP
```

---

# Faible couplage

Avant :

```text
PersonRepository
    ↓
List<Person>
```

Maintenant :

```text
PersonRepository
    ↓
PostgreSQL
```

Mais :

```text
PersonController
```

ne change pas.

Et :

```text
PersonService
```

ne change pratiquement pas.

Le changement du mécanisme de persistance reste localisé dans :

```text
PersonRepository
```

Le couplage entre les couches reste donc faible.

---

# Principes clés

* `PersonController` reste responsable de HTTP.
* `PersonService` reste responsable de la logique applicative.
* `PersonRepository` reste responsable de l’accès aux données.
* Le stockage en mémoire disparaît.
* PostgreSQL devient responsable de la persistance.
* PostgreSQL génère les identifiants.
* `AtomicInteger` disparaît.
* `ArrayList<Person>` disparaît.
* `PersonRepository` contient les requêtes SQL.
* `JdbcTemplate` exécute les requêtes SQL.
* `JdbcTemplate` utilise un `DataSource`.
* Spring Boot configure automatiquement le `DataSource`.
* Spring Boot configure automatiquement le pool de connexions.
* `RowMapper<Person>` transforme une ligne SQL en `Person`.
* `PersonRepository` retourne uniquement des `Person`.
* `PersonRepository` ne retourne jamais de DTO.
* `PersonRepository` ne connaît pas HTTP.
* `PersonService` ne connaît pas PostgreSQL.
* `PersonService` ne connaît pas JDBC.
* `PersonService` ne connaît pas SQL.
* `PersonController` ne connaît pas PostgreSQL.
* `PersonController` ne connaît pas `JdbcTemplate`.
* `PersonInputDto` contrôle les entrées.
* `PersonOutputDto` contrôle les sorties.
* `Person` reste le modèle interne.
* `Optional<Person>` représente une donnée éventuellement absente.
* Une personne inexistante produit un `404`.
* Une erreur technique de base de données produit généralement un `500`.
* Les tests du controller mockent le service.
* Les tests du service mockent le repository.
* Les tests du repository mockent `JdbcTemplate`.
* Les tests unitaires ne nécessitent pas PostgreSQL.
* Les tests d’intégration PostgreSQL pourront être ajoutés séparément.
* Chaque couche peut évoluer sans obliger à réécrire les autres couches.

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
    │ SQL / accès aux données
    ↓
JdbcTemplate
    │
    │ JDBC
    ↓
PostgreSQL
```

Le passage :

```text
List<Person>
```

vers :

```text
PostgreSQL
```

est principalement isolé dans :

```text
PersonRepository
```

L’architecture obtenue reste :

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```
