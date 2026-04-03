```xml
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.8.15</version>
    </dependency>
    <dependency>
        <groupId>io.swagger.core.v3</groupId>
        <artifactId>swagger-annotations</artifactId>
        <version>2.2.43</version>
        <exclusions>
            <exclusion>
                <groupId>io.swagger.core.v3</groupId>
                <artifactId>swagger-annotations</artifactId>
            </exclusion>
        </exclusions>
    </dependency>
    <dependency>
        <groupId>io.swagger.core.v3</groupId>
        <artifactId>swagger-annotations-jakarta</artifactId>
        <version>2.2.43</version>
    </dependency>
```

```java
package com.mvp.controller.swagger;

import java.util.LinkedHashMap;
import java.util.Map;

import com.mvp.logger.LoggerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.slf4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test-swagger")
@Tag(name = "TestSwaggerController", description = "Endpoints de test Swagger pour MediaSwagger")
public class TestSwaggerController {

    private static final Logger LOG = LoggerService.getLogger(TestSwaggerController.class);

    @GetMapping("/{id}")
    @Operation(summary = "Recuperer un media", description = "Retourne un objet MediaSwagger a partir de son identifiant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Media retourne"),
            @ApiResponse(responseCode = "404", description = "Media non trouve")
    })
    public ResponseEntity<MediaSwagger> getMedia(
            @Parameter(description = "Identifiant du media", example = "1")
            @PathVariable Long id) {
        LOG.info("GET /test-swagger/{}", id);
        MediaSwagger media = new MediaSwagger(id, "Dune", "FILM");
        return ResponseEntity.ok(media);
    }

    @PostMapping
    @Operation(summary = "Creer un media AAAAAAA", description = "Cree un objet MediaSwagger BBBBBBB")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Media cree"),
            @ApiResponse(responseCode = "400", description = "Requete invalide")
    })
    public ResponseEntity<MediaSwagger> createMedia(@RequestBody MediaSwagger mediaSwagger) {
        LOG.info("POST /test-swagger nom={} type={}", mediaSwagger.getNom(), mediaSwagger.getType());
        MediaSwagger media = new MediaSwagger(1L, mediaSwagger.getNom(), mediaSwagger.getType());
        return ResponseEntity.status(HttpStatus.CREATED).body(media);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un media", description = "Supprime un media par identifiant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Media supprime"),
            @ApiResponse(responseCode = "404", description = "Media non trouve")
    })
    public ResponseEntity<Map<String, Object>> deleteMedia(
            @Parameter(description = "Identifiant du media", example = "1")
            @PathVariable Long id) {
        LOG.warn("DELETE /test-swagger/{}", id);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", id);
        response.put("status", "DELETED");
        response.put("message", "media supprime");
        return ResponseEntity.ok(response);
    }
}
```

```java
package com.mvp.controller.swagger;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Objet media utilise pour les tests Swagger")
public class MediaSwagger {

    @Schema(description = "Identifiant technique", example = "1")
    private Long id;

    @Schema(description = "Nom du media", example = "Dune")
    private String nom;

    @Schema(description = "Type du media", example = "FILM")
    private String type;

    public MediaSwagger() {
    }

    public MediaSwagger(Long id, String nom, String type) {
        this.id = id;
        this.nom = nom;
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public String getType() {
        return type;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public void setType(String type) {
        this.type = type;
    }
}
```