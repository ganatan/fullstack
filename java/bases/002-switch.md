# switch

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

  @GetMapping("/switch")
  public Map<String, Object> root() {

    int value = 2;

    String classicSwitch;
    switch (value) {
      case 1:
        classicSwitch = "one";
        break;
      case 2:
        classicSwitch = "two";
        break;
      case 3:
        classicSwitch = "three";
        break;
      default:
        classicSwitch = "unknown";
    }

    String fallThrough;
    switch (value) {
      case 1:
      case 2:
        fallThrough = "one or two";
        break;
      default:
        fallThrough = "other";
    }

    String modernSwitch = switch (value) {
      case 1 -> "one";
      case 2 -> "two";
      case 3 -> "three";
      default -> "unknown";
    };

    String multiCaseSwitch = switch (value) {
      case 1, 2, 3 -> "between one and three";
      default -> "out of range";
    };

    int yieldSwitch = switch (value) {
      case 1 -> 10;
      case 2 -> {
        int tmp = 20;
        yield tmp;
      }
      default -> 0;
    };

    return Map.of(
      "classic_switch", classicSwitch,
      "fall_through", fallThrough,
      "modern_switch", modernSwitch,
      "multi_case_switch", multiCaseSwitch,
      "yield_switch", yieldSwitch
    );
  }
}
```

---

## Principes clés

- `switch` classique nécessite `break`
- Sans `break` → fall-through volontaire
- `switch` expression retourne une valeur
- `->` supprime le fall-through
- `yield` permet un bloc multi-lignes
```
