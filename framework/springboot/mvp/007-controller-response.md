# Tuto Spring Boot : API REST `TestController` avec MongoDB, `ResponseMediaDTO` uniquement pour le mapping de réponse

## Objectif

Créer une API REST simple avec :

- une collection MongoDB `media`
- un `TestController`
- un `Service` via interface
- un `ServiceImpl`
- un `Repository` via interface
- un `ResponseMediaDTO` utilisé uniquement pour les réponses

Ici, on ne fait pas de DTO pour la requête.

Le `POST` reçoit directement un objet `Media`, mais toutes les réponses de l’API passent par un mapping vers `ResponseMediaDTO`.

---

## Idée

On sépare :

- l’objet MongoDB stocké en base : `Media`
- l’objet retourné au client : `ResponseMediaDTO`

Donc :

- entrée API : `Media`
- sortie API : `ResponseMediaDTO`

---

## Structure du projet

```text
src/main/java/com/example/demo/
├── DemoApplication.java
├── media/
│   ├── Media.java
│   ├── ResponseMediaDTO.java
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
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```

---

## `application.yml`

```yaml
spring:
  application:
    name: springboot-media-api
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

C’est le document MongoDB.

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

## Classe `ResponseMediaDTO`

C’est l’objet retourné par l’API.

On peut choisir exactement ce qu’on expose.

```java
package com.example.demo.media;

public class ResponseMediaDTO {

    private String id;
    private String name;
    private String type;
    private String director;
    private Integer year;
    private String country;
    private String createdAt;

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

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
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
}
```

---

## Interface `TestService`

Le service retourne maintenant des `ResponseMediaDTO`.

```java
package com.example.demo.media;

import java.util.List;
import java.util.Optional;

public interface TestService {

    List<ResponseMediaDTO> findAll();

    Optional<ResponseMediaDTO> findById(String id);

    List<ResponseMediaDTO> findByName(String name);

    List<ResponseMediaDTO> findByType(String type);

    ResponseMediaDTO create(Media media);

    boolean deleteById(String id);

