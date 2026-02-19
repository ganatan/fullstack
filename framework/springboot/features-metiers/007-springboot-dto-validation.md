# DTO Validation – Exemple minimal sans base de données

---

## Structure

```
com.ganatan.starter.api.media
├── MediaDTO.java
├── MediaController.java
└── GlobalExceptionHandler.java
```

Pas de base de données. Les données sont stockées dans une simple liste en mémoire.

---

## MediaDTO.java

```java
package com.ganatan.starter.api.media;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MediaDTO {

  private Long id;

  @NotBlank(message = "Le nom ne peut pas être vide")
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

## MediaController.java

```java
package com.ganatan.starter.api.media;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/media")
public class MediaController {

  // liste en mémoire, pas de base de données
  private final List<MediaDTO> store = new ArrayList<>();
  private long nextId = 1;

  @GetMapping
  public List<MediaDTO> getAll() {
    return store;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public MediaDTO create(@Valid @RequestBody MediaDTO dto) {
    dto.setId(nextId++);
    store.add(dto);
    return dto;
  }
}
```

---

## GlobalExceptionHandler.java

```java
package com.ganatan.starter.api.media;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

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

---

## pom.xml – la seule dépendance nécessaire

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

---

## Résultats

### POST valide

```
POST http://localhost:3000/media
{ "name": "Inception", "releaseDate": 2010 }

→ 201 CREATED
{ "id": 1, "name": "Inception", "releaseDate": 2010 }
```

### nom vide → 400

```
POST http://localhost:3000/media
{ "name": "", "releaseDate": 2010 }

→ 400 Bad Request
{ "name": "Le nom ne peut pas être vide" }
```

### date trop ancienne → 400

```
POST http://localhost:3000/media
{ "name": "Inception", "releaseDate": 1500 }

→ 400 Bad Request
{ "releaseDate": "La date de sortie doit être supérieure à 1888" }
```

### champ manquant → 400

```
POST http://localhost:3000/media
{ "name": "Inception" }

→ 400 Bad Request
{ "releaseDate": "La date de sortie est obligatoire" }
```

### GET après plusieurs POST valides

```
GET http://localhost:3000/media

→ 200 OK
[
  { "id": 1, "name": "Inception", "releaseDate": 2010 },
  { "id": 2, "name": "The Matrix", "releaseDate": 1999 }
]
```

---

## Ce qui se passe quand @Valid détecte une erreur

```
Client envoie { "name": "", "releaseDate": 2010 }
       ↓
Spring lit @Valid sur le paramètre
       ↓
Spring vérifie @NotBlank sur name → échec
       ↓
Spring lance MethodArgumentNotValidException
       ↓
GlobalExceptionHandler l'intercepte
       ↓
Retourne 400 { "name": "Le nom ne peut pas être vide" }
       ↓
Le code du controller n'est JAMAIS exécuté
```

---

## Résumé en 3 points

**1. Le DTO porte les règles** — `@NotBlank`, `@NotNull`, `@Min` sont sur le DTO, pas sur l'entité ni dans le controller.

**2. `@Valid` active la vérification** — sans `@Valid` devant `@RequestBody`, toutes les annotations sont ignorées.

**3. Le handler formate les erreurs** — sans `GlobalExceptionHandler`, Spring retourne quand même un 400 mais avec un message illisible.
