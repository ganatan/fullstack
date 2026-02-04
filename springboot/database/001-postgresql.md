# 001 - PostgreSQL + Hibernate + API Persons (CRUD)

## Fichiers

- `pom.xml`
- `src/main/resources/application.properties`
- `src/main/java/com/ganatan/starter/api/person/PersonEntity.java`
- `src/main/java/com/ganatan/starter/api/person/PersonRepository.java`
- `src/main/java/com/ganatan/starter/api/person/PersonService.java`
- `src/main/java/com/ganatan/starter/api/person/PersonCreateRequestDto.java`
- `src/main/java/com/ganatan/starter/api/person/PersonUpdateRequestDto.java`
- `src/main/java/com/ganatan/starter/api/person/PersonResponseDto.java`
- `src/main/java/com/ganatan/starter/api/person/PersonController.java`

## Endpoints + payloads

- `GET /persons`
  - Response: `PersonResponseDto[]`

- `GET /persons/{id}`
  - Response: `PersonResponseDto`

- `POST /persons`
  - Request: `PersonCreateRequestDto`
  - Response: `PersonResponseDto`

- `PUT /persons/{id}`
  - Request: `PersonUpdateRequestDto`
  - Response: `PersonResponseDto`

- `DELETE /persons/{id}`
  - Response: `204 No Content`

### Payloads JSON

`POST /persons`
```json
{ "name": "David Fincher" }
```

`PUT /persons/{id}`
```json
{ "name": "Christopher Nolan" }
```

`PersonResponseDto`
```json
{ "id": 1, "name": "David Fincher" }
```

## Réponses possibles (HTTP)

- `GET /persons`
  - `200 OK`

- `GET /persons/{id}`
  - `200 OK`
  - `404 Not Found`

- `POST /persons`
  - `200 OK`
  - `400 Bad Request` (body invalide, `name` manquant/vide)

- `PUT /persons/{id}`
  - `200 OK`
  - `400 Bad Request` (body invalide, `name` manquant/vide)
  - `404 Not Found`

- `DELETE /persons/{id}`
  - `204 No Content`
  - `404 Not Found`


## Code

### `pom.xml` (extrait dépendances)
```xml
<dependencies>
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

  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
  </dependency>
</dependencies>
```

### `src/main/resources/application.properties`
```properties
server.port=3000

spring.datasource.url=jdbc:postgresql://localhost:5432/starterdb
spring.datasource.username=starter
spring.datasource.password=starter

spring.jpa.hibernate.ddl-auto=update
spring.jpa.open-in-view=false
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

### `src/main/java/com/ganatan/starter/api/person/PersonEntity.java`
```java
package com.ganatan.starter.api.person;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "person")
public class PersonEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  public PersonEntity() {
  }

  public PersonEntity(Long id, String name) {
    this.id = id;
    this.name = name;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}
```

### `src/main/java/com/ganatan/starter/api/person/PersonRepository.java`
```java
package com.ganatan.starter.api.person;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonRepository extends JpaRepository<PersonEntity, Long> {
}
```

### `src/main/java/com/ganatan/starter/api/person/PersonCreateRequestDto.java`
```java
package com.ganatan.starter.api.person;

public class PersonCreateRequestDto {

  private String name;

  public PersonCreateRequestDto() {
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}
```

### `src/main/java/com/ganatan/starter/api/person/PersonUpdateRequestDto.java`
```java
package com.ganatan.starter.api.person;

public class PersonUpdateRequestDto {

  private String name;

  public PersonUpdateRequestDto() {
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}
```

### `src/main/java/com/ganatan/starter/api/person/PersonResponseDto.java`
```java
package com.ganatan.starter.api.person;

public class PersonResponseDto {

  private Long id;
  private String name;

  public PersonResponseDto() {
  }

  public PersonResponseDto(Long id, String name) {
    this.id = id;
    this.name = name;
  }

  public static PersonResponseDto from(PersonEntity entity) {
    return new PersonResponseDto(entity.getId(), entity.getName());
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}
```

### `src/main/java/com/ganatan/starter/api/person/PersonService.java`
```java
package com.ganatan.starter.api.person;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PersonService {

  private final PersonRepository repository;

  public PersonService(PersonRepository repository) {
    this.repository = repository;
  }

  @Transactional(readOnly = true)
  public List<PersonEntity> findAll() {
    return repository.findAll();
  }

  @Transactional(readOnly = true)
  public Optional<PersonEntity> findById(Long id) {
    return repository.findById(id);
  }

  @Transactional
  public PersonEntity create(String name) {
    return repository.save(new PersonEntity(null, name));
  }

  @Transactional
  public Optional<PersonEntity> update(Long id, String name) {
    return repository.findById(id).map(existing -> {
      existing.setName(name);
      return repository.save(existing);
    });
  }

  @Transactional
  public boolean delete(Long id) {
    if (!repository.existsById(id)) {
      return false;
    }
    repository.deleteById(id);
    return true;
  }
}
```

### `src/main/java/com/ganatan/starter/api/person/PersonController.java`
```java
package com.ganatan.starter.api.person;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/persons")
public class PersonController {

  private final PersonService service;

  public PersonController(PersonService service) {
    this.service = service;
  }

  @GetMapping
  public List<PersonResponseDto> getAll() {
    return service.findAll().stream().map(PersonResponseDto::from).toList();
  }

  @GetMapping("/{id}")
  public PersonResponseDto getById(@PathVariable Long id) {
    return service.findById(id)
        .map(PersonResponseDto::from)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  @PostMapping
  public PersonResponseDto create(@RequestBody PersonCreateRequestDto request) {
    String name = request == null ? null : request.getName();
    if (name == null || name.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "name is required");
    }
    return PersonResponseDto.from(service.create(name.trim()));
  }

  @PutMapping("/{id}")
  public PersonResponseDto update(@PathVariable Long id, @RequestBody PersonUpdateRequestDto request) {
    String name = request == null ? null : request.getName();
    if (name == null || name.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "name is required");
    }
    return service.update(id, name.trim())
        .map(PersonResponseDto::from)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) {
    if (!service.delete(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }
  }
}
```


## Réponses HTTP possibles

### GET /persons
- 200 OK
  - Body: `PersonResponseDto[]`

### GET /persons/{id}
- 200 OK
  - Body: `PersonResponseDto`
- 404 Not Found

### POST /persons
- 201 Created
  - Body: `PersonResponseDto`
- 400 Bad Request
  - name manquant ou vide

### PUT /persons/{id}
- 200 OK
  - Body: `PersonResponseDto`
- 400 Bad Request
  - name manquant ou vide
- 404 Not Found

### DELETE /persons/{id}
- 204 No Content
- 404 Not Found

### Erreurs techniques possibles
- 500 Internal Server Error
  - erreur Hibernate / PostgreSQL
