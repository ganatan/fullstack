# HTTP

- `200 OK` : succès
- `201 Created` : ressource créée
- `204 No Content` : succès sans retour
- `400 Bad Request` : requête invalide
- `401 Unauthorized` : authentification requise
- `403 Forbidden` : accès interdit
- `404 Not Found` : ressource introuvable
- `500 Internal Server Error` : erreur serveur

### GetMapping
```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/param")
public class ParamController {
//    @GetMapping("items")
    @GetMapping("/items")
    String getItems() {
        System.out.println("00000000001:items");
        return "Items";
    }
}
```