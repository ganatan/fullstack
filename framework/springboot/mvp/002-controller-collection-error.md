# Controller MongoDB `Declencheur` dans Spring Boot avec gestion globale des erreurs

## Dépendance Maven

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```

## application.yml

```yaml
spring:
  application:
    name: springboot-starter
  data:
    mongodb:
      uri: mongodb://localhost:27017/local

server:
  port: 3000
  error:
    whitelabel:
      enabled: false
    include-message: never
    include-binding-errors: never
    include-stacktrace: never
    include-exception: false
```

## Classe `Declencheur`

```java
package com.ganatan.starter.api.declencheur;

import java.time.Instant;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Declencheur")
public class Declencheur {

    @Id
    private String id;
    private String code;
    private String libelleCourt;
    private String libelleLong;
    private List<String> services;
    private String codeCr;
    private Instant dateDebutValidite;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLibelleCourt() {
        return libelleCourt;
    }

    public void setLibelleCourt(String libelleCourt) {
        this.libelleCourt = libelleCourt;
    }

    public String getLibelleLong() {
        return libelleLong;
    }

    public void setLibelleLong(String libelleLong) {
        this.libelleLong = libelleLong;
    }

    public List<String> getServices() {
        return services;
    }

    public void setServices(List<String> services) {
        this.services = services;
    }

    public String getCodeCr() {
        return codeCr;
    }

    public void setCodeCr(String codeCr) {
        this.codeCr = codeCr;
    }

    public Instant getDateDebutValidite() {
        return dateDebutValidite;
    }

    public void setDateDebutValidite(Instant dateDebutValidite) {
        this.dateDebutValidite = dateDebutValidite;
    }
}
```

## Repository

```java
package com.ganatan.starter.api.declencheur;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DeclencheurRepository extends MongoRepository<Declencheur, String> {
    Optional<Declencheur> findByCode(String code);
}
```

## Service

```java
package com.ganatan.starter.api.declencheur;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class DeclencheurService {

    private final DeclencheurRepository repository;

    public DeclencheurService(DeclencheurRepository repository) {
        this.repository = repository;
    }

    public List<Declencheur> findAll() {
        return repository.findAll();
    }

    public Optional<Declencheur> findById(String id) {
        return repository.findById(id);
    }

    public Optional<Declencheur> findByCode(String code) {
        return repository.findByCode(code);
    }
}
```

## Controller

```java
package com.ganatan.starter.api.declencheur;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/declencheurs")
public class DeclencheurController {

    private final DeclencheurService service;

    public DeclencheurController(DeclencheurService service) {
        this.service = service;
    }

    @GetMapping
    public List<Declencheur> getAll() {
        return service.findAll();
    }

     @GetMapping
    public List<Declencheur> getAll() {
        List<Declencheur> result = repository.findAll();
        System.out.println("NB declencheurs = " + result.size());
        return result;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Declencheur> getById(@PathVariable String id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<Declencheur> getByCode(@PathVariable String code) {
        return service.findByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
```

## GlobalExceptionHandler

```java
package com.ganatan.starter.error;

import java.time.Instant;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NoResourceFoundException.class)
    public ProblemDetail handleNotFound(NoResourceFoundException ex, HttpServletRequest request) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND,
                "Resource not found"
        );
        problem.setTitle("Not Found");
        problem.setProperty("timestamp", Instant.now());
        problem.setProperty("path", request.getRequestURI());
        return problem;
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ProblemDetail handleMethodNotAllowed(HttpRequestMethodNotSupportedException ex, HttpServletRequest request) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.METHOD_NOT_ALLOWED,
                "Method not allowed"
        );
        problem.setTitle("Method Not Allowed");
        problem.setProperty("timestamp", Instant.now());
        problem.setProperty("path", request.getRequestURI());
        return problem;
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGeneric(Exception ex, HttpServletRequest request) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Internal server error"
        );
        problem.setTitle("Internal Server Error");
        problem.setProperty("timestamp", Instant.now());
        problem.setProperty("path", request.getRequestURI());
        return problem;
    }
}
```

## Arborescence

```text
src/main/java/com/ganatan/starter/api/declencheur/Declencheur.java
src/main/java/com/ganatan/starter/api/declencheur/DeclencheurRepository.java
src/main/java/com/ganatan/starter/api/declencheur/DeclencheurService.java
src/main/java/com/ganatan/starter/api/declencheur/DeclencheurController.java
src/main/java/com/ganatan/starter/error/GlobalExceptionHandler.java
```

## URLs de test

```text
http://localhost:3000/api/declencheurs
http://localhost:3000/api/declencheurs/69b4fab60d5f031e877c2907
http://localhost:3000/api/declencheurs/code/DEC00002BBBB
http://localhost:3000/qsfqsf
```

## Résultat attendu

### URL valide

```json
{
  "id": "69b4fab60d5f031e877c2907",
  "code": "DEC00002BBBB",
  "libelleCourt": "libelleCourt BBBB",
  "libelleLong": "libelleLong BBBB",
  "services": [
    "REC00002BBBB"
  ],
  "codeCr": "81300BBBB",
  "dateDebutValidite": "2023-01-15T10:00:00Z"
}
```

### URL non traitée

```json
{
  "type": "about:blank",
  "title": "Not Found",
  "status": 404,
  "detail": "Resource not found",
  "timestamp": "2026-03-15T09:00:00Z",
  "path": "/qsfqsf"
}
```



## Debug Classe `Declencheur`

```java
package com.ganatan.starter.api.declencheur;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/declencheurs")
public class DeclencheurController {

    private final DeclencheurRepository repository;

    public DeclencheurController(DeclencheurRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Declencheur> getAll() {
        List<Declencheur> result = repository.findAll();
        System.out.println("NB declencheurs = " + result.size());
        return result;
    }
}
```


```java
package com.ganatan.starter.config;

import jakarta.annotation.PostConstruct;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Component
public class MongoDebug {

  private final MongoTemplate mongoTemplate;

  public MongoDebug(MongoTemplate mongoTemplate) {
    this.mongoTemplate = mongoTemplate;
  }

  @PostConstruct
  public void init() {
    System.out.println("Mongo database = " + mongoTemplate.getDb().getName());
    System.out.println("Mongo collections = " + mongoTemplate.getCollectionNames());
  }
}
```