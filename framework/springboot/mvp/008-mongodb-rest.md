# Tuto Spring Boot MongoDB : `TestController` pour tester `GET`, `POST`, `DELETE` sur une collection `Media`

## Objectif

Créer une petite API Spring Boot avec MongoDB pour tester rapidement :

- récupérer tous les médias
- récupérer un média par id
- rechercher par nom
- créer un média
- supprimer un média par id
- supprimer tous les médias
- compter les documents
- vérifier la connexion MongoDB

Le but est d’avoir un controller de test simple, lisible, pratique pour Postman ou Swagger.

---

## Dépendance Maven

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
  <groupId>org.springframework.boot</groupId>
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

## Collection MongoDB

Nom de la collection :

```text
media
```

Base utilisée :

```text
media_db
```

---

## Document `Media`

Exemple de document MongoDB :

```json
{
  "_id": "67f000000000000000000001",
  "name": "Dune",
  "type": "MOVIE",
  "director": "Denis Villeneuve",
  "year": 2021,
  "country": "USA",
  "createdAt": "2026-03-25T10:00:00Z"
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

## `TestService`

```java
package com.example.demo.media;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.bson.Document;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service
public class TestService {

    private final MongoTemplate mongoTemplate;

    public TestService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public Document ping() {
        return mongoTemplate.getDb().runCommand(new Document("ping", 1));
    }

    public List<Media> findAll() {
        Query query = new Query();
        query.with(Sort.by(Sort.Direction.ASC, "name"));
        return mongoTemplate.find(query, Media.class);
    }

    public Optional<Media> findById(String id) {
        Media media = mongoTemplate.findById(id, Media.class);
        return Optional.ofNullable(media);
    }

    public List<Media> findByName(String name) {
        Query query = new Query();
        query.addCriteria(Criteria.where("name").regex(name, "i"));
        query.with(Sort.by(Sort.Direction.ASC, "name"));
        return mongoTemplate.find(query, Media.class);
    }

    public List<Media> findByType(String type) {
        Query query = new Query();
        query.addCriteria(Criteria.where("type").is(type));
        query.with(Sort.by(Sort.Direction.ASC, "name"));
        return mongoTemplate.find(query, Media.class);
    }

    public List<Media> findByDirector(String director) {
        Query query = new Query();
        query.addCriteria(Criteria.where("director").regex(director, "i"));
        query.with(Sort.by(Sort.Direction.ASC, "year"));
        return mongoTemplate.find(query, Media.class);
    }

    public List<Media> findByYear(Integer year) {
        Query query = new Query();
        query.addCriteria(Criteria.where("year").is(year));
        query.with(Sort.by(Sort.Direction.ASC, "name"));
        return mongoTemplate.find(query, Media.class);
    }

    public Media create(Media media) {
        if (media.getCreatedAt() == null) {
            media.setCreatedAt(Instant.now());
        }
        return mongoTemplate.save(media);
    }

    public List<Media> createMany(List<Media> medias) {
        Instant now = Instant.now();
        for (Media media : medias) {
            if (media.getCreatedAt() == null) {
                media.setCreatedAt(now);
            }
        }
        return (List<Media>) mongoTemplate.insert(medias, Media.class);
    }

