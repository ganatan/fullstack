POST http://localhost:3001/media-kafka-events

```json
{
  "nom": "EventSortieCredit",
  "description": "Creation d un media kafka event",
  "message": "{\"id\":\"motif-001\",\"type\":\"MOTIF\",\"code\":\"MOT66666\",\"valeur\":\"OM toto Cree\",\"timestamp\":\"2026-03-30T10:00:00\"}"
}
```

```java
package com.mvp.controller.kafka;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class InputMediaDTO {

    @NotBlank
    @Size(max = 50)
    @Pattern(regexp = "^[a-zA-Z0-9 ]+$")
    private String nom;

    @Size(max = 255)
    @Pattern(regexp = "^[a-zA-Z0-9 ]*$")
    private String description;

    @NotBlank
    @Size(max = 255)
    private String message;

    public InputMediaDTO() {
    }

    public InputMediaDTO(String nom, String description, String message) {
        this.nom = nom;
        this.description = description;
        this.message = message;
    }

    public String getNom() {
        return nom;
    }

    public String getDescription() {
        return description;
    }

    public String getMessage() {
        return message;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
```

```java
package com.mvp.controller.kafka;

import org.bson.Document;

import java.util.List;

public interface MediaDAO {

    void insertMany(List<Document> documents, String collectionName);

    Document findFirstByCode(String collectionName, String code);

    Document findLastByCodeDesc(String collectionName);

    long countByCode(String collectionName, String code);
}
```

```java
package com.mvp.controller.kafka;

import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class MediaDAOImpl implements MediaDAO {

    private final MongoTemplate mongoTemplate;

    public MediaDAOImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public void insertMany(List<Document> documents, String collectionName) {
        mongoTemplate.insert(documents, collectionName);
    }

    @Override
    public Document findFirstByCode(String collectionName, String code) {
        return mongoTemplate.getCollection(collectionName)
                .find(new Document("code", code))
                .first();
    }

    @Override
    public Document findLastByCodeDesc(String collectionName) {
        return mongoTemplate.getCollection(collectionName)
                .find()
                .sort(new Document("code", -1))
                .limit(1)
                .first();
    }

    @Override
    public long countByCode(String collectionName, String code) {
        return mongoTemplate.getCollection(collectionName)
                .countDocuments(new Document("code", code));
    }
}
```

```java
package com.mvp.controller.kafka;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/media-kafka-events")
public class MediaKafkaController {

    private final MediaService mediaService;

    public MediaKafkaController(MediaService mediaService) {
        this.mediaService = mediaService;
    }

    @PostMapping
    public ResponseEntity<OutputMediaDTO> createMediaKafkaEvent(@Valid @RequestBody InputMediaDTO inputMediaDTO) {
        System.out.println("00000000001");
        OutputMediaDTO outputMediaDTO = mediaService.create(inputMediaDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(outputMediaDTO);
    }

    @GetMapping("/{code}")
    public ResponseEntity<OutputMediaDTO> getMediaKafkaEventByCode(@PathVariable String code) {
        OutputMediaDTO outputMediaDTO = mediaService.getByCode(code);
        return ResponseEntity.ok(outputMediaDTO);
    }
}
```

```java
package com.mvp.controller.kafka;

public interface MediaService {

    OutputMediaDTO create(InputMediaDTO inputMediaDTO);

    OutputMediaDTO getByCode(String code);
}
```

```java
package com.mvp.controller.kafka;

import org.bson.Document;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class MediaServiceImpl implements MediaService {

    private static final String COLLECTION_NAME = "MediaKafkaEvent";

    private final MediaDAO mediaDAO;

    public MediaServiceImpl(MediaDAO mediaDAO) {
        this.mediaDAO = mediaDAO;
    }

    @Override
    @Transactional
    public OutputMediaDTO create(InputMediaDTO inputMediaDTO) {
        String code = generateNextCode();

        List<Document> documents = new ArrayList<>();

        for (int cr = 1; cr <= 40; cr++) {
            Document document = new Document();
            document.put("code", code);
            document.put("nom", inputMediaDTO.getNom());
            document.put("description", inputMediaDTO.getDescription());
            document.put("message", inputMediaDTO.getMessage());
            document.put("cr", String.format("%02d", cr));
            document.put("createdAt", Instant.now().toString());
            documents.add(document);
        }

        mediaDAO.insertMany(documents, COLLECTION_NAME);

        return new OutputMediaDTO(
                code,
                inputMediaDTO.getNom(),
                inputMediaDTO.getDescription(),
                inputMediaDTO.getMessage()
        );
    }

    @Override
    public OutputMediaDTO getByCode(String code) {
        Document document = mediaDAO.findFirstByCode(COLLECTION_NAME, code);

        if (document == null) {
            throw new IllegalArgumentException("MediaKafkaEvent introuvable avec le code " + code);
        }

        return new OutputMediaDTO(
                document.getString("code"),
                document.getString("nom"),
                document.getString("description"),
                document.getString("message")
        );
    }

    private String generateNextCode() {
        Document lastDocument = mediaDAO.findLastByCodeDesc(COLLECTION_NAME);

        int nextValue = 1;

        if (lastDocument != null && lastDocument.getString("code") != null) {
            String lastCode = lastDocument.getString("code");
            String numericPart = lastCode.replace("MKE", "");
            nextValue = Integer.parseInt(numericPart) + 1;
        }

        return String.format("MKE%04d", nextValue);
    }
}
```

```java
package com.mvp.controller.kafka;

public class OutputMediaDTO {

    private String code;
    private String nom;
    private String description;
    private String message;

    public OutputMediaDTO() {
    }

    public OutputMediaDTO(String code, String nom, String description, String message) {
        this.code = code;
        this.nom = nom;
        this.description = description;
        this.message = message;
    }

    public String getCode() {
        return code;
    }

    public String getNom() {
        return nom;
    }

    public String getDescription() {
        return description;
    }

    public String getMessage() {
        return message;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
```
