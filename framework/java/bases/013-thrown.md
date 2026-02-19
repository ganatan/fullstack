# Throw – Java pur vs Spring Boot

---

## Version 1 – Java pur

```java
public class Main {

  public static void main(String[] args) {

    // cas sans erreur
    try {
      process(false);
      System.out.println("status : ok");
    } catch (RuntimeException e) {
      System.out.println("status : error");
    }

    // cas avec erreur
    try {
      process(true);
      System.out.println("status : ok");
    } catch (RuntimeException e) {
      System.out.println("status : error");
    }
  }

  private static void process(boolean fail) {
    if (fail) {
      throw new RuntimeException("quelque chose s'est mal passé");
    }
  }
}
```

Résultats :

```
status : ok
status : error
```

---

## Version 2 – Spring Boot

```java
package com.ganatan.starter.api.root;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

  @GetMapping("/thrown")
  public Map<String, Object> root(@RequestParam boolean fail) {
    try {
      process(fail);
      return Map.of("status", "ok");
    } catch (RuntimeException e) {
      return Map.of("status", "error");
    }
  }

  private void process(boolean fail) {
    if (fail) {
      throw new RuntimeException("quelque chose s'est mal passé");
    }
  }
}
```

Résultats :

```
GET /thrown?fail=false  →  { "status": "ok" }
GET /thrown?fail=true   →  { "status": "error" }
```

---

## La logique est identique

| | Java pur | Spring Boot |
|---|---|---|
| Déclenchement | `throw new RuntimeException()` | `throw new RuntimeException()` |
| Capture | `catch (RuntimeException e)` | `catch (RuntimeException e)` |
| Résultat si ok | `System.out.println("ok")` | `return Map.of("status", "ok")` |
| Résultat si error | `System.out.println("error")` | `return Map.of("status", "error")` |

Spring Boot ne change pas le principe du `throw`. Il change uniquement comment on retourne le résultat au client.
