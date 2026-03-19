# Voir le contenu d’un `ResponseEntity`

`ResponseEntity` contient principalement le **status HTTP**, les **headers** et le **body**.
Pour comprendre ce qu’il contient, on peut l’afficher avec `System.out.println`.

## Imports

```java
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
```

## Exemple

```java
@PostMapping("/rechercher")
public ResponseEntity<Map<String, Object>> rechercher(@RequestBody Map<String, Object> body) {
    ResponseEntity<Map<String, Object>> response = ResponseEntity.ok(
            Map.of("message", "POST recu", "body", body)
    );

    System.out.println("response = " + response);
    System.out.println("status = " + response.getStatusCode());
    System.out.println("headers = " + response.getHeaders());
    System.out.println("body = " + response.getBody());

    return response;
}
```

Les éléments les plus utiles à regarder sont :
`getStatusCode()`, `getHeaders()` et `getBody()`.