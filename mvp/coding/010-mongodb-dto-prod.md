```java
package com.mvp.controller.mongodb.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class InputMediaDTO5 {

    @NotBlank
    @Size(max = 100)
    private String nom;

    @NotBlank
    @Size(max = 50)
    private String type;

    public InputMediaDTO5() {
    }

    public InputMediaDTO5(String nom, String type) {
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
public class Media5 {

    @Id
    private String id;
    private String nom;
    private String type;
    private Instant dateCreation;

    public Media5() {
    }

    public Media5(String id, String nom, String type, Instant dateCreation) {
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

import java.time.Instant;

public class OutputMediaDTO5 {

    private String id;
    private String nom;
    private String type;
    private String type2;
    private Instant dateCreation;

    public OutputMediaDTO5() {
    }

    public OutputMediaDTO5(String id, String nom, String type, Instant dateCreation) {
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

```java
package com.mvp.controller.mongodb.dto;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface MediaRepository5 extends MongoRepository<Media5, String> {
}
```

```java
package com.mvp.controller.mongodb.dto;

import java.util.List;

public interface MediaService5 {
    List<OutputMediaDTO5> getMedias();
    OutputMediaDTO5 getMediaById(String id);
    OutputMediaDTO5 createMedia(InputMediaDTO5 inputMediaDTO);
    OutputMediaDTO5 updateMedia(String id, InputMediaDTO5 inputMediaDTO);
    void deleteMedia(String id);
}
```

```java
package com.mvp.controller.mongodb.dto;

public class MediaNotFoundException5 extends RuntimeException {

    public MediaNotFoundException5(String id) {
        super("Media not found with id: " + id);
    }
}
```

```java
package com.mvp.controller.mongodb.dto;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class MediaServiceImpl5 implements MediaService5 {

    private final MediaRepository5 mediaRepository;

    public MediaServiceImpl5(MediaRepository5 mediaRepository) {
        this.mediaRepository = mediaRepository;
    }

    @Override
    public List<OutputMediaDTO5> getMedias() {
        return mediaRepository.findAll()
                .stream()
                .map(this::toOutputMediaDTO)
                .collect(Collectors.toList());
    }

    @Override
    public OutputMediaDTO5 getMediaById(String id) {
        Media5 media = mediaRepository.findById(id)
                .orElseThrow(() -> new MediaNotFoundException5(id));
        return toOutputMediaDTO(media);
    }

    @Override
    public OutputMediaDTO5 createMedia(InputMediaDTO5 inputMediaDTO) {
        Media5 media = new Media5();
        media.setId(generateId());
        media.setNom(inputMediaDTO.getNom());
        media.setType(inputMediaDTO.getType());
        media.setDateCreation(Instant.now());

        Media5 savedMedia = mediaRepository.save(media);
        return toOutputMediaDTO(savedMedia);
    }

    @Override
    public OutputMediaDTO5 updateMedia(String id, InputMediaDTO5 inputMediaDTO) {
        Media5 media = mediaRepository.findById(id)
                .orElseThrow(() -> new MediaNotFoundException5(id));

        media.setNom(inputMediaDTO.getNom());
        media.setType(inputMediaDTO.getType());

        Media5 savedMedia = mediaRepository.save(media);
        return toOutputMediaDTO(savedMedia);
    }

    @Override
    public void deleteMedia(String id) {
        Media5 media = mediaRepository.findById(id)
                .orElseThrow(() -> new MediaNotFoundException5(id));
        mediaRepository.delete(media);
    }

    private OutputMediaDTO5 toOutputMediaDTO(Media5 media) {
        return new OutputMediaDTO5(
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

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MediaController5 {

    private final MediaService5 mediaService;

    public MediaController5(MediaService5 mediaService) {
        this.mediaService = mediaService;
    }

    @GetMapping("/test-mongodb-dto")
    public List<OutputMediaDTO5> getMedias() {
        return mediaService.getMedias();
    }

    @GetMapping("/test-mongodb-dto/{id}")
    public OutputMediaDTO5 getMediaById(@PathVariable String id) {
        return mediaService.getMediaById(id);
    }

    @PostMapping("/test-mongodb-dto")
    public OutputMediaDTO5 createMedia(@Valid @RequestBody InputMediaDTO5 inputMediaDTO) {
        return mediaService.createMedia(inputMediaDTO);
    }

    @PutMapping("/test-mongodb-dto/{id}")
    public OutputMediaDTO5 updateMedia(@PathVariable String id, @Valid @RequestBody InputMediaDTO5 inputMediaDTO) {
        return mediaService.updateMedia(id, inputMediaDTO);
    }

    @DeleteMapping("/test-mongodb-dto/{id}")
    public ResponseEntity<Void> deleteMedia(@PathVariable String id) {
        mediaService.deleteMedia(id);
        return ResponseEntity.noContent().build();
    }
}
```

```java
package com.mvp.controller.mongodb.dto;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler5 {

    @ExceptionHandler(MediaNotFoundException5.class)
    public ProblemDetail handleMediaNotFoundException(MediaNotFoundException5 exception) {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        problemDetail.setTitle("Media not found");
        problemDetail.setDetail(exception.getMessage());
        return problemDetail;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleMethodArgumentNotValidException(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new LinkedHashMap<>();

        exception.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problemDetail.setTitle("Validation error");
        problemDetail.setDetail(errors.toString());
        return problemDetail;
    }
}
```