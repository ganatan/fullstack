# Tests – Architecture hexagonale

Dixième et dernière étape de l'architecture hexagonale pour le CRUD `Person`.

Objectif :

* tester le domaine indépendamment de Spring ;
* tester le service indépendamment de Spring ;
* tester l'adapter mémoire ;
* tester l'adapter REST indépendamment de la persistence ;
* tester l'adapter JPA avec une vraie base PostgreSQL ;
* utiliser Testcontainers pour les tests d'intégration ;
* conserver les frontières de l'architecture hexagonale ;
* éviter de démarrer toute l'application lorsque ce n'est pas nécessaire ;
* conserver l'organisation en package by feature.

---

# Architecture testée

L'architecture finale est :

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
 ↑
JpaPersonRepositoryAdapter
 ↓
SpringDataPersonRepository
 ↓
Spring Data JPA
 ↓
Hibernate
 ↓
PostgreSQL
```

Nous ne testons pas toute cette chaîne de la même manière.

Chaque partie possède son propre niveau de test.

---

# Stratégie

Nous allons utiliser plusieurs types de tests :

```text
Tests unitaires
    ↓
Domain
Service
Adapter mémoire

Tests Web
    ↓
Controller
DTO
ExceptionHandler

Tests d'intégration
    ↓
JpaPersonRepositoryAdapter
Spring Data JPA
Hibernate
PostgreSQL
```

---

# Principe

Une architecture hexagonale permet de tester séparément :

```text
Domain

Application

Adapter IN

Adapter OUT
```

Nous pouvons donc isoler chaque responsabilité.

---

# Structure des tests

```text
src/test/java/com/ganatan/starter/person/

├── domain/
│   └── PersonTests.java
│
├── application/
│   └── service/
│       └── PersonServiceTests.java
│
└── infrastructure/
    └── adapter/
        ├── in/
        │   └── rest/
        │       └── PersonControllerTests.java
        │
        └── out/
            ├── memory/
            │   └── InMemoryPersonRepositoryTests.java
            │
            └── jpa/
                └── JpaPersonRepositoryAdapterTests.java
```

---

# Dépendances Maven

Spring Boot fournit les principales bibliothèques de test avec :

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-test</artifactId>
  <scope>test</scope>
</dependency>
```

Nous ajoutons Testcontainers pour PostgreSQL :

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-testcontainers</artifactId>
  <scope>test</scope>
</dependency>

<dependency>
  <groupId>org.testcontainers</groupId>
  <artifactId>testcontainers-junit-jupiter</artifactId>
  <scope>test</scope>
</dependency>

<dependency>
  <groupId>org.testcontainers</groupId>
  <artifactId>testcontainers-postgresql</artifactId>
  <scope>test</scope>
</dependency>
```

Avec Spring Boot, les versions peuvent être gérées par le dependency management du projet.

---

# Dépendances de test

Nous avons donc :

```text
JUnit

AssertJ

Mockito

MockMvc

Spring Test

Testcontainers

PostgreSQL
```

---

# Pourquoi Testcontainers

Nous pourrions utiliser une base H2 pour tester JPA.

Nous ne le faisons pas.

Notre application utilise :

```text
PostgreSQL
```

Nous voulons donc tester :

```text
Hibernate
    ↓
JDBC PostgreSQL
    ↓
vrai PostgreSQL
```

et non :

```text
Hibernate
    ↓
H2
```

Cela évite les différences de comportement entre :

```text
H2

et

PostgreSQL
```

---

# Répartition des tests

```text
PersonTests
    ↓
Domain uniquement

PersonServiceTests
    ↓
Application
    ↓
InMemoryPersonRepository

InMemoryPersonRepositoryTests
    ↓
Adapter mémoire

PersonControllerTests
    ↓
Adapter REST
    ↓
PersonUseCase mocké

JpaPersonRepositoryAdapterTests
    ↓
Adapter JPA
    ↓
Hibernate
    ↓
PostgreSQL Testcontainers
```

---

# Tests du domaine

Le domaine :

```text
Person
```

ne dépend de rien.

Nous pouvons donc le tester avec JUnit uniquement.

Chemin :

```text
src/test/java/com/ganatan/starter/person/domain/PersonTests.java
```

---

# Code – PersonTests.java

```java
package com.ganatan.starter.person.domain;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class PersonTests {

  @Test
  void shouldCreatePerson() {

    Person person =
        new Person(
            1,
            "Steven",
            "Spielberg",
            1
        );

    assertThat(
        person.id()
    ).isEqualTo(
        1
    );

    assertThat(
        person.firstName()
    ).isEqualTo(
        "Steven"
    );

    assertThat(
        person.lastName()
    ).isEqualTo(
        "Spielberg"
    );

    assertThat(
        person.cityId()
    ).isEqualTo(
        1
    );

  }

}
```

---

# Dépendances du test

Ce test utilise uniquement :

```text
Person

JUnit

AssertJ
```

Il ne connaît pas :

```text
Spring

JPA

Hibernate

PostgreSQL
```

---

# Test du domaine

Architecture du test :

```text
PersonTests
    ↓
Person
```

Il s'agit d'un test unitaire pur.

---

# Tests de l'adapter mémoire

Nous allons également tester :

```text
InMemoryPersonRepository
```

Cet adapter implémente :

```text
PersonRepository
```

Chemin :

```text
src/test/java/com/ganatan/starter/person/infrastructure/adapter/out/memory/InMemoryPersonRepositoryTests.java
```

---

# Code – InMemoryPersonRepositoryTests.java

```java
package com.ganatan.starter.person.infrastructure.adapter.out.memory;

