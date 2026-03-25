# Tuto Spring Boot MongoDB : `TestController` avec `Service` via interface et `Repository` via interface sur la collection `Media`

## Objectif

Créer une API Spring Boot MongoDB propre avec :

- un `TestController`
- un `TestService` en interface
- un `TestServiceImpl`
- un `MediaRepository` en interface
- les opérations `GET`, `POST`, `DELETE`
- une collection MongoDB `media`

Le but est de montrer une structure classique et propre :

- controller
- service interface
- service impl
- repository interface
- entity

---

## Structure du projet

```text
src/main/java/com/example/demo/
├── DemoApplication.java
├── media/
│   ├── Media.java
│   ├── MediaRepository.java
│   ├── TestService.java
│   ├── TestServiceImpl.java
│   └── TestController.java
```

---

## Dépendances Maven

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
  <groupId>org.springframework.boot</artifactId>
  <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```

---

## `application.yml`

```yaml
spring:
  application:
    name: springboot-mongodb-test
  data:
    mongodb:
      uri: mongodb://localhost:27017/media_db

server:
  port: 3000
```

---

## Classe principale

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

---

## Classe `Media`

```java
package com.example.demo.media;

import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "media")
public class Media {

    @Id
    private String id;
    private String name;
    private String type;
    private String director;
    private Integer year;
    private String country;
    private Instant createdAt;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
```

---

## Interface `MediaRepository`

```java
package com.example.demo.media;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MediaRepository extends MongoRepository<Media, String> {

    List<Media> findByNameContainingIgnoreCase(String name);

    List<Media> findByType(String type);

    List<Media> findByDirectorContainingIgnoreCase(String director);

    List<Media> findByYear(Integer year);
}
```

---

## Interface `TestService`

```java
package com.example.demo.media;

import java.util.List;
import java.util.Optional;
import org.bson.Document;

public interface TestService {

    Document ping();

    List<Media> findAll();

    Optional<Media> findById(String id);

    List<Media> findByName(String name);

    List<Media> findByType(String type);

    List<Media> findByDirector(String director);

    List<Media> findByYear(Integer year);

    Media create(Media media);

    List<Media> createMany(List<Media> medias);

    boolean deleteById(String id);

    long deleteAll();

    long count();
}
```

---

## Implémentation `TestServiceImpl`

```java
package com.example.demo.media;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

@Service
public class TestServiceImpl implements TestService {

    private final MediaRepository mediaRepository;
    private final MongoTemplate mongoTemplate;

    public TestServiceImpl(MediaRepository mediaRepository, MongoTemplate mongoTemplate) {
        this.mediaRepository = mediaRepository;
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public Document ping() {
        return mongoTemplate.getDb().runCommand(new Document("ping", 1));
    }

    @Override
    public List<Media> findAll() {
        return mediaRepository.findAll();
    }

    @Override
    public Optional<Media> findById(String id) {
        return mediaRepository.findById(id);
    }

    @Override
    public List<Media> findByName(String name) {
        return mediaRepository.findByNameContainingIgnoreCase(name);
    }

    @Override
    public List<Media> findByType(String type) {
        return mediaRepository.findByType(type);
    }

    @Override
    public List<Media> findByDirector(String director) {
        return mediaRepository.findByDirectorContainingIgnoreCase(director);
    }

    @Override
    public List<Media> findByYear(Integer year) {
        return mediaRepository.findByYear(year);
    }

    @Override
    public Media create(Media media) {
        if (media.getCreatedAt() == null) {
            media.setCreatedAt(Instant.now());
        }
        return mediaRepository.save(media);
    }

    @Override
    public List<Media> createMany(List<Media> medias) {
        Instant now = Instant.now();
        for (Media media : medias) {
            if (media.getCreatedAt() == null) {
                media.setCreatedAt(now);
            }
        }
        return mediaRepository.saveAll(medias);
    }

    @Override
    public boolean deleteById(String id) {
        if (!mediaRepository.existsById(id)) {
            return false;
        }
        mediaRepository.deleteById(id);
        return true;
    }

    @Override
    public long deleteAll() {
        long count = mediaRepository.count();
        mediaRepository.deleteAll();
        return count;
    }

    @Override
    public long count() {
        return mediaRepository.count();
    }
}
```

---

## `TestController`

```java
package com.example.demo.media;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.bson.Document;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/test/media")
public class TestController {

    private final TestService testService;

    public TestController(TestService testService) {
        this.testService = testService;
    }

    @GetMapping("/ping")
    public Map<String, Object> pingMongo() {
        Document result = testService.ping();
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("ok", result.get("ok"));
        response.put("result", result);
        return response;
    }

    @GetMapping
    public List<Media> getAll() {
        return testService.findAll();
    }

