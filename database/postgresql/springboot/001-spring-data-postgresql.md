# CRUD REST – MediaController (PostgreSQL)

Implémentation sans Service :
- `Media` et `MediaRepository` dans leurs propres fichiers (requis par Spring)
- toute la logique métier dans le controller
- pas de couche Service

---

## Structure

```
com.ganatan.starter.api.media
├── Media.java
├── MediaRepository.java
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

  @Column(name = "name", nullable = false, length = 255)
  private String name;

  @Column(name = "release_date")
  private int releaseDate;

  public Media() {}

  public Media(Long id, String name, int releaseDate) {
    this.id = id;
    this.name = name;
    this.releaseDate = releaseDate;
  }

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public int getReleaseDate() { return releaseDate; }
  public void setReleaseDate(int releaseDate) { this.releaseDate = releaseDate; }
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
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/media")
public class MediaController {

  private final MediaRepository mediaRepository;

  public MediaController(MediaRepository mediaRepository) {
    this.mediaRepository = mediaRepository;
  }

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
    existing.setName(modified.getName());
    existing.setReleaseDate(modified.getReleaseDate());
    return mediaRepository.save(existing);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteMedia(@PathVariable Long id) {
    mediaRepository.delete(findById(id));
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
  private MediaRepository mediaRepository;

  @InjectMocks
  private MediaController mediaController;

  private Media matrix;
  private Media bladeRunner;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    matrix    = new Media(1000L, "The Matrix", 1999);
    bladeRunner = new Media(1001L, "Blade Runner", 1982);
  }

  // --- GET /media ---

  @Test
  void getAllMedia_shouldReturnList() {
    when(mediaRepository.findAll()).thenReturn(List.of(matrix, bladeRunner));

    List<Media> result = mediaController.getAllMedia();

    assertNotNull(result);
    assertEquals(2, result.size());
    verify(mediaRepository, times(1)).findAll();
  }

  @Test
  void getAllMedia_shouldReturnEmptyList_whenNoMedia() {
    when(mediaRepository.findAll()).thenReturn(List.of());

    List<Media> result = mediaController.getAllMedia();

    assertTrue(result.isEmpty());
  }

  // --- GET /media/{id} ---

  @Test
  void getMediaById_shouldReturnMedia_whenIdExists() {
    when(mediaRepository.findById(1000L)).thenReturn(Optional.of(matrix));

    Media result = mediaController.getMediaById(1000L);

    assertNotNull(result);
    assertEquals(1000L, result.getId());
    assertEquals("The Matrix", result.getName());
    assertEquals(1999, result.getReleaseDate());
    verify(mediaRepository, times(1)).findById(1000L);
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
    Media input = new Media(null, "Alien", 1979);
    Media saved = new Media(1002L, "Alien", 1979);
    when(mediaRepository.save(input)).thenReturn(saved);

    Media result = mediaController.createMedia(input);

    assertNotNull(result);
    assertEquals(1002L, result.getId());
    assertEquals("Alien", result.getName());
    assertEquals(1979, result.getReleaseDate());
    verify(mediaRepository, times(1)).save(input);
  }

  @Test
  void createMedia_shouldCallRepositoryOnce() {
    Media input = new Media(null, "Alien", 1979);
    when(mediaRepository.save(any())).thenReturn(input);

    mediaController.createMedia(input);

    verify(mediaRepository, times(1)).save(input);
  }

  // --- PUT /media/{id} ---

  @Test
  void updateMedia_shouldReturnUpdatedMedia_whenIdExists() {
    Media modified = new Media(null, "The Matrix Reloaded", 2003);
    Media updated = new Media(1000L, "The Matrix Reloaded", 2003);
    when(mediaRepository.findById(1000L)).thenReturn(Optional.of(matrix));
    when(mediaRepository.save(any())).thenReturn(updated);

    Media result = mediaController.updateMedia(1000L, modified);

    assertNotNull(result);
    assertEquals("The Matrix Reloaded", result.getName());
    assertEquals(2003, result.getReleaseDate());
    verify(mediaRepository, times(1)).findById(1000L);
    verify(mediaRepository, times(1)).save(any());
  }

  @Test
  void updateMedia_shouldThrowNotFound_whenIdDoesNotExist() {
    Media modified = new Media(null, "Unknown", 2000);
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
    when(mediaRepository.findById(1000L)).thenReturn(Optional.of(matrix));
    doNothing().when(mediaRepository).delete(matrix);

    mediaController.deleteMedia(1000L);

    verify(mediaRepository, times(1)).findById(1000L);
    verify(mediaRepository, times(1)).delete(matrix);
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

  @Test
  void media_setId_shouldUpdateId() {
    Media media = new Media(null, "Alien", 1979);
    media.setId(42L);
    assertEquals(42L, media.getId());
  }  
}
```

---

## Pourquoi 3 fichiers et pas 1 ?

Spring Data JPA scanne les interfaces `JpaRepository` au démarrage. Une interface imbriquée dans un controller **n'est pas détectée** — Spring lève `UnsatisfiedDependencyException`.

La règle : `@Entity` et `@Repository` doivent être dans des fichiers de premier niveau. La logique reste dans le controller — pas de Service.

---

## Principes clés

- `@Entity` + `@Table(name = "media")` : mappe la classe sur la table PostgreSQL
- `@Id` + `@GeneratedValue(IDENTITY)` : id `bigint` auto-incrémenté par PostgreSQL
- `@Column(length = 255)` : correspond à `character varying (255)` en PostgreSQL
- `release_date` est un `int` — correspond à `integer` en PostgreSQL
- `JpaRepository<Media, Long>` : fournit `findAll`, `findById`, `save`, `delete` sans code
- `ddl-auto=update` : Hibernate crée la table automatiquement au premier démarrage
- `findById()` privée dans le controller : centralise la gestion du 404
- `mediaRepository.save(existing)` : UPDATE si l'entité a déjà un id
- tests Mockito : aucune connexion PostgreSQL nécessaire
