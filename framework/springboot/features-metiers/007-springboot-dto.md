# 006 – DTO · Comprendre le patron Data Transfer Object

---

## Le problème sans DTO

Sans DTO, le controller expose directement l'entité JPA :

```java
@GetMapping("/{id}")
public Media getMediaById(@PathVariable Long id) {
  return mediaRepository.findById(id).orElseThrow();
}
```

Réponse JSON retournée :

```json
{
  "id": 1,
  "name": "Inception",
  "releaseDate": 2010,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-20T14:00:00",
  "internalCode": "MED-001-INTERNAL",
  "deletedAt": null
}
```

Problèmes : on expose des champs internes (`internalCode`), des métadonnées (`createdAt`, `deletedAt`), et on couple le client à la structure de la base de données.

---

## La solution : le DTO

Le DTO (Data Transfer Object) est un objet simple qui définit exactement ce qu'on veut exposer.

```
Client HTTP  ←→  Controller  ←→  Mapper  ←→  Service  ←→  Entity  ←→  DB
              [  MediaDTO  ]          [        Media        ]
```

Avec DTO, la réponse ne contient que ce qu'on décide d'exposer :

```json
{
  "id": 1,
  "name": "Inception",
  "releaseDate": 2010
}
```

---

## Exemple minimal

### L'entité JPA – Media.java

L'entité représente la table en base. Elle peut avoir des champs qu'on ne veut pas exposer.

```java
package com.ganatan.starter.api.media;

import jakarta.persistence.*;

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

  // champ interne : jamais exposé au client
  @Column(name = "internal_code")
  private String internalCode;

  public Media() {}

  public Media(Long id, String name, int releaseDate, String internalCode) {
    this.id = id;
    this.name = name;
    this.releaseDate = releaseDate;
    this.internalCode = internalCode;
  }

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public int getReleaseDate() { return releaseDate; }
  public void setReleaseDate(int releaseDate) { this.releaseDate = releaseDate; }

  public String getInternalCode() { return internalCode; }
  public void setInternalCode(String internalCode) { this.internalCode = internalCode; }
}
```

### Le DTO – MediaDTO.java

Le DTO ne contient que les champs utiles au client. `internalCode` est absent.

```java
package com.ganatan.starter.api.media;

public class MediaDTO {

  private Long id;
  private String name;
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

### Le Mapper – MediaMapper.java

Le mapper convertit dans les deux sens : Entity → DTO et DTO → Entity.

```java
package com.ganatan.starter.api.media;

import org.springframework.stereotype.Component;

@Component
public class MediaMapper {

  // Entity → DTO : on choisit quels champs exposer
  public MediaDTO toDTO(Media media) {
    return new MediaDTO(
      media.getId(),
      media.getName(),
      media.getReleaseDate()
      // internalCode n'est pas transmis
    );
  }

  // DTO → Entity : on reconstruit l'entité depuis ce que le client envoie
  public Media toEntity(MediaDTO dto) {
    Media media = new Media();
    media.setId(dto.getId());
    media.setName(dto.getName());
    media.setReleaseDate(dto.getReleaseDate());
    // internalCode est géré côté serveur, pas par le client
    return media;
  }
}
```

### Le Controller – MediaController.java

Le controller reçoit et retourne des `MediaDTO`. Il ne manipule jamais l'entité directement.

```java
package com.ganatan.starter.api.media;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/media")
public class MediaController {

  private final MediaRepository mediaRepository;
  private final MediaMapper mediaMapper;

  public MediaController(MediaRepository mediaRepository, MediaMapper mediaMapper) {
    this.mediaRepository = mediaRepository;
    this.mediaMapper = mediaMapper;
  }

  // GET /media → retourne List<MediaDTO>
  @GetMapping
  public List<MediaDTO> getAllMedia() {
    return mediaRepository.findAll()
      .stream()
      .map(mediaMapper::toDTO)
      .toList();
  }

  // GET /media/{id} → retourne MediaDTO
  @GetMapping("/{id}")
  public MediaDTO getMediaById(@PathVariable Long id) {
    Media media = mediaRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Not found"));
    return mediaMapper.toDTO(media);
  }

  // POST /media → reçoit MediaDTO, retourne MediaDTO
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public MediaDTO createMedia(@RequestBody MediaDTO dto) {
    dto.setId(null);                        // ignore l'id envoyé par le client
    Media saved = mediaRepository.save(mediaMapper.toEntity(dto));
    return mediaMapper.toDTO(saved);
  }

  // PUT /media/{id} → reçoit MediaDTO, retourne MediaDTO
  @PutMapping("/{id}")
  public MediaDTO updateMedia(@PathVariable Long id, @RequestBody MediaDTO dto) {
    Media existing = mediaRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Not found"));
    existing.setName(dto.getName());
    existing.setReleaseDate(dto.getReleaseDate());
    // internalCode est conservé tel quel, le client ne peut pas le modifier
    return mediaMapper.toDTO(mediaRepository.save(existing));
  }

  // DELETE /media/{id}
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteMedia(@PathVariable Long id) {
    mediaRepository.deleteById(id);
  }
}
```

---

## Ce que le client voit vs ce qui est en base

| Champ           | En base (Entity) | Exposé au client (DTO) |
|-----------------|:----------------:|:----------------------:|
| `id`            | ✅               | ✅                     |
| `name`          | ✅               | ✅                     |
| `releaseDate`   | ✅               | ✅                     |
| `internalCode`  | ✅               | ❌                     |

Le client ne peut ni lire ni modifier `internalCode`. Ce champ est invisible depuis l'API.

---

## Flux d'une requête POST

```
Client envoie :
{ "name": "Inception", "releaseDate": 2010 }

1. Controller reçoit un MediaDTO
2. dto.setId(null)           → sécurité : ignore l'id client
3. mediaMapper.toEntity(dto) → crée un objet Media (sans internalCode)
4. mediaRepository.save()    → INSERT en base (internalCode géré par le serveur)
5. mediaMapper.toDTO(saved)  → extrait uniquement id, name, releaseDate

Client reçoit :
{ "id": 1, "name": "Inception", "releaseDate": 2010 }
```

---

## Pourquoi un Mapper séparé ?

On pourrait mettre la conversion directement dans le controller ou le service. Le mapper séparé a un avantage : **un seul endroit à modifier** si la structure change.

```java
// Sans mapper : logique dupliquée dans chaque méthode du controller
Media media = new Media();
media.setName(dto.getName());
media.setReleaseDate(dto.getReleaseDate());

// Avec mapper : une ligne partout
Media media = mediaMapper.toEntity(dto);
```

---

## Résumé

```
Entity  = structure de la base de données
DTO     = structure exposée au client
Mapper  = pont entre les deux
```

Le DTO découple l'API du modèle de données. On peut faire évoluer la base sans casser le contrat avec le client, et inversement.