import com.ganatan.starter.person.application.port.out.PersonRepository;
import com.ganatan.starter.person.domain.Person;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class InMemoryPersonRepositoryTests {

  private PersonRepository repository;

  @BeforeEach
  void setUp() {

    repository =
        new InMemoryPersonRepository();

  }

  @Test
  void findAllShouldReturnSevenPersons() {

    List<Person> persons =
        repository.findAll();

    assertThat(
        persons
    ).hasSize(
        7
    );

  }

  @Test
  void findByIdShouldReturnPerson() {

    Optional<Person> person =
        repository.findById(
            1
        );

    assertThat(
        person
    ).isPresent();

    assertThat(
        person.get().firstName()
    ).isEqualTo(
        "Steven"
    );

    assertThat(
        person.get().lastName()
    ).isEqualTo(
        "Spielberg"
    );

  }

  @Test
  void findByIdShouldReturnEmptyWhenPersonDoesNotExist() {

    Optional<Person> person =
        repository.findById(
            999
        );

    assertThat(
        person
    ).isEmpty();

  }

  @Test
  void createShouldCreatePerson() {

    Person person =
        new Person(
            0,
            "Clint",
            "Eastwood",
            8
        );

    Person created =
        repository.create(
            person
        );

    assertThat(
        created.id()
    ).isEqualTo(
        8
    );

    assertThat(
        created.firstName()
    ).isEqualTo(
        "Clint"
    );

    assertThat(
        created.lastName()
    ).isEqualTo(
        "Eastwood"
    );

    assertThat(
        created.cityId()
    ).isEqualTo(
        8
    );

  }

  @Test
  void updateShouldUpdatePerson() {

    Person person =
        new Person(
            1,
            "Steven",
            "Spielberg",
            10
        );

    Person updated =
        repository.update(
            person
        );

    assertThat(
        updated.id()
    ).isEqualTo(
        1
    );

    assertThat(
        updated.cityId()
    ).isEqualTo(
        10
    );

  }

  @Test
  void deleteByIdShouldDeletePerson() {

    repository.deleteById(
        1
    );

    Optional<Person> person =
        repository.findById(
            1
        );

    assertThat(
        person
    ).isEmpty();

  }

}
```

---

# Test du port OUT

Même si nous instancions :

```java
new InMemoryPersonRepository()
```

la variable est déclarée avec :

```java
PersonRepository
```

Nous testons donc l'adapter à travers le contrat du port :

```text
PersonRepository
       ↑
InMemoryPersonRepository
```

---

# Tests du service

Le service représente la couche :

```text
application
```

Il dépend uniquement du port :

```text
PersonRepository
```

Nous pouvons donc utiliser :

```text
InMemoryPersonRepository
```

pour le tester.

Aucune base de données n'est nécessaire.

Chemin :

```text
src/test/java/com/ganatan/starter/person/application/service/PersonServiceTests.java
```

---

# Architecture du test

```text
PersonServiceTests
       ↓
PersonService
       ↓
PersonRepository
       ↑
InMemoryPersonRepository
```

Aucune dépendance :

```text
JPA

Hibernate

PostgreSQL
```

---

# Code – PersonServiceTests.java

```java
package com.ganatan.starter.person.application.service;

import com.ganatan.starter.person.application.exception.PersonNotFoundException;
import com.ganatan.starter.person.application.port.out.PersonRepository;
import com.ganatan.starter.person.domain.Person;
import com.ganatan.starter.person.infrastructure.adapter.out.memory.InMemoryPersonRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PersonServiceTests {

  private PersonService service;

  @BeforeEach
  void setUp() {

    PersonRepository repository =
        new InMemoryPersonRepository();

    service =
        new PersonService(
            repository
        );

  }

  @Test
  void getAllShouldReturnSevenPersons() {

    List<Person> persons =
        service.getAll();

    assertThat(
        persons
    ).hasSize(
        7
    );

  }

  @Test
  void getByIdShouldReturnPerson() {

    Person person =
        service.getById(
            1
        );

    assertThat(
        person.id()
    ).isEqualTo(
        1
    );

    assertThat(
        person.firstName()
    ).isEqualTo(
        "Steven"
    );

    assertThat(
        person.lastName()
    ).isEqualTo(
        "Spielberg"
    );

  }

  @Test
  void getByIdShouldThrowExceptionWhenPersonDoesNotExist() {

    assertThatThrownBy(
        () -> service.getById(
            999
        )
    )
    .isInstanceOf(
        PersonNotFoundException.class
    );

  }

  @Test
  void createShouldCreatePerson() {

    Person person =
        new Person(
            0,
            "Clint",
            "Eastwood",
            8
        );

    Person created =
        service.create(
            person
        );

    assertThat(
        created.id()
    ).isEqualTo(
        8
    );

    assertThat(
        created.firstName()
    ).isEqualTo(
        "Clint"
    );

    assertThat(
        created.lastName()
    ).isEqualTo(
        "Eastwood"
    );

    assertThat(
        created.cityId()
    ).isEqualTo(
        8
    );

  }

  @Test
  void updateShouldUpdatePerson() {

    Person person =
        new Person(
            1,
            "Steven",
            "Spielberg",
            10
        );

    Person updated =
        service.update(
            person
        );

    assertThat(
        updated.id()
    ).isEqualTo(
        1
    );

    assertThat(
        updated.cityId()
    ).isEqualTo(
        10
    );

  }

  @Test
  void updateShouldThrowExceptionWhenPersonDoesNotExist() {

    Person person =
        new Person(
            999,
            "Unknown",
            "Person",
            1
        );

    assertThatThrownBy(
        () -> service.update(
            person
        )
    )
    .isInstanceOf(
        PersonNotFoundException.class
    );

  }

  @Test
  void deleteByIdShouldDeletePerson() {

    service.deleteById(
        1
    );

    assertThatThrownBy(
        () -> service.getById(
            1
        )
    )
    .isInstanceOf(
        PersonNotFoundException.class
    );

  }

  @Test
  void deleteByIdShouldThrowExceptionWhenPersonDoesNotExist() {

    assertThatThrownBy(
        () -> service.deleteById(
            999
        )
    )
    .isInstanceOf(
        PersonNotFoundException.class
    );

  }

}
```

---

# Point important

Le test :

```text
PersonServiceTests
```

ne démarre pas Spring.

Nous n'utilisons pas :

```java
@SpringBootTest
```

Le service est créé directement :

```java
new PersonService(
    repository
)
```

C'est possible parce que :

```text
PersonService
```

ne dépend pas directement de Spring.

---

# Avantage

Nous testons :

```text
logique applicative
```

sans tester :

```text
framework

