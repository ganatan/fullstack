# do-while

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

  @GetMapping("/do-while")
  public Map<String, Object> root() {

    List<Integer> simpleDoWhile = new ArrayList<>();
    int i1 = 0;
    do {
      simpleDoWhile.add(i1);
      i1++;
    } while (i1 < 5);

    List<Integer> executedOnce = new ArrayList<>();
    int i2 = 10;
    do {
      executedOnce.add(i2);
      i2++;
    } while (i2 < 5);

    List<Integer> breakCase = new ArrayList<>();
    int i3 = 0;
    do {
      if (i3 == 3) {
        break;
      }
      breakCase.add(i3);
      i3++;
    } while (true);

    List<Integer> continueCase = new ArrayList<>();
    int i4 = 0;
    do {
      i4++;
      if (i4 % 2 == 0) {
        continue;
      }
      continueCase.add(i4);
    } while (i4 < 6);

    return Map.of(
      "simple_do_while", simpleDoWhile,
      "executed_once", executedOnce,
      "break", breakCase,
      "continue", continueCase
    );
  }
}
```

---

## Résumé

- `do-while` exécute le bloc **au moins une fois**
- la condition est testée **après** l’exécution
- utile quand une action doit toujours se produire
- `break` et `continue` fonctionnent comme dans `while`
