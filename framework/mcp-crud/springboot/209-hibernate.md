# JPA / Hibernate – Adapter OUT

Neuvième étape de l'architecture hexagonale pour le CRUD `Person`.

Objectif :

- remplacer l'accès PostgreSQL avec `JdbcTemplate` ;
- supprimer les requêtes SQL écrites manuellement ;
- utiliser Spring Data JPA ;
- utiliser Hibernate comme implémentation JPA ;
- conserver le port sortant `PersonRepository` ;
- conserver le domaine `Person` indépendant de JPA ;
- créer une entité de persistence spécifique ;
- créer un repository Spring Data spécifique à l'infrastructure ;
- créer un adapter entre le domaine et JPA ;
- conserver l'organisation en package by feature.

---

## Architecture

À l'étape précédente :

```text
PersonRepository
      ↑
PostgreSqlPersonRepositoryAdapter
      ↓
JdbcTemplate
      ↓
SQL manuel
      ↓
JDBC
      ↓
PostgreSQL
```

Nous allons maintenant utiliser :

```text
PersonRepository
      ↑
JpaPersonRepositoryAdapter
      ↓
SpringDataPersonRepository
      ↓
Spring Data JPA
      ↓
Hibernate
      ↓
JDBC
      ↓
PostgreSQL
```

Le cœur de l'application ne change pas.

---

# Architecture complète

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
PostgreSqlPersonRepositoryAdapter
 ↓
JdbcTemplate
 ↓
SQL
 ↓
PostgreSQL
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
JpaPersonRepositoryAdapter
 ↓
SpringDataPersonRepository
 ↓
Spring Data JPA
 ↓
Hibernate
 ↓
JDBC
 ↓
PostgreSQL
```

---

# Élément important

Le port sortant ne change pas.

```text
PersonRepository
```

reste :

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

Le cœur de l'application ne connaît donc toujours pas :

```text
JPA
Hibernate
Spring Data
JpaRepository
@Entity
PostgreSQL
```

---

# Domain et persistence

Le domaine possède :

```text
Person
```

La persistence JPA possédera :

```text
PersonEntity
```

Nous séparons volontairement les deux modèles.

```text
Domain
  │
  └── Person

Infrastructure
  │
  └── PersonEntity
```

Le domaine reste indépendant de JPA.

---

# Mauvaise approche

Nous ne faisons pas :

```java
@Entity
public record Person(
    int id,
    String firstName,
    String lastName,
    int cityId
) {
}
```

Cela introduirait directement JPA dans le domaine.

Nous aurions :

```text
Person
  ↓
JPA
```

Ce que nous voulons éviter.

---

# Approche retenue

Nous conservons :

```text
Person
```

comme modèle métier.

Et nous créons :

```text
PersonEntity
```

pour Hibernate.

Architecture :

```text
Person
  ↑
mapping
  ↓
PersonEntity
```

La conversion sera réalisée dans l'infrastructure.

---

# Package by feature

L'organisation reste basée sur la feature.

```text
com.ganatan.starter
├── person
├── city
└── country
```

Pour `person` :

```text
person
├── domain
├── application
└── infrastructure
```

JPA appartient à :

```text
person.infrastructure.adapter.out.jpa
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
    │       ├── postgresql/
    │       │   └── PostgreSqlPersonRepositoryAdapter.java
    │       │
    │       └── jpa/
    │           ├── PersonEntity.java
    │           ├── SpringDataPersonRepository.java
    │           └── JpaPersonRepositoryAdapter.java
    │
    └── config/
        └── PersonConfiguration.java
```

---

# Dépendance Maven

L'étape précédente utilisait :

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
```

Nous allons maintenant utiliser Spring Data JPA.

Ajouter :

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

Conserver le driver PostgreSQL :

```xml
<dependency>
  <groupId>org.postgresql</groupId>
  <artifactId>postgresql</artifactId>
  <scope>runtime</scope>
</dependency>
```

La dépendance :

```text
spring-boot-starter-data-jpa
```

apporte notamment :

```text
Spring Data JPA
JPA
Hibernate
JDBC
```

---