HTTP

JPA

PostgreSQL
```

Le test reste :

```text
rapide

isolé

simple
```

---

# Tests du Controller

Nous allons maintenant tester l'adapter entrant :

```text
PersonController
```

Le Controller dépend du port :

```text
PersonUseCase
```

Pour ce test, nous ne voulons pas démarrer :

```text
PersonService

PersonRepository

Hibernate

PostgreSQL
```

Nous allons donc remplacer :

```text
PersonUseCase
```

par un mock Mockito.

---

# Architecture du test Controller

```text
HTTP simulé
    ↓
MockMvc
    ↓
PersonController
    ↓
PersonUseCase
    ↓
Mockito
```

---

# @WebMvcTest

Nous utilisons :

```java
@WebMvcTest(
    PersonController.class
)
```

Cette annotation charge uniquement la partie Spring MVC nécessaire au test.

Nous n'avons donc pas besoin de charger :

```text
JPA

Hibernate

DataSource

PostgreSQL
```

---

# @MockitoBean

Nous remplaçons :

```text
PersonUseCase
```

par un mock :

```java
@MockitoBean
private PersonUseCase personUseCase;
```

Le Controller reçoit donc un faux port entrant.

---

# Chemin

```text
src/test/java/com/ganatan/starter/person/infrastructure/adapter/in/rest/PersonControllerTests.java
```

---

# Code – PersonControllerTests.java

```java
package com.ganatan.starter.person.infrastructure.adapter.in.rest;

import com.ganatan.starter.person.application.port.in.PersonUseCase;
import com.ganatan.starter.person.domain.Person;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(
    PersonController.class
)
class PersonControllerTests {

  @Autowired
  private MockMvc mockMvc;

  @MockitoBean
  private PersonUseCase personUseCase;

