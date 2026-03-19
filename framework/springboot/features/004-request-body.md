# Test simple de `@RequestBody` avec un POST

`@RequestBody` sert à lire le JSON envoyé dans le body de la requête HTTP.

## Import

```java
import org.springframework.web.bind.annotation.RequestBody;
```

## Exemple de controller

```java
import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ParamObjetController {

    @PostMapping("/rechercher")
    public Map<String, Object> rechercher(@RequestBody Map<String, Object> body) {
        return Map.of(
                "message", "POST recu",
                "body", body
        );
    }
}
```

## Body JSON à envoyer

```json
{
  "code": "REC0001",
  "libelle": "Mon test"
}
```

## Résultat attendu

```json
{
  "message": "POST recu",
  "body": {
    "code": "REC0001",
    "libelle": "Mon test"
  }
}
```