# Dépendances retenues

Nous avons maintenant :

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<dependency>
  <groupId>org.postgresql</groupId>
  <artifactId>postgresql</artifactId>
  <scope>runtime</scope>
</dependency>
```

La dépendance JDBC ajoutée précédemment peut être supprimée :

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
```

car Spring Data JPA apporte déjà l'infrastructure JDBC nécessaire.

---

# Configuration

Deux formats sont possibles :

```text
application.properties
```

ou :

```text
application.yaml
```

Une seule des deux configurations doit être utilisée.

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

spring.jpa.hibernate.ddl-auto=none
spring.jpa.open-in-view=false
spring.jpa.show-sql=true

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

  jpa:
    hibernate:
      ddl-auto: none
    open-in-view: false
    show-sql: true

  sql:
    init:
      mode: always

server:
  port: 3000
```

---

# ddl-auto

Nous utilisons :

```text
ddl-auto=none
```

car la table est déjà créée avec :

```text
schema.sql
```

Hibernate ne doit donc pas :

```text
créer
modifier
supprimer
```

la structure de la base.

---

# open-in-view

Nous utilisons :

```text
spring.jpa.open-in-view=false
```

Le contexte JPA n'est donc pas conservé artificiellement pendant toute la requête HTTP.

Dans notre architecture :

```text
Controller
```

ne doit pas dépendre du fonctionnement interne de Hibernate.

---

# show-sql

La propriété :

```text
spring.jpa.show-sql=true
```

permet de visualiser les requêtes SQL générées par Hibernate.

Elle est utile pour ce tutoriel.

---

# schema.sql

Le fichier peut rester identique.

Chemin :

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

# data.sql

Le fichier peut également rester identique.

Chemin :

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

---

# PersonEntity

Nous créons maintenant le modèle utilisé par Hibernate.

Chemin :

```text
src/main/java/com/ganatan/starter/person/infrastructure/adapter/out/jpa/PersonEntity.java
```

---

# Code – PersonEntity.java

```java
package com.ganatan.starter.person.infrastructure.adapter.out.jpa;

import com.ganatan.starter.person.domain.Person;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "person")
public class PersonEntity {

  @Id
  @GeneratedValue(
      strategy = GenerationType.IDENTITY
  )
  private Integer id;

  @Column(
      name = "first_name",
      nullable = false,
      length = 50
  )
  private String firstName;

  @Column(
      name = "last_name",
      nullable = false,
      length = 50
  )
  private String lastName;

  @Column(
      name = "city_id",
      nullable = false
  )
  private int cityId;

  protected PersonEntity() {
  }

  public PersonEntity(
      String firstName,
      String lastName,
      int cityId
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.cityId = cityId;
  }

  public Integer getId() {
    return id;
  }

  public String getFirstName() {
    return firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public int getCityId() {
    return cityId;
  }

  public void updateFrom(
      Person person
  ) {
    this.firstName =
        person.firstName();

    this.lastName =
        person.lastName();

    this.cityId =
        person.cityId();
  }

  public Person toDomain() {
    return new Person(
        id,
        firstName,
        lastName,
        cityId
    );
  }

  public static PersonEntity fromDomain(
      Person person
  ) {
    return new PersonEntity(
        person.firstName(),
        person.lastName(),
        person.cityId()
    );
  }

}
```

---

# Annotations JPA

`PersonEntity` utilise :

```text
@Entity
@Table
@Id
@GeneratedValue
@Column
```

Ces annotations restent dans :

```text
infrastructure
```

Elles n'apparaissent pas dans :

```text
domain
```

---

# @Entity

```java
@Entity
```

indique que :

```text
PersonEntity
```

est une entité gérée par JPA.

---

# @Table

```java
@Table(name = "person")
```

associe l'entité à :

```text
table person
```

---

# @Id

```java
@Id
```

identifie la clé primaire.

---

# @GeneratedValue

```java
@GeneratedValue(
    strategy = GenerationType.IDENTITY
)
```

indique que l'identifiant est généré par PostgreSQL.

Correspondance :

```text
Java
@GeneratedValue(IDENTITY)

