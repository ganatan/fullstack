# thrown – Java (principe essentiel)

---

## Code

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
      throw new RuntimeException("error");
    }
  }
}
```

---

## Explications

1. Le paramètre `fail` décide si une exception est déclenchée.
2. `process(fail)` exécute la logique métier.
3. Si `fail=false`, aucune exception n’est levée et le flux continue normalement.
4. Si `fail=true`, l’instruction `throw` est exécutée.
5. À cet instant, l’exception est dite **thrown**.
6. `throw` interrompt immédiatement l’exécution de la méthode courante.
7. Aucune ligne après le `throw` n’est exécutée.
8. L’exception remonte la pile d’appels.
9. Le `catch` dans `root()` intercepte l’exception.
10. L’exception thrown est alors exploitée.
11. Le flux est transformé en réponse contrôlée.
12. Sans `try/catch`, Spring gérerait l’erreur automatiquement.
13. Une exception non capturée stoppe le process.
14. `thrown` n’est pas un mot-clé mais un état logique.
15. Une exception n’a d’intérêt que si elle est capturée ou propagée volontairement.
