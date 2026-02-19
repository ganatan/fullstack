# 006 – CRUD REST · MediaController (PostgreSQL + DTO Validation)

Spring Boot · JPA · PostgreSQL · DTO · Validation · ControllerAdvice · Coverage 100%

---

## Structure du projet

```
com.ganatan.starter.api.media
├── Media.java
├── MediaDTO.java                ← nouveau
├── MediaMapper.java             ← nouveau
├── MediaRepository.java
├── MediaService.java
├── MediaController.java
├── GlobalExceptionHandler.java  ← nouveau
├── MediaControllerTests.java
├── MediaServiceTests.java
├── MediaMapperTests.java        ← nouveau
├── MediaDTOTests.java           ← nouveau
└── MediaTests.java
```

---

## Endpoints REST

| Méthode | URL            | Body entrée | Réponse sortie   | Status succès  |
|---------|----------------|-------------|------------------|----------------|
| GET     | /media         | –           | `List<MediaDTO>` | 200 OK         |
| GET     | /media/{id}    | –           | `MediaDTO`       | 200 OK         |
| POST    | /media         | `MediaDTO`  | `MediaDTO`       | 201 CREATED    |
| PUT     | /media/{id}    | `MediaDTO`  | `MediaDTO`       | 200 OK         |
| DELETE  | /media/{id}    | –           | –                | 204 NO CONTENT |

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

<!-- validation -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-validation</artifactId>
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

## Code – MediaDTO.java

```java
package com.ganatan.starter.api.media;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class MediaDTO {

  @Positive(message = "L'id doit être un nombre positif")
  private Long id;

  @NotBlank(message = "Le nom ne peut pas être vide")
  @Size(max = 255, message = "Le nom ne peut pas dépasser 255 caractères")
  private String name;

  @NotNull(message = "La date de sortie est obligatoire")
  @Min(value = 1888, message = "La date de sortie doit être supérieure à 1888")
  private Integer releaseDate;

  public MediaDTO() {}

  public MediaDTO(Long id, String name, Integer releaseDate) {
    this.id = id;
    this.name = name;
    this.releaseDate = releaseDate;
  }

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public Integer getReleaseDate() { return releaseDate; }
  public void setReleaseDate(Integer releaseDate) { this.releaseDate = releaseDate; }
}
```

---

## Code – MediaMapper.java

```java
package com.ganatan.starter.api.media;

import org.springframework.stereotype.Component;

@Component
public class MediaMapper {

  public MediaDTO toDTO(Media media) {
    return new MediaDTO(
      media.getId(),
      media.getName(),
      media.getReleaseDate()
    );
  }

  public Media toEntity(MediaDTO dto) {
    return new Media(
      dto.getId(),
      dto.getName(),
      dto.getReleaseDate()
    );
  }
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
  private final MediaMapper mediaMapper;

  public MediaService(MediaRepository mediaRepository, MediaMapper mediaMapper) {
    this.mediaRepository = mediaRepository;
    this.mediaMapper = mediaMapper;
  }

  public List<MediaDTO> findAll() {
    return mediaRepository.findAll()
      .stream()
      .map(mediaMapper::toDTO)
      .toList();
  }

  public MediaDTO findById(Long id) {
    Media media = mediaRepository.findById(id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    return mediaMapper.toDTO(media);
  }

  public MediaDTO create(MediaDTO dto) {
    dto.setId(null);
    Media saved = mediaRepository.save(mediaMapper.toEntity(dto));
    return mediaMapper.toDTO(saved);
  }

  public MediaDTO update(Long id, MediaDTO dto) {
    Media existing = mediaRepository.findById(id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    existing.setName(dto.getName());
    existing.setReleaseDate(dto.getReleaseDate());
    return mediaMapper.toDTO(mediaRepository.save(existing));
  }

  public void delete(Long id) {
    Media existing = mediaRepository.findById(id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    mediaRepository.delete(existing);
  }
}
```

---

## Code – MediaController.java

```java
package com.ganatan.starter.api.media;

import java.util.List;
import jakarta.validation.Valid;
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
  public List<MediaDTO> getAllMedia() {
    return mediaService.findAll();
  }

  @GetMapping("/{id}")
  public MediaDTO getMediaById(@PathVariable Long id) {
    return mediaService.findById(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public MediaDTO createMedia(@Valid @RequestBody MediaDTO dto) {
    return mediaService.create(dto);
  }

  @PutMapping("/{id}")
  public MediaDTO updateMedia(@PathVariable Long id, @Valid @RequestBody MediaDTO dto) {
    return mediaService.update(id, dto);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteMedia(@PathVariable Long id) {
    mediaService.delete(id);
  }
}
```

---

## Code – GlobalExceptionHandler.java

```java
package com.ganatan.starter.api.media;

import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public Map<String, String> handleValidationErrors(MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult()
      .getFieldErrors()
      .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
    return errors;
  }
}
```