        ↓

PostgreSQL
GENERATED BY DEFAULT AS IDENTITY
```

---

# @Column

Exemple :

```java
@Column(
    name = "first_name",
    nullable = false,
    length = 50
)
private String firstName;
```

Correspondance :

```text
PersonEntity       PostgreSQL

firstName      →   first_name
lastName       →   last_name
cityId         →   city_id
```

---

# Constructeur protégé

JPA nécessite un constructeur sans argument.

Nous utilisons :

```java
protected PersonEntity() {
}
```

Ce constructeur est destiné à Hibernate.

---

# Conversion domaine vers entité

Méthode :

```java
public static PersonEntity fromDomain(
    Person person
) {
  return new PersonEntity(
      person.firstName(),
      person.lastName(),
      person.cityId()
  );
}
```

Conversion :

```text
Person
  ↓
PersonEntity
```

---

# Conversion entité vers domaine

Méthode :

```java
public Person toDomain() {
  return new Person(
      id,
      firstName,
      lastName,
      cityId
  );
}
```

Conversion :

```text
PersonEntity
     ↓
   Person
```

---

# Séparation

Nous avons maintenant :

```text
Domain

Person
```

et :

```text
Infrastructure

PersonEntity
```

Le domaine ne connaît pas l'entité JPA.

---

# SpringDataPersonRepository

Nous allons maintenant créer un repository Spring Data.

Chemin :

```text
src/main/java/com/ganatan/starter/person/infrastructure/adapter/out/jpa/SpringDataPersonRepository.java
```

Code :

```java
package com.ganatan.starter.person.infrastructure.adapter.out.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataPersonRepository
    extends JpaRepository<PersonEntity, Integer> {
}
```

---

# JpaRepository

Spring Data fournit :

```text
JpaRepository
```

avec des méthodes déjà disponibles :

```text
findAll
findById
save
deleteById
existsById
count
```

Nous n'avons plus besoin d'écrire :

```text
SELECT
INSERT
UPDATE
DELETE
```

manuellement.

---

# Attention aux deux repositories

Nous avons maintenant deux interfaces différentes.

## Port hexagonal

```text
PersonRepository
```

Chemin :

```text
application.port.out
```

Il appartient au cœur de l'application.

---

## Repository Spring Data

```text
SpringDataPersonRepository
```

Chemin :

```text
infrastructure.adapter.out.jpa
```

Il appartient à l'infrastructure.

---

# Différence

```text
PersonRepository
      ↓
contrat de l'application
```

```text
SpringDataPersonRepository
      ↓
contrat technique Spring Data JPA
```

Le premier ne connaît pas Spring.

Le second dépend directement de Spring Data JPA.

---

# Adapter JPA

Il faut maintenant relier :

```text
PersonRepository
```

à :

```text
SpringDataPersonRepository
```

Nous créons :

```text
JpaPersonRepositoryAdapter
```

---

# Code – JpaPersonRepositoryAdapter.java

Chemin :

```text
src/main/java/com/ganatan/starter/person/infrastructure/adapter/out/jpa/JpaPersonRepositoryAdapter.java
```

Code :

```java
package com.ganatan.starter.person.infrastructure.adapter.out.jpa;

import com.ganatan.starter.person.application.port.out.PersonRepository;
import com.ganatan.starter.person.domain.Person;
import java.util.List;
import java.util.Optional;

public class JpaPersonRepositoryAdapter
    implements PersonRepository {

  private final SpringDataPersonRepository repository;

  public JpaPersonRepositoryAdapter(
      SpringDataPersonRepository repository
  ) {
    this.repository = repository;
  }

  @Override
  public List<Person> findAll() {
    return repository.findAll()
        .stream()
        .map(
            PersonEntity::toDomain
        )
        .toList();
  }

  @Override
  public Optional<Person> findById(
      int id
  ) {
    return repository.findById(
        id
    )
    .map(
        PersonEntity::toDomain
    );
  }

  @Override
  public Person create(
      Person person
  ) {
    PersonEntity entity =
        PersonEntity.fromDomain(
            person
        );

    PersonEntity saved =
        repository.save(
            entity
        );

    return saved.toDomain();
  }

  @Override
  public Person update(
      Person person
  ) {
    PersonEntity entity =
        repository.findById(
            person.id()
        )
        .orElseThrow();

    entity.updateFrom(
        person
    );

    PersonEntity saved =
        repository.save(
            entity
        );

    return saved.toDomain();
  }

  @Override
  public void deleteById(
      int id
  ) {
    repository.deleteById(
        id
    );
  }

}
```

---

# Adapter

La déclaration :

```java
public class JpaPersonRepositoryAdapter
    implements PersonRepository
```

signifie :

```text
JpaPersonRepositoryAdapter
          │
          │ implements
          ▼
   PersonRepository
```

Il s'agit toujours d'un adapter sortant.

---

# Dépendances de l'adapter

`JpaPersonRepositoryAdapter` connaît :

```text
PersonRepository
Person
PersonEntity
SpringDataPersonRepository
```

Il appartient à l'infrastructure.

C'est donc acceptable qu'il connaisse JPA.

---

# findAll

Implémentation :

```java
@Override
public List<Person> findAll() {
  return repository.findAll()
      .stream()
      .map(
          PersonEntity::toDomain
      )
      .toList();
}
```

Spring Data retourne :

```text
List<PersonEntity>
```

L'adapter convertit en :

```text
List<Person>
```

Flux :

```text
PostgreSQL
    ↓
Hibernate
    ↓
PersonEntity
    ↓
JpaPersonRepositoryAdapter
    ↓
Person
```

---

# findById

Implémentation :

```java
@Override
public Optional<Person> findById(
    int id
) {
  return repository.findById(
      id
  )
  .map(
      PersonEntity::toDomain
  );
}
```

Spring Data retourne :

```text
Optional<PersonEntity>
```

L'adapter retourne :

```text
Optional<Person>
```

Le port conserve donc exactement le même contrat.

---

# create

Implémentation :

```java
@Override
public Person create(
    Person person
) {
  PersonEntity entity =
      PersonEntity.fromDomain(
          person
      );

  PersonEntity saved =
      repository.save(
          entity
      );

  return saved.toDomain();
}
```

Flux :

```text
Person
  ↓
PersonEntity
  ↓
repository.save
  ↓
Hibernate
  ↓
INSERT
  ↓
PostgreSQL
  ↓
PersonEntity avec id
  ↓
Person
```

---

# Génération de l'identifiant

La création reçoit :

```java
new Person(
    0,
    "Clint",
    "Eastwood",
    8
);
```

`fromDomain` crée :

```text
PersonEntity
id = null
```

Hibernate effectue l'insertion.

PostgreSQL génère :

```text
id = 8
```

L'entité retournée possède alors :

```text
id = 8
```

La conversion produit :

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

Implémentation :

```java
@Override
public Person update(
    Person person
) {
  PersonEntity entity =
      repository.findById(
          person.id()
      )
      .orElseThrow();

  entity.updateFrom(
      person
  );

  PersonEntity saved =
      repository.save(
          entity
      );

  return saved.toDomain();
}
```

L'adapter :

```text
1. recherche l'entité
2. modifie ses propriétés
3. sauvegarde l'entité
4. retourne le domaine
```

---

# updateFrom

La méthode :

```java
public void updateFrom(
    Person person
)
```

effectue :

```text
Person
  ↓
mise à jour
  ↓
PersonEntity
```

Elle ne modifie pas :

```text
id
```

L'identifiant reste celui de l'entité chargée.

---

# deleteById

Implémentation :

```java
@Override
public void deleteById(
    int id
) {
  repository.deleteById(
      id
  );
}
```

Spring Data et Hibernate exécutent la suppression.

---

# SQL généré

Nous n'écrivons plus :

```sql
SELECT
INSERT
UPDATE
DELETE
```

dans le code Java.

Hibernate génère les requêtes SQL.

Avec :

```properties
spring.jpa.show-sql=true
```

ou :

```yaml
spring:
  jpa:
    show-sql: true
```

les requêtes sont visibles dans la console.

---

# Avant – JdbcTemplate

```text
PostgreSqlPersonRepositoryAdapter
      ↓
JdbcTemplate
      ↓
SQL manuel
```

Le code contenait :

```text
SQL_FIND_ALL
SQL_FIND_BY_ID
SQL_CREATE
SQL_UPDATE
SQL_DELETE
```

---

# Maintenant – JPA

```text
JpaPersonRepositoryAdapter
      ↓
SpringDataPersonRepository
      ↓
JpaRepository
      ↓
Hibernate
```

Les requêtes SQL manuelles disparaissent.

---

# Configuration Spring

Nous devons maintenant remplacer l'adapter PostgreSQL JDBC par l'adapter JPA.

---

# Avant

```java
@Bean
public PersonRepository personRepository(
    JdbcTemplate jdbcTemplate
) {
  return new PostgreSqlPersonRepositoryAdapter(
      jdbcTemplate
  );
}
```

---

# Maintenant

```java
@Bean
public PersonRepository personRepository(
    SpringDataPersonRepository repository
) {
  return new JpaPersonRepositoryAdapter(
      repository
  );
}
```

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
import com.ganatan.starter.person.infrastructure.adapter.out.jpa.JpaPersonRepositoryAdapter;
import com.ganatan.starter.person.infrastructure.adapter.out.jpa.SpringDataPersonRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PersonConfiguration {

  @Bean
  public PersonRepository personRepository(
      SpringDataPersonRepository repository
  ) {
    return new JpaPersonRepositoryAdapter(
        repository
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

# Assemblage

Spring crée automatiquement :

```text
SpringDataPersonRepository
```

car cette interface étend :

```text
JpaRepository
```

Puis notre configuration crée :

```text
JpaPersonRepositoryAdapter
```

et l'expose comme :

```text
PersonRepository
```

Puis :

```text
PersonRepository
```

est injecté dans :

```text
PersonService
```

Enfin :

```text
PersonUseCase
```

est injecté dans :

```text
PersonController
```

---

# Assemblage complet

```text
Spring Data
     ↓
SpringDataPersonRepository
     ↓
JpaPersonRepositoryAdapter
     ↓
PersonRepository
     ↓
PersonService
     ↓
PersonUseCase
     ↓
PersonController
```

---

# Ce qui change

Nous remplaçons :

```text
PostgreSqlPersonRepositoryAdapter
```

par :

```text
JpaPersonRepositoryAdapter
```

Nous ajoutons :

```text
PersonEntity
SpringDataPersonRepository
```

Nous remplaçons :

```text
JdbcTemplate
```

par :

```text
Spring Data JPA
Hibernate
```

---

# Ce qui ne change pas

Les éléments suivants restent identiques :

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

C'est le point essentiel.

---

# Port stable

Depuis l'adapter mémoire :

```text
PersonRepository
```

n'a jamais changé.

Nous avons successivement utilisé :

```text
PersonRepository
      ↑
InMemoryPersonRepository
```

puis :

```text
PersonRepository
      ↑
PostgreSqlPersonRepositoryAdapter
```

puis :

```text
PersonRepository
      ↑
JpaPersonRepositoryAdapter
```

---

# Trois adapters

Nous pouvons maintenant conserver trois implementations :

```text
                         PersonRepository
                               ↑
            ┌──────────────────┼──────────────────┐
            │                  │                  │
            │                  │                  │
InMemoryPersonRepository       │      JpaPersonRepositoryAdapter
                               │                  │
                               │                  ↓
                               │         Spring Data JPA
                               │                  ↓
                               │              Hibernate
                               │                  ↓
                               │             PostgreSQL
                               │
              PostgreSqlPersonRepositoryAdapter
                               │
                               ↓
                          JdbcTemplate
                               ↓
                           PostgreSQL
```

La configuration décide lequel est utilisé.

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
                JpaPersonRepositoryAdapter
                          │
                          ▼
              SpringDataPersonRepository
                          │
                          ▼
                  Spring Data JPA
                          │
                          ▼
                      Hibernate
                          │
                          ▼
                        JDBC
                          │
                          ▼
                     PostgreSQL
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
JpaPersonRepositoryAdapter
      ↓
SpringDataPersonRepository
      ↓
Hibernate
      ↓
SELECT
      ↓
PostgreSQL
      ↓
PersonEntity
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
JpaPersonRepositoryAdapter
 ↓
PersonEntity
 ↓
SpringDataPersonRepository
 ↓
Hibernate
 ↓
INSERT
 ↓
PostgreSQL
 ↓
PersonEntity
 ↓
Person
 ↓
PersonOutputDto
 ↓
JSON
```

---

# Flux UPDATE

```text
PUT /persons/1
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
JpaPersonRepositoryAdapter
      ↓
findById
      ↓
PersonEntity
      ↓
updateFrom
      ↓
save
      ↓
Hibernate
      ↓
UPDATE
      ↓
PostgreSQL
```

---

# Test manuel

Démarrer PostgreSQL :

```bash
docker start springboot-postgres
```

Lancer l'application :

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

## PUT

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

## DELETE

```bash
curl -X DELETE http://localhost:3000/persons/1
```

Résultat :

```text
204 No Content
```

---

# Vérification PostgreSQL

Connexion :

```bash
docker exec -it springboot-postgres psql -U postgres -d springboot_starter
```

Requête :

```sql
SELECT * FROM person;
```

Quitter :

```text
\q
```

---

# Tests du domaine

Les tests :

```text
PersonTests
```

ne changent pas.

Ils n'ont aucune dépendance JPA.

---

# Tests du service

Les tests :

```text
PersonServiceTests
```

peuvent toujours utiliser :

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

Le service peut donc être testé sans :

```text
Spring
Hibernate
PostgreSQL
```

---

# Tests du Controller

Les tests du Controller peuvent également continuer à utiliser :

```text
InMemoryPersonRepository
```

Chaîne de test :

```text
PersonController
      ↓
PersonService
      ↓
InMemoryPersonRepository
```

Aucune base n'est nécessaire pour tester l'adapter REST isolément.

---

# Test de l'adapter JPA

L'adapter JPA possède une responsabilité spécifique :

```text
Person
      ↕
PersonEntity
      ↕
Spring Data JPA
```

Les tests d'intégration pourront vérifier séparément :

```text
JpaPersonRepositoryAdapter
      ↓
Hibernate
      ↓
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
    │       ├── postgresql
    │       │   └── PostgreSqlPersonRepositoryAdapter
    │       │
    │       └── jpa
    │           ├── PersonEntity
    │           ├── SpringDataPersonRepository
    │           └── JpaPersonRepositoryAdapter
    │
    └── config
        └── PersonConfiguration
```

---

# Package by feature avec plusieurs fonctionnalités

Plus tard :

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

Chaque feature possède sa propre architecture hexagonale.

Exemple :

```text
person
  ↓
Person
PersonUseCase
PersonRepository
PersonService
PersonController
PersonEntity
JpaPersonRepositoryAdapter
```

Puis :

```text
city
  ↓
City
CityUseCase
CityRepository
CityService
CityController
CityEntity
JpaCityRepositoryAdapter
```

---

# Avant – architecture layered

Dans une architecture layered classique, nous aurions souvent :

```text
PersonController
      ↓
PersonService
      ↓
SpringDataPersonRepository
      ↓
Hibernate
      ↓
PostgreSQL
```

Le service connaît alors directement un repository technique.

---

# Architecture hexagonale

Ici :

```text
PersonController
      ↓
PersonUseCase
      ↓
PersonService
      ↓
PersonRepository
      ↑
JpaPersonRepositoryAdapter
      ↓
SpringDataPersonRepository
      ↓
Hibernate
      ↓
PostgreSQL
```

La frontière importante est :

```text
PersonRepository
```

C'est notre port.

---

# Inversion de dépendance

Le cœur définit :

```text
PersonRepository
```

L'infrastructure implémente :

```text
JpaPersonRepositoryAdapter
```

Donc :

```text
Application
      ↓
PersonRepository
      ↑
Infrastructure
```

L'infrastructure dépend du contrat du cœur.

Le cœur ne dépend pas de l'infrastructure.

---

# Domain

Le domaine reste simplement :

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

Aucune annotation :

```text
@Entity
@Table
@Id
@Column
```

Aucune dépendance :

```text
Spring
JPA
Hibernate
PostgreSQL
```

---

# Infrastructure JPA

Toutes les notions techniques restent ici :

```text
infrastructure.adapter.out.jpa
```

avec :

```text
PersonEntity
SpringDataPersonRepository
JpaPersonRepositoryAdapter
```

---

# Build

Démarrer PostgreSQL :

```bash
docker start springboot-postgres
```

Compiler :

```bash
mvn clean install
```

Lancer :

```bash
mvn spring-boot:run
```

---

# Évolution complète

Nous sommes partis de :

```text
Person
```

Puis :

```text
Person
  ↑
PersonRepository
```

Puis :

```text
PersonRepository
      ↑
InMemoryPersonRepository
```

Puis :

```text
PersonUseCase
      ↑
PersonService
      ↓
PersonRepository
```

Puis :

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
Memory
```

Puis :

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
JdbcTemplate
 ↓
PostgreSQL
```

Et maintenant :

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
JpaPersonRepositoryAdapter
 ↓
Spring Data JPA
 ↓
Hibernate
 ↓
PostgreSQL
```

---

# État du projet

Nous avons maintenant une architecture hexagonale complète :

```text
Adapter IN
    ↓
Port IN
    ↓
Application
    ↓
Port OUT
    ↓
Adapter OUT
```

Concrètement :

```text
PersonController
      ↓
PersonUseCase
      ↓
PersonService
      ↓
PersonRepository
      ↓
JpaPersonRepositoryAdapter
      ↓
SpringDataPersonRepository
      ↓
Hibernate
      ↓
PostgreSQL
```

Avec le domaine :

```text
Person
```

indépendant au centre.

---

# Résultat

La technologie de persistence a changé trois fois.

### Version 1

```text
PersonRepository
      ↑
InMemoryPersonRepository
      ↓
List<Person>
```

### Version 2

```text
PersonRepository
      ↑
PostgreSqlPersonRepositoryAdapter
      ↓
JdbcTemplate
      ↓
PostgreSQL
```

### Version 3

```text
PersonRepository
      ↑
JpaPersonRepositoryAdapter
      ↓
Spring Data JPA
      ↓
Hibernate
      ↓
PostgreSQL
```

Mais les éléments suivants n'ont pas changé :

```text
Person
PersonUseCase
PersonRepository
PersonService
PersonController
PersonInputDto
PersonOutputDto
```

C'est l'un des objectifs principaux de l'architecture hexagonale.

---

# Principes clés

- `Person` reste le modèle du domaine ;
- `Person` ne devient pas une entité JPA ;
- `PersonEntity` appartient à l'infrastructure ;
- `PersonRepository` reste le port sortant ;
- `SpringDataPersonRepository` est un repository technique ;
- `JpaPersonRepositoryAdapter` adapte Spring Data au port de l'application ;
- l'application ne dépend pas de `JpaRepository` ;
- l'application ne dépend pas de Hibernate ;
- le domaine ne dépend pas de JPA ;
- le domaine ne dépend pas de PostgreSQL ;
- les conversions `Person` / `PersonEntity` restent dans l'infrastructure ;
- Spring Data génère l'implémentation du repository JPA ;
- Hibernate génère les requêtes SQL ;
- la configuration Spring choisit l'adapter utilisé ;
- `application.properties` et `application.yaml` sont deux formats possibles ;
- une seule configuration doit être utilisée ;
- l'organisation reste en package by feature ;
- plusieurs adapters peuvent implémenter le même port ;
- changer la persistence ne modifie pas le cœur de l'application.

Architecture obtenue :

```text
HTTP
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
JpaPersonRepositoryAdapter
 ↓
SpringDataPersonRepository
 ↓
Spring Data JPA
 ↓
Hibernate
 ↓
JDBC
 ↓
PostgreSQL
```

Étape suivante :

```text
012-tests.md
```