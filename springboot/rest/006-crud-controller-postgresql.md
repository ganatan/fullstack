# CRUD REST – MediaController (PostgreSQL)

Implémentation avec PostgreSQL :
- `JpaRepository` pour l'accès aux données
- `MediaController` expose les endpoints REST
- `MediaService` contient la logique métier
- `Media` est l'entité JPA

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

Base URL : `http://localhost:3000/media`

---

## Dépendances – pom.xml

```xml
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

---

## Configuration – application.properties

```properties
spring.application.name=springboot-starter
server.port=3000

spring.datasource.url=jdbc:postgresql://localhost:5432/backend_media
spring.datasource.username=postgres
spring.datasource.password=Trustno1

spring.jpa.hibernate.ddl-auto=update
spring.jpa.open-in-view=false

spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

---

## Code – Media.java

```java
package com.ganatan.starter.api.media;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "media")
public class Media {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "media_id")
  private int mediaId;

  @Column(name = "title", nullable = false)
  private String title;

  @Column(name = "type")
  private String type;

  @Column(name = "release_year")
  private int releaseYear;

  public Media() {}

  public Media(Long id, int mediaId, String title, String type, int releaseYear) {
    this.id = id;
    this.mediaId = mediaId;
    this.title = title;
    this.type = type;
    this.releaseYear = releaseYear;
  }

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public int getMediaId() { return mediaId; }
  public void setMediaId(int mediaId) { this.mediaId = mediaId; }

  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }

  public String getType() { return type; }
  public void setType(String type) { this.type = type; }

  public int getReleaseYear() { return releaseYear; }
  public void setReleaseYear(int releaseYear) { this.releaseYear = releaseYear; }
}
```

---

## Code – MediaRepository.java

```java
package com.ganatan.starter.api.media;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {}
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

  public Media findById(Long id) {
    return mediaRepository.findById(id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  public Media create(Media media) {
    return mediaRepository.save(media);
  }

  public Media update(Long id, Media modified) {
    Media existing = findById(id);
    existing.setMediaId(modified.getMediaId());
    existing.setTitle(modified.getTitle());
    existing.setType(modified.getType());
    existing.setReleaseYear(modified.getReleaseYear());
    return mediaRepository.save(existing);
  }

  public void delete(Long id) {
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
  public Media getMediaById(@PathVariable Long id) {
    return mediaService.findById(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Media createMedia(@RequestBody Media media) {
    return mediaService.create(media);
  }

  @PutMapping("/{id}")
  public Media updateMedia(@PathVariable Long id, @RequestBody Media media) {
    return mediaService.update(id, media);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteMedia(@PathVariable Long id) {
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
    inception = new Media(1L, 1, "Inception", "MOVIE", 2010);
    matrix = new Media(2L, 2, "The Matrix", "MOVIE", 1999);
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
    when(mediaService.findById(1L)).thenReturn(inception);

    Media result = mediaController.getMediaById(1L);

    assertNotNull(result);
    assertEquals(1L, result.getId());
    assertEquals("Inception", result.getTitle());
    verify(mediaService, times(1)).findById(1L);
  }

  @Test
  void getMediaById_shouldThrowNotFound_whenIdDoesNotExist() {
    when(mediaService.findById(999L))
      .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND));

    ResponseStatusException ex = assertThrows(
      ResponseStatusException.class,
      () -> mediaController.getMediaById(999L)
    );
    assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
  }

  // --- POST /media ---

  @Test
  void createMedia_shouldReturnCreatedMedia() {
    Media input = new Media(null, 3, "Interstellar", "MOVIE", 2014);
    Media saved = new Media(3L, 3, "Interstellar", "MOVIE", 2014);
    when(mediaService.create(input)).thenReturn(saved);

    Media result = mediaController.createMedia(input);

    assertNotNull(result);
    assertEquals(3L, result.getId());
    assertEquals("Interstellar", result.getTitle());
    verify(mediaService, times(1)).create(input);
  }

  @Test
  void createMedia_shouldCallServiceOnce() {
    Media input = new Media(null, 3, "Interstellar", "MOVIE", 2014);
    when(mediaService.create(any())).thenReturn(input);

    mediaController.createMedia(input);

    verify(mediaService, times(1)).create(input);
  }

  // --- PUT /media/{id} ---

  @Test
  void updateMedia_shouldReturnUpdatedMedia_whenIdExists() {
    Media modified = new Media(null, 1, "Inception Updated", "MOVIE", 2010);
    Media updated = new Media(1L, 1, "Inception Updated", "MOVIE", 2010);
    when(mediaService.update(1L, modified)).thenReturn(updated);

    Media result = mediaController.updateMedia(1L, modified);

    assertNotNull(result);
    assertEquals("Inception Updated", result.getTitle());
    verify(mediaService, times(1)).update(1L, modified);
  }

  @Test
  void updateMedia_shouldThrowNotFound_whenIdDoesNotExist() {
    Media modified = new Media(null, 1, "Unknown", "MOVIE", 2000);
    when(mediaService.update(eq(999L), any()))
      .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND));

    ResponseStatusException ex = assertThrows(
      ResponseStatusException.class,
      () -> mediaController.updateMedia(999L, modified)
    );
    assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
  }

  // --- DELETE /media/{id} ---

  @Test
  void deleteMedia_shouldCallService_whenIdExists() {
    doNothing().when(mediaService).delete(1L);

    mediaController.deleteMedia(1L);

    verify(mediaService, times(1)).delete(1L);
  }

  @Test
  void deleteMedia_shouldThrowNotFound_whenIdDoesNotExist() {
    doThrow(new ResponseStatusException(HttpStatus.NOT_FOUND))
      .when(mediaService).delete(999L);

    ResponseStatusException ex = assertThrows(
      ResponseStatusException.class,
      () -> mediaController.deleteMedia(999L)
    );
    assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
  }
}
```

---

## Principes clés

- `@Entity` + `@Table(name = "media")` : mappe la classe sur la table PostgreSQL
- `@Id` + `@GeneratedValue(strategy = GenerationType.IDENTITY)` : id auto-incrémenté par PostgreSQL
- `@Column` : mappe les champs sur les colonnes — snake_case en base, camelCase en Java
- `JpaRepository<Media, Long>` : fournit `findAll`, `findById`, `save`, `delete` sans code
- `ddl-auto=update` : Hibernate crée ou met à jour la table automatiquement au démarrage
- `open-in-view=false` : désactive la session Hibernate sur la couche HTTP — bonne pratique
- `show-sql=true` + `format_sql=true` : affiche les requêtes SQL formatées dans les logs
- `MediaService` : isole la logique métier — le controller ne connaît pas le repository
- `mediaRepository.save(existing)` : en JPA, `save` sur une entité existante fait un UPDATE
- Tests Mockito : aucune connexion PostgreSQL nécessaire — le service est entièrement mocké
- différence MongoDB vs PostgreSQL : `String id` (ObjectId) vs `Long id` (SERIAL/BIGSERIAL)
