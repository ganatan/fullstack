# Controller MongoDB `Declencheur` dans Spring Boot

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
      uri: mongodb://localhost:27017/Declencheur

server:
  port: 3000
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
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/declencheurs")
public class DeclencheurController {

    private final DeclencheurService service;

    public DeclencheurController(DeclencheurService service) {
        this.service = service;
    }

//    @GetMapping
//    public Map<String, Object> root() {
//        return Map.of(
//                "application", "api/declencheurs");
//    }
//

    @GetMapping
    public List<Declencheur> getAll() {
        return service.findAll();
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

## Arborescence

```text
src/main/java/com/ganatan/starter/api/declencheur/Declencheur.java
src/main/java/com/ganatan/starter/api/declencheur/DeclencheurRepository.java
src/main/java/com/ganatan/starter/api/declencheur/DeclencheurService.java
src/main/java/com/ganatan/starter/api/declencheur/DeclencheurController.java
```

## URLs de test

```text
http://localhost:3000/api/declencheurs
http://localhost:3000/api/declencheurs/69b4fab60d5f031e877c2907
http://localhost:3000/api/declencheurs/code/DEC00002BBBB
```