  @Test
  void getAllShouldReturnPersons()
      throws Exception {

    when(
        personUseCase.getAll()
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

    mockMvc.perform(
        get(
            "/persons"
        )
    )
    .andExpect(
        status().isOk()
    )
    .andExpect(
        jsonPath(
            "$[0].id"
        ).value(
            1
        )
    )
    .andExpect(
        jsonPath(
            "$[0].firstName"
        ).value(
            "Steven"
        )
    )
    .andExpect(
        jsonPath(
            "$[1].id"
        ).value(
            2
        )
    );

  }

  @Test
  void getByIdShouldReturnPerson()
      throws Exception {

    when(
        personUseCase.getById(
            1
        )
    ).thenReturn(
        new Person(
            1,
            "Steven",
            "Spielberg",
            1
        )
    );

    mockMvc.perform(
        get(
            "/persons/1"
        )
    )
    .andExpect(
        status().isOk()
    )
    .andExpect(
        jsonPath(
            "$.id"
        ).value(
            1
        )
    )
    .andExpect(
        jsonPath(
            "$.firstName"
        ).value(
            "Steven"
        )
    )
    .andExpect(
        jsonPath(
            "$.lastName"
        ).value(
            "Spielberg"
        )
    );

  }

  @Test
  void createShouldReturnCreatedPerson()
      throws Exception {

    when(
        personUseCase.create(
            any(
                Person.class
            )
        )
    ).thenReturn(
        new Person(
            8,
            "Clint",
            "Eastwood",
            8
        )
    );

    mockMvc.perform(
        post(
            "/persons"
        )
        .contentType(
            "application/json"
        )
        .content(
            """
            {
              "firstName": "Clint",
              "lastName": "Eastwood",
              "cityId": 8
            }
            """
        )
    )
    .andExpect(
        status().isCreated()
    )
    .andExpect(
        jsonPath(
            "$.id"
        ).value(
            8
        )
    )
    .andExpect(
        jsonPath(
            "$.firstName"
        ).value(
            "Clint"
        )
    )
    .andExpect(
        jsonPath(
            "$.lastName"
        ).value(
            "Eastwood"
        )
    )
    .andExpect(
        jsonPath(
            "$.cityId"
        ).value(
            8
        )
    );

  }

  @Test
  void updateShouldReturnUpdatedPerson()
      throws Exception {

    when(
        personUseCase.update(
            any(
                Person.class
            )
        )
    ).thenReturn(
        new Person(
            1,
            "Steven",
            "Spielberg",
            10
        )
    );

    mockMvc.perform(
        put(
            "/persons/1"
        )
        .contentType(
            "application/json"
        )
        .content(
            """
            {
              "firstName": "Steven",
              "lastName": "Spielberg",
              "cityId": 10
            }
            """
        )
    )
    .andExpect(
        status().isOk()
    )
    .andExpect(
        jsonPath(
            "$.id"
        ).value(
            1
        )
    )
    .andExpect(
        jsonPath(
            "$.cityId"
        ).value(
            10
        )
    );

  }

  @Test
  void deleteShouldReturnNoContent()
      throws Exception {

    mockMvc.perform(
        delete(
            "/persons/1"
        )
    )
    .andExpect(
        status().isNoContent()
    )
    .andExpect(
        content().string(
            ""
        )
    );

    verify(
        personUseCase
    ).deleteById(
        1
    );

  }

}
```

---

# Ce que teste PersonControllerTests

Nous testons :

```text
routes HTTP

codes HTTP

JSON entrant

JSON sortant

mapping DTO

appel du port IN
```

Nous ne testons pas :

```text
PersonService

PersonRepository

Hibernate

PostgreSQL
```

---

# Frontière testée

```text
HTTP
 ↓
PersonController
 ↓
PersonUseCase
 ↓
Mock
```

C'est exactement la frontière de l'adapter entrant.

---

# Tests JPA

Nous arrivons maintenant au test le plus important pour l'infrastructure.

Nous voulons vérifier :

```text
JpaPersonRepositoryAdapter
        ↓
SpringDataPersonRepository
        ↓
Spring Data JPA
        ↓
Hibernate
        ↓
PostgreSQL
```

Nous allons utiliser une vraie instance PostgreSQL lancée temporairement avec Testcontainers.

---

# Pourquoi un vrai PostgreSQL

Le but n'est pas de tester :

```text
JpaRepository
```

ou :

```text
Hibernate
```

eux-mêmes.

Ces bibliothèques possèdent déjà leurs propres tests.

Nous voulons vérifier notre intégration :

```text
Person

↕

PersonEntity

↕

JpaPersonRepositoryAdapter

↕

table person
```

---

# Testcontainers

Testcontainers démarre automatiquement :

```text
PostgreSQL
```

dans un container Docker pendant les tests.

Architecture :

```text
JUnit
  ↓
Testcontainers
  ↓
PostgreSQL container
  ↑
Hibernate
  ↑
Spring Data JPA
  ↑
JpaPersonRepositoryAdapterTests
```

---

# Prérequis

Docker doit fonctionner sur la machine.

Vérification :

```bash
docker version
```

---

# Test de l'adapter JPA

Chemin :

```text
src/test/java/com/ganatan/starter/person/infrastructure/adapter/out/jpa/JpaPersonRepositoryAdapterTests.java
```

---

# Code – JpaPersonRepositoryAdapterTests.java

```java
package com.ganatan.starter.person.infrastructure.adapter.out.jpa;

import com.ganatan.starter.person.application.port.out.PersonRepository;
import com.ganatan.starter.person.domain.Person;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.context.jdbc.Sql;

import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Testcontainers
@Sql(
    scripts = {
        "/schema.sql",
        "/data.sql"
    }
)
class JpaPersonRepositoryAdapterTests {

  @Container
  @ServiceConnection
  static PostgreSQLContainer postgres =
      new PostgreSQLContainer(
          "postgres:17-alpine"
      );

  @Autowired
  private SpringDataPersonRepository springDataRepository;

  private PersonRepository repository;

  @BeforeEach
  void setUp() {

    repository =
        new JpaPersonRepositoryAdapter(
            springDataRepository
        );

  }

  @Test
  void findAllShouldReturnSevenPersons() {

    List<Person> persons =
        repository.findAll();

    assertThat(
        persons
    ).hasSize(
        7
    );

  }

  @Test
  void findByIdShouldReturnPerson() {

    Optional<Person> person =
        repository.findById(
            1
        );

    assertThat(
        person
    ).isPresent();

    assertThat(
        person.get().id()
    ).isEqualTo(
        1
    );

    assertThat(
        person.get().firstName()
    ).isEqualTo(
        "Steven"
    );

    assertThat(
        person.get().lastName()
    ).isEqualTo(
        "Spielberg"
    );

    assertThat(
        person.get().cityId()
    ).isEqualTo(
        1
    );

  }

  @Test
  void findByIdShouldReturnEmptyWhenPersonDoesNotExist() {

    Optional<Person> person =
        repository.findById(
            999
        );

    assertThat(
        person
    ).isEmpty();

  }

  @Test
  void createShouldCreatePerson() {

    Person person =
        new Person(
            0,
            "Clint",
            "Eastwood",
            8
        );

    Person created =
        repository.create(
            person
        );

    assertThat(
        created.id()
    ).isEqualTo(
        8
    );

    assertThat(
        created.firstName()
    ).isEqualTo(
        "Clint"
    );

    assertThat(
        created.lastName()
    ).isEqualTo(
        "Eastwood"
    );

    assertThat(
        created.cityId()
    ).isEqualTo(
        8
    );

  }