Exemple de réponse `400 Bad Request` :

```json
{
  "name": "Le nom ne peut pas être vide",
  "releaseDate": "La date de sortie est obligatoire"
}
```

---

## Tests – Stratégie coverage 100%

| Fichier                  | Mock cible                       | Ce qui est couvert                                    |
|--------------------------|----------------------------------|-------------------------------------------------------|
| `MediaControllerTests`   | `MediaService`                   | Tous les endpoints + cas NOT_FOUND                    |
| `MediaServiceTests`      | `MediaRepository`, `MediaMapper` | findAll, findById, create, update, delete + NOT_FOUND |
| `MediaMapperTests`       | aucune                           | toDTO, toEntity                                       |
| `MediaDTOTests`          | aucune                           | Constructeurs + setters + toutes les contraintes      |
| `MediaTests`             | aucune                           | Constructeurs + setters de l'entité                   |

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

  private MediaDTO inception;
  private MediaDTO matrix;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    inception = new MediaDTO(1L, "Inception", 2010);
    matrix   = new MediaDTO(2L, "The Matrix", 1999);
  }

  @Test
  void getAllMedia_shouldReturnList() {
    when(mediaService.findAll()).thenReturn(List.of(inception, matrix));
    List<MediaDTO> result = mediaController.getAllMedia();
    assertEquals(2, result.size());
    verify(mediaService, times(1)).findAll();
  }

  @Test
  void getAllMedia_shouldReturnEmptyList_whenNoMedia() {
    when(mediaService.findAll()).thenReturn(List.of());
    assertTrue(mediaController.getAllMedia().isEmpty());
  }

  @Test
  void getMediaById_shouldReturnDTO_whenIdExists() {
    when(mediaService.findById(1L)).thenReturn(inception);
    MediaDTO result = mediaController.getMediaById(1L);
    assertEquals(1L, result.getId());
    assertEquals("Inception", result.getName());
    assertEquals(2010, result.getReleaseDate());
    verify(mediaService, times(1)).findById(1L);
  }

  @Test
  void getMediaById_shouldThrowNotFound_whenIdDoesNotExist() {
    when(mediaService.findById(999L))
      .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND));
    ResponseStatusException ex = assertThrows(ResponseStatusException.class,
      () -> mediaController.getMediaById(999L));
    assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
  }

  @Test
  void createMedia_shouldReturnCreatedDTO() {
    MediaDTO input = new MediaDTO(null, "Interstellar", 2014);
    MediaDTO saved = new MediaDTO(3L,   "Interstellar", 2014);
    when(mediaService.create(input)).thenReturn(saved);
    MediaDTO result = mediaController.createMedia(input);
    assertEquals(3L, result.getId());
    assertEquals("Interstellar", result.getName());
    verify(mediaService, times(1)).create(input);
  }

  @Test
  void updateMedia_shouldReturnUpdatedDTO_whenIdExists() {
    MediaDTO modified = new MediaDTO(null, "Inception Updated", 2010);
    MediaDTO updated  = new MediaDTO(1L,   "Inception Updated", 2010);
    when(mediaService.update(1L, modified)).thenReturn(updated);
    MediaDTO result = mediaController.updateMedia(1L, modified);
    assertEquals("Inception Updated", result.getName());
    verify(mediaService, times(1)).update(1L, modified);
  }

  @Test
  void updateMedia_shouldThrowNotFound_whenIdDoesNotExist() {
    MediaDTO modified = new MediaDTO(null, "Unknown", 2000);
    when(mediaService.update(eq(999L), any()))
      .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND));
    ResponseStatusException ex = assertThrows(ResponseStatusException.class,
      () -> mediaController.updateMedia(999L, modified));
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
    ResponseStatusException ex = assertThrows(ResponseStatusException.class,
      () -> mediaController.deleteMedia(999L));
    assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
  }
}
```

---

## Test – MediaServiceTests.java

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

class MediaServiceTests {

  @Mock
  private MediaRepository mediaRepository;

  @Mock
  private MediaMapper mediaMapper;

  @InjectMocks
  private MediaService mediaService;

  private Media inception;
  private MediaDTO inceptionDTO;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    inception    = new Media(1L, "Inception", 2010);
    inceptionDTO = new MediaDTO(1L, "Inception", 2010);
  }

  @Test
  void findAll_shouldReturnDTOList() {
    when(mediaRepository.findAll()).thenReturn(List.of(inception));
    when(mediaMapper.toDTO(inception)).thenReturn(inceptionDTO);
    List<MediaDTO> result = mediaService.findAll();
    assertEquals(1, result.size());
    assertEquals("Inception", result.get(0).getName());
  }

  @Test
  void findAll_shouldReturnEmptyList_whenNoMedia() {
    when(mediaRepository.findAll()).thenReturn(List.of());
    assertTrue(mediaService.findAll().isEmpty());
  }

  @Test
  void findById_shouldReturnDTO_whenIdExists() {
    when(mediaRepository.findById(1L)).thenReturn(Optional.of(inception));
    when(mediaMapper.toDTO(inception)).thenReturn(inceptionDTO);
    MediaDTO result = mediaService.findById(1L);
    assertEquals("Inception", result.getName());
  }

  @Test
  void findById_shouldThrowNotFound_whenIdDoesNotExist() {
    when(mediaRepository.findById(999L)).thenReturn(Optional.empty());
    ResponseStatusException ex = assertThrows(ResponseStatusException.class,
      () -> mediaService.findById(999L));
    assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
  }

  @Test
  void create_shouldSaveDTOWithNullId() {
    MediaDTO input    = new MediaDTO(99L, "Interstellar", 2014);
    Media entity      = new Media(null, "Interstellar", 2014);
    Media saved       = new Media(3L, "Interstellar", 2014);
    MediaDTO savedDTO = new MediaDTO(3L, "Interstellar", 2014);

    when(mediaMapper.toEntity(any())).thenReturn(entity);
    when(mediaRepository.save(entity)).thenReturn(saved);
    when(mediaMapper.toDTO(saved)).thenReturn(savedDTO);

    MediaDTO result = mediaService.create(input);
    assertNull(input.getId());
    assertEquals(3L, result.getId());
  }

  @Test
  void update_shouldReturnUpdatedDTO_whenIdExists() {
    MediaDTO dto        = new MediaDTO(null, "Inception Updated", 2011);
    Media updated       = new Media(1L, "Inception Updated", 2011);
    MediaDTO updatedDTO = new MediaDTO(1L, "Inception Updated", 2011);

    when(mediaRepository.findById(1L)).thenReturn(Optional.of(inception));
    when(mediaRepository.save(inception)).thenReturn(updated);
    when(mediaMapper.toDTO(updated)).thenReturn(updatedDTO);

    MediaDTO result = mediaService.update(1L, dto);
    assertEquals("Inception Updated", result.getName());
    assertEquals(2011, result.getReleaseDate());
  }

  @Test
  void update_shouldThrowNotFound_whenIdDoesNotExist() {
    when(mediaRepository.findById(999L)).thenReturn(Optional.empty());
    assertThrows(ResponseStatusException.class,
      () -> mediaService.update(999L, new MediaDTO(null, "X", 2000)));
  }

  @Test
  void delete_shouldCallRepositoryDelete_whenIdExists() {
    when(mediaRepository.findById(1L)).thenReturn(Optional.of(inception));
    doNothing().when(mediaRepository).delete(inception);
    mediaService.delete(1L);
    verify(mediaRepository, times(1)).delete(inception);
  }

  @Test
  void delete_shouldThrowNotFound_whenIdDoesNotExist() {
    when(mediaRepository.findById(999L)).thenReturn(Optional.empty());
    assertThrows(ResponseStatusException.class,
      () -> mediaService.delete(999L));
  }
}
```

