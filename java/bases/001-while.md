# while – tous les cas de figure (Java)

Tous les exemples sont exécutables directement dans un contrôleur Spring Boot.

---

## Code

```java
package com.ganatan.starter.api.root;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

  @GetMapping("/")
  public Map<String, Object> root() {

    List<Integer> nominal = new ArrayList<>();
    int i1 = 0;
    while (i1 < 5) {
      nominal.add(i1);
      i1++;
    }

    List<Integer> zeroIteration = new ArrayList<>();
    int i2 = 10;
    while (i2 < 5) {
      zeroIteration.add(i2);
      i2++;
    }

    List<Integer> breakCase = new ArrayList<>();
    int i3 = 0;
    while (true) {
      if (i3 == 3) {
        break;
      }
      breakCase.add(i3);
      i3++;
    }

    List<Integer> continueCase = new ArrayList<>();
    int i4 = 0;
    while (i4 < 6) {
      i4++;
      if (i4 % 2 == 0) {
        continue;
      }
      continueCase.add(i4);
    }

    int i5 = 0;
    int guard = 0;
    while (i5 < 5) {
      guard++;
      if (guard > 50) {
        break;
      }
    }

    List<Integer> decrementCase = new ArrayList<>();
    int i6 = 5;
    while (i6 > 0) {
      decrementCase.add(i6);
      i6--;
    }

    List<Integer> nestedCase = new ArrayList<>();
    int outer = 1;
    while (outer <= 3) {
      int inner = 1;
      while (inner <= 2) {
        nestedCase.add(outer * 10 + inner);
        inner++;
      }
      outer++;
    }

    List<Integer> nullGuardCase = new ArrayList<>();
    List<Integer> maybeNull = null;
    while (maybeNull != null && !maybeNull.isEmpty()) {
      nullGuardCase.add(maybeNull.remove(0));
    }

    return Map.of(
      "application", "springboot-starter",
      "status", "running",
      "java", System.getProperty("java.version"),
      "while_nominal", nominal,
      "while_zeroIteration", zeroIteration,
      "while_break", breakCase,
      "while_continue", continueCase,
      "while_decrement", decrementCase,
      "while_nested", nestedCase,
      "while_null_guard", nullGuardCase
    );
  }
}
```

---

## Principes clés

- while teste la condition avant l’exécution
- 0 itération possible
- break force la sortie
- continue saute la fin de l’itération
- condition composée possible
- boucles imbriquées autorisées