  @Test
  void updateShouldUpdatePerson() {

    Person person =
        new Person(
            1,
            "Steven",
            "Spielberg",
            10
        );

    Person updated =
        repository.update(
            person
        );

    assertThat(
        updated.id()
    ).isEqualTo(
        1
    );

    assertThat(
        updated.firstName()
    ).isEqualTo(
        "Steven"
    );

    assertThat(
        updated.lastName()
    ).isEqualTo(
        "Spielberg"
    );

    assertThat(
        updated.cityId()
    ).isEqualTo(
        10
    );

  }

  @Test
  void deleteByIdShouldDeletePerson() {

    repository.deleteById(
        1
    );

    Optional<Person> person =
        repository.findById(
            1
        );

    assertThat(
        person
    ).isEmpty();

  }

}
```

---

# @DataJpaTest

L'annotation :

```java
@DataJpaTest
```

charge uniquement la partie nécessaire à JPA.

Elle permet notamment d'utiliser :

```text
EntityManager

Hibernate

Spring Data JPA

JpaRepository
```

Nous ne démarrons pas :

```text
serveur HTTP

Controller

application complète
```

---

# @Testcontainers

L'annotation :

```java
@Testcontainers
```

active l'intégration JUnit de Testcontainers.

---

# @Container

La déclaration :

```java
@Container
static PostgreSQLContainer postgres
```

indique que le container PostgreSQL appartient au cycle de vie du test.

---

# @ServiceConnection

La déclaration :

```java
@ServiceConnection
```

permet à Spring Boot de récupérer automatiquement les informations de connexion du container :

```text
URL JDBC

username

password
```

Il n'est donc pas nécessaire d'écrire manuellement :

```text
spring.datasource.url

spring.datasource.username

spring.datasource.password
```

pour ce test.

---

# PostgreSQL temporaire

Le test utilise :

```text
postgres:17-alpine
```

Le container :

```text
démarre

exécute les tests

s'arrête
```

La base de test est donc indépendante de la base utilisée en développement.

---

# schema.sql et data.sql

Nous réutilisons :

```text
src/main/resources/schema.sql

src/main/resources/data.sql
```

avec :

```java
@Sql(
    scripts = {
        "/schema.sql",
        "/data.sql"
    }
)
```

Avant chaque test, nous retrouvons donc :

```text
7 personnes
```

avec une séquence réinitialisée.

---

# Données initiales

```text
1 Steven Spielberg
2 Martin Scorsese
3 Francis Ford Coppola
4 George Lucas
5 Quentin Tarantino
6 David Fincher
7 Spike Lee
```

La prochaine création obtient donc :

```text
id = 8
```

---

# Ce que teste réellement l'adapter JPA

Le test :

```text
JpaPersonRepositoryAdapterTests
```

vérifie réellement :

```text
PersonRepository
       ↑
JpaPersonRepositoryAdapter
       ↓
PersonEntity
       ↓
SpringDataPersonRepository
       ↓
Hibernate
       ↓
PostgreSQL
```

---

# Test findAll

```text
repository.findAll()
        ↓
Spring Data
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
```

Nous vérifions :

```text
7 personnes
```

---

# Test findById

Nous vérifions :

```text
id = 1
```

et :

```text
Steven Spielberg
```

Cela valide notamment le mapping :

```text
person.id
person.first_name
person.last_name
person.city_id
```

vers :

```text
PersonEntity
```

puis :

```text
Person
```

---

# Test create

Le test crée :

```text
Clint Eastwood
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
```

PostgreSQL génère :

```text
id = 8
```

Le test vérifie donc également :

```text
@GeneratedValue(
    strategy = GenerationType.IDENTITY
)
```

---

# Test update

Le test modifie :

```text
Steven Spielberg
```

avec :

```text
cityId = 10
```

Flux :

```text
Person
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
```

---

# Test delete

Le test appelle :

```text
deleteById(1)
```

puis vérifie :

```text
findById(1)
```

Résultat attendu :

```text
Optional.empty()
```

---

# Pourquoi ne pas mocker SpringDataPersonRepository ici

Nous pourrions écrire :

```text
JpaPersonRepositoryAdapter
       ↓
Mock SpringDataPersonRepository
```

Mais nous ne testerions alors principalement que :

```text
Mockito
```

et quelques appels de méthodes.

La partie réellement intéressante de cet adapter est son intégration avec :

```text
JPA

Hibernate

PostgreSQL
```

Nous préférons donc ici un test d'intégration réel.

---

# Tests unitaires et tests d'intégration

Nous avons maintenant une distinction claire.

## Tests unitaires

```text
PersonTests

PersonServiceTests

InMemoryPersonRepositoryTests
```

Ils ne nécessitent pas :

```text
Docker

PostgreSQL

Spring Context
```

---

# Test Web

```text
PersonControllerTests
```

Il utilise :

```text
Spring MVC

MockMvc

Mockito
```

mais ne nécessite pas :

```text
PostgreSQL
```

---

# Test d'intégration

```text
JpaPersonRepositoryAdapterTests
```

Il utilise réellement :

```text
Spring Data JPA

Hibernate

PostgreSQL

Testcontainers
```

---

# Pyramide

```text
                 ┌─────────────────────────────┐
                 │ JPA / PostgreSQL            │
                 │ tests d'intégration         │
                 └──────────────┬──────────────┘
                                │
                    ┌───────────▼───────────┐
                    │ Controller / MockMvc  │
                    └───────────┬───────────┘
                                │
             ┌──────────────────▼──────────────────┐
             │ Service / Repository mémoire        │
             │ tests unitaires                     │
             └──────────────────┬──────────────────┘
                                │
                     ┌──────────▼──────────┐
                     │ Domain              │
                     └─────────────────────┘
```

---

# Test du cœur

Le cœur peut être testé avec :

```text
Person
PersonService
PersonRepository
InMemoryPersonRepository
```

sans aucune infrastructure externe.

```text
JUnit
 ↓
PersonService
 ↓
PersonRepository
 ↑
InMemoryPersonRepository
```

---

# Test de l'entrée

L'adapter entrant est testé avec :

```text
MockMvc
 ↓
PersonController
 ↓
PersonUseCase mocké
```

Le Controller ne sait pas comment les données sont stockées.

---

# Test de la sortie

L'adapter sortant JPA est testé avec :

```text
PersonRepository
 ↑
JpaPersonRepositoryAdapter
 ↓
SpringDataPersonRepository
 ↓
Hibernate
 ↓
PostgreSQL Testcontainers
```

---

# Séparation des responsabilités

Chaque test possède donc une cible précise.

```text
PersonTests
    ↓
modèle métier

PersonServiceTests
    ↓
logique applicative

InMemoryPersonRepositoryTests
    ↓
adapter mémoire

PersonControllerTests
    ↓
contrat HTTP

JpaPersonRepositoryAdapterTests
    ↓
persistence JPA
```

---

# Pas de @SpringBootTest partout

Une erreur fréquente consiste à écrire :

```java
@SpringBootTest
```

sur tous les tests.

Cela démarrerait inutilement :

```text
Spring

JPA

Hibernate

DataSource

configuration complète
```

même pour tester une simple classe Java.

Nous évitons cette approche.

---

# PersonTests

Utilise :

```text
aucun contexte Spring
```

---

# PersonServiceTests

Utilise :

```text
aucun contexte Spring
```

---

# InMemoryPersonRepositoryTests

Utilise :

```text
aucun contexte Spring
```

---

# PersonControllerTests

Utilise :

```text
@WebMvcTest
```

---

# JpaPersonRepositoryAdapterTests

Utilise :

```text
@DataJpaTest

Testcontainers
```

---

# Architecture des tests

Nous obtenons :

```text
                       TESTS

