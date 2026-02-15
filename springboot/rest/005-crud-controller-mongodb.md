# CRUD REST – MediaController (MongoDB)

Implémentation avec MongoDB :
- `MongoRepository` pour l'accès aux données
- `MediaController` expose les endpoints REST
- `MediaService` contient la logique métier
- `Media` est le document MongoDB

---

## Structure

```
com.ganatan.starter.api.media
├── Media.java
├── MediaRepository.java
├── MediaService.java
├── MediaController.java
└── MediaControllerTests.java
```

---

## Endpoints exposés

| Méthode | URL            | Description        | Status succès  |
|---------|----------------|--------------------|----------------|
| GET     | /media         | Liste tous         | 200 OK         |
| GET     | /media/{id}    | Trouve par id      | 200 OK         |
| POST    | /media         | Crée un media      | 201 CREATED    |
| PUT     | /media/{id}    | Modifie un media   | 200 OK         |
| DELETE  | /media/{id}    | Supprime un media  | 204 NO CONTENT |

Base URL : `http://localhost:8080/media`

---

## Dépendances – pom.xml

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```

---

## Configuration – application.properties

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/ganatan
```

---

## Code – Media.java

```java
package com.ganatan.starter.api.media;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "media_read")
public class Media {

  @Id
  private String id;
  private int mediaId;
  private String title;
  private String type;
  private int releaseYear;
  private List<String> persons;

  public Media() {}

  public Media(String id, int mediaId, String title, String type, int releaseYear, List<String> persons) {
    this.id = id;
    this.mediaId = mediaId;
    this.title = title;
    this.type = type;
    this.releaseYear = releaseYear;
    this.persons = persons;
  }

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }

  public int getMediaId() { return mediaId; }
  public void setMediaId(int mediaId) { this.mediaId = mediaId; }

  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }

  public String getType() { return type; }
  public void setType(String type) { this.type = type; }

  public int getReleaseYear() { return releaseYear; }
  public void setReleaseYear(int releaseYear) { this.releaseYear = releaseYear; }

  public List<String> getPersons() { return persons; }
  public void setPersons(List<String> persons) { this.persons = persons; }
}
```

---

## Code – MediaRepository.java

```java
package com.ganatan.starter.api.media;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MediaRepository extends MongoRepository<Media, String> {}
```

---

## Code – MediaService.java

```java
package com.ganatan.starter.api.media;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class MediaService {

  private final MediaRepository mediaRepository;

  public MediaService(MediaRepository mediaRepository) {
    this.mediaRepository = mediaRepository;
  }

  public List<Media> findAll() {
    return mediaRepository.findAll();
  }

  public Media findById(String id) {
    return mediaRepository.findById(id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  public Media create(Media media) {
    return mediaRepository.save(media);
  }

  public Media update(String id, Media modified) {
    Media existing = findById(id);
    existing.setMediaId(modified.getMediaId());
    existing.setTitle(modified.getTitle());
    existing.setType(modified.getType());
    existing.setReleaseYear(modified.getReleaseYear());
    existing.setPersons(modified.getPersons());
    return mediaRepository.save(existing);
  }

  public void delete(String id) {
    Media existing = findById(id);
    mediaRepository.delete(existing);
  }
}
```

---

## Code – MediaController.java

```java
package com.ganatan.starter.api.media;

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

@RestController
@RequestMapping("/media")
public class MediaController {

  private final MediaService mediaService;

  public MediaController(MediaService mediaService) {
    this.mediaService = mediaService;
  }

  @GetMapping
  public List<Media> getAllMedia() {
    return mediaService.findAll();
  }

  @GetMapping("/{id}")
  public Media getMediaById(@PathVariable String id) {
    return mediaService.findById(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Media createMedia(@RequestBody Media media) {
    return mediaService.create(media);
  }

  @PutMapping("/{id}")
  public Media updateMedia(@PathVariable String id, @RequestBody Media media) {
    return mediaService.update(id, media);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteMedia(@PathVariable String id) {
    mediaService.delete(id);
  }
}
```

---

## Test – MediaControllerTests.java