    public boolean deleteById(String id) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        return mongoTemplate.remove(query, Media.class).getDeletedCount() > 0;
    }

    public long deleteAll() {
        Query query = new Query();
        return mongoTemplate.remove(query, Media.class).getDeletedCount();
    }

    public long count() {
        return mongoTemplate.count(new Query(), Media.class);
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

@RequestMapping("/test/media")
@RestController
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

    @org.springframework.web.bind.annotation.PostMapping
    public ResponseEntity<Media> create(@RequestBody Media media) {
        Media created = testService.create(media);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @org.springframework.web.bind.annotation.PostMapping("/bulk")
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

## Toutes les possibilités couvertes

### Vérifier la connexion MongoDB

```http
GET /test/media/ping
```

### Récupérer tous les documents

```http
GET /test/media
```

### Compter les documents

```http
GET /test/media/count
```

### Récupérer un document par id

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

### Créer un document

```http
POST /test/media
```

### Créer plusieurs documents

```http
POST /test/media/bulk
```

### Supprimer un document par id

```http
DELETE /test/media/{id}
```

### Supprimer tous les documents

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
    "name": "Blade Runner 2049",
    "type": "MOVIE",
    "director": "Denis Villeneuve",
    "year": 2017,
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

## Exemple de réponses

## `GET /test/media/ping`

```json
{
  "ok": 1.0,
  "result": {
    "ok": 1.0
  }
}
```

## `GET /test/media/count`

```json
{
  "count": 3
}
```

## `DELETE /test/media/{id}` si trouvé

```json
{
  "id": "67f000000000000000000001",
  "deleted": true
}
```

## `DELETE /test/media/{id}` si non trouvé

```json
{
  "id": "67f000000000000000000999",
  "deleted": false
}
```

## `DELETE /test/media`

```json
{
  "deletedCount": 3
}
```

---

## Jeu de données de test MongoDB

Tu peux insérer directement ces documents dans Compass ou mongosh.

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

## Variante avec `MediaRepository`

Si tu veux plus simple pour un tuto débutant, tu peux aussi faire avec `MongoRepository`.

---

## `MediaRepository`

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

## `TestService` version repository

```java
package com.example.demo.media;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

@Service
public class TestService {

    private final MediaRepository mediaRepository;
    private final MongoTemplate mongoTemplate;

    public TestService(MediaRepository mediaRepository, MongoTemplate mongoTemplate) {
        this.mediaRepository = mediaRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public Document ping() {
        return mongoTemplate.getDb().runCommand(new Document("ping", 1));
    }

    public List<Media> findAll() {
        return mediaRepository.findAll();
    }

    public Optional<Media> findById(String id) {
        return mediaRepository.findById(id);
    }

    public List<Media> findByName(String name) {
        return mediaRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Media> findByType(String type) {
        return mediaRepository.findByType(type);
    }

    public List<Media> findByDirector(String director) {
        return mediaRepository.findByDirectorContainingIgnoreCase(director);
    }

    public List<Media> findByYear(Integer year) {
        return mediaRepository.findByYear(year);
    }

    public Media create(Media media) {
        if (media.getCreatedAt() == null) {
            media.setCreatedAt(Instant.now());
        }
        return mediaRepository.save(media);
    }

    public List<Media> createMany(List<Media> medias) {
        Instant now = Instant.now();
        for (Media media : medias) {
            if (media.getCreatedAt() == null) {
                media.setCreatedAt(now);
            }
        }
        return mediaRepository.saveAll(medias);
    }

    public boolean deleteById(String id) {
        if (!mediaRepository.existsById(id)) {
            return false;
        }
        mediaRepository.deleteById(id);
        return true;
    }

    public long deleteAll() {
        long count = mediaRepository.count();
        mediaRepository.deleteAll();
        return count;
    }

    public long count() {
        return mediaRepository.count();
    }
}
```

---

## Plan de tuto conseillé

## Étape 1

Créer la classe `Media`

## Étape 2

Configurer MongoDB dans `application.yml`

## Étape 3

Faire un `GET /ping`

## Étape 4

Faire `GET /all` et `GET /{id}`

## Étape 5

Faire `POST`

## Étape 6

Faire `DELETE /{id}` et `DELETE /all`

## Étape 7

Ajouter les recherches par critères

---

## URLs récapitulatives

```text
GET    /test/media/ping
GET    /test/media
GET    /test/media/count
GET    /test/media/{id}
GET    /test/media/search/by-name?name=dune
GET    /test/media/search/by-type?type=MOVIE
GET    /test/media/search/by-director?director=villeneuve
GET    /test/media/search/by-year?year=2021
POST   /test/media
POST   /test/media/bulk
DELETE /test/media/{id}
DELETE /test/media
```

---

## Ce que ce tuto permet de montrer

- connexion MongoDB avec Spring Boot
- lecture simple d’une collection
- insertion d’un document
- insertion en masse
- suppression ciblée
- suppression globale
- recherche par critères
- comptage des documents
- ping de la base MongoDB

---

## Suite logique du tuto

Après ça, tu peux faire un tuto 2 avec :

- `PUT`
- `PATCH`
- gestion d’erreur globale
- validation
- pagination
- tri
- aggregation MongoDB