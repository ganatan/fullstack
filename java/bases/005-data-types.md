# Java – data types (essentiel)

---

## Code

```java
package com.ganatan.starter.api.root;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

  enum Status {
    CREATED,
    RUNNING,
    FAILED
  }

  record User(String name, int age) {}

  @GetMapping("/data-types")
  public Map<String, Object> root() {

    byte b = 1;
    short s = 2;
    int i = 3;
    long l = 4L;
    float f = 1.5f;
    double d = 2.5;
    char c = 'A';
    boolean bool = true;

    Byte wb = b;
    Short ws = s;
    Integer wi = i;
    Long wl = l;
    Float wf = f;
    Double wd = d;
    Character wc = c;
    Boolean wbool = bool;

    int[] intArray = {1, 2, 3};
    String[] stringArray = {"a", "b"};

    List<String> list = List.of("one", "two");
    Map<String, Integer> map = Map.of("a", 1, "b", 2);

    Optional<String> optional = Optional.of("value");

    BigInteger bigInteger = new BigInteger("123456789");
    BigDecimal bigDecimal = new BigDecimal("123.45");

    UUID uuid = UUID.randomUUID();

    LocalDate date = LocalDate.now();

    Status status = Status.RUNNING;

    User user = new User("Alice", 30);

    return Map.of(
      "primitives", Map.of(
        "byte", b,
        "short", s,
        "int", i,
        "long", l,
        "float", f,
        "double", d,
        "char", String.valueOf(c),
        "boolean", bool
      ),
      "wrappers", Map.of(
        "Byte", wb,
        "Short", ws,
        "Integer", wi,
        "Long", wl,
        "Float", wf,
        "Double", wd,
        "Character", wc,
        "Boolean", wbool
      ),
      "arrays", Map.of(
        "intArray", intArray,
        "stringArray", stringArray
      ),
      "collections", Map.of(
        "list", list,
        "map", map
      ),
      "optional", optional.orElse(null),
      "big_numbers", Map.of(
        "BigInteger", bigInteger,
        "BigDecimal", bigDecimal
      ),
      "uuid", uuid.toString(),
      "date", date.toString(),
      "enum", status.name(),
      "record", user
    );
  }
}
```

---

## Résumé

- Types primitifs : valeurs simples, non objets
- Wrappers : version objet des primitifs
- Tableaux : taille fixe, indexés
- Collections : structures dynamiques
- Optional : gestion explicite de l’absence
- BigInteger / BigDecimal : précision arbitraire
- enum : ensemble fermé de valeurs
- record : objet immuable concis