```java
package com.ganatan.starter.api.media;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

class MediaControllerTests {

  @Mock
  private MediaService mediaService;

  @InjectMocks
  private MediaController mediaController;

  private Media inception;
  private Media matrix;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    inception = new Media("1", 1, "Inception", "MOVIE", 2010, List.of());
    matrix = new Media("2", 2, "The Matrix", "MOVIE", 1999, List.of());
  }

  // --- GET /media ---

  @Test
  void getAllMedia_shouldReturnList() {
    when(mediaService.findAll()).thenReturn(List.of(inception, matrix));

    List<Media> result = mediaController.getAllMedia();

    assertNotNull(result);
    assertEquals(2, result.size());
    verify(mediaService, times(1)).findAll();
  }

  @Test
  void getAllMedia_shouldReturnEmptyList_whenNoMedia() {
    when(mediaService.findAll()).thenReturn(List.of());

    List<Media> result = mediaController.getAllMedia();

    assertTrue(result.isEmpty());
  }

  // --- GET /media/{id} ---

  @Test
  void getMediaById_shouldReturnMedia_whenIdExists() {
    when(mediaService.findById("1")).thenReturn(inception);

    Media result = mediaController.getMediaById("1");

    assertNotNull(result);
    assertEquals("1", result.getId());
    assertEquals("Inception", result.getTitle());
    verify(mediaService, times(1)).findById("1");
  }

  @Test
  void getMediaById_shouldThrowNotFound_whenIdDoesNotExist() {
    when(mediaService.findById("999"))
      .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND));

    ResponseStatusException ex = assertThrows(
      ResponseStatusException.class,
      () -> mediaController.getMediaById("999")
    );
    assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
  }

  // --- POST /media ---

  @Test
  void createMedia_shouldReturnCreatedMedia() {
    Media input = new Media(null, 3, "Interstellar", "MOVIE", 2014, List.of());
    Media saved = new Media("3", 3, "Interstellar", "MOVIE", 2014, List.of());
    when(mediaService.create(input)).thenReturn(saved);

    Media result = mediaController.createMedia(input);

    assertNotNull(result);
    assertEquals("3", result.getId());
    assertEquals("Interstellar", result.getTitle());
    verify(mediaService, times(1)).create(input);
  }

  @Test
  void createMedia_shouldCallServiceOnce() {
    Media input = new Media(null, 3, "Interstellar", "MOVIE", 2014, List.of());
    when(mediaService.create(any())).thenReturn(input);

    mediaController.createMedia(input);

    verify(mediaService, times(1)).create(input);
  }

  // --- PUT /media/{id} ---

  @Test
  void updateMedia_shouldReturnUpdatedMedia_whenIdExists() {
    Media modified = new Media(null, 1, "Inception Updated", "MOVIE", 2010, List.of());
    Media updated = new Media("1", 1, "Inception Updated", "MOVIE", 2010, List.of());
    when(mediaService.update("1", modified)).thenReturn(updated);

    Media result = mediaController.updateMedia("1", modified);

    assertNotNull(result);
    assertEquals("Inception Updated", result.getTitle());
    verify(mediaService, times(1)).update("1", modified);
  }

  @Test
  void updateMedia_shouldThrowNotFound_whenIdDoesNotExist() {
    Media modified = new Media(null, 1, "Unknown", "MOVIE", 2000, List.of());
    when(mediaService.update(eq("999"), any()))
      .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND));

    ResponseStatusException ex = assertThrows(
      ResponseStatusException.class,
      () -> mediaController.updateMedia("999", modified)
    );
    assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
  }

  // --- DELETE /media/{id} ---

  @Test
  void deleteMedia_shouldCallService_whenIdExists() {
    doNothing().when(mediaService).delete("1");

    mediaController.deleteMedia("1");

    verify(mediaService, times(1)).delete("1");
  }

  @Test
  void deleteMedia_shouldThrowNotFound_whenIdDoesNotExist() {
    doThrow(new ResponseStatusException(HttpStatus.NOT_FOUND))
      .when(mediaService).delete("999");

    ResponseStatusException ex = assertThrows(
      ResponseStatusException.class,
      () -> mediaController.deleteMedia("999")
    );
    assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
  }
}
```

---

## Principes clés

- `@Document(collection = "media_read")` : mappe la classe sur la collection MongoDB
- `@Id` : mappe le champ sur l'`_id` MongoDB (String = ObjectId sérialisé)
- `MongoRepository<Media, String>` : fournit `findAll`, `findById`, `save`, `delete` sans code
- `MediaService` : isole la logique métier du controller — le controller ne connaît pas le repository
- `ResponseStatusException(HttpStatus.NOT_FOUND)` : lève un 404 si le document est absent
- `mediaRepository.save(existing)` : en MongoDB, `save` fait un upsert — insert si pas d'id, update sinon
- Tests Mockito : le repository n'est jamais appelé — seul le comportement du service est simulé
- `@InjectMocks` : injecte les mocks dans le controller automatiquement
- `verify(service, times(1))` : vérifie que la méthode a bien été appelée une fois
