# CRUD REST – MediaController (PostgreSQL)

Implémentation PostgreSQL :
- `JpaRepository` pour l’accès aux données
- `MediaController` expose les endpoints REST
- `MediaService` contient la logique métier
- `Media` est l’entité JPA (table `media` : `id`, `name`, `release_date`)

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
    media.setId(null);
    return mediaRepository.save(media);
  }

  public Media update(Long id, Media modified) {
    Media existing = findById(id);
    existing.setName(modified.getName());
    existing.setReleaseDate(modified.getReleaseDate());
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
    inception = new Media(1L, "Inception", 2010);
    matrix = new Media(2L, "The Matrix", 1999);
  }

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

  @Test
  void getMediaById_shouldReturnMedia_whenIdExists() {
    when(mediaService.findById(1L)).thenReturn(inception);

    Media result = mediaController.getMediaById(1L);

    assertNotNull(result);
    assertEquals(1L, result.getId());
    assertEquals("Inception", result.getName());
    assertEquals(2010, result.getReleaseDate());
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

  @Test
  void createMedia_shouldReturnCreatedMedia() {
    Media input = new Media(null, "Interstellar", 2014);
    Media saved = new Media(3L, "Interstellar", 2014);
    when(mediaService.create(input)).thenReturn(saved);

    Media result = mediaController.createMedia(input);

    assertNotNull(result);
    assertEquals(3L, result.getId());
    assertEquals("Interstellar", result.getName());
    assertEquals(2014, result.getReleaseDate());
    verify(mediaService, times(1)).create(input);
  }

  @Test
  void updateMedia_shouldReturnUpdatedMedia_whenIdExists() {
    Media modified = new Media(null, "Inception Updated", 2010);
    Media updated = new Media(1L, "Inception Updated", 2010);
    when(mediaService.update(1L, modified)).thenReturn(updated);

    Media result = mediaController.updateMedia(1L, modified);

    assertNotNull(result);
    assertEquals("Inception Updated", result.getName());
    assertEquals(2010, result.getReleaseDate());
    verify(mediaService, times(1)).update(1L, modified);
  }

  @Test
  void updateMedia_shouldThrowNotFound_whenIdDoesNotExist() {
    Media modified = new Media(null, "Unknown", 2000);
    when(mediaService.update(eq(999L), any()))
      .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND));

    ResponseStatusException ex = assertThrows(
      ResponseStatusException.class,
      () -> mediaController.updateMedia(999L, modified)
    );
    assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
  }

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

- `@Entity` + `@Table(name="media")` : mapping sur la table PostgreSQL
- `@Id` + `@GeneratedValue(IDENTITY)` : auto-incrément PostgreSQL (BIGSERIAL côté SQL)
- `@Column(name="release_date")` : mapping snake_case DB → camelCase Java
- `JpaRepository<Media, Long>` : CRUD natif (`findAll`, `findById`, `save`, `delete`)
- `ddl-auto=update` : auto-création/migration simple en dev (à éviter en prod)
- `open-in-view=false` : pas de session Hibernate pendant la sérialisation HTTP
- `save(existing)` : entité managée → UPDATE ; `save(new)` → INSERT
- Tests Mockito : isolation du controller, pas de DB, service mocké
