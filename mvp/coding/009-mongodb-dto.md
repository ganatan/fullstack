# Erreur sur POST
# http://localhost:3001/test-mongodb-dto
```json
{
  "nom": "",
  "type": "Film"
}
```

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
```


```java
package com.mvp.controller.mongodb.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class InputMediaDTO {

    @NotBlank
    @Size(max = 100)
    private String nom;

    @NotBlank
    @Size(max = 50)
    private String type;

    public InputMediaDTO() {
    }

    public InputMediaDTO(String nom, String type) {
        this.nom = nom;
        this.type = type;
    }

    public String getNom() {
        return nom;
    }

    public String getType() {
        return type;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public void setType(String type) {
        this.type = type;
    }
}
```

```java
package com.mvp.controller.mongodb.dto;

import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Media")
public class Media4 {

    @Id
    private String id;
    private String nom;
    private String type;
    private Instant dateCreation;

    public Media4() {
    }

    public Media4(String id, String nom, String type, Instant dateCreation) {
        this.id = id;
        this.nom = nom;
        this.type = type;
        this.dateCreation = dateCreation;
    }

    public String getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public String getType() {
        return type;
    }

    public Instant getDateCreation() {
        return dateCreation;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setDateCreation(Instant dateCreation) {
        this.dateCreation = dateCreation;
    }
}
```

```java
package com.mvp.controller.mongodb.dto;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MediaController4 {

    private final MediaService4 mediaService;

    public MediaController4(MediaService4 mediaService) {
        this.mediaService = mediaService;
    }

    @GetMapping("/test-mongodb-dto")
    public List<OutputMediaDTO> getMedias() {
        return mediaService.getMedias();
    }

    @PostMapping("/test-mongodb-dto")
    public OutputMediaDTO createMedia(@Valid @RequestBody InputMediaDTO inputMediaDTO) {
        return mediaService.createMedia(inputMediaDTO);
    }
}
```

```java
package com.mvp.controller.mongodb.dto;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface MediaRepository4 extends MongoRepository<Media4, String> {
}
```

```java
package com.mvp.controller.mongodb.dto;

import java.util.List;

public interface MediaService4 {
    List<OutputMediaDTO> getMedias();
    OutputMediaDTO createMedia(InputMediaDTO inputMediaDTO);
}
```

```java
package com.mvp.controller.mongodb.dto;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class MediaServiceImpl4 implements MediaService4 {

    private final MediaRepository4 mediaRepository;

    public MediaServiceImpl4(MediaRepository4 mediaRepository) {
        this.mediaRepository = mediaRepository;
    }

    @Override
    public List<OutputMediaDTO> getMedias() {
        return mediaRepository.findAll()
                .stream()
                .map(this::toOutputMediaDTO)
                .collect(Collectors.toList());
    }

    @Override
    public OutputMediaDTO createMedia(InputMediaDTO inputMediaDTO) {
        Media4 media = new Media4();
        media.setId(generateId());
        media.setNom(inputMediaDTO.getNom());
        media.setType(inputMediaDTO.getType());
        media.setDateCreation(Instant.now());

        Media4 savedMedia = mediaRepository.save(media);
        return toOutputMediaDTO(savedMedia);
    }

    private OutputMediaDTO toOutputMediaDTO(Media4 media) {
        return new OutputMediaDTO(
                media.getId(),
                media.getNom(),
                media.getType(),
                media.getDateCreation()
        );
    }

    private String generateId() {
        long count = mediaRepository.count() + 1;
        return String.format("MED%05d", count);
    }
}
```

```java
package com.mvp.controller.mongodb.dto;

import java.time.Instant;

public class OutputMediaDTO {

    private String id;
    private String nom;
    private String type;
    private String type2;
    private Instant dateCreation;

    public OutputMediaDTO() {
    }

    public OutputMediaDTO(String id, String nom, String type, Instant dateCreation) {
        this.id = id;
        this.nom = nom;
        this.type = type;
        this.type2 = type;
        this.dateCreation = dateCreation;
    }

    public String getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public String getType() {
        return type;
    }

    public String getType2() {
        return type2;
    }

    public Instant getDateCreation() {
        return dateCreation;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setType2(String type) {
        this.type2 = type;
    }

    public void setDateCreation(Instant dateCreation) {
        this.dateCreation = dateCreation;
    }
}
```