    long count();
}
```

---

## Classe `TestServiceImpl`

Ici on fait le mapping `Media -> ResponseMediaDTO`.

```java
package com.example.demo.media;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class TestServiceImpl implements TestService {

    private final MediaRepository mediaRepository;

    public TestServiceImpl(MediaRepository mediaRepository) {
        this.mediaRepository = mediaRepository;
    }

    @Override
    public List<ResponseMediaDTO> findAll() {
        return mediaRepository.findAll()
            .stream()
            .map(this::toResponseMediaDTO)
            .toList();
    }

    @Override
    public Optional<ResponseMediaDTO> findById(String id) {
        return mediaRepository.findById(id)
            .map(this::toResponseMediaDTO);
    }

    @Override
    public List<ResponseMediaDTO> findByName(String name) {
        return mediaRepository.findByNameContainingIgnoreCase(name)
            .stream()
            .map(this::toResponseMediaDTO)
            .toList();
    }

    @Override
    public List<ResponseMediaDTO> findByType(String type) {
        return mediaRepository.findByType(type)
            .stream()
            .map(this::toResponseMediaDTO)
            .toList();
    }

    @Override
    public ResponseMediaDTO create(Media media) {
        media.setId(null);
        media.setCreatedAt(Instant.now());
        Media savedMedia = mediaRepository.save(media);
        return toResponseMediaDTO(savedMedia);
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
    public long count() {
        return mediaRepository.count();
    }

    private ResponseMediaDTO toResponseMediaDTO(Media media) {
        ResponseMediaDTO responseMediaDTO = new ResponseMediaDTO();
        responseMediaDTO.setId(media.getId());
        responseMediaDTO.setName(media.getName());
        responseMediaDTO.setType(media.getType());
        responseMediaDTO.setDirector(media.getDirector());
        responseMediaDTO.setYear(media.getYear());
        responseMediaDTO.setCountry(media.getCountry());
        responseMediaDTO.setCreatedAt(media.getCreatedAt() != null ? media.getCreatedAt().toString() : null);
        return responseMediaDTO;
    }
}
```

---

## `TestController`

Le controller retourne uniquement des `ResponseMediaDTO`.

```java
package com.example.demo.media;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test/media")
public class TestController {

    private final TestService testService;

    public TestController(TestService testService) {
        this.testService = testService;
    }

    @GetMapping
    public List<ResponseMediaDTO> getAll() {
        return testService.findAll();
    }

    @GetMapping("/count")
    public Map<String, Object> count() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("count", testService.count());
        return response;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseMediaDTO> getById(@PathVariable String id) {
        Optional<ResponseMediaDTO> media = testService.findById(id);
        return media.map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/search/by-name")
    public List<ResponseMediaDTO> getByName(@RequestParam String name) {
        return testService.findByName(name);
    }

    @GetMapping("/search/by-type")
    public List<ResponseMediaDTO> getByType(@RequestParam String type) {
        return testService.findByType(type);
    }

    @PostMapping
    public ResponseEntity<ResponseMediaDTO> create(@RequestBody Media media) {
        ResponseMediaDTO created = testService.create(media);
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
}
```

---

## Endpoints disponibles

### Récupérer tous les médias

```http
GET /test/media
```

### Compter les médias

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

### Créer un média

```http
POST /test/media
```

### Supprimer un média

```http
DELETE /test/media/{id}
```

---

## Exemple JSON pour le `POST`

Ici on reçoit directement `Media`.

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

## Exemple de réponse du `POST`

La réponse passe par `ResponseMediaDTO`.

```json
{
  "id": "67f000000000000000000001",
  "name": "Dune",
  "type": "MOVIE",
  "director": "Denis Villeneuve",
  "year": 2021,
  "country": "USA",
  "createdAt": "2026-03-25T10:00:00Z"
}
```

---

## Exemple de réponse du `GET /test/media`

```json
[
  {
    "id": "67f000000000000000000001",
    "name": "Dune",
    "type": "MOVIE",
    "director": "Denis Villeneuve",
    "year": 2021,
    "country": "USA",
    "createdAt": "2026-03-25T10:00:00Z"
  },
  {
    "id": "67f000000000000000000002",
    "name": "Arrival",
    "type": "MOVIE",
    "director": "Denis Villeneuve",
    "year": 2016,
    "country": "USA",
    "createdAt": "2026-03-25T10:01:00Z"
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
    "name": "Arrival",
    "type": "MOVIE",
    "director": "Denis Villeneuve",
    "year": 2016,
    "country": "USA",
    "createdAt": { "$date": "2026-03-25T10:01:00Z" }
  },
  {
    "name": "Interstellar",
    "type": "MOVIE",
    "director": "Christopher Nolan",
    "year": 2014,
    "country": "USA",
    "createdAt": { "$date": "2026-03-25T10:02:00Z" }
  }
]
```

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

## Ce que montre ce tuto

- `Media` est le document MongoDB
- `ResponseMediaDTO` sert uniquement pour la sortie API
- le mapping est fait dans `TestServiceImpl`
- le controller retourne uniquement des DTO de réponse
- l’API ne renvoie jamais directement le document MongoDB brut

---

## Pourquoi c’est utile

Cette approche permet :

- de choisir précisément ce que tu exposes
- de masquer des champs internes si besoin
- de stabiliser le contrat de réponse
- de préparer une vraie architecture API propre

---

## Différence avec l’autre version

### Avant

- DTO utilisé pour la request

### Ici

- pas de DTO pour la request
- DTO uniquement pour la response

---

## Suite logique

Le tuto suivant peut être :

- version complète avec `RequestMediaDTO` et `ResponseMediaDTO`
- ajout de validation sur la request
- ajout de `PUT`
- ajout de gestion globale des erreurs