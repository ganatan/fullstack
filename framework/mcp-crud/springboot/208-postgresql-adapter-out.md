# PostgreSQL – Adapter OUT avec JdbcTemplate

Huitième étape de l'architecture hexagonale pour le CRUD `Person`.

Objectif :

- remplacer le stockage mémoire utilisé par l'application par PostgreSQL ;
- conserver le port sortant `PersonRepository` ;
- créer un nouvel adapter sortant PostgreSQL ;
- utiliser `JdbcTemplate` pour exécuter les requêtes SQL ;
- conserver le domaine et l'application indépendants de PostgreSQL ;
- conserver le Controller et les DTO sans modification ;
- conserver l'organisation en package by feature.

---

## Architecture

À l'étape précédente, l'application utilisait :

```text
PersonRepository
      ↑
InMemoryPersonRepository
      ↓
List<Person>
```

Nous allons maintenant utiliser :

```text
PersonRepository
      ↑
PostgreSqlPersonRepositoryAdapter
      ↓
JdbcTemplate
      ↓
JDBC
      ↓
PostgreSQL
```

Le cœur de l'application ne change pas.

---

## Architecture complète

Avant :

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
 ↓
List<Person>
```

Maintenant :

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
PostgreSqlPersonRepositoryAdapter
 ↓
JdbcTemplate
 ↓
JDBC
 ↓
PostgreSQL
```

---

## Élément important

Le port :

```text
PersonRepository
```

ne change pas.

Il reste :

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

L'application ne connaît donc toujours pas PostgreSQL.

---

# Package by feature

L'organisation reste :

```text
com.ganatan.starter
├── person
├── city
└── country
```

Pour la feature `person` :

```text
person
├── domain
├── application
└── infrastructure
```

Le nouvel adapter PostgreSQL est placé dans :

```text
person.infrastructure.adapter.out.postgresql
```

---

# Structure

Structure après cette étape :

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
    │       ├── memory/
    │       │   └── InMemoryPersonRepository.java
    │       │
    │       └── postgresql/
    │           └── PostgreSqlPersonRepositoryAdapter.java
    │
    └── config/
        └── PersonConfiguration.java
```

Ressources avec `application.properties` :

```text
src/main/resources/
├── application.properties
├── schema.sql
└── data.sql
```

ou avec `application.yaml` :

```text
src/main/resources/
├── application.yaml
├── schema.sql
└── data.sql
```

Utiliser une seule des deux configurations :

```text
application.properties
```

ou :

```text
application.yaml
```

---

# PostgreSQL avec Docker

Démarrer PostgreSQL :

```bash
docker run \
  --name springboot-postgres \
  -e POSTGRES_DB=springboot_starter \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:17
```

Sous PowerShell :

```powershell
docker run --name springboot-postgres -e POSTGRES_DB=springboot_starter -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:17
```

Vérifier :

```bash
docker ps
```

Le serveur PostgreSQL est disponible sur :

```text
localhost:5432
```

Base :

```text
springboot_starter
```

Utilisateur :

```text
postgres
```

Mot de passe :

```text
postgres
```

---

# Commandes Docker

Arrêter PostgreSQL :

```bash
docker stop springboot-postgres
```

Redémarrer PostgreSQL :

```bash
docker start springboot-postgres
```

Supprimer le container :

```bash
docker rm -f springboot-postgres
```

---

# Dépendances Maven

Ajouter dans :

```text
pom.xml
```

les dépendances :

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

Nous utilisons maintenant :

```text
Spring JDBC
PostgreSQL Driver
```

Nous n'utilisons toujours pas :

```text
Spring Data JPA
Hibernate
@Entity
JpaRepository
```

---

# Configuration PostgreSQL

Deux formats sont possibles avec Spring Boot :

```text
application.properties
```

ou :

```text
application.yaml
```

Les deux configurations suivantes sont équivalentes.

---

## Possibilité 1 – application.properties

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
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver

spring.sql.init.mode=always
```

