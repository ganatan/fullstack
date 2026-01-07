# RootController

## Objectif

Le `RootController` expose un endpoint HTTP à la racine de l’application.

Il permet :
- de vérifier que l’application Spring Boot démarre correctement
- d’avoir un point d’entrée simple pour les tests (navigateur, curl, healthcheck)
- d’exposer une information minimale de présentation au format JSON

---

## Principe

- URL exposée : /
- Méthode HTTP : GET
- Format de réponse : JSON
- Aucun accès base de données
- Aucun service métier
- Zéro dépendance technique inutile

---

## Implémentation

### Classe

com.ganatan.starter.root.RootController

### Code

```java
package com.ganatan.starter.root;

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

---

## Architecture

```text
starter
├── SpringbootStarterApplication.java
└── root
    └── RootController.java
