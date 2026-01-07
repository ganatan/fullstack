# RootController

### Classe

com.ganatan.starter.api.root.RootController

### Code

```java
package com.ganatan.starter.api.root;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

  @GetMapping("/")
  public Map<String, Object> root() {
    return Map.of(
      "application", "springboot-starter",
      "status", "running",
      "java", System.getProperty("java.version")
    );
  }

}
```

---

## Résultat

Appel via navigateur ou curl :

http://localhost:8080/

Réponse JSON :

```json
{
  "application": "springboot-starter",
  "status": "running",
  "java": "25.0.x"
}
```