---

## Possibilité 2 – application.yaml

Chemin :

```text
src/main/resources/application.yaml
```

Configuration :

```yaml
spring:
  application:
    name: springboot-starter

  datasource:
    url: jdbc:postgresql://localhost:5432/springboot_starter
    username: postgres
    password: postgres
    driver-class-name: org.postgresql.Driver

  sql:
    init:
      mode: always

server:
  port: 3000
```

---

## Équivalence

Ces deux écritures représentent exactement la même configuration.

### Properties

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/springboot_starter
spring.datasource.username=postgres
spring.datasource.password=postgres
```

### YAML

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/springboot_starter
    username: postgres
    password: postgres
```

Le choix entre :

```text
application.properties
```

et :

```text
application.yaml
```

est principalement une question de préférence.

Pour ce tutoriel, une seule des deux versions doit être conservée dans le projet.

---

# Connexion

La chaîne JDBC utilisée est :

```text
jdbc:postgresql://localhost:5432/springboot_starter
```

Décomposition :

```text
jdbc:postgresql
      ↓
driver PostgreSQL

localhost
      ↓
serveur

5432
      ↓
port PostgreSQL

springboot_starter
      ↓
base de données
```

---

# Création de la table

Créer :

```text
src/main/resources/schema.sql
```

Code :

```sql
CREATE TABLE IF NOT EXISTS person (
  id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  city_id INTEGER NOT NULL
);
```

---

# Table Person

Structure :

```text
person
├── id
├── first_name
├── last_name
└── city_id
```

Correspondance avec le domaine :

```text
PostgreSQL        Java

id          →     id
first_name  →     firstName
last_name   →     lastName
city_id     →     cityId
```

---

# Données initiales

Créer :

```text
src/main/resources/data.sql
```

Code :

```sql
TRUNCATE TABLE person RESTART IDENTITY;

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

Au démarrage :

```text
id = 1 → Steven Spielberg
id = 2 → Martin Scorsese
id = 3 → Francis Ford Coppola
id = 4 → George Lucas
id = 5 → Quentin Tarantino
id = 6 → David Fincher
id = 7 → Spike Lee
```

La prochaine insertion générera :

```text
id = 8
```

---

# Initialisation SQL

Avec `application.properties` :

```properties
spring.sql.init.mode=always
```

Avec `application.yaml` :

```yaml
spring:
  sql:
    init:
      mode: always
```

Cette configuration demande à Spring Boot d'exécuter :

```text
schema.sql
```

puis :

```text
data.sql
```

au démarrage.

Pour ce tutoriel :

```text
chaque démarrage
      ↓
schema.sql
      ↓
data.sql
      ↓
7 réalisateurs
```

La commande :

```sql
TRUNCATE TABLE person RESTART IDENTITY;
```

réinitialise volontairement les données à chaque démarrage.

Cela permet de conserver un état reproductible pendant le tutoriel.

---

# Adapter PostgreSQL

Créer :

```text
PostgreSqlPersonRepositoryAdapter
```

Cette classe :

```text
implémente PersonRepository
```

et utilise :

```text
JdbcTemplate
```

---

# Code – PostgreSqlPersonRepositoryAdapter.java

Chemin :

```text
src/main/java/com/ganatan/starter/person/infrastructure/adapter/out/postgresql/PostgreSqlPersonRepositoryAdapter.java
```

Code :

```java
package com.ganatan.starter.person.infrastructure.adapter.out.postgresql;

import com.ganatan.starter.person.application.port.out.PersonRepository;
import com.ganatan.starter.person.domain.Person;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;

public class PostgreSqlPersonRepositoryAdapter implements PersonRepository {

  private static final String SQL_FIND_ALL = """
      SELECT
        id,
        first_name,
        last_name,
        city_id
      FROM person
      """;

  private static final String SQL_FIND_BY_ID = """
      SELECT
        id,
        first_name,
        last_name,
        city_id
      FROM person
      WHERE id = ?
      """;