                         │
        ┌────────────────┼─────────────────┐
        │                │                 │
        ▼                ▼                 ▼
     Domain          Adapter IN        Adapter OUT
        │                │                 │
        ▼                ▼                 ▼
     Person          Controller         JPA Adapter
        │                │                 │
        ▼                ▼                 ▼
     JUnit           MockMvc           Hibernate
                                          │
                                          ▼
                                     PostgreSQL
```

---

# Isolation du service

L'élément fondamental est que :

```text
PersonService
```

ne connaît pas :

```text
InMemoryPersonRepository
```

ou :

```text
JpaPersonRepositoryAdapter
```

Il connaît uniquement :

```text
PersonRepository
```

Nous pouvons donc choisir librement l'implémentation pendant le test.

---

# Production

En fonctionnement normal :

```text
PersonService
      ↓
PersonRepository
      ↑
JpaPersonRepositoryAdapter
```

---

# Test

Dans le test :

```text
PersonService
      ↓
PersonRepository
      ↑
InMemoryPersonRepository
```

Le service ne change pas.

---

# Exemple concret de l'architecture hexagonale

Production :

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
 ↑
JpaPersonRepositoryAdapter
 ↓
PostgreSQL
```

Test du service :

```text
JUnit
 ↓
PersonService
 ↓
PersonRepository
 ↑
InMemoryPersonRepository
```

Test du Controller :

```text
MockMvc
 ↓
PersonController
 ↓
PersonUseCase
 ↑
Mockito
```

Test JPA :

```text
JUnit
 ↓
JpaPersonRepositoryAdapter
 ↓
SpringDataPersonRepository
 ↓
Hibernate
 ↓
PostgreSQL
```

---

# Exécution des tests

Lancer tous les tests :

```bash
mvn test
```

---

# Build complet

```bash
mvn clean install
```

Le build doit terminer avec :

```text
BUILD SUCCESS
```

---

# Testcontainers et Docker

Pour les tests :

```text
JpaPersonRepositoryAdapterTests
```

Docker doit être disponible.

Il n'est pas nécessaire de démarrer manuellement :

```bash
docker start springboot-postgres
```

Testcontainers gère sa propre instance PostgreSQL.

---

# Développement

Pour lancer l'application normalement :

```bash
docker start springboot-postgres
```

puis :

```bash
mvn spring-boot:run
```

---

# Tests

Pour lancer les tests :

```bash
mvn test
```

Testcontainers utilise un PostgreSQL indépendant.

Nous avons donc :

```text
Application
    ↓
springboot-postgres

Tests JPA
    ↓
PostgreSQL Testcontainers
```

Les deux environnements sont séparés.

---

# Base de développement

```text
localhost:5432
       ↓
springboot_starter
```

---

# Base de test

```text
port dynamique
      ↓
PostgreSQL Testcontainers
```

Le port peut changer à chaque exécution.

Spring Boot récupère automatiquement les paramètres grâce à :

```text
@ServiceConnection
```

---

# Pas de configuration de port

Nous n'écrivons donc pas :

```text
localhost:5432
```

dans les tests.

Testcontainers fournit dynamiquement :

```text
host

port

database

username

password
```

---

# Package by feature

Les tests suivent exactement la même organisation que le code principal.

Code :

```text
src/main/java/com/ganatan/starter/person
```

Tests :

```text
src/test/java/com/ganatan/starter/person
```

---

# Organisation finale

```text
src/

├── main/
│   ├── java/
│   │   └── com/ganatan/starter/
│   │       │
│   │       └── person/
│   │           │
│   │           ├── domain/
│   │           │   └── Person.java
│   │           │
│   │           ├── application/
│   │           │   ├── exception/
│   │           │   │   └── PersonNotFoundException.java
│   │           │   │
│   │           │   ├── port/
│   │           │   │   ├── in/
│   │           │   │   │   └── PersonUseCase.java
│   │           │   │   └── out/
│   │           │   │       └── PersonRepository.java
│   │           │   │
│   │           │   └── service/
│   │           │       └── PersonService.java
│   │           │
│   │           └── infrastructure/
│   │               ├── adapter/
│   │               │   ├── in/
│   │               │   │   └── rest/
│   │               │   │       ├── dto/
│   │               │   │       │   ├── PersonInputDto.java
│   │               │   │       │   └── PersonOutputDto.java
│   │               │   │       ├── PersonController.java
│   │               │   │       └── PersonExceptionHandler.java
│   │               │   │
│   │               │   └── out/
│   │               │       ├── memory/
│   │               │       │   └── InMemoryPersonRepository.java
│   │               │       │
│   │               │       ├── postgresql/
│   │               │       │   └── PostgreSqlPersonRepositoryAdapter.java
│   │               │       │
│   │               │       └── jpa/
│   │               │           ├── PersonEntity.java
│   │               │           ├── SpringDataPersonRepository.java
│   │               │           └── JpaPersonRepositoryAdapter.java
│   │               │
│   │               └── config/
│   │                   └── PersonConfiguration.java
│   │
│   └── resources/
│       ├── application.properties
│       ├── schema.sql
│       └── data.sql
│
└── test/
    └── java/
        └── com/ganatan/starter/
            │
            └── person/
                │
                ├── domain/
                │   └── PersonTests.java
                │
                ├── application/
                │   └── service/
                │       └── PersonServiceTests.java
                │
                └── infrastructure/
                    └── adapter/
                        ├── in/
                        │   └── rest/
                        │       └── PersonControllerTests.java
                        │
                        └── out/
                            ├── memory/
                            │   └── InMemoryPersonRepositoryTests.java
                            │
                            └── jpa/
                                └── JpaPersonRepositoryAdapterTests.java
```

---

# Plusieurs features

Lorsque nous ajouterons :

```text
city

country
```

nous conserverons le même principe.

```text
src/test/java/com/ganatan/starter/

├── person/
│   ├── domain/
│   ├── application/
│   └── infrastructure/
│
├── city/
│   ├── domain/
│   ├── application/
│   └── infrastructure/
│
└── country/
    ├── domain/
    ├── application/
    └── infrastructure/
```

Chaque feature possède ses propres tests.

---

# Person

```text
PersonTests

PersonServiceTests

InMemoryPersonRepositoryTests

PersonControllerTests

JpaPersonRepositoryAdapterTests
```

---

# City

Nous pourrons avoir :

```text
CityTests

CityServiceTests

InMemoryCityRepositoryTests

CityControllerTests

JpaCityRepositoryAdapterTests
```

---

# Country

Nous pourrons avoir :

```text
CountryTests

CountryServiceTests

InMemoryCountryRepositoryTests

CountryControllerTests

JpaCountryRepositoryAdapterTests
```

---

# Testabilité

L'un des intérêts majeurs de l'architecture hexagonale apparaît maintenant clairement.

Le service dépend de :

```text
PersonRepository
```

et non directement de :

```text
PostgreSQL

JdbcTemplate

JpaRepository

Hibernate
```

Nous pouvons donc tester le service avec :

```text
InMemoryPersonRepository
```

sans modifier une seule ligne du service.

---

# Changement de persistence

Nous avons successivement utilisé :

```text
InMemoryPersonRepository

PostgreSqlPersonRepositoryAdapter

JpaPersonRepositoryAdapter
```

Le service reste :

```text
PersonService
```

Le port reste :

```text
PersonRepository
```

Les tests du service restent donc indépendants de la technologie de persistence.

---

# Test du contrat HTTP

Le Controller dépend de :

```text
PersonUseCase
```

et non de :

```text
PersonService
```

directement.

Cela permet :

```text
PersonController
       ↓
PersonUseCase
       ↑
Mockito
```

Le test Web reste donc indépendant de l'implémentation de l'application.

---

# Test de la persistence

Inversement, le test JPA peut se concentrer uniquement sur :

```text
JpaPersonRepositoryAdapter
```

sans passer par :

```text
HTTP

Controller

DTO
```

---

# Mauvaise approche

Une approche beaucoup moins isolée serait :

```text
@SpringBootTest
       ↓
Controller
       ↓
Service
       ↓
JPA
       ↓
PostgreSQL
```

pour chaque test.

Le moindre test nécessiterait toute l'application.

---

# Approche retenue

Nous utilisons :

```text
Domain
    ↓
JUnit
```

```text
Service
    ↓
JUnit
    ↓
Memory
```

```text
Controller
    ↓
@WebMvcTest
    ↓
Mockito
```

```text
JPA Adapter
    ↓
@DataJpaTest
    ↓
Testcontainers
    ↓
PostgreSQL
```

Chaque test charge uniquement ce dont il a besoin.

---

# Ce que nous testons nous-mêmes

Nous testons :

```text
notre domaine

notre service

notre mapping HTTP

notre mapping Person / PersonEntity

notre configuration de persistence

notre accès à la table person
```

---

# Ce que nous ne cherchons pas à tester

Nous ne cherchons pas à retester le fonctionnement interne de :

```text
Spring MVC

Spring Data

Hibernate

PostgreSQL

Mockito

Testcontainers
```

Nous vérifions uniquement que notre code les utilise correctement.

---

# Architecture hexagonale complète

Production :

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

# Architecture complète des tests

```text
Domain

PersonTests
    ↓
Person
```

```text
Application

PersonServiceTests
       ↓
PersonService
       ↓
PersonRepository
       ↑
InMemoryPersonRepository
```

```text
Adapter IN

PersonControllerTests
       ↓
MockMvc
       ↓
PersonController
       ↓
PersonUseCase
       ↑
Mockito
```

```text
Adapter OUT

JpaPersonRepositoryAdapterTests
       ↓
JpaPersonRepositoryAdapter
       ↓
SpringDataPersonRepository
       ↓
Hibernate
       ↓
PostgreSQL Testcontainers
```

---

# Résultat

Nous disposons maintenant d'une architecture :

```text
testable

modulaire

indépendante

évolutive
```

Le domaine peut être testé sans Spring.

L'application peut être testée sans base de données.

Le REST peut être testé sans persistence.

La persistence peut être testée sans HTTP.

---

# Évolution complète du projet

Nous sommes partis de :

```text
Controller
    ↓
List<Person>
```

Puis :

```text
Controller
    ↓
Service
    ↓
List<Person>
```

Puis :

```text
Controller
    ↓
Service
    ↓
Repository
```

Puis nous avons introduit :

```text
Domain
```

Puis :

```text
Port IN

Port OUT
```

Puis :

```text
Adapter IN
```

Puis :

```text
Adapter OUT mémoire
```

Puis :

```text
Adapter OUT PostgreSQL / JdbcTemplate
```

Puis :

```text
Adapter OUT JPA / Hibernate
```

Et enfin :

```text
Tests unitaires

Tests Web

Tests d'intégration
```

---

# Architecture finale

```text
                         HEXAGONE

                            Domain
                              │
                              │
                        PersonService
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
                 Port IN             Port OUT
                    │                   │
                    │                   │
                    ▼                   ▼
             PersonController      PersonRepository
                    │                   ▲
                    │                   │
                    │       ┌───────────┼────────────┐
                    │       │           │            │
                    │       ▼           ▼            ▼
                   HTTP   Memory    JdbcTemplate     JPA
                                               
```

Pour la version utilisée actuellement :

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
 ↑
JpaPersonRepositoryAdapter
 ↓
SpringDataPersonRepository
 ↓
Spring Data JPA
 ↓
Hibernate
 ↓
PostgreSQL
```

---

# Tests finaux

```text
PersonTests
    ↓
Domain
```

```text
PersonServiceTests
    ↓
Application
    ↓
Memory
```

```text
PersonControllerTests
    ↓
REST
    ↓
Mockito
```

```text
JpaPersonRepositoryAdapterTests
    ↓
JPA
    ↓
Hibernate
    ↓
PostgreSQL
```

---

# Principes clés

* le domaine est testé sans Spring ;
* le service est testé sans Spring ;
* le service est testé à travers le port `PersonRepository` ;
* `InMemoryPersonRepository` permet de tester rapidement l'application ;
* le Controller est testé indépendamment de la persistence ;
* `PersonUseCase` est mocké dans le test du Controller ;
* `@WebMvcTest` limite le contexte à la couche Web ;
* l'adapter JPA possède son propre test d'intégration ;
* `@DataJpaTest` limite le contexte à JPA ;
* Testcontainers fournit un vrai PostgreSQL ;
* les tests ne dépendent pas de la base PostgreSQL de développement ;
* `schema.sql` et `data.sql` sont réutilisés ;
* `PersonEntity` reste dans l'infrastructure ;
* les tests JPA valident la conversion `PersonEntity` vers `Person` ;
* les tests JPA valident la conversion `Person` vers `PersonEntity` ;
* les ports permettent de remplacer facilement les adapters ;
* aucun test du cœur ne dépend de Hibernate ;
* aucun test du cœur ne dépend de PostgreSQL ;
* l'organisation des tests reste en package by feature ;
* chaque niveau de l'architecture possède son niveau de test ;
* nous évitons `@SpringBootTest` lorsqu'il n'est pas nécessaire.

---

# Commandes

Tests :

```bash
mvn test
```

Build complet :

```bash
mvn clean install
```

Application :

```bash
docker start springboot-postgres
```

```bash
mvn spring-boot:run
```

---

# État final du projet

Le CRUD `Person` dispose maintenant de :

```text
Domain

Port IN

Port OUT

Service

Adapter REST

DTO

ExceptionHandler

Adapter mémoire

Adapter PostgreSQL JdbcTemplate

Adapter JPA

Spring Data JPA

Hibernate

PostgreSQL

Tests unitaires

Tests Web

Tests d'intégration PostgreSQL
```

Architecture :

```text
Adapter IN
    ↓
Port IN
    ↓
Application
    ↓
Domain
    ↓
Port OUT
    ↓
Adapter OUT
```

Avec :

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

Le cœur de l'application reste indépendant des technologies utilisées autour de lui.

C'est l'objectif principal de l'architecture hexagonale.

---

# Fin

Le CRUD `Person` est maintenant complet.

```text
001
 ↓
...
 ↓
011-jpa-hibernate-adapter-out.md
 ↓
012-tests.md
 ↓
Architecture hexagonale complète
```
