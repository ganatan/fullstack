# Swagger UI avec Spring Boot

## Dépendance Maven à ajouter dans `pom.xml`

```xml
<dependency>
  <groupId>org.springdoc</groupId>
  <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
  <version>2.8.16</version>
</dependency>
```

## Exemple simple de controller

```java
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

@RestController
@RequestMapping("/param")
public class ParamController {

    @GetMapping("/rechercher")
    @Operation(summary = "Recherche des objets de parametrage")
    @ApiResponse(responseCode = "200", description = "Retour JSON simple")
    public Map<String, Object> rechercher() {
        return Map.of("application", "ParamController");
    }
}
```

## URL Swagger UI

```text
http://localhost:3000/swagger-ui.html
```

## URL OpenAPI JSON

```text
http://localhost:3000/v3/api-docs
```

## URL de test de l’endpoint

```text
http://localhost:3000/rechercher
```

## Résultat attendu

```json
{"application":"ParamController"}
```