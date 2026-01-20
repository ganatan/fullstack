# ternary – Java (essentiel)

---

## Code

```java
package com.ganatan.starter.api.root;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

  @GetMapping("/ternary")
  public Map<String, Object> root() {

    int value = 5;

    String simpleTernary = value > 3 ? "greater than 3" : "less or equal to 3";

    String nestedTernary =
      value < 0 ? "negative"
      : value == 0 ? "zero"
      : "positive";

    boolean booleanTernary = value % 2 == 0 ? true : false;

    int numericTernary = value > 10 ? 100 : 10;

    String nullCheck;
    String input = null;
    nullCheck = input != null ? input : "default";

    return Map.of(
      "simple_ternary", simpleTernary,
      "nested_ternary", nestedTernary,
      "boolean_ternary", booleanTernary,
      "numeric_ternary", numericTernary,
      "null_check", nullCheck
    );
  }
}
```

---

## Résumé

- opérateur ternaire : `condition ? valeur_si_vrai : valeur_si_faux`
- remplace un `if/else` simple
- peut être imbriqué mais devient vite illisible
- retourne une valeur
- souvent utilisé pour les valeurs par défaut
