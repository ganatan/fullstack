# CRUD REST – MediaController (PostgreSQL) – tout en un

Implémentation simplifiée :
- un seul fichier
- aucun Service séparé
- aucun Repository séparé
- entité JPA définie dans le controller

---

## Structure

```
com.ganatan.starter.api.media
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

## Code – MediaController.java

```java
package com.ganatan.starter.api.media;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/media")
public class MediaController {

  private final MediaRepository mediaRepository;

  public MediaController(MediaRepository mediaRepository) {
    this.mediaRepository = mediaRepository;
  }

  @Entity
  @Table(name = "media")
  public static class Media {

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

  @Repository
  public interface MediaRepository extends JpaRepository<Media, Long> {}

  @GetMapping
  public List<Media> getAllMedia() {
    return mediaRepository.findAll();
  }

  @GetMapping("/{id}")
  public Media getMediaById(@PathVariable Long id) {
    return findById(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Media createMedia(@RequestBody Media media) {
    return mediaRepository.save(media);
  }

  @PutMapping("/{id}")
  public Media updateMedia(@PathVariable Long id, @RequestBody Media modified) {
    Media existing = findById(id);
    existing.setMediaId(modified.getMediaId());
    existing.setTitle(modified.getTitle());
    existing.setType(modified.getType());
    existing.setReleaseYear(modified.getReleaseYear());
    return mediaRepository.save(existing);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteMedia(@PathVariable Long id) {
    Media existing = findById(id);
    mediaRepository.delete(existing);
  }

  private Media findById(Long id) {
    return mediaRepository.findById(id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
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
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

class MediaControllerTests {

  @Mock
  private MediaController.MediaRepository mediaRepository;

  @InjectMocks
  private MediaController mediaController;

  private MediaController.Media inception;
  private MediaController.Media matrix;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    inception = new MediaController.Media(1L, 1, "Inception", "MOVIE", 2010);
    matrix = new MediaController.Media(2L, 2, "The Matrix", "MOVIE", 1999);
  }

  // --- GET /media ---

  @Test
  void getAllMedia_shouldReturnList() {
    when(mediaRepository.findAll()).thenReturn(List.of(inception, matrix));

    List<MediaController.Media> result = mediaController.getAllMedia();

    assertNotNull(result);
    assertEquals(2, result.size());
    verify(mediaRepository, times(1)).findAll();
  }

  @Test
  void getAllMedia_shouldReturnEmptyList_whenNoMedia() {
    when(mediaRepository.findAll()).thenReturn(List.of());

    List<MediaController.Media> result = mediaController.getAllMedia();

    assertTrue(result.isEmpty());
  }

  // --- GET /media/{id} ---

  @Test
  void getMediaById_shouldReturnMedia_whenIdExists() {
    when(mediaRepository.findById(1L)).thenReturn(Optional.of(inception));

    MediaController.Media result = mediaController.getMediaById(1L);

    assertNotNull(result);
    assertEquals(1L, result.getId());
    assertEquals("Inception", result.getTitle());
    verify(mediaRepository, times(1)).findById(1L);
  }

  @Test
  void getMediaById_shouldThrowNotFound_whenIdDoesNotExist() {
    when(mediaRepository.findById(999L)).thenReturn(Optional.empty());

    ResponseStatusException ex = assertThrows(
      ResponseStatusException.class,
      () -> mediaController.getMediaById(999L)
    );
    assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
  }

  // --- POST /media ---

  @Test
  void createMedia_shouldReturnCreatedMedia() {
    MediaController.Media input = new MediaController.Media(null, 3, "Interstellar", "MOVIE", 2014);
    MediaController.Media saved = new MediaController.Media(3L, 3, "Interstellar", "MOVIE", 2014);
    when(mediaRepository.save(input)).thenReturn(saved);

    MediaController.Media result = mediaController.createMedia(input);

    assertNotNull(result);
    assertEquals(3L, result.getId());
    assertEquals("Interstellar", result.getTitle());
    verify(mediaRepository, times(1)).save(input);
  }

  @Test
  void createMedia_shouldCallRepositoryOnce() {
    MediaController.Media input = new MediaController.Media(null, 3, "Interstellar", "MOVIE", 2014);
    when(mediaRepository.save(any())).thenReturn(input);

    mediaController.createMedia(input);

    verify(mediaRepository, times(1)).save(input);
  }

  // --- PUT /media/{id} ---

  @Test
  void updateMedia_shouldReturnUpdatedMedia_whenIdExists() {
    MediaController.Media modified = new MediaController.Media(null, 1, "Inception Updated", "MOVIE", 2010);
    MediaController.Media updated = new MediaController.Media(1L, 1, "Inception Updated", "MOVIE", 2010);
    when(mediaRepository.findById(1L)).thenReturn(Optional.of(inception));
    when(mediaRepository.save(any())).thenReturn(updated);

    MediaController.Media result = mediaController.updateMedia(1L, modified);

    assertNotNull(result);
    assertEquals("Inception Updated", result.getTitle());
    verify(mediaRepository, times(1)).findById(1L);
    verify(mediaRepository, times(1)).save(any());
  }

  @Test
  void updateMedia_shouldThrowNotFound_whenIdDoesNotExist() {
    MediaController.Media modified = new MediaController.Media(null, 1, "Unknown", "MOVIE", 2000);
    when(mediaRepository.findById(999L)).thenReturn(Optional.empty());

    ResponseStatusException ex = assertThrows(
      ResponseStatusException.class,
      () -> mediaController.updateMedia(999L, modified)
    );
    assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
  }

  // --- DELETE /media/{id} ---

  @Test
  void deleteMedia_shouldCallRepository_whenIdExists() {
    when(mediaRepository.findById(1L)).thenReturn(Optional.of(inception));
    doNothing().when(mediaRepository).delete(inception);

    mediaController.deleteMedia(1L);

    verify(mediaRepository, times(1)).findById(1L);
    verify(mediaRepository, times(1)).delete(inception);
  }

  @Test
  void deleteMedia_shouldThrowNotFound_whenIdDoesNotExist() {
    when(mediaRepository.findById(999L)).thenReturn(Optional.empty());

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

- `Media` et `MediaRepository` sont des classes `static` imbriquées dans le controller
- `@Entity` et `@Repository` fonctionnent sur des classes internes `static` — Spring les détecte
- le controller reçoit le repository par injection de constructeur
- `findById()` est une méthode privée du controller — évite la duplication du 404
- `mediaRepository.save()` : insert si `id == null`, update si `id` existe déjà
- `ddl-auto=update` : Hibernate crée la table `media` automatiquement au premier démarrage
- les tests mockent directement `MediaController.MediaRepository` — pas besoin de Spring context
