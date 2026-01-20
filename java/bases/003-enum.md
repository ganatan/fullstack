# enum – cas essentiels (Java)

Tous les exemples sont exécutables directement dans un contrôleur Spring Boot.

---

## Code

```java
package com.ganatan.starter.api.root;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

  enum Status {
    CREATED,
    RUNNING,
    FAILED
  }

  enum HttpStatusCode {
    OK(200),
    NOT_FOUND(404),
    ERROR(500);

    private final int code;

    HttpStatusCode(int code) {
      this.code = code;
    }

    public int getCode() {
      return code;
    }
  }

  @GetMapping("/enum")
  public Map<String, Object> root() {

    Status status = Status.RUNNING;

    String basicEnum = status.name();

    boolean comparison = status == Status.RUNNING;

    int ordinal = status.ordinal();

    HttpStatusCode httpStatus = HttpStatusCode.OK;

    return Map.of(
      "basic_enum", basicEnum,
      "enum_comparison", comparison,
      "enum_ordinal", ordinal,
      "enum_with_field", httpStatus.name(),
      "enum_with_field_value", httpStatus.getCode()
    );
  }
}
```

---

## Principes clés

- `enum` est un type sûr
- Comparaison avec `==`
- `name()` retourne le nom
- `ordinal()` dépend de l’ordre (à éviter en métier)
- Un `enum` peut contenir champs et méthodes