  private static final String SQL_CREATE = """
      INSERT INTO person (
        first_name,
        last_name,
        city_id
      )
      VALUES (?, ?, ?)
      RETURNING
        id,
        first_name,
        last_name,
        city_id
      """;

  private static final String SQL_UPDATE = """
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

  private static final String SQL_DELETE = """
      DELETE FROM person
      WHERE id = ?
      """;

  private final JdbcTemplate jdbcTemplate;

  public PostgreSqlPersonRepositoryAdapter(
      JdbcTemplate jdbcTemplate
  ) {
    this.jdbcTemplate = jdbcTemplate;
  }

  @Override
  public List<Person> findAll() {
    return jdbcTemplate.query(
        SQL_FIND_ALL,
        (resultSet, rowNumber) ->
            new Person(
                resultSet.getInt("id"),
                resultSet.getString("first_name"),
                resultSet.getString("last_name"),
                resultSet.getInt("city_id")
            )
    );
  }

  @Override
  public Optional<Person> findById(
      int id
  ) {
    return jdbcTemplate.query(
        SQL_FIND_BY_ID,
        (resultSet, rowNumber) ->
            new Person(
                resultSet.getInt("id"),
                resultSet.getString("first_name"),
                resultSet.getString("last_name"),
                resultSet.getInt("city_id")
            ),
        id
    )
    .stream()
    .findFirst();
  }

  @Override
  public Person create(
      Person person
  ) {
    return jdbcTemplate.queryForObject(
        SQL_CREATE,
        (resultSet, rowNumber) ->
            new Person(
                resultSet.getInt("id"),
                resultSet.getString("first_name"),
                resultSet.getString("last_name"),
                resultSet.getInt("city_id")
            ),
        person.firstName(),
        person.lastName(),
        person.cityId()
    );
  }

  @Override
  public Person update(
      Person person
  ) {
    return jdbcTemplate.queryForObject(
        SQL_UPDATE,
        (resultSet, rowNumber) ->
            new Person(
                resultSet.getInt("id"),
                resultSet.getString("first_name"),
                resultSet.getString("last_name"),
                resultSet.getInt("city_id")
            ),
        person.firstName(),
        person.lastName(),
        person.cityId(),
        person.id()
    );
  }

  @Override
  public void deleteById(
      int id
  ) {
    jdbcTemplate.update(
        SQL_DELETE,
        id
    );
  }

}
```

---

# Implémentation du port

La classe :

```java
public class PostgreSqlPersonRepositoryAdapter
    implements PersonRepository
```

implémente le même port que :

```text
InMemoryPersonRepository
```

Nous avons donc maintenant deux adapters possibles :

```text
                    PersonRepository
                          ↑
             ┌────────────┴────────────┐
             │                         │
InMemoryPersonRepository   PostgreSqlPersonRepositoryAdapter
             │                         │
             ↓                         ↓
        List<Person>                 JDBC
                                       ↓
                                  PostgreSQL
```

---

# findAll

Le port définit :

```java
List<Person> findAll();
```

L'adapter exécute :

```sql
SELECT
  id,
  first_name,
  last_name,
  city_id
FROM person
```

Puis transforme chaque ligne SQL en :

```text
Person
```

Flux :

```text
PostgreSQL
    ↓
ResultSet
    ↓
Person
    ↓
List<Person>
```

---

# findById

Requête :

```sql
SELECT
  id,
  first_name,
  last_name,
  city_id
FROM person
WHERE id = ?
```

Exemple :

```text
id = 1
```

Résultat :

```text
Optional<Person>
```

Si aucune ligne n'est trouvée :

```text
Optional.empty()
```

Le comportement du port reste donc identique à l'adapter mémoire.

---

# create

Requête :

```sql
INSERT INTO person (
  first_name,
  last_name,
  city_id
)
VALUES (?, ?, ?)
RETURNING
  id,
  first_name,
  last_name,
  city_id
```

PostgreSQL génère maintenant l'identifiant.

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

Exemple :

```json
{
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 8
}
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

Requête :

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

Exemple :

```text
id = 1
cityId = 10
```

La ligne correspondante est mise à jour dans PostgreSQL.

---

# deleteById

Requête :

```sql
DELETE FROM person
WHERE id = ?
```

L'adapter ne connaît aucune notion HTTP.

Il ne retourne pas :

```text
204
404
```

Cette responsabilité reste dans l'adapter entrant REST.

---

# Suppression de AtomicInteger

Avec l'adapter mémoire :

```text
AtomicInteger
```

était responsable de la génération des identifiants.

Avec PostgreSQL :

```text
GENERATED BY DEFAULT AS IDENTITY
```

prend cette responsabilité.

Nous avons donc :

```text
InMemory
   ↓
AtomicInteger
```

contre :

```text
PostgreSQL
   ↓
IDENTITY
```

Le port :

```text
PersonRepository
```

ne change pas.

---

# Refactor – PersonConfiguration

À l'étape précédente :

```java
@Bean
public PersonRepository personRepository() {
  return new InMemoryPersonRepository();
}
```

L'application utilisait l'adapter mémoire.

Nous allons remplacer uniquement cet adapter dans la configuration.

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
import com.ganatan.starter.person.infrastructure.adapter.out.postgresql.PostgreSqlPersonRepositoryAdapter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class PersonConfiguration {

  @Bean
  public PersonRepository personRepository(
      JdbcTemplate jdbcTemplate
  ) {
    return new PostgreSqlPersonRepositoryAdapter(
        jdbcTemplate
    );
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

# Ce qui change

Avant :

```text
PersonRepository
      ↑
InMemoryPersonRepository
```

Configuration :

```java
return new InMemoryPersonRepository();
```

Maintenant :

```text
PersonRepository
      ↑
PostgreSqlPersonRepositoryAdapter
```

Configuration :

```java
return new PostgreSqlPersonRepositoryAdapter(
    jdbcTemplate
);
```

---

# Ce qui ne change pas

Les classes suivantes ne changent pas :

```text
Person
PersonUseCase
PersonRepository
PersonService
PersonInputDto
PersonOutputDto
PersonController
PersonExceptionHandler
```

Le passage de :

```text
mémoire
```

à :

```text
PostgreSQL
```

est transparent pour le cœur de l'application.

---

# Inversion de dépendance

`PersonService` continue de dépendre uniquement de :

```text
PersonRepository
```

Il ne connaît pas :

```text
JdbcTemplate
JDBC
PostgreSQL
PostgreSqlPersonRepositoryAdapter
```

Architecture :

```text
PersonService
      ↓
PersonRepository
      ↑
PostgreSqlPersonRepositoryAdapter
      ↓
JdbcTemplate
      ↓
PostgreSQL
```

---

# Dépendances techniques

Les dépendances PostgreSQL sont situées dans l'infrastructure.

```text
infrastructure
      │
      ├── JdbcTemplate
      ├── JDBC
      └── PostgreSQL
```

Le domaine reste :

```text
domain
  │
  └── Person
```

sans dépendance technique.

---

# Test manuel

Démarrer PostgreSQL :

```bash
docker start springboot-postgres
```

Lancer Spring Boot :

```bash
mvn spring-boot:run
```

---

## GET /persons

```bash
curl http://localhost:3000/persons
```

Résultat :

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

## GET /persons/1

```bash
curl http://localhost:3000/persons/1
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

## POST /persons

```bash
curl -X POST http://localhost:3000/persons \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"Clint\",\"lastName\":\"Eastwood\",\"cityId\":8}"
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

## PUT /persons/1

```bash
curl -X PUT http://localhost:3000/persons/1 \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"Steven\",\"lastName\":\"Spielberg\",\"cityId\":10}"
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

## DELETE /persons/1

```bash
curl -X DELETE http://localhost:3000/persons/1
```

Résultat :

```text
204 No Content
```

---

# Vérification PostgreSQL

Entrer dans PostgreSQL :

```bash
docker exec -it springboot-postgres psql -U postgres -d springboot_starter
```

Afficher les personnes :

```sql
SELECT * FROM person;
```

Résultat :

```text
 id | first_name |   last_name    | city_id
----+------------+----------------+---------
  1 | Steven     | Spielberg      |       1
  2 | Martin     | Scorsese       |       2
  3 | Francis    | Ford Coppola   |       3
  4 | George     | Lucas          |       4
  5 | Quentin    | Tarantino      |       5
  6 | David      | Fincher        |       6
  7 | Spike      | Lee            |       7
```

Quitter :

```text
\q
```

---

# Tests existants

Les tests du domaine ne changent pas :

```text
PersonTests
```

Les tests du service peuvent continuer à utiliser :

```text
InMemoryPersonRepository
```

Exemple :

```java
PersonRepository repository =
    new InMemoryPersonRepository();

PersonService service =
    new PersonService(
        repository
    );
```

Cela permet de tester :

```text
PersonService
```

sans PostgreSQL.

---

# Pourquoi conserver InMemoryPersonRepository

Nous pouvons conserver :

```text
InMemoryPersonRepository
```

même si l'application utilise PostgreSQL.

Nous avons maintenant :

```text
PersonRepository
      ↑
      ├── InMemoryPersonRepository
      │
      └── PostgreSqlPersonRepositoryAdapter
```

Le premier peut être utilisé pour :

```text
tests unitaires
```

Le second pour :

```text
application réelle
```

---

# Tests unitaires

Les tests :

```text
PersonTests
PersonServiceTests
InMemoryPersonRepositoryTests
```

ne nécessitent pas PostgreSQL.

Ils testent :

```text
Domain
Application
Adapter Memory
```

indépendamment de l'infrastructure PostgreSQL.

---

# Build

PostgreSQL doit être démarré si le contexte Spring initialise la base pendant les tests.

Démarrer PostgreSQL :

```bash
docker start springboot-postgres
```

Puis :

```bash
mvn clean install
```

Lancer l'application :

```bash
mvn spring-boot:run
```

---

# Avant

Adapter mémoire :

```text
PersonService
      ↓
PersonRepository
      ↑
InMemoryPersonRepository
      ↓
List<Person>
      +
AtomicInteger
```

---

# Maintenant

Adapter PostgreSQL :

```text
PersonService
      ↓
PersonRepository
      ↑
PostgreSqlPersonRepositoryAdapter
      ↓
JdbcTemplate
      ↓
JDBC
      ↓
PostgreSQL
```

---

# Ce que démontre l'architecture hexagonale

Le changement :

```text
List<Person>
      ↓
PostgreSQL
```

n'a pas nécessité de modifier :

```text
Domain
Port IN
Use Case
Port OUT
Adapter REST
DTO
```

Nous avons uniquement remplacé :

```text
Adapter OUT
```

et modifié :

```text
Configuration Spring
```

---

# Flux GET

```text
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
PostgreSqlPersonRepositoryAdapter
      ↓
JdbcTemplate
      ↓
SELECT
      ↓
PostgreSQL
      ↓
ResultSet
      ↓
Person
      ↓
PersonOutputDto
      ↓
JSON
```

---

# Flux POST

```text
JSON
 ↓
PersonInputDto
 ↓
Person
 ↓
PersonController
 ↓
PersonUseCase
 ↓
PersonService
 ↓
PersonRepository
 ↓
PostgreSqlPersonRepositoryAdapter
 ↓
JdbcTemplate
 ↓
INSERT
 ↓
PostgreSQL
 ↓
Person
 ↓
PersonOutputDto
 ↓
JSON
```

---

# Architecture actuelle

```text
                       HTTP
                        │
                        ▼
                 Adapter IN REST
                        │
                        ▼
                     DTO
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
         PostgreSqlPersonRepositoryAdapter
                        │
                        ▼
                  JdbcTemplate
                        │
                        ▼
                      JDBC
                        │
                        ▼
                   PostgreSQL
```

---

# Architecture par package

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
    │       ├── memory
    │       │   └── InMemoryPersonRepository
    │       │
    │       └── postgresql
    │           └── PostgreSqlPersonRepositoryAdapter
    │
    └── config
        └── PersonConfiguration
```

---

# Dépendances

Le domaine :

```text
Person
```

ne dépend de rien.

L'application dépend du domaine :

```text
PersonUseCase
PersonRepository
PersonService
      ↓
Person
```

L'infrastructure dépend de l'application :

```text
PersonController
      ↓
PersonUseCase

PostgreSqlPersonRepositoryAdapter
      ↓
PersonRepository
```

L'infrastructure peut dépendre des frameworks :

```text
Spring MVC
JdbcTemplate
JDBC
PostgreSQL
```

---

# État du projet

Nous avons maintenant :

```text
Domain
+
Port IN
+
Use Case
+
Port OUT
+
Adapter IN REST
+
DTO
+
Adapter OUT PostgreSQL
```

Le CRUD REST utilise désormais une base PostgreSQL réelle.

---

# Limite actuelle

L'adapter PostgreSQL contient encore les requêtes SQL écrites manuellement :

```text
SELECT
INSERT
UPDATE
DELETE
```

Architecture :

```text
PostgreSqlPersonRepositoryAdapter
      ↓
JdbcTemplate
      ↓
SQL manuel
      ↓
PostgreSQL
```

Nous allons maintenant remplacer cette partie par :

```text
Spring Data JPA
Hibernate
```

Le port :

```text
PersonRepository
```

restera encore une fois inchangé.

---

# Étape suivante

Nous allons passer de :

```text
PersonRepository
      ↑
PostgreSqlPersonRepositoryAdapter
      ↓
JdbcTemplate
      ↓
SQL manuel
      ↓
PostgreSQL
```

à :

```text
PersonRepository
      ↑
JpaPersonRepositoryAdapter
      ↓
Spring Data JPA
      ↓
Hibernate
      ↓
JDBC
      ↓
PostgreSQL
```

Le domaine `Person` restera indépendant de JPA.

Nous ajouterons donc une entité spécifique à l'infrastructure :

```text
PersonEntity
```

Le domaine ne deviendra pas :

```java
@Entity
public record Person(...) {
}
```

Nous conserverons la séparation :

```text
Person
      ↓
Domain

PersonEntity
      ↓
Infrastructure JPA
```

Prochaine étape :

```text
011-jpa-hibernate.md
```

---

# Principes clés

- PostgreSQL est un détail d'infrastructure ;
- `PersonRepository` reste le port sortant ;
- `PostgreSqlPersonRepositoryAdapter` implémente ce port ;
- `JdbcTemplate` appartient à l'infrastructure ;
- les requêtes SQL appartiennent à l'adapter PostgreSQL ;
- `application.properties` et `application.yaml` sont deux formats possibles ;
- une seule configuration doit être utilisée ;
- le domaine ne connaît pas JDBC ;
- le domaine ne connaît pas PostgreSQL ;
- `PersonService` ne connaît pas PostgreSQL ;
- `PersonController` ne connaît pas PostgreSQL ;
- les DTO ne connaissent pas PostgreSQL ;
- l'adapter mémoire peut être conservé ;
- plusieurs adapters peuvent implémenter le même port ;
- la configuration Spring choisit l'adapter utilisé ;
- le changement de persistence ne modifie pas le cœur ;
- l'organisation reste en package by feature.

Architecture obtenue :

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
PostgreSqlPersonRepositoryAdapter
 ↓
JdbcTemplate
 ↓
JDBC
 ↓
PostgreSQL
```

Étape suivante :

```text
JPA / Hibernate
```