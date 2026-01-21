# array – Java (essentiel)

---

## Code

```java
package com.ganatan.starter.api.root;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

  @GetMapping("/array")
  public Map<String, Object> root() {

    int[] numbers = { 1, 2, 3, 4, 5 };
    int[] empty = {};

    int size = numbers.length;

    int firstElement = numbers[0];

    int lastElement = numbers[numbers.length - 1];

    boolean isEmpty = empty.length == 0;

    int sum = 0;
    for (int n : numbers) {
      sum += n;
    }

    int[] copy = new int[numbers.length];
    System.arraycopy(numbers, 0, copy, 0, numbers.length);

    return Map.of(
      "size", size,
      "first_element", firstElement,
      "last_element", lastElement,
      "is_empty", isEmpty,
      "sum", sum,
      "copy", copy
    );
  }
}
```

---

## Résumé

- un tableau a une taille fixe définie à l’initialisation
- l’accès se fait par index (`array[index]`)
- `length` permet de connaître la taille
- parcours possible avec `for` ou `for-each`
- copie via `System.arraycopy`