---

## Test – MediaMapperTests.java

```java
package com.ganatan.starter.api.media;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class MediaMapperTests {

  private MediaMapper mapper;

  @BeforeEach
  void setUp() {
    mapper = new MediaMapper();
  }

  @Test
  void toDTO_shouldMapAllFields() {
    Media media  = new Media(1L, "Inception", 2010);
    MediaDTO dto = mapper.toDTO(media);
    assertEquals(1L, dto.getId());
    assertEquals("Inception", dto.getName());
    assertEquals(2010, dto.getReleaseDate());
  }

  @Test
  void toEntity_shouldMapAllFields() {
    MediaDTO dto = new MediaDTO(2L, "The Matrix", 1999);
    Media media  = mapper.toEntity(dto);
    assertEquals(2L, media.getId());
    assertEquals("The Matrix", media.getName());
    assertEquals(1999, media.getReleaseDate());
  }
}
```

---

## Test – MediaDTOTests.java

```java
package com.ganatan.starter.api.media;

import static org.junit.jupiter.api.Assertions.*;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class MediaDTOTests {

  private Validator validator;

  @BeforeEach
  void setUp() {
    ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    validator = factory.getValidator();
  }

  @Test
  void noArgsConstructor_shouldCreateInstance() {
    assertNotNull(new MediaDTO());
  }

  @Test
  void allArgsConstructor_shouldSetAllFields() {
    MediaDTO dto = new MediaDTO(1L, "Inception", 2010);
    assertEquals(1L, dto.getId());
    assertEquals("Inception", dto.getName());
    assertEquals(2010, dto.getReleaseDate());
  }

  @Test
  void setters_shouldUpdateFields() {
    MediaDTO dto = new MediaDTO();
    dto.setId(42L);
    dto.setName("Matrix");
    dto.setReleaseDate(1999);
    assertEquals(42L, dto.getId());
    assertEquals("Matrix", dto.getName());
    assertEquals(1999, dto.getReleaseDate());
  }

  @Test
  void valid_dto_shouldHaveNoViolations() {
    assertTrue(validator.validate(new MediaDTO(1L, "Inception", 2010)).isEmpty());
  }

  @Test
  void id_null_shouldPassValidation() {
    assertTrue(validator.validate(new MediaDTO(null, "Inception", 2010)).isEmpty());
  }

  @Test
  void id_negative_shouldFailValidation() {
    Set<ConstraintViolation<MediaDTO>> v = validator.validate(new MediaDTO(-1L, "Inception", 2010));
    assertTrue(v.stream().anyMatch(c -> c.getPropertyPath().toString().equals("id")));
  }

  @Test
  void id_zero_shouldFailValidation() {
    Set<ConstraintViolation<MediaDTO>> v = validator.validate(new MediaDTO(0L, "Inception", 2010));
    assertTrue(v.stream().anyMatch(c -> c.getPropertyPath().toString().equals("id")));
  }

  @Test
  void name_null_shouldFailValidation() {
    Set<ConstraintViolation<MediaDTO>> v = validator.validate(new MediaDTO(1L, null, 2010));
    assertTrue(v.stream().anyMatch(c -> c.getPropertyPath().toString().equals("name")));
  }

  @Test
  void name_blank_shouldFailValidation() {
    Set<ConstraintViolation<MediaDTO>> v = validator.validate(new MediaDTO(1L, "  ", 2010));
    assertTrue(v.stream().anyMatch(c -> c.getPropertyPath().toString().equals("name")));
  }

  @Test
  void name_tooLong_shouldFailValidation() {
    Set<ConstraintViolation<MediaDTO>> v = validator.validate(new MediaDTO(1L, "A".repeat(256), 2010));
    assertTrue(v.stream().anyMatch(c -> c.getPropertyPath().toString().equals("name")));
  }

  @Test
  void releaseDate_null_shouldFailValidation() {
    Set<ConstraintViolation<MediaDTO>> v = validator.validate(new MediaDTO(1L, "Inception", null));
    assertTrue(v.stream().anyMatch(c -> c.getPropertyPath().toString().equals("releaseDate")));
  }

  @Test
  void releaseDate_tooOld_shouldFailValidation() {
    Set<ConstraintViolation<MediaDTO>> v = validator.validate(new MediaDTO(1L, "Inception", 1800));
    assertTrue(v.stream().anyMatch(c -> c.getPropertyPath().toString().equals("releaseDate")));
  }
}
```

