# 006 – DTO Validation · Contrôler ce que le client envoie

---

## Le problème sans validation

Sans validation, le client peut envoyer n'importe quoi :

```json
{ "name": "", "releaseDate": -500 }
```

Le controller accepte, le service enregistre en base. Résultat : données corrompues.

---

## La solution : DTO de validation

On crée un DTO d'entrée avec des annotations de contraintes. Spring valide automatiquement avant d'entrer dans le controller.

```
Client envoie du JSON
        ↓
@Valid @RequestBody MediaRequestDTO
        ↓
Spring valide les contraintes
        ↓
  ✅ valide  →  entre dans le controller
  ❌ invalide →  400 Bad Request  (jamais le controller)
```

---

## Les annotations de validation

```java
// champ obligatoire, non vide, non blank
@NotNull     // refuse null
@NotEmpty    // refuse null et ""
@NotBlank    // refuse null, "" et "   " ← le plus strict, préférer celui-ci pour les String

// taille
@Size(min = 2, max = 255)   // longueur de String ou taille de Collection
@Min(1888)                   // valeur numérique minimum
@Max(2100)                   // valeur numérique maximum

// format
@Email                       // vérifie le format email
@Pattern(regexp = "...")     // expression régulière
@Positive                    // > 0
@PositiveOrZero              // >= 0
```

---

## Exemple minimal

### La dépendance – pom.xml

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

### Le DTO d'entrée – MediaRequestDTO.java

```java
package com.ganatan.starter.api.media;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class MediaRequestDTO {

  @NotBlank(message = "Le nom ne peut pas être vide")
  @Size(max = 255, message = "Le nom ne peut pas dépasser 255 caractères")
  private String name;

  @NotNull(message = "La date de sortie est obligatoire")
  @Min(value = 1888, message = "La date de sortie doit être supérieure à 1888")
  private Integer releaseDate;

  public MediaRequestDTO() {}

  public MediaRequestDTO(String name, Integer releaseDate) {
    this.name = name;
    this.releaseDate = releaseDate;
  }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public Integer getReleaseDate() { return releaseDate; }
  public void setReleaseDate(Integer releaseDate) { this.releaseDate = releaseDate; }
}
```

Pas d'`id` ici : le client ne fournit pas d'id en entrée (POST). C'est le serveur qui le génère.

### Le controller – MediaController.java

`@Valid` déclenche la validation. Sans `@Valid`, les annotations du DTO sont ignorées.

```java
package com.ganatan.starter.api.media;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/media")
public class MediaController {

  private final MediaRepository mediaRepository;

  public MediaController(MediaRepository mediaRepository) {
    this.mediaRepository = mediaRepository;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Media createMedia(@Valid @RequestBody MediaRequestDTO dto) {
    //                      ↑
    //              sans @Valid : aucune validation
    Media media = new Media();
    media.setName(dto.getName());
    media.setReleaseDate(dto.getReleaseDate());
    return mediaRepository.save(media);
  }

  @PutMapping("/{id}")
  public Media updateMedia(@PathVariable Long id, @Valid @RequestBody MediaRequestDTO dto) {
    Media existing = mediaRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Not found"));
    existing.setName(dto.getName());
    existing.setReleaseDate(dto.getReleaseDate());
    return mediaRepository.save(existing);
  }
}
```

### Le gestionnaire d'erreurs – GlobalExceptionHandler.java

Sans ce handler, Spring retourne une réponse `400` avec un body verbeux et difficile à exploiter côté client. Le handler formate proprement les erreurs.

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

---

## Cas concrets

### Requête valide

```
POST /media
{ "name": "Inception", "releaseDate": 2010 }

→ 201 CREATED
{ "id": 1, "name": "Inception", "releaseDate": 2010 }
```

### Nom vide

```
POST /media
{ "name": "", "releaseDate": 2010 }

→ 400 Bad Request
{ "name": "Le nom ne peut pas être vide" }
```

### Plusieurs erreurs en même temps

```
POST /media
{ "name": "  ", "releaseDate": 1500 }

→ 400 Bad Request
{
  "name": "Le nom ne peut pas être vide",
  "releaseDate": "La date de sortie doit être supérieure à 1888"
}
```

### Champ manquant

```
POST /media
{ "name": "Inception" }

→ 400 Bad Request
{ "releaseDate": "La date de sortie est obligatoire" }
```

---

## @NotNull vs @NotEmpty vs @NotBlank

| Annotation   | Refuse `null` | Refuse `""` | Refuse `"   "` | À utiliser pour         |
|--------------|:-------------:|:-----------:|:--------------:|-------------------------|
| `@NotNull`   | ✅            | ❌          | ❌             | Integer, Long, objets   |
| `@NotEmpty`  | ✅            | ✅          | ❌             | Collections, tableaux   |
| `@NotBlank`  | ✅            | ✅          | ✅             | String ← toujours celui-là |

---

## DTO Request vs DTO Response

On peut aller plus loin et séparer en deux classes distinctes :

```
MediaRequestDTO   ← POST/PUT  : champs que le client envoie  + contraintes @Valid
MediaResponseDTO  ← GET       : champs que le serveur expose  (pas de contraintes)
```

```java
// entrée : le client envoie name et releaseDate, pas d'id
public class MediaRequestDTO {
  @NotBlank private String name;
  @NotNull @Min(1888) private Integer releaseDate;
}

// sortie : le serveur retourne id, name, releaseDate
public class MediaResponseDTO {
  private Long id;
  private String name;
  private Integer releaseDate;
}
```

Avantage : les deux contrats sont indépendants. On peut ajouter un champ en sortie sans toucher aux règles d'entrée, et vice versa.

---

## Résumé

```
@Valid             = active la validation sur le DTO
@NotBlank          = String obligatoire et non vide
@NotNull           = objet obligatoire (Integer, Long...)
@Min / @Max        = bornes numériques
@Size              = longueur de String ou Collection
@ControllerAdvice  = formate les erreurs en 400 lisible
```

La validation s'arrête **avant** le controller. Si le DTO est invalide, le code métier n'est jamais exécuté.