    @GetMapping("/count")
    public Map<String, Object> count() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("count", testService.count());
        return response;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Media> getById(@PathVariable String id) {
        Optional<Media> media = testService.findById(id);
        return media.map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/search/by-name")
    public List<Media> getByName(@RequestParam String name) {
        return testService.findByName(name);
    }

    @GetMapping("/search/by-type")
    public List<Media> getByType(@RequestParam String type) {
        return testService.findByType(type);
    }

    @GetMapping("/search/by-director")
    public List<Media> getByDirector(@RequestParam String director) {
        return testService.findByDirector(director);
    }

    @GetMapping("/search/by-year")
    public List<Media> getByYear(@RequestParam Integer year) {
        return testService.findByYear(year);
    }

    @PostMapping
    public ResponseEntity<Media> create(@RequestBody Media media) {
        Media created = testService.create(media);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<Media>> createMany(@RequestBody List<Media> medias) {
        List<Media> created = testService.createMany(medias);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteById(@PathVariable String id) {
        boolean deleted = testService.deleteById(id);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", id);
        response.put("deleted", deleted);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public Map<String, Object> deleteAll() {
        long deletedCount = testService.deleteAll();
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("deletedCount", deletedCount);
        return response;
    }
}
```

---

## Endpoints disponibles

### Vérifier MongoDB

```http
GET /test/media/ping
```

### Récupérer tous les médias

```http
GET /test/media
```

### Compter les documents

```http
GET /test/media/count
```

### Récupérer un média par id

```http
GET /test/media/{id}
```

### Rechercher par nom

```http
GET /test/media/search/by-name?name=dune
```

### Rechercher par type

```http
GET /test/media/search/by-type?type=MOVIE
```

### Rechercher par réalisateur

```http
GET /test/media/search/by-director?director=villeneuve
```

### Rechercher par année

```http
GET /test/media/search/by-year?year=2021
```

### Créer un média

```http
POST /test/media
```

### Créer plusieurs médias

```http
POST /test/media/bulk
```

### Supprimer par id

```http
DELETE /test/media/{id}
```

### Supprimer tous les médias

```http
DELETE /test/media
```

---

## Exemple JSON pour `POST /test/media`

```json
{
  "name": "Dune",
  "type": "MOVIE",
  "director": "Denis Villeneuve",
  "year": 2021,
  "country": "USA"
}
```

---

## Exemple JSON pour `POST /test/media/bulk`

```json
[
  {
    "name": "Dune",
    "type": "MOVIE",
    "director": "Denis Villeneuve",
    "year": 2021,
    "country": "USA"
  },
  {
    "name": "Arrival",
    "type": "MOVIE",
    "director": "Denis Villeneuve",
    "year": 2016,
    "country": "USA"
  }
]
```

---

## Jeu de données MongoDB

```json
[
  {
    "name": "Dune",
    "type": "MOVIE",
    "director": "Denis Villeneuve",
    "year": 2021,
    "country": "USA",
    "createdAt": { "$date": "2026-03-25T10:00:00Z" }
  },
  {
    "name": "Blade Runner 2049",
    "type": "MOVIE",
    "director": "Denis Villeneuve",
    "year": 2017,
    "country": "USA",
    "createdAt": { "$date": "2026-03-25T10:01:00Z" }
  },
  {
    "name": "Arrival",
    "type": "MOVIE",
    "director": "Denis Villeneuve",
    "year": 2016,
    "country": "USA",
    "createdAt": { "$date": "2026-03-25T10:02:00Z" }
  },
  {
    "name": "Interstellar",
    "type": "MOVIE",
    "director": "Christopher Nolan",
    "year": 2014,
    "country": "USA",
    "createdAt": { "$date": "2026-03-25T10:03:00Z" }
  }
]
```

---

## Réponses typiques

### `GET /test/media/count`

```json
{
  "count": 4
}
```

### `DELETE /test/media/{id}` succès

```json
{
  "id": "67f000000000000000000001",
  "deleted": true
}
```

### `DELETE /test/media/{id}` non trouvé

```json
{
  "id": "67f000000000000000000999",
  "deleted": false
}
```

### `DELETE /test/media`

```json
{
  "deletedCount": 4
}
```

---

## Pourquoi faire une interface de service

Cette structure permet :

- de découpler le controller de l’implémentation
- de changer l’implémentation plus facilement
- de préparer les tests unitaires avec mock
- de garder une architecture propre

---

## Pourquoi faire une interface de repository

Avec Spring Data MongoDB :

- on déclare une interface
- Spring génère automatiquement l’implémentation
- on profite des méthodes standards de `MongoRepository`
- on peut ajouter des méthodes dérivées comme `findByType`

---

## Architecture finale

```text
TestController
    ↓
TestService
    ↓
TestServiceImpl
    ↓
MediaRepository
    ↓
MongoDB
```

---

## Suite logique du tuto

Ensuite tu peux faire une version 2 avec :

- `PUT`
- `PATCH`
- validation
- gestion d’erreurs globale
- pagination
- tri
- aggregation MongoDB