---

## Test – MediaTests.java

```java
package com.ganatan.starter.api.media;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class MediaTests {

  @Test
  void noArgsConstructor_shouldCreateInstance() {
    assertNotNull(new Media());
  }

  @Test
  void allArgsConstructor_shouldSetAllFields() {
    Media media = new Media(1L, "Inception", 2010);
    assertEquals(1L, media.getId());
    assertEquals("Inception", media.getName());
    assertEquals(2010, media.getReleaseDate());
  }

  @Test
  void setId_shouldUpdateId() {
    Media media = new Media();
    media.setId(42L);
    assertEquals(42L, media.getId());
  }

  @Test
  void setName_shouldUpdateName() {
    Media media = new Media();
    media.setName("Matrix");
    assertEquals("Matrix", media.getName());
  }

  @Test
  void setReleaseDate_shouldUpdateReleaseDate() {
    Media media = new Media();
    media.setReleaseDate(1999);
    assertEquals(1999, media.getReleaseDate());
  }
}
```

---

## Principes clés

- `MediaDTO` utilisé en entrée (`@Valid @RequestBody`) et en sortie — l'entité `Media` n'est jamais exposée directement
- `MediaMapper` assure la conversion DTO ↔ Entity — un seul endroit à modifier si le modèle évolue
- `@Valid` sur `@RequestBody` active les contraintes Jakarta Validation avant d'entrer dans le service
- `@ControllerAdvice` intercepte `MethodArgumentNotValidException` et retourne `400` avec la map des erreurs par champ
- `@NotBlank` couvre `null` et les chaînes vides/espaces — pas besoin de `@NotNull` en plus sur `name`
- `@Positive` sur `id` : accepte `null` (POST sans id), rejette les valeurs négatives ou zéro
- `@Min(1888)` sur `releaseDate` : premier film de l'histoire (Roundhay Garden Scene)
- `releaseDate` est `Integer` (pas `int`) dans le DTO pour permettre `@NotNull`
- `MediaDTOTests` utilise le `Validator` Jakarta directement — aucun contexte Spring requis

```
mvn test jacoco:report
→ target/site/jacoco/index.html
```
